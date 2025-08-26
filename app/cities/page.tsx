"use client"

import { useEffect, useState } from "react"
import { PageHeader } from "@/components/PageHeader"
import { CityCard } from "@/components/CityCard"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { EmptyState } from "@/components/EmptyState"
import { api } from "@/lib/api"
import type { City } from "@/types"

export default function CitiesPage() {
  const [cities, setCities] = useState<City[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCities = async () => {
      try {
        const citiesData = await api.getCities()
        setCities(citiesData)
      } catch (error) {
        console.error("Erro ao carregar cidades:", error)
      } finally {
        setLoading(false)
      }
    }

    loadCities()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="Cidades de Angola" description="Explore os destinos mais incríveis do país" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <LoadingSpinner text="Carregando cidades..." />
        ) : cities.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cities.map((city) => (
              <CityCard key={city.id} city={city} />
            ))}
          </div>
        ) : (
          <EmptyState type="cities" />
        )}
      </div>
    </div>
  )
}
