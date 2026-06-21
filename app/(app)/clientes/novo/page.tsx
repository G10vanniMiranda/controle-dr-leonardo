import { notFound } from "next/navigation"

import { ClientForm } from "@/components/app/client-form"
import { PageHeading } from "@/components/app/page-heading"
import { getClientByIdAsync } from "@/lib/services/server/clients-service"

export default async function NovoClientePage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string | string[] }>
}) {
  const { edit } = await searchParams
  const editId = Array.isArray(edit) ? edit[0] : edit
  const client = editId ? await getClientByIdAsync(editId) : undefined

  if (editId && !client) {
    notFound()
  }

  return (
    <div className="grid gap-6">
      <PageHeading
        eyebrow="Clientes"
        title={client ? "Editar cliente" : "Novo cliente"}
        description={
          client
            ? "Atualize os dados principais do cliente."
            : "Cadastre os dados principais do cliente. Por enquanto, o salvamento e apenas simulado no frontend."
        }
      />
      <ClientForm client={client} />
    </div>
  )
}
