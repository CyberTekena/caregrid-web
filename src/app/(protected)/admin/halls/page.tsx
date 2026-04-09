"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Building2, Search, Plus, Activity, ArrowRight, ShieldCheck, Navigation, Zap, Flame, Loader2, AlertTriangle } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useHalls } from "@/hooks/use-halls"

export default function AdminHalls() {
  const [heatmapMode, setHeatmapMode] = useState(false)
  const { halls, loading, error } = useHalls()

  const hallsWithMeta = halls.map(h => ({
    id: h.id,
    name: h.name.replace(" Cubicle", ""),
    cubicleId: h.id.toUpperCase() + "-CUB",
    status: h.status === "inactive" ? "Maintenance" : h.status === "busy" ? "Busy" : "Active",
    staff: h.description ? h.description : "Assigned responder team",
    population: 0,
    density: h.status === "busy" ? 84 : h.status === "inactive" ? 18 : 54,
  }))

  const busyHall = hallsWithMeta.find(h => h.status === 'Busy')

  // Show loading state
  if (loading) {
    return (
      <div className="flex-1 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading hall data...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="flex-1 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-8 h-8 text-destructive mx-auto mb-4" />
          <p className="text-destructive">Failed to load hall data</p>
          <p className="text-sm text-muted-foreground mt-2">{error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 p-4 md:p-8 space-y-8 max-w-[1200px] mx-auto w-full relative z-10 font-sans">
      
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/40 pb-6">
         <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-2">
               Hall Health Nodes
            </h1>
            <p className="text-muted-foreground mt-1">Configure and monitor localized healthcare facilities across residence halls.</p>
         </div>
         <div className="flex gap-2">
            <Button 
               onClick={() => setHeatmapMode(!heatmapMode)}
               variant={heatmapMode ? "destructive" : "outline"}
               className={`rounded-xl h-12 px-6 font-black gap-2 transition-all ${heatmapMode ? 'shadow-lg shadow-destructive/30' : 'bg-background/50'}`}
            >
               {heatmapMode ? <Flame className="w-5 h-5 animate-pulse" /> : <Activity className="w-5 h-5" />}
               {heatmapMode ? "Heatmap Active" : "View Health Heatmap"}
            </Button>
            <Button className="rounded-xl h-12 px-6 bg-primary hover:bg-primary/90 text-white font-bold gap-2 shadow-lg shadow-primary/20">
               <Plus className="w-5 h-5" /> Provision Node
            </Button>
         </div>
      </motion.div>

      {/* Utilities */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between pb-2">
         <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input placeholder="Filter by hall name or cubicle ID..." className="pl-11 h-12 bg-background/50 border-border/50 rounded-2xl" />
         </div>
         <div className="flex gap-2 w-full md:w-auto">
            <Button variant="outline" className="h-12 rounded-2xl bg-background/50 border-border/50 gap-2"><Navigation className="w-4 h-4" /> View Map</Button>
            <Button variant="outline" className="h-12 rounded-2xl bg-background/50 border-border/50 gap-2 font-bold px-6">Total: {hallsWithMeta.length} Nodes</Button>
         </div>
      </div>

      {heatmapMode && (
         <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: "auto" }} 
            className="bg-destructive/5 border border-destructive/20 p-6 rounded-3xl mb-8 relative overflow-hidden"
         >
            <div className="flex items-center gap-4 mb-4 relative z-10">
               <div className="w-10 h-10 rounded-xl bg-destructive flex items-center justify-center text-white shadow-lg">
                  <Flame className="w-6 h-6" />
               </div>
               <div>
                  <h3 className="font-black text-lg text-destructive">Incident Density Alert</h3>
                  <p className="text-xs font-bold text-destructive/70 uppercase tracking-widest">Heatmap active based on last 24h triggers</p>
               </div>
            </div>
            <p className="text-sm font-medium text-foreground/80 leading-relaxed max-w-2xl relative z-10">
               {busyHall ? `${busyHall.name} is showing a high density (${busyHall.density}%) cluster of incidents.` : "A hall node is showing elevated activity."} 
               Recommend temporary relocation of additional standby responders to {busyHall ? `${busyHall.name} Node ${busyHall.cubicleId}` : "the busiest node"}.
            </p>
         </motion.div>
      )}

      <motion.div layout initial="hidden" animate="show" className="grid gap-6 md:grid-cols-2">
         {hallsWithMeta.map((hall, idx) => (
            <motion.div key={idx} layout variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }} whileHover={{ scale: 1.01 }}>
               <Card className={`border-border/50 bg-background/60 backdrop-blur-xl shadow-lg h-full overflow-hidden relative group transition-all duration-500 ${heatmapMode && hall.density > 70 ? 'ring-2 ring-destructive/40 bg-destructive/5' : ''}`}>
                  
                  {/* Heatmap Overlay Layer */}
                  <AnimatePresence>
                     {heatmapMode && (
                        <motion.div 
                           initial={{ opacity: 0 }} 
                           animate={{ opacity: hall.density / 100 * 0.2 }} 
                           exit={{ opacity: 0 }}
                           className="absolute inset-0 bg-destructive z-0"
                        />
                     )}
                  </AnimatePresence>

                  <div className="absolute top-0 right-0 p-8 opacity-5 -mr-4 -mt-4">
                     <Building2 className="w-24 h-24" />
                  </div>

                  <CardHeader className="p-6 border-b border-border/40 bg-muted/20 flex flex-row items-center justify-between relative z-10">
                     <div>
                        <CardTitle className="text-xl font-black font-sans">{hall.name}</CardTitle>
                        <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-primary mt-1">Node ID: {hall.cubicleId}</CardDescription>
                     </div>
                     <Badge className={`${hall.status === 'Active' ? 'bg-green-500/10 text-green-600 border-green-500/20' : 'bg-amber-500/10 text-amber-600 border-amber-500/20'} font-bold`}>
                        {hall.status}
                     </Badge>
                  </CardHeader>
                  
                  <CardContent className="p-6 space-y-6 relative z-10">
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                           <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Active Personnel</p>
                           <p className="text-sm font-bold flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-primary" /> {hall.staff}</p>
                        </div>
                        <div className="text-right space-y-1">
                           <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Density Index</p>
                           <p className={`text-sm font-black flex items-center justify-end gap-1.5 ${hall.density > 70 ? 'text-destructive' : 'text-foreground'}`}>
                              {hall.density}% 
                              {hall.density > 70 ? <Activity className="w-3.5 h-3.5 animate-pulse" /> : <Zap className="w-3.5 h-3.5 text-accent" />}
                           </p>
                        </div>
                     </div>
                     
                     <div className="pt-4 flex gap-2">
                        <Button className={`flex-1 rounded-xl font-bold transition-all text-xs ${heatmapMode && hall.density > 70 ? 'bg-destructive text-white border-none' : 'bg-primary/10 text-primary border-none hover:bg-primary hover:text-white'}`}>
                           {heatmapMode && hall.density > 70 ? "Deploy Reinforcements" : "Configure Spatial Node"}
                        </Button>
                        <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all">
                           <ArrowRight className="w-4 h-4" />
                        </Button>
                     </div>
                  </CardContent>
               </Card>
            </motion.div>
         ))}
      </motion.div>
    </div>
  )
}
