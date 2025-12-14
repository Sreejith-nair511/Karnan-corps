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
      name: "കാർന്നാന മോഡൽ",
      accuracy: 94.2,
      precision: 92.8,
      recall: 95.1,
      f1_score: 93.9
    },
    unet: {
      name: "യു-നെറ്റ് വിഭജനം",
      accuracy: 89.5,
      precision: 87.2,
      recall: 91.3,
      f1_score: 89.2
    },
    yolov5: {
      name: "YOLOv5 തിരിച്ചറിയൽ",
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
      setError('എല്ലാ ആവശ്യമായ ഫീൽഡുകളും പൂരിപ്പിക്കുക')
      return
    }

    // Validate coordinates
    const lat = parseFloat(coordinates.lat)
    const lon = parseFloat(coordinates.lon)
    if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      setError('സാധുവായ നിർദ്ദേശാങ്കങ്ങൾ നൽകുക')
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
        throw new Error(errorData.detail || 'തിരിച്ചറിയൽ പരാജയപ്പെട്ടു')
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
      console.error('തിരിച്ചറിയൽ പരാജയപ്പെട്ടു:', error)
      clearInterval(interval)
      setIsProcessing(false)
      setProgress(0)
      setError(error.message || 'തിരിച്ചറിയൽ പരാജയപ്പെട്ടു. വീണ്ടും ശ്രമിക്കുക.')
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
      const csvContent = `സാമ്പിൾ ഐഡി,സൗരോർജ്ജം ഉണ്ട്,ആത്മവിശ്വാസം (%),പാനൽ എണ്ണം,ഏരിയ (ചതുരശ്ര മീറ്റർ),കപ്പാസിറ്റി (കിലോവാട്ട്),CO₂ ഓഫ്സെറ്റ് (ടൺ/വർഷം),ഉപയോഗിച്ച മോഡൽ\n${sampleId},${results.hasSolar},${results.confidence},${results.panelCount},${results.area},${results.capacity},${results.co2Offset},${results.modelInfo.name}`
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
            സൗരോർജ്ജ പാനൽ തിരിച്ചറിയൽ
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            ഛാതിയിലെ സൗരോർജ്ജ പാനലുകൾ സ്വയമേവ കണ്ടെത്താൻ, വിഭജിക്കാൻ, അളക്കാൻ ഏരിയൽ അല്ലെങ്കിൽ ഉപഗ്രഹ ചിത്രങ്ങൾ അപ്‌ലോഡ് ചെയ്യുക
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
                  ചിത്രം അപ്‌ലോഡ് ചെയ്യുക
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
                        {file ? file.name : 'അപ്‌ലോഡ് ചെയ്യാൻ ക്ലിക്ക് ചെയ്യുക അല്ലെങ്കിൽ വലിച്ചിടുക'}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        JPG, PNG, TIFF ഫയലുകൾ പിന്തുണയ്ക്കുന്നു
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <UploadIcon className="mr-2 h-4 w-4" />
                      ഫയൽ തിരഞ്ഞെടുക്കുക
                    </Button>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="lat">അക്ഷാംശം</Label>
                      <Input
                        id="lat"
                        placeholder="ഉദാ., 12.9716"
                        value={coordinates.lat}
                        onChange={(e) => setCoordinates({...coordinates, lat: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lon">രേഖാംശം</Label>
                      <Input
                        id="lon"
                        placeholder="ഉദാ., 77.5946"
                        value={coordinates.lon}
                        onChange={(e) => setCoordinates({...coordinates, lon: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="sampleId">സാമ്പിൾ ഐഡി</Label>
                    <Input
                      id="sampleId"
                      placeholder="ഉദാ., site_12345"
                      value={sampleId}
                      onChange={(e) => setSampleId(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="model">തിരിച്ചറിയൽ മോഡൽ</Label>
                    <Select value={modelType} onValueChange={setModelType}>
                      <SelectTrigger id="model">
                        <SelectValue placeholder="മോഡൽ തിരഞ്ഞെടുക്കുക" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mistral">
                          <div className="flex items-center gap-2">
                            <BrainIcon className="h-4 w-4" />
                            കാർന്നാന മോഡൽ (ശുപാർശ ചെയ്തത്)
                          </div>
                        </SelectItem>
                        <SelectItem value="unet">യു-നെറ്റ് (വിഭജനം)</SelectItem>
                        <SelectItem value="yolov5">YOLOv5 (തിരിച്ചറിയൽ)</SelectItem>
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
                      പ്രോസസ്സ് ചെയ്യുന്നു...
                    </>
                  ) : (
                    <>
                      <EyeIcon className="mr-2 h-4 w-4" />
                      പാനലുകൾ കണ്ടെത്തുക
                    </>
                  )}
                </Button>

                {/* Progress Bar */}
                {isProcessing && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>ചിത്രം പ്രോസസ്സ് ചെയ്യുന്നു...</span>
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
                      തിരിച്ചറിയൽ ഫലങ്ങൾ
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Model Accuracy Info */}
                    <div className="mb-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                      <div className="flex items-center gap-2 mb-1">
                        <GaugeIcon className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium">{results.modelInfo.name} കൃത്യത</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        മോഡൽ കൃത്യത: <span className="font-semibold">{results.modelInfo.accuracy}%</span> | 
                        കൃത്യത: <span className="font-semibold">{results.modelInfo.precision}%</span> | 
                        വീണ്ടെടുക്കൽ: <span className="font-semibold">{results.modelInfo.recall}%</span>
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                        <div className="flex items-center gap-2 mb-1">
                          <SunIcon className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">സൗരോർജ്ജം കണ്ടെത്തി</span>
                        </div>
                        <p className="text-xl font-bold flex items-center gap-2">
                          {results.hasSolar ? (
                            <>
                              <CheckIcon className="h-5 w-5 text-green-500" />
                              അതെ
                            </>
                          ) : (
                            <>
                              <XIcon className="h-5 w-5 text-red-500" />
                              ഇല്ല
                            </>
                          )}
                        </p>
                      </div>
                      
                      <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                        <div className="flex items-center gap-2 mb-1">
                          <LeafIcon className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">ആത്മവിശ്വാസം</span>
                        </div>
                        <p className="text-xl font-bold">
                          {results.confidence}%
                        </p>
                      </div>
                      
                      <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                        <div className="flex items-center gap-2 mb-1">
                          <ZapIcon className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">പാനലുകൾ</span>
                        </div>
                        <p className="text-xl font-bold">
                          {results.panelCount}
                        </p>
                      </div>
                      
                      <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                        <div className="flex items-center gap-2 mb-1">
                          <LeafIcon className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">ഏരിയ</span>
                        </div>
                        <p className="text-xl font-bold">
                          {results.area} മീ²
                        </p>
                      </div>
                      
                      <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                        <div className="flex items-center gap-2 mb-1">
                          <ZapIcon className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">കപ്പാസിറ്റി</span>
                        </div>
                        <p className="text-xl font-bold">
                          {results.capacity} kW
                        </p>
                      </div>
                      
                      <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                        <div className="flex items-center gap-2 mb-1">
                          <LeafIcon className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">CO₂ ഓഫ്സെറ്റ്</span>
                        </div>
                        <p className="text-xl font-bold">
                          {results.co2Offset} ടൺ/വർഷം
                        </p>
                      </div>
                    </div>
                    
                    {/* Explanation */}
                    {results.explanation && (
                      <div className="mt-4 p-3 rounded-lg bg-secondary/10 border border-secondary/20">
                        <h4 className="font-medium text-sm mb-1 flex items-center gap-2">
                          <BrainIcon className="h-4 w-4" />
                          വിശകലന വിപിശേഷണം
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
                        JSON എക്സ്പോർട്ട് ചെയ്യുക
                      </Button>
                      <Button 
                        className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                        onClick={() => handleExport('csv')}
                      >
                        <DownloadIcon className="mr-2 h-4 w-4" />
                        CSV എക്സ്പോർട്ട് ചെയ്യുക
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
                  ചിത്ര പ്രിവ്യൂ
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col h-full">
                {previewUrl ? (
                  <div className="flex-1 flex flex-col">
                    <div className="relative flex-1 rounded-lg overflow-hidden border bg-muted flex items-center justify-center">
                      <img 
                        src={previewUrl} 
                        alt="പ്രിവ്യൂ" 
                        className="max-h-full max-w-full object-contain"
                      />
                      {results && results.hasSolar && (
                        <div className="absolute inset-0 border-4 border-green-500 rounded-lg pointer-events-none">
                          {/* In a real implementation, this would show actual detection overlays */}
                          <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-sm">
                            സൗരോർജ്ജ പാനലുകൾ കണ്ടെത്തി
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 text-sm text-muted-foreground">
                      <p>ഒരു പുതിയ ചിത്രം വലിച്ചിടുക അല്ലെങ്കിൽ അപ്‌ലോഡ് ചെയ്യാൻ മുകളിൽ ക്ലിക്ക് ചെയ്യുക</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 text-center">
                    <FileImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      സൗരോർജ്ജ പാനൽ തിരിച്ചറിയലുകൾ കാണിക്കാൻ ഏരിയൽ അല്ലെങ്കിൽ ഉപഗ്രഹ ചിത്രം അപ്‌ലോഡ് ചെയ്യുക
                    </p>
                  </div>
                )}
                
                {/* Drone Images Section */}
                <div className="mt-6">
                  <h3 className="font-medium flex items-center gap-2 mb-3">
                    <PlaneIcon className="h-4 w-4" />
                    ഡ്രോൺ ചിത്രങ്ങൾ ഉദാഹരണം
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="aspect-square rounded-lg overflow-hidden border bg-muted flex items-center justify-center">
                      <div className="text-xs text-muted-foreground text-center p-2">
                        ഉയർന്ന-റെസ് ഏരിയൽ കാഴ്ച
                      </div>
                    </div>
                    <div className="aspect-square rounded-lg overflow-hidden border bg-muted flex items-center justify-center">
                      <div className="text-xs text-muted-foreground text-center p-2">
                        ഉപഗ്രഹ ചിത്രം
                      </div>
                    </div>
                    <div className="aspect-square rounded-lg overflow-hidden border bg-muted flex items-center justify-center">
                      <div className="text-xs text-muted-foreground text-center p-2">
                        താപ ഇമേജിംഗ്
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    സൗരോർജ്ജ പാനൽ തിരിച്ചറിയലിനായി ഇഷ്ടതമായ സ്ഥിതികൾ കാണിക്കുന്ന ഉദാഹരണ ചിത്രങ്ങൾ
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
                    <h3 className="font-medium mb-1">AI-പവർഡ് തിരിച്ചറിയൽ</h3>
                    <p className="text-sm text-muted-foreground">
                      ഏരിയൽ ചിത്രങ്ങളിൽ സൗരോർജ്ജ പാനലുകൾ സ്വയമേവ കണ്ടെത്താൻ അത്യാധുനിക കമ്പ്യൂട്ടർ വിഷൻ മോഡലുകളും മിസ്ട്രൽ AIയും ഉപയോഗിക്കുന്നു
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <LeafIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">സുസ്ഥിരത സ്വാധീനം</h3>
                    <p className="text-sm text-muted-foreground">
                      കണ്ടെത്തിയ സൗരോർജ്ജ ഇൻസ്റ്റാലേഷനുകൾക്കായി CO₂ ഓഫ്സെറ്റും ഊർജ്ജ ഉൽപാദന കഴിവും കണക്കുകൂട്ടുക
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <ZapIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">ഫലങ്ങൾ എക്സ്പോർട്ട് ചെയ്യുക</h3>
                    <p className="text-sm text-muted-foreground">
                      കൂടുതൽ വിശകലനത്തിനും റിപ്പോർട്ടിംഗിനും വേണ്ടി പല ഫോർമാറ്റുകളിൽ തിരിച്ചറിയൽ ഫലങ്ങൾ എക്സ്പോർട്ട് ചെയ്യുക
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