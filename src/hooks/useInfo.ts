'use client'
import { User } from '@/types/User'
import { PageRole } from '@/types/pageRole'
import { useState, useEffect } from 'react'

const useInfo = () => {
    const [user, setUser] = useState<User | null>(null)
    const [pageRoles, setPageRoles] = useState<PageRole[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const getUserInfo = async () => {
        const token = localStorage.getItem('auth-token')
        if (!token) {
            setLoading(false)
            return
        }
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/info`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        if(!res.ok){
            setError(res.statusText)
            setLoading(false)
            return
        }
        const data = await res.json()
        setUser(data.data.user)
        setPageRoles(data.data.pageRoles)
        setLoading(false)
    }

    useEffect(() => {
        getUserInfo()
    }, [])

    return { user, pageRoles, loading, error, getUserInfo }
}

export default useInfo