"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { ReviewCard } from "@/components/ReviewCard"
import { ReservaModal } from "@/components/ReservaModal"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { EmptyState } from "@/components/EmptyState"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Star, Users, Calendar, CreditCard } from "lucide-react"
import { api } from "@/lib/api"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"
import type { Hotel, Review } from "@/types"

export default function HotelDetailsPage() {
  const params = useParams()
  const hotelId = params.id as string
  const { isAuthenticated } = useAuth()
  const { toast } = useToast()

  const [hotel, setHotel] = useState<Hotel | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [reviewLoading, setReviewLoading] = useState(false)
  const [showReservaModal, setShowReservaModal] = useState(false)

  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: "",
  })

  useEffect(() => {
    const loadHotelData = async () => {
      try {
        const [hotelData, reviewsData] = await Promise.all([api.getHotel(hotelId), api.getHotelReviews(hotelId)])

        setHotel(hotelData)
        setReviews(reviewsData)
      } catch (error) {
        console.error("Erro ao carregar dados do hotel:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados do hotel",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (hotelId) {
      loadHotelData()
    }
  }, [hotelId, toast])

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
        hotelId: hotelId,
      })

      toast({
        title: "Avaliação enviada!",
        description: "Obrigado por compartilhar sua experiência",
      })

      // Reload reviews
      const reviewsData = await api.getHotelReviews(hotelId)
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-AO", {
      style: "currency",
      currency: "AOA",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0)
    return (sum / reviews.length).toFixed(1)
  }

  const handleReservaCreated = () => {
    toast({
      title: "Reserva confirmada!",
      description: "Você pode ver suas reservas na página 'Minhas Reservas'",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <LoadingSpinner text="Carregando detalhes do hotel..." />
      </div>
    )
  }

  if (!hotel) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <EmptyState type="hotels" title="Hotel não encontrado" description="O hotel solicitado não existe." />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        <img
          src={hotel.image || `/placeholder.svg?height=400&width=1200&query=hotel ${hotel.name} Angola`}
          alt={hotel.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-8 left-8 text-white">
          {hotel.city && (
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-5 w-5" />
              <span>{hotel.city.name}, Angola</span>
            </div>
          )}
          <h1 className="text-4xl md:text-6xl font-bold">{hotel.name}</h1>
          <div className="flex items-center gap-4 mt-4">
            {reviews.length > 0 && (
              <Badge className="bg-primary/90 text-primary-foreground flex items-center gap-1">
                <Star className="h-3 w-3 fill-current" />
                {calculateAverageRating()}
              </Badge>
            )}
            <Badge variant="secondary" className="bg-white/90 text-foreground">
              {formatPrice(hotel.price)}/noite
            </Badge>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hotel Description */}
            <Card>
              <CardHeader>
                <CardTitle>Sobre o Hotel</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{hotel.description}</p>
              </CardContent>
            </Card>

            {/* Reviews Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Star className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold">Avaliações</h2>
                  <span className="text-sm text-muted-foreground">({reviews.length})</span>
                  {reviews.length > 0 && (
                    <Badge variant="outline" className="ml-2">
                      {calculateAverageRating()} ⭐
                    </Badge>
                  )}
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
                    <CardDescription>Compartilhe sua experiência no {hotel.name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="rating">Avaliação</Label>
                        <Select
                          value={reviewForm.rating.toString()}
                          onValueChange={(value:any) => setReviewForm({ ...reviewForm, rating: Number.parseInt(value) })}
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
                  description={`Seja o primeiro a avaliar o ${hotel.name}!`}
                  actionLabel={isAuthenticated ? "Deixar Avaliação" : undefined}
                  onAction={isAuthenticated ? () => setShowReviewForm(true) : undefined}
                />
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Reservar
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{formatPrice(hotel.price)}</div>
                  <div className="text-sm text-muted-foreground">por noite</div>
                </div>

                {isAuthenticated ? (
                  <Button className="w-full" size="lg" onClick={() => setShowReservaModal(true)}>
                    <Calendar className="mr-2 h-4 w-4" />
                    Fazer Reserva
                  </Button>
                ) : (
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-3">Faça login para reservar</p>
                    <Button variant="outline" className="w-full bg-transparent">
                      Entrar
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Hotel Info */}
            <Card>
              <CardHeader>
                <CardTitle>Informações do Hotel</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {hotel.city && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{hotel.city.name}, Angola</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{reviews.length} avaliações</span>
                </div>
                {reviews.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Avaliação média: {calculateAverageRating()}/5</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Reserva Modal */}
      {hotel && (
        <ReservaModal
          isOpen={showReservaModal}
          onClose={() => setShowReservaModal(false)}
          hotel={hotel}
          onReservaCreated={handleReservaCreated}
        />
      )}
    </div>
  )
}
