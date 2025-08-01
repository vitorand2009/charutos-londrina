"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Navigation } from "@/components/navigation"
import { Package, Play, History, Star, Plus, Flame } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { TastingDialog } from "@/components/tasting-dialog"

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalCharutos: 0,
    degustacoes: 0,
    mediaNotas: 0,
    charutoFavorito: "Nenhum",
  })

  const [charutosDisponiveis, setCharutosDisponiveis] = useState<any[]>([])
  const [isAddCharutoDialogOpen, setIsAddCharutoDialogOpen] = useState(false)
  const [isStartTastingDialogOpen, setIsStartTastingDialogOpen] = useState(false)
  const [selectedSabores, setSelectedSabores] = useState<string[]>([])
  const [recomendacoes, setRecomendacoes] = useState<any[]>([])
  const [selectedCharutoForTasting, setSelectedCharutoForTasting] = useState<any>(null)
  const [isTastingDialogOpen, setIsTastingDialogOpen] = useState(false)

  // Form data para adicionar charuto
  const [formData, setFormData] = useState({
    nome: "",
    marca: "",
    paisOrigem: "",
    preco: 0,
    quantidade: 1,
    dataCompra: new Date().toISOString().split("T")[0],
    foto: "",
  })

  useEffect(() => {
    // Carregar estatísticas
    const estoque = JSON.parse(localStorage.getItem("charutos-estoque") || "[]")
    const historico = JSON.parse(localStorage.getItem("charutos-historico") || "[]")
    const degustacao = JSON.parse(localStorage.getItem("charutos-degustacao") || "[]")

    const totalCharutos = estoque.reduce((acc: number, c: any) => acc + c.quantidade, 0)
    const degustacoes = historico.length
    const mediaNotas =
      historico.length > 0
        ? (historico.reduce((acc: number, c: any) => acc + (c.avaliacao || 0), 0) / historico.length).toFixed(1)
        : 0

    // Encontrar charuto favorito (maior avaliação)
    const favorito =
      historico.length > 0
        ? historico.reduce((prev: any, current: any) =>
            (prev.avaliacao || 0) > (current.avaliacao || 0) ? prev : current,
          )
        : null

    setStats({
      totalCharutos,
      degustacoes,
      mediaNotas: Number(mediaNotas),
      charutoFavorito: favorito ? favorito.nome : "Nenhum",
    })

    // Charutos disponíveis para degustação
    setCharutosDisponiveis(estoque.filter((c: any) => c.quantidade > 0))
  }, [])

  const sabores = ["Tabaco", "Pimenta", "Terroso", "Flores", "Café", "Frutas", "Chocolate", "Castanhas", "Madeira"]

  const toggleSabor = (sabor: string) => {
    setSelectedSabores((prev) => {
      const newSabores = prev.includes(sabor) ? prev.filter((s) => s !== sabor) : [...prev, sabor]

      // Buscar recomendações quando sabores mudarem
      if (newSabores.length > 0) {
        const historico = JSON.parse(localStorage.getItem("charutos-historico") || "[]")
        const recomendacoesEncontradas = historico
          .filter(
            (charuto: any) =>
              charuto.sabores && charuto.sabores.some((s: string) => newSabores.includes(s)) && charuto.avaliacao >= 7,
          )
          .sort((a: any, b: any) => (b.avaliacao || 0) - (a.avaliacao || 0))
          .slice(0, 3)

        setRecomendacoes(recomendacoesEncontradas)
      } else {
        setRecomendacoes([])
      }

      return newSabores
    })
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleAddCharuto = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.nome || !formData.marca) {
      alert("Nome e marca são obrigatórios!")
      return
    }

    const novoCharuto = {
      ...formData,
      id: Date.now().toString(),
    }

    const estoque = JSON.parse(localStorage.getItem("charutos-estoque") || "[]")
    localStorage.setItem("charutos-estoque", JSON.stringify([...estoque, novoCharuto]))

    setFormData({
      nome: "",
      marca: "",
      paisOrigem: "",
      preco: 0,
      quantidade: 1,
      dataCompra: new Date().toISOString().split("T")[0],
      foto: "",
    })
    setIsAddCharutoDialogOpen(false)
    alert("Charuto adicionado ao estoque!")

    // Recarregar dados
    window.location.reload()
  }

  const handleStartTastingFromDashboard = (charuto: any) => {
    setSelectedCharutoForTasting(charuto)
    setIsStartTastingDialogOpen(false)
    setIsTastingDialogOpen(true)
  }

  const handleStartTasting = (tastingData: any) => {
    if (!selectedCharutoForTasting) return

    // Reduzir quantidade no estoque
    const estoque = JSON.parse(localStorage.getItem("charutos-estoque") || "[]")
    const estoqueAtualizado = estoque.map((c: any) =>
      c.id === selectedCharutoForTasting.id ? { ...c, quantidade: c.quantidade - 1 } : c,
    )
    localStorage.setItem("charutos-estoque", JSON.stringify(estoqueAtualizado))

    // Adicionar à degustação
    const charutoDegustacao = {
      id: Date.now().toString(),
      ...tastingData,
    }

    const savedTasting = localStorage.getItem("charutos-degustacao")
    const tastingList = savedTasting ? JSON.parse(savedTasting) : []
    localStorage.setItem("charutos-degustacao", JSON.stringify([...tastingList, charutoDegustacao]))

    alert("Degustação iniciada!")
    setSelectedCharutoForTasting(null)

    // Recarregar dados
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-orange-50">
      <Navigation />

      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Visão geral das suas degustações</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Charutos</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalCharutos}</p>
                  <p className="text-xs text-gray-500">Charutos no estoque</p>
                </div>
                <Package className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Degustações</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.degustacoes}</p>
                  <p className="text-xs text-gray-500">Total realizadas</p>
                </div>
                <Play className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Média de Notas</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.mediaNotas}</p>
                  <p className="text-xs text-gray-500">Avaliação média</p>
                </div>
                <Star className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Charuto Favorito</p>
                  <p className="text-xl font-bold text-gray-900">{stats.charutoFavorito}</p>
                  <p className="text-xs text-gray-500">Melhor avaliado</p>
                </div>
                <Flame className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bem-vindo ao Momentos Charutos */}
          <Card className="bg-white border-0 shadow-sm">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-xl font-semibold text-gray-900">Bem-vindo ao Momentos Charutos</CardTitle>
              <CardDescription className="text-gray-600">
                Seu aplicativo para gerenciar e avaliar degustações de charutos
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <Link href="/estoque">
                  <div className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <Package className="h-5 w-5 text-orange-500 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">Gerencie seu Estoque</p>
                      <p className="text-sm text-gray-600">Adicione e organize seus charutos</p>
                    </div>
                  </div>
                </Link>

                <Link href="/degustacao">
                  <div className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <Play className="h-5 w-5 text-orange-500 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">Avalie Degustações</p>
                      <p className="text-sm text-gray-600">Registre suas experiências detalhadamente</p>
                    </div>
                  </div>
                </Link>

                <Link href="/historico">
                  <div className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <History className="h-5 w-5 text-orange-500 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">Acompanhe o Histórico</p>
                      <p className="text-sm text-gray-600">Revise suas avaliações anteriores</p>
                    </div>
                  </div>
                </Link>

                {/* Botões de Ação Rápida */}
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-sm font-medium text-gray-700 mb-3">Ações Rápidas</p>
                  <div className="flex gap-3">
                    <Button
                      className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                      onClick={() => setIsAddCharutoDialogOpen(true)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar ao Estoque
                    </Button>
                    <Button
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                      onClick={() => setIsStartTastingDialogOpen(true)}
                    >
                      <Flame className="w-4 h-4 mr-2" />
                      Iniciar Degustação
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sistema de Recomendação */}
          <Card className="bg-white border-0 shadow-sm">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-xl font-semibold text-gray-900">Sistema de Recomendação</CardTitle>
              <CardDescription className="text-gray-600">
                Selecione sabores para ver recomendações baseadas no seu histórico
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">Sabores Desejados</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {sabores.map((sabor) => (
                      <Button
                        key={sabor}
                        variant={selectedSabores.includes(sabor) ? "default" : "outline"}
                        className={`h-10 text-xs ${
                          selectedSabores.includes(sabor)
                            ? "bg-orange-500 hover:bg-orange-600 text-white"
                            : "border-orange-200 text-gray-700 hover:bg-orange-50 hover:border-orange-300"
                        }`}
                        onClick={() => toggleSabor(sabor)}
                      >
                        {sabor}
                      </Button>
                    ))}
                  </div>
                </div>

                {recomendacoes.length > 0 && (
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-sm font-medium text-gray-700 mb-3">Recomendações Baseadas no Seu Histórico</p>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {recomendacoes.map((charuto) => (
                        <div
                          key={charuto.id}
                          className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200"
                        >
                          <div>
                            <p className="text-sm font-medium text-gray-900">{charuto.nome}</p>
                            <p className="text-xs text-gray-600">
                              {charuto.marca} - Avaliação: {charuto.avaliacao}/10
                            </p>
                            <p className="text-xs text-green-600">Sabores: {charuto.sabores?.join(", ") || "N/A"}</p>
                          </div>
                          <Badge className="bg-green-100 text-green-800">{charuto.avaliacao}/10</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedSabores.length > 0 && recomendacoes.length === 0 && (
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-500 text-center">
                      Nenhuma recomendação encontrada para os sabores selecionados. Continue degustando para melhorar as
                      recomendações!
                    </p>
                  </div>
                )}

                {/* Charutos Disponíveis */}
                {charutosDisponiveis.length > 0 && (
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-sm font-medium text-gray-700 mb-3">
                      Charutos Disponíveis ({charutosDisponiveis.length})
                    </p>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {charutosDisponiveis.slice(0, 3).map((charuto) => (
                        <div key={charuto.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{charuto.nome}</p>
                            <p className="text-xs text-gray-600">{charuto.marca}</p>
                          </div>
                          <Badge variant="secondary">{charuto.quantidade}</Badge>
                        </div>
                      ))}
                    </div>
                    {charutosDisponiveis.length > 3 && (
                      <Link href="/estoque">
                        <Button variant="ghost" className="w-full mt-2 text-orange-600 hover:text-orange-700">
                          Ver todos ({charutosDisponiveis.length})
                        </Button>
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialog para adicionar charuto */}
      <Dialog open={isAddCharutoDialogOpen} onOpenChange={setIsAddCharutoDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Charuto</DialogTitle>
            <DialogDescription>Preencha as informações do charuto</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddCharuto} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nome">Nome *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => handleInputChange("nome", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="marca">Marca *</Label>
                <Input
                  id="marca"
                  value={formData.marca}
                  onChange={(e) => handleInputChange("marca", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="paisOrigem">País de Origem</Label>
                <Input
                  id="paisOrigem"
                  value={formData.paisOrigem}
                  onChange={(e) => handleInputChange("paisOrigem", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="dataCompra">Data da Compra</Label>
                <Input
                  id="dataCompra"
                  type="date"
                  value={formData.dataCompra}
                  onChange={(e) => handleInputChange("dataCompra", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="preco">Preço (R$)</Label>
                <Input
                  id="preco"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.preco}
                  onChange={(e) => handleInputChange("preco", Number.parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label htmlFor="quantidade">Quantidade</Label>
                <Input
                  id="quantidade"
                  type="number"
                  min="0"
                  value={formData.quantidade}
                  onChange={(e) => handleInputChange("quantidade", Number.parseInt(e.target.value) || 0)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="foto">Foto do Charuto</Label>
              <Input
                id="foto"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    const reader = new FileReader()
                    reader.onload = (e) => {
                      handleInputChange("foto", e.target?.result as string)
                    }
                    reader.readAsDataURL(file)
                  }
                }}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddCharutoDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
                Adicionar Charuto
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog para selecionar charuto para degustação */}
      <Dialog open={isStartTastingDialogOpen} onOpenChange={setIsStartTastingDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Selecionar Charuto para Degustação</DialogTitle>
            <DialogDescription>Escolha um charuto disponível no seu estoque</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {charutosDisponiveis.length === 0 ? (
              <p className="text-center text-gray-500 py-4">Nenhum charuto disponível no estoque</p>
            ) : (
              charutosDisponiveis.map((charuto) => (
                <div
                  key={charuto.id}
                  className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleStartTastingFromDashboard(charuto)}
                >
                  <div>
                    <p className="font-medium text-gray-900">{charuto.nome}</p>
                    <p className="text-sm text-gray-600">{charuto.marca}</p>
                  </div>
                  <Badge variant="secondary">{charuto.quantidade}</Badge>
                </div>
              ))
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStartTastingDialogOpen(false)}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de degustação */}
      <TastingDialog
        charuto={selectedCharutoForTasting}
        isOpen={isTastingDialogOpen}
        onClose={() => setIsTastingDialogOpen(false)}
        onStartTasting={handleStartTasting}
      />
    </div>
  )
}
