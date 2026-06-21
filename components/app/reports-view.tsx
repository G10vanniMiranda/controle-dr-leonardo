import { Download, FileSpreadsheet, FileText } from "lucide-react"

import { brlFormatter } from "@/lib/formatters"
import { getClients, getReports } from "@/lib/mock-data"
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

export function ReportsView() {
  const reports = getReports()

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          Fase 6
        </p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
          Relatorios
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Relatorios financeiros e juridicos com filtros prontos para ligar ao banco.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Periodo, cliente, processo, categoria e status para consultas futuras.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-5">
          <Input type="month" defaultValue="2026-06" />
          <select className="h-10 rounded-xl border border-input bg-input px-3 text-sm text-foreground focus:border-ring focus:ring-2 focus:ring-ring/35 focus:outline-none">
            <option>Todos os clientes</option>
            {getClients().map((client) => (
              <option key={client.id}>{client.fullName}</option>
            ))}
          </select>
          <Input placeholder="Processo" />
          <Input placeholder="Categoria" />
          <Input placeholder="Status" />
        </CardContent>
      </Card>

      <section className="grid gap-4 md:grid-cols-3">
        {reports.slice(0, 3).map((report) => (
          <Card key={report.id}>
            <CardHeader>
              <CardDescription>{report.description}</CardDescription>
              <CardTitle className="text-2xl font-bold text-foreground">
                {formatReportValue(report)}
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Relatorios disponiveis</CardTitle>
          <CardDescription>
            Exportacao para PDF e Excel fica preparada para a etapa de backend.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Relatorio</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Resultado</TableHead>
                <TableHead className="text-right">Exportar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>
                    <div className="font-medium text-foreground">{report.title}</div>
                    <div className="text-xs text-tertiary">{report.description}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={report.status === "Atencao" ? "destructive" : "secondary"}>
                      {report.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {formatReportValue(report)}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button disabled size="icon-sm" variant="outline">
                        <FileText className="size-4" />
                        <span className="sr-only">PDF futuro</span>
                      </Button>
                      <Button disabled size="icon-sm" variant="outline">
                        <FileSpreadsheet className="size-4" />
                        <span className="sr-only">Excel futuro</span>
                      </Button>
                      <Button disabled size="icon-sm" variant="outline">
                        <Download className="size-4" />
                        <span className="sr-only">Exportar futuro</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

function formatReportValue(report: ReturnType<typeof getReports>[number]) {
  return typeof report.valueCents === "number"
    ? brlFormatter.format(report.valueCents / 100)
    : report.valueText
}
