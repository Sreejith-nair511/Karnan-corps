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
  PlaneIcon,
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
      name: "கர்ணானா மாடல்",
      accuracy: 94.2,
      precision: 92.8,
      recall: 95.1,
      f1_score: 93.9
    },
    unet: {
      name: "யு-நெட் பிரிப்பு",
      accuracy: 89.5,
      precision: 87.2,
      recall: 91.3,
      f1_score: 89.2
    },
    yolov5: {
      name: "YOLOv5 கண்டறிதல்",
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
      setError('அனைத்து தேவையான புலங்களையும் நிரப்பவும்')
      return
    }

    // Validate coordinates
    const lat = parseFloat(coordinates.lat)
    const lon = parseFloat(coordinates.lon)
    if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      setError('சரியான ஒordinateகளை உள்ளிடவும்')
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
        throw new Error(errorData.detail || 'கண்டறிதல் தோல்வியடைந்தது')
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
      console.error('கண்டறிதல் தோல்வியடைந்தது:', error)
      clearInterval(interval)
      setIsProcessing(false)
      setProgress(0)
      setError(error.message || 'கண்டறிதல் தோல்வியடைந்தது. மீண்டும் முயற்சிக்கவும்.')
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
      const csvContent = `மாதிரி ஐடி,சோலார் உள்ளது,நம்பிக்கை (%),பேனல் எண்ணிக்கை,பகுதி (சதுர மீட்டர்),திறன் (கிலோவாட்),CO₂ ஆஃப்செட் (டன்/ஆண்டு),பயன்படுத்தப்பட்ட மாடல்\n${sampleId},${results.hasSolar},${results.confidence},${results.panelCount},${results.area},${results.capacity},${results.co2Offset},${results.modelInfo.name}`
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
            சோலார் பேனல் கண்டறிதல்
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            ரூஃப்டாப் சோலார் பேனல்களை தானாகக் கண்டறிய, பிரிக்க மற்றும் அளக்க, ஏரியல் அல்லது செயற்கைக்கோள் படங்களை பதிவேற்றவும்
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
                  படத்தை பதிவேற்றவும்
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
                        {file ? file.name : 'பதிவேற்ற கிளிக் செய்யவும் அல்லது இழுத்து விடவும்'}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        JPG, PNG, TIFF கோப்புகள் ஆதரிக்கப்படுகின்றன
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <UploadIcon className="mr-2 h-4 w-4" />
                      கோப்பை தேர்ந்தெடு
                    </Button>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="lat">அட்சரேகை</Label>
                      <Input
                        id="lat"
                        placeholder="எ.கா., 12.9716"
                        value={coordinates.lat}
                        onChange={(e) => setCoordinates({...coordinates, lat: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lon">தீர்க்கரேகை</Label>
                      <Input
                        id="lon"
                        placeholder="எ.கா., 77.5946"
                        value={coordinates.lon}
                        onChange={(e) => setCoordinates({...coordinates, lon: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="sampleId">மாதிரி ஐடி</Label>
                    <Input
                      id="sampleId"
                      placeholder="எ.கா., site_12345"
                      value={sampleId}
                      onChange={(e) => setSampleId(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="model">கண்டறிதல் மாடல்</Label>
                    <Select value={modelType} onValueChange={setModelType}>
                      <SelectTrigger id="model">
                        <SelectValue placeholder="மாடலை தேர்ந்தெடு" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mistral">
                          <div className="flex items-center gap-2">
                            <BrainIcon className="h-4 w-4" />
                            கர்ணானா மாடல் (பரிந்துரைக்கப்பட்டது)
                          </div>
                        </SelectItem>
                        <SelectItem value="unet">யு-நெட் (பிரிப்பு)</SelectItem>
                        <SelectItem value="yolov5">YOLOv5 (கண்டறிதல்)</SelectItem>
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
                      செயலாக்கம் நடைபெறுகிறது...
                    </>
                  ) : (
                    <>
                      <EyeIcon className="mr-2 h-4 w-4" />
                      பேனல்களை கண்டறி
                    </>
                  )}
                </Button>

                {/* Progress Bar */}
                {isProcessing && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>படத்தை செயலாக்குகிறது...</span>
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
                      கண்டறிதல் முடிவுகள்
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Model Accuracy Info */}
                    <div className="mb-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                      <div className="flex items-center gap-2 mb-1">
                        <GaugeIcon className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium">{results.modelInfo.name} துல்லியம்</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        மாடல் துல்லியம்: <span className="font-semibold">{results.modelInfo.accuracy}%</span> | 
                        துல்லியம்: <span className="font-semibold">{results.modelInfo.precision}%</span> | 
                        மீட்பு: <span className="font-semibold">{results.modelInfo.recall}%</span>
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                        <div className="flex items-center gap-2 mb-1">
                          <SunIcon className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">சோலார் கண்டறியப்பட்டது</span>
                        </div>
                        <p className="text-xl font-bold flex items-center gap-2">
                          {results.hasSolar ? (
                            <>
                              <CheckIcon className="h-5 w-5 text-green-500" />
                              ஆம்
                            </>
                          ) : (
                            <>
                              <XIcon className="h-5 w-5 text-red-500" />
                              இல்லை
                            </>
                          )}
                        </p>
                      </div>
                      
                      <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                        <div className="flex items-center gap-2 mb-1">
                          <LeafIcon className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">நம்பிக்கை</span>
                        </div>
                        <p className="text-xl font-bold">
                          {results.confidence}%
                        </p>
                      </div>
                      
                      <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                        <div className="flex items-center gap-2 mb-1">
                          <ZapIcon className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">பேனல்கள்</span>
                        </div>
                        <p className="text-xl font-bold">
                          {results.panelCount}
                        </p>
                      </div>
                      
                      <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                        <div className="flex items-center gap-2 mb-1">
                          <LeafIcon className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">பகுதி</span>
                        </div>
                        <p className="text-xl font-bold">
                          {results.area} மீ²
                        </p>
                      </div>
                      
                      <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                        <div className="flex items-center gap-2 mb-1">
                          <ZapIcon className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">திறன்</span>
                        </div>
                        <p className="text-xl font-bold">
                          {results.capacity} kW
                        </p>
                      </div>
                      
                      <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                        <div className="flex items-center gap-2 mb-1">
                          <LeafIcon className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">CO₂ ஆஃப்செட்</span>
                        </div>
                        <p className="text-xl font-bold">
                          {results.co2Offset} டன்/ஆண்டு
                        </p>
                      </div>
                    </div>
                    
                    {/* Explanation */}
                    {results.explanation && (
                      <div className="mt-4 p-3 rounded-lg bg-secondary/10 border border-secondary/20">
                        <h4 className="font-medium text-sm mb-1 flex items-center gap-2">
                          <BrainIcon className="h-4 w-4" />
                          பகுப்பாய்வு விளக்கம்
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
                        JSONஐ ஏற்றுமதி செய்யவும்
                      </Button>
                      <Button 
                        className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                        onClick={() => handleExport('csv')}
                      >
                        <DownloadIcon className="mr-2 h-4 w-4" />
                        CSVஐ ஏற்றுமதி செய்யவும்
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
                  பட முன்னோட்டம்
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col h-full">
                {previewUrl ? (
                  <div className="flex-1 flex flex-col">
                    <div className="relative flex-1 rounded-lg overflow-hidden border bg-muted flex items-center justify-center">
                      <img 
                        src={previewUrl} 
                        alt="முன்னோட்டம்" 
                        className="max-h-full max-w-full object-contain"
                      />
                      {results && results.hasSolar && (
                        <div className="absolute inset-0 border-4 border-green-500 rounded-lg pointer-events-none">
                          {/* In a real implementation, this would show actual detection overlays */}
                          <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-sm">
                            சோலார் பேனல்கள் கண்டறியப்பட்டன
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 text-sm text-muted-foreground">
                      <p>ஒரு புதிய படத்தை இழுத்து விடவும் அல்லது பதிவேற்ற மேலே கிளிக் செய்யவும்</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 text-center">
                    <FileImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      சோலார் பேனல் கண்டறிதல்களை காட்சிப்படுத்த ஏரியல் அல்லது செயற்கைக்கோள் படத்தை பதிவேற்றவும்
                    </p>
                  </div>
                )}
                
                {/* Drone Images Section */}
                <div className="mt-6">
                  <h3 className="font-medium flex items-center gap-2 mb-3">
                    <PlaneIcon className="h-4 w-4" />
                    ட்ரோன் படங்கள் எடுத்துக்காட்டு
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="aspect-square rounded-lg overflow-hidden border bg-muted flex items-center justify-center">
                      <div className="text-xs text-muted-foreground text-center p-2">
                        உயர்-தீர ஏரியல் பார்வை
                      </div>
                    </div>
                    <div className="aspect-square rounded-lg overflow-hidden border bg-muted flex items-center justify-center">
                      <div className="text-xs text-muted-foreground text-center p-2">
                        செயற்கைக்கோள் படம்
                      </div>
                    </div>
                    <div className="aspect-square rounded-lg overflow-hidden border bg-muted flex items-center justify-center">
                      <div className="text-xs text-muted-foreground text-center p-2">
                        வெப்ப படமாக்கல்
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    சோலார் பேனல் கண்டறிதலுக்கான சிறந்த நிலைகளைக் காட்டும் எடுத்துக்காட்டு படங்கள்
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
                    <h3 className="font-medium mb-1">AI-இயக்கும் கண்டறிதல்</h3>
                    <p className="text-sm text-muted-foreground">
                      ஏரியல் படங்களில் சோலார் பேனல்களை தானாகக் கண்டறிய, முன்னணி கணினி பார்வை மாடல்கள் மற்றும் மிஸ்ட்ரல் AIஐ பயன்படுத்துகிறது
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <LeafIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">நிலைத்தன்மை தாக்கம்</h3>
                    <p className="text-sm text-muted-foreground">
                      கண்டறியப்பட்ட சோலார் நிறுவனங்களுக்கான CO₂ ஆஃப்செட் மற்றும் ஆற்றல் உருவாக்க சக்தியை கணக்கிடவும்
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <ZapIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">முடிவுகளை ஏற்றுமதி செய்யவும்</h3>
                    <p className="text-sm text-muted-foreground">
                      மேலும் பகுப்பாய்வு மற்றும் அறிக்கையிடலுக்காக பல வடிவங்களில் கண்டறிதல் முடிவுகளை ஏற்றுமதி செய்யவும்
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