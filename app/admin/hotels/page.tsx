"use client"

import type React from "react"

import { AdminRoute } from "@/components/AdminRoute"
import { PageHeader } from "@/components/PageHeader"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { Plus, Edit, Trash2, Building } from "lucide-react"
import { useEffect, useState } from "react"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { EmptyState } from "@/components/EmptyState"
import { api } from "@/lib/api"
import type { Hotel, City } from "@/types"
import { useToast } from "@/hooks/use-toast"

export default function AdminHotels() {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    pricePerNight: "",
    cityId: "",
    address: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [hotelsData, citiesData] = await Promise.all([api.getHotels(), api.getCities()])
      setHotels(hotelsData)
      setCities(citiesData)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar dados",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const hotelData = {
        ...formData,
        pricePerNight: Number.parseFloat(formData.pricePerNight),
      }

      if (editingHotel) {
        await api.updateHotel(editingHotel.id, hotelData)
        toast({
          title: "Sucesso",
          description: "Hotel atualizado com sucesso",
        })
      } else {
        await api.createHotel(hotelData)
        toast({
          title: "Sucesso",
          description: "Hotel criado com sucesso",
        })
      }

      setDialogOpen(false)
      setEditingHotel(null)
      resetForm()
      loadData()
    } catch (error) {
      toast({
        title: "Erro",
        description: editingHotel ? "Erro ao atualizar hotel" : "Erro ao criar hotel",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (hotel: Hotel) => {
    setEditingHotel(hotel)
    setFormData({
      name: hotel.name,
      description: hotel.description || "",
      image: hotel.image || "",
      pricePerNight: hotel.pricePerNight.toString(),
      cityId: hotel.cityId,
      address: hotel.address || "",
    })
    setDialogOpen(true)
  }

  const handleDelete = async (hotelId: string) => {
    if (!confirm("Tem certeza que deseja excluir este hotel?")) return

    try {
      await api.deleteHotel(hotelId)
      toast({
        title: "Sucesso",
        description: "Hotel excluído com sucesso",
      })
      loadData()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir hotel",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setEditingHotel(null)
    setFormData({
      name: "",
      description: "",
      image: "",
      pricePerNight: "",
      cityId: "",
      address: "",
    })
  }

  const getCityName = (cityId: string) => {
    const city = cities.find((c) => c.id === cityId)
    return city?.name || "Cidade não encontrada"
  }

  return (
    <AdminRoute>
      <div className="min-h-screen bg-background pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <PageHeader title="Gerenciar Hotéis" description="Adicione, edite ou remova hotéis do sistema" />

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
                  Novo Hotel
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>{editingHotel ? "Editar Hotel" : "Novo Hotel"}</DialogTitle>
                  <DialogDescription>
                    {editingHotel ? "Edite as informações do hotel" : "Adicione um novo hotel ao sistema"}
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
                      <Label htmlFor="cityId">Cidade</Label>
                      <Select
                        value={formData.cityId}
                        onValueChange={(value) => setFormData({ ...formData, cityId: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma cidade" />
                        </SelectTrigger>
                        <SelectContent>
                          {cities.map((city) => (
                            <SelectItem key={city.id} value={city.id}>
                              {city.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="address">Endereço</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="pricePerNight">Preço por Noite (Kz)</Label>
                      <Input
                        id="pricePerNight"
                        type="number"
                        step="0.01"
                        value={formData.pricePerNight}
                        onChange={(e) => setFormData({ ...formData, pricePerNight: e.target.value })}
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
                    <Button type="submit">{editingHotel ? "Atualizar" : "Criar"}</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Lista de Hotéis</CardTitle>
              <CardDescription>Gerencie todos os hotéis disponíveis no sistema</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner />
                </div>
              ) : hotels.length === 0 ? (
                <EmptyState
                  icon={Building}
                  title="Nenhum hotel encontrado"
                  description="Adicione o primeiro hotel ao sistema"
                />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Cidade</TableHead>
                      <TableHead>Preço/Noite</TableHead>
                      <TableHead>Endereço</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {hotels.map((hotel) => (
                      <TableRow key={hotel.id}>
                        <TableCell className="font-medium">{hotel.name}</TableCell>
                        <TableCell>{getCityName(hotel.cityId)}</TableCell>
                        <TableCell>{hotel.pricePerNight.toLocaleString("pt-AO")} Kz</TableCell>
                        <TableCell className="max-w-xs truncate">{hotel.address || "Não informado"}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleEdit(hotel)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDelete(hotel.id)}>
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
