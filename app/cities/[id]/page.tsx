"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { HotelCard } from "@/components/HotelCard"
import { AttractionCard } from "@/components/AttractionCard"
import { ReviewCard } from "@/components/ReviewCard"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { EmptyState } from "@/components/EmptyState"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Building2, Camera, Star } from "lucide-react"
import { api } from "@/lib/api"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"
import type { City, Hotel, Attraction, Review } from "@/types"

export default function CityDetailsPage() {
  const params = useParams()
  const cityId = params.id as string
  const { isAuthenticated } = useAuth()
  const { toast } = useToast()

  const [city, setCity] = useState<City | null>(null)
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [attractions, setAttractions] = useState<Attraction[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [reviewLoading, setReviewLoading] = useState(false)

  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: "",
  })

  useEffect(() => {
    const loadCityData = async () => {
      try {
        const [cityData, hotelsData, attractionsData, reviewsData] = await Promise.all([
          api.getCity(cityId),
          api.getHotels(), // Filter by city on backend or here
          api.getAttractions(), // Filter by city on backend or here
          api.getCityReviews(cityId),
        ])

        setCity(cityData)
        setHotels(hotelsData.filter((hotel) => hotel.cityId === cityId))
        setAttractions(attractionsData.filter((attraction) => attraction.cityId === cityId))
        setReviews(reviewsData)
      } catch (error) {
        console.error("Erro ao carregar dados da cidade:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados da cidade",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (cityId) {
      loadCityData()
    }
  }, [cityId, toast])

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAuthenticated) {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado para deixar uma avaliação",
        variant: "destructive",
      })
      return
    }

    setReviewLoading(true)
    try {
      await api.createReview({
        rating: reviewForm.rating,
        comment: reviewForm.comment,
        cityId: cityId,
      })

      toast({
        title: "Avaliação enviada!",
        description: "Obrigado por compartilhar sua experiência",
      })

      // Reload reviews
      const reviewsData = await api.getCityReviews(cityId)
      setReviews(reviewsData)
      setShowReviewForm(false)
      setReviewForm({ rating: 5, comment: "" })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível enviar sua avaliação",
        variant: "destructive",
      })
    } finally {
      setReviewLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <LoadingSpinner text="Carregando detalhes da cidade..." />
      </div>
    )
  }

  if (!city) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <EmptyState type="cities" title="Cidade não encontrada" description="A cidade solicitada não existe." />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        <img
          src={city.image || `/placeholder.svg?height=400&width=1200&query=cidade de ${city.name} Angola`}
          alt={city.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-8 left-8 text-white">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="h-5 w-5" />
            <span>Angola</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold">{city.name}</h1>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* City Description */}
        <div className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Sobre {city.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{city.description}</p>
            </CardContent>
          </Card>
        </div>

        {/* Hotels Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Building2 className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Hotéis em {city.name}</h2>
              <span className="text-sm text-muted-foreground">({hotels.length})</span>
            </div>
          </div>

          {hotels.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotels.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
            </div>
          ) : (
            <EmptyState
              type="hotels"
              title="Nenhum hotel encontrado"
              description={`Não há hotéis cadastrados em ${city.name} no momento.`}
            />
          )}
        </div>

        {/* Attractions Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Camera className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Atrações em {city.name}</h2>
              <span className="text-sm text-muted-foreground">({attractions.length})</span>
            </div>
          </div>

          {attractions.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {attractions.map((attraction) => (
                <AttractionCard key={attraction.id} attraction={attraction} />
              ))}
            </div>
          ) : (
            <EmptyState
              type="attractions"
              title="Nenhuma atração encontrada"
              description={`Não há atrações cadastradas em ${city.name} no momento.`}
            />
          )}
        </div>

        {/* Reviews Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Star className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Avaliações de {city.name}</h2>
              <span className="text-sm text-muted-foreground">({reviews.length})</span>
            </div>
            {isAuthenticated && (
              <Button onClick={() => setShowReviewForm(!showReviewForm)}>
                {showReviewForm ? "Cancelar" : "Deixar Avaliação"}
              </Button>
            )}
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Deixe sua avaliação</CardTitle>
                <CardDescription>Compartilhe sua experiência em {city.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="rating">Avaliação</Label>
                    <Select
                      value={reviewForm.rating.toString()}
                      onValueChange={(value) => setReviewForm({ ...reviewForm, rating: Number.parseInt(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">⭐⭐⭐⭐⭐ Excelente</SelectItem>
                        <SelectItem value="4">⭐⭐⭐⭐ Muito Bom</SelectItem>
                        <SelectItem value="3">⭐⭐⭐ Bom</SelectItem>
                        <SelectItem value="2">⭐⭐ Regular</SelectItem>
                        <SelectItem value="1">⭐ Ruim</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="comment">Comentário</Label>
                    <Textarea
                      id="comment"
                      placeholder="Conte sobre sua experiência..."
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      required
                    />
                  </div>

                  <Button type="submit" disabled={reviewLoading}>
                    {reviewLoading ? "Enviando..." : "Enviar Avaliação"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Reviews List */}
          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          ) : (
            <EmptyState
              type="reviews"
              title="Nenhuma avaliação ainda"
              description={`Seja o primeiro a avaliar ${city.name}!`}
              actionLabel={isAuthenticated ? "Deixar Avaliação" : undefined}
              onAction={isAuthenticated ? () => setShowReviewForm(true) : undefined}
            />
          )}
        </div>
      </div>
    </div>
  )
}
