"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navigation } from "@/components/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Edit, Trash2, Search, Star, History, Clock, Award } from "lucide-react"

interface CharutoHistorico {
  id: string
  charuteId: string
  nome: string
  marca: string
  origem: string
  vitola: string
  dataInicio: string
  dataFim?: string
  status: string
  notas?: string
  avaliacao?: number
  tempoFumado?: number
}

export default function HistoricoPage() {
  const [historico, setHistorico] = useState<CharutoHistorico[]>([])
  const [filteredHistorico, setFilteredHistorico] = useState<CharutoHistorico[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterAvaliacao, setFilterAvaliacao] = useState<string>("all")
  const [selectedCharuto, setSelectedCharuto] = useState<CharutoHistorico | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editNotas, setEditNotas] = useState("")
  const [editAvaliacao, setEditAvaliacao] = useState<number>(5)

  useEffect(() => {
    const savedHistory = localStorage.getItem("charutos-historico")
    if (savedHistory) {
      const historyData = JSON.parse(savedHistory)
      setHistorico(historyData)
      setFilteredHistorico(historyData)
    }
  }, [])

  useEffect(() => {
    let filtered = historico

    if (searchTerm) {
      filtered = filtered.filter(
        (charuto) =>
          charuto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          charuto.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
          charuto.origem?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          charuto.notas?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (filterAvaliacao !== "all") {
      const avaliacaoNum = Number.parseInt(filterAvaliacao)
      filtered = filtered.filter((charuto) => charuto.avaliacao === avaliacaoNum)
    }

    filtered.sort(
      (a, b) => new Date(b.dataFim || b.dataInicio).getTime() - new Date(a.dataFim || a.dataInicio).getTime(),
    )

    setFilteredHistorico(filtered)
  }, [historico, searchTerm, filterAvaliacao])

  const handleEdit = (charuto: CharutoHistorico) => {
    setSelectedCharuto(charuto)
    setEditNotas(charuto.notas || "")
    setEditAvaliacao(charuto.avaliacao || 5)
    setIsEditDialogOpen(true)
  }

  const handleSaveEdit = () => {
    if (!selectedCharuto) return

    const updatedCharuto = {
      ...selectedCharuto,
      notas: editNotas,
      avaliacao: editAvaliacao,
    }

    const updatedHistorico = historico.map((c) => (c.id === selectedCharuto.id ? updatedCharuto : c))
    setHistorico(updatedHistorico)
    localStorage.setItem("charutos-historico", JSON.stringify(updatedHistorico))

    const savedTasting = localStorage.getItem("charutos-degustacao")
    if (savedTasting) {
      const tastingList = JSON.parse(savedTasting)
      const updatedTasting = tastingList.map((c: CharutoHistorico) =>
        c.id === selectedCharuto.id ? updatedCharuto : c,
      )
      localStorage.setItem("charutos-degustacao", JSON.stringify(updatedTasting))
    }

    setIsEditDialogOpen(false)
    setSelectedCharuto(null)
  }

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este registro do histórico?")) {
      const updatedHistorico = historico.filter((c) => c.id !== id)
      setHistorico(updatedHistorico)
      localStorage.setItem("charutos-historico", JSON.stringify(updatedHistorico))
    }
  }

  const getAvaliacaoColor = (avaliacao?: number) => {
    if (!avaliacao) return "bg-gray-100 text-gray-800"
    if (avaliacao <= 3) return "bg-red-100 text-red-800"
    if (avaliacao <= 5) return "bg-yellow-100 text-yellow-800"
    if (avaliacao <= 7) return "bg-blue-100 text-blue-800"
    if (avaliacao <= 9) return "bg-green-100 text-green-800"
    return "bg-purple-100 text-purple-800"
  }

  const getAvaliacaoText = (avaliacao?: number) => {
    if (!avaliacao) return "N/A"
    if (avaliacao <= 3) return "Ruim"
    if (avaliacao <= 5) return "Regular"
    if (avaliacao <= 7) return "Bom"
    if (avaliacao <= 9) return "Muito Bom"
    return "Excelente"
  }

  const tempoMedio =
    historico.length > 0
      ? Math.round(historico.reduce((acc, c) => acc + (c.tempoFumado || 0), 0) / historico.length)
      : 0

  const avaliacaoMedia =
    historico.length > 0
      ? (historico.reduce((acc, c) => acc + (c.avaliacao || 0), 0) / historico.length).toFixed(1)
      : "0.0"

  return (
    <div className="min-h-screen bg-orange-50">
      <Navigation />

      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Histórico</h1>
          <p className="text-gray-600">Revise suas avaliações anteriores</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Degustações</p>
                  <p className="text-3xl font-bold text-gray-900">{historico.length}</p>
                  <p className="text-xs text-gray-500">Registradas</p>
                </div>
                <History className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tempo Médio</p>
                  <p className="text-3xl font-bold text-gray-900">{tempoMedio}</p>
                  <p className="text-xs text-gray-500">Minutos</p>
                </div>
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avaliação Média</p>
                  <p className="text-3xl font-bold text-gray-900">{avaliacaoMedia}</p>
                  <p className="text-xs text-gray-500">De 10</p>
                </div>
                <Award className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Melhor Avaliação</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {historico.length > 0 ? Math.max(...historico.map((c) => c.avaliacao || 0)) : 0}
                  </p>
                  <p className="text-xs text-gray-500">Pontos</p>
                </div>
                <Star className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card className="bg-white border-0 shadow-sm mb-8">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-xl font-semibold text-gray-900">Filtros</CardTitle>
            <CardDescription className="text-gray-600">Encontre degustações específicas</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <Label htmlFor="search">Buscar</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Buscar por nome, marca, origem ou notas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="min-w-[150px]">
                <Label htmlFor="filter-avaliacao">Filtrar por Avaliação</Label>
                <Select value={filterAvaliacao} onValueChange={setFilterAvaliacao}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="10">10 - Excelente</SelectItem>
                    <SelectItem value="9">9 - Muito Bom</SelectItem>
                    <SelectItem value="8">8 - Muito Bom</SelectItem>
                    <SelectItem value="7">7 - Bom</SelectItem>
                    <SelectItem value="6">6 - Bom</SelectItem>
                    <SelectItem value="5">5 - Regular</SelectItem>
                    <SelectItem value="4">4 - Regular</SelectItem>
                    <SelectItem value="3">3 - Ruim</SelectItem>
                    <SelectItem value="2">2 - Ruim</SelectItem>
                    <SelectItem value="1">1 - Ruim</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista do Histórico */}
        <Card className="bg-white border-0 shadow-sm">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-xl font-semibold text-gray-900">
              Suas Degustações ({filteredHistorico.length})
            </CardTitle>
            <CardDescription className="text-gray-600">Histórico completo de experiências</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {filteredHistorico.length === 0 ? (
              <div className="text-center py-12">
                <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">
                  {historico.length === 0
                    ? "Nenhuma degustação no histórico ainda"
                    : "Nenhum resultado encontrado para os filtros aplicados"}
                </p>
                <p className="text-sm text-gray-500">
                  {historico.length === 0
                    ? "Suas degustações finalizadas aparecerão aqui"
                    : "Tente ajustar os filtros de busca"}
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredHistorico.map((charuto) => (
                  <Card key={charuto.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg font-semibold text-gray-900">{charuto.nome}</CardTitle>
                          <CardDescription className="text-gray-600">{charuto.marca}</CardDescription>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(charuto)}>
                            <Edit className="w-4 h-4 text-gray-500" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(charuto.id)}>
                            <Trash2 className="w-4 h-4 text-gray-500" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        {charuto.origem && (
                          <p className="text-sm text-gray-600">
                            <strong>Origem:</strong> {charuto.origem}
                          </p>
                        )}
                        {charuto.vitola && (
                          <p className="text-sm text-gray-600">
                            <strong>Vitola:</strong> {charuto.vitola}
                          </p>
                        )}

                        <div className="flex items-center gap-2">
                          <strong className="text-sm text-gray-600">Avaliação:</strong>
                          <Badge className={getAvaliacaoColor(charuto.avaliacao)}>
                            <Star className="w-3 h-3 mr-1" />
                            {charuto.avaliacao}/10 - {getAvaliacaoText(charuto.avaliacao)}
                          </Badge>
                        </div>

                        {charuto.tempoFumado && (
                          <p className="text-sm text-gray-600">
                            <strong>Tempo fumado:</strong> {charuto.tempoFumado} min
                          </p>
                        )}

                        <p className="text-sm text-gray-600">
                          <strong>Data:</strong>{" "}
                          {charuto.dataFim
                            ? new Date(charuto.dataFim).toLocaleDateString("pt-BR")
                            : new Date(charuto.dataInicio).toLocaleDateString("pt-BR")}
                        </p>

                        {charuto.notas && (
                          <div>
                            <strong className="text-sm text-gray-600">Notas:</strong>
                            <p className="text-sm text-gray-500 mt-1 line-clamp-3">{charuto.notas}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dialog para editar */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Degustação</DialogTitle>
              <DialogDescription>Edite as informações da degustação de {selectedCharuto?.nome}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-avaliacao">Avaliação (1-10)</Label>
                <Select
                  value={editAvaliacao.toString()}
                  onValueChange={(value) => setEditAvaliacao(Number.parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} - {getAvaliacaoText(num)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-notas">Notas da Degustação</Label>
                <Textarea
                  id="edit-notas"
                  value={editNotas}
                  onChange={(e) => setEditNotas(e.target.value)}
                  placeholder="Descreva sua experiência: sabores, aromas, construção, queima..."
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveEdit} className="bg-orange-500 hover:bg-orange-600">
                Salvar Alterações
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
