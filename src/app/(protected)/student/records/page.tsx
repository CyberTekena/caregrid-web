"use client"

import { motion } from "framer-motion"
import { FileText, Download, ShieldCheck, Search, Filter, ExternalLink, Activity, ClipboardList } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export default function StudentRecords() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <div className="flex-1 p-4 md:p-8 space-y-8 max-w-[1200px] mx-auto w-full relative z-10 font-sans">
      
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
         <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-2">
               Clinical Records
            </h1>
            <p className="text-muted-foreground mt-1">Access and download your official Babcock health history and lab results.</p>
         </div>
         <div className="flex items-center gap-3 bg-primary/5 px-4 py-2 rounded-2xl border border-primary/20 backdrop-blur-md">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <span className="text-xs font-bold text-primary uppercase tracking-widest">End-to-End Encrypted</span>
         </div>
      </motion.div>

      {/* Utilities */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-background/40 backdrop-blur-md p-4 rounded-3xl border border-white/20 shadow-xl shadow-black/5">
         <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input placeholder="Search records by name, date or doctor..." className="pl-11 h-12 bg-background/50 border-border/50 rounded-2xl" />
         </div>
         <div className="flex gap-2 w-full md:w-auto">
            <Button variant="outline" className="flex-1 md:flex-none h-12 rounded-2xl bg-background/50 border-border/50 gap-2"><Filter className="w-4 h-4" /> Filter</Button>
            <Button className="flex-1 md:flex-none h-12 rounded-2xl bg-primary text-white font-bold gap-2 px-6"><Download className="w-4 h-4" /> Export All</Button>
         </div>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="grid gap-6">
         
         {/* Record Category: Lab Results */}
         <div className="space-y-4">
            <h3 className="font-bold text-lg flex items-center gap-2 px-2">
               <Activity className="w-5 h-5 text-accent" /> Laboratory Tests
            </h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
               {[
                  { title: "CBC & Malaria Parasite", date: "Mar 28, 2024", type: "Blood Work", status: "Final" },
                  { title: "Chest X-Ray Scan", date: "Jan 12, 2024", type: "Radiology", status: "Verified" },
                  { title: "Urinalysis Report", date: "Oct 05, 2023", type: "Diagnostic", status: "Final" }
               ].map((record, idx) => (
                  <motion.div key={idx} variants={item} whileHover={{ scale: 1.02 }} className="group">
                     <Card className="border-border/50 bg-background/60 backdrop-blur-xl shadow-lg group-hover:shadow-xl transition-all h-full flex flex-col">
                        <CardHeader className="pb-2">
                           <div className="flex justify-between items-start mb-3">
                              <Badge className="bg-accent/10 text-accent border-accent/20 px-2.5 py-1 text-[10px] font-bold">{record.type}</Badge>
                              <div className="p-2 bg-muted rounded-xl group-hover:bg-primary/10 transition-colors">
                                 <FileText className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                              </div>
                           </div>
                           <CardTitle className="text-md leading-tight group-hover:text-primary transition-colors">{record.title}</CardTitle>
                           <CardDescription className="text-[10px] font-bold uppercase tracking-wider mt-1">{record.date}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 pb-4">
                           <p className="text-xs text-muted-foreground leading-relaxed">
                              Verified result from the Clinical Pathology wing. Digitally signed by HOD Diagnostics.
                           </p>
                        </CardContent>
                        <div className="px-6 py-4 border-t border-border/40 flex items-center justify-between bg-muted/20">
                           <Badge variant="outline" className="bg-green-500/5 text-green-600 border-green-500/20 text-[10px]">{record.status}</Badge>
                           <div className="flex gap-2">
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary"><Download className="w-4 h-4" /></Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary"><ExternalLink className="w-4 h-4" /></Button>
                           </div>
                        </div>
                     </Card>
                  </motion.div>
               ))}
            </div>
         </div>

         {/* Record Category: Clinical Notes */}
         <div className="space-y-4 pt-6">
            <h3 className="font-bold text-lg flex items-center gap-2 px-2">
               <ClipboardList className="w-5 h-5 text-primary" /> Physician Consultation Notes
            </h3>
            <div className="space-y-3">
               {[1, 2].map(i => (
                  <motion.div key={i} variants={item}>
                     <Card className="border-border/50 bg-background/60 backdrop-blur-xl shadow-md hover:bg-muted/20 transition-colors cursor-pointer group">
                        <CardContent className="p-5 flex items-center justify-between">
                           <div className="flex items-center gap-5">
                              <div className="w-12 h-12 rounded-2xl bg-muted group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                                 <FileText className="w-6 h-6 text-muted-foreground group-hover:text-primary" />
                              </div>
                              <div>
                                 <h4 className="font-bold text-sm">Post-Recovery Consultation Summary</h4>
                                 <p className="text-xs text-muted-foreground mt-1">Conducted by Dr. Oluwafemi &bull; General Ward C</p>
                              </div>
                           </div>
                           <div className="text-right flex flex-col items-end gap-2">
                              <Badge variant="secondary" className="bg-muted text-foreground/70 border-none font-bold text-[10px]">Aug 15, 2023</Badge>
                              <Button variant="link" className="text-primary p-0 h-auto text-xs font-bold gap-1 hover:underline">Read Note <ChevronRight className="w-3 h-3" /></Button>
                           </div>
                        </CardContent>
                     </Card>
                  </motion.div>
               ))}
            </div>
         </div>

      </motion.div>
    </div>
  )
}

function ChevronRight({ className }: { className?: string }) {
   return (
      <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
         <path d="m9 18 6-6-6-6"/>
      </svg>
   )
}
