import { NextResponse } from "next/server"

export async function GET() {
  // Sample synthetic data; replace with real metrics as available
  const states = [
    { name: "Maharashtra", rooftops: 18230, capacityMw: 640.3, co2SavedKt: 950.1 },
    { name: "Karnataka", rooftops: 15420, capacityMw: 520.6, co2SavedKt: 781.4 },
    { name: "Gujarat", rooftops: 20110, capacityMw: 710.1, co2SavedKt: 1032.2 },
    { name: "Tamil Nadu", rooftops: 13980, capacityMw: 485.4, co2SavedKt: 712.7 },
    { name: "Telangana", rooftops: 10120, capacityMw: 360.0, co2SavedKt: 530.8 },
    { name: "Andhra Pradesh", rooftops: 11240, capacityMw: 395.2, co2SavedKt: 580.3 },
    { name: "Kerala", rooftops: 8450, capacityMw: 295.3, co2SavedKt: 421.0 },
    { name: "West Bengal", rooftops: 9720, capacityMw: 340.7, co2SavedKt: 498.6 },
    { name: "Bihar", rooftops: 7620, capacityMw: 265.8, co2SavedKt: 384.1 },
    { name: "Uttar Pradesh", rooftops: 18760, capacityMw: 658.4, co2SavedKt: 952.0 },
    { name: "Punjab", rooftops: 6120, capacityMw: 212.4, co2SavedKt: 310.7 },
    { name: "Haryana", rooftops: 5980, capacityMw: 208.6, co2SavedKt: 302.1 },
    { name: "Rajasthan", rooftops: 13110, capacityMw: 470.2, co2SavedKt: 689.0 },
    { name: "Madhya Pradesh", rooftops: 10850, capacityMw: 382.7, co2SavedKt: 556.3 },
    { name: "Odisha", rooftops: 5920, capacityMw: 205.0, co2SavedKt: 298.2 },
    { name: "Assam", rooftops: 3810, capacityMw: 131.8, co2SavedKt: 190.7 },
    { name: "Jharkhand", rooftops: 4120, capacityMw: 143.2, co2SavedKt: 207.6 },
    { name: "Chhattisgarh", rooftops: 3980, capacityMw: 138.1, co2SavedKt: 199.2 },
    { name: "Delhi", rooftops: 7240, capacityMw: 253.4, co2SavedKt: 367.2 },
    { name: "Jammu and Kashmir", rooftops: 2510, capacityMw: 87.2, co2SavedKt: 125.0 },
    { name: "Uttarakhand", rooftops: 2890, capacityMw: 100.3, co2SavedKt: 146.8 },
    { name: "Himachal Pradesh", rooftops: 2410, capacityMw: 84.7, co2SavedKt: 123.8 },
    { name: "Goa", rooftops: 920, capacityMw: 32.4, co2SavedKt: 47.3 },
    { name: "Tripura", rooftops: 740, capacityMw: 25.6, co2SavedKt: 37.2 },
    { name: "Meghalaya", rooftops: 680, capacityMw: 23.4, co2SavedKt: 34.0 },
    { name: "Manipur", rooftops: 570, capacityMw: 20.2, co2SavedKt: 28.9 },
    { name: "Mizoram", rooftops: 430, capacityMw: 15.8, co2SavedKt: 22.6 },
    { name: "Nagaland", rooftops: 410, capacityMw: 15.0, co2SavedKt: 21.7 },
    { name: "Sikkim", rooftops: 260, capacityMw: 9.2, co2SavedKt: 13.2 },
    { name: "Puducherry", rooftops: 510, capacityMw: 17.9, co2SavedKt: 26.0 },
    { name: "Chandigarh", rooftops: 620, capacityMw: 22.0, co2SavedKt: 31.8 },
  ]
  return NextResponse.json({ states })
}
