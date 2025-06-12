"use client";
import { ReactNode } from "react";
import Header from "@/components/layout/Header";
import SidebarComponent from "@/components/layout/Sidebar";
import { SidebarProvider } from "../ui/sidebar";
import { PageRole } from "@/types/pageRole";
import { User } from "@/types/User";

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
  return (
    <div className="flex min-h-screen bg-background">
      <SidebarProvider className="flex max-w-[90px]">
        <SidebarComponent pageRoles={pageRoles} />
      </SidebarProvider>
      <div className="flex flex-col flex-1">
          <Header user={user} logout={logout} />
          <main className="">{children}</main>
        </div>
    </div>
  );
};

export default DashboardLayout;
