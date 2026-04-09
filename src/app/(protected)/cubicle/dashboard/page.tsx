"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { AlertTriangle, Clock, Phone, Navigation, Package, AlertOctagon, Zap, CheckCircle2, Users, Search, FileText, ShieldCheck, Loader2 } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { MapModule } from "@/components/map-wrapper"
import { toast } from "sonner"
import { useIncidents } from "@/hooks/use-incidents"
import { incidentService, type Incident } from "@/lib/services/incident-service"
import { useHalls } from "@/hooks/use-halls"
import { useAllUsers } from "@/hooks/use-all-users"
import { useCurrentUser } from "@/hooks/use-current-user"
import { BABCOCK_HOSPITAL } from "@/data/halls"

function RequestTimer({ since }: { since: string }) {
  const [elapsed, setElapsed] = useState(() => Math.floor((Date.now() - new Date(since).getTime()) / 1000))
  useEffect(() => {
    const id = setInterval(() => setElapsed(s => s + 1), 1000)
    return () => clearInterval(id)
  }, [])
  const m = Math.floor(elapsed / 60)
  const s = elapsed % 60
  const over = elapsed >= 180
  return (
    <span className={`font-bold text-lg animate-pulse tracking-tighter flex items-center gap-1 ${over ? "text-amber-500" : "text-destructive"}`}>
      <Clock className="w-4 h-4" /> {m}:{s < 10 ? "0" : ""}{s}
    </span>
  )
}

function IncidentCard({ req, hallById, responderName, phoneNumber }: { req: Incident, hallById: Record<string, any>, responderName: string, phoneNumber: string }) {
  const [updating, setUpdating] = useState(false)

  const handleStatusUpdate = async (newStatus: Incident['status']) => {
    setUpdating(true)
    try {
      await incidentService.updateStatus(req.id, newStatus)
      toast.success(newStatus === 'on-route' ? "Marked On-Route" : "Resolved")
    } catch (e) {
      toast.error("Failed to update status")
    } finally {
      setUpdating(false)
    }
  }

  const isResolved = req.status === "resolved"
  const isOnRoute = req.status === "on-route"

  return (
    <motion.div variants={{ hidden: { opacity: 0, scale: 0.95 }, show: { opacity: 1, scale: 1 } }} whileHover={{ scale: isResolved ? 1 : 1.01 }}>
      <Card className={`relative overflow-hidden backdrop-blur-sm border shadow-xl transition-all
        ${isResolved ? "border-green-500/30 bg-green-500/5 shadow-green-500/10" :
          isOnRoute  ? "border-amber-500/30 bg-amber-500/5 shadow-amber-500/10" :
                       "border-destructive/30 bg-destructive/5 shadow-destructive/10"}`}>
        <div className={`absolute top-0 left-0 w-1.5 h-full
          ${isResolved ? "bg-green-500" : isOnRoute ? "bg-amber-500" : "bg-destructive"}`} />

        <CardHeader className="pb-4 border-b border-border/20">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex gap-2 mb-2 flex-wrap">
                <Badge variant={isResolved ? "secondary" : "destructive"} className="uppercase tracking-tighter">
                  {req.type}
                </Badge>
                <Badge variant="outline" className="bg-background/80 border-border font-black flex items-center gap-1 text-[10px]">
                  <Zap className="w-3 h-3 text-amber-500" /> ESS: {req.ess_score}
                </Badge>
              </div>
              <CardTitle className="text-xl md:text-2xl font-black">{req.student_name}</CardTitle>
              <CardDescription className="font-bold text-foreground/80 text-xs mt-1 lowercase">
                {hallById[req.hall_id]?.name || req.hall_id.toUpperCase()} HALL &bull; {req.room_number}
              </CardDescription>
            </div>
            <div className="flex flex-col items-end gap-1">
              {!isResolved && <RequestTimer since={req.created_at} />}
              {isResolved && <span className="text-green-600 font-bold text-sm flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Resolved</span>}
              <span className="text-[10px] font-black text-muted-foreground uppercase opacity-60">SLA Trigger: 3m</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-5 space-y-4">
          <div className="bg-background/60 p-4 rounded-2xl border border-border/20 text-sm font-medium leading-relaxed italic text-foreground/80">
            "{req.description || "No description provided."}"
          </div>

          {!isResolved && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => handleStatusUpdate('on-route')}
                  disabled={isOnRoute || updating}
                  className="h-12 rounded-xl bg-destructive hover:bg-destructive/90 text-white font-bold shadow-lg shadow-destructive/20 disabled:opacity-60"
                >
                  {updating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Navigation className="w-4 h-4 mr-2" />}
                  {isOnRoute ? "On-Route" : "Mark On-Route"}
                </Button>
                <a href={phoneNumber}>
                  <Button variant="outline" className="h-12 w-full rounded-xl border-destructive/20 text-destructive font-bold hover:bg-destructive/5">
                    <Phone className="w-4 h-4 mr-2" /> Call Student
                  </Button>
                </a>
              </div>

              <Button
                onClick={() => handleStatusUpdate('resolved')}
                disabled={updating}
                variant="secondary"
                className="w-full h-10 rounded-xl bg-green-500/10 text-green-700 border-none font-black hover:bg-green-500/20 text-xs"
              >
                {updating ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <CheckCircle2 className="w-4 h-4 mr-1" />}
                Mark Resolved
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

function StudentSearch() {
  const [query, setQuery] = useState("")
  const { users } = useAllUsers()
  const results = query.length > 2 ? users
    .filter((student) => {
      const searchText = query.toLowerCase()
      return [student.full_name, student.email, student.matric_number, student.hall_id]
        .filter(Boolean)
        .some(value => value?.toLowerCase().includes(searchText))
    })
    .slice(0, 6)
    .map((student) => ({
      name: student.full_name || "Unknown",
      matric: student.matric_number || "N/A",
      hall: student.hall_id ? student.hall_id.replace(/-/g, ' ') : "Unknown Hall",
      room: student.room_number || "N/A",
      blood: student.blood_group || "N/A",
      genotype: student.genotype || "N/A",
      conditions: student.conditions?.join(', ') || 'None'
    })) : []

  return (
    <Card className="border-border/50 bg-background/60 backdrop-blur-xl shadow-xl overflow-hidden">
       <CardHeader className="pb-4 bg-muted/20 border-b border-border/40">
          <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
             <Search className="w-4 h-4 text-primary" /> Global Student Discovery
          </CardTitle>
          <CardDescription className="text-[10px]">Access shared BUTH medical records instantly.</CardDescription>
       </CardHeader>
       <CardContent className="p-5 space-y-4">
          <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
             <Input 
                placeholder="Search by Mat. No or Name..." 
                className="pl-10 h-11 bg-background/50 border-border/50 rounded-xl"
                value={query}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
             />
          </div>

          <div className="space-y-2">
             {results.map((res, i) => (
                <motion.div 
                   key={i} 
                   initial={{ opacity: 0, x: -10 }} 
                   animate={{ opacity: 1, x: 0 }}
                   className="p-3 bg-primary/5 rounded-xl border border-primary/10 flex items-center justify-between group cursor-pointer hover:bg-primary/10 transition-all"
                >
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-black text-[10px]">{res.blood}</div>
                      <div>
                         <p className="text-xs font-bold leading-none">{res.name}</p>
                         <p className="text-[10px] text-muted-foreground mt-1">{res.hall} &bull; {res.matric}</p>
                      </div>
                   </div>
                   <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      <FileText className="w-4 h-4 text-primary" />
                   </Button>
                </motion.div>
             ))}
          </div>
       </CardContent>
    </Card>
  )
}

export default function CubicleDashboard() {
  const { user, loading: userLoading } = useCurrentUser()
  const hallId = user?.hall_id || 'welch'
  const { incidents, loading: incidentsLoading } = useIncidents(hallId)
  const { halls, loading: hallsLoading, error: hallsError } = useHalls()

  const responderName = user?.full_name || "Medical Staff"
  const phoneNumber = "tel:+2348000000000"

  const active = incidents.filter(r => r.status !== "resolved")
  const activeCount = active.length
  const resolvedToday = incidents.filter(r => r.status === "resolved").length

  const slaOk = activeCount === 0 || active
    .every(r => (Date.now() - new Date(r.created_at).getTime()) / 1000 < 180)

  // Create hall lookup map from backend data
  const hallById = halls.reduce((acc, hall) => {
    acc[hall.id] = hall
    return acc
  }, {} as Record<string, typeof halls[0]>)

  const currentHall = hallById[hallId] || hallById['welch'] || halls[0]
  const hallName = currentHall?.name || 'Welch Hall'

  const hospital = BABCOCK_HOSPITAL

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }
  const item = { hidden: { opacity: 0, scale: 0.95 }, show: { opacity: 1, scale: 1 } }

  // Show loading state while data is loading
  if (userLoading || hallsLoading || incidentsLoading) {
    return (
      <div className="flex-1 p-3 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // Show error state if halls failed to load
  if (hallsError) {
    return (
      <div className="flex-1 p-3 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-8 h-8 text-destructive mx-auto mb-4" />
          <p className="text-destructive">Failed to load hall data</p>
          <p className="text-sm text-muted-foreground mt-2">{hallsError.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 p-3 md:p-8 space-y-6 md:space-y-8 max-w-[1400px] mx-auto w-full relative z-10 font-sans">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground leading-tight">{hallName} Operations Hub</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">Live Responder Console • {hallName} Cubicle</p>
        </div>
        <div className="flex items-center gap-3 bg-green-500/10 px-6 py-3 rounded-2xl border border-green-500/20">
          <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_12px_rgba(34,197,94,0.6)]" />
          <span className="text-xs font-bold text-green-600 uppercase tracking-widest">System Status: Active</span>
        </div>
      </motion.div>

      {/* KPI Stats */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <motion.div variants={item}>
          <Card className="bg-destructive text-destructive-foreground shadow-2xl shadow-destructive/20 border-none relative overflow-hidden h-32 flex flex-col justify-center">
            <div className="absolute top-0 right-0 p-4 opacity-10"><AlertOctagon className="w-24 h-24" /></div>
            <CardHeader className="pb-1"><CardTitle className="text-xs font-bold uppercase tracking-widest opacity-80">Live Emergencies</CardTitle></CardHeader>
            <CardContent>
              <div className="text-3xl md:text-4xl font-black">{activeCount}</div>
              <p className="text-[10px] font-bold opacity-70 mt-1 uppercase tracking-widest leading-none">
                 {activeCount === 0 ? "All Clear" : "Immediate Dispatch"}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="bg-background/60 backdrop-blur-xl border-border/50 shadow-lg h-32 flex flex-col justify-center">
            <CardHeader className="pb-1"><CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Response SLA</CardTitle></CardHeader>
            <CardContent>
              <div className={`text-4xl font-black ${slaOk ? "text-green-600" : "text-amber-500"}`}>
                {slaOk ? "98%" : "84%"}
              </div>
              <Badge variant="outline" className={`mt-2 ${slaOk ? "bg-green-500/10 text-green-600 border-green-500/20" : "bg-amber-500/10 text-amber-600 border-amber-500/20"} text-[10px] font-black`}>
                Goal: &lt; 3m
              </Badge>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="bg-background/60 backdrop-blur-xl border-border/50 shadow-lg h-32 flex flex-col justify-center">
            <CardHeader className="pb-1"><CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Resolved Today</CardTitle></CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-primary">{resolvedToday}</div>
              <p className="text-[10px] text-muted-foreground mt-2 font-bold tracking-widest">This session</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="bg-background/60 backdrop-blur-xl border-border/50 shadow-lg h-32 flex flex-col justify-center">
            <CardHeader className="pb-1"><CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Inventory Levels</CardTitle></CardHeader>
            <CardContent>
              <div className="text-3xl md:text-4xl font-black text-foreground">Opt.</div>
              <p className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1 font-bold italic uppercase tracking-tighter">
                <Package className="w-3 h-3 text-primary" /> Stocked 2d ago
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-5">

        {/* Live Incident Queue */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-bold text-lg text-foreground flex items-center gap-2 px-1">
            <AlertTriangle className="h-5 w-5 text-destructive" /> Active Incident Queue
          </h3>

          {incidentsLoading ? (
             <div className="flex items-center justify-center p-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
             </div>
          ) : active.length === 0 ? (
            <Card className="border-border/50 bg-background/60 backdrop-blur-xl p-8 text-center">
              <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-3" />
              <p className="font-bold text-sm">All clear — no active incidents</p>
              <p className="text-xs text-muted-foreground mt-1">New SOS requests will appear here in real time.</p>
            </Card>
          ) : (
            <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
              {active.map(req => <IncidentCard key={req.id} req={req} hallById={hallById} responderName={responderName} phoneNumber={phoneNumber} />)}
            </motion.div>
          )}

          <div className="pt-4">
             <StudentSearch />
          </div>
        </div>

        {/* Campus Map */}
        <div className="lg:col-span-3 space-y-6">
          <h3 className="font-bold text-lg text-foreground flex items-center gap-2 px-1">
            <Navigation className="h-5 w-5 text-primary" /> Campus Cubicle Map
          </h3>
          <MapModule
            halls={halls}
            userLocation={[currentHall?.lat || 0, currentHall?.lng || 0]}
            hospital={hospital}
            activeIncidents={active.map(inc => ({
              id: inc.id,
              lat: hallById[inc.hall_id]?.lat || hospital.lat,
              lng: hallById[inc.hall_id]?.lng || hospital.lng,
              type: inc.type
            }))}
            className="h-[520px] shadow-2xl rounded-2xl"
          />
        </div>

      </div>
    </div>
  )
}
