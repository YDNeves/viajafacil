"use client"

import { useEffect, useState } from "react"
import { PageHeader } from "@/components/PageHeader"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { EmptyState } from "@/components/EmptyState"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users, CreditCard, Building2 } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api"
import type { Reserva } from "@/types"
import Link from "next/link"

export default function ReservasPage() {
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [loading, setLoading] = useState(true)
  const { user, isAuthenticated } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    const loadReservas = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        const reservasData = await api.getUserReservas(user.id)
        setReservas(reservasData)
      } catch (error) {
        console.error("Erro ao carregar reservas:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar suas reservas",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadReservas()
  }, [user, toast])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-AO", {
      style: "currency",
      currency: "AOA",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmada"
      case "pending":
        return "Pendente"
      case "cancelled":
        return "Cancelada"
      default:
        return status
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <PageHeader title="Minhas Reservas" description="Gerencie suas reservas de hotel" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <EmptyState
            type="reservas"
            title="Login necessário"
            description="Você precisa estar logado para ver suas reservas."
            actionLabel="Fazer Login"
            onAction={() => {
              // This would trigger the auth modal - for now just show message
              toast({
                title: "Login necessário",
                description: "Clique no botão 'Entrar' no topo da página",
              })
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="Minhas Reservas" description="Gerencie suas reservas de hotel" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <LoadingSpinner text="Carregando suas reservas..." />
        ) : reservas.length > 0 ? (
          <div className="space-y-6">
            {reservas.map((reserva) => (
              <Card key={reserva.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-primary" />
                        {reserva.hotel?.name || "Hotel"}
                      </CardTitle>
                      {reserva.hotel?.city && (
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" />
                          {reserva.hotel.city.name}, Angola
                        </CardDescription>
                      )}
                    </div>
                    <Badge className={getStatusColor(reserva.status)}>{getStatusText(reserva.status)}</Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">Check-in</div>
                        <div className="text-sm text-muted-foreground">{formatDate(reserva.checkIn)}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">Check-out</div>
                        <div className="text-sm text-muted-foreground">{formatDate(reserva.checkOut)}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">Hóspedes</div>
                        <div className="text-sm text-muted-foreground">{reserva.guests}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <span className="text-lg font-semibold">{formatPrice(reserva.totalPrice)}</span>
                    </div>

                    <div className="flex gap-2">
                      {reserva.hotel && (
                        <Link href={`/hotels/${reserva.hotel.id}`}>
                          <Button variant="outline" size="sm">
                            Ver Hotel
                          </Button>
                        </Link>
                      )}
                      {reserva.status === "confirmed" && (
                        <Button variant="outline" size="sm" disabled>
                          Gerenciar
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground">Reserva feita em {formatDate(reserva.createdAt)}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            type="reservas"
            title="Nenhuma reserva encontrada"
            description="Você ainda não fez nenhuma reserva. Explore nossos hotéis e faça sua primeira reserva!"
            actionLabel="Explorar Hotéis"
            onAction={() => {
              window.location.href = "/hotels"
            }}
          />
        )}
      </div>
    </div>
  )
}
