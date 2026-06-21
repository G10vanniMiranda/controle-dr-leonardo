import { LegalFeeForm } from "@/components/app/legal-fee-form"
import { LegalFeesView } from "@/components/app/legal-fees-view"
import { getCases } from "@/lib/services/cases-service"
import { getClients } from "@/lib/services/clients-service"
import { getLegalFees } from "@/lib/services/legal-fees-service"

export default function HonorariosPage() {
  return (
    <div className="grid gap-6">
      <LegalFeesView legalFees={getLegalFees()} />
      <LegalFeeForm cases={getCases()} clients={getClients()} />
    </div>
  )
}
