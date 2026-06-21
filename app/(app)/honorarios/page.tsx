import { LegalFeeForm } from "@/components/app/legal-fee-form"
import { LegalFeesView } from "@/components/app/legal-fees-view"
import { getClients, legalCases, legalFees } from "@/lib/mock-data"

export default function HonorariosPage() {
  return (
    <div className="grid gap-6">
      <LegalFeesView legalFees={legalFees} />
      <LegalFeeForm cases={legalCases} clients={getClients()} />
    </div>
  )
}
