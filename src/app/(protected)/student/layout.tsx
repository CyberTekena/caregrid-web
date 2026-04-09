"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useCurrentUser } from "@/hooks/use-current-user"

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, session, loading } = useCurrentUser()

  const isIncompleteStudent =
    user?.role === "student" &&
    (!user.full_name || !user.hall_id || !user.blood_group || !user.genotype || !user.room_number)

  useEffect(() => {
    if (loading) return

    // Not authenticated → send to login
    if (!session) {
      router.replace("/login")
      return
    }

    // Authenticated but profile incomplete → send to standalone onboarding
    if (isIncompleteStudent) {
      router.replace("/student/onboarding")
    }
  }, [loading, session, isIncompleteStudent, router])

  // While loading we don't know yet — just render children so pages can show
  // their own skeletons rather than a full-screen block on every navigation.
  // The useEffect above will redirect if anything is wrong once the check completes.
  return <>{children}</>
}
