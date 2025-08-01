"use client"

import { useState } from "react"
import { Coffee, Search, Package, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AddCigarModal } from "@/components/add-cigar-modal"
import Link from "next/link"

export default function EstoquePage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

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
              <Button variant="default" className="bg-orange-600 hover:bg-orange-700">
                Estoque
              </Button>
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Estoque de Charutos</h1>
            <p className="text-gray-600 mt-1">Gerencie sua coleção de charutos</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="bg-orange-600 hover:bg-orange-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Charuto
          </Button>
        </div>

        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input placeholder="Buscar por nome, país ou bitola..." className="pl-10 bg-white border-gray-200 h-12" />
        </div>

        <div className="flex flex-col items-center justify-center py-16">
          <Package className="h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum charuto encontrado</h3>
          <p className="text-gray-500">Adicione seu primeiro charuto ao estoque</p>
        </div>
      </main>

      <AddCigarModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
