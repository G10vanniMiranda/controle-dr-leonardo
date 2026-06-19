import { ModulePage } from "@/components/app/module-page"

export default function ClientesPage() {
  return (
    <ModulePage
      title="Clientes"
      description="Cadastro, pesquisa e acompanhamento financeiro por cliente."
      primaryAction={{ href: "/clientes/novo", label: "Novo cliente" }}
      rows={[
        {
          title: "Marina Almeida",
          subtitle: "CPF 000.000.000-00 | 3 processos vinculados",
          status: "Ativo",
          amount: "R$ 9.600,00",
        },
        {
          title: "LS Comercio Ltda.",
          subtitle: "CNPJ 00.000.000/0001-00 | contrato empresarial",
          status: "Ativo",
          amount: "R$ 18.900,00",
        },
      ]}
    />
  )
}
