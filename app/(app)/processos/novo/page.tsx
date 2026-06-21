import { CaseForm } from "@/components/app/case-form"
import { PageHeading } from "@/components/app/page-heading"
import { getClients } from "@/lib/mock-data"

export default function NovoProcessoPage() {
  return (
    <div className="grid gap-6">
      <PageHeading
        eyebrow="Processos"
        title="Novo processo"
        description="Crie um processo vinculado a um cliente ja cadastrado. A persistencia sera ligada ao banco ao final."
      />
      <CaseForm clients={getClients()} />
    </div>
  )
}
