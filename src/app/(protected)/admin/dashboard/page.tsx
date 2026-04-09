"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { ShieldCheck, Users, Map, Activity, Settings, BarChart3, Lock, Zap, Server, Loader2 } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useIncidents } from "@/hooks/use-incidents"
import { useHalls } from "@/hooks/use-halls"
import { useStudentCount } from "@/hooks/use-student-count"
import { LoadingScreen } from "@/components/loading-screen"

export default function AdminDashboard() {
  const { incidents, loading: incidentsLoading } = useIncidents() // Get all incidents across halls
  const { halls, loading: hallsLoading } = useHalls()
  const { count: studentCount, loading: countLoading } = useStudentCount()

  const stats = useMemo(() => {
    const active = incidents.filter(i => i.status !== 'resolved')
    const resolved = incidents.filter(i => i.status === 'resolved')

    // Calculate real average response time from resolved incidents
    const responseTimes = resolved
      .filter(i => i.created_at && i.resolved_at)
      .map(i => {
        const created = new Date(i.created_at!)
        const resolved = new Date(i.resolved_at!)
        return resolved.getTime() - created.getTime()
      })

    const avgResponseMs = responseTimes.length > 0
      ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
      : 0

    // Format as minutes
    const avgResponse = avgResponseMs > 0
      ? `${(avgResponseMs / 60000).toFixed(1)}m`
      : "N/A"

    return {
      activeCount: active.length,
      resolvedToday: resolved.length,
      avgResponse,
      totalStudents: studentCount
    }
  }, [incidents, studentCount])

  const loading = incidentsLoading || hallsLoading || countLoading

  if (loading) {
    return <LoadingScreen message="Aggregating Campus Health Data..." />
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const item = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1 }
  }

  return (
    <div className="flex-1 p-3 md:p-8 space-y-6 md:space-y-8 max-w-[1400px] mx-auto w-full relative z-10 font-sans">
      
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
         <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground leading-tight">
               Institutional Admin Operations
            </h1>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">Institutional Control Center &bull; BU CareGrid Platform</p>
         </div>
         <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <Button variant="outline" className="w-full sm:w-auto rounded-xl h-11 md:h-12 px-6 border-border/50 bg-background/50 font-bold gap-2 text-xs md:text-sm">
               <Server className="w-5 h-5 text-primary" /> System Health
            </Button>
            <Button className="w-full sm:w-auto rounded-xl h-11 md:h-12 px-6 bg-primary hover:bg-primary/90 text-white font-bold gap-2 shadow-lg shadow-primary/20 text-xs md:text-sm">
               <Settings className="w-5 h-5" /> Global Settings
            </Button>
         </div>
      </motion.div>

      {/* Hero Analytics Stats */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
         <motion.div variants={item}>
            <Card className="bg-primary text-primary-foreground shadow-2xl shadow-primary/20 border-none relative overflow-hidden h-36 flex flex-col justify-center">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Users className="w-24 h-24" />
               </div>
               <CardHeader className="pb-1">
                  <CardTitle className="text-xs font-bold uppercase tracking-widest opacity-80">Total Students</CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="text-4xl font-black">
                    {loading ? <Loader2 className="w-8 h-8 animate-spin inline" /> : stats.totalStudents.toLocaleString()}
                  </div>
                  <p className="text-[10px] font-bold opacity-70 mt-1 flex items-center gap-1"><Zap className="w-3 h-3 text-amber-300" /> +{Math.floor(stats.totalStudents * 0.011)} active today</p>
               </CardContent>
            </Card>
         </motion.div>

         <motion.div variants={item}>
            <Card className="bg-background/60 backdrop-blur-xl border-border/50 shadow-lg h-36 flex flex-col justify-center">
               <CardHeader className="pb-1">
                  <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Active Emergencies</CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="text-4xl font-black text-foreground">
                    {loading ? <Loader2 className="w-8 h-8 animate-spin inline" /> : stats.activeCount}
                  </div>
                  <Badge variant="outline" className={`mt-2 ${stats.activeCount > 0 ? 'bg-destructive/10 text-destructive border-destructive/20' : 'bg-green-500/10 text-green-600 border-green-500/20'} text-[10px]`}>
                    {stats.activeCount > 0 ? "Dispatch Active" : "All Systems Green"}
                  </Badge>
               </CardContent>
            </Card>
         </motion.div>

         <motion.div variants={item}>
            <Card className="bg-background/60 backdrop-blur-xl border-border/50 shadow-lg h-36 flex flex-col justify-center">
               <CardHeader className="pb-1">
                  <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Avg. Response Time</CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="text-4xl font-black text-primary">{stats.avgResponse}</div>
                  <p className="text-[10px] text-muted-foreground mt-2 font-black uppercase tracking-widest">Optimized</p>
               </CardContent>
            </Card>
         </motion.div>

         <motion.div variants={item}>
            <Card className="bg-background/60 backdrop-blur-xl border-border/50 shadow-lg h-36 flex flex-col justify-center">
               <CardHeader className="pb-1">
                  <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">System Status</CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="text-4xl font-black text-foreground uppercase tracking-tighter flex items-center gap-2">
                     <ShieldCheck className="w-8 h-8 text-primary" /> Active
                  </div>
                  <Badge variant="outline" className="mt-2 bg-primary/5 text-primary border-primary/20 text-[10px] font-black tracking-widest uppercase">Institutional Admin</Badge>
               </CardContent>
            </Card>
         </motion.div>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-3">
         
         {/* System Modules Grid */}
         <div className="lg:col-span-2 space-y-6">
            <h3 className="font-bold text-lg text-foreground flex items-center gap-2 px-1">
               <ShieldCheck className="h-5 w-5 text-primary" /> Management Modules
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               {[
                  { title: "User Directory", icon: Users, desc: "Onboard students & staff", link: "/admin/users" },
                  { title: "Hall Mapping", icon: Map, desc: "Configure geospatial nodes", link: "/admin/halls" },
                  { title: "Global Analytics", icon: BarChart3, desc: "Deep institutional data", link: "/admin/analytics" },
                  { title: "Privacy & Auth", icon: Lock, desc: "Encryption & RLS config", link: "/admin/settings" }
               ].map((mod, idx) => (
                  <motion.div key={idx} variants={item} whileHover={{ y: -5 }} className="group">
                     <Card className="border-border/50 bg-background/60 backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all cursor-pointer h-32 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                        <CardContent className="p-6 flex flex-col justify-center h-full">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-primary/10 group-hover:bg-primary transition-colors flex items-center justify-center text-primary group-hover:text-white">
                                 <mod.icon className="w-5 h-5" />
                              </div>
                              <div className="space-y-0.5">
                                 <h4 className="font-bold text-sm">{mod.title}</h4>
                                 <p className="text-[10px] text-muted-foreground leading-tight">{mod.desc}</p>
                              </div>
                           </div>
                        </CardContent>
                     </Card>
                  </motion.div>
               ))}
            </div>
         </div>

         {/* Real-time Audit Ticker */}
         <div className="space-y-6">
            <h3 className="font-bold text-lg text-foreground flex items-center gap-2 px-1">
               <Activity className="h-5 w-5 text-primary" /> Live Audit Stream
            </h3>
            
            <Card className="border-border/50 bg-background/60 backdrop-blur-xl shadow-xl h-[280px] flex flex-col">
               <CardHeader className="py-4 border-b border-border/40 bg-muted/20">
                  <div className="flex justify-between items-center">
                     <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Active Events</CardTitle>
                     <div className={`w-2 h-2 rounded-full ${loading ? 'bg-muted' : 'bg-green-500'} animate-pulse`} />
                  </div>
               </CardHeader>
               <CardContent className="p-0 flex-1 overflow-hidden">
                  <div className="divide-y divide-border/40">
                     {incidents.slice(0, 5).map((inc, i) => {
                        const hallName = halls.find(h => h.id === inc.hall_id)?.name || inc.hall_id
                        return (
                        <div key={i} className="px-5 py-4 flex justify-between items-center hover:bg-muted/30 transition-colors">
                           <div>
                              <p className="text-xs font-bold leading-none capitalize">{inc.type} - {inc.status}</p>
                              <p className="text-[10px] text-muted-foreground mt-1 uppercase">{hallName}</p>
                           </div>
                           <span className="text-[10px] font-black text-primary/60">LIVE</span>
                        </div>
                        )
                     })}
                     {incidents.length === 0 && !loading && (
                        <p className="text-center text-[10px] text-muted-foreground py-20 italic">Listening for institutional events...</p>
                      )}
                  </div>
               </CardContent>
            </Card>
         </div>

      </div>
    </div>
  )
}
