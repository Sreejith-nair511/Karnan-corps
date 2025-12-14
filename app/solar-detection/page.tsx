'use client'

import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { FuturisticNavbar } from "@/components/futuristic-navbar"
import { Footer } from "@/components/footer"
import { motion } from "framer-motion"
import { 
  UploadIcon, 
  SunIcon, 
  ZapIcon, 
  LeafIcon, 
  EyeIcon, 
  DownloadIcon,
  PlayIcon,
  FileImageIcon,
  CheckIcon,
  XIcon,
  BrainIcon,
  DroneIcon,
  GaugeIcon
} from "lucide-react"

export default function SolarDetectionPage() {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<any>(null)
  const [modelType, setModelType] = useState('mistral') // Default to Mistral
  const [coordinates, setCoordinates] = useState({ lat: '', lon: '' })
  const [sampleId, setSampleId] = useState('')
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Model accuracy data
  const modelAccuracy = {
    mistral: {
      name: "Karnana Model",
      accuracy: 94.2,
      precision: 92.8,
      recall: 95.1,
      f1_score: 93.9
    },
    unet: {
      name: "U-Net Segmentation",
      accuracy: 89.5,
      precision: 87.2,
      recall: 91.3,
      f1_score: 89.2
    },
    yolov5: {
      name: "YOLOv5 Detection",
      accuracy: 91.7,
      precision: 90.1,
      recall: 93.2,
      f1_score: 91.6
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      // Create preview
      const url = URL.createObjectURL(selectedFile)
      setPreviewUrl(url)
      setError(null)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile && ['image/jpeg', 'image/png', 'image/tiff'].includes(droppedFile.type)) {
      setFile(droppedFile)
      const url = URL.createObjectURL(droppedFile)
      setPreviewUrl(url)
      setError(null)
    }
  }

  const handleDetect = async () => {
    if (!file || !coordinates.lat || !coordinates.lon || !sampleId) {
      setError('Please fill in all required fields')
      return
    }

    // Validate coordinates
    const lat = parseFloat(coordinates.lat)
    const lon = parseFloat(coordinates.lon)
    if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      setError('Please enter valid coordinates')
      return
    }

    setIsProcessing(true)
    setProgress(0)
    setResults(null)
    setError(null)

    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval)
          return 90
        }
        return prev + 10
      })
    }, 300)

    try {
      // Create FormData for the API request
      const formData = new FormData()
      formData.append('image', file)
      formData.append('sample_id', sampleId)
      formData.append('lat', coordinates.lat)
      formData.append('lon', coordinates.lon)
      formData.append('model_type', modelType)

      // Call the backend API
      const response = await fetch('/api/v1/solar/detect', {
        method: 'POST',
        body: formData,
      })

      clearInterval(interval)
      setProgress(100)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Detection failed')
      }

      const data = await response.json()
      
      // Format results for display
      const formattedResults = {
        hasSolar: data.has_solar,
        confidence: data.confidence ? (data.confidence * 100).toFixed(1) : '0.0',
        panelCount: data.panel_count_est || 0,
        area: data.pv_area_sqm_est ? data.pv_area_sqm_est.toFixed(1) : '0.0',
        capacity: data.capacity_kw_est ? data.capacity_kw_est.toFixed(1) : '0.0',
        co2Offset: data.capacity_kw_est ? (data.capacity_kw_est * 0.85).toFixed(1) : '0.0',
        explanation: data.bbox_or_mask?.data || '',
        modelInfo: modelAccuracy[modelType as keyof typeof modelAccuracy] || modelAccuracy.mistral
      }
      
      setResults(formattedResults)
      setIsProcessing(false)
    } catch (error: any) {
      console.error('Detection failed:', error)
      clearInterval(interval)
      setIsProcessing(false)
      setProgress(0)
      setError(error.message || 'Detection failed. Please try again.')
    }
  }

  const handleExport = (format: string) => {
    if (!results) return
    
    let dataToExport: any
    let filename: string
    
    if (format === 'json') {
      dataToExport = JSON.stringify(results, null, 2)
      filename = `solar_detection_${sampleId}.json`
    } else {
      // CSV format
      const csvContent = `Sample ID,Has Solar,Confidence (%),Panel Count,Area (m²),Capacity (kW),CO₂ Offset (tons/year),Model Used\n${sampleId},${results.hasSolar},${results.confidence},${results.panelCount},${results.area},${results.capacity},${results.co2Offset},${results.modelInfo.name}`
      dataToExport = csvContent
      filename = `solar_detection_${sampleId}.csv`
    }
    
    // Create download link
    const blob = new Blob([dataToExport], { type: format === 'json' ? 'application/json' : 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted solar-background">
      <FuturisticNavbar />
      
      <div className="mx-auto max-w-7xl px-4 py-8 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-4">
            Solar Panel Detection
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Upload aerial or satellite images to automatically detect, segment, and measure rooftop solar panels using AI
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload and Controls */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="glass-card border-primary/20 border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UploadIcon className="h-5 w-5" />
                  Upload Image
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Error Message */}
                {error && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive text-destructive text-sm">
                    {error}
                  </div>
                )}

                {/* File Upload */}
                <div 
                  className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".jpg,.jpeg,.png,.tiff,.tif"
                  />
                  <div className="flex flex-col items-center gap-3">
                    <FileImageIcon className="h-10 w-10 text-muted-foreground" />
                    <div>
                      <p className="font-medium">
                        {file ? file.name : 'Click to upload or drag and drop'}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        JPG, PNG, TIFF files supported
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <UploadIcon className="mr-2 h-4 w-4" />
                      Select File
                    </Button>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="lat">Latitude</Label>
                      <Input
                        id="lat"
                        placeholder="e.g., 12.9716"
                        value={coordinates.lat}
                        onChange={(e) => setCoordinates({...coordinates, lat: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lon">Longitude</Label>
                      <Input
                        id="lon"
                        placeholder="e.g., 77.5946"
                        value={coordinates.lon}
                        onChange={(e) => setCoordinates({...coordinates, lon: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="sampleId">Sample ID</Label>
                    <Input
                      id="sampleId"
                      placeholder="e.g., site_12345"
                      value={sampleId}
                      onChange={(e) => setSampleId(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="model">Detection Model</Label>
                    <Select value={modelType} onValueChange={setModelType}>
                      <SelectTrigger id="model">
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mistral">
                          <div className="flex items-center gap-2">
                            <BrainIcon className="h-4 w-4" />
                            Karnana Model (Recommended)
                          </div>
                        </SelectItem>
                        <SelectItem value="unet">U-Net (Segmentation)</SelectItem>
                        <SelectItem value="yolov5">YOLOv5 (Detection)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Detect Button */}
                <Button 
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 futuristic-button"
                  onClick={handleDetect}
                  disabled={isProcessing || !file}
                >
                  {isProcessing ? (
                    <>
                      <PlayIcon className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <EyeIcon className="mr-2 h-4 w-4" />
                      Detect Panels
                    </>
                  )}
                </Button>

                {/* Progress Bar */}
                {isProcessing && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Processing image...</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Results Card */}
            {results && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-6"
              >
                <Card className="glass-card border-primary/20 border-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ZapIcon className="h-5 w-5" />
                      Detection Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Model Accuracy Info */}
                    <div className="mb-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                      <div className="flex items-center gap-2 mb-1">
                        <GaugeIcon className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium">{results.modelInfo.name} Accuracy</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Model Accuracy: <span className="font-semibold">{results.modelInfo.accuracy}%</span> | 
                        Precision: <span className="font-semibold">{results.modelInfo.precision}%</span> | 
                        Recall: <span className="font-semibold">{results.modelInfo.recall}%</span>
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                        <div className="flex items-center gap-2 mb-1">
                          <SunIcon className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">Solar Detected</span>
                        </div>
                        <p className="text-xl font-bold flex items-center gap-2">
                          {results.hasSolar ? (
                            <>
                              <CheckIcon className="h-5 w-5 text-green-500" />
                              Yes
                            </>
                          ) : (
                            <>
                              <XIcon className="h-5 w-5 text-red-500" />
                              No
                            </>
                          )}
                        </p>
                      </div>
                      
                      <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                        <div className="flex items-center gap-2 mb-1">
                          <LeafIcon className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">Confidence</span>
                        </div>
                        <p className="text-xl font-bold">
                          {results.confidence}%
                        </p>
                      </div>
                      
                      <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                        <div className="flex items-center gap-2 mb-1">
                          <ZapIcon className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">Panels</span>
                        </div>
                        <p className="text-xl font-bold">
                          {results.panelCount}
                        </p>
                      </div>
                      
                      <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                        <div className="flex items-center gap-2 mb-1">
                          <LeafIcon className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">Area</span>
                        </div>
                        <p className="text-xl font-bold">
                          {results.area} m²
                        </p>
                      </div>
                      
                      <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                        <div className="flex items-center gap-2 mb-1">
                          <ZapIcon className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">Capacity</span>
                        </div>
                        <p className="text-xl font-bold">
                          {results.capacity} kW
                        </p>
                      </div>
                      
                      <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                        <div className="flex items-center gap-2 mb-1">
                          <LeafIcon className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">CO₂ Offset</span>
                        </div>
                        <p className="text-xl font-bold">
                          {results.co2Offset} tons/year
                        </p>
                      </div>
                    </div>
                    
                    {/* Explanation */}
                    {results.explanation && (
                      <div className="mt-4 p-3 rounded-lg bg-secondary/10 border border-secondary/20">
                        <h4 className="font-medium text-sm mb-1 flex items-center gap-2">
                          <BrainIcon className="h-4 w-4" />
                          Analysis Explanation
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {results.explanation}
                        </p>
                      </div>
                    )}
                    
                    <div className="flex gap-3 mt-6">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => handleExport('json')}
                      >
                        <DownloadIcon className="mr-2 h-4 w-4" />
                        Export JSON
                      </Button>
                      <Button 
                        className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                        onClick={() => handleExport('csv')}
                      >
                        <DownloadIcon className="mr-2 h-4 w-4" />
                        Export CSV
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>

          {/* Image Preview and Visualization */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="glass-card border-primary/20 border-2 h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <EyeIcon className="h-5 w-5" />
                  Image Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col h-full">
                {previewUrl ? (
                  <div className="flex-1 flex flex-col">
                    <div className="relative flex-1 rounded-lg overflow-hidden border bg-muted flex items-center justify-center">
                      <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className="max-h-full max-w-full object-contain"
                      />
                      {results && results.hasSolar && (
                        <div className="absolute inset-0 border-4 border-green-500 rounded-lg pointer-events-none">
                          {/* In a real implementation, this would show actual detection overlays */}
                          <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-sm">
                            Solar Panels Detected
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 text-sm text-muted-foreground">
                      <p>Drag and drop a new image or click above to upload</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 text-center">
                    <FileImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Upload an aerial or satellite image to visualize solar panel detections
                    </p>
                  </div>
                )}
                
                {/* Drone Images Section */}
                <div className="mt-6">
                  <h3 className="font-medium flex items-center gap-2 mb-3">
                    <DroneIcon className="h-4 w-4" />
                    Sample Drone Imagery
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="aspect-square rounded-lg overflow-hidden border bg-muted flex items-center justify-center">
                      <div className="text-xs text-muted-foreground text-center p-2">
                        High-res Aerial View
                      </div>
                    </div>
                    <div className="aspect-square rounded-lg overflow-hidden border bg-muted flex items-center justify-center">
                      <div className="text-xs text-muted-foreground text-center p-2">
                        Satellite Imagery
                      </div>
                    </div>
                    <div className="aspect-square rounded-lg overflow-hidden border bg-muted flex items-center justify-center">
                      <div className="text-xs text-muted-foreground text-center p-2">
                        Thermal Imaging
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Example images showing optimal conditions for solar panel detection
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12"
        >
          <Card className="glass-card border-primary/20 border-2">
            <CardContent className="py-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <BrainIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">AI-Powered Detection</h3>
                    <p className="text-sm text-muted-foreground">
                      Uses state-of-the-art computer vision models and Mistral AI to automatically detect solar panels in aerial imagery
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <LeafIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Sustainability Impact</h3>
                    <p className="text-sm text-muted-foreground">
                      Calculate CO₂ offset and energy generation potential for detected solar installations
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <ZapIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Export Results</h3>
                    <p className="text-sm text-muted-foreground">
                      Export detection results in multiple formats for further analysis and reporting
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  )
}