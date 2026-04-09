"use client"

import { motion } from "framer-motion"
import { BarChart3, LineChart, TrendingUp, TrendingDown, Users, AlertCircle, Zap, ShieldCheck, Download, Calendar } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function AdminAnalytics() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <div className="flex-1 p-4 md:p-8 space-y-8 max-w-[1400px] mx-auto w-full relative z-10 font-sans">
      
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
         <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-2">
               Institutional Analytics
            </h1>
            <p className="text-muted-foreground mt-1">Real-time health trends and system efficiency metrics across Babcock University.</p>
         </div>
         <div className="flex gap-2">
            <Button variant="outline" className="rounded-xl h-12 px-6 border-border/50 bg-background/50 font-bold gap-2">
               <Calendar className="w-5 h-5" /> Past 30 Days
            </Button>
            <Button className="rounded-xl h-12 px-6 bg-primary hover:bg-primary/90 text-white font-bold gap-2 shadow-lg shadow-primary/20">
               <Download className="w-5 h-5" /> Export Data
            </Button>
         </div>
      </motion.div>

      {/* Analytics KPI Grid */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
         <motion.div variants={item}>
            <Card className="bg-background/60 backdrop-blur-xl border-border/50 shadow-lg h-32 flex flex-col justify-center">
               <CardHeader className="pb-1">
                  <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Global Engagement</CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="text-3xl font-black text-foreground">94.2%</div>
                  <p className="text-[10px] text-green-600 mt-2 font-bold flex items-center gap-1 leading-none">
                     <TrendingUp className="w-3 h-3" /> 2.4% from last month
                  </p>
               </CardContent>
            </Card>
         </motion.div>

         <motion.div variants={item}>
            <Card className="bg-background/60 backdrop-blur-xl border-border/50 shadow-lg h-32 flex flex-col justify-center">
               <CardHeader className="pb-1">
                  <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">SOS Response Avg</CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="text-3xl font-black text-primary">2m 14s</div>
                  <p className="text-[10px] text-green-600 mt-2 font-bold flex items-center gap-1 leading-none">
                     <TrendingDown className="w-3 h-3" /> 18s improvement
                  </p>
               </CardContent>
            </Card>
         </motion.div>

         <motion.div variants={item}>
            <Card className="bg-background/60 backdrop-blur-xl border-border/50 shadow-lg h-32 flex flex-col justify-center border-l-4 border-l-destructive">
               <CardHeader className="pb-1">
                  <CardTitle className="text-xs font-bold uppercase tracking-widest text-destructive">Severe Incidents</CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="text-3xl font-black text-foreground">12</div>
                  <p className="text-[10px] text-muted-foreground mt-2 font-bold uppercase tracking-widest">Requiring Hospitalization</p>
               </CardContent>
            </Card>
         </motion.div>

         <motion.div variants={item}>
            <Card className="bg-background/60 backdrop-blur-xl border-border/50 shadow-lg h-32 flex flex-col justify-center">
               <CardHeader className="pb-1">
                  <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Staff Efficiency</CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="text-3xl font-black text-foreground">8.8/10</div>
                  <Progress value={88} className="h-1 bg-muted/50 mt-3" />
               </CardContent>
            </Card>
         </motion.div>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-5">
         
         {/* Main Chart Simulation (Visual Overlay) */}
         <div className="lg:col-span-3 space-y-6">
            <h3 className="font-bold text-lg text-foreground flex items-center gap-2 px-1">
               <LineChart className="h-5 w-5 text-primary" /> Incident Frequency by Hall
            </h3>
            
            <Card className="border-border/50 bg-background/60 backdrop-blur-xl shadow-2xl h-[450px] relative overflow-hidden p-6">
               <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:16px_16px]" />
               
               {/* Simulated Data Visualization (SVG abstraction) */}
               <div className="relative h-full w-full flex flex-col justify-end gap-6 overflow-hidden">
                  <div className="flex items-end justify-between h-4/5 w-full gap-4 px-4 pb-4">
                     {[80, 45, 95, 60, 30, 75, 50, 85].map((val, idx) => (
                        <motion.div 
                           key={idx}
                           initial={{ height: 0 }}
                           animate={{ height: `${val}%` }}
                           transition={{ duration: 1, delay: idx * 0.1, type: "spring" }}
                           className={`flex-1 rounded-t-xl relative group ${idx === 2 ? 'bg-primary' : 'bg-primary/20 hover:bg-primary/40'}`}
                        >
                           <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background px-2 py-1 rounded text-[10px] font-bold shadow-xl border border-white/20 whitespace-nowrap">
                              {val} Incidents
                           </div>
                        </motion.div>
                     ))}
                  </div>
                  
                  {/* Axis Mock */}
                  <div className="flex justify-between px-4 border-t border-border/40 pt-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                     <span>Welch</span>
                     <span>Bethel</span>
                     <span>Gideon</span>
                     <span>Crystal</span>
                     <span>Elijah</span>
                     <span>Ruth</span>
                     <span>Daniel</span>
                     <span>Esther</span>
                  </div>
               </div>
            </Card>
         </div>

         {/* Side Insights */}
         <div className="lg:col-span-2 space-y-6">
            <h3 className="font-bold text-lg text-foreground flex items-center gap-2 px-1">
               <Zap className="h-5 w-5 text-amber-500" /> Strategic Insights
            </h3>
            
            <div className="space-y-4">
               <Card className="border-border/50 bg-background/60 shadow-lg">
                  <CardContent className="p-5 flex gap-4">
                     <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 shrink-0">
                        <AlertCircle className="w-5 h-5" />
                     </div>
                     <div className="space-y-1">
                        <h4 className="font-bold text-sm">Peak Incident Hours</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                           Incidents peak between <strong>11:00 PM and 2:00 AM</strong>. Recommend higher cubicle staff focus during these overnight shifts.
                        </p>
                     </div>
                  </CardContent>
               </Card>

               <Card className="border-border/50 bg-background/60 shadow-lg">
                  <CardContent className="p-5 flex gap-4">
                     <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-600 shrink-0">
                        <ShieldCheck className="w-5 h-5" />
                     </div>
                     <div className="space-y-1">
                        <h4 className="font-bold text-sm">Refill Efficiency</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                           Medication refill requests are being handled <strong>14% faster</strong> since the March update. Stockout instances reduced by 40%.
                        </p>
                     </div>
                  </CardContent>
               </Card>

               <Card className="border-border/50 bg-primary/5 shadow-xl border-dashed border-primary/20">
                  <CardHeader className="p-4 pb-2">
                     <CardTitle className="text-xs font-black uppercase tracking-widest text-primary/70">Resource Utilization</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 space-y-4">
                     <div className="flex justify-between items-center text-xs">
                        <span className="font-medium">Active Bandwidth</span>
                        <span className="font-black">68%</span>
                     </div>
                     <Progress value={68} className="h-1.5 bg-primary/10" />
                  </CardContent>
               </Card>
            </div>
         </div>

      </div>
    </div>
  )
}
