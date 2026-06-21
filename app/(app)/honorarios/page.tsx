import { LegalFeeForm } from "@/components/app/legal-fee-form"
import { LegalFeesView } from "@/components/app/legal-fees-view"
import { getCasesAsync } from "@/lib/services/server/cases-service"
import { getClientsAsync } from "@/lib/services/server/clients-service"
import {
  getAllLegalFeeInstallmentsAsync,
  getLegalFeeSummaryAsync,
  getLegalFeesAsync,
} from "@/lib/services/server/legal-fees-service"

export default async function HonorariosPage() {
  const [cases, clients, legalFees, installments] = await Promise.all([
    getCasesAsync(),
    getClientsAsync(),
    getLegalFeesAsync(),
    getAllLegalFeeInstallmentsAsync(),
  ])
  const summaries = await Promise.all(
    legalFees.map(async (legalFee) => {
      const summary = await getLegalFeeSummaryAsync(legalFee.id)
      return [legalFee.id, summary] as const
    })
  )

  return (
    <div className="grid gap-6">
      <LegalFeesView
        clients={clients}
        installments={installments}
        legalFees={legalFees}
        summariesByLegalFeeId={Object.fromEntries(summaries)}
      />
      <LegalFeeForm cases={cases} clients={clients} />
    </div>
  )
}
