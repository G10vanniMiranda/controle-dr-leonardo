"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useWatch } from "react-hook-form"
import { z } from "zod"

import { brlFormatter, dateFormatter } from "@/lib/formatters"
import { formatMoneyInput, parseMoneyToNumber } from "@/lib/input-masks"
import {
  type Client,
  type LegalCase,
} from "@/lib/domain"
import type { LegalFeeInput } from "@/lib/services/legal-fees-service"
import { FormFeedback } from "@/components/app/form-feedback"
import { generateInstallmentPreview } from "@/lib/services/legal-fees-service"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const legalFeeSchema = z.object({
  clientId: z.string().min(1, "Selecione o cliente."),
  caseId: z.string().optional(),
  contractName: z.string().min(3, "Informe o nome do contrato."),
  entryValue: z.string().transform(parseMoneyToNumber),
  firstDueDate: z.string().min(1, "Informe o primeiro vencimento."),
  installmentsCount: z.coerce.number().min(1).max(48),
  installmentValue: z
    .string()
    .refine(
      (value) => parseMoneyToNumber(value) > 0,
      "Informe o valor da parcela."
    )
    .transform(parseMoneyToNumber),
  notes: z.string().optional(),
})

type LegalFeeFormInput = z.input<typeof legalFeeSchema>
type LegalFeeFormValues = z.output<typeof legalFeeSchema>
type LegalFeeFormResult = { error?: string; ok: boolean }

export function LegalFeeForm({
  cases,
  clients,
  createLegalFeeAction,
}: {
  cases: LegalCase[]
  clients: Client[]
  createLegalFeeAction: (input: LegalFeeInput) => Promise<LegalFeeFormResult>
}) {
  const router = useRouter()
  const [feedback, setFeedback] = useState("")
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)
  const form = useForm<LegalFeeFormInput, unknown, LegalFeeFormValues>({
    resolver: zodResolver(legalFeeSchema),
    defaultValues: {
      caseId: cases[0]?.id ?? "",
      clientId: clients[0]?.id ?? "",
      contractName: "",
      entryValue: "R$ 0,00",
      firstDueDate: new Date().toISOString().slice(0, 10),
      installmentsCount: 6,
      installmentValue: "R$ 1.000,00",
      notes: "",
    },
  })
  const watched = useWatch({ control: form.control })
  const preview = useMemo(
    () =>
      generateInstallmentPreview({
        entryValueCents: Math.round(
          parseMoneyToNumber(watched.entryValue) * 100
        ),
        firstDueDate: watched.firstDueDate || new Date().toISOString().slice(0, 10),
        installmentsCount: Number(watched.installmentsCount || 0),
        installmentValueCents: Math.round(
          parseMoneyToNumber(watched.installmentValue) * 100
        ),
      }),
    [
      watched.entryValue,
      watched.firstDueDate,
      watched.installmentsCount,
      watched.installmentValue,
    ]
  )
  const totalCents = preview.reduce(
    (total, installment) => total + installment.valueCents,
    0
  )

  async function onSubmit(values: LegalFeeFormValues) {
    setError("")
    setFeedback("")
    setSaving(true)

    const result = await createLegalFeeAction({
      caseId: values.caseId || undefined,
      clientId: values.clientId,
      contractName: values.contractName,
      entryValueCents: Math.round(values.entryValue * 100),
      firstDueDate: values.firstDueDate,
      installmentValueCents: Math.round(values.installmentValue * 100),
      installmentsCount: values.installmentsCount,
      notes: values.notes ?? "",
      totalValueCents: totalCents,
    })

    setSaving(false)

    if (!result.ok) {
      setError(result.error ?? "Não foi possível gerar o contrato.")
      return
    }

    setFeedback("Contrato cadastrado e parcelas geradas com sucesso.")
    form.reset({
      caseId: cases[0]?.id ?? "",
      clientId: clients[0]?.id ?? "",
      contractName: "",
      entryValue: "R$ 0,00",
      firstDueDate: new Date().toISOString().slice(0, 10),
      installmentsCount: 6,
      installmentValue: "R$ 1.000,00",
      notes: "",
    })
    router.refresh()
  }

  return (
    <Card id="novo-contrato">
      <CardHeader>
        <CardTitle>Novo contrato de honorários</CardTitle>
        <CardDescription>
          Informe os valores para gerar a previsão automática das parcelas.
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
            <Field label="Processo vinculado">
              <select
                className="h-10 rounded-xl border border-input bg-input px-3 text-sm text-foreground focus:border-ring focus:ring-2 focus:ring-ring/35 focus:outline-none"
                {...form.register("caseId")}
              >
                {cases.map((legalCase) => (
                  <option key={legalCase.id} value={legalCase.id}>
                    {legalCase.caseNumber}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Nome do contrato" error={form.formState.errors.contractName?.message}>
              <Input placeholder="Contrato de honorários - cliente" {...form.register("contractName")} />
            </Field>
            <Field label="Entrada em reais" error={form.formState.errors.entryValue?.message}>
              <Input
                inputMode="numeric"
                placeholder="R$ 0,00"
                {...form.register("entryValue")}
                onChange={(event) => {
                  form.setValue("entryValue", formatMoneyInput(event.target.value), {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }}
              />
            </Field>
            <Field label="Quantidade de parcelas" error={form.formState.errors.installmentsCount?.message}>
              <Input type="number" min="1" max="48" {...form.register("installmentsCount")} />
            </Field>
            <Field label="Valor da parcela em reais" error={form.formState.errors.installmentValue?.message}>
              <Input
                inputMode="numeric"
                placeholder="R$ 1.000,00"
                {...form.register("installmentValue")}
                onChange={(event) => {
                  form.setValue(
                    "installmentValue",
                    formatMoneyInput(event.target.value),
                    { shouldDirty: true, shouldValidate: true }
                  )
                }}
              />
            </Field>
            <Field label="Primeiro vencimento" error={form.formState.errors.firstDueDate?.message}>
              <Input type="date" {...form.register("firstDueDate")} />
            </Field>
          </div>

          <Field label="Observações">
            <textarea
              className="min-h-24 rounded-xl border border-input bg-input px-3 py-2 text-sm text-foreground placeholder:text-tertiary focus:border-ring focus:ring-2 focus:ring-ring/35 focus:outline-none"
              placeholder="Observações internas do contrato"
              {...form.register("notes")}
            />
          </Field>

          <div className="rounded-2xl border border-border bg-secondary p-4">
            <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-foreground">Previsão de parcelas</p>
                <p className="text-sm text-muted-foreground">
                  Total previsto: {brlFormatter.format(totalCents / 100)}
                </p>
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Parcela</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {preview.map((installment) => (
                  <TableRow key={installment.id}>
                    <TableCell className="font-medium text-foreground">
                      {installment.installmentNumber === 0
                        ? "Entrada"
                        : `Parcela ${installment.installmentNumber}`}
                    </TableCell>
                    <TableCell>
                      {dateFormatter.format(new Date(installment.dueDate))}
                    </TableCell>
                    <TableCell className="text-right">
                      {brlFormatter.format(installment.valueCents / 100)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {feedback ? <FormFeedback>{feedback}</FormFeedback> : null}
          {error ? (
            <div className="rounded-xl border border-destructive/30 bg-destructive/15 px-3 py-2 text-sm text-[#ffb4b4]">
              {error}
            </div>
          ) : null}

          <div className="flex justify-end">
            <Button type="submit" disabled={saving}>
              {saving ? "Gerando..." : "Gerar contrato"}
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
