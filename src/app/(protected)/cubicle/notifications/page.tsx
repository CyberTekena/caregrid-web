"use client"

import { motion } from "framer-motion"
import { Bell, AlertTriangle, Package, CheckCheck, Trash2, ShieldAlert, Clock, MoreVertical, Loader2 } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCurrentUser } from "@/hooks/use-current-user"
import { useIncidents } from "@/hooks/use-incidents"
import { useHalls } from "@/hooks/use-halls"

export default function CubicleNotifications() {
  const { user, loading: userLoading } = useCurrentUser()
  const { halls, loading: hallsLoading } = useHalls()
  const { incidents, loading: incidentsLoading } = useIncidents(user?.hall_id || undefined)

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  }

  type NotificationItem = {
    id: number
    title: string
    desc: string
    type: string
    time: string
    unRead: boolean
  }

  const hallName = halls.find(h => h.id === user?.hall_id)?.name || user?.hall_id?.replace(/-/g, ' ') || 'your hall'
  const activeIncident = incidents.find(i => i.status !== 'resolved')
  const unreadCount = incidents.filter(i => i.status !== 'resolved').length

  const notifications = [
    activeIncident ? {
      id: 1,
      title: "Emergency Alert",
      desc: `${activeIncident.student_name || 'A student'} in ${activeIncident.room_number || 'their room'} requires immediate attention at ${hallName}.`,
      type: "emergency",
      time: "Just now",
      unRead: true
    } : null,
    {
      id: 2,
      title: "Operational Summary",
      desc: `${unreadCount} open request${unreadCount === 1 ? '' : 's'} pending for ${hallName} cubicle.`,
      type: "system",
      time: "Now",
      unRead: false
    },
    {
      id: 3,
      title: "Inventory Reminder",
      desc: `Quick stock review recommended for ${hallName} supplies.`,
      type: "inventory",
      time: "15 mins ago",
      unRead: unreadCount > 0
    }
  ].filter((item): item is NotificationItem => Boolean(item))

  if (userLoading || hallsLoading || incidentsLoading) {
    return (
      <div className="flex-1 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading operations alerts...</p>
        </div>
      </div>
    )
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'inventory': return <Package className="w-5 h-5 text-amber-500" />
      case 'referral': return <ShieldAlert className="w-5 h-5 text-primary" />
      case 'system': return <CheckCheck className="w-5 h-5 text-green-600" />
      default: return <Bell className="w-5 h-5 text-muted-foreground" />
    }
  }

  return (
    <div className="flex-1 p-4 md:p-8 space-y-8 max-w-[1000px] mx-auto w-full relative z-10 font-sans">
      
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center bg-background/60 backdrop-blur-xl p-6 rounded-3xl border border-white/20 shadow-xl shadow-black/5">
         <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-2">
               Operations Alerts
            </h1>
            <p className="text-muted-foreground mt-1">Real-time status updates and operational logs for {hallName} hub.</p>
         </div>
         <div className="flex items-center gap-2 text-primary">
            <Button variant="outline" className="rounded-full bg-background/50 h-10 gap-2 border-border/50 text-xs font-bold">
               <CheckCheck className="w-4 h-4" /> Clear All
            </Button>
         </div>
      </motion.div>

      <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
         <Tabs defaultValue="all" className="w-full">
            <TabsList className="bg-muted/50 p-1 rounded-xl mb-6">
               <TabsTrigger value="all" className="rounded-lg px-6 text-xs font-bold uppercase tracking-widest">All Events</TabsTrigger>
               <TabsTrigger value="alerts" className="rounded-lg px-6 text-xs font-bold uppercase tracking-widest">Priority</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-3">
               {notifications.map((notif) => (
                  <motion.div key={notif.id} variants={{ hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0 } }}>
                     <Card className={`border-border/50 transition-all cursor-pointer group hover:bg-muted/30 ${notif.unRead ? 'bg-primary/5 border-primary/20 shadow-md ring-1 ring-primary/10' : 'bg-background/60'}`}>
                        <CardContent className="p-4 flex gap-4 items-start">
                           <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${notif.unRead ? 'bg-background border border-primary/20' : 'bg-muted/40'}`}>
                              {getIcon(notif.type)}
                           </div>
                           
                           <div className="flex-1 space-y-1">
                              <div className="flex justify-between items-center">
                                 <h4 className={`text-sm font-bold ${notif.unRead ? 'text-primary' : 'text-foreground'}`}>
                                    {notif.title}
                                    {notif.unRead && <span className="ml-2 inline-block w-1.5 h-1.5 rounded-full bg-primary" />}
                                 </h4>
                                 <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{notif.time}</span>
                              </div>
                              <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl font-medium">
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
    </div>
  )
}
