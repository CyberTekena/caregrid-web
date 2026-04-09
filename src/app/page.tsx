"use client"

import { motion } from "framer-motion"
import { ArrowRight, ActivitySquare, Navigation, ShieldAlert, Users, PhoneCall, Building2 } from "lucide-react"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function LandingPage() {
  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  }

  const itemVariants: any = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
  }

  const floatingVariants: any = {
    animate: {
      y: [0, -15, 0],
      transition: { duration: 6, repeat: Infinity, ease: "easeInOut" }
    }
  }

  const pulseVariants: any = {
    animate: { scale: [1, 1.05, 1], transition: { duration: 2, repeat: Infinity } }
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden font-sans">
      
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/10 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
           <div className="flex items-center gap-2 font-bold text-primary text-lg md:text-xl">
             <ActivitySquare className="h-6 w-6 md:h-7 md:w-7 text-accent" />
             BU CareGrid <span className="hidden sm:inline font-light">Babcock</span>
           </div>
           <div className="hidden md:flex items-center gap-8 font-medium text-sm text-foreground/80">
              <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
              <Link href="#halls" className="hover:text-primary transition-colors">Hall Analytics</Link>
              <Link href="/login" className="hover:text-primary transition-colors">Personnel Login</Link>
           </div>
           <Link href="/login" className={buttonVariants({ className: "bg-primary hover:bg-primary/90 text-white rounded-full px-4 md:px-6 text-xs md:text-sm" })}>
              Launch Portal <ArrowRight className="w-4 h-4 ml-2" />
           </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        
        {/* Abstract Background Gradients / Grid */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100vw] h-[800px] pointer-events-none -z-10">
           <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[80%] bg-primary/20 blur-[150px] rounded-full dark:bg-primary/30" />
           <div className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] bg-accent/20 blur-[120px] rounded-full dark:bg-accent/20" />
           <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_100%)]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Hero Copy */}
          <motion.div 
            variants={containerVariants} 
            initial="hidden" 
            animate="visible"
            className="flex flex-col gap-6 relative z-10"
          >
            <motion.div variants={itemVariants}>
               <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-2 inline-flex">
                 Babcock University Health Initiative
               </Badge>
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-3xl md:text-5xl lg:text-7xl font-black tracking-tight leading-[1.1] text-foreground">
               Immediate response <br />
               in every <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">residence hall.</span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className="text-lg lg:text-xl text-muted-foreground max-w-lg leading-relaxed">
               Connecting Babcock students to rapid-response hall health cubicles through BU CareGrid. Report emergencies, track medications, and schedule general hospital appointments instantly.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 mt-4">
              <Link href="/login" className={buttonVariants({ size: "lg", className: "h-12 md:h-14 bg-primary hover:bg-primary/90 text-white rounded-full px-8 text-base md:text-lg font-semibold shadow-lg shadow-primary/25 transition-transform hover:scale-105" })}>
                 Student SOS Login
              </Link>
              <Link href="/login" className={buttonVariants({ size: "lg", variant: "outline", className: "h-12 md:h-14 rounded-full px-8 text-base md:text-lg font-semibold bg-background/50 backdrop-blur-md hover:bg-muted/50 transition-colors" })}>
                 Cubicle Direct <Navigation className="w-5 h-5 ml-2 text-primary" />
              </Link>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-center gap-6 mt-8 text-sm font-semibold text-muted-foreground/80">
               <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-accent animate-pulse" /> 14 Active Cubicles</div>
               <div className="hidden sm:block w-1 h-1 rounded-full bg-border" />
               <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-primary" /> Hospital Linked</div>
            </motion.div>
          </motion.div>

          {/* Interactive Floating Demo (PRD 19.5 & 19.7 strict interpretation) */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative lg:h-[600px] w-full flex items-center justify-center perspective-[2000px]"
          >
             {/* The Primary Dashboard Browser Frame */}
             <motion.div 
               variants={floatingVariants}
               animate="animate"
               className="relative z-20 w-full max-w-[550px] aspect-[4/3] bg-background/80 backdrop-blur-2xl rounded-2xl border border-white/20 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.05)] overflow-hidden shadow-primary/10 dark:shadow-black/50"
             >
                {/* Browser Top Bar */}
                <div className="h-10 w-full bg-muted/40 border-b border-white/10 flex items-center px-4 gap-2">
                   <div className="flex gap-1.5">
                     <div className="w-3 h-3 rounded-full bg-red-400" />
                     <div className="w-3 h-3 rounded-full bg-amber-400" />
                     <div className="w-3 h-3 rounded-full bg-green-400" />
                   </div>
                   <div className="mx-auto bg-background/50 rounded-md h-5 w-48 border border-white/5" />
                </div>
                
                {/* Dashboard Inner App Mockup */}
                <div className="p-4 grid grid-cols-3 gap-4 h-full relative">
                   {/* Left Sidebar Mock */}
                   <div className="col-span-1 border-r border-border/40 pr-4 space-y-3">
                     <div className="h-4 w-20 bg-primary/20 rounded-sm mb-6" />
                     {[1,2,3,4].map(i => (
                       <div key={i} className="flex gap-2 items-center">
                         <div className="h-4 w-4 bg-muted-foreground/20 rounded-sm" />
                         <div className={`h-2.5 rounded-sm ${i === 2 ? 'w-full bg-accent/80' : 'w-16 bg-muted-foreground/20'}`} />
                       </div>
                     ))}
                   </div>
                   
                   {/* Main Content Area Displaying Map Route (PRD 19.3) */}
                   <div className="col-span-2 flex flex-col gap-4">
                     <div className="flex justify-between items-center">
                        <div className="h-5 w-32 bg-foreground/80 rounded-sm" />
                        <div className="h-6 w-16 bg-destructive/10 rounded-full flex items-center justify-center border border-destructive/20">
                           <div className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
                        </div>
                     </div>
                     
                     {/* The Abstract Map Element */}
                     <div className="flex-1 bg-muted/30 rounded-xl border border-white/10 relative overflow-hidden flex items-center justify-center">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:10px_10px]" />
                        
                        {/* Map Nodes representing Halls & Hospital */}
                        <motion.div variants={pulseVariants} animate="animate" className="absolute top-1/4 left-1/4 w-8 h-8 rounded-full bg-destructive/20 flex items-center justify-center border border-destructive/50">
                           <div className="w-2 h-2 rounded-full bg-destructive" />
                        </motion.div>
                        
                        <div className="absolute bottom-1/3 right-1/4 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50 shadow-lg shadow-primary/20 backdrop-blur-md">
                           <Building2 className="w-4 h-4 text-primary" />
                        </div>

                        {/* Animated Route Line */}
                        <svg className="absolute inset-0 w-full h-full" style={{ filter: "drop-shadow(0 0 4px rgba(37,99,235,0.5))" }}>
                           <motion.path 
                             d="M 120 70 Q 150 120 220 140" 
                             fill="transparent" 
                             stroke="currentColor" 
                             className="text-accent"
                             strokeWidth="3" 
                             strokeDasharray="5 5"
                             initial={{ pathLength: 0 }}
                             animate={{ pathLength: 1 }}
                             transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                           />
                        </svg>

                        <div className="absolute bottom-2 left-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-[8px] font-bold border border-white/20">
                           Routing to Welch Hall Cubicle...
                        </div>
                     </div>
                   </div>
                </div>
             </motion.div>

             {/* Floating Accent Nodes to create 3D Depth */}
             <motion.div 
               animate={{ y: [-10, 10, -10] }} 
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
               className="absolute -right-8 top-12 z-30 bg-background/90 backdrop-blur-xl p-4 rounded-xl border border-white/20 shadow-xl shadow-black/5 flex items-center gap-3"
             >
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-600">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold">First Aid Deployed</p>
                  <p className="text-[10px] text-muted-foreground">Response time: 42s</p>
                </div>
             </motion.div>

             <motion.div 
               animate={{ y: [10, -10, 10] }} 
               transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
               className="absolute -left-12 bottom-20 z-30 bg-background/90 backdrop-blur-xl p-4 rounded-xl border border-white/20 shadow-xl shadow-black/5 flex items-center gap-3"
             >
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold">Hospital Escalated</p>
                  <p className="text-[10px] text-muted-foreground">Ambulance assigned</p>
                </div>
             </motion.div>
             
          </motion.div>
        </div>
      </main>
      
    </div>
  )
}
