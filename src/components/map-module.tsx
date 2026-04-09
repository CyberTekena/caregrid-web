"use client"

import { useEffect, useRef, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// ─── Custom DivIcons ────────────────────────────────────────────────────────

function makeHouseIcon(color: string) {
  return L.divIcon({
    className: "",
    html: `
      <div style="filter:drop-shadow(0 2px 4px rgba(0,0,0,0.35))">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28">
          <path fill="${color}" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          <path fill="rgba(255,255,255,0.25)" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
        </svg>
      </div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -30],
  })
}

const HOUSE_ICONS = {
  active:   makeHouseIcon("#123A78"), // Babcock Blue
  busy:     makeHouseIcon("#D4A62A"), // Babcock Gold
  inactive: makeHouseIcon("#94a3b8"), // Slate gray
}

const HOSPITAL_ICON = L.divIcon({
  className: "",
  html: `
    <div style="filter:drop-shadow(0 4px 12px rgba(18,58,120,0.3))">
      <div style="
        width: 38px; height: 38px;
        background: white;
        border: 3px solid #123A78;
        border-radius: 12px;
        display: flex; align-items: center; justify-content: center;
        box-shadow: inset 0 0 0 2px white;
      ">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
          <path fill="#123A78" d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4z"/>
        </svg>
      </div>
    </div>`,
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -40],
})

const YOU_ARE_HERE_ICON = L.divIcon({
  className: "",
  html: `
    <div style="position:relative;width:24px;height:24px">
      <div style="
        position:absolute;inset:-12px;
        background:rgba(18,58,120,0.25);
        border-radius:50%;
        animation:pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite
      "></div>
      <div style="
        width:24px;height:24px;
        background:#123A78;
        border-radius:50%;
        border:2px solid white;
        box-shadow: 0 4px 12px rgba(18,58,120,0.4);
        position:relative;z-index:2;
        display:flex; align-items:center; justify-content:center;
      ">
         <div style="width:8px; height:8px; background:white; border-radius:50%; opacity:0.8"></div>
      </div>
    </div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -16],
})

const INCIDENT_ICON = L.divIcon({
  className: "",
  html: `
    <div style="position:relative;width:32px;height:32px">
      <div style="
        position:absolute;inset:-8px;
        background:rgba(239,68,68,0.4);
        border-radius:50%;
        animation:pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite
      "></div>
      <div style="
        width:32px;height:32px;
        background:#ef4444;
        border-radius:50%;
        border:3px solid white;
        box-shadow: 0 4px 12px rgba(239,68,68,0.5);
        display:flex; align-items:center; justify-content:center;
        color:white;
      ">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px">
          <path d="M12 9v4"/><path d="M12 17h.01"/><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
        </svg>
      </div>
    </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
})

const RESPONDER_ICON = L.divIcon({
  className: "",
  html: `
    <div style="position:relative;width:32px;height:32px">
      <div style="
        width:32px;height:32px;
        background:#123A78;
        border-radius:10px;
        border:2px solid white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        display:flex; align-items:center; justify-content:center;
        color:white;
      ">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:18px;height:18px">
          <path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9"/><polyline points="13 11 9 17 15 17 11 23"/>
        </svg>
      </div>
    </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
})

// ─── Inner components ───────────────────────────────────────────────────────

// Calls invalidateSize once after mount so tiles render correctly inside
// flex/animated containers (common Leaflet + React issue)
function MapInit() {
  const map = useMap()
  useEffect(() => {
    const t = setTimeout(() => map.invalidateSize(), 150)
    return () => clearTimeout(t)
  }, [map])
  return null
}

// Flies to the given centre only when it actually changes — never fights
// the user's own zoom/pan gestures because deps are stable values
function FlyToLocation({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap()
  const prev = useRef<string>("")
  useEffect(() => {
    const key = `${center[0]},${center[1]}`
    if (key === prev.current) return
    prev.current = key
    map.flyTo(center, zoom, { duration: 0.8 })
  }, [center[0], center[1]])
  return null
}

function FitBoundsControl({ halls }: { halls: HallCubicle[] }) {
  const map = useMap()
  const fit = () => {
    if (!halls.length) return
    const bounds = L.latLngBounds(halls.map((h) => [h.lat, h.lng]))
    map.fitBounds(bounds.pad(0.08))
  }
  return (
    <div className="leaflet-bottom leaflet-left" style={{ zIndex: 1000, marginBottom: "24px", marginLeft: "10px" }}>
      <div className="leaflet-control leaflet-bar">
        <a
          href="#"
          role="button"
          title="Fit all halls"
          onClick={(e) => { e.preventDefault(); fit() }}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: "34px", height: "34px", fontSize: "16px", fontWeight: "bold",
            textDecoration: "none", color: "#333"
          }}
        >
          ⊞
        </a>
      </div>
    </div>
  )
}

// Real walking route via OSRM public API
function WalkingRoute({ from, to }: { from: [number, number]; to: [number, number] }) {
  const [coords, setCoords] = useState<[number, number][]>([])

  useEffect(() => {
    // OSRM expects lng,lat — Leaflet uses lat,lng
    const url =
      `https://router.project-osrm.org/route/v1/foot/` +
      `${from[1]},${from[0]};${to[1]},${to[0]}` +
      `?overview=full&geometries=geojson`

    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        const raw: [number, number][] = data?.routes?.[0]?.geometry?.coordinates
        if (raw?.length) {
          setCoords(raw.map(([lng, lat]) => [lat, lng])) // flip to [lat, lng] for Leaflet
        } else {
          setCoords([from, to]) // fallback straight line
        }
      })
      .catch(() => setCoords([from, to]))
  }, [from[0], from[1], to[0], to[1]])

  if (coords.length < 2) return null

  return (
    <Polyline
      positions={coords}
      pathOptions={{ color: "#123A78", weight: 4, dashArray: "10, 6", lineCap: "round" }}
    />
  )
}

// ─── Types ──────────────────────────────────────────────────────────────────

export type HallCubicle = {
  id: string
  name: string
  lat: number
  lng: number
  status: "active" | "inactive" | "busy"
}

export type IncidentGeo = {
  id: string
  lat: number
  lng: number
  type: string
}

export type MapModuleProps = {
  halls: HallCubicle[]
  userLocation?: [number, number]
  activeRoute?: { from: [number, number]; to: [number, number] }
  activeIncidents?: IncidentGeo[]
  responderLocation?: [number, number]
  hospital?: { name: string; lat: number; lng: number }
  className?: string
  onHallClick?: (hall: HallCubicle) => void
}

// ─── Constants ──────────────────────────────────────────────────────────────

const DEFAULT_CENTER: [number, number] = [6.8937, 3.7247]

const BABCOCK_BOUNDS: [[number, number], [number, number]] = [
  [6.891, 3.721],
  [6.8955, 3.728],
]

// ─── Main component ─────────────────────────────────────────────────────────

export default function MapModule({
  halls,
  userLocation,
  activeRoute,
  activeIncidents,
  responderLocation,
  hospital,
  className,
  onHallClick,
}: MapModuleProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className={`bg-muted flex items-center justify-center animate-pulse rounded-lg border border-border/50 ${className || "h-[400px]"}`}>
        <p className="text-muted-foreground font-medium">Loading Map...</p>
      </div>
    )
  }

  const center = userLocation || DEFAULT_CENTER

  return (
    <div className={`relative overflow-hidden rounded-lg shadow-sm border border-border/50 z-0 ${className || "h-[400px]"}`}>
      <MapContainer
        center={center}
        zoom={19.5}
        minZoom={18}
        maxZoom={21}
        maxBounds={BABCOCK_BOUNDS}
        maxBoundsViscosity={1.0}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        <MapInit />
        {userLocation && <FlyToLocation center={userLocation} zoom={18} />}

        <FitBoundsControl halls={halls} />

        {/* Hall cubicle markers — house icons coloured by status */}
        {halls?.map((hall) => (
          <Marker
            key={hall.id}
            position={[hall.lat, hall.lng]}
            icon={HOUSE_ICONS[hall.status as keyof typeof HOUSE_ICONS]}
            eventHandlers={{ click: () => onHallClick?.(hall) }}
          >
            <Popup>
              <div className="font-sans min-w-[140px]">
                <span className="block font-bold text-sm mb-1">{hall.name}</span>
                <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                  hall.status === "active"   ? "bg-primary/10 text-primary" :
                  hall.status === "busy"     ? "bg-accent/10 text-accent" :
                                               "bg-gray-100 text-gray-600"
                }`}>
                  {hall.status.toUpperCase()}
                </span>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Hospital marker */}
        {hospital && (
          <Marker position={[hospital.lat, hospital.lng]} icon={HOSPITAL_ICON}>
            <Popup>
              <div className="font-sans min-w-[160px]">
                <span className="block font-bold text-sm text-primary mb-1">{hospital.name}</span>
                <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary/5 text-primary">
                  BUTH MAIN CAMPUS
                </span>
              </div>
            </Popup>
          </Marker>
        )}

        {/* You are here */}
        {userLocation && (
          <Marker position={userLocation} icon={YOU_ARE_HERE_ICON}>
            <Popup>
              <span className="font-bold text-blue-600 text-sm">You are here</span>
            </Popup>
          </Marker>
        )}

        {/* Real OSRM walking route */}
        {activeRoute && (
          <WalkingRoute from={activeRoute.from} to={activeRoute.to} />
        )}

        {/* Active Emergency Incidents */}
        {activeIncidents?.map((inc) => (
          <Marker
            key={inc.id}
            position={[inc.lat, inc.lng]}
            icon={INCIDENT_ICON}
          >
            <Popup>
              <div className="font-bold text-destructive">
                ACTIVE {inc.type.toUpperCase()}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Live Responder Position */}
        {responderLocation && (
          <Marker
            position={responderLocation}
            icon={RESPONDER_ICON}
          >
            <Popup>
              <div className="font-bold text-primary">
                RESPONDER EN-ROUTE
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  )
}
