import { CasesView } from "@/components/app/cases-view"
import { getCases } from "@/lib/services/cases-service"

export default function ProcessosPage() {
  return <CasesView cases={getCases()} />
}
