"use client"

import { useMemo, useState, useEffect } from "react"
import useSWR from "swr"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps"
import { motion } from "framer-motion"
import { InfoIcon, ZapIcon, LeafIcon, AwardIcon, CameraIcon, MapPinIcon, SunIcon } from "lucide-react"

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

// Solar installation locations with coordinates
const SOLAR_INSTALLATIONS = [
  {
    id: 1,
    name: "Rooftop Solar Installation",
    location: "Maharashtra",
    coordinates: [75.5, 19.0], // Approximate coordinates for Maharashtra
    capacity: "5.2 MW",
    image: "/images/WhatsApp Image 2025-12-14 at 7.58.27 PM.jpeg"
  },
  {
    id: 2,
    name: "Industrial Solar Array",
    location: "Karnataka",
    coordinates: [76.5, 14.5], // Approximate coordinates for Karnataka
    capacity: "12.8 MW",
    image: "/images/WhatsApp Image 2025-12-14 at 7.58.28 PM(1).jpeg"
  },
  {
    id: 3,
    name: "Residential Solar Setup",
    location: "Tamil Nadu",
    coordinates: [78.5, 11.0], // Approximate coordinates for Tamil Nadu
    capacity: "2.1 MW",
    image: "/images/WhatsApp Image 2025-12-14 at 7.58.28 PM(2).jpeg"
  },
  {
    id: 4,
    name: "Community Solar Project",
    location: "Telangana",
    coordinates: [79.0, 17.5], // Approximate coordinates for Telangana
    capacity: "8.5 MW",
    image: "/images/WhatsApp Image 2025-12-14 at 7.58.28 PM.jpeg"
  }
]

const fetcher = (url: string) => fetch(url).then((r) => r.json())

// Using local GeoJSON file
const INDIA_GEOJSON = "/data/india-states.geojson"

export function IndiaMap() {
  const { data, error, isLoading } = useSWR<{ states: StateMetric[] }>("/api/state-stats", fetcher)
  const [hovered, setHovered] = useState<string | null>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const [showImages, setShowImages] = useState(false)
  const [mapError, setMapError] = useState<string | null>(null)
  const [selectedInstallation, setSelectedInstallation] = useState<typeof SOLAR_INSTALLATIONS[0] | null>(null)

  // Log any errors for debugging
  useEffect(() => {
    if (error) {
      console.error("Error fetching state stats:", error)
      setMapError(`Failed to load data: ${error.message}`)
    }
  }, [error])

  const stateIndex = useMemo(() => {
    const idx = new Map<string, StateMetric>()
    if (data?.states) {
      data.states.forEach((s) => {
        if (s && s.name) {
          idx.set(s.name.toLowerCase(), s)
        }
      })
    }
    return idx
  }, [data])

  const [minVal, maxVal] = useMemo(() => {
    if (!data?.states?.length) return [0, 1]
    let min = Number.POSITIVE_INFINITY
    let max = Number.NEGATIVE_INFINITY
    for (const s of data.states) {
      if (s && typeof s.rooftops === 'number' && isFinite(s.rooftops)) {
        min = Math.min(min, s.rooftops)
        max = Math.max(max, s.rooftops)
      }
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

  // Handle loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="glass-card border-primary/20 border-2">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10 animate-pulse">
                    <div className="h-5 w-5 bg-muted rounded-full"></div>
                  </div>
                  <div>
                    <div className="h-4 w-24 bg-muted rounded mb-2 animate-pulse"></div>
                    <div className="h-6 w-16 bg-muted rounded animate-pulse"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="rounded-xl border bg-muted overflow-hidden shadow-lg glass-card border-primary/20 border-2 h-96 flex items-center justify-center">
          <div className="text-muted-foreground">Loading map...</div>
        </div>
      </div>
    )
  }

  // Handle error state
  if (error || mapError) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="glass-card border-primary/20 border-2 col-span-4">
            <CardContent className="p-4">
              <div className="text-destructive text-center">
                Error loading map data. Please try refreshing the page.
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="rounded-xl border bg-muted overflow-hidden shadow-lg glass-card border-primary/20 border-2 h-96 flex items-center justify-center">
          <div className="text-destructive text-center">
            <p>Failed to load India map data</p>
            <p className="text-sm mt-2">Error: {error?.message || mapError}</p>
          </div>
        </div>
      </div>
    )
  }

  // Handle case when no data is available
  if (!data || !data.states || data.states.length === 0) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="glass-card border-primary/20 border-2 col-span-4">
            <CardContent className="p-4">
              <div className="text-muted-foreground text-center">
                No map data available at the moment.
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="rounded-xl border bg-muted overflow-hidden shadow-lg glass-card border-primary/20 border-2 h-96 flex items-center justify-center">
          <div className="text-muted-foreground text-center">
            <p>Map data is temporarily unavailable.</p>
            <p className="text-sm mt-2">Please check back later.</p>
          </div>
        </div>
      </div>
    )
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
                <p className="text-sm text-muted-foreground">Solar Installations</p>
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
              projectionConfig={{ 
                scale: 800, 
                center: [80, 22]
              }}
              style={{ width: "100%", height: "100%" }}
            >
              <ZoomableGroup>
                <Geographies geography={INDIA_GEOJSON}>
                  {({ geographies }: GeographiesType) =>
                    geographies.map((geo: GeographyType) => {
                      // Skip rendering if geometry is invalid
                      if (!geo || !geo.properties?.name) {
                        return null
                      }
                      
                      const n = getName(geo.properties)
                      const m = getMetric(n)
                      const fillOpacity = getOpacityFor(m?.rooftops)
                      const isHovered = hovered === n
                      const isSelected = selected === n
                      
                      return (
                        <Tooltip key={geo.properties.name}>
                          <TooltipTrigger asChild>
                            <Geography
                              geography={geo}
                              onMouseEnter={() => setHovered(n)}
                              onMouseLeave={() => setHovered((h) => (h === n ? null : h))}
                              onClick={() => setSelected(n)}
                              style={{
                                default: {
                                  fill: "#3b82f6", // blue-500 as fallback
                                  fillOpacity,
                                  stroke: "#cbd5e1", // slate-300
                                  strokeWidth: isSelected ? 1.5 : 0.75,
                                  outline: "none",
                                  transition: "fill-opacity 120ms ease, stroke-width 120ms ease",
                                  cursor: "pointer",
                                },
                                hover: {
                                  fill: "#2563eb", // blue-600
                                  fillOpacity: Math.min(1, fillOpacity + 0.1),
                                  stroke: "#1d4ed8", // blue-700
                                  strokeWidth: 1.25,
                                  outline: "none",
                                  cursor: "pointer",
                                },
                                pressed: {
                                  fill: "#1d4ed8", // blue-700
                                  fillOpacity: Math.min(1, fillOpacity + 0.15),
                                  stroke: "#1e40af", // blue-800
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
                                ? `${(m.rooftops || 0).toLocaleString()} rooftops • ${(m.capacityMw || 0).toFixed(1)} MW • ${(m.co2SavedKt || 0).toFixed(1)} kt CO₂ • ₹${(m.rewards || 0).toLocaleString()} rewards`
                                : "No data"}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      )
                    })
                  }
                </Geographies>
                
                {/* Solar Installation Markers */}
                {SOLAR_INSTALLATIONS.map((installation) => (
                  <Marker key={installation.id} coordinates={installation.coordinates}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <g 
                          className="cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedInstallation(installation);
                          }}
                        >
                          <circle r={8} fill="#fbbf24" stroke="#fff" strokeWidth={2} />
                          <circle r={4} fill="#f59e0b" />
                          <SunIcon className="h-4 w-4 text-yellow-600" x={-8} y={-8} />
                        </g>
                      </TooltipTrigger>
                      <TooltipContent side="top" align="center" className="text-xs glass-card border-primary/20 border-2">
                        <div className="font-medium">{installation.name}</div>
                        <div className="text-muted-foreground">
                          {installation.location} • {installation.capacity}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </Marker>
                ))}
              </ZoomableGroup>
            </ComposableMap>
          </TooltipProvider>
        </div>
      </div>

      {/* Solar Installation Detail Modal */}
      {selectedInstallation && (
        <motion.div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedInstallation(null)}
        >
          <motion.div 
            className="bg-card rounded-xl border border-primary/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">{selectedInstallation.name}</h3>
                <button 
                  onClick={() => setSelectedInstallation(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="aspect-video rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                    <img 
                      src={selectedInstallation.image} 
                      alt={selectedInstallation.name}
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder.jpg";
                      }}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-lg flex items-center gap-2">
                      <MapPinIcon className="h-5 w-5 text-primary" />
                      Location
                    </h4>
                    <p>{selectedInstallation.location}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-lg flex items-center gap-2">
                      <ZapIcon className="h-5 w-5 text-primary" />
                      Capacity
                    </h4>
                    <p>{selectedInstallation.capacity}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-lg flex items-center gap-2">
                      <LeafIcon className="h-5 w-5 text-primary" />
                      Environmental Impact
                    </h4>
                    <p>Estimated CO₂ savings: {(parseFloat(selectedInstallation.capacity) * 0.5).toFixed(1)} tons/year</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

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
                    <p className="text-xl font-bold">{(m.rooftops || 0).toLocaleString()}</p>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                    <div className="flex items-center gap-2 mb-1">
                      <LeafIcon className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Capacity</span>
                    </div>
                    <p className="text-xl font-bold">{(m.capacityMw || 0).toFixed(1)} MW</p>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                    <div className="flex items-center gap-2 mb-1">
                      <AwardIcon className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Rewards</span>
                    </div>
                    <p className="text-xl font-bold">₹{(m.rewards || 0).toLocaleString()}</p>
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
                {SOLAR_INSTALLATIONS.filter(installation => 
                  installation.location === selected
                ).map((installation) => (
                  <div 
                    key={installation.id} 
                    className="relative group cursor-pointer"
                    onClick={() => setSelectedInstallation(installation)}
                  >
                    <div className="aspect-square rounded-lg overflow-hidden border bg-muted flex items-center justify-center">
                      <img 
                        src={installation.image} 
                        alt={installation.name} 
                        className="object-cover w-full h-full transition-transform group-hover:scale-105"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder.jpg";
                        }}
                      />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-2 truncate">
                      <div className="font-medium">{installation.name}</div>
                      <div className="flex items-center gap-1">
                        <MapPinIcon className="h-3 w-3" />
                        {installation.capacity}
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
          {SOLAR_INSTALLATIONS.map((installation) => (
            <div 
              key={installation.id} 
              className="group cursor-pointer"
              onClick={() => setSelectedInstallation(installation)}
            >
              <div className="aspect-square rounded-lg overflow-hidden border bg-muted flex items-center justify-center relative">
                <img 
                  src={installation.image} 
                  alt={installation.name} 
                  className="object-cover w-full h-full transition-transform group-hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.jpg";
                  }}
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="bg-primary text-primary-foreground rounded-full p-2">
                    <InfoIcon className="h-4 w-4" />
                  </div>
                </div>
              </div>
              <div className="mt-2">
                <div className="font-medium text-sm">{installation.name}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPinIcon className="h-3 w-3" />
                  {installation.location} • {installation.capacity}
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