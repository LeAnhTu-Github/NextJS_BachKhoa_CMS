'use client'
import { User } from '@/types/User'
import { PageRole } from '@/types/pageRole'
import { useState, useEffect } from 'react'
import api from '@/services/api'

const useInfo = () => {
    const [user, setUser] = useState<User | null>(null)
    const [pageRoles, setPageRoles] = useState<PageRole[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const getUserInfo = async () => {
        try {
            const res = await api.get(`/user/info`)
            setUser(res.data.data.user)
            setPageRoles(res.data.data.pageRoles)
        } catch (error) {
            setError(error as string)
        }
        setLoading(false)
    }

    useEffect(() => {
        getUserInfo()
    }, [])

    return { user, pageRoles, loading, error, getUserInfo }
}

export default useInfo