import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"

export async function POST(req: NextRequest) {
  const { prompt, lang } = await req.json()

  const system = [
    "You are an assistant that helps citizens understand rooftop solar schemes in India.",
    "Keep answers concise and actionable. Include checklists when helpful.",
    "If asked about subsidies, mention PM-Surya Ghar and state variations at a high level.",
    "Translate response to the requested language code if provided: en, hi, ml, ta.",
  ].join(" ")

  const { text } = await generateText({
    model: "openai/gpt-5-mini",
    prompt: `${system}\nLanguage: ${lang || "en"}\nQuestion: ${prompt}\nAnswer:`,
  })

  return NextResponse.json({ text })
}
