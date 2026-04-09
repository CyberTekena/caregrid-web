"use client"

import { motion } from "framer-motion"
import { Pill, Clock, Plus, AlertCircle, Check, Info, Calendar } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useCurrentUser } from "@/hooks/use-current-user"
import { useMedications } from "@/hooks/use-medications"

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
    show: { opacity: 1, x: 0 }
  }

  const { user, loading: userLoading } = useCurrentUser()
  const { meds, loading: medsLoading, markTaken } = useMedications(user?.id ?? "")
  const medsSorted = [...meds].sort((a, b) => a.schedule_time.localeCompare(b.schedule_time))
  const completedCount = meds.filter(m => Boolean(m.last_taken)).length
  const adherence = meds.length ? Math.round((completedCount / meds.length) * 100) : 0

  if (userLoading || medsLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading medications...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive font-bold">Unable to load your profile.</p>
          <p className="text-muted-foreground">Please sign in again or refresh the page.</p>
        </div>
      </div>
    )
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
               {medsSorted.length === 0 ? (
                 <Card className="border-border/50 bg-background/60 backdrop-blur-lg shadow-lg p-8 text-center">
                   <CardContent>
                     <p className="font-bold text-lg">No medications scheduled</p>
                     <p className="text-sm text-muted-foreground mt-2">Your current treatment plan is empty. Use the Add Medication button to record a prescription.</p>
                   </CardContent>
                 </Card>
               ) : medsSorted.map((med) => {
                 const taken = Boolean(med.last_taken)
                 return (
                   <motion.div key={med.id} variants={item} className="relative pl-14">
                     <div className={`absolute left-[20px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-4 border-background z-10 ${taken ? 'bg-green-500' : 'bg-primary'}`} />
                     <Card className={`border-border/50 ${taken ? 'bg-green-500/5 border-l-4 border-l-green-500' : 'bg-background/60 border-l-4 border-l-primary'} backdrop-blur-lg shadow-lg`}>
                       <CardContent className="p-4 flex items-center justify-between gap-4 flex-col md:flex-row">
                         <div className="flex items-center gap-4 w-full md:w-auto">
                           <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${taken ? 'bg-green-100 text-green-600' : 'bg-primary/10 text-primary'}`}>
                             {taken ? <Check className="w-5 h-5" /> : <Pill className="w-5 h-5" />}
                           </div>
                           <div>
                             <h4 className="font-bold">{med.name}</h4>
                             <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-0.5">{med.schedule_time} &bull; {taken ? 'Taken' : 'Upcoming'}</p>
                           </div>
                         </div>
                         <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                           <Badge variant="outline" className={`text-[10px] ${taken ? 'bg-green-500/10 text-green-600 border-green-500/20' : 'bg-primary/10 text-primary border-primary/20'}`}>
                             {taken ? 'On Time' : 'Pending'}
                           </Badge>
                           <Button size="sm" onClick={() => markTaken(med.id)} disabled={taken} className="rounded-lg h-8 bg-primary hover:bg-primary/90 text-white font-bold text-xs disabled:opacity-60">
                             {taken ? 'Taken' : 'Mark Taken'}
                           </Button>
                         </div>
                       </CardContent>
                     </Card>
                   </motion.div>
                 )
               })}
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
                           <span className="font-bold text-primary">{adherence}%</span>
                        </div>
                        <Progress value={adherence} className="h-2 bg-muted/50 rounded-full" />
                     </div>
                     <div className="flex gap-2 text-[10px] items-center text-muted-foreground bg-muted/30 p-2 rounded-lg border border-white/10">
                        <Info className="w-3.5 h-3.5" />
                        {meds.length > 0 ? `You've taken ${completedCount} of ${meds.length} doses this week.` : 'No medications scheduled yet.'}
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
                              <p className="text-xs font-bold">{meds[0]?.name || 'No active medication'}</p>
                              <p className="text-[10px] text-muted-foreground">{meds[0] ? 'Next scheduled dose available' : 'Add a prescription to begin tracking'}</p>
                           </div>
                        </div>
                        <Badge variant="destructive" className="animate-pulse bg-destructive shadow-lg shadow-destructive/20 scale-90">{meds[0] ? 'Monitor refill' : 'No medication'}</Badge>
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
