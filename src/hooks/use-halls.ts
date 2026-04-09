import { useEffect, useState } from 'react'
import { hallService, type Hall } from '@/lib/services/hall-service'
import { HALLS as STATIC_HALLS } from '@/data/halls'

// Convert the static HallCubicle[] to the full Hall row shape used everywhere
const FALLBACK_HALLS: Hall[] = STATIC_HALLS.map(h => ({
  ...h,
  description: null,
  created_at: new Date(0).toISOString(),
}))

export function useHalls() {
  const [halls, setHalls] = useState<Hall[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchHalls() {
      try {
        setLoading(true)
        const data = await hallService.getAll()
        // If Supabase returns empty (table not seeded / RLS blocks reads),
        // fall back to the static hall definitions so the UI always works.
        setHalls(data.length > 0 ? data : FALLBACK_HALLS)
      } catch (e: any) {
        setError(e)
        setHalls(FALLBACK_HALLS)
      } finally {
        setLoading(false)
      }
    }

    fetchHalls()
  }, [])

  return { halls, loading, error }
}
