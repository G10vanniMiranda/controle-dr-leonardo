import { ModulePage } from "@/components/app/module-page"

export default function RelatoriosPage() {
  return (
    <ModulePage
      title="Relatorios"
      description="Recebimentos, despesas, pendencias, processos ativos e saldo mensal."
      filters={["Periodo", "Cliente", "Categoria"]}
      rows={[
        {
          title: "Recebimentos mensais",
          subtitle: "Consolidado por periodo",
          status: "Disponivel",
          amount: "R$ 42.860,00",
        },
        {
          title: "Parcelas vencidas",
          subtitle: "Pendencias por cliente",
          status: "Atencao",
          amount: "R$ 8.740,00",
        },
      ]}
    />
  )
}
