"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { ClockIcon, CheckCircleIcon } from "lucide-react"

const items = [
  { id: 1, text: "142 rooftops verified today in Kerala", time: "2 min ago", type: "success" },
  { id: 2, text: "78 rooftops verified in Rajasthan", time: "15 min ago", type: "success" },
  { id: 3, text: "District Pune crossed 10,000 verified rooftops", time: "1 hour ago", type: "milestone" },
  { id: 4, text: "Delhi adds 12 MW rooftop capacity this week", time: "3 hours ago", type: "update" },
  { id: 5, text: "New verification model deployed with 15% improved accuracy", time: "5 hours ago", type: "update" },
]

export function ProgressFeed() {
  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 * index }}
        >
          <div className="mt-1">
            {item.type === "success" && (
              <div className="p-1.5 rounded-full bg-green-500/20">
                <CheckCircleIcon className="h-4 w-4 text-green-500" />
              </div>
            )}
            {item.type === "milestone" && (
              <div className="p-1.5 rounded-full bg-primary/20">
                <CheckCircleIcon className="h-4 w-4 text-primary" />
              </div>
            )}
            {item.type === "update" && (
              <div className="p-1.5 rounded-full bg-muted">
                <ClockIcon className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm">{item.text}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="text-xs">
                {item.time}
              </Badge>
              {item.type === "milestone" && (
                <Badge className="text-xs bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30">
                  Milestone
                </Badge>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}