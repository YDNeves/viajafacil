import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Building2 } from "lucide-react"
import type { City } from "@/types"

interface CityCardProps {
  city: City & { _count?: { hotels: number } }
}

export function CityCard({ city }: CityCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
      <div className="relative h-48 overflow-hidden">
        <img
          src={city.imageUrl || `/placeholder.svg?height=200&width=400&query=cidade de ${city.name} Angola`}
          alt={city.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-xl font-bold">{city.name}</h3>
        </div>
      </div>

      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          {city.name}
        </CardTitle>
        <CardDescription className="line-clamp-2">{city.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {city._count && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Building2 className="h-4 w-4" />
            <span>{city._count.hotels} hotéis disponíveis</span>
          </div>
        )}

        <Link href={`/cities/${city.id}`}>
          <Button className="w-full">Ver Detalhes</Button>
        </Link>
      </CardContent>
    </Card>
  )
}
