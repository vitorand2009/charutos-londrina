"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { Package, Play, History, Star, Plus, Flame } from "lucide-react"

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalCharutos: 0,
    degustacoes: 0,
    mediaNotas: 0,
    charutoFavorito: "Nenhum",
  })

  const [charutosDisponiveis, setCharutosDisponiveis] = useState<any[]>([])

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
                  <p className="text-xs text-gray-500">0 degustações</p>
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
                    <Link href="/estoque" className="flex-1">
                      <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar ao Estoque
                      </Button>
                    </Link>
                    <Link href="/degustacao" className="flex-1">
                      <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                        <Flame className="w-4 h-4 mr-2" />
                        Iniciar Degustação
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Roda de Sabores */}
          <Card className="bg-white border-0 shadow-sm">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-xl font-semibold text-gray-900">Roda de Sabores</CardTitle>
              <CardDescription className="text-gray-600">
                Selecione sabores para ver recomendações do estoque
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-3 gap-3">
                {sabores.map((sabor) => (
                  <Button
                    key={sabor}
                    variant="outline"
                    className="h-12 border-orange-200 text-gray-700 hover:bg-orange-50 hover:border-orange-300 bg-transparent"
                  >
                    {sabor}
                  </Button>
                ))}
              </div>

              {/* Charutos Disponíveis */}
              {charutosDisponiveis.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-100">
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
