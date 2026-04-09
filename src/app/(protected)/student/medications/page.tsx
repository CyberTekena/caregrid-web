"use client"

import { motion } from "framer-motion"
import { Pill, Clock, Plus, AlertCircle, Check, Info, Calendar } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function StudentMedications() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const item = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100 } }
  }

  return (
    <div className="flex-1 p-4 md:p-8 space-y-8 max-w-[1200px] mx-auto w-full relative z-10 font-sans">
      
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
         <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-2">
               Medication Manager
            </h1>
            <p className="text-muted-foreground mt-1">Track your daily intake, adherence, and prescription refills.</p>
         </div>
         <Button className="rounded-full bg-primary hover:bg-primary/90 text-white px-6 h-12 font-bold shadow-lg shadow-primary/20">
            <Plus className="w-5 h-5 mr-2" /> Add Medication
         </Button>
      </motion.div>

      <motion.div variants={container} initial="hidden" animate="show" className="grid gap-8 lg:grid-cols-7">
         
         {/* Daily Timeline (Main Content) */}
         <div className="lg:col-span-4 space-y-6">
            <h3 className="font-bold text-lg flex items-center gap-2 px-1">
               <Clock className="w-5 h-5 text-primary" /> Today's Schedule
            </h3>
            
            <div className="space-y-4 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-[2px] before:bg-muted/50">
               {/* Taken Item */}
               <motion.div variants={item} className="relative pl-14">
                  <div className="absolute left-[20px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-green-500 border-4 border-background z-10" />
                  <Card className="border-border/50 bg-green-500/5 backdrop-blur-sm border-l-4 border-l-green-500">
                     <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-500/20 flex items-center justify-center text-green-600">
                              <Check className="w-5 h-5" />
                           </div>
                           <div>
                              <h4 className="font-bold">Salbutamol Inhaler</h4>
                              <p className="text-xs text-muted-foreground">08:00 AM &bull; Taken</p>
                           </div>
                        </div>
                        <Badge variant="outline" className="text-[10px] bg-green-500/10 text-green-600 border-green-500/20">On Time</Badge>
                     </CardContent>
                  </Card>
               </motion.div>

               {/* Upcoming Item */}
               <motion.div variants={item} className="relative pl-14 opacity-100">
                  <div className="absolute left-[20px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary border-4 border-background z-10 ring-4 ring-primary/10" />
                  <Card className="border-border/50 bg-background/60 backdrop-blur-lg shadow-lg">
                     <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                              <Pill className="w-5 h-5" />
                           </div>
                           <div>
                              <h4 className="font-bold">Multivitamins</h4>
                              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-0.5">08:00 PM &bull; Upcoming</p>
                           </div>
                        </div>
                        <Button size="sm" className="rounded-lg h-8 bg-primary hover:bg-primary/90 text-white font-bold text-xs ring-offset-2 ring-primary/20">Mark Taken</Button>
                     </CardContent>
                  </Card>
               </motion.div>
            </div>
         </div>

         {/* Sidebar Stats & Inventory */}
         <div className="lg:col-span-3 space-y-6">
            
            {/* Adherence Graph Mock */}
            <motion.div variants={item}>
               <Card className="border-border/50 bg-background/60 backdrop-blur-xl shadow-xl shadow-black/5">
                  <CardHeader className="pb-2">
                     <CardTitle className="text-sm font-bold flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Intake Adherence</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div>
                        <div className="flex justify-between text-xs mb-2">
                           <span className="text-muted-foreground">This Week</span>
                           <span className="font-bold text-primary">92%</span>
                        </div>
                        <Progress value={92} className="h-2 bg-muted/50 rounded-full" />
                     </div>
                     <div className="flex gap-2 text-[10px] items-center text-muted-foreground bg-muted/30 p-2 rounded-lg border border-white/10">
                        <Info className="w-3.5 h-3.5" />
                        You've missed 1 dose in the last 7 days. Consistency is key!
                     </div>
                  </CardContent>
               </Card>
            </motion.div>

            {/* Inventory / Refill Status */}
            <motion.div variants={item}>
               <Card className="border-border/50 bg-background/60 backdrop-blur-xl shadow-xl shadow-black/5 overflow-hidden">
                  <CardHeader className="bg-muted/20 border-b border-border/40 py-3">
                     <CardTitle className="text-sm font-bold flex items-center gap-2"><Plus className="w-4 h-4 text-primary" /> Active Prescription</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-4">
                     <div className="flex justify-between items-center group cursor-pointer hover:bg-muted/30 p-2 -m-2 rounded-xl transition-colors">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center">
                              <AlertCircle className="w-4 h-4" />
                           </div>
                           <div>
                              <p className="text-xs font-bold">Inhaler Canister</p>
                              <p className="text-[10px] text-muted-foreground">Last refill: 28 days ago</p>
                           </div>
                        </div>
                        <Badge variant="destructive" className="animate-pulse bg-destructive shadow-lg shadow-destructive/20 scale-90">Low Refill</Badge>
                     </div>
                     <Button variant="outline" className="w-full h-10 rounded-xl border-border/50 bg-background/60 shadow-sm font-bold text-xs gap-2">
                        <Calendar className="w-4 h-4" /> Request Clinic Refill
                     </Button>
                  </CardContent>
               </Card>
            </motion.div>

         </div>

      </motion.div>
    </div>
  )
}
