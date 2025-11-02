"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { PlayIcon, PlaneIcon } from "lucide-react"

export function DroneVideos() {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PlaneIcon className="h-5 w-5" />
          Drone Operations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <PlayIcon className="h-4 w-4" />
            Drone Survey Operations
          </h3>
          <div className="relative aspect-video rounded-xl overflow-hidden border bg-muted">
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
              <div className="bg-primary/20 rounded-full p-4 animate-pulse">
                <PlayIcon className="h-8 w-8 text-primary" />
              </div>
            </div>
            <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              VID-20250220-WA0007.mp4
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <PlayIcon className="h-4 w-4" />
            Solar Panel Verification Process
          </h3>
          <div className="relative aspect-video rounded-xl overflow-hidden border bg-muted">
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
              <div className="bg-primary/20 rounded-full p-4 animate-pulse">
                <PlayIcon className="h-8 w-8 text-primary" />
              </div>
            </div>
            <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              VID_20250309_214447.mp4
            </div>
          </div>
        </motion.div>
        
        <motion.div
          className="text-sm text-muted-foreground p-4 rounded-lg bg-muted"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <p>
            Our drone fleet conducts high-resolution aerial surveys to verify rooftop solar installations across India. 
            These autonomous operations ensure accurate detection and measurement of solar panels for transparent verification.
          </p>
          <div className="mt-3 flex items-center gap-2 text-xs">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span>12 drones currently operational</span>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  )
}