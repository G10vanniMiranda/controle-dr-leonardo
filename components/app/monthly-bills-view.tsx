"use client"

import { useMemo, useState } from "react"
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Plus,
  ReceiptText,
  Search,
} from "lucide-react"

import { brlFormatter, dateFormatter } from "@/lib/formatters"
import {
  type MonthlyBill,
  monthlyBillCategoryLabels,
  monthlyBillStatusLabels,
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

type MonthlyBillSortKey = "category" | "description" | "dueDate" | "status" | "value"

const monthlyBillSortAccessors: Record<
  MonthlyBillSortKey,
  (bill: MonthlyBill) => number | string
> = {
  category: (bill) => monthlyBillCategoryLabels[bill.category],
  description: (bill) => bill.description,
  dueDate: (bill) => bill.dueDate,
  status: (bill) => monthlyBillStatusLabels[bill.status],
  value: (bill) => bill.valueCents,
}

export function MonthlyBillsView({ bills }: { bills: MonthlyBill[] }) {
  const [query, setQuery] = useState("")
  const [month, setMonth] = useState("2026-06")
  const [category, setCategory] = useState("todas")
  const [status, setStatus] = useState("todos")
  const [visibleBills, setVisibleBills] = useState(bills)
  const [feedback, setFeedback] = useState("")

  const filteredBills = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return visibleBills.filter((bill) => {
      const matchesMonth = bill.dueDate.startsWith(month)
      const matchesCategory = category === "todas" || bill.category === category
      const matchesStatus = status === "todos" || bill.status === status
      const matchesQuery =
        !normalizedQuery ||
        bill.description.toLowerCase().includes(normalizedQuery) ||
        monthlyBillCategoryLabels[bill.category]
          .toLowerCase()
          .includes(normalizedQuery)

      return matchesMonth && matchesCategory && matchesStatus && matchesQuery
    })
  }, [category, month, query, status, visibleBills])

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
  } = useListControls<MonthlyBill, MonthlyBillSortKey>({
    initialSort: { direction: "asc", field: "dueDate" },
    items: filteredBills,
    pageSize: 6,
    sortAccessors: monthlyBillSortAccessors,
  })

  const monthBills = visibleBills.filter((bill) => bill.dueDate.startsWith(month))
  const totalCents = monthBills.reduce((total, bill) => total + bill.valueCents, 0)
  const paidCents = monthBills
    .filter((bill) => bill.status === "paid")
    .reduce((total, bill) => total + bill.valueCents, 0)
  const pendingCents = monthBills
    .filter((bill) => bill.status === "pending")
    .reduce((total, bill) => total + bill.valueCents, 0)
  const overdueCents = monthBills
    .filter((bill) => bill.status === "overdue")
    .reduce((total, bill) => total + bill.valueCents, 0)

  function markAsPaid(id: string) {
    const paidBill = visibleBills.find((bill) => bill.id === id)

    setVisibleBills((currentBills) =>
      currentBills.map((bill) =>
        bill.id === id
          ? {
              ...bill,
              paidAt: new Date().toISOString().slice(0, 10),
              status: "paid",
            }
          : bill
      )
    )
    setFeedback(
      paidBill
        ? "Conta marcada como paga nesta visualizacao."
        : "Conta nao encontrada nesta visualizacao."
    )
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            Fase 4
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
            Contas mensais
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Despesas, recorrencias, vencimentos e totais mensais.
          </p>
        </div>
        <Button asChild>
          <a href="#nova-conta">
            <Plus className="size-4" />
            Nova conta
          </a>
        </Button>
      </div>

      <section className="grid gap-4 md:grid-cols-4">
        <SummaryCard
          icon={ReceiptText}
          label="Total do mes"
          value={brlFormatter.format(totalCents / 100)}
        />
        <SummaryCard
          icon={CheckCircle2}
          label="Pago"
          value={brlFormatter.format(paidCents / 100)}
        />
        <SummaryCard
          icon={Clock3}
          label="Pendente"
          value={brlFormatter.format(pendingCents / 100)}
        />
        <SummaryCard
          icon={CalendarDays}
          label="Vencido"
          value={brlFormatter.format(overdueCents / 100)}
        />
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Filtros mensais</CardTitle>
          <CardDescription>
            Filtre por mes, categoria, status e descricao da conta.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-[1fr_160px_210px_180px]">
            <div className="relative">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-tertiary" />
              <Input
                className="pl-9"
                placeholder="Buscar conta"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <Input
              type="month"
              value={month}
              onChange={(event) => setMonth(event.target.value)}
            />
            <select
              className="h-10 rounded-xl border border-input bg-input px-3 text-sm text-foreground focus:border-ring focus:ring-2 focus:ring-ring/35 focus:outline-none"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option value="todas">Todas as categorias</option>
              {Object.entries(monthlyBillCategoryLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <select
              className="h-10 rounded-xl border border-input bg-input px-3 text-sm text-foreground focus:border-ring focus:ring-2 focus:ring-ring/35 focus:outline-none"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option value="todos">Todos os status</option>
              {Object.entries(monthlyBillStatusLabels).map(([value, label]) => (
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
          <CardTitle>Despesas do mes</CardTitle>
          <CardDescription>
            {filteredBills.length} conta(s) encontrada(s).
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
                    field="description"
                    sort={sort}
                    onSort={toggleSort}
                  >
                    Conta
                  </SortHeader>
                </TableHead>
                <TableHead>
                  <SortHeader field="category" sort={sort} onSort={toggleSort}>
                    Categoria
                  </SortHeader>
                </TableHead>
                <TableHead>
                  <SortHeader field="dueDate" sort={sort} onSort={toggleSort}>
                    Vencimento
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
                    field="value"
                    sort={sort}
                    onSort={toggleSort}
                  >
                    Valor
                  </SortHeader>
                </TableHead>
                <TableHead className="text-right">Acao</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageItems.map((bill) => (
                <TableRow key={bill.id}>
                  <TableCell>
                    <div className="font-medium text-foreground">
                      {bill.description}
                    </div>
                    <div className="text-xs text-tertiary">
                      {bill.recurring ? "Recorrente" : "Avulsa"} | {bill.notes}
                    </div>
                  </TableCell>
                  <TableCell>{monthlyBillCategoryLabels[bill.category]}</TableCell>
                  <TableCell>{dateFormatter.format(new Date(bill.dueDate))}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        bill.status === "paid"
                          ? "default"
                          : bill.status === "overdue"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {monthlyBillStatusLabels[bill.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {brlFormatter.format(bill.valueCents / 100)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant={bill.status === "paid" ? "outline" : "default"}
                      disabled={bill.status === "paid"}
                      onClick={() => markAsPaid(bill.id)}
                    >
                      Marcar paga
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredBills.length === 0 ? (
            <EmptyState
              className="mt-4"
              title="Nenhuma conta encontrada"
              description="Revise mes, categoria, status ou termo de busca para localizar despesas."
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
              totalCount={filteredBills.length}
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
