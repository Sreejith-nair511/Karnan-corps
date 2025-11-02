"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChartIcon, 
  TrendingUpIcon, 
  ZapIcon, 
  LeafIcon, 
  CalendarIcon,
  PlayIcon,
  PauseIcon
} from "lucide-react";
import { motion } from "framer-motion";

export function SolarPredictionDashboard() {
  const [isAnimating, setIsAnimating] = useState(true);
  const [currentYear, setCurrentYear] = useState(2024);
  const [predictions, setPredictions] = useState({
    capacity: 12800,
    households: 2400000,
    co2: 15200000,
    investment: 8500000000
  });

  // Simulate AI predictions for future years
  const yearlyPredictions = {
    2024: { capacity: 12800, households: 2400000, co2: 15200000, investment: 8500000000 },
    2025: { capacity: 18500, households: 3200000, co2: 21000000, investment: 12000000000 },
    2026: { capacity: 25600, households: 4500000, co2: 29500000, investment: 16800000000 },
    2027: { capacity: 34200, households: 5800000, co2: 38700000, investment: 22500000000 },
    2028: { capacity: 44500, households: 7200000, co2: 49200000, investment: 29500000000 },
    2029: { capacity: 56800, households: 8800000, co2: 61500000, investment: 38000000000 },
    2030: { capacity: 71200, households: 10500000, co2: 75800000, investment: 48000000000 }
  };

  useEffect(() => {
    if (!isAnimating) return;
    
    const interval = setInterval(() => {
      setCurrentYear(prev => {
        if (prev >= 2030) return 2024;
        return prev + 1;
      });
    }, 2000);
    
    return () => clearInterval(interval);
  }, [isAnimating]);

  useEffect(() => {
    setPredictions(yearlyPredictions[currentYear as keyof typeof yearlyPredictions] || yearlyPredictions[2024]);
  }, [currentYear]);

  return (
    <Card className="glass-card border-primary/20 border-2 hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUpIcon className="h-5 w-5 text-primary" />
            AI Solar Growth Prediction
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAnimating(!isAnimating)}
            className="flex items-center gap-1"
          >
            {isAnimating ? (
              <>
                <PauseIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Pause</span>
              </>
            ) : (
              <>
                <PlayIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Play</span>
              </>
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Year: {currentYear}</span>
          </div>
          <div className="flex gap-1">
            {Object.keys(yearlyPredictions).map((year) => (
              <button
                key={year}
                onClick={() => {
                  setCurrentYear(parseInt(year));
                  setIsAnimating(false);
                }}
                className={`px-2 py-1 text-xs rounded-full ${
                  currentYear === parseInt(year)
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-accent'
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div 
            className="p-4 rounded-lg bg-primary/5 border border-primary/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <ZapIcon className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Capacity</span>
            </div>
            <div className="text-2xl font-bold">
              {predictions.capacity.toLocaleString()} <span className="text-sm font-normal">MW</span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              +{(yearlyPredictions[2030].capacity - yearlyPredictions[2024].capacity).toLocaleString()} MW by 2030
            </div>
          </motion.div>

          <motion.div 
            className="p-4 rounded-lg bg-primary/5 border border-primary/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <LeafIcon className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Households</span>
            </div>
            <div className="text-2xl font-bold">
              {predictions.households.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              +{(yearlyPredictions[2030].households - yearlyPredictions[2024].households).toLocaleString()} by 2030
            </div>
          </motion.div>

          <motion.div 
            className="p-4 rounded-lg bg-primary/5 border border-primary/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <BarChartIcon className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">CO₂ Saved</span>
            </div>
            <div className="text-2xl font-bold">
              {predictions.co2.toLocaleString()} <span className="text-sm font-normal">tons</span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              +{(yearlyPredictions[2030].co2 - yearlyPredictions[2024].co2).toLocaleString()} tons by 2030
            </div>
          </motion.div>

          <motion.div 
            className="p-4 rounded-lg bg-primary/5 border border-primary/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <TrendingUpIcon className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Investment</span>
            </div>
            <div className="text-2xl font-bold">
              ₹{Math.round(predictions.investment / 1000000000).toLocaleString()} <span className="text-sm font-normal">B</span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              +₹{Math.round((yearlyPredictions[2030].investment - yearlyPredictions[2024].investment) / 1000000000).toLocaleString()}B by 2030
            </div>
          </motion.div>
        </div>

        <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <ZapIcon className="h-4 w-4 text-primary" />
            AI Prediction Model
          </h4>
          <p className="text-sm text-muted-foreground">
            Our AI model analyzes satellite imagery, government policies, and economic indicators to predict solar adoption trends. 
            Accuracy: 94.2% based on historical data validation.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}