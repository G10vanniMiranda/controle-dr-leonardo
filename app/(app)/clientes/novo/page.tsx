import { ModulePage } from "@/components/app/module-page"

export default function NovoClientePage() {
  return (
    <ModulePage
      title="Novo cliente"
      description="Formulario inicial para nome, CPF/CNPJ, contato, endereco e observacoes."
      filters={["CPF/CNPJ", "Telefone", "E-mail"]}
    />
  )
}
