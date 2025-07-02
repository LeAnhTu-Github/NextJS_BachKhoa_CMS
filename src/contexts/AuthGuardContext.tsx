import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types/User";
import { PageRole } from "@/types/pageRole";
import api from "@/services/api";

interface AuthGuardContextType {
  user: User | null;
  pageRoles: PageRole[];
  loading: boolean;
  logout: () => void;
}

const AuthGuardContext = createContext<AuthGuardContextType | undefined>(undefined);

export const AuthGuardProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [pageRoles, setPageRoles] = useState<PageRole[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const getUserInfo = async () => {
    try {
      const res = await api.get(`/user/info`);
      setUser(res.data.data.user);
      setPageRoles(res.data.data.pageRoles);
    } catch (error) {
      setUser(null);
      setPageRoles([]);
      throw error;
    }
    setLoading(false);
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  const logout = () => {
    localStorage.removeItem('auth-token');
    router.push('/dang-nhap');
    window.location.reload();
  };

  return (
    <AuthGuardContext.Provider value={{ user, pageRoles, loading, logout }}>
      {children}
    </AuthGuardContext.Provider>
  );
};

export const useAuthGuardContext = () => {
  const context = useContext(AuthGuardContext);
  if (!context) {
    throw new Error("useAuthGuardContext must be used within an AuthGuardProvider");
  }
  return context;
}; 