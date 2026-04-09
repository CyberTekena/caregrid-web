"use client"

import { motion } from "framer-motion"
import { Calendar, Clock, User, ChevronRight, CheckCircle2, Search, Plus, Filter, CalendarCheck } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function StudentAppointments() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const item = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 100 } }
  }

  return (
    <div className="flex-1 p-4 md:p-8 space-y-8 max-w-[1200px] mx-auto w-full relative z-10 font-sans">
      
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
         <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-2">
               Healthcare Appointments
            </h1>
            <p className="text-muted-foreground mt-1">Schedule and manage visits to the Babcock General Hospital.</p>
         </div>
         <Button className="rounded-full bg-primary hover:bg-primary/90 text-white px-6 h-12 font-bold shadow-lg shadow-primary/20">
            <Plus className="w-5 h-5 mr-2" /> Book New Appointment
         </Button>
      </motion.div>

      {/* Main Content Area */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid gap-8 lg:grid-cols-3">
         
         {/* Left Column: List & Tabs */}
         <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="upcoming" className="w-full">
               <div className="flex justify-between items-center mb-6">
                  <TabsList className="bg-muted/50 p-1 rounded-xl">
                     <TabsTrigger value="upcoming" className="rounded-lg px-6">Upcoming</TabsTrigger>
                     <TabsTrigger value="past" className="rounded-lg px-6">History</TabsTrigger>
                  </TabsList>
                  
                  <div className="flex items-center gap-2">
                     <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                        <Input placeholder="Search records..." className="pl-9 h-9 w-48 bg-background/50 border-border/50 text-xs rounded-lg" />
                     </div>
                     <Button variant="outline" size="icon" className="h-9 w-9 rounded-lg bg-background/50 border-border/50">
                        <Filter className="w-3.5 h-3.5" />
                     </Button>
                  </div>
               </div>

               <TabsContent value="upcoming" className="space-y-4">
                  {[1, 2].map(i => (
                     <motion.div key={i} variants={item} whileHover={{ y: -4 }}>
                        <Card className="border-border/50 bg-background/60 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all cursor-pointer group">
                           <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                              <div className="flex items-center gap-3">
                                 <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                    <CalendarCheck className="w-6 h-6" />
                                 </div>
                                 <div>
                                    <Badge variant="outline" className="text-[10px] mb-1 px-2 border-primary/20 bg-primary/5 text-primary">Routine Checkup</Badge>
                                    <CardTitle className="text-lg">Dr. Adeyekun O.</CardTitle>
                                 </div>
                              </div>
                              <div className="text-right">
                                 <div className="text-lg font-black text-foreground">10:30 AM</div>
                                 <div className="text-[10px] text-muted-foreground font-bold tracking-wider uppercase">April 12, 2024</div>
                              </div>
                           </CardHeader>
                           <CardContent className="pb-4">
                              <p className="text-sm text-muted-foreground mb-4">Department of Pulmonology & Respiratory Medicine, Main Block B.</p>
                              <div className="flex items-center gap-4">
                                 <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground/70 bg-muted/50 px-3 py-1.5 rounded-lg border border-white/10">
                                    <User className="w-3 h-3 text-primary" /> Specialist
                                 </div>
                                 <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground/70 bg-muted/50 px-3 py-1.5 rounded-lg border border-white/10">
                                    <Clock className="w-3 h-3 text-primary" /> 30 Mins Visit
                                 </div>
                              </div>
                           </CardContent>
                           <CardFooter className="pt-2 border-t border-border/40 bg-muted/10 group-hover:bg-primary/5 px-6 transition-colors">
                              <div className="w-full flex justify-between items-center py-2 text-xs font-bold text-primary">
                                 View Appointment Details <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                              </div>
                           </CardFooter>
                        </Card>
                     </motion.div>
                  ))}
               </TabsContent>

               <TabsContent value="past" className="opacity-60 grayscale-[0.5] space-y-4">
                  <div className="text-center py-12 text-muted-foreground text-sm">No historical appointments found.</div>
               </TabsContent>
            </Tabs>
         </div>

         {/* Right Column: Quick Booking Tooltip & Advice */}
         <div className="space-y-6">
            <motion.div variants={item}>
               <Card className="border-border/50 bg-gradient-to-br from-primary/10 to-accent/5 shadow-xl">
                  <CardHeader>
                     <CardTitle className="text-sm flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Booking Assistance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <p className="text-xs text-muted-foreground leading-relaxed">
                        If this is an emergency, please use the <strong>SOS Button</strong> instead of booking an appointment.
                     </p>
                     <div className="p-3 bg-white/40 backdrop-blur-sm rounded-xl border border-white/20 space-y-2">
                        <h4 className="text-xs font-bold">Preparation Checklist:</h4>
                        <ul className="text-[10px] space-y-1.5 text-muted-foreground">
                           <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-primary" /> Bring your student ID card</li>
                           <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-primary" /> Carry your recent lab results</li>
                           <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-primary" /> Arrive 15 minutes early</li>
                        </ul>
                     </div>
                  </CardContent>
               </Card>
            </motion.div>

            <motion.div variants={item}>
               <Card className="border-border/50 bg-background/60 shadow-lg">
                  <CardHeader className="pb-3">
                     <CardTitle className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Operating Hours</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                     <div className="flex justify-between text-xs">
                        <span className="font-medium">Mon - Fri</span>
                        <span className="text-primary font-bold">08:00 - 18:00</span>
                     </div>
                     <div className="flex justify-between text-xs">
                        <span className="font-medium">Saturday</span>
                        <span className="text-primary font-bold">10:00 - 15:00</span>
                     </div>
                     <div className="flex justify-between text-xs text-destructive font-bold pt-2 border-t border-border/40">
                        <span>Sunday</span>
                        <span>Emergencies Only</span>
                     </div>
                  </CardContent>
               </Card>
            </motion.div>
         </div>

      </motion.div>
    </div>
  )
}
