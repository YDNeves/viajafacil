import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Camera } from "lucide-react"
import type { Attraction } from "@/types"

interface AttractionCardProps {
  attraction: Attraction
  showCity?: boolean
}

export function AttractionCard({ attraction, showCity = false }: AttractionCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
      <div className="relative h-48 overflow-hidden">
        <img
          src={attraction.image || `/placeholder.svg?height=200&width=400&query=atração ${attraction.name} Angola`}
          alt={attraction.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 text-white">
          <div className="flex items-center gap-2">
            <Camera className="h-4 w-4" />
            <span className="text-sm">Atração Turística</span>
          </div>
        </div>
      </div>

      <CardHeader>
        <CardTitle className="line-clamp-1">{attraction.name}</CardTitle>
        <CardDescription className="line-clamp-2">{attraction.description}</CardDescription>
        {showCity && attraction.city && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span>{attraction.city.name}</span>
          </div>
        )}
      </CardHeader>
    </Card>
  )
}
