"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { type Client } from "@/lib/domain"
import type { ClientInput } from "@/lib/services/clients-service"
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
type ClientFormResult = { error?: string; ok: boolean }

export function ClientForm({
  client,
  saveClientAction,
}: {
  client?: Client
  saveClientAction: (
    input: ClientInput,
    clientId?: string
  ) => Promise<ClientFormResult>
}) {
  const router = useRouter()
  const mode = client ? "edit" : "create"
  const [feedback, setFeedback] = useState("")
  const [error, setError] = useState("")
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

  async function onSubmit(values: ClientFormValues) {
    setError("")
    setFeedback("")
    setSaving(true)

    const result = await saveClientAction(
      {
        address: values.address,
        documentNumber: values.documentNumber,
        email: values.email,
        fullName: values.fullName,
        notes: values.notes ?? "",
        phone: values.phone,
        status: values.status,
      },
      client?.id
    )

    setSaving(false)

    if (!result.ok) {
      setError(result.error ?? "Nao foi possivel salvar o cliente.")
      return
    }

    setFeedback(
      mode === "edit" ? "Cliente atualizado com sucesso." : "Cliente cadastrado com sucesso."
    )
    router.push("/clientes")
    router.refresh()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {mode === "edit" ? "Editar dados do cliente" : "Dados do cliente"}
        </CardTitle>
        <CardDescription>
          {mode === "edit"
            ? "Atualize os dados que identificam e qualificam o cliente."
            : "Preencha os dados principais para cadastrar o cliente."}
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

          {feedback ? <FormFeedback>{feedback}</FormFeedback> : null}
          {error ? (
            <div className="rounded-xl border border-destructive/30 bg-destructive/15 px-3 py-2 text-sm text-[#ffb4b4]">
              {error}
            </div>
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
