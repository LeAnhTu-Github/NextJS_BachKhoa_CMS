"use client";
import { Toaster } from "sonner";
import "./globals.css";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { usePathname } from "next/navigation";
import { publicPaths } from "../../middleware";
import { AuthGuardProvider } from "@/contexts/AuthGuardContext";
import useAuthGuard from "@/hooks/useAuthGuard";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  if (publicPaths.includes(pathname)) {
    return (
      <html lang="en" className="mdl-js">
        <body>
          <Toaster
            position="top-right"
            expand
            duration={5000}
            richColors
            closeButton
          />
          {children}
        </body>
      </html>
    );
  }

  return (
    <AuthGuardProvider>
      <AuthGuardedLayout>{children}</AuthGuardedLayout>
    </AuthGuardProvider>
  );
}

const AuthGuardedLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, pageRoles, loading, logout } = useAuthGuard();

  if (loading) {
    return (
      <html lang="en" className="mdl-js">
        <body>
          <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en" className="mdl-js">
      <body>
        <Toaster
          position="top-right"
          expand
          duration={5000}
          richColors
          closeButton
        />
        {user && pageRoles ? (
          <DashboardLayout pageRoles={pageRoles} user={user} logout={logout}>
            {children}
          </DashboardLayout>
        ) : (
          children
        )}
      </body>
    </html>
  );
};
