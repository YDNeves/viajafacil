import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Star, Users } from "lucide-react"
import type { Hotel } from "@/types"

interface HotelCardProps {
  hotel: Hotel & { _count?: { reviews: number } }
  showCity?: boolean
}

export function HotelCard({ hotel, showCity = false }: HotelCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-AO", {
      style: "currency",
      currency: "AOA",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
      <div className="relative h-48 overflow-hidden">
        <img
          src={hotel.image || `/placeholder.svg?height=200&width=400&query=hotel ${hotel.name} Angola`}
          alt={hotel.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4">
          <Badge variant="secondary" className="bg-white/90 text-foreground">
            {formatPrice(hotel.price)}/noite
          </Badge>
        </div>
        {hotel.rating && (
          <div className="absolute top-4 left-4">
            <Badge className="bg-primary/90 text-primary-foreground flex items-center gap-1">
              <Star className="h-3 w-3 fill-current" />
              {hotel.rating.toFixed(1)}
            </Badge>
          </div>
        )}
      </div>

      <CardHeader>
        <CardTitle className="line-clamp-1">{hotel.name}</CardTitle>
        <CardDescription className="line-clamp-2">{hotel.description}</CardDescription>
        {showCity && hotel.city && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span>{hotel.city.name}</span>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{hotel._count?.reviews || 0} avaliações</span>
          </div>
          <div className="text-lg font-bold text-primary">{formatPrice(hotel.price)}</div>
        </div>

        <Link href={`/hotels/${hotel.id}`}>
          <Button className="w-full">Ver Detalhes</Button>
        </Link>
      </CardContent>
    </Card>
  )
}
