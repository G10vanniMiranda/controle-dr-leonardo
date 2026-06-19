import { ModulePage } from "@/components/app/module-page"

export default async function ClienteDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <ModulePage
      title={`Cliente ${id}`}
      description="Detalhes do cliente, processos vinculados e resumo financeiro."
    />
  )
}
