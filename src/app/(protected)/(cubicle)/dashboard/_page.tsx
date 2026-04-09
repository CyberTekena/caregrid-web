"use client"

import { AlertTriangle, ActivitySquare, Users, ShieldAlert, CheckCircle2, Clock, Phone, Navigation } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapModule } from "@/components/map-wrapper"
import type { HallCubicle } from "@/components/map-module"

export default function CubicleDashboard() {
  const mockLocation: [number, number] = [6.885, 3.717]
  const MOCK_HALLS: HallCubicle[] = [
    { id: "h1", name: "Welch Hall Cubicle (Current)", lat: mockLocation[0], lng: mockLocation[1], status: "busy" }
  ]

  return (
    <div className="flex-1 p-4 md:p-8 space-y-6 max-w-[1400px] mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <ActivitySquare className="h-8 w-8 text-primary" />
            Welch Hall Operations
          </h1>
          <p className="text-muted-foreground mt-1">Cubicle Dashboard &bull; Responder View</p>
        </div>
        <div className="flex items-center gap-3 bg-white dark:bg-card px-4 py-2 rounded-full border shadow-sm">
           <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
           <span className="text-sm font-medium">Status: Active & Online</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-red-600 text-white shadow-lg border-none relative overflow-hidden">
          <div className="absolute top-[-20px] right-[-20px] bg-white/10 w-24 h-24 rounded-full" />
          <CardHeader className="pb-2 relative z-10 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium opacity-90">Active Emergencies</CardTitle>
            <AlertTriangle className="h-4 w-4 opacity-70" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-bold">1</div>
            <p className="text-xs opacity-70 mt-1">Requires immediate attention</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-border/50">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Reports</CardTitle>
            <ShieldAlert className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">3</div>
            <p className="text-xs text-muted-foreground mt-1">Non-emergency reports in queue</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-border/50">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">Resolved Today</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12</div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/50">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">Hall Population</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
             <div className="text-3xl font-bold">450</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* Active Emergency Case Card */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="font-bold text-lg text-red-600 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" /> Live Incidents
          </h3>
          
          <Card className="border-red-200 shadow-md">
            <div className="h-2 w-full bg-red-600" />
            <CardHeader className="pb-2 border-b">
              <div className="flex justify-between items-start">
                <div>
                  <Badge variant="destructive" className="mb-2">SEVERE ASTHMA ATTACK</Badge>
                  <CardTitle className="text-xl">Michael Doe</CardTitle>
                  <CardDescription className="font-semibold text-foreground mt-1">Room 212 (Welch Hall)</CardDescription>
                </div>
                <div className="text-right text-xs text-muted-foreground flex flex-col items-end gap-1">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 2m ago</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4 text-sm space-y-4">
              <div className="bg-muted p-3 rounded-lg text-muted-foreground">
                <span className="font-semibold text-foreground">Note:</span> Patient reported severe breathing difficulty. Inhaler not mitigating symptoms. Known allergic to penicillin.
              </div>
              <div className="flex gap-2">
                <Button className="w-full bg-red-600 hover:bg-red-700 font-bold" size="sm">
                  <Navigation className="w-4 h-4 mr-2" /> Mark En Route
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  <Phone className="w-4 h-4 mr-2" /> Contact
                </Button>
              </div>
              <Button variant="secondary" className="w-full border-red-200 text-red-700 bg-red-50 hover:bg-red-100">
                <ActivitySquare className="w-4 h-4 mr-2" /> Escalate to Ambulance
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Local Map Monitor */}
         <div className="lg:col-span-2 space-y-4">
           <h3 className="font-bold text-lg flex items-center gap-2">
            <Navigation className="h-5 w-5" /> Spatial Overview
          </h3>
          <Card className="overflow-hidden shadow-sm flex flex-col h-[500px]">
             <MapModule 
                 halls={MOCK_HALLS} 
                 userLocation={[6.8855, 3.7175]} 
                 activeRoute={{from: mockLocation, to: [6.8855, 3.7175]}}
                 className="h-full w-full rounded-none border-none border-0" 
              />
          </Card>
        </div>
      </div>
    </div>
  )
}
