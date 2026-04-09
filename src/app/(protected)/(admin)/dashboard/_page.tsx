"use client"

import { ShieldCheck, Users, Map, Activity, ArrowRight, Settings } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AdminDashboard() {
  return (
     <div className="flex-1 p-4 md:p-8 space-y-6 max-w-[1400px] mx-auto w-full">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <ShieldCheck className="h-8 w-8 text-primary" />
            System Administrator
          </h1>
          <p className="text-muted-foreground mt-1">Platform Control Center</p>
        </div>
        <Button variant="outline"><Settings className="w-4 h-4 mr-2"/> Platform Settings</Button>
      </div>

       <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-sm border-border/50">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12,450</div>
            <p className="text-xs text-green-600 font-medium mt-1">+140 onboarded this week</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-border/50">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Halls</CardTitle>
            <Map className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">14</div>
            <p className="text-xs text-muted-foreground mt-1">All cubicles configured</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-border/50 block">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Responders</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">42</div>
            <p className="text-xs text-muted-foreground mt-1">Currently on-shift</p>
          </CardContent>
        </Card>

         <Card className="shadow-sm border-border/50">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">Incident Rate (MTD)</CardTitle>
            <Activity className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">218</div>
            <p className="text-xs text-muted-foreground mt-1">15% escalated to hospital</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>System Modules</CardTitle>
            <CardDescription>Shortcut to manage specific sub-systems.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2">
               <Users className="w-6 h-6 text-primary"/>
               User Management
            </Button>
            <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2">
               <Map className="w-6 h-6 text-primary"/>
               Hall Mapping Engine
            </Button>
            <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2">
               <Activity className="w-6 h-6 text-primary"/>
               Global Audit Logs
            </Button>
             <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2">
               <ShieldCheck className="w-6 h-6 text-primary"/>
               Auth Rules
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
