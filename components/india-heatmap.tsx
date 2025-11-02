"use client"

import { Card } from "@/components/ui/card"

export function IndiaHeatmap() {
  return (
    <div className="rounded-md border bg-muted p-4">
      <div className="mb-3 text-sm text-muted-foreground">
        Heatmap placeholder (connect to map provider or tiles later)
      </div>
      <Card className="aspect-video w-full overflow-hidden">
        <img
          src="/india-state-wise-solar-progress-heatmap.jpg"
          alt="India heatmap placeholder: state-wise solar progress"
          className="h-full w-full object-cover"
        />
      </Card>
    </div>
  )
}
