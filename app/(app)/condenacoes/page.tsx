import { CondemnationsView } from "@/components/app/condemnations-view"
import { getCasesAsync } from "@/lib/services/server/cases-service"
import {
  getAllCondemnationPaymentsAsync,
  getCondemnationsAsync,
} from "@/lib/services/server/condemnations-service"

export default async function CondenacoesPage() {
  const [cases, condemnations, payments] = await Promise.all([
    getCasesAsync(),
    getCondemnationsAsync(),
    getAllCondemnationPaymentsAsync(),
  ])

  return (
    <CondemnationsView
      cases={cases}
      condemnations={condemnations}
      initialPayments={payments}
    />
  )
}
