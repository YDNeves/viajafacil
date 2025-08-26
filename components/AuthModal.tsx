"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })

  const { login, register } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isLogin) {
        await login(formData.email, formData.password)
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo ao ViajaFacil",
        })
      } else {
        await register(formData.name, formData.email, formData.password)
        toast({
          title: "Conta criada com sucesso!",
          description: "Bem-vindo ao ViajaFacil",
        })
      }
      onClose()
      setFormData({ name: "", email: "", password: "" })
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isLogin ? "Entrar" : "Criar Conta"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                required={!isLogin}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Carregando..." : isLogin ? "Entrar" : "Criar Conta"}
          </Button>
        </form>

        <div className="text-center">
          <Button variant="link" onClick={() => setIsLogin(!isLogin)} className="text-sm">
            {isLogin ? "Não tem conta? Criar conta" : "Já tem conta? Entrar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
