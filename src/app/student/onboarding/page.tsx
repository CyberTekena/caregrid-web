"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

import { useCurrentUser } from "@/hooks/use-current-user"
import { useHalls } from "@/hooks/use-halls"
import { profileService } from "@/lib/services/profile-service"

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
const genotypes = ["AA", "AS", "SS", "AC", "SC"]

export default function StudentOnboardingPage() {
  const router = useRouter()
  const { user, session, loading: userLoading } = useCurrentUser()
  const { halls, loading: hallsLoading } = useHalls()

  const [fullName, setFullName] = useState("")
  const [hallId, setHallId] = useState("")
  const [roomNumber, setRoomNumber] = useState("")
  const [bloodGroup, setBloodGroup] = useState("")
  const [genotype, setGenotype] = useState("")
  const [allergies, setAllergies] = useState("")
  const [conditions, setConditions] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (user) {
      setFullName(user.full_name ?? "")
      setHallId(user.hall_id ?? "")
      setRoomNumber(user.room_number ?? "")
      setBloodGroup(user.blood_group ?? "")
      setGenotype(user.genotype ?? "")
      setAllergies(Array.isArray(user.allergies) ? user.allergies.join(", ") : user.allergies ?? "")
      setConditions(Array.isArray(user.conditions) ? user.conditions.join(", ") : user.conditions ?? "")
    }
  }, [user])

  // Redirect unauthenticated users to login
  useEffect(() => {
    if (!userLoading && !session) {
      router.push("/login")
    }
  }, [session, userLoading, router])

  // If profile is already complete, send straight to dashboard
  useEffect(() => {
    if (!userLoading && user) {
      const complete = user.full_name && user.hall_id && user.blood_group && user.genotype && user.room_number
      if (complete) {
        router.replace("/student/dashboard")
      }
    }
  }, [userLoading, user, router])

  const isProfileReady = useMemo(() => {
    return !!fullName && !!hallId && !!roomNumber && !!bloodGroup && !!genotype
  }, [fullName, hallId, roomNumber, bloodGroup, genotype])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    if (!isProfileReady) {
      toast.error("Missing information", {
        description: "Please complete your name, hall, room, blood group and genotype."
      })
      return
    }

    setIsSaving(true)
    try {
      await profileService.update(user.id, {
        full_name: fullName,
        hall_id: hallId,
        room_number: roomNumber,
        blood_group: bloodGroup,
        genotype,
        allergies: allergies.split(",").map((item) => item.trim()).filter(Boolean),
        conditions: conditions.split(",").map((item) => item.trim()).filter(Boolean),
      })

      toast.success("Profile complete", {
        description: "Your student health profile has been saved."
      })
      router.push("/student/dashboard")
    } catch (error) {
      toast.error("Save failed", {
        description: "Unable to save your profile. Please try again."
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (userLoading || hallsLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg font-semibold text-foreground mb-2">Preparing your onboarding</p>
          <p className="text-muted-foreground">This may take a moment while we load your health profile.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <div className="max-w-4xl mx-auto p-6 md:p-10">
        <Button variant="ghost" onClick={() => router.push("/login")} className="mb-6 text-sm text-primary hover:text-primary/80">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
        </Button>

        <Card className="border-border/50 bg-background/80 shadow-xl shadow-black/5 overflow-hidden">
          <CardHeader className="space-y-3 p-8">
            <div className="flex items-center gap-3 text-primary">
              <CheckCircle2 className="w-6 h-6" />
              <span className="text-sm font-bold uppercase tracking-[0.24em]">Student Onboarding</span>
            </div>
            <CardTitle className="text-3xl font-black">Complete your student profile</CardTitle>
            <CardDescription>
              Your account is verified. Finish setting up your Babcock health profile so your hall responders can assist you faster.
            </CardDescription>
          </CardHeader>

          <CardContent className="grid gap-6 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="full-name">Full Name</Label>
                  <Input id="full-name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hall">Hall / Cubicle</Label>
                  <Select value={hallId} onValueChange={(value) => setHallId(value ?? "")}>
                    <SelectTrigger id="hall" className="h-12">
                      <SelectValue placeholder="Select your hall" />
                    </SelectTrigger>
                    <SelectContent>
                      {halls.map((hall) => (
                        <SelectItem key={hall.id} value={hall.id}>{hall.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="room-number">Room Number</Label>
                  <Input id="room-number" value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="blood-group">Blood Group</Label>
                  <Select value={bloodGroup} onValueChange={(value) => setBloodGroup(value ?? "")}>
                    <SelectTrigger id="blood-group" className="h-12">
                      <SelectValue placeholder="Choose blood group" />
                    </SelectTrigger>
                    <SelectContent>
                      {bloodGroups.map((group) => (
                        <SelectItem key={group} value={group}>{group}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="genotype">Genotype</Label>
                  <Select value={genotype} onValueChange={(value) => setGenotype(value ?? "")}>
                    <SelectTrigger id="genotype" className="h-12">
                      <SelectValue placeholder="Choose genotype" />
                    </SelectTrigger>
                    <SelectContent>
                      {genotypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="allergies">Allergies</Label>
                  <Input id="allergies" placeholder="Comma-separated" value={allergies} onChange={(e) => setAllergies(e.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="conditions">Active Conditions</Label>
                <Textarea id="conditions" placeholder="Comma-separated" value={conditions} onChange={(e) => setConditions(e.target.value)} rows={4} />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Required fields: full name, hall, room, blood group, and genotype.</p>
                </div>
                <Button type="submit" className="h-12 rounded-xl" disabled={isSaving || !isProfileReady}>
                  {isSaving ? (
                    <><Loader2 className="w-4 h-4 animate-spin mr-2" />Saving...</>
                  ) : (
                    "Save Profile"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
