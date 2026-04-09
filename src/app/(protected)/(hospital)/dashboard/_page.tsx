"use client"

import { ActivitySquare, BriefcaseMedical, Calendar, FileText, ArrowRight, Ambulance } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function HospitalDashboard() {
  return (
    <div className="flex-1 p-4 md:p-8 space-y-6 max-w-[1400px] mx-auto w-full">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <BriefcaseMedical className="h-8 w-8 text-primary" />
            Babcock General Hospital
          </h1>
          <p className="text-muted-foreground mt-1">Escalations & Coordination Dashboard</p>
        </div>
      </div>

       <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-amber-500 text-white shadow-md border-none">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Pending Ambulance Dispatches</CardTitle>
             <Ambulance className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">2</div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-border/50">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">Today's Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">34</div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-border/50">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">Cubicle Escalations</CardTitle>
            <ActivitySquare className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">5</div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/50">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">Records Updated</CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">128</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-6">
         <Card className="shadow-sm border-red-200">
           <CardHeader className="bg-red-50 border-b border-red-100">
             <CardTitle className="text-red-700 font-bold flex items-center gap-2">
               <Ambulance className="w-5 h-5"/> Live Dispatch Requests
             </CardTitle>
           </CardHeader>
           <CardContent className="p-0">
             <div className="divide-y">
               <div className="p-4 flex items-start justify-between">
                  <div>
                    <Badge variant="destructive" className="mb-2">Priority 1 - Seizure</Badge>
                    <p className="font-bold">Nelson Mandela Hall</p>
                    <p className="text-sm text-muted-foreground">Requested by: Responder Adebayo</p>
                  </div>
                  <Button className="bg-amber-600 hover:bg-amber-700">Dispatch Unit 02</Button>
               </div>
                <div className="p-4 flex items-start justify-between bg-muted/20">
                  <div>
                    <Badge variant="outline" className="mb-2 border-amber-500 text-amber-700">Priority 2 - Fracture</Badge>
                    <p className="font-bold">Welch Hall</p>
                    <p className="text-sm text-muted-foreground">Requested by: Responder Nkechi</p>
                  </div>
                  <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100">Unit 01 En Route</Badge>
               </div>
             </div>
           </CardContent>
         </Card>

         <Card className="shadow-sm border-border/50">
           <CardHeader className="bg-muted/20 border-b border-border/50">
             <CardTitle className="font-bold flex items-center gap-2">
               <Calendar className="w-5 h-5 text-primary"/> Incoming Appointments
             </CardTitle>
           </CardHeader>
           <CardContent className="p-0">
             <div className="divide-y">
               <div className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-sm">Michael Doe</p>
                    <p className="text-xs text-muted-foreground">10:30 AM • Routine Checkup</p>
                  </div>
                  <Button variant="outline" size="sm">Review Notes <ArrowRight className="w-4 h-4 ml-1"/></Button>
               </div>
               <div className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-sm">Sarah Jenkins</p>
                    <p className="text-xs text-muted-foreground">11:15 AM • Fever / Illness follow up</p>
                  </div>
                  <Button variant="outline" size="sm">Review Notes <ArrowRight className="w-4 h-4 ml-1"/></Button>
               </div>
             </div>
           </CardContent>
         </Card>
      </div>
    </div>
  )
}
