import { ClientForm } from "@/components/app/client-form"
import { PageHeading } from "@/components/app/page-heading"

export default function NovoClientePage() {
  return (
    <div className="grid gap-6">
      <PageHeading
        eyebrow="Clientes"
        title="Novo cliente"
        description="Cadastre os dados principais do cliente. Por enquanto, o salvamento e apenas simulado no frontend."
      />
      <ClientForm />
    </div>
  )
}
