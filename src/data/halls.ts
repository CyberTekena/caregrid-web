import { HallCubicle } from "@/components/map-module"

// ─────────────────────────────────────────────────────────────────────────────
// All coordinates sourced from OpenStreetMap (© OpenStreetMap contributors, ODbL)
// Campus area: ~6.892–6.895°N, 3.721–3.728°E (Ilishan-Remo, Ogun State, Nigeria)
// ─────────────────────────────────────────────────────────────────────────────

export const BABCOCK_HOSPITAL: { name: string; lat: number; lng: number } = {
  name: "Babcock University Health Centre",
  // Located on campus — estimated from campus centre pending OSM node
  lat: 6.8935,
  lng: 3.7238,
}

// Geographic centre of the hall cluster (used as map default view)
export const BABCOCK_CENTER: [number, number] = [6.8937, 3.7247]

export const HALLS: HallCubicle[] = [
  // ── Premium Male ─────────────────────────────────────────────
  {
    id: "welch",
    name: "Welch Hall Cubicle",
    lat: 6.8917506,
    lng: 3.7214357,
    status: "busy",
  },
  {
    id: "neal-wilson",
    name: "Neal Wilson Hall Cubicle",
    lat: 6.8930534,
    lng: 3.7217164,
    status: "active",
  },
  {
    id: "nelson-mandela",
    name: "Nelson Mandela Hall Cubicle",
    lat: 6.8934727,
    lng: 3.7230408,
    status: "active",
  },

  // ── Classic Male ─────────────────────────────────────────────
  {
    id: "winslow",
    name: "Winslow Hall Cubicle",
    lat: 6.8940085,
    lng: 3.7216602,
    status: "active",
  },
  {
    id: "gideon-troopers",
    name: "Gideon Troopers Hall Cubicle",
    lat: 6.8944243,
    lng: 3.7224928,
    status: "active",
  },
  {
    id: "bethel-splendor",
    name: "Bethel Splendor Hall Cubicle",
    lat: 6.8946086,
    lng: 3.7230729,
    status: "active",
  },
  {
    id: "samuel-akande",
    name: "Samuel Akande Hall Cubicle",
    lat: 6.8941305,
    lng: 3.7236374,
    status: "active",
  },
  {
    id: "gamaliel",
    name: "Gamaliel Hall Cubicle",
    // Regular male hall — coordinates estimated from campus layout
    lat: 6.8952,
    lng: 3.7221,
    status: "active",
  },

  // ── Premium Female ───────────────────────────────────────────
  {
    id: "havilah-gold",
    name: "Havilah Gold Hall Cubicle",
    lat: 6.8948787,
    lng: 3.7260748,
    status: "active",
  },
  {
    id: "crystal",
    name: "Crystal Hall Cubicle",
    lat: 6.8928556,
    lng: 3.7277415,
    status: "active",
  },

  // ── Classic Female ───────────────────────────────────────────
  {
    id: "ameyo-adadevoh",
    name: "Ameyo Adadevoh Hall Cubicle",
    lat: 6.8949448,
    lng: 3.7249274,
    status: "active",
  },
  {
    id: "felicia-dada",
    name: "Felicia Adebisi Dada Hall Cubicle",
    lat: 6.8936738,
    lng: 3.7249784,
    status: "active",
  },
  {
    id: "queen-esther",
    name: "Queen Esther Hall Cubicle",
    lat: 6.8929791,
    lng: 3.7247012,
    status: "busy",
  },
  {
    id: "justice-deborah",
    name: "Justice Deborah Hall Cubicle",
    // Classic female hall — coordinates estimated from campus layout
    lat: 6.8932,
    lng: 3.7241,
    status: "active",
  },

  // ── Regular Female ───────────────────────────────────────────
  {
    id: "white",
    name: "White Hall Cubicle",
    lat: 6.8937701,
    lng: 3.7263304,
    status: "active",
  },
  {
    id: "nyberg",
    name: "Nyberg Hall Cubicle",
    lat: 6.8925971,
    lng: 3.7253785,
    status: "active",
  },
  {
    id: "ogden",
    name: "Ogden Hall Cubicle",
    lat: 6.8928285,
    lng: 3.7263810,
    status: "active",
  },
  {
    id: "platinum",
    name: "Platinum Hall Cubicle",
    lat: 6.8924519,
    lng: 3.7274199,
    status: "inactive",
  },
]

// Quick lookup by hall id
export const HALL_BY_ID: Record<string, HallCubicle> = Object.fromEntries(
  HALLS.map((h) => [h.id, h])
)

// Haversine distance in metres between two lat/lng points
export function distanceMetres(
  a: [number, number],
  b: [number, number]
): number {
  const R = 6371000
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(b[0] - a[0])
  const dLng = toRad(b[1] - a[1])
  const sinDLat = Math.sin(dLat / 2)
  const sinDLng = Math.sin(dLng / 2)
  const c =
    sinDLat * sinDLat +
    Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * sinDLng * sinDLng
  return R * 2 * Math.atan2(Math.sqrt(c), Math.sqrt(1 - c))
}

// Returns halls sorted by distance from a given position
export function hallsSortedByDistance(
  from: [number, number]
): (HallCubicle & { distanceM: number })[] {
  return HALLS.map((h) => ({
    ...h,
    distanceM: distanceMetres(from, [h.lat, h.lng]),
  })).sort((a, b) => a.distanceM - b.distanceM)
}
