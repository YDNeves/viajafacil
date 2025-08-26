"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@/types"
import { api } from "@/lib/api"

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("auth_token")
    if (token) {
      api
        .getMe()
        .then((userData) => {
          setUser(userData)
        })
        .catch(() => {
          localStorage.removeItem("auth_token")
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await api.login(email, password)
      localStorage.setItem("auth_token", response.token)
      setUser(response.user)
    } catch (error) {
      throw error
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await api.register(name, email, password)
      localStorage.setItem("auth_token", response.token)
      setUser(response.user)
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem("auth_token")
    setUser(null)
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
