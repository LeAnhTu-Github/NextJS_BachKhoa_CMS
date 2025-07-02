'use client'
import { useAuthGuardContext } from "@/contexts/AuthGuardContext";

const useAuthGuard = () => {
  return useAuthGuardContext();
};

export default useAuthGuard;