"use client"

import { motion } from "framer-motion"
import { Package, Plus, AlertCircle, ShoppingCart, Search, Filter, ArrowUpRight, CheckCircle2 } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function CubicleInventory() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const items = [
    { name: "Adhesive Bandages", category: "Wound Care", stock: 85, threshold: 20, status: "Optimal" },
    { name: "Salbutamol Inhaler", category: "Respiratory", stock: 4, threshold: 10, status: "Critical" },
    { name: "Paracetamol 500mg", category: "Analgesics", stock: 42, threshold: 30, status: "Low" },
    { name: "Sterile Gauze Pads", category: "Wound Care", stock: 120, threshold: 50, status: "Optimal" },
    { name: "Surgical Spirit", category: "Disinfectant", stock: 15, threshold: 5, status: "Optimal" },
  ]

  return (
    <div className="flex-1 p-4 md:p-8 space-y-8 max-w-[1200px] mx-auto w-full relative z-10 font-sans">
      
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
         <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-2">
               Inventory & Supplies
            </h1>
            <p className="text-muted-foreground mt-1">Monitor and restock hall-based medical supplies.</p>
         </div>
         <div className="flex gap-2">
            <Button variant="outline" className="rounded-xl h-12 px-6 border-border/50 bg-background/50 font-bold gap-2">
               <ArrowUpRight className="w-5 h-5" /> Request Refill
            </Button>
            <Button className="rounded-xl h-12 px-6 bg-primary hover:bg-primary/90 text-white font-bold gap-2 shadow-lg shadow-primary/20">
               <Plus className="w-5 h-5" /> Add Stock
            </Button>
         </div>
      </motion.div>

      {/* Stats Summary */}
      <div className="grid gap-6 md:grid-cols-3">
         <Card className="border-border/50 bg-background/60 backdrop-blur-xl shadow-lg border-l-4 border-l-primary">
            <CardHeader className="pb-2">
               <CardTitle className="text-sm font-bold opacity-60 flex items-center gap-2">
                  <Package className="w-4 h-4" /> Total SKU Count
               </CardTitle>
            </CardHeader>
            <CardContent>
               <div className="text-3xl font-black">24 Items</div>
            </CardContent>
         </Card>
         <Card className="border-border/50 bg-background/60 backdrop-blur-xl shadow-lg border-l-4 border-l-destructive">
            <CardHeader className="pb-2">
               <CardTitle className="text-sm font-bold text-destructive flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> Low Stock Items
               </CardTitle>
            </CardHeader>
            <CardContent>
               <div className="text-3xl font-black text-destructive">2</div>
            </CardContent>
         </Card>
         <Card className="border-border/50 bg-background/60 backdrop-blur-xl shadow-lg border-l-4 border-l-green-500">
            <CardHeader className="pb-2">
               <CardTitle className="text-sm font-bold text-green-600 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Last Restock
               </CardTitle>
            </CardHeader>
            <CardContent>
               <div className="text-3xl font-black text-foreground">2d ago</div>
               <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">Verified by Admin</p>
            </CardContent>
         </Card>
      </div>

      {/* Inventory List */}
      <Card className="border-border/50 bg-background/60 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden">
         <CardHeader className="border-b border-border/40 p-6 flex flex-row items-center justify-between space-y-0 bg-muted/20">
            <CardTitle>Resource Monitor</CardTitle>
            <div className="flex items-center gap-4">
               <div className="relative group lg:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input placeholder="Find items..." className="pl-9 h-9 bg-background/50 border-border/50 rounded-xl" />
               </div>
               <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl"><Filter className="w-3.5 h-3.5" /></Button>
            </div>
         </CardHeader>
         <CardContent className="p-0">
            <motion.div variants={container} initial="hidden" animate="show" className="divide-y divide-border/40">
               {items.map((item, idx) => (
                  <motion.div 
                     key={idx} 
                     variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }} 
                     className="group flex flex-col md:flex-row items-center justify-between p-6 hover:bg-muted/30 transition-colors"
                  >
                     <div className="flex items-center gap-4 w-full md:w-auto mb-4 md:mb-0">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${item.status === 'Critical' ? 'bg-destructive/10 border-destructive/20 text-destructive' : 'bg-primary/10 border-primary/20 text-primary'}`}>
                           <Package className="w-6 h-6" />
                        </div>
                        <div className="space-y-0.5">
                           <h4 className="font-bold text-lg leading-none">{item.name}</h4>
                           <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">{item.category}</p>
                        </div>
                     </div>

                     <div className="flex-1 max-w-sm w-full px-8 hidden lg:block">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase mb-2">
                           <span className="text-muted-foreground">Current Stock: {item.stock} units</span>
                           <span className={item.status === 'Critical' ? 'text-destructive' : 'text-primary'}>{item.status}</span>
                        </div>
                        <Progress value={(item.stock / 150) * 100} className={`h-1.5 rounded-full ${item.status === 'Critical' ? 'bg-destructive/10' : 'bg-primary/10'}`} />
                     </div>

                     <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                        <div className="text-right">
                           <p className="text-2xl font-black leading-none">{item.stock}</p>
                           <p className="text-[10px] text-muted-foreground font-bold tracking-widest mt-1 uppercase">Available</p>
                        </div>
                        <Button size="icon" variant="outline" className="h-10 w-10 rounded-xl bg-background/50 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all">
                           <ShoppingCart className="w-4 h-4" />
                        </Button>
                     </div>
                  </motion.div>
               ))}
            </motion.div>
         </CardContent>
      </Card>
    </div>
  )
}
