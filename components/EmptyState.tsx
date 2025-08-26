"use client"

import { Button } from "@/components/ui/button"
import { MapPin, Building2, Camera, FileText } from "lucide-react"

interface EmptyStateProps {
  type: "cities" | "hotels" | "attractions" | "reviews" | "reservas"
  title?: string
  description?: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({ type, title, description, actionLabel, onAction }: EmptyStateProps) {
  const getIcon = () => {
    switch (type) {
      case "cities":
        return <MapPin className="h-12 w-12 text-muted-foreground" />
      case "hotels":
        return <Building2 className="h-12 w-12 text-muted-foreground" />
      case "attractions":
        return <Camera className="h-12 w-12 text-muted-foreground" />
      case "reviews":
        return <FileText className="h-12 w-12 text-muted-foreground" />
      case "reservas":
        return <Building2 className="h-12 w-12 text-muted-foreground" />
      default:
        return <FileText className="h-12 w-12 text-muted-foreground" />
    }
  }

  const getDefaultContent = () => {
    switch (type) {
      case "cities":
        return {
          title: "Nenhuma cidade encontrada",
          description: "Não há cidades disponíveis no momento.",
        }
      case "hotels":
        return {
          title: "Nenhum hotel encontrado",
          description: "Não há hotéis disponíveis nesta localização.",
        }
      case "attractions":
        return {
          title: "Nenhuma atração encontrada",
          description: "Não há atrações disponíveis nesta cidade.",
        }
      case "reviews":
        return {
          title: "Nenhuma avaliação",
          description: "Seja o primeiro a deixar uma avaliação!",
        }
      case "reservas":
        return {
          title: "Nenhuma reserva encontrada",
          description: "Você ainda não fez nenhuma reserva.",
        }
      default:
        return {
          title: "Nenhum item encontrado",
          description: "Não há itens disponíveis.",
        }
    }
  }

  const defaultContent = getDefaultContent()

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {getIcon()}
      <h3 className="mt-4 text-lg font-semibold">{title || defaultContent.title}</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm">{description || defaultContent.description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="mt-4">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
