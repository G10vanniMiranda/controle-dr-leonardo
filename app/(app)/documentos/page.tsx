import { ModulePage } from "@/components/app/module-page"

export default function DocumentosPage() {
  return (
    <ModulePage
      title="Documentos"
      description="Contratos, procuracoes, comprovantes, peticoes, sentencas e acordos."
      filters={["Tipo", "Cliente", "Processo"]}
      rows={[
        {
          title: "Contrato de honorarios",
          subtitle: "Marina Almeida | PDF",
          status: "Vinculado",
          amount: "-",
        },
      ]}
    />
  )
}
