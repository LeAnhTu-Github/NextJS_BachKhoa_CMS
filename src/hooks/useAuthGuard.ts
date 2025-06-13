'use client'
import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import useInfo from './useInfo'
import { useAuth } from './useAuth'

const publicPaths = ['/dang-nhap']

export const useAuthGuard = () => {
  const router = useRouter()
  const pathname = usePathname()
  const { user, pageRoles, loading, getUserInfo } = useInfo()
  const { logout } = useAuth()

  useEffect(() => {
    const token = localStorage.getItem('auth-token')
    
    if (publicPaths.includes(pathname) && token) {
      router.push('/')
      return
    }

    if (!publicPaths.includes(pathname) && !token) {
      router.push('/dang-nhap')
      return
    }
    if (token) {
      getUserInfo()
    }
  }, [pathname])

  return {
    user,
    pageRoles,
    loading,
    logout,
    isAuthenticated: !!user
  }
}