"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { AlertTriangle, Clock, Phone, Navigation, Package, AlertOctagon, Zap, CheckCircle2 } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapModule } from "@/components/map-wrapper"
import { HALLS, HALL_BY_ID, BABCOCK_HOSPITAL } from "@/data/halls"
import { appStore, type EmergencyRequest } from "@/store/app-store"
import { useAppStore } from "@/hooks/use-app-store"
import { toast } from "sonner"

const RESPONDER_NAME = "Nurse Adeola"
const PHONE_NUMBER = "tel:+2348000000000" // placeholder

function RequestTimer({ since }: { since: Date }) {
  const [elapsed, setElapsed] = useState(() => Math.floor((Date.now() - since.getTime()) / 1000))
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

function IncidentCard({ req }: { req: EmergencyRequest }) {
  const handleOnRoute = () => {
    appStore.markOnRoute(req.id)
    toast.success("Marked as On-Route", { description: `En route to ${req.hallName}, ${req.room}` })
  }
  const handleResolve = () => {
    appStore.resolveRequest(req.id)
    toast.success("Request Resolved", { description: `${req.studentName}'s case closed.` })
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
                  <Zap className="w-3 h-3" /> ESS: {req.essScore}
                </Badge>
              </div>
              <CardTitle className="text-2xl font-black">{req.studentName}</CardTitle>
              <CardDescription className="font-bold text-foreground/80 text-xs mt-1">
                {req.hallName} &bull; {req.room}
              </CardDescription>
            </div>
            <div className="flex flex-col items-end gap-1">
              {!isResolved && <RequestTimer since={req.timestamp} />}
              {isResolved && <span className="text-green-600 font-bold text-sm flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Resolved</span>}
              <span className="text-[10px] font-black text-muted-foreground uppercase opacity-60">SLA Trigger: 3m</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-5 space-y-4">
          <div className="bg-background/60 p-4 rounded-2xl border border-border/20 text-sm font-medium leading-relaxed italic text-foreground/80">
            "{req.description}"
          </div>

          {!isResolved && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={handleOnRoute}
                  disabled={isOnRoute}
                  className="h-12 rounded-xl bg-destructive hover:bg-destructive/90 text-white font-bold shadow-lg shadow-destructive/20 disabled:opacity-60"
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  {isOnRoute ? "On-Route" : "Mark On-Route"}
                </Button>
                <a href={PHONE_NUMBER}>
                  <Button variant="outline" className="h-12 w-full rounded-xl border-destructive/20 text-destructive font-bold hover:bg-destructive/5">
                    <Phone className="w-4 h-4 mr-2" /> Call Student
                  </Button>
                </a>
              </div>

              <Button
                onClick={handleResolve}
                variant="secondary"
                className="w-full h-10 rounded-xl bg-green-500/10 text-green-700 border-none font-black hover:bg-green-500/20 text-xs"
              >
                <CheckCircle2 className="w-4 h-4 mr-1" /> Mark Resolved
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default function CubicleDashboard() {
  const { requests } = useAppStore()

  // Only show requests for Welch Hall (this cubicle's hall)
  const myRequests = requests.filter(r => r.hallId === "welch")
  const activeCount = myRequests.filter(r => r.status !== "resolved").length
  const resolvedToday = myRequests.filter(r => r.status === "resolved").length

  const slaOk = activeCount === 0 || myRequests
    .filter(r => r.status !== "resolved")
    .every(r => (Date.now() - r.timestamp.getTime()) / 1000 < 180)

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }
  const item = { hidden: { opacity: 0, scale: 0.95 }, show: { opacity: 1, scale: 1 } }

  return (
    <div className="flex-1 p-4 md:p-8 space-y-8 max-w-[1400px] mx-auto w-full relative z-10 font-sans">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">Welch Hall Operations Hub</h1>
          <p className="text-muted-foreground mt-1">Live Responder Console &bull; Welch Hall Cubicle</p>
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
              <div className="text-4xl font-black">{activeCount}</div>
              <p className="text-[10px] font-bold opacity-70 mt-1 uppercase tracking-widest">
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
              <div className="text-4xl font-black text-foreground">Opt.</div>
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

          {myRequests.length === 0 ? (
            <Card className="border-border/50 bg-background/60 backdrop-blur-xl p-8 text-center">
              <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-3" />
              <p className="font-bold text-sm">All clear — no active incidents</p>
              <p className="text-xs text-muted-foreground mt-1">New SOS requests will appear here in real time.</p>
            </Card>
          ) : (
            <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
              {myRequests.map(req => <IncidentCard key={req.id} req={req} />)}
            </motion.div>
          )}
        </div>

        {/* Campus Map */}
        <div className="lg:col-span-3 space-y-6">
          <h3 className="font-bold text-lg text-foreground flex items-center gap-2 px-1">
            <Navigation className="h-5 w-5 text-primary" /> Campus Cubicle Map
          </h3>
          <MapModule
            halls={HALLS}
            userLocation={[HALL_BY_ID["welch"].lat, HALL_BY_ID["welch"].lng]}
            hospital={BABCOCK_HOSPITAL}
            className="h-[520px] shadow-2xl rounded-2xl"
          />
        </div>

      </div>
    </div>
  )
}
