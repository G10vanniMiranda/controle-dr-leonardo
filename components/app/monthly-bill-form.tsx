"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { formatMoneyInput, parseMoneyToNumber } from "@/lib/input-masks"
import {
  type MonthlyBillCategory,
  monthlyBillCategoryLabels,
} from "@/lib/domain"
import type { MonthlyBillInput } from "@/lib/services/monthly-bills-service"
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

const billSchema = z.object({
  category: z.string().min(1),
  description: z.string().min(3, "Informe a descricao."),
  dueDate: z.string().min(1, "Informe a data de vencimento."),
  notes: z.string().optional(),
  recurring: z.boolean(),
  value: z
    .string()
    .refine((value) => parseMoneyToNumber(value) > 0, "Informe o valor.")
    .transform(parseMoneyToNumber),
})

type BillInput = z.input<typeof billSchema>
type BillOutput = z.output<typeof billSchema>
type MonthlyBillFormResult = { error?: string; ok: boolean }

export function MonthlyBillForm({
  createMonthlyBillAction,
}: {
  createMonthlyBillAction: (
    input: MonthlyBillInput
  ) => Promise<MonthlyBillFormResult>
}) {
  const router = useRouter()
  const [feedback, setFeedback] = useState("")
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)
  const form = useForm<BillInput, unknown, BillOutput>({
    resolver: zodResolver(billSchema),
    defaultValues: {
      category: "office",
      description: "",
      dueDate: new Date().toISOString().slice(0, 10),
      notes: "",
      recurring: false,
      value: "R$ 100,00",
    },
  })

  async function onSubmit(values: BillOutput) {
    setError("")
    setFeedback("")
    setSaving(true)

    const result = await createMonthlyBillAction({
      category: values.category as MonthlyBillCategory,
      description: values.description,
      dueDate: values.dueDate,
      notes: values.notes ?? "",
      recurring: values.recurring,
      valueCents: Math.round(values.value * 100),
    })

    setSaving(false)

    if (!result.ok) {
      setError(result.error ?? "Não foi possível salvar a conta.")
      return
    }

    setFeedback("Conta mensal cadastrada com sucesso.")
    form.reset({
      category: "office",
      description: "",
      dueDate: new Date().toISOString().slice(0, 10),
      notes: "",
      recurring: false,
      value: "R$ 100,00",
    })
    router.refresh()
  }

  return (
    <Card id="nova-conta">
      <CardHeader>
        <CardTitle>Nova conta mensal</CardTitle>
        <CardDescription>
          Cadastre despesas recorrentes ou avulsas no banco.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-5" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Descricao" error={form.formState.errors.description?.message}>
              <Input placeholder="Ex.: Aluguel do escritório" {...form.register("description")} />
            </Field>
            <Field label="Categoria">
              <select
                className="h-10 rounded-xl border border-input bg-input px-3 text-sm text-foreground focus:border-ring focus:ring-2 focus:ring-ring/35 focus:outline-none"
                {...form.register("category")}
              >
                {Object.entries(monthlyBillCategoryLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Valor em reais" error={form.formState.errors.value?.message}>
              <Input
                inputMode="numeric"
                placeholder="R$ 100,00"
                {...form.register("value")}
                onChange={(event) => {
                  form.setValue("value", formatMoneyInput(event.target.value), {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }}
              />
            </Field>
            <Field label="Data de vencimento" error={form.formState.errors.dueDate?.message}>
              <Input type="date" {...form.register("dueDate")} />
            </Field>
          </div>

          <label className="flex items-center gap-3 rounded-xl border border-border bg-secondary p-3 text-sm text-muted-foreground">
            <input
              className="size-4 accent-[#2563eb]"
              type="checkbox"
              {...form.register("recurring")}
            />
            Criar como conta recorrente
          </label>

          <Field label="Observacoes">
            <textarea
              className="min-h-24 rounded-xl border border-input bg-input px-3 py-2 text-sm text-foreground placeholder:text-tertiary focus:border-ring focus:ring-2 focus:ring-ring/35 focus:outline-none"
              placeholder="Observacoes internas da conta"
              {...form.register("notes")}
            />
          </Field>

          {feedback ? <FormFeedback>{feedback}</FormFeedback> : null}
          {error ? (
            <div className="rounded-xl border border-destructive/30 bg-destructive/15 px-3 py-2 text-sm text-[#ffb4b4]">
              {error}
            </div>
          ) : null}

          <div className="flex justify-end">
            <Button type="submit" disabled={saving}>
              {saving ? "Salvando..." : "Salvar conta"}
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
