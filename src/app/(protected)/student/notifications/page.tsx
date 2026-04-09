"use client"

import { motion } from "framer-motion"
import { Bell, Pill, Calendar, AlertTriangle, ShieldCheck, CheckCheck, Trash2, MoreVertical, Loader2 } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCurrentUser } from "@/hooks/use-current-user"
import { useMedications } from "@/hooks/use-medications"
import { useIncidents } from "@/hooks/use-incidents"

export default function StudentNotifications() {
  const { user, loading: userLoading } = useCurrentUser()
  const { meds, loading: medsLoading } = useMedications(user?.id ?? "")
  const { incidents, loading: incidentsLoading } = useIncidents(user?.hall_id || undefined)

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

  type NotificationItem = {
    id: number
    title: string
    desc: string
    type: string
    time: string
    unRead: boolean
  }

  const hallName = user?.hall_id?.replace(/-/g, ' ') || 'your hall'
  const unreadMed = meds.find(m => !m.last_taken)
  const activeIncident = incidents.find(i => i.status !== 'resolved')

  const notifications = [
    unreadMed ? {
      id: 1,
      title: "Medication Reminder",
      desc: `Time for ${unreadMed.name}. Scheduled for ${unreadMed.schedule_time}.`,
      type: "medication",
      time: "Now",
      unRead: true
    } : null,
    activeIncident ? {
      id: 2,
      title: `Incident Alert in ${hallName}`,
      desc: `${activeIncident.student_name || 'A student'} requires assistance in ${activeIncident.room_number || 'their room'}.`,
      type: "emergency",
      time: "Just now",
      unRead: true
    } : null,
    {
      id: 3,
      title: "System Update",
      desc: `All health feeds are synced for ${hallName}.`,
      type: "security",
      time: "Now",
      unRead: false
    }
  ].filter((item): item is NotificationItem => Boolean(item))

  if (userLoading || medsLoading || incidentsLoading) {
    return (
      <div className="flex-1 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading notifications...</p>
        </div>
      </div>
    )
  }

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
               {notifications.map((notif) => (
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
