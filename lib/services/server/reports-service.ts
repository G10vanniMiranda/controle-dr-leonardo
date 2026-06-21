import "server-only"

import { getReports as getMockReports } from "@/lib/mock-data"
import { getDataProvider } from "@/lib/services/data-provider"
import * as supabaseService from "@/lib/services/supabase/reports-service"

export async function getReportsAsync() {
  return getDataProvider() === "supabase"
    ? supabaseService.getReports()
    : getMockReports()
}
