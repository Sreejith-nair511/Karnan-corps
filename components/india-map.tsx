"use client"

import { useMemo, useState } from "react"
import useSWR from "swr"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ComposableMap, Geographies, Geography } from "react-simple-maps"
import { motion } from "framer-motion"
import { InfoIcon, ZapIcon, LeafIcon, AwardIcon, CameraIcon, MapPinIcon } from "lucide-react"

type StateMetric = {
  name: string
  rooftops: number
  capacityMw: number
  co2SavedKt: number
  rewards: number
}

type GeoProperties = {
  name?: string
  NAME_1?: string
  ST_NM?: string
  state?: string
  STATE?: string
}

type GeographyType = {
  rsmKey: string
  properties: GeoProperties
}

type GeographiesType = {
  geographies: GeographyType[]
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

// Public GeoJSON for India states (2019); react-simple-maps will fetch this URL directly.
// If you prefer to self-host, place the file under public/data and reference it relatively.
const INDIA_GEOJSON = "https://cdn.jsdelivr.net/npm/india-atlas@0.1.1/states/india-states-2019.geo.json"

// Sample solar images data
const SOLAR_IMAGES = [
  {
    id: 1,
    src: "/images/WhatsApp Image 2025-12-14 at 7.58.27 PM.jpeg",
    title: "Rooftop Solar Installation",
    location: "Maharashtra",
    capacity: "5.2 MW"
  },
  {
    id: 2,
    src: "/images/WhatsApp Image 2025-12-14 at 7.58.28 PM(1).jpeg",
    title: "Industrial Solar Array",
    location: "Karnataka",
    capacity: "12.8 MW"
  },
  {
    id: 3,
    src: "/images/WhatsApp Image 2025-12-14 at 7.58.28 PM(2).jpeg",
    title: "Residential Solar Setup",
    location: "Tamil Nadu",
    capacity: "2.1 MW"
  },
  {
    id: 4,
    src: "/images/WhatsApp Image 2025-12-14 at 7.58.28 PM.jpeg",
    title: "Community Solar Project",
    location: "Telangana",
    capacity: "8.5 MW"
  }
]

export function IndiaMap() {
  const { data } = useSWR<{ states: StateMetric[] }>("/api/state-stats", fetcher)
  const [hovered, setHovered] = useState<string | null>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const [showImages, setShowImages] = useState(false)

  const stateIndex = useMemo(() => {
    const idx = new Map<string, StateMetric>()
    data?.states.forEach((s) => idx.set(s.name.toLowerCase(), s))
    return idx
  }, [data])

  const [minVal, maxVal] = useMemo(() => {
    if (!data?.states?.length) return [0, 1]
    let min = Number.POSITIVE_INFINITY
    let max = Number.NEGATIVE_INFINITY
    for (const s of data.states) {
      min = Math.min(min, s.rooftops)
      max = Math.max(max, s.rooftops)
    }
    // guard if equal
    if (min === max) return [0, max || 1]
    return [min, max]
  }, [data])

  function getName(props: GeoProperties): string {
    // try common property variants on the geojson
    return props?.name || props?.NAME_1 || props?.ST_NM || props?.state || props?.STATE || "Unknown"
  }

  function getMetric(name: string): StateMetric | undefined {
    return stateIndex.get(name.toLowerCase())
  }

  function getOpacityFor(value: number | undefined) {
    if (value == null || !isFinite(value)) return 0.08
    if (maxVal <= minVal) return 0.4
    const t = (value - minVal) / (maxVal - minVal) // 0..1
    // map to 0.15..0.85 for visual range
    return 0.15 + t * 0.7
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-card border-primary/20 border-2">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <ZapIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Rooftops</p>
                <p className="text-xl font-bold">2.4M</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card border-primary/20 border-2">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <LeafIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">CO₂ Saved</p>
                <p className="text-xl font-bold">15.2M tons</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card border-primary/20 border-2">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <AwardIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Rewards</p>
                <p className="text-xl font-bold">₹2.4B</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card border-primary/20 border-2">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <CameraIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Solar Images</p>
                <p className="text-xl font-bold">240+</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="rounded-xl border bg-muted overflow-hidden shadow-lg glass-card border-primary/20 border-2">
        <div className="aspect-[4/3] rounded-lg overflow-hidden relative">
          <TooltipProvider delayDuration={150}>
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{ scale: 750, center: [80, 22] }}
              style={{ width: "100%", height: "100%" }}
            >
              <Geographies geography={INDIA_GEOJSON}>
                {({ geographies }: GeographiesType) =>
                  geographies.map((geo: GeographyType) => {
                    const n = getName(geo.properties)
                    const m = getMetric(n)
                    const fillOpacity = getOpacityFor(m?.rooftops)
                    const isHovered = hovered === n
                    const isSelected = selected === n
                    return (
                      <Tooltip key={geo.rsmKey}>
                        <TooltipTrigger asChild>
                          <Geography
                            geography={geo}
                            onMouseEnter={() => setHovered(n)}
                            onMouseLeave={() => setHovered((h) => (h === n ? null : h))}
                            onClick={() => setSelected(n)}
                            style={{
                              default: {
                                fill: "url(#gradient)",
                                fillOpacity,
                                stroke: "hsl(var(--border))",
                                strokeWidth: isSelected ? 1.5 : 0.75,
                                outline: "none",
                                transition: "fill-opacity 120ms ease, stroke-width 120ms ease",
                                cursor: "pointer",
                              },
                              hover: {
                                fill: "url(#gradient)",
                                fillOpacity: Math.min(1, fillOpacity + 0.1),
                                stroke: "hsl(var(--primary-foreground))",
                                strokeWidth: 1.25,
                                outline: "none",
                                cursor: "pointer",
                              },
                              pressed: {
                                fill: "url(#gradient)",
                                fillOpacity: Math.min(1, fillOpacity + 0.15),
                                stroke: "hsl(var(--primary-foreground))",
                                strokeWidth: 1.5,
                                outline: "none",
                                cursor: "pointer",
                              },
                            }}
                          />
                        </TooltipTrigger>
                        <TooltipContent side="top" align="center" className="text-xs glass-card border-primary/20 border-2">
                          <div className="font-medium">{n}</div>
                          <div className="text-muted-foreground">
                            {m
                              ? `${m.rooftops.toLocaleString()} rooftops • ${m.capacityMw.toFixed(
                                  1,
                                )} MW • ${m.co2SavedKt.toFixed(1)} kt CO₂ • ₹${(m.rewards || 0).toLocaleString()} rewards`
                              : "No data"}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    )
                  })
                }
              </Geographies>
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(var(--primary))" />
                  <stop offset="100%" stopColor="hsl(var(--secondary))" />
                </linearGradient>
              </defs>
            </ComposableMap>
          </TooltipProvider>
        </div>
      </div>

      {selected && (
        <motion.div 
          className="rounded-xl border p-4 text-sm bg-card glass-card border-primary/20 border-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="font-bold text-lg mb-3 flex items-center gap-2">
            <InfoIcon className="h-5 w-5 text-primary" />
            {selected} Solar Statistics
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {(() => {
              const m = getMetric(selected)
              if (!m) return <div className="col-span-3 text-center py-4">No data available.</div>
              
              return (
                <>
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                    <div className="flex items-center gap-2 mb-1">
                      <ZapIcon className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Rooftops</span>
                    </div>
                    <p className="text-xl font-bold">{m.rooftops.toLocaleString()}</p>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                    <div className="flex items-center gap-2 mb-1">
                      <LeafIcon className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Capacity</span>
                    </div>
                    <p className="text-xl font-bold">{m.capacityMw.toFixed(1)} MW</p>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                    <div className="flex items-center gap-2 mb-1">
                      <AwardIcon className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Rewards</span>
                    </div>
                    <p className="text-xl font-bold">₹{m.rewards.toLocaleString()}</p>
                  </div>
                </>
              )
            })()}
          </div>
          
          {/* Solar Images Gallery for Selected State */}
          <div className="mt-4">
            <button 
              onClick={() => setShowImages(!showImages)}
              className="flex items-center gap-2 text-primary hover:underline mb-2"
            >
              <CameraIcon className="h-4 w-4" />
              {showImages ? "Hide" : "Show"} Solar Installation Images
            </button>
            
            {showImages && (
              <motion.div 
                className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {SOLAR_IMAGES.map((image) => (
                  <div key={image.id} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden border bg-muted flex items-center justify-center">
                      <img 
                        src={image.src} 
                        alt={image.title} 
                        className="object-cover w-full h-full transition-transform group-hover:scale-105"
                      />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-2 truncate">
                      <div className="font-medium">{image.title}</div>
                      <div className="flex items-center gap-1">
                        <MapPinIcon className="h-3 w-3" />
                        {image.location}
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
      
      {/* National Solar Image Gallery */}
      <div className="rounded-xl border p-4 bg-card glass-card border-primary/20 border-2">
        <div className="font-bold text-lg mb-3 flex items-center gap-2">
          <CameraIcon className="h-5 w-5 text-primary" />
          National Solar Installation Gallery
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {SOLAR_IMAGES.map((image) => (
            <div key={image.id} className="group cursor-pointer">
              <div className="aspect-square rounded-lg overflow-hidden border bg-muted flex items-center justify-center relative">
                <img 
                  src={image.src} 
                  alt={image.title} 
                  className="object-cover w-full h-full transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="bg-primary text-primary-foreground rounded-full p-2">
                    <InfoIcon className="h-4 w-4" />
                  </div>
                </div>
              </div>
              <div className="mt-2">
                <div className="font-medium text-sm">{image.title}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPinIcon className="h-3 w-3" />
                  {image.location} • {image.capacity}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-primary/5 border border-primary/10">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-gradient-to-r from-primary to-secondary"></div>
          <span className="text-sm">Higher solar adoption</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-gradient-to-r from-secondary to-muted"></div>
          <span className="text-sm">Lower solar adoption</span>
        </div>
        <div className="text-xs text-muted-foreground">
          Click on any state to view detailed statistics
        </div>
      </div>
    </div>
  )
}