"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import {
  MapPin,
  Navigation,
  Phone,
  ShieldAlert,
  Bell,
  ChevronRight,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { MapModule } from "@/components/map-wrapper"
import { HALLS, HALL_BY_ID, BABCOCK_HOSPITAL } from "@/data/halls"
import { appStore } from "@/store/app-store"

// Hardcoded to Welch Hall student — replace with auth context when login is added
const STUDENT = { name: "Michael Doe", hallId: "welch", hallName: "Welch Hall", room: "RM 212" }

export default function StudentEmergency() {
  const [isEmergencyActive, setIsEmergencyActive] = useState(false)
  const [notifyFamily, setNotifyFamily] = useState(true)
  const emergencyTypeRef = useRef("asthma")
  const descriptionRef = useRef("")

  const emergencyLabels: Record<string, string> = {
    asthma: "Asthma Attack",
    injury: "Physical Injury",
    fever: "Severe Fever / Seizure",
    other: "Other Medical Crisis",
  }

  const handleSOS = () => {
    setIsEmergencyActive(true)

    // Push a live request into the shared store → cubicle staff sees it instantly
    appStore.addRequest({
      studentName: STUDENT.name,
      hallId: STUDENT.hallId,
      hallName: STUDENT.hallName,
      room: STUDENT.room,
      type: emergencyLabels[emergencyTypeRef.current] ?? "Emergency",
      description: descriptionRef.current || "No description provided.",
      essScore: emergencyTypeRef.current === "asthma" ? 9.2 : 6.0,
    })

    toast.success("Emergency SOS Triggered!", {
      description: "Responders at Welch Hall cubicle have been alerted.",
      duration: 10000,
    })

    if (notifyFamily) {
      setTimeout(() => {
        toast.info("Family Notified", {
          description: "An SMS alert has been sent to your primary contact (Sarah Doe).",
        })
      }, 2000)
    }
  }

  return (
    <div className="flex-1 p-4 md:p-8 space-y-8 max-w-[1200px] mx-auto w-full relative z-10 font-sans">
      
      {/* Page Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
         <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-2">
               Emergency SOS
            </h1>
            <p className="text-muted-foreground mt-1">Get immediate medical assistance in Welch Hall.</p>
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
                 Describe your symptoms if possible. Responders will see your medical history immediately.
               </CardDescription>
             </CardHeader>

             <CardContent className="space-y-6">
                <div className="space-y-2">
                   <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Emergency Type</Label>
                   <Select disabled={isEmergencyActive} defaultValue="asthma" onValueChange={(v: string) => { emergencyTypeRef.current = v }}>
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
                   <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Brief Description</Label>
                   <Textarea
                      disabled={isEmergencyActive}
                      placeholder="e.g., Struggling to breathe, inhaler not responding..."
                      className="min-h-[100px] bg-muted/30 border-border/50 rounded-xl resize-none"
                      onChange={e => { descriptionRef.current = e.target.value }}
                   />
                </div>

                {/* Advanced Feature: Contact Notification */}
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
                         id="notify-family"
                      />
                   </div>
                   {notifyFamily && (
                      <div className="bg-background/80 px-3 py-2 rounded-lg border border-border/50 flex items-center justify-between">
                         <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-70">Contact: Sarah Doe (Mother)</span>
                         <Badge variant="outline" className="text-[8px] h-4 border-primary/20 text-primary">Priority 1</Badge>
                      </div>
                   )}
                </div>

                {!isEmergencyActive ? (
                   <motion.div whileTap={{ scale: 0.95 }}>
                      <Button 
                        onClick={handleSOS}
                        className="w-full h-16 bg-destructive hover:bg-destructive/90 text-white font-black text-lg rounded-2xl shadow-xl shadow-destructive/20 border-t border-white/20 gap-3 group"
                      >
                        <ShieldAlert className="w-6 h-6 animate-bounce" />
                        TRIGGER SOS DISPATCH
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                   </motion.div>
                ) : (
                   <div className="space-y-4">
                      <div className="bg-destructive/10 border border-destructive/20 p-5 rounded-2xl">
                         <div className="flex items-center gap-4 mb-3">
                            <div className="w-10 h-10 bg-destructive rounded-xl flex items-center justify-center text-white shadow-lg">
                               <Navigation className="w-5 h-5 animate-pulse" />
                            </div>
                            <div>
                               <h4 className="font-bold text-sm">Responder En-Route</h4>
                               <p className="text-xs text-muted-foreground">Nurse Adeola &bull; 2m away</p>
                            </div>
                         </div>
                         <div className="w-full bg-destructive/10 h-1.5 rounded-full overflow-hidden">
                            <motion.div 
                               initial={{ width: "0%" }}
                               animate={{ width: "65%" }}
                               className="bg-destructive h-full"
                            />
                         </div>
                      </div>
                      <Button variant="outline" className="w-full h-12 rounded-xl font-bold gap-2">
                        <Phone className="w-4 h-4" /> Call Responder
                      </Button>
                      <Button variant="ghost" onClick={() => setIsEmergencyActive(false)} className="w-full text-xs text-muted-foreground hover:text-destructive">
                        Cancel SOS (Accidental Trigger)
                      </Button>
                   </div>
                )}
             </CardContent>
          </Card>
        </div>

        {/* Right Column: Spatial Monitor & Guide */}
        <div className="lg:col-span-3 space-y-6">
           <Card className="border-border/50 bg-background/60 backdrop-blur-xl shadow-2xl h-[450px] overflow-hidden relative group">
              <MapModule
                 halls={HALLS}
                 userLocation={[HALL_BY_ID["welch"].lat, HALL_BY_ID["welch"].lng]}
                 hospital={BABCOCK_HOSPITAL}
                 className="h-full w-full rounded-none"
              />

              <div className="absolute top-6 left-6 z-10">
                 <Badge className="bg-background/80 backdrop-blur-md border-border text-foreground font-black py-2 px-4 shadow-xl">
                    Welch Hall — Your Location
                 </Badge>
              </div>

              {isEmergencyActive && (
                 <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
                    <div className="w-32 h-32 bg-destructive/20 rounded-full animate-ping opacity-50" />
                 </div>
              )}
           </Card>

           <div className="grid grid-cols-2 gap-4">
              <Card className="border-border/50 bg-primary/5 shadow-lg border-dashed">
                 <CardContent className="p-5 flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                       <MapPin className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                       <h4 className="font-bold text-sm">Stationary Mode</h4>
                       <p className="text-[10px] text-muted-foreground leading-relaxed uppercase tracking-widest font-bold">Stay in your room</p>
                    </div>
                 </CardContent>
              </Card>
              <Card className="border-border/50 bg-accent/5 shadow-lg border-dashed">
                 <CardContent className="p-5 flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0">
                       <ShieldAlert className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                       <h4 className="font-bold text-sm">Vital Priority</h4>
                       <p className="text-[10px] text-muted-foreground leading-relaxed uppercase tracking-widest font-bold">History shared</p>
                    </div>
                 </CardContent>
              </Card>
           </div>
        </div>

      </div>
    </div>
  )
}
