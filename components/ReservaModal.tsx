"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, Users, CreditCard } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api"
import type { Hotel } from "@/types"

interface ReservaModalProps {
  isOpen: boolean
  onClose: () => void
  hotel: Hotel
  onReservaCreated?: () => void
}

export function ReservaModal({ isOpen, onClose, hotel, onReservaCreated }: ReservaModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    checkIn: "",
    checkOut: "",
    guests: 1,
  })

  const { user } = useAuth()
  const { toast } = useToast()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-AO", {
      style: "currency",
      currency: "AOA",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const calculateNights = () => {
    if (!formData.checkIn || !formData.checkOut) return 0
    const checkIn = new Date(formData.checkIn)
    const checkOut = new Date(formData.checkOut)
    const diffTime = checkOut.getTime() - checkIn.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  const calculateTotal = () => {
    const nights = calculateNights()
    return nights * hotel.price
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const nights = calculateNights()
    if (nights <= 0) {
      toast({
        title: "Erro",
        description: "A data de check-out deve ser posterior à data de check-in",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      await api.createReserva({
        hotelId: hotel.id,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        guests: formData.guests,
        totalPrice: calculateTotal(),
      })

      toast({
        title: "Reserva confirmada!",
        description: `Sua reserva no ${hotel.name} foi confirmada com sucesso.`,
      })

      onClose()
      setFormData({ checkIn: "", checkOut: "", guests: 1 })
      onReservaCreated?.()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível confirmar sua reserva. Tente novamente.",
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
      [name]: name === "guests" ? Number.parseInt(value) || 1 : value,
    }))
  }

  // Set minimum date to today
  const today = new Date().toISOString().split("T")[0]
  const minCheckOut = formData.checkIn || today

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Reservar {hotel.name}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="checkIn" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Check-in
              </Label>
              <Input
                id="checkIn"
                name="checkIn"
                type="date"
                value={formData.checkIn}
                onChange={handleInputChange}
                min={today}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="checkOut" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Check-out
              </Label>
              <Input
                id="checkOut"
                name="checkOut"
                type="date"
                value={formData.checkOut}
                onChange={handleInputChange}
                min={minCheckOut}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="guests" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Número de hóspedes
            </Label>
            <Input
              id="guests"
              name="guests"
              type="number"
              min="1"
              max="10"
              value={formData.guests}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Booking Summary */}
          {formData.checkIn && formData.checkOut && calculateNights() > 0 && (
            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <h4 className="font-semibold">Resumo da Reserva</h4>
              <div className="flex justify-between text-sm">
                <span>{calculateNights()} noites</span>
                <span>
                  {formatPrice(hotel.price)} x {calculateNights()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>
                  {formData.guests} hóspede{formData.guests > 1 ? "s" : ""}
                </span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatPrice(calculateTotal())}</span>
              </div>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Confirmando..." : "Confirmar Reserva"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
