"use client"

import { useState } from "react"
import { Coffee, Play, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { StartTastingModal } from "@/components/start-tasting-modal"
import { FinishTastingModal } from "@/components/finish-tasting-modal"
import Link from "next/link"

const mockActiveTastings = [
  {
    id: 1,
    charuto: "Cohiba Robusto",
    startTime: new Date(Date.now() - 3 * 60 * 60 * 1000),
    momento: "Sozinho",
    tipoCorte: "Reto",
    fluxo: "Médio",
    data: "30/07/2025",
  },
]

export default function DegustacaoPage() {
  const [isStartModalOpen, setIsStartModalOpen] = useState(false)
  const [isFinishModalOpen, setIsFinishModalOpen] = useState(false)
  const [selectedTasting, setSelectedTasting] = useState<(typeof mockActiveTastings)[0] | null>(null)
  const [activeTastings, setActiveTastings] = useState(mockActiveTastings)

  const handleStartTasting = (tastingData: any) => {
    const newTasting = {
      id: Date.now(),
      ...tastingData,
      startTime: new Date(),
      data: new Date().toLocaleDateString("pt-BR"),
    }
    setActiveTastings((prev) => [...prev, newTasting])
    setIsStartModalOpen(false)
  }

  const handleFinishTasting = () => {
    if (selectedTasting) {
      setActiveTastings((prev) => prev.filter((t) => t.id !== selectedTasting.id))
    }
    setSelectedTasting(null)
    setIsFinishModalOpen(false)
  }

  const getDurationHours = (startTime: Date) => {
    return Math.floor((Date.now() - startTime.getTime()) / (1000 * 60 * 60))
  }

  const openFinishModal = (tasting: (typeof mockActiveTastings)[0]) => {
    setSelectedTasting(tasting)
    setIsFinishModalOpen(true)
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
              <Button variant="default" className="bg-orange-600 hover:bg-orange-700">
                Degustação
              </Button>
              <Link href="/historico">
                <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                  Histórico
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Degustação de Charutos</h1>
            <p className="text-gray-600 mt-1">Registre suas experiências com charutos</p>
          </div>
          <Button onClick={() => setIsStartModalOpen(true)} className="bg-orange-600 hover:bg-orange-700 text-white">
            <Play className="h-4 w-4 mr-2" />
            Iniciar Degustação
          </Button>
        </div>

        {activeTastings.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <Clock className="h-5 w-5 text-orange-600" />
              <h2 className="text-lg font-semibold text-gray-900">Degustações em Andamento</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeTastings.map((tasting) => (
                <Card key={tasting.id} className="bg-white">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-lg font-bold text-gray-900">{getDurationHours(tasting.startTime)}h</span>
                      <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">Em andamento</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{tasting.charuto}</h3>
                    <p className="text-sm text-gray-600 mb-4">Data: {tasting.data}</p>
                    <Button
                      onClick={() => openFinishModal(tasting)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      Finalizar Degustação
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTastings.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <Clock className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma degustação em andamento</h3>
            <p className="text-gray-500 mb-6">Inicie uma nova degustação para começar a registrar sua experiência</p>
            <Button onClick={() => setIsStartModalOpen(true)} className="bg-orange-600 hover:bg-orange-700 text-white">
              <Play className="h-4 w-4 mr-2" />
              Iniciar Primeira Degustação
            </Button>
          </div>
        )}
      </main>

      <StartTastingModal
        isOpen={isStartModalOpen}
        onClose={() => setIsStartModalOpen(false)}
        onStart={handleStartTasting}
      />
      <FinishTastingModal
        isOpen={isFinishModalOpen}
        onClose={() => setIsFinishModalOpen(false)}
        onFinish={handleFinishTasting}
        activeTasting={selectedTasting}
      />
    </div>
  )
}
