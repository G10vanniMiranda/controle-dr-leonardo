"use client"

import { useState } from "react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { type Client } from "@/lib/domain"
import { formatCpfCnpj, formatPhone, onlyDigits } from "@/lib/input-masks"
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

const clientSchema = z.object({
  fullName: z.string().min(3, "Informe o nome completo."),
  documentNumber: z
    .string()
    .refine((value) => [11, 14].includes(onlyDigits(value).length), {
      message: "Informe CPF ou CNPJ completo.",
    }),
  phone: z.string().refine((value) => onlyDigits(value).length >= 10, {
    message: "Informe um telefone completo.",
  }),
  email: z.string().email("Informe um e-mail valido."),
  address: z.string().min(5, "Informe o endereco."),
  status: z.enum(["active", "inactive"]),
  notes: z.string().optional(),
})

type ClientFormValues = z.infer<typeof clientSchema>

export function ClientForm({ client }: { client?: Client }) {
  const mode = client ? "edit" : "create"
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      address: client?.address ?? "",
      documentNumber: client?.documentNumber ?? "",
      email: client?.email ?? "",
      fullName: client?.fullName ?? "",
      notes: client?.notes ?? "",
      phone: client?.phone ?? "",
      status: client?.status ?? "active",
    },
  })

  function onSubmit() {
    setSaving(true)
    setSaved(true)
    window.setTimeout(() => setSaving(false), 450)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {mode === "edit" ? "Editar dados do cliente" : "Dados do cliente"}
        </CardTitle>
        <CardDescription>
          {mode === "edit"
            ? "Alteracoes simuladas no mock, mantendo a validacao prevista para o Supabase."
            : "Formulario mockado com a mesma validacao que sera usada no Supabase."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-5" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Nome completo" error={form.formState.errors.fullName?.message}>
              <Input placeholder="Ex.: Marina Almeida" {...form.register("fullName")} />
            </Field>
            <Field label="CPF/CNPJ" error={form.formState.errors.documentNumber?.message}>
              <Input
                placeholder="000.000.000-00"
                {...form.register("documentNumber")}
                onChange={(event) => {
                  form.setValue(
                    "documentNumber",
                    formatCpfCnpj(event.target.value),
                    { shouldDirty: true, shouldValidate: true }
                  )
                }}
              />
            </Field>
            <Field label="Telefone" error={form.formState.errors.phone?.message}>
              <Input
                placeholder="(92) 99999-9999"
                {...form.register("phone")}
                onChange={(event) => {
                  form.setValue("phone", formatPhone(event.target.value), {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }}
              />
            </Field>
            <Field label="E-mail" error={form.formState.errors.email?.message}>
              <Input placeholder="cliente@email.com" {...form.register("email")} />
            </Field>
            <Field label="Endereco" error={form.formState.errors.address?.message}>
              <Input placeholder="Rua, numero, bairro, cidade" {...form.register("address")} />
            </Field>
            <Field label="Status">
              <select
                className="h-10 rounded-xl border border-input bg-input px-3 text-sm text-foreground focus:border-ring focus:ring-2 focus:ring-ring/35 focus:outline-none"
                {...form.register("status")}
              >
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
              </select>
            </Field>
          </div>

          <Field label="Observacoes">
            <textarea
              className="min-h-28 rounded-xl border border-input bg-input px-3 py-2 text-sm text-foreground placeholder:text-tertiary focus:border-ring focus:ring-2 focus:ring-ring/35 focus:outline-none"
              placeholder="Notas internas sobre o cliente"
              {...form.register("notes")}
            />
          </Field>

          {saved ? (
            <FormFeedback>
              {mode === "edit"
                ? "Cliente atualizado no mock. A persistencia real sera ligada ao banco no final."
                : "Cliente salvo no mock. A persistencia real sera ligada ao banco no final."}
            </FormFeedback>
          ) : null}

          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button asChild variant="outline">
              <Link href="/clientes">Cancelar</Link>
            </Button>
            <Button type="submit" disabled={saving}>
              {saving
                ? "Salvando..."
                : mode === "edit"
                  ? "Atualizar cliente"
                  : "Salvar cliente"}
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
