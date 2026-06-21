import { ReportsView } from "@/components/app/reports-view"
import { getClientsAsync } from "@/lib/services/server/clients-service"
import { getReportsAsync } from "@/lib/services/server/reports-service"

export default async function RelatoriosPage() {
  const [clients, reports] = await Promise.all([
    getClientsAsync(),
    getReportsAsync(),
  ])

  return <ReportsView clients={clients} reports={reports} />
}
