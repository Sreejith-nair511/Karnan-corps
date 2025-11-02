"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { UploadVerificationCSV } from "@/components/upload-verification-csv"
import { cn } from "@/lib/utils"
import { SearchIcon, DownloadIcon, FilterIcon, MapPinIcon, CheckCircleIcon, XCircleIcon, BarChartIcon, EyeIcon, FileBarChartIcon, ZapIcon, LeafIcon, AwardIcon, UsersIcon } from "lucide-react"
import { motion } from "framer-motion"
import { FuturisticNavbar } from "@/components/futuristic-navbar"
import { Footer } from "@/components/footer"

type Row = {
  site_id: string
  district: string
  lat: number
  lon: number
  hasSolar: boolean
  confidence: number
  areaSqm: number
  panelCount: number
  capacityKw: number
  qc: "Verifiable" | "Not Verifiable"
  reviewer: string
  timestamp: string
}

const MOCK: Row[] = [
  {
    site_id: "KER-001",
    district: "Ernakulam",
    lat: 9.98,
    lon: 76.28,
    hasSolar: true,
    confidence: 0.93,
    areaSqm: 24,
    panelCount: 12,
    capacityKw: 4.8,
    qc: "Verifiable",
    reviewer: "AI Model v2.1",
    timestamp: "2025-10-14 09:31 IST"
  },
  {
    site_id: "DL-120",
    district: "South Delhi",
    lat: 28.52,
    lon: 77.21,
    hasSolar: false,
    confidence: 0.14,
    areaSqm: 0,
    panelCount: 0,
    capacityKw: 0,
    qc: "Not Verifiable",
    reviewer: "Manual Review",
    timestamp: "2025-10-13 18:47 IST"
  },
  {
    site_id: "PN-342",
    district: "Pune",
    lat: 18.52,
    lon: 73.86,
    hasSolar: true,
    confidence: 0.81,
    areaSqm: 16,
    panelCount: 8,
    capacityKw: 3.2,
    qc: "Verifiable",
    reviewer: "AI Model v2.1",
    timestamp: "2025-10-14 08:12 IST"
  },
  {
    site_id: "KA-015",
    district: "Bangalore",
    lat: 12.97,
    lon: 77.59,
    hasSolar: true,
    confidence: 0.96,
    areaSqm: 32,
    panelCount: 16,
    capacityKw: 6.4,
    qc: "Verifiable",
    reviewer: "AI Model v2.1",
    timestamp: "2025-10-13 15:22 IST"
  },
  {
    site_id: "TN-078",
    district: "Chennai",
    lat: 13.08,
    lon: 80.27,
    hasSolar: false,
    confidence: 0.08,
    areaSqm: 0,
    panelCount: 0,
    capacityKw: 0,
    qc: "Not Verifiable",
    reviewer: "Manual Review",
    timestamp: "2025-10-13 11:45 IST"
  },
  {
    site_id: "MH-201",
    district: "Mumbai",
    lat: 19.08,
    lon: 72.88,
    hasSolar: true,
    confidence: 0.89,
    areaSqm: 28,
    panelCount: 14,
    capacityKw: 5.6,
    qc: "Verifiable",
    reviewer: "AI Model v2.1",
    timestamp: "2025-10-12 14:22 IST"
  },
  {
    site_id: "GJ-115",
    district: "Ahmedabad",
    lat: 23.02,
    lon: 72.57,
    hasSolar: true,
    confidence: 0.92,
    areaSqm: 30,
    panelCount: 15,
    capacityKw: 6.0,
    qc: "Verifiable",
    reviewer: "AI Model v2.1",
    timestamp: "2025-10-12 11:35 IST"
  },
  {
    site_id: "WB-045",
    district: "Kolkata",
    lat: 22.57,
    lon: 88.36,
    hasSolar: false,
    confidence: 0.11,
    areaSqm: 0,
    panelCount: 0,
    capacityKw: 0,
    qc: "Not Verifiable",
    reviewer: "Manual Review",
    timestamp: "2025-10-11 16:42 IST"
  },
]

export default function VerificationConsolePage() {
  const [query, setQuery] = useState("")
  const [qc, setQc] = useState<"All" | Row["qc"]>("All")
  const [minConf, setMinConf] = useState(0)
  const [sortConfig, setSortConfig] = useState<{ key: keyof Row; direction: 'asc' | 'desc' } | null>(null)

  const rows = useMemo(() => {
    let filteredRows = MOCK.filter((r) => {
      const matchText =
        r.site_id.toLowerCase().includes(query.toLowerCase()) || r.district.toLowerCase().includes(query.toLowerCase())
      const matchQc = qc === "All" ? true : r.qc === qc
      const matchConf = r.confidence >= minConf
      return matchText && matchQc && matchConf
    })
    
    // Apply sorting
    if (sortConfig !== null) {
      filteredRows.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1
        }
        return 0
      })
    }
    
    return filteredRows
  }, [query, qc, minConf, sortConfig])

  // Calculate stats
  const stats = useMemo(() => {
    const total = MOCK.length
    const verifiable = MOCK.filter(r => r.qc === "Verifiable").length
    const notVerifiable = MOCK.filter(r => r.qc === "Not Verifiable").length
    const avgConfidence = MOCK.reduce((sum, r) => sum + r.confidence, 0) / total
    const totalCapacity = MOCK.reduce((sum, r) => sum + r.capacityKw, 0)
    const aiVerified = MOCK.filter(r => r.reviewer.includes("AI")).length
    const manualReviewed = MOCK.filter(r => r.reviewer.includes("Manual")).length
    
    return {
      total,
      verifiable,
      notVerifiable,
      avgConfidence,
      totalCapacity,
      aiVerified,
      manualReviewed
    }
  }, [])

  const requestSort = (key: keyof Row) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted solar-background">
      <FuturisticNavbar />
      
      <div className="mx-auto max-w-7xl px-4 py-8 space-y-8 pt-24">
        <motion.header 
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Verification Console
            </h1>
            <p className="text-muted-foreground mt-2">
              Analyze and verify rooftop solar installations across India
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <UploadVerificationCSV />
            <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 futuristic-button">
              <DownloadIcon className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </motion.header>

        {/* Enhanced Stats Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="glass-card border-primary/20 border-2 hover:shadow-xl transition-all duration-300 lg:col-span-2">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Total Sites</p>
                  <h3 className="text-2xl font-bold">{stats.total}</h3>
                </div>
                <div className="p-3 rounded-full bg-primary/10">
                  <MapPinIcon className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card border-primary/20 border-2 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Verifiable</p>
                  <h3 className="text-xl font-bold text-green-500">{stats.verifiable}</h3>
                </div>
                <div className="p-2 rounded-full bg-green-500/10">
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card border-primary/20 border-2 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Not Verifiable</p>
                  <h3 className="text-xl font-bold text-destructive">{stats.notVerifiable}</h3>
                </div>
                <div className="p-2 rounded-full bg-destructive/10">
                  <XCircleIcon className="h-5 w-5 text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card border-primary/20 border-2 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Avg Confidence</p>
                  <h3 className="text-xl font-bold">{(stats.avgConfidence * 100).toFixed(1)}%</h3>
                </div>
                <div className="p-2 rounded-full bg-primary/10">
                  <BarChartIcon className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card border-primary/20 border-2 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Total Capacity</p>
                  <h3 className="text-xl font-bold">{stats.totalCapacity.toFixed(1)} kW</h3>
                </div>
                <div className="p-2 rounded-full bg-primary/10">
                  <FileBarChartIcon className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card border-primary/20 border-2 hover:shadow-xl transition-all duration-300 lg:col-span-2">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Review Methods</p>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1">
                      <ZapIcon className="h-3 w-3 text-primary" />
                      <span className="text-sm">AI: {stats.aiVerified}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <UsersIcon className="h-3 w-3 text-secondary" />
                      <span className="text-sm">Manual: {stats.manualReviewed}</span>
                    </div>
                  </div>
                </div>
                <div className="p-3 rounded-full bg-primary/10">
                  <EyeIcon className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="glass-card border-primary/20 border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FilterIcon className="h-5 w-5" />
                Filters & Search
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-4">
              <div className="relative md:col-span-2">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search site ID, district, or reviewer..." 
                  value={query} 
                  onChange={(e) => setQuery(e.target.value)} 
                  className="pl-10"
                />
              </div>
              <Select value={qc} onValueChange={(v: any) => setQc(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="QC Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="Verifiable">Verifiable</SelectItem>
                  <SelectItem value="Not Verifiable">Not Verifiable</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="number"
                min={0}
                max={1}
                step="0.01"
                value={minConf}
                onChange={(e) => setMinConf(Number(e.target.value))}
                placeholder="Min confidence (0-1)"
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="glass-card border-primary/20 border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <EyeIcon className="h-5 w-5" />
                Detections
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-muted-foreground">
                  <tr className="[&>th]:py-3 [&>th]:pr-4 [&>th]:font-semibold">
                    <th className="cursor-pointer hover:bg-accent/50" onClick={() => requestSort('site_id')}>
                      Site ID {sortConfig?.key === 'site_id' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                    </th>
                    <th className="cursor-pointer hover:bg-accent/50" onClick={() => requestSort('district')}>
                      District {sortConfig?.key === 'district' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                    </th>
                    <th>Location</th>
                    <th className="cursor-pointer hover:bg-accent/50" onClick={() => requestSort('hasSolar')}>
                      Has Solar {sortConfig?.key === 'hasSolar' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                    </th>
                    <th className="cursor-pointer hover:bg-accent/50" onClick={() => requestSort('confidence')}>
                      Confidence {sortConfig?.key === 'confidence' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                    </th>
                    <th>Area</th>
                    <th>Panels</th>
                    <th className="cursor-pointer hover:bg-accent/50" onClick={() => requestSort('capacityKw')}>
                      Capacity {sortConfig?.key === 'capacityKw' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                    </th>
                    <th className="cursor-pointer hover:bg-accent/50" onClick={() => requestSort('qc')}>
                      QC Status {sortConfig?.key === 'qc' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                    </th>
                    <th className="cursor-pointer hover:bg-accent/50" onClick={() => requestSort('reviewer')}>
                      Reviewer {sortConfig?.key === 'reviewer' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                    </th>
                    <th>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, index) => (
                    <motion.tr 
                      key={r.site_id} 
                      className="border-t [&>td]:py-3 [&>td]:pr-4 hover:bg-accent/50 transition-colors"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.05 * index }}
                    >
                      <td className="font-medium">{r.site_id}</td>
                      <td>{r.district}</td>
                      <td>{r.lat.toFixed(2)}, {r.lon.toFixed(2)}</td>
                      <td>
                        {r.hasSolar ? (
                          <div className="flex items-center gap-1 text-green-500">
                            <CheckCircleIcon className="h-4 w-4" />
                            <span>Yes</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-destructive">
                            <XCircleIcon className="h-4 w-4" />
                            <span>No</span>
                          </div>
                        )}
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-secondary/20 rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${r.confidence * 100}%` }}
                            ></div>
                          </div>
                          <span>{(r.confidence * 100).toFixed(0)}%</span>
                        </div>
                      </td>
                      <td>{r.areaSqm} m²</td>
                      <td>{r.panelCount}</td>
                      <td>{r.capacityKw.toFixed(1)} kW</td>
                      <td>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          r.qc === "Verifiable" 
                            ? "bg-green-500/20 text-green-500" 
                            : "bg-destructive/20 text-destructive"
                        }`}>
                          {r.qc}
                        </span>
                      </td>
                      <td>
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground">
                          {r.reviewer}
                        </span>
                      </td>
                      <td className="text-xs text-muted-foreground">{r.timestamp}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              {rows.length === 0 && (
                <div className="text-center py-10 text-muted-foreground">
                  No verification data found matching your filters
                </div>
              )}
              <div className="mt-6 text-xs text-muted-foreground flex flex-col sm:flex-row justify-between gap-2">
                <div>
                  Showing {rows.length} of {MOCK.length} detections
                </div>
                <div>
                  Click on column headers to sort data
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          className="flex flex-col sm:flex-row items-center justify-end gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Button variant="outline" className="w-full sm:w-auto">
            <DownloadIcon className="mr-2 h-4 w-4" />
            Export JSON
          </Button>
          <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 w-full sm:w-auto futuristic-button">
            <DownloadIcon className="mr-2 h-4 w-4" />
            Export Audit Report
          </Button>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  )
}