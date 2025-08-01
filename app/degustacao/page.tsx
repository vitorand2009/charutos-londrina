"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Square, Clock, Flame, Play } from "lucide-react"

interface CharutoDegustacao {
  id: string
  charuteId: string
  nome: string
  marca: string
  origem: string
  vitola: string
  dataInicio: string
  dataFim?: string
  status: "em-degustacao" | "finalizado"
  notas?: string
  avaliacao?: number
  tempoFumado?: number
}

export default function DegustacaoPage() {
  const [charutosDegustacao, setCharutosDegustacao] = useState<CharutoDegustacao[]>([])
  const [selectedCharuto, setSelectedCharuto] = useState<CharutoDegustacao | null>(null)
  const [isFinishDialogOpen, setIsFinishDialogOpen] = useState(false)
  const [notas, setNotas] = useState("")
  const [avaliacao, setAvaliacao] = useState<number>(5)

  useEffect(() => {
    const savedTasting = localStorage.getItem("charutos-degustacao")
    if (savedTasting) {
      setCharutosDegustacao(JSON.parse(savedTasting))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("charutos-degustacao", JSON.stringify(charutosDegustacao))
  }, [charutosDegustacao])

  const finalizarDegustacao = (charuto: CharutoDegustacao) => {
    setSelectedCharuto(charuto)
    setNotas(charuto.notas || "")
    setAvaliacao(charuto.avaliacao || 5)
    setIsFinishDialogOpen(true)
  }

  const handleFinalizarDegustacao = () => {
    if (!selectedCharuto) return

    const charutoFinalizado: CharutoDegustacao = {
      ...selectedCharuto,
      status: "finalizado",
      dataFim: new Date().toISOString(),
      notas,
      avaliacao,
      tempoFumado: Math.floor((new Date().getTime() - new Date(selectedCharuto.dataInicio).getTime()) / (1000 * 60)),
    }

    setCharutosDegustacao((prev) => prev.map((c) => (c.id === selectedCharuto.id ? charutoFinalizado : c)))

    const savedHistory = localStorage.getItem("charutos-historico")
    const historyList = savedHistory ? JSON.parse(savedHistory) : []
    localStorage.setItem("charutos-historico", JSON.stringify([...historyList, charutoFinalizado]))

    setIsFinishDialogOpen(false)
    setSelectedCharuto(null)
    setNotas("")
    setAvaliacao(5)
  }

  const removerDaDegustacao = (id: string) => {
    if (confirm("Tem certeza que deseja remover este charuto da degustação?")) {
      setCharutosDegustacao((prev) => prev.filter((c) => c.id !== id))
    }
  }

  const charutosEmDegustacao = charutosDegustacao.filter((c) => c.status === "em-degustacao")
  const charutosFinalizados = charutosDegustacao.filter((c) => c.status === "finalizado")

  const formatarTempo = (dataInicio: string) => {
    const inicio = new Date(dataInicio)
    const agora = new Date()
    const diffMinutos = Math.floor((agora.getTime() - inicio.getTime()) / (1000 * 60))

    if (diffMinutos < 60) {
      return `${diffMinutos} min`
    } else {
      const horas = Math.floor(diffMinutos / 60)
      const minutos = diffMinutos % 60
      return `${horas}h ${minutos}min`
    }
  }

  return (
    <div className="min-h-screen bg-orange-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Degustação</h1>
          <p className="text-gray-600">Acompanhe suas experiências em tempo real</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Em Degustação</p>
                  <p className="text-3xl font-bold text-gray-900">{charutosEmDegustacao.length}</p>
                  <p className="text-xs text-gray-500">Ativos agora</p>
                </div>
                <Play className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Finalizadas</p>
                  <p className="text-3xl font-bold text-gray-900">{charutosFinalizados.length}</p>
                  <p className="text-xs text-gray-500">Hoje</p>
                </div>
                <Square className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tempo Médio</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {charutosFinalizados.length > 0
                      ? Math.round(
                          charutosFinalizados.reduce((acc, c) => acc + (c.tempoFumado || 0), 0) /
                            charutosFinalizados.length,
                        )
                      : 0}
                  </p>
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
                  <p className="text-3xl font-bold text-gray-900">
                    {charutosFinalizados.length > 0
                      ? (
                          charutosFinalizados.reduce((acc, c) => acc + (c.avaliacao || 0), 0) /
                          charutosFinalizados.length
                        ).toFixed(1)
                      : "0.0"}
                  </p>
                  <p className="text-xs text-gray-500">De 10</p>
                </div>
                <Flame className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Em Degustação */}
        <Card className="bg-white border-0 shadow-sm mb-8">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
              <Flame className="w-6 h-6 mr-2 text-orange-500" />
              Em Degustação ({charutosEmDegustacao.length})
            </CardTitle>
            <CardDescription className="text-gray-600">Charutos que você está fumando agora</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {charutosEmDegustacao.length === 0 ? (
              <div className="text-center py-12">
                <Flame className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Nenhum charuto em degustação</p>
                <p className="text-sm text-gray-500">Vá para o estoque e inicie uma degustação!</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {charutosEmDegustacao.map((charuto) => (
                  <Card key={charuto.id} className="border-2 border-orange-200 bg-orange-50">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg font-semibold text-gray-900">{charuto.nome}</CardTitle>
                          <CardDescription className="text-gray-600">{charuto.marca}</CardDescription>
                        </div>
                        <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatarTempo(charuto.dataInicio)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2 mb-4">
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
                        <p className="text-sm text-gray-600">
                          <strong>Iniciado:</strong> {new Date(charuto.dataInicio).toLocaleString("pt-BR")}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                          onClick={() => finalizarDegustacao(charuto)}
                        >
                          <Square className="w-4 h-4 mr-2" />
                          Finalizar
                        </Button>
                        <Button variant="outline" onClick={() => removerDaDegustacao(charuto.id)}>
                          Remover
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Finalizados Recentemente */}
        {charutosFinalizados.length > 0 && (
          <Card className="bg-white border-0 shadow-sm">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-xl font-semibold text-gray-900">Finalizados Recentemente</CardTitle>
              <CardDescription className="text-gray-600">Suas últimas degustações</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {charutosFinalizados.slice(0, 6).map((charuto) => (
                  <Card key={charuto.id} className="border-2 border-green-200 bg-green-50">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg font-semibold text-gray-900">{charuto.nome}</CardTitle>
                          <CardDescription className="text-gray-600">{charuto.marca}</CardDescription>
                        </div>
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          ⭐ {charuto.avaliacao}/10
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">
                          <strong>Tempo fumado:</strong> {charuto.tempoFumado} min
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Finalizado:</strong>{" "}
                          {charuto.dataFim ? new Date(charuto.dataFim).toLocaleString("pt-BR") : "N/A"}
                        </p>
                        {charuto.notas && (
                          <p className="text-sm text-gray-600">
                            <strong>Notas:</strong> {charuto.notas.substring(0, 100)}
                            {charuto.notas.length > 100 ? "..." : ""}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Dialog para finalizar degustação */}
        <Dialog open={isFinishDialogOpen} onOpenChange={setIsFinishDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Finalizar Degustação</DialogTitle>
              <DialogDescription>Como foi sua experiência com {selectedCharuto?.nome}?</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="avaliacao">Avaliação (1-10)</Label>
                <Select value={avaliacao.toString()} onValueChange={(value) => setAvaliacao(Number.parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} -{" "}
                        {num <= 3
                          ? "Ruim"
                          : num <= 5
                            ? "Regular"
                            : num <= 7
                              ? "Bom"
                              : num <= 9
                                ? "Muito Bom"
                                : "Excelente"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="notas">Notas da Degustação</Label>
                <Textarea
                  id="notas"
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  placeholder="Descreva sua experiência: sabores, aromas, construção, queima..."
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsFinishDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleFinalizarDegustacao} className="bg-orange-500 hover:bg-orange-600">
                Finalizar Degustação
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
