"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Banknote, CheckCircle2, Gavel, Plus, Search } from "lucide-react"

import { brlFormatter, dateFormatter } from "@/lib/formatters"
import {
  type Condemnation,
  type CondemnationPayment,
  type LegalCase,
  condemnationStatusLabels,
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
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function CondemnationsView({
  cases,
  condemnations,
  initialPayments,
  registerCondemnationPaymentAction,
  updateCondemnationStatusAction,
}: {
  cases: LegalCase[]
  condemnations: Condemnation[]
  initialPayments: CondemnationPayment[]
  registerCondemnationPaymentAction: (
    condemnation: Condemnation,
    valueCents: number
  ) => Promise<{ error?: string; ok: boolean }>
  updateCondemnationStatusAction: (
    id: string,
    status: Condemnation["status"]
  ) => Promise<{ error?: string; ok: boolean }>
}) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState("todos")
  const [items, setItems] = useState(condemnations)
  const [feedback, setFeedback] = useState<{
    message: string
    tone?: "success" | "error"
  } | null>(null)
  const [payments, setPayments] =
    useState<CondemnationPayment[]>(initialPayments)
  const casesById = useMemo(
    () => Object.fromEntries(cases.map((legalCase) => [legalCase.id, legalCase])),
    [cases]
  )

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return items.filter((condemnation) => {
      const legalCase = casesById[condemnation.caseId]
      const matchesStatus = status === "todos" || condemnation.status === status
      const matchesQuery =
        !normalizedQuery ||
        condemnation.debtorParty.toLowerCase().includes(normalizedQuery) ||
        condemnation.creditorParty.toLowerCase().includes(normalizedQuery) ||
        legalCase?.caseNumber.toLowerCase().includes(normalizedQuery)

      return matchesStatus && matchesQuery
    })
  }, [casesById, items, query, status])

  const balanceByCondemnationId = useMemo(
    () =>
      Object.fromEntries(
        items.map((item) => {
          const paidCents = payments
            .filter((payment) => payment.condemnationId === item.id)
            .reduce((sum, payment) => sum + payment.valueCents, 0)

          return [item.id, Math.max(item.updatedValueCents - paidCents, 0)]
        })
      ),
    [items, payments]
  )

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
  } = useListControls<Condemnation, "balance" | "parties" | "process" | "status">({
    initialSort: { direction: "asc", field: "process" },
    items: filtered,
    pageSize: 6,
    sortAccessors: {
      balance: (condemnation) => balanceByCondemnationId[condemnation.id] ?? 0,
      parties: (condemnation) => condemnation.debtorParty,
      process: (condemnation) =>
        casesById[condemnation.caseId]?.caseNumber ?? "",
      status: (condemnation) => condemnationStatusLabels[condemnation.status],
    },
  })

  const totalOpenCents = items
    .filter((item) => item.status !== "paid")
    .reduce((total, item) => {
      const paidCents = payments
        .filter((payment) => payment.condemnationId === item.id)
        .reduce((sum, payment) => sum + payment.valueCents, 0)
      return total + Math.max(item.updatedValueCents - paidCents, 0)
    }, 0)
  const executionCents = items
    .filter((item) => item.status === "execution")
    .reduce((total, item) => total + item.updatedValueCents, 0)
  const paidCents = payments.reduce(
    (total, payment) => total + payment.valueCents,
    0
  )

  async function addPayment(condemnation: Condemnation) {
    const remainingCents = Math.max(
      condemnation.updatedValueCents -
      payments
        .filter((payment) => payment.condemnationId === condemnation.id)
        .reduce((total, payment) => total + payment.valueCents, 0),
      0
    )
    const valueCents = Math.min(remainingCents, 500000)

    if (valueCents <= 0) {
      setFeedback({
        message: "Esta condenação nao possui saldo pendente para pagamento.",
        tone: "error",
      })
      return
    }

    const result = await registerCondemnationPaymentAction(
      condemnation,
      valueCents
    )

    if (!result.ok) {
      setFeedback({
        message: result.error ?? "Não foi possível registrar o pagamento.",
        tone: "error",
      })
      return
    }

    setPayments((currentPayments) => [
      ...currentPayments,
      {
        condemnationId: condemnation.id,
        notes: "Pagamento registrado pelo sistema.",
        paidAt: new Date().toISOString().slice(0, 10),
        paymentMethod: "PIX",
        valueCents,
        id: `${condemnation.id}-pagamento-${currentPayments.length + 1}`,
      },
    ])
    setFeedback({ message: "Pagamento registrado." })
    router.refresh()
  }

  async function transformToInstallment(id: string) {
    const result = await updateCondemnationStatusAction(id, "installment")

    if (!result.ok) {
      setFeedback({
        message: result.error ?? "Não foi possível parcelar a condenação.",
        tone: "error",
      })
      return
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, status: "installment" } : item
      )
    )
    setFeedback({ message: "Condenação transformada em parcelamento." })
    router.refresh()
  }

  async function markAsPaid(id: string) {
    const result = await updateCondemnationStatusAction(id, "paid")

    if (!result.ok) {
      setFeedback({
        message: result.error ?? "Não foi possível quitar a condenação.",
        tone: "error",
      })
      return
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, status: "paid" } : item
      )
    )
    setFeedback({ message: "Condenação marcada como quitada." })
    router.refresh()
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            Fase 5
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
            Condenacoes
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Controle de condenações, pagamentos recebidos, saldo e execução.
          </p>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <SummaryCard icon={Gavel} label="Em aberto" value={brlFormatter.format(totalOpenCents / 100)} />
        <SummaryCard icon={Banknote} label="Em execução" value={brlFormatter.format(executionCents / 100)} />
        <SummaryCard icon={CheckCircle2} label="Recebido" value={brlFormatter.format(paidCents / 100)} />
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Pesquise por processo, parte devedora, credora ou status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-[1fr_220px]">
            <div className="relative">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-tertiary" />
              <Input
                className="pl-9"
                placeholder="Buscar condenação"
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
              {Object.entries(condemnationStatusLabels).map(([value, label]) => (
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
          <CardTitle>Condenações cadastradas</CardTitle>
          <CardDescription>
            Registre pagamentos e transforme condenações em parcelamento.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {feedback ? (
            <div className="mb-4">
              <FormFeedback tone={feedback.tone}>{feedback.message}</FormFeedback>
            </div>
          ) : null}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <SortHeader field="process" sort={sort} onSort={toggleSort}>
                    Processo
                  </SortHeader>
                </TableHead>
                <TableHead>
                  <SortHeader field="parties" sort={sort} onSort={toggleSort}>
                    Partes
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
                    field="balance"
                    sort={sort}
                    onSort={toggleSort}
                  >
                    Saldo
                  </SortHeader>
                </TableHead>
                <TableHead className="text-right">Acoes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageItems.map((condemnation) => {
                const legalCase = casesById[condemnation.caseId]
                const remainingCents = balanceByCondemnationId[condemnation.id] ?? 0

                return (
                  <TableRow key={condemnation.id}>
                    <TableCell>
                      <div className="font-medium text-foreground">
                        {legalCase?.caseNumber ?? "Processo não encontrado"}
                      </div>
                      <div className="text-xs text-tertiary">
                        Decisão em {dateFormatter.format(new Date(condemnation.decisionDate))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>{condemnation.debtorParty}</div>
                      <div className="text-xs text-tertiary">
                        Credor: {condemnation.creditorParty}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          condemnation.status === "paid"
                            ? "default"
                            : condemnation.status === "execution"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {condemnationStatusLabels[condemnation.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {brlFormatter.format(remainingCents / 100)}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={
                            remainingCents <= 0 || condemnation.status === "paid"
                          }
                          onClick={() => addPayment(condemnation)}
                        >
                          <Plus className="size-4" />
                          Pagamento
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={
                            condemnation.status === "paid" ||
                            condemnation.status === "installment"
                          }
                          onClick={() => transformToInstallment(condemnation.id)}
                        >
                          Parcelar
                        </Button>
                        <Button
                          size="sm"
                          disabled={condemnation.status === "paid"}
                          onClick={() => markAsPaid(condemnation.id)}
                        >
                          Quitar
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
          {filtered.length === 0 ? (
            <EmptyState
              className="mt-4"
              title="Nenhuma condenação encontrada"
              description="Ajuste os filtros para localizar condenações por processo, partes ou status."
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
              totalCount={filtered.length}
              totalPages={totalPages}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function SummaryCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div>
          <CardDescription>{label}</CardDescription>
          <CardTitle className="mt-2 text-2xl font-bold text-foreground">
            {value}
          </CardTitle>
        </div>
        <span className="flex size-10 items-center justify-center rounded-xl border border-border bg-secondary text-primary">
          <Icon className="size-4" />
        </span>
      </CardHeader>
    </Card>
  )
}
