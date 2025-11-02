"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { BotIcon, SendIcon, MicIcon, Volume2Icon } from "lucide-react"
import { motion } from "framer-motion"

export function YojanaAssistant() {
  const [lang, setLang] = useState<"en" | "hi" | "ml" | "ta">("en")
  const [prompt, setPrompt] = useState("")
  const [answer, setAnswer] = useState("")
  const [loading, setLoading] = useState(false)

  const onAsk = async () => {
    if (!prompt) return
    setLoading(true)
    setAnswer("")
    try {
      const res = await fetch("/api/assist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ prompt, lang }),
      })
      const data = await res.json()
      setAnswer(data.text ?? "No reply")
    } catch (e) {
      setAnswer("Sorry, an error occurred.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Card className="p-4 glass-card">
        <div className="flex items-center gap-2 mb-4">
          <BotIcon className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Yojana Assistant</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-4">
          <Select value={lang} onValueChange={(v: any) => setLang(v)}>
            <SelectTrigger>
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="hi">हिंदी</SelectItem>
              <SelectItem value="ml">മലയാളം</SelectItem>
              <SelectItem value="ta">தமிழ்</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            onClick={onAsk} 
            disabled={loading}
            className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 futuristic-button"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin"></div>
                Thinking…
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <SendIcon className="h-4 w-4" />
                Ask
              </div>
            )}
          </Button>
        </div>
        
        <div className="relative">
          <Textarea
            rows={3}
            placeholder="Ask about PM-Surya Ghar, subsidies, eligibility, documents, etc."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="pr-12"
          />
          <Button 
            size="icon" 
            variant="ghost" 
            className="absolute right-2 top-2 h-8 w-8"
          >
            <MicIcon className="h-4 w-4" />
          </Button>
        </div>
      </Card>
      
      {answer && (
        <motion.div 
          className="p-4 rounded-lg bg-muted border"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <BotIcon className="h-4 w-4 text-primary" />
              <span className="font-medium">Response</span>
            </div>
            <Button size="icon" variant="ghost" className="h-8 w-8">
              <Volume2Icon className="h-4 w-4" />
            </Button>
          </div>
          <div className="whitespace-pre-wrap text-sm">{answer}</div>
        </motion.div>
      )}
    </div>
  )
}