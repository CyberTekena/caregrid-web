"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import {
  MapPin,
  Navigation,
  Phone,
  ShieldAlert,
  Bell,
  ChevronRight,
  Activity,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { MapModule } from "@/components/map-wrapper"
import { LoadingScreen } from "@/components/loading-screen"
import { useCurrentUser } from "@/hooks/use-current-user"
import { useHalls } from "@/hooks/use-halls"
import { BABCOCK_HOSPITAL, hallsSortedByDistance } from "@/data/halls"
import { incidentService } from "@/lib/services/incident-service"

export default function StudentEmergency() {
  const { user } = useCurrentUser()
  const { halls, loading: hallsLoading } = useHalls()
  const [isEmergencyActive, setIsEmergencyActive] = useState(false)
  const [reportForOther, setReportForOther] = useState(false)
  const [otherName, setOtherName] = useState("")
  const [notifyFamily, setNotifyFamily] = useState(true)
  const [loading, setLoading] = useState(false)
  const emergencyTypeRef = useRef("asthma")
  const descriptionRef = useRef("")
  const [responderPos, setResponderPos] = useState<[number, number] | undefined>(undefined)
  const [browserLocation, setBrowserLocation] = useState<[number, number] | null>(null)
  const [isOffCampus, setIsOffCampus] = useState(false)
  const [isDemoMode, setIsDemoMode] = useState(false)

  // Request browser geolocation on mount
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude: lat, longitude: lng } = position.coords
          setBrowserLocation([lat, lng])
          
          // Geofencing Check: Babcock University approx bounds
          const offCampus = lat < 6.890 || lat > 6.898 || lng < 3.718 || lng > 3.732
          setIsOffCampus(offCampus)
        },
        (error) => {
          console.warn("Geolocation error:", error.message)
        }
      )
    }
  }, [])

  const studentHall = halls.find(h => h.id === user?.hall_id)
  const studentLocation: [number, number] | null = (browserLocation && !isDemoMode) 
    ? browserLocation 
    : (studentHall ? [studentHall.lat, studentHall.lng] : null)

  // Simulate responder movement for demo impact
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isEmergencyActive && studentLocation) {
      // Start near hospital
      const hospitalPos: [number, number] = [BABCOCK_HOSPITAL.lat, BABCOCK_HOSPITAL.lng]
      setResponderPos([hospitalPos[0], hospitalPos[1]])
      
      let step = 0
      interval = setInterval(() => {
        step += 1
        if (step > 20) {
           clearInterval(interval)
           return
        }
        // Linear interpolation towards student's hall
        const lat = hospitalPos[0] + (studentLocation[0] - hospitalPos[0]) * (step / 20)
        const lng = hospitalPos[1] + (studentLocation[1] - hospitalPos[1]) * (step / 20)
        setResponderPos([lat, lng])
      }, 2000)
    } else {
      setResponderPos(undefined)
    }
    return () => clearInterval(interval)
  }, [isEmergencyActive, studentLocation?.[0], studentLocation?.[1]])

  const hospitalPos: [number, number] = [BABCOCK_HOSPITAL.lat, BABCOCK_HOSPITAL.lng]

  const alertedCubicles = useMemo(() => {
    if (!isEmergencyActive || !studentLocation || !halls.length) return []
    const sorted = hallsSortedByDistance(studentLocation)
    return sorted.slice(0, 3).map(h => ({
      id: h.id,
      lat: h.lat,
      lng: h.lng,
      type: "SOS Alerted"
    }))
  }, [isEmergencyActive, studentLocation, halls.length])

  // Show loading state while data is being fetched
  if (hallsLoading || !user) {
    return <LoadingScreen message="Loading Emergency Services..." />
  }

  if (isOffCampus) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto space-y-6">
        <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center border-2 border-destructive/20">
          <ShieldAlert className="w-10 h-10 text-destructive" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black uppercase tracking-tight text-foreground">Out of Service Area</h1>
          <p className="text-muted-foreground font-medium">
            We apologize, but CareGrid SOS services are restricted to the **Babcock University campus boundaries** for rapid response.
          </p>
        </div>
        <div className="p-4 bg-muted/50 rounded-2xl border border-border/50 text-xs font-medium text-muted-foreground leading-relaxed">
          If you are experiencing a life-threatening emergency off-campus, please contact the national emergency services or visit the nearest medical facility.
        </div>
        
        <Button 
          variant="outline" 
          onClick={() => {
            setIsDemoMode(true)
            setIsOffCampus(false)
          }}
          className="w-full h-12 rounded-xl border-primary/20 text-primary hover:bg-primary/5 font-bold"
        >
          Demo Bypass: Use Hall Location
        </Button>
      </div>
    )
  }

  const emergencyLabels: Record<string, string> = {
    asthma: "Asthma Attack",
    injury: "Physical Injury",
    fever: "Severe Fever / Seizure",
    other: "Other Medical Crisis",
  }

  const handleSOS = async () => {
    if (!user) {
      toast.error("Authentication Error", { description: "Please log in to trigger emergency alerts." })
      return
    }

    if (!halls.length) {
      toast.error("System Error", { description: "Hall data is not yet synchronized. Please wait a moment and try again." })
      return
    }

    if (isOffCampus) {
      toast.error("Out of Service Area", { 
        description: "We apologize, but SOS services are restricted to the Babcock University campus boundaries.",
        duration: 6000
      })
      return
    }

    setLoading(true)
    try {
      // Find the nearest 2 halls based on current location
      const sortedHalls = studentLocation ? hallsSortedByDistance(studentLocation) : []
      const primaryHall = sortedHalls[0]?.id || user.hall_id || ""
      const nearestHalls = sortedHalls.slice(1, 3).map(h => h.id) // Get the next 2 nearest halls

      // Create persistent incident in Supabase
      await incidentService.create({
        student_id: user.id,
        student_name: reportForOther ? (otherName || "Unknown Student") : user.full_name || "Unknown Student",
        hall_id: primaryHall,
        nearest_halls: nearestHalls,
        room_number: user.room_number || "",
        type: emergencyLabels[emergencyTypeRef.current] ?? "Emergency",
        description: `${reportForOther ? `[3rd Party Report by ${user.full_name || "Unknown Reporter"}] ` : ""}${descriptionRef.current || "No description provided."}`,
        ess_score: emergencyTypeRef.current === "asthma" ? 9.2 : 6.0,
        is_third_party: reportForOther,
        third_party_name: reportForOther ? user.full_name || null : null,
        status: 'pending',
        latitude: studentLocation ? studentLocation[0] : null,
        longitude: studentLocation ? studentLocation[1] : null,
      })

      setIsEmergencyActive(true)
      const nearbyHallNames = sortedHalls.slice(0, 3).map(h => h.name).join(", ")
      toast.success("Emergency SOS Triggered!", {
        description: reportForOther 
          ? `SOS sent for ${otherName || "Unknown student"}. Dispatching nearest units.`
          : `Responders at ${nearbyHallNames} have been alerted to your location.`,
        duration: 10000,
      })

      if (notifyFamily && !reportForOther) {
        setTimeout(() => {
          toast.info("Family Notified", {
            description: "An SMS alert has been sent to your primary contact.",
          })
        }, 2000)
      }
    } catch (error) {
      console.error("SOS Failure:", error)
      toast.error("SOS Failed", { description: "Check your internet connection and try again." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 p-3 md:p-8 space-y-6 md:space-y-8 max-w-[1200px] mx-auto w-full relative z-10 font-sans">
      
      {/* Page Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
         <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground flex items-center gap-2">
               Emergency SOS
            </h1>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">Get immediate medical assistance from the nearest BUTH cubicle.</p>
         </div>
         {isEmergencyActive && (
            <Badge variant="destructive" className="animate-pulse h-10 px-6 rounded-full text-xs font-black uppercase tracking-widest border-2 border-white/20">
               Active Emergency Response
            </Badge>
         )}
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-5">
        
        {/* Left Column: SOS Trigger & Forms */}
        <div className="lg:col-span-2 space-y-6">
          <Card className={`border-border/50 bg-background/60 backdrop-blur-xl shadow-2xl shadow-black/5 transition-all duration-500 overflow-hidden ${isEmergencyActive ? 'ring-4 ring-destructive/20 border-destructive/30' : ''}`}>
             <div className={`h-2 transition-all duration-1000 ${isEmergencyActive ? 'bg-destructive animate-pulse' : 'bg-primary/20'}`} />
             
             <CardHeader className="pb-4">
               <CardTitle className="text-xl font-bold mb-2">Initialize Emergency Alert</CardTitle>
               <CardDescription>
                 Describe the situation. Responders will be dispatched to your current location immediately.
               </CardDescription>
             </CardHeader>

             <CardContent className="space-y-6">
                {/* Report for Others Toggle */}
                <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 space-y-3">
                   <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                         <h4 className="font-bold text-sm tracking-tight">Reporting for someone else?</h4>
                         <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">Help another student in need</p>
                      </div>
                      <Switch 
                         disabled={isEmergencyActive}
                         checked={reportForOther} 
                         onCheckedChange={setReportForOther} 
                      />
                   </div>
                   {reportForOther && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="pt-2">
                         <Label className="text-[10px] font-black uppercase tracking-widest mb-2 block">Student Name (if known)</Label>
                         <Input 
                            placeholder="Enter name or leave empty if unknown" 
                            className="bg-background/50 rounded-xl"
                            value={otherName}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOtherName(e.target.value)}
                         />
                      </motion.div>
                   )}
                </div>

                <div className="space-y-2">
                   <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Emergency Type</Label>
                   <Select disabled={isEmergencyActive} defaultValue="asthma" onValueChange={(v: string | null) => { if (v) emergencyTypeRef.current = v }}>
                      <SelectTrigger className="h-12 bg-muted/30 border-border/50 rounded-xl">
                         <SelectValue placeholder="Select emergency type" />
                      </SelectTrigger>
                      <SelectContent>
                         <SelectItem value="asthma">Asthma Attack</SelectItem>
                         <SelectItem value="injury">Physical Injury</SelectItem>
                         <SelectItem value="fever">Severe Fever / Seizure</SelectItem>
                         <SelectItem value="other">Other Medical Crisis</SelectItem>
                      </SelectContent>
                   </Select>
                </div>

                <div className="space-y-2">
                   <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Situation Description</Label>
                   <Textarea
                      disabled={isEmergencyActive}
                      placeholder={reportForOther ? "Describe what is happening to the other student..." : "e.g., Struggling to breathe, inhaler not responding..."}
                      className="min-h-[100px] bg-muted/30 border-border/50 rounded-xl resize-none"
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => { descriptionRef.current = e.target.value }}
                   />
                </div>

                {!reportForOther && (
                   <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 space-y-3">
                      <div className="flex items-center justify-between">
                         <div className="space-y-0.5">
                            <h4 className="font-bold text-sm flex items-center gap-2 tracking-tight">
                               <Bell className="w-4 h-4 text-primary" /> Notify Primary Contacts
                            </h4>
                            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">Automatic family SMS alert</p>
                         </div>
                         <Switch 
                            disabled={isEmergencyActive}
                            checked={notifyFamily} 
                            onCheckedChange={setNotifyFamily} 
                         />
                      </div>
                      {notifyFamily && (
                         <div className="bg-background/80 px-3 py-2 rounded-lg border border-border/50 flex items-center justify-between">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-70">Contact: Sarah Doe (Mother)</span>
                            <Badge variant="outline" className="text-[8px] h-4 border-primary/20 text-primary">Priority 1</Badge>
                         </div>
                      )}
                   </div>
                )}

                {!isEmergencyActive ? (
                   <motion.div whileTap={{ scale: 0.95 }}>
                      <Button 
                        onClick={handleSOS}
                        disabled={loading}
                        className="w-full h-20 rounded-2xl bg-destructive hover:bg-destructive/90 text-white font-black text-xl shadow-[0_0_40px_rgba(239,68,68,0.3)] border-4 border-white/20 transition-all group"
                      >
                         {loading ? (
                            <div className="flex items-center gap-3">
                               <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                               <span>SIGNALING...</span>
                            </div>
                         ) : (
                            <div className="flex flex-col items-center">
                               <span className="flex items-center gap-3">
                                  <ShieldAlert className="w-8 h-8 group-hover:scale-110 transition-transform" /> 
                                  TRIGGER SOS
                               </span>
                               <span className="text-[10px] opacity-60 font-medium tracking-[0.3em] mt-1">TAP TO SEND ALERT</span>
                            </div>
                         )}
                      </Button>
                   </motion.div>
                ) : (
                   <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
                      <div className="p-6 rounded-3xl bg-destructive/10 border-2 border-destructive/20 text-center space-y-2">
                         <div className="w-12 h-12 bg-destructive rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg shadow-destructive/20 animate-pulse">
                            <Activity className="w-6 h-6 text-white" />
                         </div>
                         <h3 className="text-xl font-black text-destructive uppercase tracking-tighter">Help is Coming</h3>
                         <p className="text-sm text-muted-foreground font-medium">Responders are on their way to your location. Stay calm and follow instructions.</p>
                      </div>
                      
                      <Button 
                        variant="outline"
                        onClick={() => setIsEmergencyActive(false)}
                        className="w-full h-12 rounded-xl border-destructive/20 text-destructive hover:bg-destructive/5 font-bold"
                      >
                         Cancel Emergency (Demo Reset)
                      </Button>
                   </motion.div>
                )}
             </CardContent>
          </Card>
        </div>

        {/* Right Column: Spatial Monitor & Guide */}
        <div className="lg:col-span-3 space-y-6">
           <Card className="border-border/50 bg-background/60 backdrop-blur-xl shadow-2xl h-[300px] md:h-[450px] overflow-hidden relative group">
              <MapModule
                 halls={halls}
                 userLocation={studentLocation || undefined}
                 hospital={BABCOCK_HOSPITAL}
                 activeIncidents={alertedCubicles}
                 responderLocation={responderPos}
                 className="h-full w-full rounded-none"
              />

              <div className="absolute top-6 left-6 z-10">
                 <Badge className="bg-background/80 backdrop-blur-md border-border text-foreground font-black py-2 px-4 shadow-xl">
                    Your Current Location
                 </Badge>
              </div>

              {isEmergencyActive && (
                 <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
                    <div className="w-32 h-32 bg-destructive/20 rounded-full animate-ping opacity-50" />
                 </div>
              )}
           </Card>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-border/50 bg-destructive/5 shadow-lg border-dashed">
                 <CardContent className="p-5 flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center text-destructive shrink-0">
                       <Navigation className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                       <h4 className="font-bold text-sm">Priority Dispatch</h4>
                       <p className="text-[10px] text-destructive/70 leading-relaxed uppercase tracking-widest font-bold">Responders coming to you</p>
                    </div>
                 </CardContent>
              </Card>
              <Card className="border-border/50 bg-accent/5 shadow-lg border-dashed">
                 <CardContent className="p-5 flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0">
                       <ShieldAlert className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                       <h4 className="font-bold text-sm">Institutional Security</h4>
                       <p className="text-[10px] text-muted-foreground leading-relaxed uppercase tracking-widest font-bold">History shared with BUTH</p>
                    </div>
                 </CardContent>
              </Card>
           </div>
        </div>

      </div>
    </div>
  )
}
