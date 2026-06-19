import { ModulePage } from "@/components/app/module-page"

export default function CondenacoesPage() {
  return (
    <ModulePage
      title="Condenacoes"
      description="Valores de condenacao, atualizacao, pagamentos e execucao."
      filters={["Processo", "Status", "Parte devedora"]}
      rows={[
        {
          title: "Rafael Costa x Banco Alfa",
          subtitle: "Valor atualizado com juros e multa",
          status: "Em execucao",
          amount: "R$ 32.100,00",
        },
      ]}
    />
  )
}
