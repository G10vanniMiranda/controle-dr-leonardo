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

import { brlFormatter } from "@/lib/formatters"
import {
  type LegalCase,
  caseStatusLabels,
  getClientById,
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

export function CasesView({ cases }: { cases: LegalCase[] }) {
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState("todos")
  const [visibleCases, setVisibleCases] = useState(cases)

  const filteredCases = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return visibleCases.filter((legalCase) => {
      const client = getClientById(legalCase.clientId)
      const matchesStatus = status === "todos" || legalCase.status === status
      const matchesQuery =
        !normalizedQuery ||
        legalCase.caseNumber.toLowerCase().includes(normalizedQuery) ||
        legalCase.actionType.toLowerCase().includes(normalizedQuery) ||
        legalCase.opposingParty.toLowerCase().includes(normalizedQuery) ||
        client?.fullName.toLowerCase().includes(normalizedQuery)

      return matchesStatus && matchesQuery
    })
  }, [query, status, visibleCases])

  function removeCase(id: string) {
    setVisibleCases((currentCases) =>
      currentCases.filter((legalCase) => legalCase.id !== id)
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
            Processos
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Controle de fases, status, partes, valores e vinculo com clientes.
          </p>
        </div>
        <Button asChild>
          <Link href="/processos/novo">
            <Plus className="size-4" />
            Novo processo
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Pesquise por numero, cliente, parte contraria ou tipo da acao.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-[1fr_240px]">
            <div className="relative">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-tertiary" />
              <Input
                className="pl-9"
                placeholder="Buscar processo"
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
              {Object.entries(caseStatusLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Processos cadastrados</CardTitle>
          <CardDescription>
            {filteredCases.length} processo(s) encontrado(s) no mock local.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <span className="inline-flex items-center gap-2">
                    Processo
                    <ArrowUpDown className="size-3" />
                  </span>
                </TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Valor da causa</TableHead>
                <TableHead className="text-right">Acoes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCases.map((legalCase) => {
                const client = getClientById(legalCase.clientId)

                return (
                  <TableRow key={legalCase.id}>
                    <TableCell>
                      <div className="font-medium text-foreground">
                        {legalCase.caseNumber}
                      </div>
                      <div className="text-xs text-tertiary">
                        {legalCase.actionType} | {legalCase.proceduralPhase}
                      </div>
                    </TableCell>
                    <TableCell>
                      {client ? (
                        <Link
                          href={`/clientes/${client.id}`}
                          className="text-foreground transition-colors hover:text-primary"
                        >
                          {client.fullName}
                        </Link>
                      ) : (
                        "Cliente nao encontrado"
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {caseStatusLabels[legalCase.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {brlFormatter.format(legalCase.claimValueCents / 100)}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button asChild variant="outline" size="icon-sm">
                          <Link href={`/processos/${legalCase.id}`}>
                            <Eye className="size-4" />
                            <span className="sr-only">Ver processo</span>
                          </Link>
                        </Button>
                        <Button asChild variant="outline" size="icon-sm">
                          <Link href={`/processos/novo?edit=${legalCase.id}`}>
                            <Pencil className="size-4" />
                            <span className="sr-only">Editar processo</span>
                          </Link>
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="destructive" size="icon-sm">
                              <Trash2 className="size-4" />
                              <span className="sr-only">Excluir processo</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Excluir processo?</DialogTitle>
                              <DialogDescription>
                                Esta remocao acontece apenas no mock da sessao.
                                No banco real, tambem criaremos log de atividade.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="flex justify-end gap-2">
                              <DialogClose asChild>
                                <Button variant="outline">Cancelar</Button>
                              </DialogClose>
                              <DialogClose asChild>
                                <Button
                                  variant="destructive"
                                  onClick={() => removeCase(legalCase.id)}
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
              Mostrando 1-{filteredCases.length} de {filteredCases.length} registros
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
