import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Star } from "lucide-react"
import type { Review } from "@/types"

interface ReviewCardProps {
  review: Review
}

export function ReviewCard({ review }: ReviewCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
    ))
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <Avatar>
            <AvatarFallback>{review.user?.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">{review.user?.name || "Usuário"}</h4>
              <span className="text-sm text-muted-foreground">{formatDate(review.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1 mt-1">{renderStars(review.rating)}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-muted-foreground">{review.comment}</p>
      </CardContent>
    </Card>
  )
}
