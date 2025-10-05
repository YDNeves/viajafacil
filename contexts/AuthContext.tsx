"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useMemo } from "react"
// Certifique-se de que a sua interface User (em "@/types") tenha a propriedade isAdmin: boolean
// Exemplo:
// interface User {
//   id: string;
//   name: string;
//   email: string;
//   isAdmin: boolean; // 👈 É vital que esta propriedade exista
// }
import type { User } from "@/types" 
import { api } from "@/lib/api"

// ---
// 1. ATUALIZAÇÃO DA INTERFACE DO CONTEXTO
// ---
interface AuthContextType {
  isAdmin: boolean // Não é mais opcional, pois será sempre calculado.
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
  
  // ---
  // 2. CÁLCULO DE isAdmin
  // Usamos useMemo para recalcular isAdmin apenas quando 'user' muda
  // ---
  const isAdmin = useMemo(() => {
    // Retorna true se o usuário existir E a propriedade isAdmin for true.
    // Se 'user' for null, retorna false.
    return !!user && user.isAdmin === true 
  }, [user])

  useEffect(() => {
    const token = localStorage.getItem("auth_token")
    if (token) {
      api
        .getMe()
        .then((userData) => {
          // Aqui, userData deve ser do tipo User e conter 'isAdmin'
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
      // Certifique-se de que response.user tem a propriedade isAdmin
      setUser(response.user) 
    } catch (error) {
      throw error
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await api.register(name, email, password)
      localStorage.setItem("auth_token", response.token)
      // Certifique-se de que response.user tem a propriedade isAdmin
      setUser(response.user) 
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem("auth_token")
    setUser(null)
  }
  
  // ---
  // 3. INCLUSÃO NO OBJETO DE VALOR
  // ---
  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: isAdmin, // Adicionamos o isAdmin aqui
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