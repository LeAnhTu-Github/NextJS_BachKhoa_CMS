
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

interface LoginResponse {
  message: string,
  success: boolean,
}

export function useAuth() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const login = async (username: string, password: string): Promise<LoginResponse> => {
    setLoading(true)
    setError(null)

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        username,
        password,
      })

      const data = res.data

      if (data.data.token) {
        localStorage.setItem('auth-token', data.data.token)
      }

      return { success: true, message: data.message }
    } catch (err) {
      console.error('Login error:', err)
      setError('An unexpected error occurred')
      return { success: false, message: 'Unexpected error' }
    } finally {
      setLoading(false)
    }
  }
  const logout = () => {
    localStorage.removeItem('auth-token')
    router.push('/dang-nhap')
    window.location.reload()
  }

  return { login, loading, error, logout }
}
