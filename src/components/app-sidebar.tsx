"use client"

import { motion } from "framer-motion"
import {
  HeartPulse,
  LayoutDashboard,
  UserSquare2,
  MapPin,
  Calendar,
  Pill,
  Activity,
  Bell,
  LogOut,
  ShieldAlert,
  ClipboardList,
  Users,
  Settings,
  BarChart3,
  Package
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter
} from "@/components/ui/sidebar"
import { useRouter, usePathname } from "next/navigation"
import { supabase } from "@/lib/supabase"

// Menu Configurations for different roles
const MENU_CONFIGS = {
  student: [
    { title: "Dashboard", url: "/student/dashboard", icon: LayoutDashboard },
    { title: "Emergency SOS", url: "/student/emergency", icon: HeartPulse },
    { title: "My Health Profile", url: "/student/profile", icon: UserSquare2 },
    { title: "Map & Routes", url: "/student/map", icon: MapPin },
    { title: "Appointments", url: "/student/appointments", icon: Calendar },
    { title: "Medications", url: "/student/medications", icon: Pill },
    { title: "Health Records", url: "/student/records", icon: Activity },
    { title: "Notifications", url: "/student/notifications", icon: Bell },
  ],
  cubicle: [
    { title: "Operations Hub", url: "/cubicle/dashboard", icon: LayoutDashboard },
    { title: "Active Requests", url: "/cubicle/requests", icon: ShieldAlert },
    { title: "Inventory", url: "/cubicle/inventory", icon: Package },
    { title: "Logs", url: "/cubicle/logs", icon: ClipboardList },
    { title: "Notifications", url: "/cubicle/notifications", icon: Bell },
  ],
  admin: [
    { title: "System Dashboard", url: "/admin/dashboard", icon: BarChart3 },
    { title: "User Management", url: "/admin/users", icon: Users },
    { title: "Hall Analytics", url: "/admin/halls", icon: LayoutDashboard },
    { title: "Health Trends", url: "/admin/analytics", icon: Activity },
    { title: "System Settings", url: "/admin/settings", icon: Settings },
  ]
}

export function AppSidebar() {
  const router = useRouter()
  const pathname = usePathname()

  // Determine current role based on pathname
  const getCurrentRole = () => {
    if (pathname.startsWith('/student')) return 'student'
    if (pathname.startsWith('/cubicle')) return 'cubicle'
    if (pathname.startsWith('/admin')) return 'admin'
    return 'student'
  }

  const role = getCurrentRole()
  const navItems = MENU_CONFIGS[role as keyof typeof MENU_CONFIGS] || MENU_CONFIGS.student

  const getRoleBadge = (role: string) => {
    switch(role) {
      case 'student': return "Student Portal"
      case 'cubicle': return "Cubicle Operations"
      case 'admin': return "Institutional Admin"
      default: return ""
    }
  }

  return (
    <Sidebar className="hidden md:flex border-r border-border/40 bg-background/60 backdrop-blur-xl">
      <SidebarHeader className="h-24 flex flex-col justify-center px-6 border-b border-border/40 space-y-1">
        <div className="flex items-center gap-3 font-black text-xl text-primary cursor-pointer hover:opacity-80 transition-opacity" onClick={() => router.push('/')}>
          <div className="bg-primary/10 p-2 rounded-xl">
             <HeartPulse className="h-6 w-6 text-primary" />
          </div>
          <span>BU CareGrid</span>
        </div>
        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.1em] pl-1 opacity-70">
           {getRoleBadge(role)}
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-3 py-6">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-[0.2em] pl-2 mb-4">Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {navItems.map((item) => {
                const isActive = pathname === item.url
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      onClick={() => router.push(item.url)}
                      className={`h-11 px-4 rounded-xl font-semibold text-sm transition-all duration-300 ${
                        isActive 
                          ? "bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary/90 hover:text-white translate-x-1" 
                          : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                      } ${item.title === 'Emergency SOS' && !isActive ? 'text-destructive hover:text-destructive hover:bg-destructive/10' : ''}`}
                    >
                      <item.icon className={`w-5 h-5 mr-1 ${isActive ? 'scale-110' : ''}`} />
                      <span>{item.title}</span>
                      {isActive && <motion.div layoutId="active-pill" className="absolute right-2 w-1.5 h-1.5 rounded-full bg-white shadow-sm" />}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                 )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-border/40 bg-muted/20">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={async () => { await supabase.auth.signOut(); router.push('/login') }}
              className="h-11 px-4 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors group"
            >
               <LogOut className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
               <span className="font-bold">Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
