'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TransparencyLedger } from "@/components/transparency-ledger"
import { DroneVideos } from "@/components/drone-videos"
import { FuturisticNavbar } from "@/components/futuristic-navbar"
import { Footer } from "@/components/footer"
import { motion } from "framer-motion"
import { FileTextIcon, ShieldIcon, EyeIcon, LockIcon, DatabaseIcon } from "lucide-react"

export default function TransparencyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted solar-background">
      <FuturisticNavbar />
      
      <div className="mx-auto max-w-7xl px-4 py-8 space-y-8 pt-24">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-gradient-to-r from-primary to-secondary shadow-lg">
              <LockIcon className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-4">
            Transparency & Audit
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
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
            <Card className="glass-card border-primary/20 border-2 hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DatabaseIcon className="h-5 w-5" />
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
            <Card className="glass-card h-full border-primary/20 border-2 hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <EyeIcon className="h-5 w-5" />
                  Why Classified as Solar?
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-4">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5">
                  <ShieldIcon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Rectilinear grid patterns</h4>
                    <p className="text-xs text-muted-foreground mt-1">Distinctive geometric patterns of solar panels</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5">
                  <ShieldIcon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Mounting structure shadows</h4>
                    <p className="text-xs text-muted-foreground mt-1">Visible mounting systems and support structures</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5">
                  <ShieldIcon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">High-reflectance panel signatures</h4>
                    <p className="text-xs text-muted-foreground mt-1">Distinctive reflective properties of solar cells</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5">
                  <ShieldIcon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Consistent orientation</h4>
                    <p className="text-xs text-muted-foreground mt-1">Alignment with rooftop edges and optimal sun exposure</p>
                  </div>
                </div>
                <div className="pt-4 border-t text-sm text-muted-foreground">
                  <p className="font-medium mb-2">Advanced AI Verification</p>
                  <p>Our system uses cutting-edge computer vision to ensure 98% accuracy in solar detection.</p>
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