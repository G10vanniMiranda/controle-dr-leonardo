"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { CheckCircle2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { monthlyBillCategoryLabels } from "@/lib/mock-data"
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
  value: z.coerce.number().min(1, "Informe o valor."),
})

type BillInput = z.input<typeof billSchema>
type BillOutput = z.output<typeof billSchema>

export function MonthlyBillForm() {
  const [saved, setSaved] = useState(false)
  const form = useForm<BillInput, unknown, BillOutput>({
    resolver: zodResolver(billSchema),
    defaultValues: {
      category: "office",
      description: "",
      dueDate: new Date().toISOString().slice(0, 10),
      notes: "",
      recurring: false,
      value: 100,
    },
  })

  function onSubmit() {
    setSaved(true)
  }

  return (
    <Card id="nova-conta">
      <CardHeader>
        <CardTitle>Nova conta mensal</CardTitle>
        <CardDescription>
          Formulario mockado para despesas recorrentes ou avulsas.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-5" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Descricao" error={form.formState.errors.description?.message}>
              <Input placeholder="Ex.: Aluguel do escritorio" {...form.register("description")} />
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
              <Input type="number" min="1" step="0.01" {...form.register("value")} />
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

          {saved ? (
            <div className="flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-3 py-2 text-sm text-[#9db8ff]">
              <CheckCircle2 className="size-4" />
              Conta salva no mock. Depois, este fluxo gravara em monthly_bills.
            </div>
          ) : null}

          <div className="flex justify-end">
            <Button type="submit">Salvar conta</Button>
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
