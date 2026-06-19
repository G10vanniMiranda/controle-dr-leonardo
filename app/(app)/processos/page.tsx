import { ModulePage } from "@/components/app/module-page"

export default function ProcessosPage() {
  return (
    <ModulePage
      title="Processos"
      description="Controle de fases, status, partes, valores e documentos processuais."
      primaryAction={{ href: "/processos/novo", label: "Novo processo" }}
      filters={["Cliente", "Status", "Fase"]}
      rows={[
        {
          title: "0001234-56.2026.8.04.0001",
          subtitle: "Marina Almeida | Revisional contratual",
          status: "Em andamento",
          amount: "R$ 45.000,00",
        },
        {
          title: "0009876-12.2025.8.04.0001",
          subtitle: "Rafael Costa | Execucao de acordo",
          status: "Execucao",
          amount: "R$ 72.000,00",
        },
      ]}
    />
  )
}
