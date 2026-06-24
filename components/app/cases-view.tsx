"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Eye,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react"

import { brlFormatter } from "@/lib/formatters"
import {
  type Client,
  type LegalCase,
  caseStatusLabels,
} from "@/lib/domain"
import { EmptyState } from "@/components/app/empty-state"
import { FormFeedback } from "@/components/app/form-feedback"
import {
  ListPagination,
  SortHeader,
  useListControls,
} from "@/components/app/list-controls"
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

type CaseSortKey = "caseNumber" | "claimValue" | "client" | "status"

export function CasesView({
  cases,
  clients,
  deleteCaseAction,
}: {
  cases: LegalCase[]
  clients: Client[]
  deleteCaseAction: (caseId: string) => Promise<{ error?: string; ok: boolean }>
}) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState("todos")
  const [visibleCases, setVisibleCases] = useState(cases)
  const [feedback, setFeedback] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const clientsById = useMemo(
    () => new Map(clients.map((client) => [client.id, client])),
    [clients]
  )

  const filteredCases = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return visibleCases.filter((legalCase) => {
      const client = clientsById.get(legalCase.clientId)
      const matchesStatus = status === "todos" || legalCase.status === status
      const matchesQuery =
        !normalizedQuery ||
        legalCase.caseNumber.toLowerCase().includes(normalizedQuery) ||
        legalCase.actionType.toLowerCase().includes(normalizedQuery) ||
        legalCase.opposingParty.toLowerCase().includes(normalizedQuery) ||
        client?.fullName.toLowerCase().includes(normalizedQuery)

      return matchesStatus && matchesQuery
    })
  }, [clientsById, query, status, visibleCases])

  const {
    canNextPage,
    canPreviousPage,
    endIndex,
    page,
    pageItems,
    setNextPage,
    setPreviousPage,
    sort,
    startIndex,
    toggleSort,
    totalPages,
  } = useListControls<LegalCase, CaseSortKey>({
    initialSort: { direction: "asc", field: "caseNumber" },
    items: filteredCases,
    pageSize: 6,
    sortAccessors: {
      caseNumber: (legalCase) => legalCase.caseNumber,
      claimValue: (legalCase) => legalCase.claimValueCents,
      client: (legalCase) =>
        clientsById.get(legalCase.clientId)?.fullName ?? "",
      status: (legalCase) => caseStatusLabels[legalCase.status],
    },
  })

  async function removeCase(id: string) {
    setDeletingId(id)
    const result = await deleteCaseAction(id)
    setDeletingId(null)

    if (!result.ok) {
      setFeedback(result.error ?? "Nao foi possivel excluir o processo.")
      return
    }

    setVisibleCases((currentCases) =>
      currentCases.filter((legalCase) => legalCase.id !== id)
    )
    setFeedback("Processo excluido com sucesso.")
    router.refresh()
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
            {filteredCases.length} processo(s) encontrado(s).
          </CardDescription>
        </CardHeader>
        <CardContent>
          {feedback ? (
            <div className="mb-4">
              <FormFeedback>{feedback}</FormFeedback>
            </div>
          ) : null}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <SortHeader
                    field="caseNumber"
                    sort={sort}
                    onSort={toggleSort}
                  >
                    Processo
                  </SortHeader>
                </TableHead>
                <TableHead>
                  <SortHeader field="client" sort={sort} onSort={toggleSort}>
                    Cliente
                  </SortHeader>
                </TableHead>
                <TableHead>
                  <SortHeader field="status" sort={sort} onSort={toggleSort}>
                    Status
                  </SortHeader>
                </TableHead>
                <TableHead className="text-right">
                  <SortHeader
                    align="right"
                    field="claimValue"
                    sort={sort}
                    onSort={toggleSort}
                  >
                    Valor da causa
                  </SortHeader>
                </TableHead>
                <TableHead className="text-right">Acoes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageItems.map((legalCase) => {
                const client = clientsById.get(legalCase.clientId)

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
                                Esta acao remove o processo e os registros
                                dependentes conforme as regras do banco.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="flex justify-end gap-2">
                              <DialogClose asChild>
                                <Button variant="outline">Cancelar</Button>
                              </DialogClose>
                              <DialogClose asChild>
                                <Button
                                  variant="destructive"
                                  disabled={deletingId === legalCase.id}
                                  onClick={() => removeCase(legalCase.id)}
                                >
                                  {deletingId === legalCase.id
                                    ? "Excluindo..."
                                    : "Excluir"}
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
          {filteredCases.length === 0 ? (
            <EmptyState
              className="mt-4"
              title="Nenhum processo encontrado"
              description="Revise os filtros ou cadastre um novo processo vinculado a um cliente."
            />
          ) : (
            <ListPagination
              canNextPage={canNextPage}
              canPreviousPage={canPreviousPage}
              endIndex={endIndex}
              onNextPage={setNextPage}
              onPreviousPage={setPreviousPage}
              page={page}
              startIndex={startIndex}
              totalCount={filteredCases.length}
              totalPages={totalPages}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
