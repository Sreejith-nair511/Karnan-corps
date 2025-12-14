"use client"

import { useState, useEffect } from "react"
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps"
import { SunIcon, MapPinIcon } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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

// Using local GeoJSON file
const INDIA_GEOJSON = "/data/india-states.geojson"

export function SimpleIndiaMap() {
  const [geoData, setGeoData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchGeoData = async () => {
      try {
        const response = await fetch(INDIA_GEOJSON)
        if (!response.ok) {
          throw new Error(`Failed to fetch GeoJSON: ${response.status} ${response.statusText}`)
        }
        const data = await response.json()
        setGeoData(data)
        setLoading(false)
      } catch (err: any) {
        console.error("Error loading GeoJSON:", err)
        setError(`Failed to load map data: ${err.message}`)
        setLoading(false)
      }
    }

    fetchGeoData()
  }, [])

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center bg-muted rounded-lg">
        <div>Loading map...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-96 flex items-center justify-center bg-destructive/10 rounded-lg">
        <div className="text-destructive text-center p-4">
          <p>Error loading map</p>
          <p className="text-sm mt-2">{error}</p>
        </div>
      </div>
    )
  }

  if (!geoData) {
    return (
      <div className="h-96 flex items-center justify-center bg-muted rounded-lg">
        <div>No map data available</div>
      </div>
    )
  }

  return (
    <div className="rounded-lg overflow-hidden border">
      <TooltipProvider delayDuration={150}>
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 800,
            center: [80, 22]
          }}
          style={{ width: "100%", height: "auto" }}
        >
          <Geographies geography={geoData}>
            {({ geographies }) =>
              geographies.map((geo: any) => (
                <Geography
                  key={geo.properties.name}
                  geography={geo}
                  style={{
                    default: {
                      fill: "#3b82f6",
                      stroke: "#fff",
                      strokeWidth: 0.5,
                      outline: "none",
                    },
                    hover: {
                      fill: "#2563eb",
                      stroke: "#fff",
                      strokeWidth: 0.5,
                      outline: "none",
                      cursor: "pointer",
                    },
                  }}
                />
              ))
            }
          </Geographies>
          
          {/* Solar Installation Markers */}
          {SOLAR_INSTALLATIONS.map((installation) => (
            <Marker key={installation.id} coordinates={installation.coordinates}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <g className="cursor-pointer">
                    <circle r={6} fill="#fbbf24" stroke="#fff" strokeWidth={2} />
                    <circle r={3} fill="#f59e0b" />
                    <SunIcon className="h-3 w-3 text-yellow-600" x={-6} y={-6} />
                  </g>
                </TooltipTrigger>
                <TooltipContent side="top" align="center" className="text-xs">
                  <div className="font-medium">{installation.name}</div>
                  <div className="text-muted-foreground">
                    {installation.location} • {installation.capacity}
                  </div>
                </TooltipContent>
              </Tooltip>
            </Marker>
          ))}
        </ComposableMap>
      </TooltipProvider>
    </div>
  )
}