"use client"

import { motion } from "framer-motion"
import { ClipboardList, Search, Filter, Download, User, Clock, FileText, CheckCircle2 } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export default function CubicleLogs() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const logs = [
    { title: "First Aid Administered", student: "Daniel Smith", room: "RM 105", status: "Completed", date: "Today, 10:45 AM", type: "Emergency" },
    { title: "Medication Refill Handover", student: "Samuel Ike", room: "RM 210", status: "Logged", date: "Today, 09:20 AM", type: "Inventory" },
    { title: "Cubicle Sanitization", student: "N/A", room: "BH-212", status: "Verified", date: "Yesterday, 11:00 PM", type: "Maintenance" },
    { title: "General Consultation", student: "Grace Ade", room: "RM 302", status: "Completed", date: "Yesterday, 04:30 PM", type: "Consultation" },
  ]

  return (
    <div className="flex-1 p-4 md:p-8 space-y-8 max-w-[1200px] mx-auto w-full relative z-10 font-sans">
      
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/40 pb-6">
         <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-2">
               Operational Logs
            </h1>
            <p className="text-muted-foreground mt-1">Audit trail of all responder actions and student interactions in Welch Hall.</p>
         </div>
         <Button className="rounded-xl h-12 bg-primary hover:bg-primary/90 text-white font-bold gap-2 px-6">
            <Download className="w-5 h-5" /> Export Logs
         </Button>
      </motion.div>

      {/* Utilities */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between pb-4">
         <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input placeholder="Search logs by student, type or action..." className="pl-11 h-12 bg-background/50 border-border/50 rounded-2xl" />
         </div>
         <div className="flex gap-2 w-full md:w-auto">
            <Button variant="outline" className="flex-1 md:flex-none h-12 rounded-2xl bg-background/50 border-border/50 gap-2"><Filter className="w-4 h-4" /> Filter By Type</Button>
         </div>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
         {logs.map((log, idx) => (
            <motion.div key={idx} variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
               <Card className="border-border/50 bg-background/60 backdrop-blur-xl shadow-md hover:bg-muted/20 transition-colors cursor-pointer group">
                  <CardContent className="p-5 flex flex-col md:flex-row items-center justify-between gap-6">
                     <div className="flex items-center gap-5 flex-1">
                        <div className="w-12 h-12 rounded-2xl bg-muted group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                           <ClipboardList className="w-6 h-6 text-muted-foreground group-hover:text-primary" />
                        </div>
                        <div className="space-y-0.5">
                           <div className="flex items-center gap-2">
                              <h4 className="font-bold text-lg">{log.title}</h4>
                              <Badge variant="outline" className="text-[10px] bg-primary/5 text-primary border-primary/20">{log.type}</Badge>
                           </div>
                           <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
                              <span className="flex items-center gap-1"><User className="w-3 h-3" /> {log.student}</span>
                              <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> {log.room}</span>
                           </div>
                        </div>
                     </div>
                     
                     <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0">
                        <div className="text-right">
                           <p className="text-sm font-bold text-foreground">{log.date}</p>
                           <p className="text-[10px] text-muted-foreground font-bold tracking-widest mt-0.5 uppercase flex items-center justify-end gap-1">
                              <Clock className="w-3 h-3" /> Timestamp
                           </p>
                        </div>
                        <div className="flex items-center gap-2 bg-green-500/10 px-3 py-1.5 rounded-lg border border-green-500/20">
                           <CheckCircle2 className="w-4 h-4 text-green-600" />
                           <span className="text-[10px] font-black text-green-700 uppercase tracking-widest">{log.status}</span>
                        </div>
                     </div>
                  </CardContent>
               </Card>
            </motion.div>
         ))}
      </motion.div>
    </div>
  )
}
