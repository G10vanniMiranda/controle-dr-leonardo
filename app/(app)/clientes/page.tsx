import { ClientsView } from "@/components/app/clients-view"
import {
  getCasesByClientIdAsync,
  getClientsAsync,
} from "@/lib/services/server/clients-service"

export default async function ClientesPage() {
  const clients = await getClientsAsync()
  const caseCounts = await Promise.all(
    clients.map(async (client) => {
      const cases = await getCasesByClientIdAsync(client.id)
      return [client.id, cases.length] as const
    })
  )

  return (
    <ClientsView
      caseCountsByClientId={Object.fromEntries(caseCounts)}
      clients={clients}
    />
  )
}
