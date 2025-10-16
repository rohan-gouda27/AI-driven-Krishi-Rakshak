export type NaturalStep = {
  title: string
  detail: string
  timing: string
  category: "bio" | "cultural" | "predator"
}

type PestEntry = {
  keywords: string[] // symptom & context keywords
  natural: NaturalStep[]
}

type CropKB = {
  pests: Record<string, PestEntry>
}

export const knowledgeBase: Record<string, CropKB> = {
  Rice: {
    pests: {
      "Brown Planthopper": {
        keywords: ["hopper", "honeydew", "sooty", "wilting", "hopperburn", "lower stem", "nymph"],
        natural: [
          {
            title: "Neem seed kernel extract 5%",
            detail: "Spray NSKE @ 50 ml/L covering lower canopy and stem base.",
            timing: "Repeat in 7–10 days",
            category: "bio",
          },
          {
            title: "Maintain field drainage",
            detail: "Avoid standing water; alternate wetting and drying to reduce hopper habitat.",
            timing: "Continuous during outbreak",
            category: "cultural",
          },
          {
            title: "Conserve spiders & mirid bugs",
            detail: "Avoid broad-spectrum chemicals; keep bund vegetation to harbor predators.",
            timing: "Season-long",
            category: "predator",
          },
        ],
      },
      "Stem Borer": {
        keywords: ["deadheart", "whitehead", "borer", "holes", "grub", "tunnel", "stem", "larva"],
        natural: [
          {
            title: "Trichogramma release",
            detail: "Release T. japonicum @ 50,000/ha via tricho-cards near water channels.",
            timing: "Weekly releases for 4 weeks from tillering",
            category: "predator",
          },
          {
            title: "Pheromone traps",
            detail: "Install 12 traps/ha; replace lures every 3–4 weeks. Monitor moth catch.",
            timing: "Vegetative to booting stage",
            category: "cultural",
          },
          {
            title: "Bt spray (Bacillus thuringiensis)",
            detail: "Apply Bt @ label dose during early larval stages for maximum efficacy.",
            timing: "At first moth catch or egg mass detection",
            category: "bio",
          },
        ],
      },
      "Leaf Folder": {
        keywords: ["leaf fold", "rolled leaf", "caterpillar", "folded", "tube", "green caterpillar"],
        natural: [
          {
            title: "Neem oil 3ml/L",
            detail: "Spray neem oil + soap solution in early morning or evening.",
            timing: "Repeat every 7 days until infestation drops",
            category: "bio",
          },
          {
            title: "Hand collection and destruction",
            detail: "Manually pick folded leaves with caterpillars; dispose in soapy water.",
            timing: "Daily inspections during peak",
            category: "cultural",
          },
          {
            title: "Bird perches",
            detail: "Install bamboo perches @ 20/ha to attract insectivorous birds.",
            timing: "Install before tillering",
            category: "predator",
          },
        ],
      },
    },
  },
  Wheat: {
    pests: {
      Aphids: {
        keywords: ["aphid", "curling", "sticky", "honeydew", "ants", "soft-bodied", "green aphid", "cluster"],
        natural: [
          {
            title: "Neem oil 3ml/L",
            detail: "Spray in morning/evening to avoid phytotoxicity. Target leaf undersides.",
            timing: "Repeat every 7 days",
            category: "bio",
          },
          {
            title: "Ladybird beetle release & conservation",
            detail: "Conserve or release Coccinella predators; avoid synthetic pyrethroids.",
            timing: "As soon as aphids spotted",
            category: "predator",
          },
          {
            title: "Trap crops (mustard strips)",
            detail: "Plant mustard border rows to attract aphids away from main wheat crop.",
            timing: "At sowing time",
            category: "cultural",
          },
        ],
      },
      Armyworm: {
        keywords: ["armyworm", "caterpillar", "defoliation", "cut stem", "marching", "army", "leaf damage"],
        natural: [
          {
            title: "NPV (Nuclear Polyhedrosis Virus)",
            detail: "Apply NPV @ 250 LE/ha in evening; add jaggery for better sticking.",
            timing: "Early larval instars (2nd–3rd)",
            category: "bio",
          },
          {
            title: "Light traps",
            detail: "Install light traps @ 1/ha to monitor and mass-trap adult moths.",
            timing: "From tillering stage onwards",
            category: "cultural",
          },
          {
            title: "Bird perches",
            detail: "Bamboo or wooden perches for insectivorous birds like mynas.",
            timing: "Install early season",
            category: "predator",
          },
        ],
      },
    },
  },
  Cotton: {
    pests: {
      "Pink Bollworm": {
        keywords: ["boll", "pink", "larva", "webbing", "damaged bolls", "rosette flower", "exit hole"],
        natural: [
          {
            title: "Pheromone mass trapping",
            detail: "Install 20 traps/ha with PBW lures; monitor male catch weekly.",
            timing: "From squaring stage to boll maturity",
            category: "cultural",
          },
          {
            title: "Bt formulation spray",
            detail: "Spray Bt @ recommended dose targeting early instars inside buds/bolls.",
            timing: "At initial detection or 10% flower damage",
            category: "bio",
          },
          {
            title: "Sterile Insect Technique (pilot)",
            detail: "Coordinate with extension for sterile male release if program available.",
            timing: "Program-based mass release",
            category: "predator",
          },
        ],
      },
      Whitefly: {
        keywords: ["whitefly", "tiny white", "leaf curl", "honeydew", "sooty mold", "yellow leaves"],
        natural: [
          {
            title: "Neem oil + yellow sticky traps",
            detail: "Spray neem 5ml/L; hang 8–10 yellow traps/ha to monitor and trap adults.",
            timing: "Weekly sprays; replace traps every 2 weeks",
            category: "bio",
          },
          {
            title: "Avoid water stress",
            detail: "Maintain optimal soil moisture; whiteflies thrive on stressed plants.",
            timing: "Throughout season",
            category: "cultural",
          },
          {
            title: "Conserve parasitoids (Encarsia)",
            detail: "Avoid harsh chemicals; Encarsia wasps parasitize whitefly nymphs.",
            timing: "Season-long conservation",
            category: "predator",
          },
        ],
      },
    },
  },
  Tomato: {
    pests: {
      "Fruit Borer": {
        keywords: ["holes on fruit", "borer", "larva", "frass", "tomato fruit", "caterpillar entry"],
        natural: [
          {
            title: "HaNPV or Bt spray",
            detail: "Apply HaNPV @ 250 LE/ha or Bt @ label rates with good fruit coverage.",
            timing: "Early fruiting stage; repeat every 10 days",
            category: "bio",
          },
          {
            title: "Hand picking & fruit destruction",
            detail: "Remove infested fruits; bury deep or burn to kill larvae inside.",
            timing: "Daily inspections for a week",
            category: "cultural",
          },
          {
            title: "Trichogramma release",
            detail: "Release T. pretiosum or T. chilonis @ 50,000/ha/week on cards.",
            timing: "3–4 weekly releases from flowering",
            category: "predator",
          },
        ],
      },
      "Leaf Miner": {
        keywords: ["serpentine mine", "leaf tunnel", "white trail", "miner", "blotch mine"],
        natural: [
          {
            title: "Neem seed extract 5%",
            detail: "Spray NSKE to deter adult oviposition and affect larval feeding.",
            timing: "Every 7–10 days during peak",
            category: "bio",
          },
          {
            title: "Remove infested leaves",
            detail: "Prune and destroy heavily mined leaves to reduce larval population.",
            timing: "Weekly sanitation",
            category: "cultural",
          },
          {
            title: "Conserve parasitoid wasps",
            detail: "Diglyphus and Opius wasps parasitize leaf miner larvae; avoid broad chemicals.",
            timing: "Season-long",
            category: "predator",
          },
        ],
      },
    },
  },
  Maize: {
    pests: {
      "Fall Armyworm": {
        keywords: ["armyworm", "fall", "whorl", "caterpillar", "defoliation", "young larva", "FAW"],
        natural: [
          {
            title: "Spray Bt or NPV",
            detail: "Apply Bt or NPV in whorl; add surfactant for penetration.",
            timing: "Early instars (1st–3rd); evening application",
            category: "bio",
          },
          {
            title: "Sand/ash in whorl",
            detail: "Apply fine sand or wood ash in whorl to desiccate small larvae.",
            timing: "At first sign of whorl feeding",
            category: "cultural",
          },
          {
            title: "Egg parasitoids (Telenomus, Trichogramma)",
            detail: "Conserve or release egg parasitoids; avoid early-season insecticides.",
            timing: "Season-long conservation",
            category: "predator",
          },
        ],
      },
    },
  },
}

/**
 * Simple heuristic matcher scoring by keyword hits in symptoms + context.
 * Improved scoring logic with stage weighting and partial match support
 */
export function matchPests(input: { crop: string; stage: string; symptoms: string; weather: string; soil: string }) {
  const txt = `${input.symptoms} ${input.weather} ${input.soil}`.toLowerCase()
  const crop = input.crop in knowledgeBase ? input.crop : Object.keys(knowledgeBase)[0]
  const pests = knowledgeBase[crop].pests
  const scored = Object.entries(pests).map(([pest, entry]) => {
    const hits = entry.keywords.reduce((s, k) => (txt.includes(k.toLowerCase()) ? s + 1 : s), 0)
    // Bonus for stage-specific matches
    const stageBonus = input.stage.toLowerCase().includes("vegetative") && /leaf|hopper|borer/.test(txt) ? 0.3 : 0
    const weatherBonus = /humid|rain|wet/.test(txt) && /hopper|aphid|whitefly/.test(pest.toLowerCase()) ? 0.2 : 0
    const score = Math.min(1, (hits / Math.max(3, entry.keywords.length)) * 1.2 + stageBonus + weatherBonus)
    return { crop, pest, score }
  })
  return scored.sort((a, b) => b.score - a.score)
}
