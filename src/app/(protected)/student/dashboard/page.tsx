"use client"

import { Activity, Droplet, HeartPulse, Pill, Calendar as CalendarIcon, Clock, ArrowRight, CheckCircle2, FileText, Bell, Navigation, MapPin } from "lucide-react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button, buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function StudentDashboard() {

   const container: any = {
     hidden: { opacity: 0 },
     show: {
       opacity: 1,
       transition: { staggerChildren: 0.1 }
     }
   }

   const item: any = {
     hidden: { opacity: 0, y: 20 },
     show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
   }

   return (
      <div className="flex-1 p-4 md:p-8 space-y-8 max-w-[1400px] mx-auto w-full relative z-10 font-sans">
         
         {/* Top Header Section */}
         <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center bg-background/60 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-lg shadow-black/5">
            <div>
               <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                  Welcome back, Michael <span className="inline-flex w-3 h-3 rounded-full bg-green-500 animate-pulse ml-2" />
               </h1>
               <p className="text-muted-foreground mt-1">Matric: 19/0045 &nbsp;|&nbsp; Welch Hall, Rm 212</p>
            </div>
            
            <div className="flex items-center gap-4">
               <Button variant="outline" size="icon" className="rounded-full bg-background/50 backdrop-blur-md">
                 <Bell className="w-5 h-5 text-muted-foreground" />
               </Button>
               
               {/* SOS Primary CTA */}
               <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                 <Link href="/student/emergency" className={buttonVariants({ variant: "destructive", className: "bg-destructive hover:bg-destructive/90 text-white shadow-xl shadow-destructive/20 rounded-full h-12 px-6 border border-destructive/50" })}>
                       <HeartPulse className="mr-2 h-5 w-5 animate-pulse" />
                       Emergency SOS
                    </Link>
               </motion.div>
            </div>
         </motion.div>

         <motion.div 
           variants={container}
           initial="hidden"
           animate="show"
           className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
         >
            {/* Health Metric Cards with Glassmorphism */}
            <motion.div variants={item} whileHover={{ y: -5 }}>
               <Card className="bg-primary/95 text-primary-foreground border-white/10 shadow-xl shadow-primary/20 backdrop-blur-xl overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                     <Droplet className="w-24 h-24" />
                  </div>
                  <CardHeader className="pb-2">
                     <CardTitle className="text-sm font-medium text-primary-foreground/80">Blood Group</CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                     <div className="text-4xl font-black flex items-center gap-2">
                        O+ <Droplet className="h-6 w-6 fill-red-400 text-red-400" />
                     </div>
                     <p className="text-xs mt-2 text-primary-foreground/70 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Verified by Medical Center
                     </p>
                  </CardContent>
               </Card>
            </motion.div>

            <motion.div variants={item} whileHover={{ y: -5 }}>
               <Card className="shadow-lg border-border/50 bg-background/70 backdrop-blur-xl hover:bg-background/90 transition-colors">
                  <CardHeader className="pb-2">
                     <CardTitle className="text-sm font-medium text-muted-foreground">Genotype</CardTitle>
                  </CardHeader>
                  <CardContent>
                     <div className="text-4xl font-black text-foreground">AA</div>
                  </CardContent>
               </Card>
            </motion.div>

            <motion.div variants={item} whileHover={{ y: -5 }}>
               <Card className="shadow-lg border-destructive/20 bg-background/70 backdrop-blur-xl relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-amber-500 transition-all duration-300 group-hover:w-2" />
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                     <CardTitle className="text-sm font-medium text-muted-foreground">Allergies</CardTitle>
                     <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20">1 Logged</Badge>
                  </CardHeader>
                  <CardContent>
                     <div className="text-2xl font-bold text-foreground">Penicillin</div>
                  </CardContent>
               </Card>
            </motion.div>

            <motion.div variants={item} whileHover={{ y: -5 }}>
               <Card className="shadow-lg border-accent/20 bg-background/70 backdrop-blur-xl relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-accent transition-all duration-300 group-hover:w-2" />
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                     <CardTitle className="text-sm font-medium text-muted-foreground">Active Conditions</CardTitle>
                     <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">Monitoring</Badge>
                  </CardHeader>
                  <CardContent>
                     <div className="text-2xl font-bold text-foreground">Mild Asthma</div>
                  </CardContent>
               </Card>
            </motion.div>
         </motion.div>

         {/* Proximity Alert (Smart Location Tracking) */}
         <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="group mb-8">
            <Card className="border-primary/20 bg-primary/5 backdrop-blur-xl shadow-xl shadow-primary/5 overflow-hidden transition-all hover:bg-primary/10 border-l-4 border-l-primary">
               <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Navigation className="w-24 h-24" />
               </div>
               <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-5">
                     <div className="relative">
                        <div className="absolute -inset-4 bg-primary/20 rounded-full animate-ping" />
                        <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg relative z-10">
                           <MapPin className="w-6 h-6" />
                        </div>
                     </div>
                     <div className="space-y-1">
                        <div className="flex items-center gap-2">
                           <h3 className="text-xl font-black tracking-tight">Active Proximity Tracking</h3>
                           <Badge className="bg-primary/20 text-primary border-none text-[10px] font-bold">LIVE</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground font-medium">Nearest Healthcare Hub: <span className="text-foreground font-bold underline decoration-primary/30">Bethel Hall Sector B</span> &bull; <span className="text-primary font-bold">240m away</span></p>
                     </div>
                  </div>
                  
                  <div className="flex gap-3 w-full md:w-auto">
                     <Button variant="outline" className="flex-1 md:flex-none h-11 rounded-xl bg-background/50 border-border/50 font-bold gap-2 text-xs">
                        <Navigation className="w-4 h-4" /> View Route
                     </Button>
                     <Button className="flex-1 md:flex-none h-11 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold gap-2 shadow-lg shadow-primary/20 text-xs px-6">
                        Contact Hall Responder
                     </Button>
                  </div>
               </CardContent>
            </Card>
         </motion.div>

         <motion.div variants={container} initial="hidden" animate="show" className="grid gap-6 lg:grid-cols-7">

            {/* Dense Medication Tracker Widget */}
            <motion.div variants={item} className="lg:col-span-4">
               <Card className="border-border/50 shadow-xl shadow-black/5 bg-background/80 backdrop-blur-lg flex flex-col h-full">
                  <CardHeader className="border-b bg-muted/40 pb-4">
                     <div className="flex items-center justify-between">
                        <div>
                           <CardTitle className="flex items-center gap-2"><Pill className="h-5 w-5 text-accent" /> Medication Schedule</CardTitle>
                           <CardDescription>Track your daily dosage and reminders.</CardDescription>
                        </div>
                        <Button size="sm" variant="outline" className="bg-background/50 backdrop-blur-sm rounded-full">Add New</Button>
                     </div>
                  </CardHeader>
                  <CardContent className="p-0 flex-1">
                     <div className="divide-y divide-border/50">
                        {/* Completed Medication */}
                        <motion.div whileHover={{ backgroundColor: "var(--color-muted)", opacity: 0.8 }} className="flex items-center justify-between p-5 bg-green-500/5 transition-colors cursor-pointer">
                           <div className="flex items-center gap-4">
                              <div className="h-12 w-12 bg-green-100 dark:bg-green-500/20 text-green-600 rounded-2xl flex items-center justify-center shadow-sm">
                                 <CheckCircle2 strokeWidth={2.5} className="h-6 w-6" />
                              </div>
                              <div>
                                 <p className="font-semibold text-foreground">Salbutamol Inhaler</p>
                                 <p className="text-xs font-medium text-muted-foreground mt-0.5 flex items-center gap-1">
                                    <Clock className="h-3 w-3" /> 08:00 AM &middot; <span className="text-green-600">Taken</span>
                                 </p>
                              </div>
                           </div>
                           <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400">Done</Badge>
                        </motion.div>

                        {/* Pending Medication */}
                        <motion.div whileHover={{ backgroundColor: "var(--color-muted)" }} className="flex items-center justify-between p-5 transition-colors cursor-pointer">
                           <div className="flex items-center gap-4">
                              <div className="h-12 w-12 bg-accent/10 text-accent rounded-2xl flex items-center justify-center border border-accent/20">
                                 <Pill className="h-6 w-6" />
                              </div>
                              <div>
                                 <p className="font-semibold text-foreground">Multivitamins</p>
                                 <p className="text-xs font-medium text-muted-foreground mt-0.5 flex items-center gap-1">
                                    <Clock className="h-3 w-3" /> 08:00 PM &middot; <span className="text-accent">Upcoming</span>
                                 </p>
                              </div>
                           </div>
                           <Button size="sm" className="rounded-full bg-accent hover:bg-accent/90 text-white shadow-md shadow-accent/20">Mark Taken</Button>
                        </motion.div>
                     </div>
                  </CardContent>
               </Card>
            </motion.div>

            {/* Right Column: Appointments & Records */}
            <div className="lg:col-span-3 flex flex-col gap-6">
               
               {/* Upcoming Appointments */}
               <motion.div variants={item}>
                  <Card className="border-border/50 shadow-xl shadow-black/5 bg-background/80 backdrop-blur-lg">
                     <CardHeader className="border-b bg-muted/40 pb-4">
                        <CardTitle className="flex items-center gap-2"><CalendarIcon className="h-5 w-5 text-primary" /> Upcoming Appointments</CardTitle>
                        <CardDescription>Babcock General Hospital</CardDescription>
                     </CardHeader>
                     <CardContent className="pt-6">
                        <motion.div whileHover={{ scale: 1.02 }} className="rounded-2xl border border-border/50 p-5 bg-background shadow-md relative overflow-hidden group cursor-pointer transition-all">
                           <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />
                           <div className="flex justify-between items-start mb-3">
                              <span className="font-bold text-primary text-sm flex items-center gap-1">
                                 <Activity className="w-4 h-4" /> Routine Checkup
                              </span>
                              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">Confirmed</Badge>
                           </div>
                           <p className="font-semibold text-lg mb-1 leading-none">Dr. Adeyekun</p>
                           <p className="text-sm text-muted-foreground mb-4">Pulmonology Dept.</p>
                           <div className="flex items-center gap-3 text-xs font-medium">
                              <span className="flex items-center gap-1.5 bg-muted/60 px-3 py-1.5 rounded-lg border border-white/10"><CalendarIcon className="h-3.5 w-3.5 text-primary" /> Thu, Apr 12</span>
                              <span className="flex items-center gap-1.5 bg-muted/60 px-3 py-1.5 rounded-lg border border-white/10"><Clock className="h-3.5 w-3.5 text-primary" /> 10:30 AM</span>
                           </div>
                        </motion.div>

                        <Button variant="ghost" className="w-full mt-4 text-primary hover:text-primary hover:bg-primary/5 group rounded-full">
                           View All Appointments <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                     </CardContent>
                  </Card>
               </motion.div>

               {/* Quick Action: Health Record */}
               <motion.div variants={item}>
                 <Card className="border-border/50 bg-gradient-to-br from-primary/10 to-accent/5 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-4 flex items-center justify-between">
                       <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                           <FileText className="w-5 h-5 text-primary" />
                         </div>
                         <div>
                           <h4 className="font-semibold text-sm">Latest Health Record</h4>
                           <p className="text-xs text-muted-foreground">Updated 2 days ago</p>
                         </div>
                       </div>
                       <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    </CardContent>
                 </Card>
               </motion.div>

            </div>

         </motion.div>
      </div>
   )
}
