import { type ActivityLog } from "@/lib/domain"
import { activityLogs } from "@/lib/mock-data"
import { getDataProvider } from "@/lib/services/data-provider"
import * as supabaseService from "@/lib/services/supabase/activity-logs-service"

export type ActivityLogInput = Omit<ActivityLog, "createdAt" | "id">

export function getActivityLogs() {
  if (getDataProvider() === "supabase") {
    return supabaseService.getActivityLogs()
  }

  return activityLogs
}

export function createActivityLog(input: ActivityLogInput): ActivityLog {
  if (getDataProvider() === "supabase") {
    return supabaseService.createActivityLog(input)
  }

  return {
    ...input,
    createdAt: new Date().toISOString(),
    id: `${input.entityType}-${Date.now()}`,
  }
}
