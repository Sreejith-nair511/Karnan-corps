"use client"

import type React from "react"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { UploadIcon, FileTextIcon } from "lucide-react"
import { motion } from "framer-motion"

export function UploadVerificationCSV() {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [fileName, setFileName] = useState<string>("")

  const onPick = () => inputRef.current?.click()

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    // In a full implementation, upload to storage and trigger server-side processing
  }

  return (
    <div className="space-y-4">
      <motion.div 
        className="flex items-center gap-3"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Input ref={inputRef} type="file" accept=".csv" onChange={onChange} className="hidden" />
        <Button 
          onClick={onPick} 
          className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 futuristic-button"
        >
          <UploadIcon className="mr-2 h-4 w-4" />
          Upload Verification CSV
        </Button>
      </motion.div>
      
      {fileName && (
        <motion.div 
          className="flex items-center gap-2 p-3 rounded-lg bg-muted"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <FileTextIcon className="h-4 w-4 text-primary" />
          <span className="text-sm truncate">{fileName}</span>
        </motion.div>
      )}
      
      <Card className="p-4 text-xs text-muted-foreground glass-card">
        <p className="mb-2 font-medium">CSV Format Requirements:</p>
        <ul className="space-y-1">
          <li>• Required columns: lat, lon</li>
          <li>• Optional columns: district, site_id</li>
          <li>• Processing will classify: Has Solar, Confidence %, Panel Area, Count, Capacity</li>
        </ul>
      </Card>
    </div>
  )
}