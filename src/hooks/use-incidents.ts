import { useEffect, useState } from 'react'
import { incidentService, type Incident } from '@/lib/services/incident-service'

export function useIncidents(hallId?: string) {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const data = hallId 
          ? await incidentService.getByHall(hallId)
          : await incidentService.getAll()
        setIncidents(data)
      } catch (e: any) {
        setError(e)
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // Real-time subscription
    const subscription = incidentService.subscribeToIncidents((payload) => {
      if (payload.eventType === 'INSERT') {
        const newIncident = payload.new as Incident
        const isRelevant = !hallId || 
          newIncident.hall_id === hallId || 
          (newIncident.nearest_halls && newIncident.nearest_halls.includes(hallId))
        
        if (isRelevant) {
          setIncidents(prev => [newIncident, ...prev])
        }
      } else if (payload.eventType === 'UPDATE') {
        const updated = payload.new as Incident
        setIncidents(prev => prev.map(i => i.id === updated.id ? updated : i))
      } else if (payload.eventType === 'DELETE') {
        setIncidents(prev => prev.filter(i => i.id !== payload.old.id))
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [hallId])

  return { incidents, loading, error }
}
