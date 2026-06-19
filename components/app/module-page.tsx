import Link from "next/link"
import { Plus } from "lucide-react"

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
    <div className="grid gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
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
            Base visual para pesquisa, paginacao e filtros por modulo.
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
            Tabela responsiva preparada para TanStack Table.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Detalhe</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={`${row.title}-${row.subtitle}`}>
                  <TableCell className="font-medium">{row.title}</TableCell>
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
        </CardContent>
      </Card>
    </div>
  )
}
