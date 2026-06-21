import { CasesView } from "@/components/app/cases-view"
import { legalCases } from "@/lib/mock-data"

export default function ProcessosPage() {
  return <CasesView cases={legalCases} />
}
