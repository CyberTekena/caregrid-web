import { useState, useEffect } from 'react'
import { profileService } from '@/lib/services/profile-service'

export function useStudentCount() {
  const [count, setCount] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCount = async () => {
      try {
        setLoading(true)
        const studentCount = await profileService.getStudentCount()
        setCount(studentCount)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch student count')
        console.error('Error fetching student count:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCount()
  }, [])

  return { count, loading, error }
}