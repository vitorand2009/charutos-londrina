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
import { Square, Clock, Flame } from "lucide-react"

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

  // Carregar dados do localStorage
  useEffect(() => {
    const savedTasting = localStorage.getItem("charutos-degustacao")
    if (savedTasting) {
      setCharutosDegustacao(JSON.parse(savedTasting))
    }
  }, [])

  // Salvar no localStorage sempre que charutosDegustacao mudar
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

    // Atualizar lista de degustação
    setCharutosDegustacao((prev) => prev.map((c) => (c.id === selectedCharuto.id ? charutoFinalizado : c)))

    // Adicionar ao histórico
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
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Degustação de Charutos</h1>

      {/* Charutos em Degustação */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <Flame className="w-6 h-6 mr-2 text-orange-500" />
          Em Degustação ({charutosEmDegustacao.length})
        </h2>

        {charutosEmDegustacao.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">Nenhum charuto em degustação no momento.</p>
              <p className="text-sm text-muted-foreground mt-2">Vá para o estoque e inicie uma degustação!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {charutosEmDegustacao.map((charuto) => (
              <Card key={charuto.id} className="border-orange-200 bg-orange-50">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{charuto.nome}</CardTitle>
                      <CardDescription>{charuto.marca}</CardDescription>
                    </div>
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatarTempo(charuto.dataInicio)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    {charuto.origem && (
                      <p>
                        <strong>Origem:</strong> {charuto.origem}
                      </p>
                    )}
                    {charuto.vitola && (
                      <p>
                        <strong>Vitola:</strong> {charuto.vitola}
                      </p>
                    )}
                    <p>
                      <strong>Iniciado:</strong> {new Date(charuto.dataInicio).toLocaleString("pt-BR")}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1" onClick={() => finalizarDegustacao(charuto)}>
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
      </div>

      {/* Charutos Finalizados Recentemente */}
      {charutosFinalizados.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Finalizados Recentemente</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {charutosFinalizados.slice(0, 6).map((charuto) => (
              <Card key={charuto.id} className="border-green-200 bg-green-50">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{charuto.nome}</CardTitle>
                      <CardDescription>{charuto.marca}</CardDescription>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      ⭐ {charuto.avaliacao}/10
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p>
                      <strong>Tempo fumado:</strong> {charuto.tempoFumado} min
                    </p>
                    <p>
                      <strong>Finalizado:</strong>{" "}
                      {charuto.dataFim ? new Date(charuto.dataFim).toLocaleString("pt-BR") : "N/A"}
                    </p>
                    {charuto.notas && (
                      <p>
                        <strong>Notas:</strong> {charuto.notas.substring(0, 100)}
                        {charuto.notas.length > 100 ? "..." : ""}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
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
            <Button onClick={handleFinalizarDegustacao}>Finalizar Degustação</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
