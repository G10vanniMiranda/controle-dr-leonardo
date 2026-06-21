"use client"

import { useState } from "react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { CheckCircle2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { type Client, caseStatusLabels } from "@/lib/mock-data"
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
  caseNumber: z.string().min(10, "Informe o numero do processo."),
  clientId: z.string().min(1, "Selecione um cliente."),
  court: z.string().min(2, "Informe a vara."),
  district: z.string().min(2, "Informe a comarca."),
  opposingParty: z.string().min(3, "Informe a parte contraria."),
  proceduralPhase: z.string().min(3, "Informe a fase processual."),
  state: z.string().min(2, "Informe o estado."),
  status: z.string().min(1),
  claimValue: z.string().min(1, "Informe o valor da causa."),
  startDate: z.string().min(1, "Informe a data de inicio."),
  notes: z.string().optional(),
})

type CaseFormValues = z.infer<typeof caseSchema>

export function CaseForm({ clients }: { clients: Client[] }) {
  const [saved, setSaved] = useState(false)
  const form = useForm<CaseFormValues>({
    resolver: zodResolver(caseSchema),
    defaultValues: {
      actionType: "",
      caseNumber: "",
      claimValue: "",
      clientId: clients[0]?.id ?? "",
      court: "",
      district: "Manaus",
      notes: "",
      opposingParty: "",
      proceduralPhase: "",
      startDate: "",
      state: "AM",
      status: "in_review",
    },
  })

  function onSubmit() {
    setSaved(true)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dados do processo</CardTitle>
        <CardDescription>
          Todo processo ja nasce vinculado a um cliente, conforme a regra de negocio.
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
            <Field label="Numero do processo" error={form.formState.errors.caseNumber?.message}>
              <Input placeholder="0000000-00.2026.8.04.0001" {...form.register("caseNumber")} />
            </Field>
            <Field label="Tipo da acao" error={form.formState.errors.actionType?.message}>
              <Input placeholder="Ex.: Revisional contratual" {...form.register("actionType")} />
            </Field>
            <Field label="Parte contraria" error={form.formState.errors.opposingParty?.message}>
              <Input placeholder="Nome da parte contraria" {...form.register("opposingParty")} />
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
              <Input placeholder="R$ 45.000,00" {...form.register("claimValue")} />
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

          <Field label="Observacoes">
            <textarea
              className="min-h-28 rounded-xl border border-input bg-input px-3 py-2 text-sm text-foreground placeholder:text-tertiary focus:border-ring focus:ring-2 focus:ring-ring/35 focus:outline-none"
              placeholder="Historico interno ou orientacoes do processo"
              {...form.register("notes")}
            />
          </Field>

          {saved ? (
            <div className="flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-3 py-2 text-sm text-[#9db8ff]">
              <CheckCircle2 className="size-4" />
              Processo salvo no mock. Depois, este fluxo gravara em Supabase.
            </div>
          ) : null}

          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button asChild variant="outline">
              <Link href="/processos">Cancelar</Link>
            </Button>
            <Button type="submit">Salvar processo</Button>
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
