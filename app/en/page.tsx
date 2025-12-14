'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IndiaMap } from "@/components/india-map"
import { SimpleIndiaMap } from "@/components/simple-india-map"
import { HeroStats } from "@/components/hero-stats"
import { ProgressFeed } from "@/components/progress-feed"
import { UploadVerificationCSV } from "@/components/upload-verification-csv"
import { useTranslations } from 'next-intl'
import { LanguageSwitcher } from "@/components/language-switcher"
import { IndiaStats } from "@/components/india-stats"
import { IndiaAlerts } from "@/components/india-alerts"
import { FuturisticNavbar } from "@/components/futuristic-navbar"
import { Footer } from "@/components/footer"
import { motion } from "framer-motion"
import { SunIcon, MapIcon, UploadIcon, UsersIcon, AwardIcon, ZapIcon, LeafIcon, TrophyIcon } from "lucide-react"
import { SolarPredictionDashboard } from "@/components/solar-prediction-dashboard"

export default function HomePage() {
  const t = useTranslations('HomePage');
  const nav = useTranslations('Navigation');
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted solar-background">
      <FuturisticNavbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="mx-auto max-w-7xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h1 
              className="text-4xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              {t('title')}
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              {t('description')}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/verification">
                <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 futuristic-button shadow-xl hover:shadow-2xl transition-all duration-300">
                  <MapIcon className="mr-2 h-5 w-5" />
                  Check Verification
                </Button>
              </Link>
              <Link href="/citizen">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-primary text-primary hover:bg-primary/10 futuristic-button">
                  <UsersIcon className="mr-2 h-5 w-5" />
                  Citizen Portal
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <HeroStats />
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-20 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* India Map - Testing with Simple Map */}
              <Card className="glass-card border-primary/20 border-2 hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <MapIcon className="h-6 w-6" />
                    India Solar Progress Map (Testing)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SimpleIndiaMap />
                </CardContent>
              </Card>

              {/* Original India Map for comparison */}
              <Card className="glass-card border-primary/20 border-2 hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <MapIcon className="h-6 w-6" />
                    India Solar Progress Map (Original)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <IndiaMap />
                </CardContent>
              </Card>

              {/* Solar Prediction Dashboard - Unique Feature for Competition */}
              <SolarPredictionDashboard />

              {/* India Stats */}
              <IndiaStats />
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Upload Verification */}
              <Card className="glass-card border-primary/20 border-2 hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UploadIcon className="h-5 w-5" />
                    {t('uploadVerification.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <UploadVerificationCSV />
                  <p className="text-sm text-muted-foreground">
                    {t('uploadVerification.description')}
                  </p>
                </CardContent>
              </Card>

              {/* Live Progress */}
              <Card className="glass-card border-primary/20 border-2 hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UsersIcon className="h-5 w-5" />
                    {t('liveProgress.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ProgressFeed />
                </CardContent>
              </Card>

              {/* Alerts */}
              <IndiaAlerts />
            </div>
          </div>

          {/* Citizen Portal CTA */}
          <motion.div 
            className="mt-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.0 }}
          >
            <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20 border-2 hover:shadow-xl transition-all duration-300">
              <CardContent className="py-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <AwardIcon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-center md:text-left">
                    <h2 className="text-2xl font-bold mb-2">{t('citizenPortal.title')}</h2>
                    <p className="text-muted-foreground">
                      {t('citizenPortal.description')}
                    </p>
                  </div>
                </div>
                <Link href="/citizen">
                  <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 futuristic-button">
                    {t('getStarted')}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </div>
  )
}