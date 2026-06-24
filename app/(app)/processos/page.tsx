import { CasesView } from "@/components/app/cases-view"
import { getCasesAsync } from "@/lib/services/server/cases-service"
import { getClientsAsync } from "@/lib/services/server/clients-service"

import { deleteCaseAction } from "./actions"

export default async function ProcessosPage() {
  const [cases, clients] = await Promise.all([getCasesAsync(), getClientsAsync()])

  return (
    <CasesView
      cases={cases}
      clients={clients}
      deleteCaseAction={deleteCaseAction}
    />
  )
}
