"use client"

import { useEffect, useState } from "react"
import { PageHeader } from "@/components/PageHeader"
import { HotelCard } from "@/components/HotelCard"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { EmptyState } from "@/components/EmptyState"
import { api } from "@/lib/api"
import type { Hotel } from "@/types"

export default function HotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadHotels = async () => {
      try {
        const hotelsData = await api.getHotels()
        setHotels(hotelsData)
      } catch (error) {
        console.error("Erro ao carregar hotéis:", error)
      } finally {
        setLoading(false)
      }
    }

    loadHotels()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="Hotéis em Angola" description="Encontre a acomodação perfeita para sua viagem" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <LoadingSpinner text="Carregando hotéis..." />
        ) : hotels.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} showCity />
            ))}
          </div>
        ) : (
          <EmptyState type="hotels" />
        )}
      </div>
    </div>
  )
}
