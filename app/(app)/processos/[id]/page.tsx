import Link from "next/link"
import { notFound } from "next/navigation"
import { CalendarDays, FileText, Landmark, Scale } from "lucide-react"

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
import { brlFormatter, dateFormatter } from "@/lib/formatters"
import { caseStatusLabels } from "@/lib/domain"
import { getCaseByIdAsync } from "@/lib/services/server/cases-service"

export default async function ProcessoDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const legalCase = await getCaseByIdAsync(id)

  if (!legalCase) {
    notFound()
  }

  return (
    <div className="grid gap-6">
      <PageHeading
        eyebrow="Processo"
        title={legalCase.caseNumber}
        description="Visao completa do processo, cliente vinculado, fase atual e valores principais."
        action={
          <Button asChild variant="outline">
            <Link href="/processos">Voltar</Link>
          </Button>
        }
      />

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Dados processuais</CardTitle>
            <CardDescription>
              Informacoes operacionais para acompanhamento juridico.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Info icon={FileText} label="Tipo da acao" value={legalCase.actionType} />
            <Info
              icon={Scale}
              label="Status"
              value={caseStatusLabels[legalCase.status]}
              badge
            />
            <Info icon={Landmark} label="Vara" value={legalCase.court} />
            <Info label="Comarca" value={`${legalCase.district} - ${legalCase.state}`} />
            <Info label="Parte contraria" value={legalCase.opposingParty} />
            <Info label="Fase processual" value={legalCase.proceduralPhase} />
            <Info
              icon={CalendarDays}
              label="Data de inicio"
              value={dateFormatter.format(new Date(legalCase.startDate))}
            />
            <Info
              label="Valor da causa"
              value={brlFormatter.format(legalCase.claimValueCents / 100)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cliente vinculado</CardTitle>
            <CardDescription>
              Regra obrigatoria para todo processo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {legalCase.client ? (
              <div className="rounded-xl border border-border bg-secondary p-4">
                <p className="text-lg font-semibold text-foreground">
                  {legalCase.client.fullName}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {legalCase.client.documentNumber}
                </p>
                <Button asChild className="mt-4 w-full" variant="outline">
                  <Link href={`/clientes/${legalCase.client.id}`}>
                    Ver cliente
                  </Link>
                </Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Cliente nao encontrado.</p>
            )}
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Historico interno</CardTitle>
          <CardDescription>
            Linha inicial mockada para o acompanhamento de movimentacoes.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="rounded-xl border border-border bg-secondary p-4">
            <p className="text-sm font-semibold text-foreground">
              Processo cadastrado no sistema
            </p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {legalCase.notes}
            </p>
          </div>
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
  badge?: boolean
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
        {badge ? <Badge variant="secondary">{value}</Badge> : <span>{value}</span>}
      </div>
    </div>
  )
}
