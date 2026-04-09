"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Users, Search, Filter, Plus, MoreVertical, Mail, Shield, GraduationCap, Building2, Loader2 } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAllUsers } from "@/hooks/use-all-users"
import { useHalls } from "@/hooks/use-halls"

export default function AdminUsers() {
  const [search, setSearch] = useState("")
  const { users, loading: usersLoading } = useAllUsers()
  const { halls, loading: hallsLoading } = useHalls()

  const loading = usersLoading || hallsLoading

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const getHallName = (hallId: string | null) => {
    if (!hallId) return "Not Assigned"
    const hall = halls.find(h => h.id === hallId)
    return hall ? hall.name.replace(" Cubicle", "") : hallId
  }

  const displayUsers = users.map(user => ({
    id: user.id,
    name: user.full_name || "Unknown",
    email: user.email || "No email",
    role: user.role === 'student' ? 'Student' : user.role === 'cubicle' ? 'Cubicle Staff' : user.role === 'admin' ? 'Admin' : 'Hospital',
    status: "Active", // For now, assume all are active
    hall: getHallName(user.hall_id)
  }))

  const filteredUsers = displayUsers.filter((user) => {
    const query = search.toLowerCase()
    return (
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.hall.toLowerCase().includes(query) ||
      user.role.toLowerCase().includes(query)
    )
  })

  const getRoleIcon = (role: string) => {
    switch(role) {
      case 'Student': return <GraduationCap className="w-4 h-4" />
      case 'Cubicle Staff': return <Shield className="w-4 h-4" />
      case 'Hospital': return <Building2 className="w-4 h-4" />
      default: return <Users className="w-4 h-4" />
    }
  }

  return (
    <div className="flex-1 p-4 md:p-8 space-y-8 max-w-[1200px] mx-auto w-full relative z-10 font-sans">
      
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
         <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-2">
               User Management
            </h1>
            <p className="text-muted-foreground mt-1">Institutional account directory and role management.</p>
         </div>
         <Button className="rounded-xl h-12 px-6 bg-primary hover:bg-primary/90 text-white font-bold gap-2 shadow-lg shadow-primary/20">
            <Plus className="w-5 h-5" /> Onboard New User
         </Button>
      </motion.div>

      {/* Utilities */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between pb-2">
         <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search by name, email or matric..."
              className="pl-11 h-12 bg-background/50 border-border/50 rounded-2xl"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
         </div>
         <div className="flex gap-2 w-full md:w-auto">
            <Tabs defaultValue="all" className="w-auto">
               <TabsList className="bg-muted/50 p-1 rounded-xl">
                  <TabsTrigger value="all" className="rounded-lg px-4">All</TabsTrigger>
                  <TabsTrigger value="students" className="rounded-lg px-4">Students</TabsTrigger>
                  <TabsTrigger value="staff" className="rounded-lg px-4">Staff</TabsTrigger>
               </TabsList>
            </Tabs>
            <Button variant="outline" className="h-12 rounded-2xl bg-background/50 border-border/50 gap-2"><Filter className="w-4 h-4" /> Filters</Button>
         </div>
      </div>

      {loading ? (
         <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
         </div>
      ) : (
         <motion.div variants={container} initial="hidden" animate="show" className="grid gap-4">
            {filteredUsers.map((user, idx) => (
               <motion.div key={idx} variants={{ hidden: { opacity: 0, scale: 0.98 }, show: { opacity: 1, scale: 1 } }}>
               <Card className="border-border/50 bg-background/60 backdrop-blur-xl shadow-md hover:shadow-lg transition-all cursor-pointer group">
                  <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-6">
                     <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                           {getRoleIcon(user.role)}
                        </div>
                        <div className="space-y-0.5">
                           <h4 className="font-bold text-lg leading-none">{user.name}</h4>
                           <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                              <Mail className="w-3 h-3" /> {user.email}
                           </div>
                        </div>
                     </div>
                     
                     <div className="flex items-center gap-12 w-full md:w-auto justify-between md:justify-end">
                        <div className="text-right flex flex-col items-end">
                           <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-bold text-[10px] uppercase tracking-widest">{user.role}</Badge>
                           <p className="text-[10px] text-muted-foreground font-bold mt-1">{user.hall}</p>
                        </div>
                        <div className="flex items-center gap-2">
                           <Badge className="bg-green-500/10 text-green-600 border-none font-bold text-[10px] uppercase tracking-widest">{user.status}</Badge>
                           <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                              <MoreVertical className="w-4 h-4 text-muted-foreground" />
                           </Button>
                        </div>
                     </div>
                  </CardContent>
               </Card>
            </motion.div>
         ))}
      </motion.div>
      )}
    </div>
  )
}
