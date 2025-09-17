"use client"

import { AdminRoute } from "@/components/AdminRoute"
import { PageHeader } from "@/components/PageHeader"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Filter } from "lucide-react"
import { useEffect, useState } from "react"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { EmptyState } from "@/components/EmptyState"
import { api } from "@/lib/api"
import type { Reservation } from "@/types"
import { useToast } from "@/hooks/use-toast"

export default function AdminReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const { toast } = useToast()

  useEffect(() => {
    loadReservations()
  }, [])

  const loadReservations = async () => {
    try {
      const data = await api.getAllReservations()
      setReservations(data)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar reservas",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const updateReservationStatus = async (reservationId: string, status: string) => {
    try {
      await api.updateReservationStatus(reservationId, status)
      toast({
        title: "Sucesso",
        description: "Status da reserva atualizado",
      })
      loadReservations()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar status da reserva",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      CONFIRMED: { label: "Confirmada", variant: "default" as const },
      PENDING: { label: "Pendente", variant: "secondary" as const },
      CANCELLED: { label: "Cancelada", variant: "destructive" as const },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || {
      label: status,
      variant: "outline" as const,
    }

    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const filteredReservations = reservations.filter((reservation) => {
    if (statusFilter === "all") return true
    return reservation.status === statusFilter
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-AO")
  }

  const calculateNights = (checkIn: string, checkOut: string) => {
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  return (
    <AdminRoute>
      <div className="min-h-screen bg-background pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <PageHeader title="Gerenciar Reservas" description="Visualize e gerencie todas as reservas do sistema" />

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="CONFIRMED">Confirmadas</SelectItem>
                    <SelectItem value="PENDING">Pendentes</SelectItem>
                    <SelectItem value="CANCELLED">Canceladas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Lista de Reservas</CardTitle>
              <CardDescription>
                {filteredReservations.length} reserva(s) encontrada(s)
                {statusFilter !== "all" && ` com status "${statusFilter}"`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner />
                </div>
              ) : filteredReservations.length === 0 ? (
                <EmptyState
                  icon={Calendar}
                  title="Nenhuma reserva encontrada"
                  description={
                    statusFilter === "all"
                      ? "Ainda não há reservas no sistema"
                      : `Nenhuma reserva com status "${statusFilter}"`
                  }
                />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Hotel</TableHead>
                      <TableHead>Check-in</TableHead>
                      <TableHead>Check-out</TableHead>
                      <TableHead>Noites</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReservations.map((reservation) => (
                      <TableRow key={reservation.id}>
                        <TableCell className="font-medium">{reservation.user?.name || "N/A"}</TableCell>
                        <TableCell>{reservation.hotel?.name || "N/A"}</TableCell>
                        <TableCell>{formatDate(reservation.checkIn)}</TableCell>
                        <TableCell>{formatDate(reservation.checkOut)}</TableCell>
                        <TableCell>{calculateNights(reservation.checkIn, reservation.checkOut)}</TableCell>
                        <TableCell>{reservation.totalPrice.toLocaleString("pt-AO")} Kz</TableCell>
                        <TableCell>{getStatusBadge(reservation.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {reservation.status === "PENDING" && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateReservationStatus(reservation.id, "CONFIRMED")}
                                >
                                  Confirmar
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateReservationStatus(reservation.id, "CANCELLED")}
                                >
                                  Cancelar
                                </Button>
                              </>
                            )}
                            {reservation.status === "CONFIRMED" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateReservationStatus(reservation.id, "CANCELLED")}
                              >
                                Cancelar
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminRoute>
  )
}
