"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react"

import {
  type Client,
  clientStatusLabels,
  getCasesByClientId,
} from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function ClientsView({ clients }: { clients: Client[] }) {
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState("todos")
  const [visibleClients, setVisibleClients] = useState(clients)

  const filteredClients = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return visibleClients.filter((client) => {
      const matchesStatus = status === "todos" || client.status === status
      const matchesQuery =
        !normalizedQuery ||
        client.fullName.toLowerCase().includes(normalizedQuery) ||
        client.documentNumber.toLowerCase().includes(normalizedQuery) ||
        client.phone.toLowerCase().includes(normalizedQuery)

      return matchesStatus && matchesQuery
    })
  }, [query, status, visibleClients])

  function removeClient(id: string) {
    setVisibleClients((currentClients) =>
      currentClients.filter((client) => client.id !== id)
    )
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            Fase 2
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
            Clientes
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Cadastro, pesquisa e acompanhamento dos clientes do escritorio.
          </p>
        </div>
        <Button asChild>
          <Link href="/clientes/novo">
            <Plus className="size-4" />
            Novo cliente
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Pesquise por nome, CPF/CNPJ ou telefone e filtre por status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-[1fr_220px]">
            <div className="relative">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-tertiary" />
              <Input
                className="pl-9"
                placeholder="Buscar cliente"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <select
              className="h-10 rounded-xl border border-input bg-input px-3 text-sm text-foreground focus:border-ring focus:ring-2 focus:ring-ring/35 focus:outline-none"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option value="todos">Todos os status</option>
              <option value="active">Ativos</option>
              <option value="inactive">Inativos</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Clientes cadastrados</CardTitle>
          <CardDescription>
            {filteredClients.length} registro(s) encontrado(s) no mock local.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <span className="inline-flex items-center gap-2">
                    Cliente
                    <ArrowUpDown className="size-3" />
                  </span>
                </TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Processos</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Acoes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => {
                const casesCount = getCasesByClientId(client.id).length

                return (
                  <TableRow key={client.id}>
                    <TableCell>
                      <div className="font-medium text-foreground">
                        {client.fullName}
                      </div>
                      <div className="text-xs text-tertiary">
                        {client.documentNumber}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>{client.phone}</div>
                      <div className="text-xs text-tertiary">{client.email}</div>
                    </TableCell>
                    <TableCell>{casesCount}</TableCell>
                    <TableCell>
                      <Badge
                        variant={client.status === "active" ? "default" : "secondary"}
                      >
                        {clientStatusLabels[client.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button asChild variant="outline" size="icon-sm">
                          <Link href={`/clientes/${client.id}`}>
                            <Eye className="size-4" />
                            <span className="sr-only">Ver cliente</span>
                          </Link>
                        </Button>
                        <Button asChild variant="outline" size="icon-sm">
                          <Link href={`/clientes/novo?edit=${client.id}`}>
                            <Pencil className="size-4" />
                            <span className="sr-only">Editar cliente</span>
                          </Link>
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="destructive" size="icon-sm">
                              <Trash2 className="size-4" />
                              <span className="sr-only">Excluir cliente</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Excluir cliente?</DialogTitle>
                              <DialogDescription>
                                Esta acao remove apenas o item da lista mockada
                                nesta sessao. No banco real, ela exigira RLS e
                                log de atividade.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="flex justify-end gap-2">
                              <DialogClose asChild>
                                <Button variant="outline">Cancelar</Button>
                              </DialogClose>
                              <DialogClose asChild>
                                <Button
                                  variant="destructive"
                                  onClick={() => removeClient(client.id)}
                                >
                                  Excluir
                                </Button>
                              </DialogClose>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
          <div className="mt-4 flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <span>
              Mostrando 1-{filteredClients.length} de {filteredClients.length} registros
            </span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <ChevronLeft className="size-4" />
                Anterior
              </Button>
              <Button variant="outline" size="sm">
                Proxima
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
