import { getReports as getMockReports } from "@/lib/mock-data"
import { getDataProvider } from "@/lib/services/data-provider"
import * as supabaseService from "@/lib/services/supabase/reports-service"

export function getReports() {
  if (getDataProvider() === "supabase") {
    return supabaseService.getReports()
  }

  return getMockReports()
}
