"use client"

import { Coffee, Calendar, Star, Clock, User, Scissors, Wind } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const mockHistorico = [
  {
    id: 1,
    charuto: "Cohiba Robusto",
    data: "29/07/2025",
    duracao: 180,
    nota: 9,
    momento: "Sozinho",
    tipoCorte: "Reto",
    fluxo: "Médio",
    comprarNovamente: "Sim",
    sabores: ["Tabaco", "Chocolate", "Café", "Terroso"],
    observacoes: "Excelente charuto, construção perfeita e sabores bem equilibrados.",
    construcaoQueima: "Construção sólida, queima uniforme, boa tiragem.",
  },
]

export default function HistoricoPage() {
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`
  }

  const getNotaColor = (nota: number) => {
    if (nota >= 8) return "bg-green-100 text-green-800"
    if (nota >= 6) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  const getComprarColor = (resposta: string) => {
    switch (resposta) {
      case "Sim":
        return "bg-green-100 text-green-800"
      case "Não":
        return "bg-red-100 text-red-800"
      default:
        return "bg-yellow-100 text-yellow-800"
    }
  }

  return (
    <div className="min-h-screen bg-orange-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Coffee className="h-8 w-8 text-orange-600" />
              <span className="text-xl font-bold text-gray-900">Charutos Londrina</span>
            </div>
            <nav className="flex space-x-1">
              <Link href="/">
                <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                  Dashboard
                </Button>
              </Link>
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
              <Button variant="default" className="bg-orange-600 hover:bg-orange-700">
                Histórico
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Histórico de Degustações</h1>
          <p className="text-gray-600 mt-1">Revise suas experiências anteriores com charutos</p>
        </div>

        <div className="space-y-6">
          {mockHistorico.map((degustacao) => (
            <Card key={degustacao.id} className="bg-white">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl text-gray-900">{degustacao.charuto}</CardTitle>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{degustacao.data}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{formatDuration(degustacao.duracao)}</span>
                      </div>
                    </div>
                  </div>
                  <Badge className={getNotaColor(degustacao.nota)}>
                    <Star className="h-3 w-3 mr-1" />
                    {degustacao.nota}/10
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">Momento</p>
                      <p className="text-sm font-medium">{degustacao.momento}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Scissors className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">Corte</p>
                      <p className="text-sm font-medium">{degustacao.tipoCorte}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Wind className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">Fluxo</p>
                      <p className="text-sm font-medium">{degustacao.fluxo}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Compraria Novamente</p>
                    <Badge className={getComprarColor(degustacao.comprarNovamente)}>
                      {degustacao.comprarNovamente}
                    </Badge>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Sabores Identificados</h4>
                  <div className="flex flex-wrap gap-2">
                    {degustacao.sabores.map((sabor) => (
                      <Badge key={sabor} variant="outline" className="text-orange-700 border-orange-200">
                        {sabor}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">Construção e Queima</h4>
                  <p className="text-sm text-gray-600">{degustacao.construcaoQueima}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">Observações</h4>
                  <p className="text-sm text-gray-600">{degustacao.observacoes}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
