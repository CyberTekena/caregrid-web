"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { User, Mail, MapPin, Phone, ShieldCheck, FileText, Droplet, Activity, Edit3, Camera, QrCode, X, Download, Shield } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function StudentProfile() {
  const [showQr, setShowQr] = useState(false)

  return (
    <div className="flex-1 p-4 md:p-8 space-y-8 max-w-[1200px] mx-auto w-full relative z-10 font-sans">
      
      {/* Page Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-end pb-4 border-b border-border/40">
         <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-2">
               My Health Profile
            </h1>
            <p className="text-muted-foreground mt-1">Manage your Babcock student health records and personal information.</p>
         </div>
         <Button onClick={() => setShowQr(true)} className="rounded-xl h-12 px-6 bg-primary hover:bg-primary/90 text-white font-bold gap-2 shadow-lg shadow-primary/20">
            <QrCode className="w-5 h-5" /> Show Medical ID
         </Button>
      </motion.div>

      <div className="grid gap-8 md:grid-cols-[1fr_2fr]">
        
        {/* Left Column: ID Card & Quick Stats */}
        <div className="space-y-6">
          <Card className="border-border/50 bg-background/60 backdrop-blur-xl shadow-xl shadow-black/5 overflow-hidden">
             <div className="h-24 bg-gradient-to-r from-primary to-accent relative">
               <div className="absolute top-2 right-2 bg-black/20 backdrop-blur-sm px-2 py-1 rounded text-[10px] text-white font-bold tracking-widest border border-white/20 uppercase">
                  Verified ID
               </div>
             </div>
             
             <CardContent className="px-6 pb-6 relative pt-0">
                <div className="flex justify-center -mt-12 mb-4 relative">
                   <div className="w-24 h-24 rounded-full border-4 border-background bg-muted flex items-center justify-center relative shadow-lg overflow-hidden group">
                      <User className="w-10 h-10 text-muted-foreground" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                         <Camera className="w-6 h-6 text-white" />
                      </div>
                   </div>
                </div>
                
                <div className="text-center mb-6">
                   <h2 className="text-2xl font-bold">Michael Doe</h2>
                   <p className="text-sm font-medium text-primary mb-1">Matric: 19/0045</p>
                   <p className="text-xs text-muted-foreground">Computer Science, 400L</p>
                </div>

                <div className="space-y-3">
                   <div className="flex items-center gap-3 text-sm text-foreground/80 bg-muted/30 p-2.5 rounded-lg border border-white/10">
                      <Mail className="w-4 h-4 text-primary" />
                      <span className="truncate">m.doe@student.babcock.edu.ng</span>
                   </div>
                   <div className="flex items-center gap-3 text-sm text-foreground/80 bg-muted/30 p-2.5 rounded-lg border border-white/10">
                      <Phone className="w-4 h-4 text-primary" />
                      <span>+234 812 345 6789</span>
                   </div>
                   <div className="flex items-center gap-3 text-sm text-foreground/80 bg-muted/30 p-2.5 rounded-lg border border-white/10">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>Welch Hall, Room 212</span>
                   </div>
                </div>
             </CardContent>
          </Card>

          <Card className="border-border/50 bg-background/60 backdrop-blur-xl shadow-lg">
             <CardHeader className="pb-3">
               <CardTitle className="text-sm flex items-center gap-2">
                 <ShieldCheck className="w-4 h-4 text-green-500" /> Clearance Status
               </CardTitle>
             </CardHeader>
             <CardContent>
                <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border border-green-500/20 px-3 py-1.5 text-xs font-bold">
                   Medically Cleared (Fall Semester)
                </Badge>
                <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                   Your medical records are up to date. Next standard checkup required in 142 days.
                </p>
             </CardContent>
          </Card>
        </div>

        {/* Right Column: Detailed Forms & Tabs */}
        <div className="h-full">
          <Card className="border-border/50 bg-background/60 backdrop-blur-xl shadow-xl shadow-black/5 h-full">
             <CardHeader className="border-b border-border/40 bg-muted/20">
               <div className="flex items-center justify-between">
                  <CardTitle>Medical Information</CardTitle>
                  <Button variant="outline" size="sm" className="bg-background/50 h-8 gap-2 rounded-full font-bold">
                     <Edit3 className="w-3.5 h-3.5" /> Edit Profile
                  </Button>
               </div>
               <CardDescription>
                 This information is securely shared with the Babcock Medical Center.
               </CardDescription>
             </CardHeader>
             
             <CardContent className="pt-6">
               <Tabs defaultValue="vitals" className="w-full">
                 <TabsList className="grid w-full grid-cols-3 mb-6 bg-muted/50 p-1 rounded-xl">
                    <TabsTrigger value="vitals" className="rounded-lg">Vitals</TabsTrigger>
                    <TabsTrigger value="history" className="rounded-lg">History</TabsTrigger>
                    <TabsTrigger value="emergency" className="rounded-lg">Contacts</TabsTrigger>
                 </TabsList>
                 
                 <TabsContent value="vitals" className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                       <div className="space-y-1 bg-primary/5 p-4 rounded-xl border border-primary/10">
                          <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest flex items-center gap-1.5"><Droplet className="w-3 h-3 text-red-500" /> Blood Group</span>
                          <p className="text-2xl font-black">O+</p>
                       </div>
                       <div className="space-y-1 bg-accent/5 p-4 rounded-xl border border-accent/10">
                          <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest flex items-center gap-1.5"><Activity className="w-3 h-3 text-accent" /> Genotype</span>
                          <p className="text-2xl font-black">AA</p>
                       </div>
                       <div className="space-y-1 bg-muted/30 p-4 rounded-xl border border-border/50">
                          <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">H / W</span>
                          <p className="text-2xl font-black tracking-tighter">178<span className="text-sm font-medium opacity-50">cm</span> / 72<span className="text-sm font-medium opacity-50">kg</span></p>
                       </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-border/40">
                       <h3 className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Conditions & Allergies</h3>
                       <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className="border-destructive/30 bg-destructive/5 text-destructive py-1.5 px-3 font-bold">Allergy: Penicillin</Badge>
                          <Badge variant="outline" className="border-amber-500/30 bg-amber-500/5 text-amber-600 py-1.5 px-3 font-bold">Mild Asthma</Badge>
                       </div>
                    </div>
                 </TabsContent>
                 
                 <TabsContent value="history" className="space-y-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="flex gap-4 p-4 rounded-xl border border-border/50 bg-muted/20">
                         <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5 text-primary" />
                         </div>
                         <div>
                            <h4 className="font-bold text-sm">Routine Physical Examination</h4>
                            <p className="text-xs text-muted-foreground mt-1">Conducted by Dr. Adeyekun at Babcock Hospital.</p>
                            <div className="mt-2 text-[10px] font-black text-primary uppercase tracking-widest">Oct 1{i}, 2023</div>
                         </div>
                      </div>
                    ))}
                 </TabsContent>

                 <TabsContent value="emergency" className="space-y-4">
                    <div className="grid gap-4">
                       <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                             <Label className="text-[10px] uppercase font-black text-muted-foreground">Primary Contact</Label>
                             <Input readOnly value="Sarah Doe" className="bg-muted/50 rounded-xl" />
                          </div>
                          <div className="space-y-2">
                             <Label className="text-[10px] uppercase font-black text-muted-foreground">Relationship</Label>
                             <Input readOnly value="Mother" className="bg-muted/50 rounded-xl" />
                          </div>
                       </div>
                       <div className="space-y-2">
                          <Label className="text-[10px] uppercase font-black text-muted-foreground">Phone Number</Label>
                          <Input readOnly value="+234 803 111 2222" className="bg-muted/50 rounded-xl" />
                       </div>
                    </div>
                 </TabsContent>
               </Tabs>
             </CardContent>
          </Card>
        </div>
      </div>

      {/* QR Code Modal Overlay */}
      <AnimatePresence>
         {showQr && (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-md"
               onClick={() => setShowQr(false)}
            >
               <motion.div 
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  className="w-full max-w-[400px] bg-background rounded-3xl overflow-hidden shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
               >
                  <div className="bg-primary p-6 text-white relative">
                     <Button 
                        onClick={() => setShowQr(false)}
                        variant="ghost" 
                        size="icon" 
                        className="absolute top-4 right-4 text-white hover:bg-white/10 rounded-full"
                     >
                        <X className="w-5 h-5" />
                     </Button>
                     <div className="flex items-center gap-3 mb-2">
                        <Shield className="w-6 h-6" />
                        <h3 className="font-black text-xl tracking-tight">CareGrid Medical ID</h3>
                     </div>
                     <p className="text-white/70 text-sm font-medium">Babcock Institutional Health Record</p>
                  </div>
                  
                  <div className="p-8 flex flex-col items-center">
                     <div className="w-64 h-64 bg-white p-4 rounded-3xl shadow-inner mb-6 flex items-center justify-center border-4 border-muted">
                        {/* Simulated QR Code SVG */}
                        <svg viewBox="0 0 100 100" className="w-full h-full text-foreground opacity-80">
                           <path fill="currentColor" d="M0 0h34v34H0zM22 22H12V12h10zM66 0h34v34H66zM88 22H78V12h10zM0 66h34v34H0zM22 88H12V78h10zM40 0h20v10H40zM40 20h10v20H40zM20 40h20v10H20zM60 40h40v10H60zM40 60h20v10H40zM0 40h10v10H0zM80 60h10v10H80zM60 80h10v20H60zM80 80h20v10H80z" />
                           <rect x="42" y="42" width="16" height="16" className="text-primary" fill="currentColor" rx="2" />
                        </svg>
                     </div>
                     
                     <div className="w-full space-y-4">
                        <div className="flex justify-between items-center bg-muted/30 p-4 rounded-2xl border border-border/50">
                           <div>
                              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Medical Hash</p>
                              <p className="text-sm font-mono font-bold">BC-19-0045-O-POS</p>
                           </div>
                           <Badge className="bg-green-500/10 text-green-600 border-none font-black text-[10px]">Verified</Badge>
                        </div>
                        <Button className="w-full rounded-2xl h-12 bg-primary font-bold shadow-lg shadow-primary/20">
                           <Download className="w-4 h-4 mr-2" /> Download Digital Card
                        </Button>
                     </div>
                  </div>
               </motion.div>
            </motion.div>
         )}
      </AnimatePresence>

    </div>
  )
}
