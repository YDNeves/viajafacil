"use client"

import type React from "react"

import { AdminRoute } from "@/components/AdminRoute"
import { PageHeader } from "@/components/PageHeader"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, MapPin } from "lucide-react"
import { useEffect, useState } from "react"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { EmptyState } from "@/components/EmptyState"
import { api } from "@/lib/api"
import type { City } from "@/types"
import { useToast } from "@/hooks/use-toast"

export default function AdminCities() {
  const [cities, setCities] = useState<City[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCity, setEditingCity] = useState<City | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    loadCities()
  }, [])

  const loadCities = async () => {
    try {
      const data = await api.getCities()
      setCities(data)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar cidades",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      /* if (editingCity) {
        // Atualizar cidade existente
        await api.updateCity(editingCity.id, formData)
        toast({
          title: "Sucesso",
          description: "Cidade atualizada com sucesso",
        })
      } else {
        // Criar nova cidade
        await api.createCity(formData)
        toast({
          title: "Sucesso",
          description: "Cidade criada com sucesso",
        })
      } */

      setDialogOpen(false)
      setEditingCity(null)
      setFormData({ name: "", description: "", image: "" })
      loadCities()
    } catch (error) {
      toast({
        title: "Erro",
        description: editingCity ? "Erro ao atualizar cidade" : "Erro ao criar cidade",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (city: City) => {
    setEditingCity(city)
    setFormData({
      name: city.name,
      description: city.description || "",
      image: city.imageUrl || "",
    })
    setDialogOpen(true)
  }

  const handleDelete = async (cityId: string) => {
    if (!confirm("Tem certeza que deseja excluir esta cidade?")) return

   /*  try {
      await api.deleteCity(cityId)
      toast({
        title: "Sucesso",
        description: "Cidade excluída com sucesso",
      })
      loadCities()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir cidade",
        variant: "destructive",
      })
    } */
  }

  const resetForm = () => {
    setEditingCity(null)
    setFormData({ name: "", description: "", image: "" })
  }

  return (
    <AdminRoute>
      <div className="min-h-screen bg-background pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <PageHeader title="Gerenciar Cidades" description="Adicione, edite ou remova cidades do sistema" />

            <Dialog
              open={dialogOpen}
              onOpenChange={(open) => {
                setDialogOpen(open)
                if (!open) resetForm()
              }}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Cidade
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>{editingCity ? "Editar Cidade" : "Nova Cidade"}</DialogTitle>
                  <DialogDescription>
                    {editingCity ? "Edite as informações da cidade" : "Adicione uma nova cidade ao sistema"}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Nome</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Descrição</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="image">URL da Imagem</Label>
                      <Input
                        id="image"
                        type="url"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">{editingCity ? "Atualizar" : "Criar"}</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Lista de Cidades</CardTitle>
              <CardDescription>Gerencie todas as cidades disponíveis no sistema</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner />
                </div>
              ) : cities.length === 0 ? (
                <EmptyState
                  type="cities"
                  icon={MapPin}
                  title="Nenhuma cidade encontrada"
                  description="Adicione a primeira cidade ao sistema"
                />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Hotéis</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cities.map((city) => (
                      <TableRow key={city.id}>
                        <TableCell className="font-medium">{city.name}</TableCell>
                        <TableCell className="max-w-xs truncate">{city.description || "Sem descrição"}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleEdit(city)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDelete(city.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminRoute>
  )
}
