import { CondemnationsView } from "@/components/app/condemnations-view"
import { getCondemnations } from "@/lib/services/condemnations-service"

export default function CondenacoesPage() {
  return <CondemnationsView condemnations={getCondemnations()} />
}
