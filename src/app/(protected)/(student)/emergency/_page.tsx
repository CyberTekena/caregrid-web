"use client"

import { useState } from "react"
import { AlertTriangle, MapPin, Send, Loader2 } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { MapModule } from "@/components/map-wrapper"
import type { HallCubicle } from "@/components/map-module"

// Mock Data
const MOCK_HALLS: HallCubicle[] = [
  { id: "h1", name: "Welch Hall Cubicle", lat: 6.885, lng: 3.717, status: "active" },
  { id: "h2", name: "Nelson Mandela Hall Cubicle", lat: 6.887, lng: 3.720, status: "active" },
  { id: "h3", name: "Winslow Hall Cubicle", lat: 6.884, lng: 3.719, status: "busy" },
]

export default function EmergencyPage() {
  const [isLocating, setIsLocating] = useState(false)
  const [userLocation, setUserLocation] = useState<[number, number] | undefined>(undefined)
  const [selectedHall, setSelectedHall] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [activeRoute, setActiveRoute] = useState<{from: [number, number], to: [number, number]} | undefined>(undefined)
  const [nearestCubicle, setNearestCubicle] = useState<HallCubicle | null>(null)

  const handleGetLocation = () => {
    setIsLocating(true)
    // Simulate geolocation API delay
    setTimeout(() => {
      const mockUserLat = 6.8855
      const mockUserLng = 3.7185
      setUserLocation([mockUserLat, mockUserLng])
      setIsLocating(false)
      toast.success("Location pinpointed accurately.")
      
      // Calculate nearest for demo
      setNearestCubicle(MOCK_HALLS[0])
      setActiveRoute({ from: [mockUserLat, mockUserLng], to: [MOCK_HALLS[0].lat, MOCK_HALLS[0].lng] })
    }, 1500)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate submission delay
    setTimeout(() => {
      setIsSubmitting(false)
      toast.error("SOS Alert Dispatched", {
        description: `Alert routed to ${nearestCubicle ? nearestCubicle.name : "nearest available cubicle"}. Response team is en route.`,
      })
    }, 2000)
  }

  return (
    <div className="flex-1 p-4 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-red-600 flex items-center gap-2">
            <AlertTriangle className="h-8 w-8" />
            Emergency SOS
          </h1>
          <p className="text-muted-foreground mt-1">
            Dispatch an immediate alert to the nearest health cubicle.
          </p>
        </div>
        <div className="flex gap-2">
           <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Priority Response</Badge>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        
        {/* SOS Form Section */}
        <Card className="lg:col-span-2 border-red-200/50 shadow-md">
          <CardHeader className="bg-red-50/50 dark:bg-red-950/20 border-b border-red-100/50 pb-4">
            <CardTitle>Report Incident</CardTitle>
            <CardDescription>Fill out details quickly. If you cannot type, just press 'Dispatch SOS'.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 pt-6">
              
              <div className="space-y-2">
                <Label>Emergency Category</Label>
                <Select required>
                  <SelectTrigger className="border-red-100 focus:ring-red-500">
                    <SelectValue placeholder="Select type..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fainting">Fainting / Unconsciousness</SelectItem>
                    <SelectItem value="breathing">Breathing Difficulty (Asthma etc.)</SelectItem>
                    <SelectItem value="bleeding">Severe Bleeding / Injury</SelectItem>
                    <SelectItem value="pain">Severe Pain (Chest, Abdominal)</SelectItem>
                    <SelectItem value="seizure">Seizure</SelectItem>
                    <SelectItem value="mental">Mental Distress</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Location Fallback (Hall & Room)</Label>
                <div className="flex gap-2">
                  <Select value={selectedHall} onValueChange={(value) => setSelectedHall(value || "")}>
                    <SelectTrigger className="w-[60%]">
                      <SelectValue placeholder="Select Hall" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="welch">Welch Hall</SelectItem>
                      <SelectItem value="nelson">Nelson Mandela Hall</SelectItem>
                      <SelectItem value="winslow">Winslow Hall</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input placeholder="Room No." className="w-[40%]" />
                </div>
                <p className="text-xs text-muted-foreground">Used if GPS is unavailable.</p>
              </div>

              <div className="space-y-2">
                <Label>Additional Context (Optional)</Label>
                <Textarea 
                  placeholder="E.g. Student is asthmatic, inhaler not working..." 
                  className="resize-none h-20"
                />
              </div>

            </CardContent>
            <CardFooter className="bg-muted/30 border-t flex-col gap-3 pt-6">
              <Button 
                type="button" 
                variant="outline" 
                className="w-full" 
                onClick={handleGetLocation} 
                disabled={isLocating}
              >
                {isLocating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <MapPin className="w-4 h-4 mr-2" />}
                {userLocation ? "Location Acquired" : "Auto-Detect My Location"}
              </Button>
              <Button 
                type="submit" 
                size="lg" 
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold h-14 shadow-lg shadow-red-600/30"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Dispatching...</>
                ) : (
                  <><Send className="w-5 h-5 mr-2" /> DISPATCH EMERGENCY SOS</>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Live Map Tracking Section */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-3 flex flex-col gap-4"
        >
          <Card className="flex-1 overflow-hidden shadow-md flex flex-col">
            <div className="p-4 bg-muted/30 border-b flex justify-between items-center z-10">
              <div>
                <h3 className="font-semibold flex items-center gap-2">
                   <MapPin className="w-4 h-4 text-primary" /> Routing Tracker
                </h3>
                {nearestCubicle && (
                   <p className="text-sm text-muted-foreground mt-1">
                     Nearest Cubicle: <span className="font-semibold text-primary">{nearestCubicle.name}</span>
                   </p>
                )}
              </div>
              <Badge variant="secondary" className="animate-pulse bg-primary/10 text-primary">Live</Badge>
            </div>
            <div className="flex-1 relative min-h-[400px]">
              <MapModule 
                 halls={MOCK_HALLS} 
                 userLocation={userLocation} 
                 activeRoute={activeRoute} 
                 className="h-full w-full rounded-none border-none border-0" 
              />
            </div>
          </Card>
        </motion.div>

      </div>
    </div>
  )
}
