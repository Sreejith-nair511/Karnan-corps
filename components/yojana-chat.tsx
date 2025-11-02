"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { generateYojanaAnswer } from "@/lib/yojana-action"

type LangCode =
  | "en" // English
  | "hi" // Hindi
  | "ml" // Malayalam
  | "ta" // Tamil
  | "kn" // Kannada
  | "te" // Telugu
  | "bn" // Bengali
  | "mr" // Marathi
  | "gu" // Gujarati
  | "pa" // Punjabi
  | "or" // Odia
  | "as" // Assamese
  | "ur" // Urdu

export function YojanaChat() {
  const [input, setInput] = useState("")
  const [lang, setLang] = useState<LangCode>("en")
  const [answer, setAnswer] = useState("")
  const [isPending, startTransition] = useTransition()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Yojana Assistant</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <label className="text-sm">Language</label>
          <select
            className="rounded-md border bg-background px-2 py-1 text-sm"
            value={lang}
            onChange={(e) => setLang(e.target.value as LangCode)}
          >
            {/* Indic languages + English */}
            <option value="en">English</option>
            <option value="hi">हिन्दी (Hindi)</option>
            <option value="bn">বাংলা (Bengali)</option>
            <option value="ta">தமிழ் (Tamil)</option>
            <option value="ml">മലയാളം (Malayalam)</option>
            <option value="te">తెలుగు (Telugu)</option>
            <option value="kn">ಕನ್ನಡ (Kannada)</option>
            <option value="mr">मराठी (Marathi)</option>
            <option value="gu">ગુજરાતી (Gujarati)</option>
            <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
            <option value="or">ଓଡ଼ିଆ (Odia)</option>
            <option value="as">অসমীয়া (Assamese)</option>
            <option value="ur">اردو (Urdu)</option>
          </select>
        </div>
        <Textarea
          placeholder="Ask about PM-Surya Ghar, state subsidies, checklists, etc."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button
          onClick={() =>
            startTransition(async () => {
              const res = await generateYojanaAnswer(input, lang)
              setAnswer(res)
            })
          }
          disabled={isPending || !input}
        >
          {isPending ? "Thinking…" : "Ask"}
        </Button>
        {answer && <div className="rounded-md border p-3 text-sm bg-card">{answer}</div>}
      </CardContent>
    </Card>
  )
}
