"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileTextIcon, ShieldCheckIcon, AlertTriangleIcon, LockIcon, EyeIcon, DatabaseIcon } from "lucide-react"

const rows = [
  {
    tx: "0x2f3a...c9e1",
    site: "KER-001",
    status: "Verifiable",
    confidence: "93%",
    timestamp: "2025-10-14 09:31 IST",
    reviewer: "AI Model v2.1",
    capacity: "4.2 kW"
  },
  {
    tx: "0xa1b7...d2ff",
    site: "PN-342",
    status: "Verifiable",
    confidence: "81%",
    timestamp: "2025-10-14 08:12 IST",
    reviewer: "AI Model v2.1",
    capacity: "3.8 kW"
  },
  {
    tx: "0x9d12...aa09",
    site: "DL-120",
    status: "Not Verifiable",
    confidence: "14%",
    timestamp: "2025-10-13 18:47 IST",
    reviewer: "Manual Review",
    capacity: "N/A"
  },
  {
    tx: "0x7c45...f1b8",
    site: "KA-015",
    status: "Verifiable",
    confidence: "96%",
    timestamp: "2025-10-13 15:22 IST",
    reviewer: "AI Model v2.1",
    capacity: "5.1 kW"
  },
  {
    tx: "0x3e67...d9a2",
    site: "TN-078",
    status: "Not Verifiable",
    confidence: "8%",
    timestamp: "2025-10-13 11:45 IST",
    reviewer: "Manual Review",
    capacity: "N/A"
  },
]

export function TransparencyLedger() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-card border-primary/20 border-2">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <DatabaseIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Records</p>
                <p className="text-xl font-bold">2.1M</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card border-primary/20 border-2">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <ShieldCheckIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Verifiable</p>
                <p className="text-xl font-bold">1.8M</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card border-primary/20 border-2">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <EyeIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="text-xl font-bold">Just now</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="overflow-x-auto rounded-xl border border-primary/20">
        <table className="w-full text-sm">
          <thead className="text-left bg-primary/5">
            <tr className="[&>th]:py-3 [&>th]:px-4 [&>th]:font-semibold text-muted-foreground">
              <th className="rounded-tl-lg">Transaction Hash</th>
              <th>Site ID</th>
              <th>Status</th>
              <th>Capacity</th>
              <th>Confidence</th>
              <th>Reviewer</th>
              <th className="rounded-tr-lg">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, index) => (
              <motion.tr 
                key={r.tx} 
                className="border-t hover:bg-accent/50 transition-colors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 * index }}
              >
                <td className="py-3 px-4 font-mono text-primary text-xs">{r.tx}</td>
                <td className="py-3 px-4 font-medium">{r.site}</td>
                <td className="py-3 px-4">
                  <Badge 
                    variant={r.status === "Verifiable" ? "default" : "destructive"}
                    className="rounded-full"
                  >
                    {r.status === "Verifiable" ? (
                      <div className="flex items-center gap-1">
                        <ShieldCheckIcon className="h-3 w-3" />
                        {r.status}
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <AlertTriangleIcon className="h-3 w-3" />
                        {r.status}
                      </div>
                    )}
                  </Badge>
                </td>
                <td className="py-3 px-4">{r.capacity}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-secondary/20 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          parseInt(r.confidence) > 80 ? "bg-green-500" : 
                          parseInt(r.confidence) > 50 ? "bg-yellow-500" : "bg-destructive"
                        }`} 
                        style={{ width: r.confidence }}
                      ></div>
                    </div>
                    <span>{r.confidence}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <Badge variant="outline" className="rounded-full text-xs">
                    {r.reviewer}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-muted-foreground text-xs">{r.timestamp}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <Card className="glass-card border-primary/20 border-2">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <LockIcon className="h-5 w-5 text-primary" />
            Immutable Verification Ledger
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-3">
            <FileTextIcon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Public, Transparent, and Immutable</p>
              <p className="text-muted-foreground mt-2">
                This ledger is a public, append-only log of all solar verification activities. 
                Each record includes cryptographic signatures for verification and is stored on a distributed network.
                All data is verified through our AI models and manual review processes to ensure accuracy and transparency.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge variant="secondary" className="rounded-full">AI Verified</Badge>
                <Badge variant="secondary" className="rounded-full">Manual Review</Badge>
                <Badge variant="secondary" className="rounded-full">Blockchain Secured</Badge>
                <Badge variant="secondary" className="rounded-full">Real-time Updates</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}