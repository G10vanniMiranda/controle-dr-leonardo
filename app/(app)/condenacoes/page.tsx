import { CondemnationsView } from "@/components/app/condemnations-view"
import { condemnations } from "@/lib/mock-data"

export default function CondenacoesPage() {
  return <CondemnationsView condemnations={condemnations} />
}
