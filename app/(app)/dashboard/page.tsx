import { ArrowUpRight } from "lucide-react"
import {
  AlertTriangle,
  Banknote,
  BriefcaseBusiness,
  CircleDollarSign,
  Clock3,
  FileClock,
  HandCoins,
  ReceiptText,
} from "lucide-react"

import { DashboardCharts } from "@/components/app/dashboard-charts"
import { FinancialDashboard } from "@/components/app/financial-dashboard"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { brlFormatter } from "@/lib/formatters"
import { caseStatusLabels } from "@/lib/domain"
import { getCasesAsync } from "@/lib/services/server/cases-service"
import {
  getAllCondemnationPaymentsAsync,
  getCondemnationsAsync,
} from "@/lib/services/server/condemnations-service"
import {
  getAllDebtInstallmentPaymentsAsync,
  getDebtInstallmentsAsync,
} from "@/lib/services/server/debt-installments-service"
import {
  getAllLegalFeeInstallmentsAsync,
  getLegalFeesAsync,
} from "@/lib/services/server/legal-fees-service"
import { getMonthlyBillsSummaryAsync } from "@/lib/services/server/monthly-bills-service"

export default async function DashboardPage() {
  const month = "2026-06"
  const [
    cases,
    condemnations,
    condemnationPayments,
    debtInstallments,
    debtPayments,
    legalFees,
    feeInstallments,
    monthlyBillsSummary,
  ] = await Promise.all([
    getCasesAsync(),
    getCondemnationsAsync(),
    getAllCondemnationPaymentsAsync(),
    getDebtInstallmentsAsync(),
    getAllDebtInstallmentPaymentsAsync(),
    getLegalFeesAsync(),
    getAllLegalFeeInstallmentsAsync(),
    getMonthlyBillsSummaryAsync(month),
  ])

  const feeReceivedCents = feeInstallments
    .filter((item) => item.status === "paid" && item.paidAt?.startsWith(month))
    .reduce((total, item) => total + item.valueCents, 0)
  const condemnationReceivedCents = condemnationPayments
    .filter((item) => item.paidAt.startsWith(month))
    .reduce((total, item) => total + item.valueCents, 0)
  const debtReceivedCents = debtPayments
    .filter((item) => item.status === "paid" && item.paidAt?.startsWith(month))
    .reduce((total, item) => total + item.valueCents, 0)
  const receivedCents =
    feeReceivedCents + condemnationReceivedCents + debtReceivedCents
  const pendingFeeCents = feeInstallments
    .filter((item) => item.status === "pending")
    .reduce((total, item) => total + item.valueCents, 0)
  const pendingDebtCents = debtPayments
    .filter((item) => item.status === "pending")
    .reduce((total, item) => total + item.valueCents, 0)
  const overdueFeeCents = feeInstallments
    .filter((item) => item.status === "overdue")
    .reduce((total, item) => total + item.valueCents, 0)
  const overdueDebtCents = debtPayments
    .filter((item) => item.status === "overdue")
    .reduce((total, item) => total + item.valueCents, 0)
  const openCondemnationCents = condemnations
    .filter((item) => item.status !== "paid")
    .reduce((total, item) => total + item.updatedValueCents, 0)
  const projectedReceiptsCents =
    pendingFeeCents + pendingDebtCents + openCondemnationCents
  const activeCases = cases.filter(
    (item) => !["archived", "closed"].includes(item.status)
  )

  const dashboardMetrics = [
    {
      detail: "Pagamentos recebidos no mes",
      icon: CircleDollarSign,
      label: "Recebido no mes",
      value: brlFormatter.format(receivedCents / 100),
    },
    {
      detail: "Honorarios, condenacoes e parcelamentos",
      icon: HandCoins,
      label: "A receber",
      value: brlFormatter.format(projectedReceiptsCents / 100),
    },
    {
      detail: "Parcelas e contas vencidas",
      icon: AlertTriangle,
      label: "Total vencido",
      value: brlFormatter.format(
        (overdueFeeCents + overdueDebtCents + monthlyBillsSummary.overdueCents) /
          100
      ),
    },
    {
      detail: `${cases.length} processo(s) cadastrados`,
      icon: BriefcaseBusiness,
      label: "Processos ativos",
      value: String(activeCases.length),
    },
    {
      detail: `${legalFees.length} contrato(s)`,
      icon: Banknote,
      label: "Honorarios pendentes",
      value: brlFormatter.format(pendingFeeCents / 100),
    },
    {
      detail: `${debtInstallments.length} plano(s)`,
      icon: FileClock,
      label: "Parcelamentos ativos",
      value: String(
        debtInstallments.filter((item) => item.status === "active").length
      ),
    },
    {
      detail: `${monthlyBillsSummary.bills.length} conta(s) no mes`,
      icon: ReceiptText,
      label: "Contas pendentes",
      value: brlFormatter.format(monthlyBillsSummary.pendingCents / 100),
    },
    {
      detail: `${condemnations.length} condenacao(oes)`,
      icon: Clock3,
      label: "Condenacoes abertas",
      value: brlFormatter.format(openCondemnationCents / 100),
    },
  ]
  const chartsData = {
    caseStatus: Object.entries(caseStatusLabels).map(([status, label]) => ({
      name: label,
      total: cases.filter((item) => item.status === status).length,
    })),
    categoryReceipts: [
      { name: "Honorarios", value: feeReceivedCents },
      { name: "Condenacoes", value: condemnationReceivedCents },
      { name: "Parcelamentos", value: debtReceivedCents },
    ],
    monthlyFlow: [
      {
        entradas: receivedCents / 100,
        month: "Atual",
        saidas: monthlyBillsSummary.totalCents / 100,
      },
    ],
  }
  const recentMatters = cases.slice(0, 5).map((item) => ({
    amount: brlFormatter.format(item.claimValueCents / 100),
    client: item.clientId,
    matter: item.actionType,
    status: caseStatusLabels[item.status],
  }))

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            Painel executivo
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
            Visao geral
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Indicadores juridicos e financeiros do mes atual.
          </p>
        </div>
        <Badge variant="outline">Junho de 2026</Badge>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardMetrics.map((metric) => (
          <Card key={metric.label}>
            <CardHeader className="flex flex-row items-start justify-between gap-3">
              <div className="space-y-1">
                <CardDescription>{metric.label}</CardDescription>
                <CardTitle className="text-2xl font-bold text-foreground">
                  {metric.value}
                </CardTitle>
              </div>
              <span className="flex size-10 items-center justify-center rounded-xl border border-border bg-secondary text-primary">
                <metric.icon className="size-4" />
              </span>
            </CardHeader>
            <CardContent className="pt-2">
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <ArrowUpRight className="size-3 text-primary" />
                {metric.detail}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>

      <DashboardCharts data={chartsData} />

      <FinancialDashboard
        projectedReceiptsCents={projectedReceiptsCents}
        summary={monthlyBillsSummary}
      />

      <Card>
        <CardHeader>
          <CardTitle>Movimentacoes recentes</CardTitle>
          <CardDescription>
            Ultimos processos e valores acompanhados no escritorio.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Processo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentMatters.map((matter) => (
                <TableRow key={`${matter.client}-${matter.matter}`}>
                  <TableCell className="font-medium text-foreground">{matter.client}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {matter.matter}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{matter.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">{matter.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
