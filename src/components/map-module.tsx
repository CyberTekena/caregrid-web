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
  active:   makeHouseIcon("#16a34a"), // green
  busy:     makeHouseIcon("#d97706"), // amber
  inactive: makeHouseIcon("#6b7280"), // gray
}

const HOSPITAL_ICON = L.divIcon({
  className: "",
  html: `
    <div style="filter:drop-shadow(0 2px 6px rgba(220,38,38,0.5))">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="34" height="34">
        <rect x="2" y="2" width="20" height="20" rx="3" fill="#dc2626"/>
        <path fill="white" d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4z"/>
      </svg>
    </div>`,
  iconSize: [34, 34],
  iconAnchor: [17, 34],
  popupAnchor: [0, -36],
})

const YOU_ARE_HERE_ICON = L.divIcon({
  className: "",
  html: `
    <div style="position:relative;width:22px;height:22px">
      <div style="
        position:absolute;inset:-10px;
        background:rgba(37,99,235,0.2);
        border-radius:50%;
        animation:ping 1.2s cubic-bezier(0,0,0.2,1) infinite
      "></div>
      <div style="
        width:22px;height:22px;
        background:#2563eb;
        border-radius:50%;
        border:3px solid white;
        box-shadow:0 2px 8px rgba(37,99,235,0.5);
        position:relative;z-index:1
      "></div>
    </div>`,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
  popupAnchor: [0, -14],
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
      pathOptions={{ color: "#2563eb", weight: 4, dashArray: "10, 6", lineCap: "round" }}
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

export type MapModuleProps = {
  halls: HallCubicle[]
  userLocation?: [number, number]
  activeRoute?: { from: [number, number]; to: [number, number] }
  hospital?: { name: string; lat: number; lng: number }
  className?: string
  onHallClick?: (hall: HallCubicle) => void
}

// ─── Constants ──────────────────────────────────────────────────────────────

const DEFAULT_CENTER: [number, number] = [6.8937, 3.7247]

const BABCOCK_BOUNDS: [[number, number], [number, number]] = [
  [6.889, 3.719],
  [6.897, 3.730],
]

// ─── Main component ─────────────────────────────────────────────────────────

export default function MapModule({
  halls,
  userLocation,
  activeRoute,
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
        zoom={17}
        minZoom={16}
        maxZoom={18}
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
            icon={HOUSE_ICONS[hall.status]}
            eventHandlers={{ click: () => onHallClick?.(hall) }}
          >
            <Popup>
              <div className="font-sans min-w-[140px]">
                <span className="block font-bold text-sm mb-1">{hall.name.replace(" Cubicle", "")}</span>
                <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                  hall.status === "active"   ? "bg-green-100 text-green-700" :
                  hall.status === "busy"     ? "bg-amber-100 text-amber-700" :
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
                <span className="block font-bold text-sm text-red-700 mb-1">{hospital.name}</span>
                <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-50 text-red-600">
                  HEALTH CENTRE
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
      </MapContainer>
    </div>
  )
}
