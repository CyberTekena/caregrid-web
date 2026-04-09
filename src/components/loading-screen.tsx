"use client"

import { motion } from "framer-motion"
import { ActivitySquare, HeartPulse } from "lucide-react"

export function LoadingScreen({ message = "Loading CareGrid..." }: { message?: string }) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background via-background to-primary/5 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background rolling effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-accent/10 rounded-full blur-[80px] animate-pulse delay-700" />
      
      <div className="relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: [0.8, 1.1, 1], opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative"
        >
          <div className="absolute -inset-4 bg-primary/20 rounded-full animate-ping" />
          <div className="bg-primary p-5 rounded-3xl shadow-2xl shadow-primary/20 relative">
            <HeartPulse className="w-12 h-12 text-white animate-pulse" />
          </div>
        </motion.div>

        <div className="mt-12 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [0, -6, 0],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                  className="w-2 h-2 rounded-full bg-primary"
                />
              ))}
            </div>
            <span className="text-sm font-black uppercase tracking-[0.3em] text-primary/80 ml-2">System Ready</span>
          </div>
          
          <h2 className="text-2xl font-black tracking-tight text-foreground">{message}</h2>
          <p className="text-sm text-muted-foreground font-medium animate-pulse">Syncing with Babcock Health Network...</p>
        </div>
      </div>

      {/* Rolling progress line at the bottom */}
      <div className="fixed bottom-0 left-0 w-full h-1 bg-muted overflow-hidden">
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
          className="w-1/3 h-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]"
        />
      </div>
    </div>
  )
}
