"use client"

import { motion } from "framer-motion"
import { Bell, Pill, Calendar, AlertTriangle, ShieldCheck, CheckCheck, Trash2, MoreVertical } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function StudentNotifications() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  }

  const item = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0 }
  }

  const mockNotifications = [
    {
      id: 1,
      title: "Medication Reminder",
      desc: "It's time to take your Multivitamins dosage. Don't forget to mark it as taken in your dashboard.",
      type: "medication",
      time: "10 mins ago",
      unRead: true
    },
    {
      id: 2,
      title: "Appointment Confirmed",
      desc: "Your routine checkup with Dr. Adeyekun for Thursday, April 12 has been officially confirmed.",
      type: "appointment",
      time: "2 hours ago",
      unRead: true
    },
    {
      id: 3,
      title: "Emergency Alert",
      desc: "A medical responder has been deployed to Welch Hall. Please clear the corridor area.",
      type: "emergency",
      time: "5 hours ago",
      unRead: false
    },
    {
      id: 4,
      title: "Security Update",
      desc: "Your account was successfully logged in from a new Chrome browser on Windows.",
      type: "security",
      time: "1 day ago",
      unRead: false
    }
  ]

  const getIcon = (type: string) => {
    switch (type) {
      case 'medication': return <Pill className="w-5 h-5 text-accent" />
      case 'appointment': return <Calendar className="w-5 h-5 text-primary" />
      case 'emergency': return <AlertTriangle className="w-5 h-5 text-destructive" />
      case 'security': return <ShieldCheck className="w-5 h-5 text-green-600" />
      default: return <Bell className="w-5 h-5 text-muted-foreground" />
    }
  }

  return (
    <div className="flex-1 p-4 md:p-8 space-y-8 max-w-[1000px] mx-auto w-full relative z-10 font-sans">
      
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center bg-background/60 backdrop-blur-xl p-6 rounded-3xl border border-white/20 shadow-xl shadow-black/5">
         <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-2">
               Notifications
            </h1>
            <p className="text-muted-foreground mt-1">Keep track of your health regime and system alerts.</p>
         </div>
         <div className="flex items-center gap-2">
            <Button variant="outline" className="rounded-full bg-background/50 h-10 gap-2 border-border/50 text-xs font-bold">
               <CheckCheck className="w-4 h-4" /> Mark all read
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 text-muted-foreground">
               <Trash2 className="w-4 h-4" />
            </Button>
         </div>
      </motion.div>

      <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
         <Tabs defaultValue="all" className="w-full">
            <TabsList className="bg-muted/50 p-1 rounded-xl mb-6">
               <TabsTrigger value="all" className="rounded-lg px-6">All Notifications</TabsTrigger>
               <TabsTrigger value="unread" className="rounded-lg px-6">Unread</TabsTrigger>
               <TabsTrigger value="alerts" className="rounded-lg px-6">Critical Alerts</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-3">
               {mockNotifications.map((notif) => (
                  <motion.div key={notif.id} variants={item}>
                     <Card className={`border-border/50 transition-all cursor-pointer group hover:bg-muted/30 ${notif.unRead ? 'bg-primary/5 border-primary/20 shadow-md ring-1 ring-primary/10' : 'bg-background/60'}`}>
                        <CardContent className="p-4 flex gap-4 items-start translate-x-0">
                           <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${notif.unRead ? 'bg-background border border-primary/20' : 'bg-muted/40'}`}>
                              {getIcon(notif.type)}
                           </div>
                           
                           <div className="flex-1 space-y-1">
                              <div className="flex justify-between items-center">
                                 <h4 className={`text-sm font-bold ${notif.unRead ? 'text-primary' : 'text-foreground'}`}>
                                    {notif.title}
                                    {notif.unRead && <span className="ml-2 inline-block w-1.5 h-1.5 rounded-full bg-primary" />}
                                 </h4>
                                 <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">{notif.time}</span>
                              </div>
                              <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
                                 {notif.desc}
                              </p>
                           </div>

                           <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreVertical className="w-4 h-4 text-muted-foreground" />
                           </Button>
                        </CardContent>
                     </Card>
                  </motion.div>
               ))}
            </TabsContent>
         </Tabs>
      </motion.div>

      {/* Footer / Persistence check */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-center py-10">
         <div className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground/40 uppercase tracking-[0.2em] border-t border-muted/50 pt-4 px-12">
            <Bell className="w-3 h-3" /> End of Notifications
         </div>
      </motion.div>
    </div>
  )
}
