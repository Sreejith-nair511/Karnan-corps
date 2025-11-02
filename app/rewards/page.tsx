'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RewardsDashboard } from "@/components/rewards-dashboard"
import { FuturisticNavbar } from "@/components/futuristic-navbar"
import { Footer } from "@/components/footer"
import { motion } from "framer-motion"

export default function RewardsPage() {
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
            Admin Rewards Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Track verified households, certificates, and leaderboards
          </p>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <RewardsDashboard />
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  )
}