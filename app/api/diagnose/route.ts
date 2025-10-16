import { NextResponse } from "next/server"

export const runtime = "nodejs"

// Small built‑in KB so the API works offline without integrations.
const KB = [
  {
    pest: "Rice Yellow Stem Borer",
    crop: ["rice", "paddy"],
    keywords: ["dead heart", "white head", "borer", "stem", "yellow"],
    weights: { humid: 0.4, vegetative: 0.4 },
    recommendations: {
      bio: [
        "Install pheromone traps @ 4–5/acre",
        "Use Trichogramma egg parasitoids if available",
        "Apply neem seed kernel extract (NSKE) 5%",
      ],
      cultural: [
        "Clip and destroy 'dead hearts' and 'white heads'",
        "Maintain water level and perform field sanitation",
      ],
      predator: ["Conserve spiders, ladybird beetles by avoiding broad-spectrum sprays"],
    },
  },
  {
    pest: "Brown Planthopper",
    crop: ["rice", "paddy"],
    keywords: ["hopper", "hopper burn", "sooty", "honeydew", "wilting"],
    weights: { humid: 0.5, reproductive: 0.3 },
    recommendations: {
      bio: ["Apply neem oil 3% or NSKE 5%", "Set light traps for adults"],
      cultural: ["Avoid excessive nitrogen", "Drain standing water intermittently to reduce humidity"],
      predator: ["Conserve mirid bugs and wolf spiders"],
    },
  },
  {
    pest: "Fall Armyworm",
    crop: ["maize", "corn"],
    keywords: ["whorl", "frass", "chewing", "windowing", "armyworm"],
    weights: { warm: 0.3, vegetative: 0.3 },
    recommendations: {
      bio: ["Apply Bacillus thuringiensis (Bt) @ labelled dose", "Use NPV if available"],
      cultural: ["Crush egg masses and small larvae in whorl", "Use pheromone traps"],
      predator: ["Encourage Trichogramma releases where available"],
    },
  },
  {
    pest: "Aphids",
    crop: ["vegetables", "mustard", "chilli", "brinjal", "cotton"],
    keywords: ["curling", "sticky", "honeydew", "sooty", "clusters"],
    weights: { cool: 0.2, humid: 0.2 },
    recommendations: {
      bio: ["Spray soap solution 1–2% or neem oil 3%"],
      cultural: ["Remove infested shoots", "Avoid excess nitrogen"],
      predator: ["Conserve ladybird beetles and lacewings"],
    },
  },
] as const

function normalize(v: unknown) {
  return typeof v === "string" ? v.trim() : ""
}

function scoreHeuristic({
  crop,
  stage,
  symptoms,
  weather,
}: {
  crop: string
  stage: string
  symptoms: string
  weather: string
}) {
  const lc = crop.toLowerCase()
  const ls = symptoms.toLowerCase()
  const lw = weather.toLowerCase()
  const lstage = stage.toLowerCase()

  let best = { pest: "Unknown", score: 0, reasons: [] as string[], rec: null as any }
  for (const item of KB) {
    let score = 0
    const reasons: string[] = []

    if (item.crop.some((c) => lc.includes(c))) {
      score += 1
      reasons.push(`Crop context suggests ${item.pest}`)
    }

    let kwHits = 0
    for (const k of item.keywords) {
      if (ls.includes(k)) kwHits++
    }
    if (kwHits) {
      score += Math.min(1.5, kwHits * 0.4)
      reasons.push(`${kwHits} symptom keyword(s) matched`)
    }

    // Weather/stage weights
    for (const [k, w] of Object.entries(item.weights || {})) {
      if (k === "humid" && lw.includes("humid")) score += w
      if (k === "warm" && (lw.includes("warm") || lw.includes("hot"))) score += w
      if (k === "cool" && (lw.includes("cool") || lw.includes("cold"))) score += w
      if (k === "vegetative" && lstage.includes("veget")) score += w
      if (k === "reproductive" && lstage.includes("repro")) score += w
    }

    if (score > best.score) {
      best = { pest: item.pest, score, reasons, rec: item.recommendations }
    }
  }

  const confidence = Math.max(0.1, Math.min(0.99, best.score / 3))
  return {
    pest: best.pest,
    confidence: Number(confidence.toFixed(2)),
    reasons: best.reasons,
    recommendations: best.rec || {
      bio: ["Apply neem-based extract 3–5%"],
      cultural: ["Improve drainage and remove infested parts"],
      predator: ["Conserve beneficial insects"],
    },
  }
}

export async function POST(req: Request) {
  try {
    // Defensive body parse
    let body: any = {}
    try {
      body = await req.json()
    } catch {
      body = {}
    }

    const crop = normalize(body?.crop)
    const stage = normalize(body?.stage)
    const symptoms = normalize(body?.symptoms)
    const weather = normalize(body?.weather)
    const soil = normalize(body?.soil)

    const heuristic = scoreHeuristic({ crop, stage, symptoms, weather })

    const payload = {
      diagnosis: {
        pest: heuristic.pest,
        confidence: heuristic.confidence,
        reasons: heuristic.reasons,
      },
      recommendations: heuristic.recommendations,
      mlPrediction: null, // removed optional FS-based model to avoid 500 in Next.js
      aiNotes: [
        `Likely pest: ${heuristic.pest} (confidence ${heuristic.confidence})`,
        `Bio-control: ${heuristic.recommendations.bio[0]}`,
        `Cultural: ${heuristic.recommendations.cultural[0]}`,
      ].join("\n"),
      context: { crop, stage, weather, soil, symptoms },
    }

    console.log("[v0] diagnose payload:", payload)
    return NextResponse.json(payload, { status: 200 })
  } catch (e: any) {
    console.log("[v0] diagnose fatal error:", e?.message || e)
    // Never surface a 500 to the client: return safe fallback
    return NextResponse.json(
      {
        diagnosis: { pest: "Unknown", confidence: 0.1, reasons: [] },
        recommendations: {
          bio: ["Apply neem-based extract 3–5%"],
          cultural: ["Improve drainage and remove infested parts"],
          predator: ["Conserve beneficial insects"],
        },
        mlPrediction: null,
        aiNotes: "Fallback: try neem extract, field sanitation, and conserve predators; recheck symptoms.",
      },
      { status: 200 },
    )
  }
}
