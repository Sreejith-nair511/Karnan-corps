"use client"

import { useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Sun, Zap, Leaf } from "lucide-react"

export function HeroStats() {
  const stats = useMemo(
    () => [
      { 
        label: "Rooftops Verified", 
        value: "2,148,392",
        icon: Sun,
        color: "text-primary"
      },
      { 
        label: "Solar Capacity Added", 
        value: "9.6 GW",
        icon: Zap,
        color: "text-secondary"
      },
      { 
        label: "CO₂ Saved", 
        value: "18.2 Mt",
        icon: Leaf,
        color: "text-accent"
      },
    ],
    [],
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((s, index) => {
        const Icon = s.icon;
        return (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * index }}
            whileHover={{ y: -5 }}
          >
            <Card className="glass-card border-0 shadow-lg">
              <CardContent className="py-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Icon className={`h-6 w-6 ${s.color}`} />
                  </div>
                  <div className="text-sm text-muted-foreground">{s.label}</div>
                </div>
                <motion.div 
                  className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 + 0.1 * index }}
                >
                  {s.value}
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}