import { AppSidebar } from "@/components/app-sidebar";
import BreadcrumLink from "@/components/BreadcrumLink";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Outlet } from "react-router";
// import { useAuth } from "@/contexts/AuthContext";
// import { getAllShipments } from "@/services/apiHelpers";
// import { useQuery } from "@tanstack/react-query";
export default function DashboardPage() {
  //Context

  //Function Handler

  return (
    <>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "19rem",
          } as React.CSSProperties
        }
      >
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumLink to="/dashboard">Dashboard</BreadcrumLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          {/* Outlet */}
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
