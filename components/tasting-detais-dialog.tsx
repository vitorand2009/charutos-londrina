"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock, Star, Scissors, Wind, CheckCircle, X } from "lucide-react"

interface TastingDetailsDialogProps {
  charuto: any
  isOpen: boolean
  onClose: () => void
}

export function TastingDetailsDialog({ charuto, isOpen, onClose }: TastingDetailsDialogProps) {
  if (!charuto) return null

  const getCorteIcon = (corte: string) => {
    switch (corte) {
      case "reto":
        return "✂️"
      case "v":
        return "🔺"
      case "furado":
        return "⚫"
      default:
        return "✂️"
    }
  }

  const getMomentoIcon = (momento: string) => {
    return momento === "sozinho" ? "👤" : "👥"
  }

  const getFluxoColor = (fluxo: string) => {
    switch (fluxo) {
      case "solto":
        return "bg-green-100 text-green-800"
      case "medio":
        return "bg-yellow-100 text-yellow-800"
      case "preso":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
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

  const getComprariaNovamenteColor = (resposta: string) => {
    switch (resposta) {
      case "sim":
        return "bg-green-100 text-green-800"
      case "nao":
        return "bg-red-100 text-red-800"
      case "depende":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatarData = (dataString: string) => {
    return new Date(dataString).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const calcularDuracaoReal = () => {
    if (charuto.dataFim && charuto.dataInicio) {
      const inicio = new Date(charuto.dataInicio)
      const fim = new Date(charuto.dataFim)
      const diffMinutos = Math.floor((fim.getTime() - inicio.getTime()) / (1000 * 60))
      return diffMinutos
    }
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center">🚬 {charuto.nome}</DialogTitle>
          <DialogDescription className="text-lg text-gray-600">{charuto.marca}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Básicas */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Informações Básicas
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">País de Origem:</span>
                <p className="text-gray-900">{charuto.paisOrigem || "Não informado"}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Status:</span>
                <Badge
                  className={
                    charuto.status === "finalizado" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"
                  }
                >
                  {charuto.status === "finalizado" ? "Finalizada" : "Em Degustação"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Configurações da Degustação */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Scissors className="w-4 h-4 mr-2" />
              Configurações da Degustação
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl mb-1">{getCorteIcon(charuto.corte)}</div>
                <span className="text-sm font-medium text-gray-600">Corte</span>
                <p className="text-sm text-gray-900 capitalize">{charuto.corte || "N/A"}</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-1">{getMomentoIcon(charuto.momento)}</div>
                <span className="text-sm font-medium text-gray-600">Momento</span>
                <p className="text-sm text-gray-900 capitalize">{charuto.momento || "N/A"}</p>
              </div>
              <div className="text-center">
                <Badge className={getFluxoColor(charuto.fluxo)}>
                  <Wind className="w-3 h-3 mr-1" />
                  {charuto.fluxo ? charuto.fluxo.charAt(0).toUpperCase() + charuto.fluxo.slice(1) : "N/A"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Cronologia */}
          <div className="bg-orange-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Cronologia
            </h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <div>
                  <span className="font-medium text-gray-600">Iniciado:</span>
                  <p className="text-gray-900">{formatarData(charuto.dataInicio)}</p>
                </div>
              </div>
              {charuto.dataFim && (
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                  <div>
                    <span className="font-medium text-gray-600">Finalizado:</span>
                    <p className="text-gray-900">{formatarData(charuto.dataFim)}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center">
                <Clock className="w-4 h-4 text-gray-500 mr-2" />
                <div>
                  <span className="font-medium text-gray-600">Duração:</span>
                  <p className="text-gray-900">
                    {charuto.duracaoFumo
                      ? `${charuto.duracaoFumo} minutos`
                      : calcularDuracaoReal()
                        ? `${calcularDuracaoReal()} minutos (calculado)`
                        : "Em andamento"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sabores Identificados */}
          {charuto.sabores && charuto.sabores.length > 0 && (
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">🌿 Sabores Identificados</h3>
              <div className="flex flex-wrap gap-2">
                {charuto.sabores.map((sabor: string, index: number) => (
                  <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                    {sabor}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Avaliação Final */}
          {charuto.status === "finalizado" && (
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Star className="w-4 h-4 mr-2" />
                Avaliação Final
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-medium text-gray-600">Nota:</span>
                  <div className="flex items-center mt-1">
                    <Badge className={getAvaliacaoColor(charuto.avaliacao)}>
                      <Star className="w-3 h-3 mr-1" />
                      {charuto.avaliacao}/10
                    </Badge>
                  </div>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Compraria Novamente:</span>
                  <div className="flex items-center mt-1">
                    <Badge className={getComprariaNovamenteColor(charuto.comprariaNovamente)}>
                      {charuto.comprariaNovamente === "sim" && <CheckCircle className="w-3 h-3 mr-1" />}
                      {charuto.comprariaNovamente === "nao" && <X className="w-3 h-3 mr-1" />}
                      {charuto.comprariaNovamente === "depende" && "💰"}
                      {charuto.comprariaNovamente === "sim"
                        ? "Sim"
                        : charuto.comprariaNovamente === "nao"
                          ? "Não"
                          : charuto.comprariaNovamente === "depende"
                            ? "Depende do Preço"
                            : "N/A"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Observações */}
          {charuto.observacoes && (
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">📝 Observações</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{charuto.observacoes}</p>
            </div>
          )}

          {/* Fotos */}
          <div className="grid grid-cols-2 gap-4">
            {charuto.foto && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">📸 Foto do Charuto</h4>
                <img
                  src={charuto.foto || "/placeholder.svg"}
                  alt="Foto do charuto"
                  className="w-full h-32 object-cover rounded-lg"
                />
              </div>
            )}
            {charuto.fotoAnilha && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">🏷️ Foto da Anilha</h4>
                <img
                  src={charuto.fotoAnilha || "/placeholder.svg"}
                  alt="Foto da anilha"
                  className="w-full h-32 object-cover rounded-lg"
                />
              </div>
            )}
          </div>
        </div>

        <Separator />

        <DialogFooter>
          <Button onClick={onClose} className="bg-orange-500 hover:bg-orange-600">
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
