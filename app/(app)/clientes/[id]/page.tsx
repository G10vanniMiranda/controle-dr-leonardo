import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowUpDown, Mail, Phone, Plus } from "lucide-react"

import { EmptyState } from "@/components/app/empty-state"
import { PageHeading } from "@/components/app/page-heading"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
import { brlFormatter, dateFormatter } from "@/lib/formatters"
import { caseStatusLabels, clientStatusLabels } from "@/lib/domain"
import {
  getCasesByClientIdAsync,
  getClientByIdAsync,
} from "@/lib/services/server/clients-service"

export default async function ClienteDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const client = await getClientByIdAsync(id)

  if (!client) {
    notFound()
  }

  const linkedCases = await getCasesByClientIdAsync(client.id)
  const totalClaimValue = linkedCases.reduce(
    (total, legalCase) => total + legalCase.claimValueCents,
    0
  )

  return (
    <div className="grid gap-6">
      <PageHeading
        eyebrow="Cliente"
        title={client.fullName}
        description="Detalhes cadastrais, processos vinculados e resumo financeiro do cliente."
        action={
          <Button asChild>
            <Link href="/processos/novo">
              <Plus className="size-4" />
              Vincular processo
            </Link>
          </Button>
        }
      />

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Dados cadastrais</CardTitle>
            <CardDescription>
              Informacoes principais usadas nos modulos juridicos e financeiros.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Info label="CPF/CNPJ" value={client.documentNumber} />
            <Info
              label="Status"
              value={clientStatusLabels[client.status]}
              badge={client.status === "active" ? "default" : "secondary"}
            />
            <Info icon={Phone} label="Telefone" value={client.phone} />
            <Info icon={Mail} label="E-mail" value={client.email} />
            <Info label="Endereco" value={client.address} />
            <Info
              label="Cadastro"
              value={dateFormatter.format(new Date(client.createdAt))}
            />
            <div className="sm:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-tertiary">
                Observacoes
              </p>
              <p className="mt-2 rounded-xl border border-border bg-secondary p-3 text-sm leading-6 text-muted-foreground">
                {client.notes}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumo</CardTitle>
            <CardDescription>Visao consolidada do cliente.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Summary label="Processos vinculados" value={String(linkedCases.length)} />
            <Summary
              label="Valor total das causas"
              value={brlFormatter.format(totalClaimValue / 100)}
            />
            <Summary label="Pendencias mockadas" value="2" />
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Processos vinculados</CardTitle>
          <CardDescription>
            Todo processo deve estar associado a um cliente.
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
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {linkedCases.map((legalCase) => (
                <TableRow key={legalCase.id}>
                  <TableCell>
                    <Link
                      href={`/processos/${legalCase.id}`}
                      className="font-medium text-foreground transition-colors hover:text-primary"
                    >
                      {legalCase.caseNumber}
                    </Link>
                  </TableCell>
                  <TableCell>{legalCase.actionType}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {caseStatusLabels[legalCase.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {brlFormatter.format(legalCase.claimValueCents / 100)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {linkedCases.length === 0 ? (
            <EmptyState
              className="mt-4"
              title="Nenhum processo vinculado"
              description="Use a acao de vincular processo para associar demandas juridicas a este cliente."
            />
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}

function Info({
  badge,
  icon: Icon,
  label,
  value,
}: {
  badge?: "default" | "secondary"
  icon?: React.ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl border border-border bg-secondary p-3">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-tertiary">
        {label}
      </p>
      <div className="mt-2 flex items-center gap-2 text-sm text-foreground">
        {Icon ? <Icon className="size-4 text-primary" /> : null}
        {badge ? <Badge variant={badge}>{value}</Badge> : <span>{value}</span>}
      </div>
    </div>
  )
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-secondary p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-bold text-foreground">{value}</p>
    </div>
  )
}
