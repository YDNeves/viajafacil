"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { AuthModal } from "./AuthModal"
import { MapPin, User, LogOut } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function Navbar() {
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const { user, logout, isAuthenticated } = useAuth()

  return (
    <>
      <nav className="fixed top-0 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <MapPin className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-foreground">ViajaFacil</span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-foreground hover:text-primary transition-colors">
                Início
              </Link>
              <Link href="/cities" className="text-foreground hover:text-primary transition-colors">
                Cidades
              </Link>
              <Link href="/hotels" className="text-foreground hover:text-primary transition-colors">
                Hotéis
              </Link>
              {isAuthenticated && (
                <Link href="/reservas" className="text-foreground hover:text-primary transition-colors">
                  Minhas Reservas
                </Link>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>{user?.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href="/reservas">Minhas Reservas</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button onClick={() => setAuthModalOpen(true)}>Entrar</Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  )
}
