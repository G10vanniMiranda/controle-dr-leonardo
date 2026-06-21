import "server-only"

import { activityLogs } from "@/lib/mock-data"
import { getDataProvider } from "@/lib/services/data-provider"
import type { ActivityLogInput } from "@/lib/services/activity-logs-service"
import * as supabaseService from "@/lib/services/supabase/activity-logs-service"

export async function getActivityLogsAsync() {
  return getDataProvider() === "supabase"
    ? supabaseService.getActivityLogs()
    : activityLogs
}

export async function createActivityLogAsync(input: ActivityLogInput) {
  if (getDataProvider() === "supabase") {
    return supabaseService.createActivityLog(input)
  }

  return {
    ...input,
    createdAt: new Date().toISOString(),
    id: `${input.entityType}-${Date.now()}`,
  }
}
