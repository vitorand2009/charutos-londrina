"use client"

import { useState } from "react"
import { Coffee, Star, Award, Package, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

// Mock data for cigars with flavor profiles
const mockEstoque = [
  {
    id: 1,
    nome: "Cohiba Robusto",
    pais: "Cuba",
    bitola: "50 x 124mm",
    sabores: ["Tabaco", "Chocolate", "Café", "Terroso"],
    nota: 9.2,
    preco: 45.0,
    quantidade: 3,
  },
  {
    id: 2,
    nome: "Montecristo No. 2",
    pais: "Cuba",
    bitola: "52 x 156mm",
    sabores: ["Pimenta", "Madeira", "Flores", "Tabaco"],
    nota: 8.8,
    preco: 38.5,
    quantidade: 2,
  },
  {
    id: 3,
    nome: "Romeo y Julieta Churchill",
    pais: "Cuba",
    bitola: "47 x 178mm",
    sabores: ["Flores", "Frutas", "Tabaco", "Castanhas"],
    nota: 8.5,
    preco: 42.0,
    quantidade: 1,
  },
  {
    id: 4,
    nome: "Davidoff Grand Cru",
    pais: "República Dominicana",
    bitola: "43 x 127mm",
    sabores: ["Chocolate", "Café", "Castanhas", "Madeira"],
    nota: 9.0,
    preco: 55.0,
    quantidade: 4,
  },
]

const saboresDisponiveis = [
  "Tabaco",
  "Pimenta",
  "Terroso",
  "Flores",
  "Café",
  "Frutas",
  "Chocolate",
  "Castanhas",
  "Madeira",
]

export default function Dashboard() {
  const [saboresSelecionados, setSaboresSelecionados] = useState<string[]>([])

  const toggleSabor = (sabor: string) => {
    setSaboresSelecionados((prev) => (prev.includes(sabor) ? prev.filter((s) => s !== sabor) : [...prev, sabor]))
  }

  const getRecomendacoes = () => {
    if (saboresSelecionados.length === 0) return []

    return mockEstoque
      .map((charuto) => {
        const saboresComuns = charuto.sabores.filter((sabor) => saboresSelecionados.includes(sabor)).length
        const compatibilidade = (saboresComuns / saboresSelecionados.length) * 100
        return { ...charuto, compatibilidade, saboresComuns }
      })
      .filter((charuto) => charuto.saboresComuns > 0)
      .sort((a, b) => b.compatibilidade - a.compatibilidade)
      .slice(0, 3)
  }

  const recomendacoes = getRecomendacoes()

  return (
    <div className="min-h-screen bg-orange-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Coffee className="h-8 w-8 text-orange-600" />
              <span className="text-xl font-bold text-gray-900">Charutos Londrina</span>
            </div>
            <nav className="flex space-x-1">
              <Button variant="default" className="bg-orange-600 hover:bg-orange-700">
                Dashboard
              </Button>
              <Link href="/estoque">
                <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                  Estoque
                </Button>
              </Link>
              <Link href="/degustacao">
                <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                  Degustação
                </Button>
              </Link>
              <Link href="/historico">
                <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                  Histórico
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Visão geral das suas degustações</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total de Charutos</CardTitle>
              <Package className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {mockEstoque.reduce((acc, c) => acc + c.quantidade, 0)}
              </div>
              <p className="text-xs text-gray-500">Charutos no estoque</p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Degustações</CardTitle>
              <Coffee className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">0</div>
              <p className="text-xs text-gray-500">Total realizadas</p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Média de Notas</CardTitle>
              <Star className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">0</div>
              <p className="text-xs text-gray-500">Avaliação média</p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Charuto Favorito</CardTitle>
              <Award className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-gray-900">Nenhum</div>
              <p className="text-xs text-gray-500">0 degustações</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Welcome Section */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">Bem-vindo ao Momentos Charutos</CardTitle>
              <p className="text-gray-600">Seu aplicativo para gerenciar e avaliar degustações de charutos</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <Package className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900">Gerencie seu Estoque</h3>
                  <p className="text-sm text-gray-600">Adicione e organize seus charutos</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Coffee className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900">Avalie Degustações</h3>
                  <p className="text-sm text-gray-600">Registre suas experiências detalhadamente</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900">Acompanhe o Histórico</h3>
                  <p className="text-sm text-gray-600">Revise suas avaliações anteriores</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Flavor Wheel Section */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">Roda de Sabores</CardTitle>
              <p className="text-gray-600">Selecione sabores para ver recomendações do estoque</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {saboresDisponiveis.map((sabor) => (
                  <Button
                    key={sabor}
                    onClick={() => toggleSabor(sabor)}
                    variant={saboresSelecionados.includes(sabor) ? "default" : "outline"}
                    className={`h-12 ${
                      saboresSelecionados.includes(sabor)
                        ? "bg-orange-600 hover:bg-orange-700 text-white"
                        : "border-orange-200 text-orange-800 hover:bg-orange-50 bg-transparent"
                    }`}
                  >
                    {sabor}
                  </Button>
                ))}
              </div>

              {saboresSelecionados.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Sabores selecionados: {saboresSelecionados.join(", ")}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recommendations Section */}
        {recomendacoes.length > 0 && (
          <div className="mt-8">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">Recomendações do Estoque</CardTitle>
                <p className="text-gray-600">Charutos que combinam com os sabores selecionados</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recomendacoes.map((charuto) => (
                    <div key={charuto.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900">{charuto.nome}</h3>
                        <Badge className="bg-green-100 text-green-800">
                          {Math.round(charuto.compatibilidade)}% match
                        </Badge>
                      </div>

                      <p className="text-sm text-gray-600 mb-2">
                        {charuto.pais} • {charuto.bitola}
                      </p>

                      <div className="flex items-center space-x-2 mb-3">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm font-medium">{charuto.nota}</span>
                        <span className="text-sm text-gray-500">• R$ {charuto.preco.toFixed(2)}</span>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {charuto.sabores.map((sabor) => (
                          <Badge
                            key={sabor}
                            variant="outline"
                            className={
                              saboresSelecionados.includes(sabor)
                                ? "border-orange-500 text-orange-700 bg-orange-50"
                                : "border-gray-200 text-gray-600"
                            }
                          >
                            {sabor}
                          </Badge>
                        ))}
                      </div>

                      <p className="text-xs text-gray-500">
                        {charuto.quantidade} {charuto.quantidade === 1 ? "unidade" : "unidades"} em estoque
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
