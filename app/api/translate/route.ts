// Translate guidance into the requested local language for on-device voice playback aid.
import { NextResponse } from "next/server"
import { generateText } from "ai"

export async function POST(req: Request) {
  // Defensive body parsing to avoid 500s on bad JSON
  let body: any = {}
  try {
    body = await req.json()
  } catch {
    body = {}
  }

  const rawText = typeof body?.text === "string" ? body.text : ""
  const targetLang = typeof body?.targetLang === "string" && body.targetLang.trim() ? body.targetLang : "hi-IN"

  // Empty input: return early with empty translation to keep UI responsive
  if (!rawText.trim()) {
    return NextResponse.json({ text: "" }, { status: 200 })
  }

  try {
    // The AI SDK uses Vercel AI Gateway by default. If you add OPENAI_API_KEY in Vars,
    // it will be used automatically for "openai/*" models.
    const { text: out } = await generateText({
      model: "openai/gpt-5-mini",
      prompt: `Translate the following agricultural instructions into ${targetLang}. Keep steps clear and short:\n\n${rawText}`,
    })
    return NextResponse.json({ text: out }, { status: 200 })
  } catch (err) {
    // Graceful fallback: return original text so TTS can still run in chosen language/voice
    return NextResponse.json({ text: rawText }, { status: 200 })
  }
}
