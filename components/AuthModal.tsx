"use client"

import type React from "react"

import { useState, useMemo } from "react" // Adicionado useMemo para validação
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

// Expressão Regular básica para validação de email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
 const [isLogin, setIsLogin] = useState(true)
 const [loading, setLoading] = useState(false)
 const [formData, setFormData] = useState({
  name: "",
  email: "",
  password: "",
 })
 // 1. Adicionado estado para erros de validação
 const [errors, setErrors] = useState({
  name: "",
  email: "",
  password: "",
 })

 const { login, register } = useAuth()
 const { toast } = useToast()

 // 2. Função de validação
 const validate = () => {
  const newErrors = { name: "", email: "", password: "" }
  let isValid = true

  // Validação de E-mail
  if (!formData.email || !emailRegex.test(formData.email)) {
   newErrors.email = "E-mail inválido."
   isValid = false
  }

  // Validação de Senha
  if (!formData.password || formData.password.length < 6) {
   newErrors.password = "A senha deve ter pelo menos 6 caracteres."
   isValid = false
  }

  // Validação de Nome (Apenas no registro)
  if (!isLogin) {
   if (!formData.name || formData.name.trim().length < 2) {
    newErrors.name = "O nome é obrigatório e deve ter pelo menos 2 caracteres."
    isValid = false
   }
  }

  setErrors(newErrors)
  return isValid
 }

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  // 3. Chamar a validação
  if (!validate()) {
   // Se a validação falhar, para o processo
   return
  }

  setLoading(true)

  try {
   if (isLogin) {
    await login(formData.email, formData.password)
    toast({
     title: "Login realizado com sucesso! 🎉",
     description: "Bem-vindo ao ViajaFacil.",
    })
   } else {
    await register(formData.name, formData.email, formData.password)
    toast({
     title: "Conta criada com sucesso! ✈️",
     description: "Bem-vindo ao ViajaFacil.",
    })
   }
   onClose()
   // Limpa os dados e os erros após o sucesso
   setFormData({ name: "", email: "", password: "" })
   setErrors({ name: "", email: "", password: "" })
  } catch (error) {
   toast({
    title: "Erro de Autenticação",
    description: error instanceof Error ? error.message : "Ocorreu um erro desconhecido.",
    variant: "destructive",
   })
  } finally {
   setLoading(false)
  }
 }

 const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target
  setFormData((prev) => ({
   ...prev,
   [name]: value,
  }))
  // Limpa o erro do campo assim que o usuário digita
  setErrors((prev) => ({
   ...prev,
   [name]: "",
  }))
 }
 
 // Limpa os erros ao trocar entre Login e Registro
 const toggleForm = () => {
  setIsLogin(!isLogin)
  setErrors({ name: "", email: "", password: "" })
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
        // Adiciona uma borda vermelha se houver erro
        className={errors.name ? "border-red-500" : ""} 
       />
       {/* 4. Exibir mensagem de erro */}
       {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
      </div>
     )}

     <div className="space-y-2">
      <Label htmlFor="email">Email</Label>
      <Input 
       id="email" 
       name="email" 
       type="email" 
       value={formData.email} 
       onChange={handleInputChange} 
       required 
       className={errors.email ? "border-red-500" : ""}
      />
      {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
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
       className={errors.password ? "border-red-500" : ""}
      />
      {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
     </div>

     <Button type="submit" className="w-full" disabled={loading}>
      {loading ? "Carregando..." : isLogin ? "Entrar" : "Criar Conta"}
     </Button>
    </form>

    <div className="text-center">
     <Button variant="link" onClick={toggleForm} className="text-sm">
      {isLogin ? "Não tem conta? Criar conta" : "Já tem conta? Entrar"}
     </Button>
    </div>
   </DialogContent>
  </Dialog>
 )
}