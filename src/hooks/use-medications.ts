import { useEffect, useState } from 'react'
import { medicationService, type Medication } from '@/lib/services/medication-service'

export function useMedications(studentId: string) {
  const [meds, setMeds] = useState<Medication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchMeds() {
      try {
        setLoading(true)
        const data = await medicationService.getByStudentId(studentId)
        setMeds(data)
      } catch (e: any) {
        setError(e)
        console.error("Med Fetch Error:", e)
      } finally {
        setLoading(false)
      }
    }

    if (studentId) fetchMeds()
  }, [studentId])

  const markTaken = async (medId: string) => {
    try {
      await medicationService.markTaken(medId)
      setMeds(prev => prev.map(m => m.id === medId ? { ...m, last_taken: new Date().toISOString() } : m))
    } catch (e: any) {
      setError(e)
      throw e
    }
  }

  return { meds, loading, error, markTaken }
}
