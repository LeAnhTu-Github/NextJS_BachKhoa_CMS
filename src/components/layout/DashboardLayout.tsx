"use client";
import { ReactNode } from "react";
import { useState } from "react";
import Header from "@/components/layout/Header";
import SidebarComponent from "@/components/layout/Sidebar";
import { SidebarProvider } from "../ui/sidebar";
import { PageRole } from "@/types/pageRole";
import { User } from "@/types/User";
import { useIsMobile } from "@/hooks/use-mobile";

interface DashboardLayoutProps {
  children: ReactNode;
  pageRoles: PageRole[];
  user: User;
  logout: () => void;
}

const DashboardLayout = ({
  children,
  pageRoles,
  user,
  logout,
}: DashboardLayoutProps) => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const isMobile = useIsMobile();
  return (
    <div className="relative flex min-h-screen bg-background">
      <SidebarProvider className={`flex ${isMobile ? 'hidden' : 'max-w-[90px]'}`}>
        <SidebarComponent 
          pageRoles={pageRoles} 
          sheetOpen={sheetOpen}
          onSheetOpenChange={setSheetOpen}
        />
      </SidebarProvider>
      <div className="flex flex-col flex-1 w-full">
        <Header 
          user={user} 
          pageRoles={pageRoles}
          logout={logout} 
          sheetOpen={sheetOpen}
          onSheetOpenChange={setSheetOpen}
        />
        <main className="w-full h-full mt-16">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
