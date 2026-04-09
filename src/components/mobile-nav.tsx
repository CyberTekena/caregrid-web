"use client"

import { usePathname, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { 
  LayoutDashboard, 
  HeartPulse, 
  UserCircle, 
  MapPin, 
  ShieldAlert, 
  Package, 
  BarChart3, 
  Users, 
  Activity 
} from "lucide-react"
import { cn } from "@/lib/utils"

const MOBILE_MENU: Record<string, any[]> = {
  student: [
    { id: 'dashboard', icon: LayoutDashboard, url: '/student/dashboard' },
    { id: 'map', icon: MapPin, url: '/student/map' },
    { id: 'sos', icon: HeartPulse, url: '/student/emergency', priority: true },
    { id: 'activity', icon: Activity, url: '/student/notifications' },
    { id: 'profile', icon: UserCircle, url: '/student/profile' },
  ],
  cubicle: [
    { id: 'dashboard', icon: LayoutDashboard, url: '/cubicle/dashboard' },
    { id: 'inventory', icon: Package, url: '/cubicle/inventory' },
    { id: 'requests', icon: ShieldAlert, url: '/cubicle/requests', priority: true },
    { id: 'activity', icon: Activity, url: '/cubicle/notifications' },
  ],
  admin: [
    { id: 'dashboard', icon: LayoutDashboard, url: '/admin/dashboard' },
    { id: 'users', icon: Users, url: '/admin/users' },
    { id: 'analytics', icon: BarChart3, url: '/admin/analytics', priority: true },
    { id: 'activity', icon: Activity, url: '/admin/notifications' },
  ]
}

export function MobileNav() {
  const pathname = usePathname()
  const router = useRouter()

  const getRole = () => {
    if (pathname.startsWith('/student')) return 'student'
    if (pathname.startsWith('/cubicle')) return 'cubicle'
    if (pathname.startsWith('/admin')) return 'admin'
    return 'student'
  }

  const role = getRole()
  const items = MOBILE_MENU[role] || []

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-6 pb-6 pointer-events-none">
      <motion.nav 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 20, stiffness: 100 }}
        className="w-full max-w-md mx-auto h-[72px] bg-background/60 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-3xl flex items-center justify-around px-4 pointer-events-auto relative overflow-hidden"
      >
        {/* Background Accent */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />

        {items.map((item) => {
          const isActive = pathname === item.url
          const Icon = item.icon

          if (item.priority) {
            return (
              <button
                key={item.id}
                onClick={() => router.push(item.url)}
                className="relative -top-4"
              >
                <div className="absolute -inset-4 bg-primary/20 rounded-full animate-pulse" />
                <div className={cn(
                  "relative w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all duration-300",
                  isActive ? "bg-primary text-white scale-110" : "bg-primary text-white hover:scale-105"
                )}>
                  <Icon className="w-8 h-8" strokeWidth={2.5} />
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent rounded-full" />
                </div>
              </button>
            )
          }

          return (
            <button
              key={item.id}
              onClick={() => router.push(item.url)}
              className="relative flex flex-col items-center justify-center w-12 h-12 transition-all group"
            >
              <div className={cn(
                "w-1 h-1 rounded-full mb-1 transition-all",
                isActive ? "bg-primary opacity-100" : "bg-transparent opacity-0"
              )} />
              <Icon 
                className={cn(
                  "w-6 h-6 transition-all duration-300",
                  isActive ? "text-primary scale-110" : "text-muted-foreground group-hover:text-primary"
                )} 
                strokeWidth={isActive ? 2.5 : 2}
              />
            </button>
          )
        })}
      </motion.nav>
    </div>
  )
}
