import { ModulePage } from "@/components/app/module-page"

export default function HonorariosPage() {
  return (
    <ModulePage
      title="Honorarios"
      description="Contratos, parcelas, vencimentos, pagamentos e saldo restante."
      filters={["Cliente", "Processo", "Status"]}
      rows={[
        {
          title: "Contrato Marina Almeida",
          subtitle: "Entrada + 6 parcelas | vencimento dia 10",
          status: "Pendente",
          amount: "R$ 8.400,00",
        },
        {
          title: "Contrato LS Comercio Ltda.",
          subtitle: "12 parcelas | 4 pagas",
          status: "Ativo",
          amount: "R$ 24.000,00",
        },
      ]}
    />
  )
}
