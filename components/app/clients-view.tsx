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

import {
  type Client,
  clientStatusLabels,
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

type ClientSortKey = "cases" | "client" | "contact" | "status"

const clientSortAccessors: Record<ClientSortKey, (client: Client) => string | number> = {
  cases: () => 0,
  client: (client) => client.fullName,
  contact: (client) => client.email,
  status: (client) => clientStatusLabels[client.status],
}

export function ClientsView({
  caseCountsByClientId = {},
  clients,
  deleteClientAction,
}: {
  caseCountsByClientId?: Record<string, number>
  clients: Client[]
  deleteClientAction: (clientId: string) => Promise<{ error?: string; ok: boolean }>
}) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState("todos")
  const [visibleClients, setVisibleClients] = useState(clients)
  const [feedback, setFeedback] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)

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
  } = useListControls<Client, ClientSortKey>({
    initialSort: { direction: "asc", field: "client" },
    items: filteredClients,
    pageSize: 6,
    sortAccessors: {
      ...clientSortAccessors,
      cases: (client) => caseCountsByClientId[client.id] ?? 0,
    },
  })

  async function removeClient(id: string) {
    setDeletingId(id)
    const result = await deleteClientAction(id)
    setDeletingId(null)

    if (!result.ok) {
      setFeedback(result.error ?? "Nao foi possivel excluir o cliente.")
      return
    }

    setVisibleClients((currentClients) =>
      currentClients.filter((client) => client.id !== id)
    )
    setFeedback("Cliente excluido com sucesso.")
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
            {filteredClients.length} registro(s) encontrado(s).
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
                    field="client"
                    sort={sort}
                    onSort={toggleSort}
                  >
                    Cliente
                  </SortHeader>
                </TableHead>
                <TableHead>
                  <SortHeader
                    field="contact"
                    sort={sort}
                    onSort={toggleSort}
                  >
                    Contato
                  </SortHeader>
                </TableHead>
                <TableHead>
                  <SortHeader field="cases" sort={sort} onSort={toggleSort}>
                    Processos
                  </SortHeader>
                </TableHead>
                <TableHead>
                  <SortHeader field="status" sort={sort} onSort={toggleSort}>
                    Status
                  </SortHeader>
                </TableHead>
                <TableHead className="text-right">Acoes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageItems.map((client) => {
                const casesCount = caseCountsByClientId[client.id] ?? 0

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
                                Esta acao remove o cliente e os registros
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
                                  disabled={deletingId === client.id}
                                  onClick={() => removeClient(client.id)}
                                >
                                  {deletingId === client.id ? "Excluindo..." : "Excluir"}
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
          {filteredClients.length === 0 ? (
            <EmptyState
              className="mt-4"
              title="Nenhum cliente encontrado"
              description="Ajuste a busca ou o filtro de status para localizar um cliente cadastrado."
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
              totalCount={filteredClients.length}
              totalPages={totalPages}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
