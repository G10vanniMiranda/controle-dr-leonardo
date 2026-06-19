import { ModulePage } from "@/components/app/module-page"

export default async function ProcessoDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <ModulePage
      title={`Processo ${id}`}
      description="Visao completa do processo, documentos, historico e valores."
    />
  )
}
