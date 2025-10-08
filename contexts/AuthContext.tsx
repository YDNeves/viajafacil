"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useMemo } from "react"
import type { User } from "@/types/index"
import { api } from "@/lib/api"

// Interface do contexto
interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  isAdmin: boolean
}

// Criando o contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Deriva isAdmin a partir do role
  const isAdmin = useMemo(() => {
    return user?.role === "ADMIN"
  }, [user])

  // Carrega usuário do token
  useEffect(() => {
    const token = localStorage.getItem("auth_token")
    if (token) {
      api
        .getMe()
        .then((userData: User) => {
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

  // Função de login
  const login = async (email: string, password: string) => {
    try {
      const response = await api.login(email, password)
      localStorage.setItem("auth_token", response.token)
      setUser(response.user) // response.user deve ter role
    } catch (error) {
      throw error
    }
  }

  // Função de registro
  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await api.register(name, email, password)
      localStorage.setItem("auth_token", response.token)
      setUser(response.user) // response.user deve ter role
    } catch (error) {
      throw error
    }
  }

  // Função de logout
  const logout = () => {
    localStorage.removeItem("auth_token")
    setUser(null)
  }

  // Valor exposto no contexto
  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Hook customizado para usar o contexto
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
