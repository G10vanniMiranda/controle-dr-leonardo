import { ClientsView } from "@/components/app/clients-view"
import { getClients } from "@/lib/services/clients-service"

export default function ClientesPage() {
  return <ClientsView clients={getClients()} />
}
