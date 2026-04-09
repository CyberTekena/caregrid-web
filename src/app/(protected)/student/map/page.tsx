"use client"

import { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, Navigation, Info, Building2, Search, Filter, X, ShieldAlert } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MapModule } from "@/components/map-wrapper"
import { LoadingScreen } from "@/components/loading-screen"
import { useCurrentUser } from "@/hooks/use-current-user"
import { useHalls } from "@/hooks/use-halls"
import { BABCOCK_HOSPITAL } from "@/data/halls"
import type { HallCubicle } from "@/components/map-module"

// Utility functions for distance calculation
function distanceMetres(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371e3 // Earth's radius in metres
  const φ1 = lat1 * Math.PI / 180
  const φ2 = lat2 * Math.PI / 180
  const Δφ = (lat2 - lat1) * Math.PI / 180
  const Δλ = (lng2 - lng1) * Math.PI / 180

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))

  return R * c
}

function hallsSortedByDistance(userLocation: [number, number], halls: any[]) {
  return halls
    .map(hall => ({
      ...hall,
      distance: distanceMetres(userLocation[0], userLocation[1], hall.lat, hall.lng)
    }))
    .sort((a, b) => a.distance - b.distance)
}

// Hall data is now loaded from backend via useHalls hook

function formatDistance(m: number): string {
  if (m < 1000) return `${Math.round(m)}m`
  return `${(m / 1000).toFixed(1)}km`
}

function formatWalkTime(m: number): string {
  const mins = Math.ceil(m / 80) // avg walking ~80m/min
  if (mins < 1) return "< 1 min walk"
  return `~${mins} min walk`
}

export default function StudentMap() {
  const { user, loading: userLoading } = useCurrentUser()
  const { halls, loading: hallsLoading } = useHalls()
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<HallCubicle | null>(null)
  const [browserLocation, setBrowserLocation] = useState<[number, number] | null>(null)
  const [isOffCampus, setIsOffCampus] = useState(false)

  // Request browser geolocation on mount
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude: lat, longitude: lng } = position.coords
          setBrowserLocation([lat, lng])
          
          // Geofencing Check: Babcock University approx bounds
          const offCampus = lat < 6.890 || lat > 6.898 || lng < 3.718 || lng > 3.732
          setIsOffCampus(offCampus)
        },
        (error) => {
          console.warn("Geolocation error:", error.message)
        }
      )
    }
  }, [])

  // Get student's hall from their profile
  const studentHall = useMemo(() => {
    if (!user?.hall_id || !halls.length) return null
    return halls.find(h => h.id === user.hall_id)
  }, [user?.hall_id, halls])

  // Student's location: Browser location first, then hall location fallback
  const studentLocation: [number, number] | null = useMemo(() => {
    if (browserLocation) return browserLocation
    if (!studentHall) return null
    return [studentHall.lat, studentHall.lng]
  }, [browserLocation, studentHall])

  const sorted = useMemo(() => {
    if (!studentLocation || !halls.length) return []
    return hallsSortedByDistance(studentLocation, halls)
  }, [studentLocation, halls])

  const filtered = useMemo(() => {
    if (!search.trim()) return sorted
    const q = search.toLowerCase()
    return sorted.filter(h => h.name.toLowerCase().includes(q))
  }, [search, sorted])

  const nearest = sorted[0]

  const activeRoute = selected && studentLocation
    ? { from: studentLocation, to: [selected.lat, selected.lng] as [number, number] }
    : nearest && studentLocation
    ? { from: studentLocation, to: [nearest.lat, nearest.lng] as [number, number] }
    : undefined

  const displayHall = selected ?? nearest

  const distanceToDisplay = displayHall && studentLocation
    ? distanceMetres(studentLocation[0], studentLocation[1], displayHall.lat, displayHall.lng)
    : 0

  // Show loading state while data is loading
  if (hallsLoading || userLoading) {
    return <LoadingScreen message="Initializing Campus Map..." />
  }

  if (!user) {
    return <LoadingScreen message="Authenticating Student Access..." />
  }

  if (!studentLocation) {
    return <LoadingScreen message="Locating Hall Assignment..." />
  }

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-theme(spacing.16))] font-sans relative">

      <AnimatePresence>
        {isOffCampus && (
          <motion.div 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            className="absolute top-0 left-0 right-0 z-[100] bg-destructive text-white px-4 py-3 flex items-center justify-center gap-3 shadow-2xl font-bold text-sm text-center"
          >
            <ShieldAlert className="w-5 h-5 animate-pulse shrink-0" />
            <span>Outside Service Area: GPS tracking restricted to Babcock campus boundaries.</span>
            <button 
              onClick={() => setIsOffCampus(false)}
              className="ml-4 underline opacity-80 hover:opacity-100"
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search & Filter Overlay */}
      <div className="absolute top-6 left-6 right-6 z-20 flex gap-4 pointer-events-none">
        <div className="flex-1 max-w-md pointer-events-auto">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search for Hall Cubicles..."
              className="pl-10 h-12 bg-background/80 backdrop-blur-xl border-white/20 shadow-xl rounded-2xl"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setSearch("")}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Search results dropdown */}
          {search.trim() && (
            <div className="mt-2 bg-background/95 backdrop-blur-xl border border-white/20 shadow-xl rounded-2xl overflow-hidden">
              {filtered.length === 0 ? (
                <p className="text-sm text-muted-foreground px-4 py-3">No halls found</p>
              ) : (
                filtered.slice(0, 6).map(h => (
                  <button
                    key={h.id}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors text-left border-b border-border/30 last:border-0"
                    onClick={() => { setSelected(h); setSearch("") }}
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-sm font-medium">{h.name}</span>
                    </div>
                    <Badge
                      className={`text-[10px] ${
                        h.status === "active" ? "bg-green-500/10 text-green-600 border-none" :
                        h.status === "busy" ? "bg-amber-500/10 text-amber-600 border-none" :
                        "bg-gray-100 text-gray-500 border-none"
                      }`}
                    >
                      {h.status}
                    </Badge>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        <Button
          className="pointer-events-auto h-12 px-6 bg-background/80 backdrop-blur-xl border border-white/20 shadow-xl text-foreground hover:bg-muted/50 rounded-2xl"
          onClick={() => setSelected(null)}
        >
          <Filter className="w-4 h-4 mr-2" />
          {selected ? "Clear" : "All Halls"}
        </Button>
      </div>

      {/* Real Leaflet Map */}
      <div className="flex-1 relative">
        <MapModule
          halls={halls}
          userLocation={studentLocation}
          activeRoute={activeRoute}
          hospital={BABCOCK_HOSPITAL}
          className="h-full w-full rounded-none"
          onHallClick={setSelected}
        />
      </div>

      {/* Info Card — bottom left */}
      {displayHall && (
        <motion.div
          key={displayHall.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-6 left-6 z-20 w-80"
        >
          <Card className="border-border/50 bg-background/90 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden">
            <CardHeader className="p-4 border-b bg-muted/20">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-bold">{displayHall.name}</CardTitle>
                <Badge
                  className={`text-[10px] border-none ${
                    displayHall.status === "active" ? "bg-green-500/10 text-green-600" :
                    displayHall.status === "busy" ? "bg-amber-500/10 text-amber-600" :
                    "bg-gray-100 text-gray-500"
                  }`}
                >
                  {displayHall.status.charAt(0).toUpperCase() + displayHall.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Navigation className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold leading-none">{formatDistance(distanceToDisplay)}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{formatWalkTime(distanceToDisplay)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent shrink-0">
                  <Info className="w-4 h-4" />
                </div>
                <p className="text-[11px] leading-relaxed text-muted-foreground">
                  {displayHall.id === "welch"
                    ? "Your hall cubicle. Staffed with first aid supplies and nurse on call."
                    : `Nearest available cubicle from your hall. ${
                        displayHall.status === "busy" ? "Currently busy — may have wait time." :
                        displayHall.status === "inactive" ? "Currently closed." :
                        "Available now."
                      }`}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  className="rounded-xl bg-primary hover:bg-primary/90 text-white font-bold h-10 text-xs"
                  onClick={() => {
                    const dest = selected ?? nearest
                    if (!dest) return
                    const url = `https://www.google.com/maps/dir/?api=1&destination=${dest.lat},${dest.lng}&travelmode=walking`
                    window.open(url, "_blank")
                  }}
                >
                  <Navigation className="w-3 h-3 mr-1" /> Navigate
                </Button>
                {selected && (
                  <Button
                    variant="outline"
                    className="rounded-xl h-10 text-xs"
                    onClick={() => setSelected(null)}
                  >
                    Show Nearest
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Hospital badge — bottom right */}
      <div className="absolute bottom-6 right-6 z-20">
        <div className="flex items-center gap-3 bg-background/90 backdrop-blur-xl px-4 py-3 rounded-2xl border border-border/50 shadow-xl">
          <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center">
            <Building2 className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-xs font-bold leading-none">Babcock Health Centre</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {studentLocation ? formatDistance(distanceMetres(studentLocation[0], studentLocation[1], BABCOCK_HOSPITAL.lat, BABCOCK_HOSPITAL.lng)) : "Distance unavailable"} away
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
