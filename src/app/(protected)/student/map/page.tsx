"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { MapPin, Navigation, Info, Building2, Search, Filter, X } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MapModule } from "@/components/map-wrapper"
import { HALLS, BABCOCK_HOSPITAL, BABCOCK_CENTER, hallsSortedByDistance, distanceMetres } from "@/data/halls"
import type { HallCubicle } from "@/components/map-module"

// Student's hall — in a real app this would come from auth context
const STUDENT_HALL_ID = "welch"
const STUDENT_HALL = HALLS.find(h => h.id === STUDENT_HALL_ID)!
const STUDENT_LOCATION: [number, number] = [STUDENT_HALL.lat, STUDENT_HALL.lng]

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
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<HallCubicle | null>(null)

  const sorted = useMemo(() => hallsSortedByDistance(STUDENT_LOCATION), [])

  const filtered = useMemo(() => {
    if (!search.trim()) return sorted
    const q = search.toLowerCase()
    return sorted.filter(h => h.name.toLowerCase().includes(q))
  }, [search, sorted])

  const nearest = sorted[0]

  const activeRoute = selected
    ? { from: STUDENT_LOCATION, to: [selected.lat, selected.lng] as [number, number] }
    : nearest
    ? { from: STUDENT_LOCATION, to: [nearest.lat, nearest.lng] as [number, number] }
    : undefined

  const displayHall = selected ?? nearest

  const distanceToDisplay = displayHall
    ? distanceMetres(STUDENT_LOCATION, [displayHall.lat, displayHall.lng])
    : 0

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-theme(spacing.16))] font-sans relative">

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
          halls={HALLS}
          userLocation={STUDENT_LOCATION}
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
                <Button className="rounded-xl bg-primary hover:bg-primary/90 text-white font-bold h-10 text-xs">
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
              {formatDistance(distanceMetres(STUDENT_LOCATION, [BABCOCK_HOSPITAL.lat, BABCOCK_HOSPITAL.lng]))} away
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
