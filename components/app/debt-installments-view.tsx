"use client"

import { useMemo, useState } from "react"
import { ArrowUpDown, CheckCircle2, Clock3, FileCheck2, ReceiptText, Search } from "lucide-react"

import { brlFormatter, dateFormatter } from "@/lib/formatters"
import {
  type DebtInstallmentPayment,
  type DebtInstallmentPlan,
  debtInstallmentPaymentStatusLabels,
  debtInstallmentStatusLabels,
  getClientById,
  getDebtInstallmentPayments,
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

export function DebtInstallmentsView({
  debtInstallments,
}: {
  debtInstallments: DebtInstallmentPlan[]
}) {
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState("todos")
  const [selectedId, setSelectedId] = useState(debtInstallments[0]?.id ?? "")
  const [plans, setPlans] = useState(debtInstallments)
  const [payments, setPayments] = useState<DebtInstallmentPayment[]>(() =>
    debtInstallments.flatMap((plan) => getDebtInstallmentPayments(plan.id))
  )

  const filteredPlans = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return plans.filter((plan) => {
      const client = getClientById(plan.clientId)
      const matchesStatus = status === "todos" || plan.status === status
      const matchesQuery =
        !normalizedQuery ||
        plan.description.toLowerCase().includes(normalizedQuery) ||
        client?.fullName.toLowerCase().includes(normalizedQuery)

      return matchesStatus && matchesQuery
    })
  }, [plans, query, status])

  const selectedPlan = plans.find((plan) => plan.id === selectedId) ?? plans[0]
  const selectedPayments = payments.filter(
    (payment) => payment.debtInstallmentId === selectedPlan?.id
  )
  const paidCents = payments
    .filter((payment) => payment.status === "paid")
    .reduce((total, payment) => total + payment.valueCents, 0)
  const overdueCents = payments
    .filter((payment) => payment.status === "overdue")
    .reduce((total, payment) => total + payment.valueCents, 0)
  const pendingCents = payments
    .filter((payment) => payment.status !== "paid")
    .reduce((total, payment) => total + payment.valueCents, 0)

  function markPaymentAsPaid(id: string) {
    let planToCheck = ""

    const nextPayments = payments.map((payment) => {
      if (payment.id !== id) {
        return payment
      }

      planToCheck = payment.debtInstallmentId

      return {
        ...payment,
        paidAt: new Date().toISOString().slice(0, 10),
        receiptName: `comprovante-${payment.id}.pdf`,
        status: "paid" as const,
      }
    })

    setPayments(nextPayments)

    const allPaid = nextPayments
      .filter((payment) => payment.debtInstallmentId === planToCheck)
      .every((payment) => payment.status === "paid")

    if (allPaid) {
      setPlans((currentPlans) =>
        currentPlans.map((plan) =>
          plan.id === planToCheck ? { ...plan, status: "paid" } : plan
        )
      )
    }
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            Fase 5
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
            Parcelamentos
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Quitacao de dividas, parcelas, comprovantes e saldo devedor em modo mock.
          </p>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <SummaryCard icon={ReceiptText} label="Saldo devedor" value={brlFormatter.format(pendingCents / 100)} />
        <SummaryCard icon={Clock3} label="Parcelas vencidas" value={brlFormatter.format(overdueCents / 100)} />
        <SummaryCard icon={CheckCircle2} label="Valor quitado" value={brlFormatter.format(paidCents / 100)} />
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Filtre por cliente, descricao da divida e status do parcelamento.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-[1fr_220px]">
            <div className="relative">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-tertiary" />
              <Input
                className="pl-9"
                placeholder="Buscar parcelamento"
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
              {Object.entries(debtInstallmentStatusLabels).map(([value, label]) => (
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
          <CardTitle>Planos de quitacao</CardTitle>
          <CardDescription>
            Selecione um plano para acompanhar parcelas e comprovantes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <span className="inline-flex items-center gap-2">
                    Divida
                    <ArrowUpDown className="size-3" />
                  </span>
                </TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Parcelas</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPlans.map((plan) => {
                const client = getClientById(plan.clientId)
                const planPayments = payments.filter(
                  (payment) => payment.debtInstallmentId === plan.id
                )
                const paidCount = planPayments.filter(
                  (payment) => payment.status === "paid"
                ).length

                return (
                  <TableRow
                    key={plan.id}
                    className={selectedPlan?.id === plan.id ? "bg-hover" : undefined}
                  >
                    <TableCell>
                      <button
                        className="text-left font-medium text-foreground transition-colors hover:text-primary"
                        type="button"
                        onClick={() => setSelectedId(plan.id)}
                      >
                        {plan.description}
                      </button>
                      <div className="text-xs text-tertiary">
                        Entrada {brlFormatter.format(plan.entryValueCents / 100)} | dia {plan.dueDay}
                      </div>
                    </TableCell>
                    <TableCell>{client?.fullName ?? "Cliente nao encontrado"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          plan.status === "paid"
                            ? "default"
                            : plan.status === "overdue"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {debtInstallmentStatusLabels[plan.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {paidCount}/{planPayments.length} pagas
                    </TableCell>
                    <TableCell className="text-right">
                      {brlFormatter.format(plan.totalValueCents / 100)}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedPlan ? (
        <Card>
          <CardHeader>
            <CardTitle>Parcelas do plano</CardTitle>
            <CardDescription>
              Controle de pagamentos e comprovantes para {selectedPlan.description}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Parcela</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Comprovante</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead className="text-right">Acao</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium text-foreground">
                      {payment.installmentNumber === 0
                        ? "Entrada"
                        : `Parcela ${payment.installmentNumber}`}
                    </TableCell>
                    <TableCell>
                      {dateFormatter.format(new Date(payment.dueDate))}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          payment.status === "paid"
                            ? "default"
                            : payment.status === "overdue"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {debtInstallmentPaymentStatusLabels[payment.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {payment.receiptName ? (
                        <span className="inline-flex items-center gap-2 text-foreground">
                          <FileCheck2 className="size-4 text-primary" />
                          {payment.receiptName}
                        </span>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {brlFormatter.format(payment.valueCents / 100)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant={payment.status === "paid" ? "outline" : "default"}
                        disabled={payment.status === "paid"}
                        onClick={() => markPaymentAsPaid(payment.id)}
                      >
                        Marcar paga
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : null}
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
