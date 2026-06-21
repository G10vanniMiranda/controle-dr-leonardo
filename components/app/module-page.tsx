import Link from "next/link"
import { ArrowUpDown, ChevronLeft, ChevronRight, Plus } from "lucide-react"

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

type ModulePageProps = {
  title: string
  description: string
  primaryAction?: {
    href: string
    label: string
  }
  filters?: string[]
  rows?: Array<{
    title: string
    subtitle: string
    status: string
    amount?: string
  }>
}

const fallbackRows = [
  {
    title: "Registro demonstrativo",
    subtitle: "Estrutura pronta para conectar ao Supabase",
    status: "Pendente",
    amount: "R$ 0,00",
  },
]

export function ModulePage({
  description,
  filters = ["Mes", "Status", "Cliente"],
  primaryAction,
  rows = fallbackRows,
  title,
}: ModulePageProps) {
  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            Modulo
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
            {title}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
        {primaryAction ? (
          <Button asChild>
            <Link href={primaryAction.href}>
              <Plus className="size-4" />
              {primaryAction.label}
            </Link>
          </Button>
        ) : null}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Pesquisa, paginacao e filtros com padrao unico para todo o sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-4">
            <Input placeholder={`Buscar em ${title.toLowerCase()}`} />
            {filters.map((filter) => (
              <Input key={filter} placeholder={filter} />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Registros</CardTitle>
          <CardDescription>
            Lista profissional com busca, ordenacao e paginacao previstas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <span className="inline-flex items-center gap-2">
                    Nome
                    <ArrowUpDown className="size-3" />
                  </span>
                </TableHead>
                <TableHead>
                  <span className="inline-flex items-center gap-2">
                    Detalhe
                    <ArrowUpDown className="size-3" />
                  </span>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">
                  <span className="inline-flex items-center justify-end gap-2">
                    Valor
                    <ArrowUpDown className="size-3" />
                  </span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={`${row.title}-${row.subtitle}`}>
                  <TableCell className="font-medium text-foreground">{row.title}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {row.subtitle}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{row.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">{row.amount ?? "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4 flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <span>Mostrando 1-{rows.length} de {rows.length} registros</span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <ChevronLeft className="size-4" />
                Anterior
              </Button>
              <Button variant="outline" size="sm">
                Proxima
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
