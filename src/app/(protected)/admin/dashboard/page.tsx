"use client"

import { motion } from "framer-motion"
import { ShieldCheck, Users, Map, Activity, Settings, BarChart3, Lock, Zap, Server } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function AdminDashboard() {
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
    <div className="flex-1 p-4 md:p-8 space-y-8 max-w-[1400px] mx-auto w-full relative z-10 font-sans">
      
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
         <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-2">
               Institutional Control Center
            </h1>
            <p className="text-muted-foreground mt-1">Global System Oversight &bull; Babcock CareGrid Platform</p>
         </div>
         <div className="flex gap-2">
            <Button variant="outline" className="rounded-xl h-12 px-6 border-border/50 bg-background/50 font-bold gap-2">
               <Server className="w-5 h-5 text-primary" /> System Health
            </Button>
            <Button className="rounded-xl h-12 px-6 bg-primary hover:bg-primary/90 text-white font-bold gap-2 shadow-lg shadow-primary/20">
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
                  <div className="text-4xl font-black">12,450</div>
                  <p className="text-[10px] font-bold opacity-70 mt-1 flex items-center gap-1"><Zap className="w-3 h-3 text-amber-300" /> +142 active today</p>
               </CardContent>
            </Card>
         </motion.div>

         <motion.div variants={item}>
            <Card className="bg-background/60 backdrop-blur-xl border-border/50 shadow-lg h-36 flex flex-col justify-center">
               <CardHeader className="pb-1">
                  <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Active Halls</CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="text-4xl font-black text-foreground">18 / 18</div>
                  <Badge variant="outline" className="mt-2 bg-green-500/10 text-green-600 border-green-500/20 text-[10px]">All Systems Green</Badge>
               </CardContent>
            </Card>
         </motion.div>

         <motion.div variants={item}>
            <Card className="bg-background/60 backdrop-blur-xl border-border/50 shadow-lg h-36 flex flex-col justify-center">
               <CardHeader className="pb-1">
                  <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Avg. Response Time</CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="text-4xl font-black text-primary">2.4m</div>
                  <p className="text-[10px] text-muted-foreground mt-2 font-black uppercase tracking-widest">Optimized</p>
               </CardContent>
            </Card>
         </motion.div>

         <motion.div variants={item}>
            <Card className="bg-background/60 backdrop-blur-xl border-border/50 shadow-lg h-36 flex flex-col justify-center">
               <CardHeader className="pb-1">
                  <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Escalation Rate</CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="text-4xl font-black text-foreground">12%</div>
                  <div className="w-full bg-muted/50 h-1 rounded-full mt-3 overflow-hidden">
                     <div className="bg-primary h-full w-[12%]" />
                  </div>
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
            
            <div className="grid grid-cols-2 gap-4">
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
                     <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  </div>
               </CardHeader>
               <CardContent className="p-0 flex-1 overflow-hidden">
                  <div className="divide-y divide-border/40">
                     {[
                        { ev: "New Referral", loc: "Babcock University Health Centre", time: "16s" },
                        { ev: "Stock Low", loc: "Bethel Hall Cubicle", time: "42s" },
                        { ev: "SOS Trigger", loc: "Welch Hall RM 212", time: "2m" }
                     ].map((event, i) => (
                        <div key={i} className="px-5 py-4 flex justify-between items-center hover:bg-muted/30 transition-colors">
                           <div>
                              <p className="text-xs font-bold leading-none">{event.ev}</p>
                              <p className="text-[10px] text-muted-foreground mt-1">{event.loc}</p>
                           </div>
                           <span className="text-[10px] font-black text-primary/60">{event.time}</span>
                        </div>
                     ))}
                  </div>
               </CardContent>
            </Card>
         </div>

      </div>
    </div>
  )
}
