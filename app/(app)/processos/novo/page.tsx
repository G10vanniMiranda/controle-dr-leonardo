import { notFound } from "next/navigation"

import { CaseForm } from "@/components/app/case-form"
import { PageHeading } from "@/components/app/page-heading"
import { getCaseByIdAsync } from "@/lib/services/server/cases-service"
import { getClientsAsync } from "@/lib/services/server/clients-service"

import { saveCaseAction } from "../actions"

export default async function NovoProcessoPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string | string[] }>
}) {
  const { edit } = await searchParams
  const editId = Array.isArray(edit) ? edit[0] : edit
  const [clients, legalCase] = await Promise.all([
    getClientsAsync(),
    editId ? getCaseByIdAsync(editId) : Promise.resolve(undefined),
  ])

  if (editId && !legalCase) {
    notFound()
  }

  return (
    <div className="grid gap-6">
      <PageHeading
        eyebrow="Processos"
        title={legalCase ? "Editar processo" : "Novo processo"}
        description={
          legalCase
            ? "Atualize os dados do processo."
            : "Crie um processo vinculado a um cliente ja cadastrado."
        }
      />
      <CaseForm
        clients={clients}
        legalCase={legalCase}
        saveCaseAction={saveCaseAction}
      />
    </div>
  )
}
