"use client"

import { AdminRoute } from "@/components/AdminRoute"
import { PageHeader } from "@/components/PageHeader"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, MapPin, Building, Calendar, Plus, BarChart3 } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { LoadingSpinner } from "@/components/LoadingSpinner"

interface AdminStats {
  totalUsers: number
  totalCities: number
  totalHotels: number
  totalReservations: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        // Simular estatísticas por enquanto
        setStats({
          totalUsers: 150,
          totalCities: 12,
          totalHotels: 45,
          totalReservations: 89,
        })
      } catch (error) {
        console.error("Erro ao carregar estatísticas:", error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  return (
    <AdminRoute>
      <div className="min-h-screen bg-background pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PageHeader title="Dashboard Administrativo" description="Gerencie o sistema ViajaFacil" />

          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              {/* Estatísticas */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.totalUsers}</div>
                    <p className="text-xs text-muted-foreground">Usuários registrados</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Cidades</CardTitle>
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.totalCities}</div>
                    <p className="text-xs text-muted-foreground">Destinos disponíveis</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Hotéis</CardTitle>
                    <Building className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.totalHotels}</div>
                    <p className="text-xs text-muted-foreground">Acomodações cadastradas</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Reservas</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.totalReservations}</div>
                    <p className="text-xs text-muted-foreground">Reservas realizadas</p>
                  </CardContent>
                </Card>
              </div>

              {/* Ações Rápidas */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Gerenciar Cidades
                    </CardTitle>
                    <CardDescription>Adicione, edite ou remova cidades do sistema</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button asChild className="w-full">
                      <Link href="/admin/cities">
                        <Plus className="h-4 w-4 mr-2" />
                        Gerenciar Cidades
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      Gerenciar Hotéis
                    </CardTitle>
                    <CardDescription>Adicione, edite ou remova hotéis do sistema</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button asChild className="w-full">
                      <Link href="/admin/hotels">
                        <Plus className="h-4 w-4 mr-2" />
                        Gerenciar Hotéis
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Gerenciar Reservas
                    </CardTitle>
                    <CardDescription>Visualize e gerencie todas as reservas</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button asChild className="w-full">
                      <Link href="/admin/reservations">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Ver Reservas
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Gerenciar Usuários
                    </CardTitle>
                    <CardDescription>Visualize e gerencie usuários do sistema</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button asChild className="w-full">
                      <Link href="/admin/users">
                        <Users className="h-4 w-4 mr-2" />
                        Ver Usuários
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </div>
    </AdminRoute>
  )
}
