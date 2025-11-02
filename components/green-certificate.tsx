import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LeafIcon, CheckIcon, CalendarIcon, MapPinIcon } from "lucide-react"
import { motion } from "framer-motion"

export function GreenCertificate({
  siteId,
  date,
  confidence,
  capacityKw,
}: {
  siteId: string
  date: string
  confidence: string
  capacityKw: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-green-500/10"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-emerald-500/10"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <Badge className="bg-green-500 hover:bg-green-600">
              <LeafIcon className="mr-1 h-3 w-3" />
              Verified
            </Badge>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Certificate ID</div>
              <div className="font-mono text-sm">{siteId}</div>
            </div>
          </div>
          
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-3">
              <CheckIcon className="h-8 w-8 text-green-500" />
            </div>
            <h3 className="text-xl font-bold">Green Certificate</h3>
            <p className="text-muted-foreground text-sm mt-1">Rooftop Solar Verification</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-background/50 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <CalendarIcon className="h-4 w-4 text-green-500" />
                <span className="text-xs text-muted-foreground">Date</span>
              </div>
              <div className="font-medium">{date}</div>
            </div>
            <div className="bg-background/50 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <MapPinIcon className="h-4 w-4 text-green-500" />
                <span className="text-xs text-muted-foreground">Capacity</span>
              </div>
              <div className="font-medium">{capacityKw} kW</div>
            </div>
            <div className="bg-background/50 p-3 rounded-lg">
              <div className="text-xs text-muted-foreground mb-1">Confidence</div>
              <div className="font-medium">{confidence}</div>
            </div>
            <div className="bg-background/50 p-3 rounded-lg">
              <div className="text-xs text-muted-foreground mb-1">Status</div>
              <div className="font-medium text-green-500">Verified</div>
            </div>
          </div>
          
          <div className="text-center text-xs text-muted-foreground">
            <p>Includes QR code and signature hash for verification</p>
            <p className="mt-1">Valid for renewable energy incentives</p>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}