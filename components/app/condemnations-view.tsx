"use client"

import { useMemo, useState } from "react"
import { ArrowUpDown, Banknote, CheckCircle2, Gavel, Plus, Search } from "lucide-react"

import { brlFormatter, dateFormatter } from "@/lib/formatters"
import {
  type Condemnation,
  type CondemnationPayment,
  condemnationStatusLabels,
  getCaseById,
  getCondemnationPayments,
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
  condemnations,
}: {
  condemnations: Condemnation[]
}) {
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState("todos")
  const [items, setItems] = useState(condemnations)
  const [payments, setPayments] = useState<CondemnationPayment[]>(() =>
    condemnations.flatMap((condemnation) =>
      getCondemnationPayments(condemnation.id)
    )
  )

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return items.filter((condemnation) => {
      const legalCase = getCaseById(condemnation.caseId)
      const matchesStatus = status === "todos" || condemnation.status === status
      const matchesQuery =
        !normalizedQuery ||
        condemnation.debtorParty.toLowerCase().includes(normalizedQuery) ||
        condemnation.creditorParty.toLowerCase().includes(normalizedQuery) ||
        legalCase?.caseNumber.toLowerCase().includes(normalizedQuery)

      return matchesStatus && matchesQuery
    })
  }, [items, query, status])

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

  function addPayment(condemnation: Condemnation) {
    const remainingCents = Math.max(
      condemnation.updatedValueCents -
        payments
          .filter((payment) => payment.condemnationId === condemnation.id)
          .reduce((total, payment) => total + payment.valueCents, 0),
      0
    )
    const valueCents = Math.min(remainingCents, 500000)

    if (valueCents <= 0) {
      return
    }

    setPayments((currentPayments) => [
      ...currentPayments,
      {
        id: `${condemnation.id}-pagamento-${currentPayments.length + 1}`,
        condemnationId: condemnation.id,
        notes: "Pagamento simulado registrado na sessao.",
        paidAt: new Date().toISOString().slice(0, 10),
        paymentMethod: "PIX",
        valueCents,
      },
    ])
  }

  function transformToInstallment(id: string) {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, status: "installment" } : item
      )
    )
  }

  function markAsPaid(id: string) {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, status: "paid" } : item
      )
    )
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
            Controle de condenacoes, pagamentos recebidos, saldo e execucao.
          </p>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <SummaryCard icon={Gavel} label="Em aberto" value={brlFormatter.format(totalOpenCents / 100)} />
        <SummaryCard icon={Banknote} label="Em execucao" value={brlFormatter.format(executionCents / 100)} />
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
                placeholder="Buscar condenacao"
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
          <CardTitle>Condenacoes cadastradas</CardTitle>
          <CardDescription>
            Registre pagamentos e transforme condenacoes em parcelamento.
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
                <TableHead>Partes</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Saldo</TableHead>
                <TableHead className="text-right">Acoes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((condemnation) => {
                const legalCase = getCaseById(condemnation.caseId)
                const paidCentsForItem = payments
                  .filter((payment) => payment.condemnationId === condemnation.id)
                  .reduce((total, payment) => total + payment.valueCents, 0)
                const remainingCents = Math.max(
                  condemnation.updatedValueCents - paidCentsForItem,
                  0
                )

                return (
                  <TableRow key={condemnation.id}>
                    <TableCell>
                      <div className="font-medium text-foreground">
                        {legalCase?.caseNumber ?? "Processo nao encontrado"}
                      </div>
                      <div className="text-xs text-tertiary">
                        Decisao em {dateFormatter.format(new Date(condemnation.decisionDate))}
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
                        <Button size="sm" variant="outline" onClick={() => addPayment(condemnation)}>
                          <Plus className="size-4" />
                          Pagamento
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => transformToInstallment(condemnation.id)}>
                          Parcelar
                        </Button>
                        <Button size="sm" onClick={() => markAsPaid(condemnation.id)}>
                          Quitar
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
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
