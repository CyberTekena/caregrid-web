"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { HeartPulse, GraduationCap, BriefcaseMedical, ShieldCheck, ArrowRight, ShieldAlert, Navigation, ArrowLeft, Loader2 } from "lucide-react"

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
import { toast } from "sonner"

import { supabase } from "@/lib/supabase"
import { profileService } from "@/lib/services/profile-service"
import { useCurrentUser } from "@/hooks/use-current-user"

const roles = [
  { id: "student", label: "Student", icon: GraduationCap },
  { id: "cubicle", label: "Cubicle Staff", icon: BriefcaseMedical },
  { id: "admin", label: "Admin", icon: ShieldCheck },
]

export default function LoginPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useCurrentUser()

  const [selectedRole, setSelectedRole] = useState("student")
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    matricNumber: ""
  })

  const isStudentProfileIncomplete = user?.role === "student" && (!user.full_name || !user.hall_id || !user.blood_group || !user.genotype || !user.room_number)

  // Redirect if already authenticated
  useEffect(() => {
    if (user && !authLoading) {
      if (isStudentProfileIncomplete) {
        router.push(`/student/onboarding`)
      } else {
        router.push(`/${user.role}/dashboard`)
      }
    }
  }, [user, authLoading, isStudentProfileIncomplete, router])

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="space-y-3 text-center px-6 py-8 rounded-3xl border border-border/50 bg-background/90 shadow-xl">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
          <h1 className="text-2xl font-bold">Loading your session...</h1>
          <p className="text-sm text-muted-foreground">Please wait while we verify your account.</p>
        </div>
      </div>
    )
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.email || !formData.password) {
      toast.error("Missing fields", {
        description: "Please enter your email and password."
      })
      return
    }

    setIsLoading(true)
    try {
      if (!formData.email.endsWith(".babcock.edu.ng")) {
        toast.error("Invalid email domain", {
          description: "Please use your official Babcock University email."
        })
        setIsLoading(false)
        return
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      })
      
      if (error) {
        toast.error("Login failed", {
          description: error.message
        })
        return
      }

      if (data.user) {
        let profile = await profileService.getById(data.user.id)

        if (!profile) {
          if (selectedRole === "student") {
            profile = await profileService.create({
              id: data.user.id,
              email: data.user.email ?? formData.email,
              role: "student",
              matric_number: null,
              full_name: null,
              hall_id: null,
            })
          } else {
            toast.error("Login failed", {
              description: "Your account profile is not configured. Please contact support."
            })
            return
          }
        }

        const profileIncomplete = profile.role === "student" && (!profile.full_name || !profile.hall_id || !profile.blood_group || !profile.genotype || !profile.room_number)

        toast.success("Welcome back!", {
          description: "Successfully signed in."
        })

        if (profileIncomplete) {
          router.push(`/student/onboarding`)
        } else {
          router.push(`/${profile.role}/dashboard`)
        }
      }
    } catch (error) {
      toast.error("Login failed", {
        description: "An unexpected error occurred. Please try again."
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedRole !== "student") {
      toast.error("Registration not allowed", {
        description: "Only students can register. Staff accounts are provisioned by administration."
      })
      return
    }

    if (!formData.matricNumber || !formData.email || !formData.password) {
      toast.error("Missing fields", {
        description: "Please fill in all required fields."
      })
      return
    }

    setIsLoading(true)
    try {
      if (!formData.email.endsWith(".babcock.edu.ng")) {
        toast.error("Invalid email domain", {
          description: "Registration is restricted to official Babcock University emails."
        })
        setIsLoading(false)
        return
      }

      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            matric_number: formData.matricNumber,
            role: selectedRole,
          },
        },
      })

      if (error) {
        toast.error("Registration failed", {
          description: error.message
        })
        return
      }

      if (data.user) {
        await profileService.create({
          id: data.user.id,
          email: formData.email,
          matric_number: formData.matricNumber,
          role: selectedRole,
          full_name: null,
          hall_id: null,
        })
      }

      if (data.session && data.user) {
        toast.success("Account created!", {
          description: "Your student account is active. Continue to onboarding."
        })
        router.push('/student/onboarding')
        return
      }

      toast.success("Account created!", {
        description: "Please check your email to verify your account."
      })
      // Stay on login tab for verification
    } catch (error) {
      toast.error("Registration failed", {
        description: "An unexpected error occurred. Please try again."
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex text-foreground font-sans relative overflow-hidden">
      
      {/* Background Decor Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[70%] bg-primary/20 blur-[150px] rounded-full dark:bg-primary/10" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent/20 blur-[150px] rounded-full dark:bg-accent/10" />
      </div>

      {/* Back to Home Navigation */}
      <Link 
        href="/" 
        className="absolute top-6 left-6 z-50 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-background/50 backdrop-blur-md border border-white/10 text-muted-foreground hover:text-primary transition-all hover:bg-background group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs font-bold uppercase tracking-widest">Back to Home</span>
      </Link>

      {/* Left Marketing / Information Pane (Visible on lg screens) */}
      <div className="hidden lg:flex w-1/2 relative bg-primary/5 border-r border-border/50 items-center justify-center p-12 z-10">
         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:16px_16px]" />
         
         <div className="relative z-10 w-full max-w-md space-y-8">
            <Link href="/" className="inline-flex items-center gap-2 font-black text-3xl text-primary hover:opacity-80 transition-opacity">
                <HeartPulse className="h-8 w-8" />
                <span>BU CareGrid</span>
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
          <Link href="/" className="absolute top-6 left-6 lg:hidden flex items-center gap-2 font-bold text-primary">
              <HeartPulse className="h-5 w-5 md:h-6 md:w-6" />
              <span className="text-sm md:text-base">BU CareGrid</span>
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
                    <form onSubmit={handleLogin} className="space-y-5">
                      <div className="space-y-3">
                        <Label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Select Access Role</Label>
                        <div className="grid grid-cols-3 gap-1.5 md:gap-2">
                          {roles.map((role) => (
                            <button
                              key={role.id}
                              type="button"
                              onClick={() => setSelectedRole(role.id)}
                              className={`flex flex-col items-center justify-center gap-1.5 p-2.5 md:p-3 rounded-xl border transition-all duration-200 ${
                                selectedRole === role.id 
                                  ? "border-primary bg-primary/10 text-primary shadow-sm shadow-primary/20 scale-[1.02]" 
                                  : "border-border/50 bg-background/50 hover:bg-muted text-muted-foreground hover:border-border"
                              }`}
                            >
                              <role.icon className="h-4 w-4 md:h-5 md:w-5" />
                              <span className="text-[9px] md:text-[10px] font-bold leading-none">{role.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2 mt-2">
                        <Label htmlFor="email">Babcock Email</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="username@babcock.edu.ng" 
                          className="h-12 rounded-xl bg-background/50 focus-visible:ring-primary/20 focus-visible:border-primary/50"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          disabled={isLoading}
                        />
                      </div>
                      <div className="space-y-2 mt-4">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="password">Password</Label>
                          <Link href="#" className="text-xs text-primary hover:text-primary/80 transition-colors font-medium">
                            Forgot password?
                          </Link>
                        </div>
                        <Input 
                          id="password" 
                          type="password" 
                          className="h-12 rounded-xl bg-background/50 focus-visible:ring-primary/20 focus-visible:border-primary/50"
                          value={formData.password}
                          onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                          disabled={isLoading}
                        />
                      </div>
                      
                      <Button 
                        type="submit"
                        size="lg"
                        className="w-full mt-6 h-12 rounded-xl font-bold text-md shadow-lg shadow-primary/20"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Signing in...
                          </>
                        ) : (
                          <>
                            Sign in as {roles.find(r => r.id === selectedRole)?.label}
                            <ArrowRight className="w-5 h-5 ml-2" />
                          </>
                        )}
                      </Button>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="register" className="space-y-4">
                    <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 text-xs font-medium text-center mb-4 text-accent">
                      Student registration requires a valid Babcock Matriculation Number. Staff accounts are provisioned directly by the Institutional HR Administration.
                    </div>
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="reg-matric">Matric Number</Label>
                        <Input 
                          id="reg-matric" 
                          type="text" 
                          placeholder="e.g. 19/0000" 
                          className="h-12 rounded-xl"
                          value={formData.matricNumber}
                          onChange={(e) => setFormData(prev => ({ ...prev, matricNumber: e.target.value }))}
                          disabled={isLoading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reg-email">Babcock Email</Label>
                        <Input 
                          id="reg-email" 
                          type="email" 
                          placeholder="name@student.babcock.edu.ng" 
                          className="h-12 rounded-xl"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          disabled={isLoading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reg-password">Password</Label>
                        <Input 
                          id="reg-password" 
                          type="password" 
                          className="h-12 rounded-xl"
                          value={formData.password}
                          onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                          disabled={isLoading}
                        />
                      </div>
                      <Button 
                        type="submit"
                        className="w-full mt-4 h-12 rounded-xl font-bold"
                        disabled={isLoading || selectedRole !== "student"}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Creating account...
                          </>
                        ) : (
                          "Create Account"
                        )}
                      </Button>
                    </form>
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
