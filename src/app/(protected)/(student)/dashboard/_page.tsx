"use client"

import { Activity, Droplet, HeartPulse, Pill, Calendar as CalendarIcon, Clock, ArrowRight, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

export default function StudentDashboard() {
  return (
    <div className="flex-1 p-4 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome back, Michael</h1>
          <p className="text-muted-foreground mt-1">Matric: 19/0045 &nbsp;|&nbsp; Welch Hall, Rm 212</p>
        </div>
        <Button asChild className="bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20 shadow-[0_0_15px_rgba(220,38,38,0.4)] animate-pulse rounded-full h-12 px-6">
          <Link href="/student/emergency">
            <HeartPulse className="mr-2 h-5 w-5" />
            SOS
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-primary text-primary-foreground border-none shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-primary-foreground/80">Blood Group</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold flex items-center gap-2">
               O+ <Droplet className="h-5 w-5 fill-red-400 text-red-400" />
            </div>
            <p className="text-xs mt-1 text-primary-foreground/60">Verified by Medical Center</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-border/50 bg-background/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Genotype</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">AA</div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-border/50 bg-background/50 backdrop-blur-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">Allergies</CardTitle>
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">1 Logged</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold">Penicillin</div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/50 bg-background/50 backdrop-blur-sm">
          <CardHeader className="pb-2 text-sm font-medium text-muted-foreground">
             Active Conditions
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold">Mild Asthma</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        
        {/* Medication Tracker Widget */}
        <Card className="lg:col-span-4 border-border/50 shadow-md flex flex-col">
          <CardHeader className="border-b bg-muted/20">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2"><Pill className="h-5 w-5 text-primary" /> Medication Schedule</CardTitle>
                <CardDescription>Track your daily dosage and reminders.</CardDescription>
              </div>
              <Button size="sm" variant="outline">Add New</Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1">
             <div className="divide-y divide-border/50">
               <div className="flex items-center justify-between p-4 bg-muted/10">
                 <div className="flex items-center gap-4">
                   <div className="h-10 w-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                     <CheckCircle2 strokeWidth={3} className="h-5 w-5" />
                   </div>
                   <div>
                     <p className="font-semibold text-sm">Salbutamol Inhaler</p>
                     <p className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3"/> 08:00 AM (Taken)</p>
                   </div>
                 </div>
                 <Badge variant="secondary" className="bg-green-100 text-green-700">Done</Badge>
               </div>

               <div className="flex items-center justify-between p-4">
                 <div className="flex items-center gap-4">
                   <div className="h-10 w-10 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                     <Pill className="h-5 w-5" />
                   </div>
                   <div>
                     <p className="font-semibold text-sm">Multivitamins</p>
                     <p className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3"/> 08:00 PM (Upcoming)</p>
                   </div>
                 </div>
                 <Button size="sm">Mark Taken</Button>
               </div>
             </div>
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card className="lg:col-span-3 border-border/50 shadow-md">
          <CardHeader className="border-b bg-muted/20">
            <CardTitle className="flex items-center gap-2"><CalendarIcon className="h-5 w-5 text-primary" /> Upcoming Appointments</CardTitle>
            <CardDescription>Babcock General Hospital</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="rounded-xl border border-border/50 p-4 bg-background shadow-sm hover:shadow-md transition-all relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
               <div className="flex justify-between items-start mb-2">
                 <span className="font-semibold text-primary text-sm">Routine Checkup</span>
                 <Badge variant="outline">Confirmed</Badge>
               </div>
               <p className="text-sm font-medium mb-1">Dr. Adeyekun (Pulmonology)</p>
               <div className="flex items-center gap-4 text-xs text-muted-foreground mt-3">
                 <span className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md"><CalendarIcon className="h-3 w-3" /> Thu, Apr 12</span>
                 <span className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md"><Clock className="h-3 w-3" /> 10:30 AM</span>
               </div>
            </div>
            
            <Button variant="ghost" className="w-full mt-4 text-primary hover:text-primary hover:bg-primary/5 group">
              View All Appointments <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
