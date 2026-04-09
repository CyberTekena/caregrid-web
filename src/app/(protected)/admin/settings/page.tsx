"use client"

import { motion } from "framer-motion"
import { Settings, Shield, Bell, Database, Lock, Globe, Save, RefreshCw } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"

export default function AdminSettings() {
  return (
    <div className="flex-1 p-4 md:p-8 space-y-8 max-w-[1200px] mx-auto w-full relative z-10 font-sans">
      
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center bg-background/60 backdrop-blur-xl p-6 rounded-3xl border border-white/20 shadow-xl shadow-black/5">
         <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-2">
               System Configuration
            </h1>
            <p className="text-muted-foreground mt-1">Manage global platform rules, security protocols, and institutional branding.</p>
         </div>
         <Button className="rounded-xl h-12 px-6 bg-primary hover:bg-primary/90 text-white font-bold gap-2 shadow-lg shadow-primary/20">
            <Save className="w-5 h-5" /> Save Changes
         </Button>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-[1fr_3fr]">
         
         {/* Vertical Tabs Mock */}
         <div className="space-y-2">
            {[
               { icon: Globe, label: "General Settings" },
               { icon: Shield, label: "Security & Auth" },
               { icon: Bell, label: "Notification Rules" },
               { icon: Database, label: "Data Management" },
               { icon: Lock, label: "Access Control" }
            ].map((tab, idx) => (
               <Button key={idx} variant="ghost" className={`w-full justify-start h-12 rounded-xl text-sm font-bold gap-3 ${idx === 1 ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted-foreground hover:bg-muted'}`}>
                  <tab.icon className="w-5 h-5" /> {tab.label}
               </Button>
            ))}
         </div>

         {/* Settings Content */}
         <div className="space-y-6">
            <Card className="border-border/50 bg-background/60 backdrop-blur-xl shadow-xl">
               <CardHeader className="border-b border-border/40">
                  <CardTitle>Institutional Authentication</CardTitle>
                  <CardDescription>Configure how students and staff access the Babcock CareGrid platform.</CardDescription>
               </CardHeader>
               <CardContent className="pt-6 space-y-8">
                  
                  <div className="flex items-center justify-between">
                     <div className="space-y-0.5">
                        <h4 className="font-bold text-sm">Enforce Babcock Email SSO</h4>
                        <p className="text-xs text-muted-foreground">Only allow logins from @student.babcock.edu.ng domains.</p>
                     </div>
                     <Switch checked />
                  </div>

                  <div className="flex items-center justify-between">
                     <div className="space-y-0.5">
                        <h4 className="font-bold text-sm">2FA for Staff Accounts</h4>
                        <p className="text-xs text-muted-foreground">Require hardware tokens or OTP for all Responder and Admin accounts.</p>
                     </div>
                     <Switch checked />
                  </div>

                  <div className="pt-4 border-t border-border/40 space-y-4">
                     <h4 className="font-bold text-sm uppercase tracking-widest text-primary/70">Session Management</h4>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <label className="text-xs font-bold text-muted-foreground">Idle Timeout (Minutes)</label>
                           <Input type="number" defaultValue={30} className="rounded-xl h-11 bg-background/50" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-xs font-bold text-muted-foreground">Max Concurrent Sessions</label>
                           <Input type="number" defaultValue={2} className="rounded-xl h-11 bg-background/50" />
                        </div>
                     </div>
                  </div>

               </CardContent>
            </Card>

            <Card className="border-border/50 bg-background/60 backdrop-blur-xl shadow-xl">
               <CardHeader className="border-b border-border/40 bg-destructive/5">
                  <CardTitle className="text-destructive">Critical Health Rules</CardTitle>
                  <CardDescription>Global thresholds for emergency triggers and automatic escalations.</CardDescription>
               </CardHeader>
               <CardContent className="pt-6 space-y-6">
                  <div className="flex items-center justify-between">
                     <div className="space-y-0.5">
                        <h4 className="font-bold text-sm">Auto-Escalate SOS</h4>
                        <p className="text-xs text-muted-foreground">Escalate to Hospital if Responder is not en-route within 5 minutes.</p>
                     </div>
                     <Switch checked />
                  </div>
                  <Button variant="outline" className="w-full rounded-xl h-11 font-bold text-xs gap-2 border-destructive/20 text-destructive hover:bg-destructive/10">
                     <RefreshCw className="w-4 h-4" /> Reset Incident Protocols
                  </Button>
               </CardContent>
            </Card>
         </div>

      </div>
    </div>
  )
}
