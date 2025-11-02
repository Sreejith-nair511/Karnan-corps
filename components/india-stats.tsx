"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Sun, MapPin, Users, Zap } from "lucide-react";
import { useTranslations } from 'next-intl';
import { motion } from "framer-motion";

export function IndiaStats() {
  const t = useTranslations('IndiaStats');
  
  // Mock data - in a real app, this would come from an API
  const stats = {
    totalRooftops: 125430,
    totalCapacity: 456.7,
    co2Saved: 345.2,
    statesCovered: 22,
    topStates: [
      { name: "Karnataka", rooftops: 24500, capacity: 89.4 },
      { name: "Tamil Nadu", rooftops: 19800, capacity: 72.1 },
      { name: "Gujarat", rooftops: 18750, capacity: 68.3 },
      { name: "Maharashtra", rooftops: 16500, capacity: 60.1 },
      { name: "Rajasthan", rooftops: 14200, capacity: 51.7 }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { 
            icon: Sun, 
            value: stats.totalRooftops.toLocaleString(), 
            label: "Rooftops Verified",
            color: "text-primary"
          },
          { 
            icon: Zap, 
            value: `${stats.totalCapacity.toFixed(1)} MW`, 
            label: "Total Capacity",
            color: "text-secondary"
          },
          { 
            icon: MapPin, 
            value: stats.statesCovered, 
            label: "States Covered",
            color: "text-accent"
          },
          { 
            icon: Users, 
            value: `${stats.co2Saved.toFixed(1)} kt`, 
            label: "CO₂ Saved",
            color: "text-green-500"
          }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <Card className="glass-card">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div>
                    <div className="text-xl font-bold">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Top States by Solar Adoption
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topStates.map((state, index) => (
                <motion.div 
                  key={state.name} 
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                >
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="rounded-full w-6 h-6 p-0 justify-center">
                      {index + 1}
                    </Badge>
                    <span className="font-medium">{state.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{state.rooftops.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">{state.capacity.toFixed(1)} MW</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}