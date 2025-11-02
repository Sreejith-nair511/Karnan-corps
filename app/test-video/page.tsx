"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestVideoPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 space-y-8">
      <header>
        <h1 className="text-2xl font-semibold">Video Test Page</h1>
        <p className="text-muted-foreground">Testing video integration</p>
      </header>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Drone Video 1</CardTitle>
          </CardHeader>
          <CardContent>
            <video 
              controls 
              className="w-full rounded-lg border"
              poster="/placeholder.jpg"
            >
              <source src="/videos/VID-20250220-WA0007.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Drone Video 2</CardTitle>
          </CardHeader>
          <CardContent>
            <video 
              controls 
              className="w-full rounded-lg border"
              poster="/placeholder.jpg"
            >
              <source src="/videos/VID_20250309_214447.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}