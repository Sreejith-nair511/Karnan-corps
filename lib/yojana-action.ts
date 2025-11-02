"use server"

import { generateText } from "ai"

type LangCode = "en" | "hi" | "ml" | "ta" | "kn" | "te" | "bn" | "mr" | "gu" | "pa" | "or" | "as" | "ur"

export async function generateYojanaAnswer(prompt: string, lang: LangCode) {
  const system = `You are a helpful Yojana assistant for rooftop solar in India. Reply strictly in the language corresponding to ISO code: ${lang}. Be concise, provide actionable steps, eligibility, subsidy details, and useful links if relevant.`
  const { text } = await generateText({
    model: "openai/gpt-5-mini",
    prompt: `${system}\n\nUser: ${prompt}\nAssistant:`,
  })
  return text
}
