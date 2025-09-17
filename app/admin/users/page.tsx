"use client"

import { AdminRoute } from "@/components/AdminRoute"
import { PageHeader } from "@/components/PageHeader"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Shield, User, Filter } from "lucide-react"
import { useEffect, useState } from "react"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { EmptyState } from "@/components/EmptyState"
import { api } from "@/lib/api"
import type { User as UserType } from "@/types"
import { useToast } from "@/hooks/use-toast"

export default function AdminUsers() {
  const [users, setUsers] = useState<UserType[]>([])
  const [loading, setLoading] = useState(true)
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const { toast } = useToast()

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const data = await api.getAllUsers()
      setUsers(data)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar usuários",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const updateUserRole = async (userId: string, role: string) => {
    try {
      await api.updateUserRole(userId, role)
      toast({
        title: "Sucesso",
        description: "Papel do usuário atualizado",
      })
      loadUsers()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar papel do usuário",
        variant: "destructive",
      })
    }
  }

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      ADMIN: { label: "Administrador", variant: "default" as const, icon: Shield },
      USER: { label: "Usuário", variant: "secondary" as const, icon: User },
    }

    const config = roleConfig[role as keyof typeof roleConfig] || {
      label: role,
      variant: "outline" as const,
      icon: User,
    }

    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  const filteredUsers = users.filter((user) => {
    if (roleFilter === "all") return true
    return user.role === roleFilter
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-AO")
  }

  return (
    <AdminRoute>
      <div className="min-h-screen bg-background pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <PageHeader title="Gerenciar Usuários" description="Visualize e gerencie todos os usuários do sistema" />

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="USER">Usuários</SelectItem>
                    <SelectItem value="ADMIN">Administradores</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{users.length}</div>
                <p className="text-xs text-muted-foreground">Usuários registrados</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Administradores</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{users.filter((u) => u.role === "ADMIN").length}</div>
                <p className="text-xs text-muted-foreground">Com privilégios admin</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Usuários Comuns</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{users.filter((u) => u.role === "USER").length}</div>
                <p className="text-xs text-muted-foreground">Usuários regulares</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Lista de Usuários</CardTitle>
              <CardDescription>
                {filteredUsers.length} usuário(s) encontrado(s)
                {roleFilter !== "all" && ` com papel "${roleFilter}"`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner />
                </div>
              ) : filteredUsers.length === 0 ? (
                <EmptyState
                  icon={Users}
                  title="Nenhum usuário encontrado"
                  description={
                    roleFilter === "all"
                      ? "Ainda não há usuários no sistema"
                      : `Nenhum usuário com papel "${roleFilter}"`
                  }
                />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Papel</TableHead>
                      <TableHead>Data de Cadastro</TableHead>
                      <TableHead>Reservas</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{getRoleBadge(user.role)}</TableCell>
                        <TableCell>{formatDate(user.createdAt)}</TableCell>
                        <TableCell>{user.reservations?.length || 0}</TableCell>
                        <TableCell className="text-right">
                          <Select value={user.role} onValueChange={(role) => updateUserRole(user.id, role)}>
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="USER">Usuário</SelectItem>
                              <SelectItem value="ADMIN">Admin</SelectItem>
                            </SelectContent>
                          </Select>
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
