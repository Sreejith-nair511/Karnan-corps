"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { GreenCertificate } from "@/components/green-certificate"
import { YojanaAssistant } from "@/components/yojana-assistant"
import { FuturisticNavbar } from "@/components/futuristic-navbar"
import { Footer } from "@/components/footer"
import { motion } from "framer-motion"
import { SearchIcon, SunIcon, AwardIcon, BotIcon, HomeIcon, LeafIcon, IndianRupeeIcon, GiftIcon, UsersIcon, TrophyIcon } from "lucide-react"
import { TeamCollaborationDashboard } from "@/components/team-collaboration-dashboard"

type Result = {
  detected: boolean
  confidence: number
  capacityKw: number
  siteId: string
}

export default function CitizenPortalPage() {
  const [query, setQuery] = useState("")
  const [result, setResult] = useState<Result | null>(null)

  const onCheck = () => {
    // Mock detector; connect to server later
    const mock: Result = {
      detected: Math.random() > 0.5,
      confidence: 0.72 + Math.random() * 0.25,
      capacityKw: 3 + Math.random() * 4,
      siteId:
        "CIT-" +
        Math.floor(Math.random() * 99999)
          .toString()
          .padStart(5, "0"),
    }
    setResult(mock)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted solar-background">
      <FuturisticNavbar />
      
      <div className="mx-auto max-w-7xl px-4 py-8 grid gap-8 pt-24">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-gradient-to-r from-primary to-secondary shadow-lg">
              <HomeIcon className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-4">
            Citizen Portal
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Check your rooftop status, get a Green Certificate, and redeem rewards
          </p>
        </motion.header>

        {/* Stats Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="glass-card border-primary/20 border-2 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Solar Homes</p>
                  <h3 className="text-xl font-bold">2.4M</h3>
                </div>
                <div className="p-2 rounded-full bg-primary/10">
                  <SunIcon className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card border-primary/20 border-2 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">CO₂ Saved</p>
                  <h3 className="text-xl font-bold">15.2M tons</h3>
                </div>
                <div className="p-2 rounded-full bg-primary/10">
                  <LeafIcon className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card border-primary/20 border-2 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Rewards Distributed</p>
                  <h3 className="text-xl font-bold">₹1.8M</h3>
                </div>
                <div className="p-2 rounded-full bg-primary/10">
                  <IndianRupeeIcon className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card border-primary/20 border-2 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Active Users</p>
                  <h3 className="text-xl font-bold">42.8K</h3>
                </div>
                <div className="p-2 rounded-full bg-primary/10">
                  <GiftIcon className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3">
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="glass-card border-primary/20 border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SearchIcon className="h-5 w-5" />
                  Check Your Home
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-3">
                  <div className="flex gap-3">
                    <Input
                      placeholder="Enter address or lat,lon"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      onClick={onCheck} 
                      className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 futuristic-button"
                    >
                      Check
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Enter your address or coordinates to check if your rooftop has solar panels
                  </p>
                </div>
                
                {result && (
                  <motion.div 
                    className="grid gap-6 md:grid-cols-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card className="p-6 glass-card border-primary/20 border-2">
                      <div className="flex items-center gap-2 mb-4">
                        <SunIcon className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold">Detection Result</h3>
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Status</span>
                          <span className={`font-medium ${result.detected ? 'text-green-500' : 'text-destructive'}`}>
                            {result.detected ? "Solar detected ✅" : "No solar detected ❌"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Confidence</span>
                          <span className="font-medium">{(result.confidence * 100).toFixed(0)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Capacity</span>
                          <span className="font-medium">{result.capacityKw.toFixed(1)} kW</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Site ID</span>
                          <span className="font-mono text-sm">{result.siteId}</span>
                        </div>
                      </div>
                    </Card>
                    
                    {result.detected && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <GreenCertificate
                          siteId={result.siteId}
                          date={new Date().toLocaleDateString()}
                          confidence={(result.confidence * 100).toFixed(0) + "%"}
                          capacityKw={result.capacityKw.toFixed(1)}
                        />
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </CardContent>
            </Card>
            
            <motion.div
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="glass-card border-primary/20 border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AwardIcon className="h-5 w-5" />
                    Your Rewards
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-primary/5">
                    <div>
                      <p className="font-medium">Solar Verification Points</p>
                      <p className="text-sm text-muted-foreground">Earn points for verified installations</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">1,250</p>
                      <p className="text-sm text-muted-foreground">pts</p>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-3">
                    <Button variant="outline" className="flex-1">
                      View History
                    </Button>
                    <Button className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 futuristic-button">
                      Redeem Rewards
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="glass-card h-full border-primary/20 border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BotIcon className="h-5 w-5" />
                  Yojana Assistance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <YojanaAssistant />
                <div className="text-xs text-muted-foreground p-3 rounded-lg bg-muted">
                  <p className="font-medium mb-1">Need help?</p>
                  <p>Ask about PM-Surya Ghar, subsidies, eligibility, documents, etc.</p>
                  <p className="mt-2">Multilingual support: English, Hindi, Malayalam, Tamil.</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Team Collaboration Dashboard - Unique Feature for Competition */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <TeamCollaborationDashboard />
        </motion.div>
      </div>
      
      <Footer />
    </div>
  )
}