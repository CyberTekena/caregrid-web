import { AppSidebar } from "@/components/app-sidebar"
import { MobileNav } from "@/components/mobile-nav"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="pb-24 md:pb-0">
        <MobileNav />
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
