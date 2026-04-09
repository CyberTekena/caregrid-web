"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Phone, ShieldAlert, Zap, CheckCircle2, Navigation, Clock } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAppStore } from "@/hooks/use-app-store"
import { appStore, type EmergencyRequest } from "@/store/app-store"
import { toast } from "sonner"

const PHONE_NUMBER = "tel:+2348000000000"

function timeAgo(date: Date) {
  const secs = Math.floor((Date.now() - date.getTime()) / 1000)
  if (secs < 60) return `${secs}s ago`
  const mins = Math.floor(secs / 60)
  if (mins < 60) return `${mins}m ago`
  return `${Math.floor(mins / 60)}h ago`
}

function RequestRow({ req, showHistory }: { req: EmergencyRequest; showHistory: boolean }) {
  const [expanded, setExpanded] = useState(false)

  const handleOnRoute = () => {
    appStore.markOnRoute(req.id)
    toast.success("Marked On-Route", { description: `Heading to ${req.hallName}, ${req.room}` })
  }
  const handleResolve = () => {
    appStore.resolveRequest(req.id)
    toast.success("Resolved", { description: `${req.studentName}'s case closed.` })
  }
  const isResolved = req.status === "resolved"
  const isOnRoute = req.status === "on-route"
  const isCritical = req.essScore >= 7

  if (isResolved && !showHistory) return null

  return (
    <motion.div variants={{ hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0 } }}>
      <Card className={`border-border/50 backdrop-blur-xl shadow-lg transition-colors
        ${isResolved ? "bg-muted/20 opacity-70" : "bg-background/60 hover:bg-muted/10"}`}>
        <CardContent className="p-5 space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shrink-0
                ${isCritical ? "bg-destructive/10 border-destructive/20 text-destructive" : "bg-primary/10 border-primary/20 text-primary"}`}>
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h4 className="font-bold text-lg">{req.studentName}</h4>
                  <Badge variant="outline" className={`text-[10px] font-black uppercase
                    ${isResolved ? "bg-green-500/10 text-green-600 border-green-500/20" :
                      isOnRoute  ? "bg-amber-500/10 text-amber-600 border-amber-500/20" :
                      isCritical ? "bg-destructive/10 text-destructive border-destructive/20" :
                                   "bg-primary/10 text-primary border-primary/20"}`}>
                    {isResolved ? "Resolved" : isOnRoute ? "On-Route" : req.type}
                  </Badge>
                  <Badge variant="outline" className="bg-background/80 border-border font-black flex items-center gap-1 text-[10px]">
                    <Zap className="w-3 h-3 text-amber-500" /> ESS: {req.essScore}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
                  {req.hallName} &bull; {req.room}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0">
              <div className="text-right">
                <p className="text-xs font-bold text-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {timeAgo(req.timestamp)}
                </p>
                <p className="text-[10px] text-muted-foreground font-bold tracking-widest mt-0.5 uppercase">
                  {isResolved ? "Closed" : isOnRoute ? "En Route" : "Triage Pending"}
                </p>
              </div>
              <div className="flex gap-2">
                <a href={PHONE_NUMBER}>
                  <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl hover:bg-primary hover:text-white transition-all">
                    <Phone className="w-4 h-4" />
                  </Button>
                </a>
                {!isResolved && (
                  <Button
                    className="rounded-xl h-10 px-4 bg-primary text-white font-bold text-xs"
                    onClick={() => setExpanded(e => !e)}
                  >
                    {expanded ? "Close" : "Manage"}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Expanded actions */}
          {expanded && !isResolved && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="border-t border-border/40 pt-4 space-y-3"
            >
              <div className="bg-muted/30 p-3 rounded-xl text-sm italic text-foreground/80">
                "{req.description}"
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={handleOnRoute}
                  disabled={isOnRoute}
                  className="rounded-xl h-10 bg-destructive hover:bg-destructive/90 text-white font-bold text-xs disabled:opacity-50"
                >
                  <Navigation className="w-3.5 h-3.5 mr-1" />
                  {isOnRoute ? "On-Route" : "Mark On-Route"}
                </Button>
                <Button
                  onClick={handleResolve}
                  variant="secondary"
                  className="rounded-xl h-10 bg-green-500/10 text-green-700 hover:bg-green-500/20 text-xs font-bold"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Resolve
                </Button>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default function CubicleRequests() {
  const { requests } = useAppStore()
  const [showHistory, setShowHistory] = useState(false)

  const myRequests = requests.filter(r => r.hallId === "welch")
  const active = myRequests.filter(r => r.status !== "resolved")
  const resolved = myRequests.filter(r => r.status === "resolved")

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } }

  return (
    <div className="flex-1 p-4 md:p-8 space-y-8 max-w-[1200px] mx-auto w-full relative z-10 font-sans">

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/40 pb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">Active Requests</h1>
          <p className="text-muted-foreground mt-1">
            {active.length} active &bull; {resolved.length} resolved — Welch Hall
          </p>
        </div>
        <div className="flex bg-muted/50 p-1 rounded-xl">
          <Button
            variant="ghost"
            onClick={() => setShowHistory(false)}
            className={`rounded-lg h-9 px-4 text-xs font-bold ${!showHistory ? "bg-background shadow-sm" : "text-muted-foreground"}`}
          >
            Active
          </Button>
          <Button
            variant="ghost"
            onClick={() => setShowHistory(true)}
            className={`rounded-lg h-9 px-4 text-xs font-bold ${showHistory ? "bg-background shadow-sm" : "text-muted-foreground"}`}
          >
            Historical
          </Button>
        </div>
      </motion.div>

      {myRequests.length === 0 ? (
        <Card className="border-border/50 bg-background/60 p-12 text-center">
          <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <p className="font-bold text-lg">No requests yet</p>
          <p className="text-sm text-muted-foreground mt-1">Student SOS alerts will appear here in real time.</p>
        </Card>
      ) : (
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
          {myRequests.map(req => (
            <RequestRow key={req.id} req={req} showHistory={showHistory} />
          ))}
        </motion.div>
      )}
    </div>
  )
}
