import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { profileService, type Profile } from '@/lib/services/profile-service'

export function useCurrentUser() {
  const [user, setUser] = useState<Profile | null>(null)
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let mounted = true

    async function loadUser() {
      try {
        setLoading(true)

        const sessionResponse = await supabase.auth.getSession()
        if (mounted) {
          setSession(sessionResponse.data.session)
        }

        const profile = await profileService.getCurrentUser()
        if (mounted) {
          setUser(profile ?? null)
        }
      } catch (e: any) {
        if (mounted) {
          setError(e)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    // Load initial user
    loadUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (mounted) {
        setSession(session ?? null)
      }

      if (event === 'SIGNED_IN' && session?.user) {
        try {
          const profile = await profileService.getCurrentUser()
          if (mounted) {
            setUser(profile)
            setError(null)
          }
        } catch (e: any) {
          if (mounted) {
            setError(e)
          }
        }
      } else if (event === 'SIGNED_OUT') {
        if (mounted) {
          setUser(null)
          setError(null)
        }
      }
      if (mounted) {
        setLoading(false)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  return { user, session, loading, error }
}