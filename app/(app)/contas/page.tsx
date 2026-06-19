import { ModulePage } from "@/components/app/module-page"

export default function ContasPage() {
  return (
    <ModulePage
      title="Contas mensais"
      description="Despesas pessoais, escritorio, impostos, marketing e recorrencias."
      filters={["Mes", "Categoria", "Status"]}
      rows={[
        {
          title: "Aluguel do escritorio",
          subtitle: "Categoria Escritorio | recorrente",
          status: "Pendente",
          amount: "R$ 3.200,00",
        },
        {
          title: "Sistema juridico",
          subtitle: "Categoria Sistema | mensal",
          status: "Pago",
          amount: "R$ 389,00",
        },
      ]}
    />
  )
}
