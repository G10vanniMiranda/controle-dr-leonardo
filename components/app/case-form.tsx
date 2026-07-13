"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
  formatCaseNumber,
  formatMoneyInput,
  parseMoneyToNumber,
} from "@/lib/input-masks"
import {
  type CaseStatus,
  type Client,
  type LegalCase,
  caseStatusLabels,
} from "@/lib/domain"
import type { CaseInput } from "@/lib/services/cases-service"
import { FormFeedback } from "@/components/app/form-feedback"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const caseSchema = z.object({
  actionType: z.string().min(3, "Informe o tipo da acao."),
  caseNumber: z.string().min(25, "Informe o numero do processo completo."),
  clientId: z.string().min(1, "Selecione um cliente."),
  court: z.string().min(2, "Informe a vara."),
  district: z.string().min(2, "Informe a comarca."),
  opposingParty: z.string().min(3, "Informe a parte contraria."),
  proceduralPhase: z.string().min(3, "Informe a fase processual."),
  state: z.string().min(2, "Informe o estado."),
  status: z.enum([
    "agreement",
    "archived",
    "closed",
    "execution",
    "in_progress",
    "in_review",
    "sentence",
    "waiting_hearing",
  ]),
  claimValue: z
    .string()
    .refine((value) => parseMoneyToNumber(value) > 0, "Informe o valor da causa."),
  startDate: z.string().min(1, "Informe a data de inicio."),
  notes: z.string().optional(),
})

type CaseFormValues = z.infer<typeof caseSchema>
type CaseFormResult = { error?: string; ok: boolean }

export function CaseForm({
  clients,
  legalCase,
  saveCaseAction,
}: {
  clients: Client[]
  legalCase?: LegalCase
  saveCaseAction: (input: CaseInput, caseId?: string) => Promise<CaseFormResult>
}) {
  const router = useRouter()
  const mode = legalCase ? "edit" : "create"
  const [feedback, setFeedback] = useState("")
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)
  const form = useForm<CaseFormValues>({
    resolver: zodResolver(caseSchema),
    defaultValues: {
      actionType: legalCase?.actionType ?? "",
      caseNumber: legalCase?.caseNumber ?? "",
      claimValue: legalCase
        ? formatMoneyInput(String(legalCase.claimValueCents))
        : "",
      clientId: legalCase?.clientId ?? clients[0]?.id ?? "",
      court: legalCase?.court ?? "",
      district: legalCase?.district ?? "Manaus",
      notes: legalCase?.notes ?? "",
      opposingParty: legalCase?.opposingParty ?? "",
      proceduralPhase: legalCase?.proceduralPhase ?? "",
      startDate: legalCase?.startDate ?? "",
      state: legalCase?.state ?? "AM",
      status: legalCase?.status ?? "in_review",
    },
  })

  async function onSubmit(values: CaseFormValues) {
    setError("")
    setFeedback("")
    setSaving(true)

    const result = await saveCaseAction(
      {
        actionType: values.actionType,
        caseNumber: values.caseNumber,
        claimValueCents: Math.round(parseMoneyToNumber(values.claimValue) * 100),
        clientId: values.clientId,
        court: values.court,
        district: values.district,
        notes: values.notes ?? "",
        opposingParty: values.opposingParty,
        proceduralPhase: values.proceduralPhase,
        startDate: values.startDate,
        state: values.state,
        status: values.status as CaseStatus,
      },
      legalCase?.id
    )

    setSaving(false)

    if (!result.ok) {
      setError(result.error ?? "Não foi possível salvar o processo.")
      return
    }

    setFeedback(
      mode === "edit"
        ? "Processo atualizado com sucesso."
        : "Processo cadastrado com sucesso."
    )
    router.push("/processos")
    router.refresh()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {mode === "edit" ? "Editar dados do processo" : "Dados do processo"}
        </CardTitle>
        <CardDescription>
          {mode === "edit"
            ? "Atualize os dados do processo mantendo o vinculo com o cliente."
            : "Todo processo ja nasce vinculado a um cliente, conforme a regra de negocio."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-5" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Cliente" error={form.formState.errors.clientId?.message}>
              <select
                className="h-10 rounded-xl border border-input bg-input px-3 text-sm text-foreground focus:border-ring focus:ring-2 focus:ring-ring/35 focus:outline-none"
                {...form.register("clientId")}
              >
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.fullName}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Número do processo" error={form.formState.errors.caseNumber?.message}>
              <Input
                placeholder="0000000-00.2026.8.04.0001"
                {...form.register("caseNumber")}
                onChange={(event) => {
                  form.setValue("caseNumber", formatCaseNumber(event.target.value), {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }}
              />
            </Field>
            <Field label="Tipo da ação" error={form.formState.errors.actionType?.message}>
              <Input placeholder="Ex.: Revisional contratual" {...form.register("actionType")} />
            </Field>
            <Field label="Parte contrária" error={form.formState.errors.opposingParty?.message}>
              <Input placeholder="Nome da parte contrária" {...form.register("opposingParty")} />
            </Field>
            <Field label="Vara" error={form.formState.errors.court?.message}>
              <Input placeholder="3a Vara Civel" {...form.register("court")} />
            </Field>
            <Field label="Comarca" error={form.formState.errors.district?.message}>
              <Input placeholder="Manaus" {...form.register("district")} />
            </Field>
            <Field label="Estado" error={form.formState.errors.state?.message}>
              <Input placeholder="AM" {...form.register("state")} />
            </Field>
            <Field label="Valor da causa" error={form.formState.errors.claimValue?.message}>
              <Input
                inputMode="numeric"
                placeholder="R$ 45.000,00"
                {...form.register("claimValue")}
                onChange={(event) => {
                  form.setValue("claimValue", formatMoneyInput(event.target.value), {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }}
              />
            </Field>
            <Field label="Status">
              <select
                className="h-10 rounded-xl border border-input bg-input px-3 text-sm text-foreground focus:border-ring focus:ring-2 focus:ring-ring/35 focus:outline-none"
                {...form.register("status")}
              >
                {Object.entries(caseStatusLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Fase processual" error={form.formState.errors.proceduralPhase?.message}>
              <Input placeholder="Instrucao" {...form.register("proceduralPhase")} />
            </Field>
            <Field label="Data de inicio" error={form.formState.errors.startDate?.message}>
              <Input type="date" {...form.register("startDate")} />
            </Field>
          </div>

          <Field label="Observações">
            <textarea
              className="min-h-28 rounded-xl border border-input bg-input px-3 py-2 text-sm text-foreground placeholder:text-tertiary focus:border-ring focus:ring-2 focus:ring-ring/35 focus:outline-none"
              placeholder="Histórico interno ou orientações do processo"
              {...form.register("notes")}
            />
          </Field>

          {feedback ? <FormFeedback>{feedback}</FormFeedback> : null}
          {error ? (
            <div className="rounded-xl border border-destructive/30 bg-destructive/15 px-3 py-2 text-sm text-[#ffb4b4]">
              {error}
            </div>
          ) : null}

          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button asChild variant="outline">
              <Link href="/processos">Cancelar</Link>
            </Button>
            <Button type="submit" disabled={saving}>
              {saving
                ? "Salvando..."
                : mode === "edit"
                  ? "Atualizar processo"
                  : "Salvar processo"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

function Field({
  children,
  error,
  label,
}: {
  children: React.ReactNode
  error?: string
  label: string
}) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      {children}
      {error ? <p className="text-xs text-[#ffb4b4]">{error}</p> : null}
    </div>
  )
}
