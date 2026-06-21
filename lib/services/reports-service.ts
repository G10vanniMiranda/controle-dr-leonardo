import { getReports as getMockReports } from "@/lib/mock-data"
import { getDataProvider } from "@/lib/services/data-provider"

export function getReports() {
  if (getDataProvider() === "supabase") {
    throw new Error(
      "Import getReportsAsync from '@/lib/services/server/reports-service' in Server Components."
    )
  }

  return getMockReports()
}
