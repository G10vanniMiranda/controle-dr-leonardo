import { ArrowUpRight } from "lucide-react"

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
import { dashboardMetrics, recentMatters } from "@/lib/dashboard-data"

export default function DashboardPage() {
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

      <DashboardCharts />

      <FinancialDashboard />

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
