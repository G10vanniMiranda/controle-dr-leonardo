"use client"

import { useMemo, useState } from "react"
import {
  Banknote,
  CheckCircle2,
  Clock3,
  Plus,
  Search,
} from "lucide-react"

import { brlFormatter, dateFormatter } from "@/lib/formatters"
import {
  type FeeInstallment,
  type LegalFee,
  feeInstallmentStatusLabels,
  legalFeeStatusLabels,
} from "@/lib/domain"
import { EmptyState } from "@/components/app/empty-state"
import { FormFeedback } from "@/components/app/form-feedback"
import {
  ListPagination,
  SortHeader,
  useListControls,
} from "@/components/app/list-controls"
import {
  getLegalFeeInstallments,
  getLegalFeeSummary,
  markFeeInstallmentAsPaid,
} from "@/lib/services/legal-fees-service"
import { getClientById } from "@/lib/services/clients-service"
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

type LegalFeeSortKey = "client" | "contract" | "installments" | "status" | "total"

const legalFeeSortAccessors: Record<
  LegalFeeSortKey,
  (legalFee: LegalFee) => number | string
> = {
  client: (legalFee) => getClientById(legalFee.clientId)?.fullName ?? "",
  contract: (legalFee) => legalFee.contractName,
  installments: (legalFee) => getLegalFeeSummary(legalFee.id).paidCount,
  status: (legalFee) => legalFeeStatusLabels[legalFee.status],
  total: (legalFee) => legalFee.totalValueCents,
}

export function LegalFeesView({ legalFees }: { legalFees: LegalFee[] }) {
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState("todos")
  const [selectedFeeId, setSelectedFeeId] = useState(legalFees[0]?.id ?? "")
  const [feedback, setFeedback] = useState("")
  const [installments, setInstallments] = useState(() =>
    legalFees.flatMap((legalFee) => getLegalFeeInstallments(legalFee.id))
  )

  const filteredFees = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return legalFees.filter((legalFee) => {
      const client = getClientById(legalFee.clientId)
      const matchesStatus = status === "todos" || legalFee.status === status
      const matchesQuery =
        !normalizedQuery ||
        legalFee.contractName.toLowerCase().includes(normalizedQuery) ||
        client?.fullName.toLowerCase().includes(normalizedQuery)

      return matchesStatus && matchesQuery
    })
  }, [legalFees, query, status])

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
  } = useListControls<LegalFee, LegalFeeSortKey>({
    initialSort: { direction: "asc", field: "contract" },
    items: filteredFees,
    pageSize: 6,
    sortAccessors: legalFeeSortAccessors,
  })

  const selectedFee =
    legalFees.find((legalFee) => legalFee.id === selectedFeeId) ?? legalFees[0]
  const selectedInstallments = installments.filter(
    (installment) => installment.legalFeeId === selectedFee?.id
  )
  const paidCents = installments
    .filter((installment) => installment.status === "paid")
    .reduce((total, installment) => total + installment.valueCents, 0)
  const overdueCents = installments
    .filter((installment) => installment.status === "overdue")
    .reduce((total, installment) => total + installment.valueCents, 0)
  const pendingCents = installments
    .filter((installment) => installment.status !== "paid")
    .reduce((total, installment) => total + installment.valueCents, 0)

  function markAsPaid(id: string) {
    const paidInstallment = markFeeInstallmentAsPaid(id)

    if (!paidInstallment) {
      return
    }

    setInstallments((currentInstallments) =>
      currentInstallments.map((installment) =>
        installment.id === id ? paidInstallment : installment
      )
    )
    setFeedback("Parcela marcada como paga no mock da sessao.")
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            Fase 3
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
            Honorarios
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Contratos, geracao de parcelas, pagamentos e saldo restante em modo mock.
          </p>
        </div>
        <Button asChild>
          <a href="#novo-contrato">
            <Plus className="size-4" />
            Novo contrato
          </a>
        </Button>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <SummaryCard
          icon={Banknote}
          label="Total recebido"
          value={brlFormatter.format(paidCents / 100)}
        />
        <SummaryCard
          icon={Clock3}
          label="Saldo pendente"
          value={brlFormatter.format(pendingCents / 100)}
        />
        <SummaryCard
          icon={CheckCircle2}
          label="Parcelas vencidas"
          value={brlFormatter.format(overdueCents / 100)}
        />
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Pesquise por contrato ou cliente e filtre por status do contrato.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-[1fr_240px]">
            <div className="relative">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-tertiary" />
              <Input
                className="pl-9"
                placeholder="Buscar honorarios"
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
              {Object.entries(legalFeeStatusLabels).map(([value, label]) => (
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
          <CardTitle>Contratos de honorarios</CardTitle>
          <CardDescription>
            Selecione um contrato para visualizar e controlar as parcelas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <SortHeader field="contract" sort={sort} onSort={toggleSort}>
                    Contrato
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
                <TableHead>
                  <SortHeader field="installments" sort={sort} onSort={toggleSort}>
                    Parcelas
                  </SortHeader>
                </TableHead>
                <TableHead className="text-right">
                  <SortHeader
                    align="right"
                    field="total"
                    sort={sort}
                    onSort={toggleSort}
                  >
                    Total
                  </SortHeader>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageItems.map((legalFee) => {
                const client = getClientById(legalFee.clientId)
                const summary = getLegalFeeSummary(legalFee.id)

                return (
                  <TableRow
                    key={legalFee.id}
                    className={
                      selectedFee?.id === legalFee.id ? "bg-hover" : undefined
                    }
                  >
                    <TableCell>
                      <button
                        className="text-left font-medium text-foreground transition-colors hover:text-primary"
                        type="button"
                        onClick={() => setSelectedFeeId(legalFee.id)}
                      >
                        {legalFee.contractName}
                      </button>
                      <div className="text-xs text-tertiary">
                        Entrada {brlFormatter.format(legalFee.entryValueCents / 100)}
                      </div>
                    </TableCell>
                    <TableCell>{client?.fullName ?? "Cliente nao encontrado"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={legalFee.status === "overdue" ? "destructive" : "secondary"}
                      >
                        {legalFeeStatusLabels[legalFee.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {summary.paidCount}/{summary.totalCount} pagas
                    </TableCell>
                    <TableCell className="text-right">
                      {brlFormatter.format(legalFee.totalValueCents / 100)}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
          {filteredFees.length === 0 ? (
            <EmptyState
              className="mt-4"
              title="Nenhum contrato encontrado"
              description="Ajuste os filtros para localizar contratos de honorarios cadastrados."
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
              totalCount={filteredFees.length}
              totalPages={totalPages}
            />
          )}
        </CardContent>
      </Card>

      {selectedFee ? (
        <Card>
          <CardHeader>
            <CardTitle>Parcelas do contrato</CardTitle>
            <CardDescription>
              Controle visual de pagamento para {selectedFee.contractName}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {feedback ? (
              <div className="mb-4">
                <FormFeedback>{feedback}</FormFeedback>
              </div>
            ) : null}
            <InstallmentsTable
              installments={selectedInstallments}
              onMarkAsPaid={markAsPaid}
            />
            {selectedInstallments.length === 0 ? (
              <EmptyState
                className="mt-4"
                title="Nenhuma parcela encontrada"
                description="As parcelas deste contrato serao exibidas aqui quando forem geradas."
              />
            ) : null}
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

function InstallmentsTable({
  installments,
  onMarkAsPaid,
}: {
  installments: FeeInstallment[]
  onMarkAsPaid: (id: string) => void
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Parcela</TableHead>
          <TableHead>Vencimento</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Pagamento</TableHead>
          <TableHead className="text-right">Valor</TableHead>
          <TableHead className="text-right">Acao</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {installments.map((installment) => (
          <TableRow key={installment.id}>
            <TableCell className="font-medium text-foreground">
              {installment.installmentNumber === 0
                ? "Entrada"
                : `Parcela ${installment.installmentNumber}`}
            </TableCell>
            <TableCell>
              {dateFormatter.format(new Date(installment.dueDate))}
            </TableCell>
            <TableCell>
              <Badge
                variant={
                  installment.status === "paid"
                    ? "default"
                    : installment.status === "overdue"
                      ? "destructive"
                      : "secondary"
                }
              >
                {feeInstallmentStatusLabels[installment.status]}
              </Badge>
            </TableCell>
            <TableCell>
              {installment.paidAt
                ? `${dateFormatter.format(new Date(installment.paidAt))} | ${
                    installment.paymentMethod
                  }`
                : "-"}
            </TableCell>
            <TableCell className="text-right">
              {brlFormatter.format(installment.valueCents / 100)}
            </TableCell>
            <TableCell className="text-right">
              <Button
                size="sm"
                variant={installment.status === "paid" ? "outline" : "default"}
                disabled={installment.status === "paid"}
                onClick={() => onMarkAsPaid(installment.id)}
              >
                Marcar pago
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
