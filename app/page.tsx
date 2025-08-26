"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CityCard } from "@/components/CityCard"
import { HotelCard } from "@/components/HotelCard"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { EmptyState } from "@/components/EmptyState"
import { MapPin, Users, Star, Phone, Mail, ArrowRight } from "lucide-react"
import { api } from "@/lib/api"
import type { City, Hotel } from "@/types"

export default function Home() {
  const [cities, setCities] = useState<City[]>([])
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loadingCities, setLoadingCities] = useState(true)
  const [loadingHotels, setLoadingHotels] = useState(true)

  useEffect(() => {
    const loadCities = async () => {
      try {
        const citiesData = await api.getCities()
        setCities(citiesData.slice(0, 6)) // Show only first 6 cities
      } catch (error) {
        console.error("Erro ao carregar cidades:", error)
      } finally {
        setLoadingCities(false)
      }
    }

    const loadHotels = async () => {
      try {
        const hotelsData = await api.getHotels()
        setHotels(hotelsData.slice(0, 6)) // Show only first 6 hotels
      } catch (error) {
        console.error("Erro ao carregar hotéis:", error)
      } finally {
        setLoadingHotels(false)
      }
    }

    loadCities()
    loadHotels()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/stunning-landscape-of-angola-with-baobab-trees-and.png')`,
          }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Bem-vindo ao
            <span className="block text-accent"> ViajaFacil</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 leading-relaxed">
            Descubra os melhores destinos, hotéis e experiências únicas em Angola
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/cities">
              <Button size="lg" className="text-lg px-8 py-6">
                <MapPin className="mr-2 h-5 w-5" />
                Explorar Cidades
              </Button>
            </Link>
            <Link href="/hotels">
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6 bg-white/10 border-white text-white hover:bg-white hover:text-foreground"
              >
                <Star className="mr-2 h-5 w-5" />
                Ver Hotéis
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-4 text-foreground">Cidades Populares</h2>
              <p className="text-xl text-muted-foreground">Explore os destinos mais procurados de Angola</p>
            </div>
            <Link href="/cities">
              <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                Ver Todas
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {loadingCities ? (
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
      </section>

      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-4 text-foreground">Hotéis em Destaque</h2>
              <p className="text-xl text-muted-foreground">Acomodações selecionadas para sua estadia perfeita</p>
            </div>
            <Link href="/hotels">
              <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                Ver Todas
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {loadingHotels ? (
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
      </section>

      {/* About Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-foreground">Por que escolher o ViajaFacil?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              A plataforma completa para descobrir e reservar as melhores experiências turísticas em Angola, com
              informações atualizadas e avaliações reais de outros viajantes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="/professional-angolan-tour-guide-smiling-in-traditi.png"
                alt="Turismo em Angola"
                className="rounded-lg shadow-lg w-full"
              />
            </div>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Destinos Verificados</h3>
                  <p className="text-muted-foreground">
                    Todos os locais e hotéis são verificados e atualizados regularmente
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Avaliações Reais</h3>
                  <p className="text-muted-foreground">
                    Leia avaliações de outros viajantes para fazer a melhor escolha
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Reservas Fáceis</h3>
                  <p className="text-muted-foreground">Sistema simples e seguro para reservar sua estadia ideal</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Destinations Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-foreground">Destinos Imperdíveis</h2>
            <p className="text-xl text-muted-foreground">Descubra os lugares mais espetaculares de Angola</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <img
                  src="/kalandula-falls-angola-waterfall-landscape.png"
                  alt="Cataratas de Kalandula"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle>Cataratas de Kalandula</CardTitle>
                <CardDescription>Uma das maiores quedas d'água de África, com 105 metros de altura</CardDescription>
              </CardHeader>
            </Card>

            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <img
                  src="/luanda-angola-cityscape-colonial-architecture.png"
                  alt="Luanda"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle>Luanda Histórica</CardTitle>
                <CardDescription>Explore a rica arquitetura colonial e a vibrante cultura urbana</CardDescription>
              </CardHeader>
            </Card>

            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <img
                  src="/namibe-desert-angola-sand-dunes-landscape.png"
                  alt="Deserto do Namibe"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle>Deserto do Namibe</CardTitle>
                <CardDescription>Paisagens surreais onde o deserto encontra o oceano</CardDescription>
              </CardHeader>
            </Card>

            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <img
                  src="/benguela-beach-angola-coastline-palm-trees.png"
                  alt="Praias de Benguela"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle>Praias de Benguela</CardTitle>
                <CardDescription>Costas pristinas com águas cristalinas e areias douradas</CardDescription>
              </CardHeader>
            </Card>

            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <img
                  src="/kissama-national-park-angola-elephants-wildlife.png"
                  alt="Parque Nacional da Kissama"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle>Parque da Kissama</CardTitle>
                <CardDescription>Safari africano com elefantes, antílopes e vida selvagem única</CardDescription>
              </CardHeader>
            </Card>

            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <img
                  src="/huambo-angola-highlands-mountains-landscape.png"
                  alt="Planalto Central"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle>Planalto Central</CardTitle>
                <CardDescription>Montanhas majestosas e clima ameno no coração de Angola</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-foreground">Pronto para Sua Aventura?</h2>
          <p className="text-xl text-muted-foreground mb-12">
            Entre em contacto e vamos planear juntos a sua experiência única em Angola
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="p-6">
              <CardContent className="flex items-center gap-4 p-0">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold mb-1">Telefone</h3>
                  <p className="text-muted-foreground">+244 923 456 789</p>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="flex items-center gap-4 p-0">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold mb-1">Email</h3>
                  <p className="text-muted-foreground">guia@descobraangola.ao</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Button size="lg" className="text-lg px-12 py-6">
            Solicitar Orçamento
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-4 text-foreground">ViajaFacil</h3>
          <p className="text-muted-foreground mb-6">Sua plataforma completa para turismo em Angola</p>
          <p className="text-sm text-muted-foreground">© 2024 ViajaFacil. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
