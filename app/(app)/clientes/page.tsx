import { ClientsView } from "@/components/app/clients-view"
import { getClients } from "@/lib/mock-data"

export default function ClientesPage() {
  return <ClientsView clients={getClients()} />
}
