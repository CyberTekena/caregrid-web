"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { HeartPulse, GraduationCap, BriefcaseMedical, ShieldCheck, ArrowRight, ShieldAlert, Navigation } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const roles = [
  { id: "student", label: "Student", icon: GraduationCap },
  { id: "cubicle", label: "Cubicle Staff", icon: BriefcaseMedical },
  { id: "admin", label: "Admin", icon: ShieldCheck },
]

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState("student")

  return (
    <div className="min-h-screen bg-background flex text-foreground font-sans relative overflow-hidden">
      
      {/* Background Decor Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[70%] bg-primary/20 blur-[150px] rounded-full dark:bg-primary/10" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent/20 blur-[150px] rounded-full dark:bg-accent/10" />
      </div>

      {/* Left Marketing / Information Pane (Visible on lg screens) */}
      <div className="hidden lg:flex w-1/2 relative bg-primary/5 border-r border-border/50 items-center justify-center p-12 z-10">
         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:16px_16px]" />
         
         <div className="relative z-10 w-full max-w-md space-y-8">
            <Link href="/" className="inline-flex items-center gap-2 font-black text-3xl text-primary hover:opacity-80 transition-opacity">
                <HeartPulse className="h-8 w-8" />
                <span>CareGrid</span>
            </Link>

            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight text-foreground leading-tight">
                Your Campus <br /> Health Hub
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Log in to securely access medical records, report emergencies, and connect with Babcock's hall-based response network.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8">
               <div className="bg-background/60 backdrop-blur-md border border-white/20 p-4 rounded-2xl shadow-sm text-center">
                 <div className="w-10 h-10 mx-auto rounded-full bg-accent/20 flex items-center justify-center text-accent mb-2">
                   <ShieldAlert className="w-5 h-5" />
                 </div>
                 <h3 className="font-bold text-xl">14+</h3>
                 <p className="text-xs text-muted-foreground">Active Cubicles</p>
               </div>
               <div className="bg-background/60 backdrop-blur-md border border-white/20 p-4 rounded-2xl shadow-sm text-center">
                 <div className="w-10 h-10 mx-auto rounded-full bg-primary/20 flex items-center justify-center text-primary mb-2">
                   <Navigation className="w-5 h-5" />
                 </div>
                 <h3 className="font-bold text-xl">{"< 3 min"}</h3>
                 <p className="text-xs text-muted-foreground">Response Goal</p>
               </div>
            </div>
         </div>
      </div>

      {/* Right Login Form Pane */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 z-10">
          <Link href="/" className="absolute top-8 left-8 lg:hidden flex items-center gap-2 font-bold text-primary">
              <HeartPulse className="h-6 w-6" />
              <span>CareGrid</span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 70 }}
            className="w-full max-w-[420px]"
          >
            <Card className="border-border/60 shadow-2xl backdrop-blur-xl bg-background/80 rounded-3xl overflow-hidden">
              <CardHeader className="space-y-2 pb-6 text-center">
                <CardTitle className="text-2xl font-bold tracking-tight">Welcome back</CardTitle>
                <CardDescription className="text-sm">
                  Sign in to access your secure health dashboard
                </CardDescription>
              </CardHeader>
              
              <CardContent className="px-6 pb-6">
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-8 bg-muted/60 p-1 rounded-xl">
                    <TabsTrigger value="login" className="rounded-lg">Login</TabsTrigger>
                    <TabsTrigger value="register" className="rounded-lg">Register</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="login" className="space-y-5 text-left">
                    <div className="space-y-3">
                      <Label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Select Access Role</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {roles.map((role) => (
                          <button
                            key={role.id}
                            onClick={() => setSelectedRole(role.id)}
                            className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border transition-all duration-200 ${
                              selectedRole === role.id 
                                ? "border-primary bg-primary/10 text-primary shadow-sm shadow-primary/20 scale-[1.02]" 
                                : "border-border/50 bg-background/50 hover:bg-muted text-muted-foreground hover:border-border"
                            }`}
                          >
                            <role.icon className="h-5 w-5" />
                            <span className="text-[10px] font-bold leading-none">{role.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2 mt-2">
                      <Label htmlFor="email">Email or Matric Number</Label>
                      <Input id="email" type="text" placeholder="m.doe@student.babcock.edu.ng" className="h-12 rounded-xl bg-background/50 focus-visible:ring-primary/20 focus-visible:border-primary/50" />
                    </div>
                    <div className="space-y-2 mt-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Link href="#" className="text-xs text-primary hover:text-primary/80 transition-colors font-medium">
                          Forgot password?
                        </Link>
                      </div>
                      <Input id="password" type="password" className="h-12 rounded-xl bg-background/50 focus-visible:ring-primary/20 focus-visible:border-primary/50" />
                    </div>
                    
                    <Link 
                       href={`/${selectedRole}/dashboard`}
                       className={buttonVariants({ size: "lg", className: "w-full mt-6 h-12 rounded-xl font-bold text-md shadow-lg shadow-primary/20" })}
                    >
                        Sign in as {roles.find(r => r.id === selectedRole)?.label}
                        <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </TabsContent>
                  
                  <TabsContent value="register" className="space-y-4">
                    <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 text-xs font-medium text-center mb-4 text-accent">
                      Student registration requires a valid Babcock Matriculation Number. Staff accounts are provisioned directly by the Institutional HR Administration.
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-matric">Matric Number</Label>
                      <Input id="reg-matric" type="text" placeholder="e.g. 19/0000" className="h-12 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-email">Babcock Email</Label>
                      <Input id="reg-email" type="email" placeholder="name@student.babcock.edu.ng" className="h-12 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-password">Password</Label>
                      <Input id="reg-password" type="password" className="h-12 rounded-xl" />
                    </div>
                    <Button className="w-full mt-4 h-12 rounded-xl font-bold">Create Account</Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex justify-center border-t border-border/40 p-4 bg-muted/20">
                <p className="text-xs font-medium text-muted-foreground text-center">
                  Secure access encrypted for Babcock University.
                </p>
              </CardFooter>
            </Card>
          </motion.div>
      </div>

    </div>
  )
}
