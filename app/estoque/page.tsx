"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Trash2, Edit, Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Charuto {
  id: string
  nome: string
  marca: string
  origem: string
  vitola: string
  anel: string
  comprimento: string
  wrapper: string
  binder: string
  filler: string
  preco: number
  quantidade: number
  observacoes: string
  dataCompra: string
}

export default function EstoquePage() {
  const [charutos, setCharutos] = useState<Charuto[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCharuto, setEditingCharuto] = useState<Charuto | null>(null)
  const [formData, setFormData] = useState<Partial<Charuto>>({
    nome: "",
    marca: "",
    origem: "",
    vitola: "",
    anel: "",
    comprimento: "",
    wrapper: "",
    binder: "",
    filler: "",
    preco: 0,
    quantidade: 1,
    observacoes: "",
    dataCompra: new Date().toISOString().split("T")[0],
  })

  // Carregar dados do localStorage
  useEffect(() => {
    const savedCharutos = localStorage.getItem("charutos-estoque")
    if (savedCharutos) {
      setCharutos(JSON.parse(savedCharutos))
    }
  }, [])

  // Salvar no localStorage sempre que charutos mudar
  useEffect(() => {
    localStorage.setItem("charutos-estoque", JSON.stringify(charutos))
  }, [charutos])

  const handleInputChange = (field: keyof Charuto, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.nome || !formData.marca) {
      alert("Nome e marca são obrigatórios!")
      return
    }

    if (editingCharuto) {
      // Editando charuto existente
      setCharutos((prev) =>
        prev.map((charuto) => (charuto.id === editingCharuto.id ? ({ ...charuto, ...formData } as Charuto) : charuto)),
      )
    } else {
      // Adicionando novo charuto
      const novoCharuto: Charuto = {
        ...(formData as Charuto),
        id: Date.now().toString(),
      }
      setCharutos((prev) => [...prev, novoCharuto])
    }

    // Reset form
    setFormData({
      nome: "",
      marca: "",
      origem: "",
      vitola: "",
      anel: "",
      comprimento: "",
      wrapper: "",
      binder: "",
      filler: "",
      preco: 0,
      quantidade: 1,
      observacoes: "",
      dataCompra: new Date().toISOString().split("T")[0],
    })
    setEditingCharuto(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (charuto: Charuto) => {
    setEditingCharuto(charuto)
    setFormData(charuto)
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este charuto?")) {
      setCharutos((prev) => prev.filter((charuto) => charuto.id !== id))
    }
  }

  const moveToTasting = (charuto: Charuto) => {
    if (charuto.quantidade <= 0) {
      alert("Não há charutos disponíveis para degustação!")
      return
    }

    // Diminuir quantidade no estoque
    setCharutos((prev) => prev.map((c) => (c.id === charuto.id ? { ...c, quantidade: c.quantidade - 1 } : c)))

    // Adicionar à lista de degustação
    const charutoDegustacao = {
      id: Date.now().toString(),
      charuteId: charuto.id,
      nome: charuto.nome,
      marca: charuto.marca,
      origem: charuto.origem,
      vitola: charuto.vitola,
      dataInicio: new Date().toISOString(),
      status: "em-degustacao",
    }

    const savedTasting = localStorage.getItem("charutos-degustacao")
    const tastingList = savedTasting ? JSON.parse(savedTasting) : []
    localStorage.setItem("charutos-degustacao", JSON.stringify([...tastingList, charutoDegustacao]))

    alert("Charuto movido para degustação!")
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Estoque de Charutos</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingCharuto(null)
                setFormData({
                  nome: "",
                  marca: "",
                  origem: "",
                  vitola: "",
                  anel: "",
                  comprimento: "",
                  wrapper: "",
                  binder: "",
                  filler: "",
                  preco: 0,
                  quantidade: 1,
                  observacoes: "",
                  dataCompra: new Date().toISOString().split("T")[0],
                })
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Charuto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingCharuto ? "Editar Charuto" : "Adicionar Novo Charuto"}</DialogTitle>
              <DialogDescription>Preencha as informações do charuto</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nome">Nome *</Label>
                  <Input
                    id="nome"
                    value={formData.nome || ""}
                    onChange={(e) => handleInputChange("nome", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="marca">Marca *</Label>
                  <Input
                    id="marca"
                    value={formData.marca || ""}
                    onChange={(e) => handleInputChange("marca", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="origem">Origem</Label>
                  <Input
                    id="origem"
                    value={formData.origem || ""}
                    onChange={(e) => handleInputChange("origem", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="vitola">Vitola</Label>
                  <Input
                    id="vitola"
                    value={formData.vitola || ""}
                    onChange={(e) => handleInputChange("vitola", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="anel">Anel</Label>
                  <Input
                    id="anel"
                    value={formData.anel || ""}
                    onChange={(e) => handleInputChange("anel", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="comprimento">Comprimento</Label>
                  <Input
                    id="comprimento"
                    value={formData.comprimento || ""}
                    onChange={(e) => handleInputChange("comprimento", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="quantidade">Quantidade</Label>
                  <Input
                    id="quantidade"
                    type="number"
                    min="0"
                    value={formData.quantidade || 0}
                    onChange={(e) => handleInputChange("quantidade", Number.parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="wrapper">Wrapper</Label>
                  <Input
                    id="wrapper"
                    value={formData.wrapper || ""}
                    onChange={(e) => handleInputChange("wrapper", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="binder">Binder</Label>
                  <Input
                    id="binder"
                    value={formData.binder || ""}
                    onChange={(e) => handleInputChange("binder", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="filler">Filler</Label>
                  <Input
                    id="filler"
                    value={formData.filler || ""}
                    onChange={(e) => handleInputChange("filler", e.target.value)}
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
                    value={formData.preco || 0}
                    onChange={(e) => handleInputChange("preco", Number.parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="dataCompra">Data da Compra</Label>
                  <Input
                    id="dataCompra"
                    type="date"
                    value={formData.dataCompra || ""}
                    onChange={(e) => handleInputChange("dataCompra", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  value={formData.observacoes || ""}
                  onChange={(e) => handleInputChange("observacoes", e.target.value)}
                  rows={3}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">{editingCharuto ? "Salvar Alterações" : "Adicionar Charuto"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {charutos.map((charuto) => (
          <Card key={charuto.id} className="relative">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{charuto.nome}</CardTitle>
                  <CardDescription>{charuto.marca}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(charuto)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(charuto.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
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
                {charuto.anel && (
                  <p>
                    <strong>Anel:</strong> {charuto.anel}
                  </p>
                )}
                {charuto.comprimento && (
                  <p>
                    <strong>Comprimento:</strong> {charuto.comprimento}
                  </p>
                )}
                <p>
                  <strong>Quantidade:</strong>
                  <Badge variant={charuto.quantidade > 0 ? "default" : "destructive"} className="ml-2">
                    {charuto.quantidade}
                  </Badge>
                </p>
                <p>
                  <strong>Preço:</strong> R$ {charuto.preco.toFixed(2)}
                </p>
                {charuto.observacoes && (
                  <p>
                    <strong>Observações:</strong> {charuto.observacoes}
                  </p>
                )}
              </div>
              <div className="mt-4">
                <Button className="w-full" onClick={() => moveToTasting(charuto)} disabled={charuto.quantidade <= 0}>
                  Iniciar Degustação
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {charutos.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhum charuto no estoque. Adicione o primeiro!</p>
        </div>
      )}
    </div>
  )
}
