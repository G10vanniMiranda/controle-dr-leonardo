import { ModulePage } from "@/components/app/module-page"

export default function ParcelamentosPage() {
  return (
    <ModulePage
      title="Parcelamentos"
      description="Quitacao de dividas, parcelas geradas e comprovantes."
      filters={["Cliente", "Status", "Vencimento"]}
      rows={[
        {
          title: "Quitacao acordo extrajudicial",
          subtitle: "10 parcelas | 2 vencidas",
          status: "Ativo",
          amount: "R$ 15.500,00",
        },
      ]}
    />
  )
}
