"use client"

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { TrophyIcon, AwardIcon, StarIcon, UsersIcon, ZapIcon, LeafIcon, GiftIcon, TargetIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

const barData = [
  { name: "Kerala", verified: 142, points: 860 },
  { name: "Rajasthan", verified: 78, points: 450 },
  { name: "Delhi", verified: 120, points: 710 },
  { name: "Maharashtra", verified: 96, points: 580 },
  { name: "Karnataka", verified: 110, points: 650 },
  { name: "Tamil Nadu", verified: 85, points: 520 },
]

const pieData = [
  { name: "Kerala", value: 35 },
  { name: "Rajasthan", value: 18 },
  { name: "Delhi", value: 22 },
  { name: "Maharashtra", value: 15 },
  { name: "Others", value: 10 },
]

const COLORS = ["hsl(var(--primary))", "hsl(var(--secondary))", "hsl(var(--accent))", "hsl(var(--chart-1))", "hsl(var(--chart-2))"]

const stats = [
  { label: "Total Rewards", value: "₹2.4M", icon: TrophyIcon, change: "+12%" },
  { label: "Active Users", value: "18.5K", icon: UsersIcon, change: "+8%" },
  { label: "Certificates Issued", value: "2.1M", icon: AwardIcon, change: "+15%" },
  { label: "Avg. Points/User", value: "124", icon: StarIcon, change: "+5%" },
]

const badges = [
  { id: 1, name: "Solar Pioneer", icon: ZapIcon, earned: true },
  { id: 2, name: "Eco Warrior", icon: LeafIcon, earned: true },
  { id: 3, name: "Verification Master", icon: TargetIcon, earned: false },
  { id: 4, name: "Community Leader", icon: UsersIcon, earned: true },
  { id: 5, name: "Innovation Champion", icon: GiftIcon, earned: false },
]

export function RewardsDashboard() {
  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <Card className="glass-card hover:shadow-lg transition-shadow border-primary/20 border-2">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                      <p className="text-xs text-green-500 mt-1">{stat.change} from last month</p>
                    </div>
                    <div className="p-3 rounded-full bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="glass-card border-primary/20 border-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AwardIcon className="h-5 w-5 text-primary" />
              Achievement Badges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {badges.map((badge) => {
                const Icon = badge.icon;
                return (
                  <div 
                    key={badge.id}
                    className={`flex flex-col items-center p-4 rounded-xl border-2 ${
                      badge.earned 
                        ? "border-primary/30 bg-primary/5" 
                        : "border-muted bg-muted opacity-50"
                    }`}
                  >
                    <div className={`p-3 rounded-full mb-2 ${
                      badge.earned 
                        ? "bg-primary/10 text-primary" 
                        : "bg-muted text-muted-foreground"
                    }`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-medium text-center">{badge.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {badge.earned ? "Earned" : "Locked"}
                    </p>
                  </div>
                );
              })}
            </div>
            <Button className="w-full mt-4 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
              Redeem Points
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="glass-card border-primary/20 border-2">
            <CardHeader>
              <CardTitle className="text-lg">Verified Households by State</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--background))", 
                      borderColor: "hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                  <Bar dataKey="verified" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="glass-card border-primary/20 border-2">
            <CardHeader>
              <CardTitle className="text-lg">Rewards Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent as number * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--background))", 
                      borderColor: "hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Leaderboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card className="glass-card border-primary/20 border-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrophyIcon className="h-5 w-5 text-primary" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {barData.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                      index === 0 ? "bg-yellow-500/20 text-yellow-500" :
                      index === 1 ? "bg-gray-300/20 text-gray-500" :
                      index === 2 ? "bg-amber-800/20 text-amber-800" :
                      "bg-muted"
                    }`}>
                      {index < 3 ? (
                        <TrophyIcon className="h-4 w-4" />
                      ) : (
                        <span className="text-sm font-medium">{index + 1}</span>
                      )}
                    </div>
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">{item.verified}</p>
                      <p className="text-xs text-muted-foreground">Verified</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{item.points}</p>
                      <p className="text-xs text-muted-foreground">Points</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}