import { ReceiptText, TrendingDown, TrendingUp, WalletCards } from "lucide-react"

import { brlFormatter } from "@/lib/formatters"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type MonthlyBillsSummary = {
  bills: unknown[]
  overdueCents: number
  paidCents: number
  pendingCents: number
  totalCents: number
}

export function FinancialDashboard({
  projectedReceiptsCents,
  summary,
}: {
  projectedReceiptsCents: number
  summary: MonthlyBillsSummary
}) {
  const balanceCents = projectedReceiptsCents - summary.totalCents

  const cards = [
    {
      icon: TrendingUp,
      label: "Entradas previstas",
      value: brlFormatter.format(projectedReceiptsCents / 100),
      detail: "Honorários, condenações e parcelamentos",
    },
    {
      icon: TrendingDown,
      label: "Saídas do mês",
      value: brlFormatter.format(summary.totalCents / 100),
      detail: `${summary.bills.length} contas em junho`,
    },
    {
      icon: ReceiptText,
      label: "Contas pendentes",
      value: brlFormatter.format(summary.pendingCents / 100),
      detail: "Pendências antes do vencimento",
    },
    {
      icon: WalletCards,
      label: "Saldo projetado",
      value: brlFormatter.format(balanceCents / 100),
      detail: "Entradas menos saídas previstas",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dashboard financeiro</CardTitle>
        <CardDescription>
          Recorte mensal com entradas, saídas e saldo projetado.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-border bg-secondary p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-muted-foreground">{card.label}</p>
                <p className="mt-2 text-xl font-bold text-foreground">
                  {card.value}
                </p>
              </div>
              <span className="flex size-10 items-center justify-center rounded-xl border border-border bg-card text-primary">
                <card.icon className="size-4" />
              </span>
            </div>
            <p className="mt-3 text-xs text-tertiary">{card.detail}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
