'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TransparencyLedger } from "@/components/transparency-ledger"
import { DroneVideos } from "@/components/drone-videos"
import { FuturisticNavbar } from "@/components/futuristic-navbar"
import { Footer } from "@/components/footer"
import { motion } from "framer-motion"
import { FileTextIcon, ShieldIcon, EyeIcon } from "lucide-react"

export default function TransparencyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted solar-background">
      <FuturisticNavbar />
      
      <div className="mx-auto max-w-7xl px-4 py-8 space-y-8 pt-24">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Transparency & Audit
          </h1>
          <p className="text-muted-foreground mt-2">
            Immutable verification logs, reviewer notes, and confidence metrics
          </p>
        </motion.header>

        <div className="grid gap-6 md:grid-cols-3">
          <motion.div
            className="md:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileTextIcon className="h-5 w-5" />
                  Public Ledger
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TransparencyLedger />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="glass-card h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <EyeIcon className="h-5 w-5" />
                  Why Classified as Solar?
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-3">
                <div className="flex items-start gap-2">
                  <ShieldIcon className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Rectilinear grid patterns</span>
                </div>
                <div className="flex items-start gap-2">
                  <ShieldIcon className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Mounting structure shadows</span>
                </div>
                <div className="flex items-start gap-2">
                  <ShieldIcon className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>High-reflectance panel signatures</span>
                </div>
                <div className="flex items-start gap-2">
                  <ShieldIcon className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Consistent orientation vs. rooftop edges</span>
                </div>
                <div className="pt-4 border-t text-xs text-muted-foreground">
                  Our AI verification system uses advanced computer vision techniques to ensure accurate detection and classification of solar installations.
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <DroneVideos />
        </motion.div>
      </div>
      
      <Footer />
    </div>
  )
}