"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, AlertTriangle, CheckCircle, Info, ClockIcon } from "lucide-react";
import { useTranslations } from 'next-intl';
import { motion } from "framer-motion";

export function IndiaAlerts() {
  const t = useTranslations('IndiaAlerts');
  
  // Mock data - in a real app, this would come from an API
  const alerts = [
    {
      id: 1,
      type: "info",
      title: "New Solar Policy Announced",
      description: "The Ministry of New and Renewable Energy has announced new subsidies for residential solar installations in Uttar Pradesh.",
      time: "2 hours ago",
      state: "Uttar Pradesh"
    },
    {
      id: 2,
      type: "success",
      title: "Verification Milestone",
      description: "100,000 rooftops verified across India! Thank you for your participation in the green energy initiative.",
      time: "5 hours ago",
      state: "All India"
    },
    {
      id: 3,
      type: "warning",
      title: "Maintenance Schedule",
      description: "Scheduled maintenance for the verification system in Tamil Nadu on Sunday, 02:00 AM - 04:00 AM IST.",
      time: "1 day ago",
      state: "Tamil Nadu"
    }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case "success": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "warning": return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "info": return <Info className="h-4 w-4 text-blue-500" />;
      default: return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const getVariant = (type: string) => {
    switch (type) {
      case "success": return "outline";
      case "warning": return "destructive";
      case "info": return "secondary";
      default: return "default";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <span>India Solar Alerts</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {alerts.map((alert, index) => (
            <motion.div 
              key={alert.id} 
              className="flex gap-3 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
            >
              <div className="pt-1">
                {getIcon(alert.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <h4 className="font-medium">{alert.title}</h4>
                  <Badge variant={getVariant(alert.type)} className="text-xs">
                    {alert.state}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>
                <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                  <ClockIcon className="h-3 w-3" />
                  <span>{alert.time}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}