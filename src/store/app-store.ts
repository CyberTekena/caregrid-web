// Module-level pub-sub store — shared across all portals client-side.
// Replace with API calls when a backend is added.

export type RequestStatus = "pending" | "on-route" | "resolved"

export type EmergencyRequest = {
  id: string
  studentName: string
  hallId: string
  hallName: string
  room: string
  type: string
  description: string
  status: RequestStatus
  timestamp: Date
  essScore: number
}

export type AppState = {
  requests: EmergencyRequest[]
}

// ─── Seed data ───────────────────────────────────────────────────────────────

let state: AppState = {
  requests: [
    {
      id: "demo-1",
      studentName: "Michael Doe",
      hallId: "welch",
      hallName: "Welch Hall",
      room: "RM 212",
      type: "Severe Asthma",
      description: "Difficulty breathing, inhaler not working. Allergic to penicillin.",
      status: "pending",
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      essScore: 9.2,
    },
    {
      id: "demo-2",
      studentName: "Samuel Ike",
      hallId: "winslow",
      hallName: "Winslow Hall",
      room: "RM 210",
      type: "Fever",
      description: "High fever 39.8°C, chills and body aches for 6 hours.",
      status: "pending",
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      essScore: 4.2,
    },
  ],
}

// ─── Pub-sub ─────────────────────────────────────────────────────────────────

type Listener = () => void
const listeners = new Set<Listener>()

function notify() {
  listeners.forEach((l) => l())
}

// ─── Store API ───────────────────────────────────────────────────────────────

export const appStore = {
  getState(): AppState {
    return state
  },

  subscribe(listener: Listener): () => void {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },

  // Student SOS → new request in cubicle queue
  addRequest(req: Pick<EmergencyRequest, "studentName" | "hallId" | "hallName" | "room" | "type" | "description" | "essScore">) {
    state = {
      ...state,
      requests: [
        {
          ...req,
          id: Math.random().toString(36).slice(2),
          status: "pending",
          timestamp: new Date(),
        },
        ...state.requests,
      ],
    }
    notify()
  },

  markOnRoute(id: string) {
    state = {
      ...state,
      requests: state.requests.map((r) =>
        r.id === id ? { ...r, status: "on-route" as RequestStatus } : r
      ),
    }
    notify()
  },

  resolveRequest(id: string) {
    state = {
      ...state,
      requests: state.requests.map((r) =>
        r.id === id ? { ...r, status: "resolved" as RequestStatus } : r
      ),
    }
    notify()
  },
}
