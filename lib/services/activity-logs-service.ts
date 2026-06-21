import { type ActivityLog } from "@/lib/domain"
import { activityLogs } from "@/lib/mock-data"
import { getDataProvider } from "@/lib/services/data-provider"

export type ActivityLogInput = Omit<ActivityLog, "createdAt" | "id">

export function getActivityLogs() {
  if (getDataProvider() === "supabase") {
    throw new Error(
      "Import getActivityLogsAsync from '@/lib/services/server/activity-logs-service' in Server Components."
    )
  }

  return activityLogs
}

export async function getActivityLogsAsync() {
  if (getDataProvider() === "supabase") {
    throw new Error(
      "Import getActivityLogsAsync from '@/lib/services/server/activity-logs-service' in Server Components."
    )
  }

  return activityLogs
}

export function createActivityLog(input: ActivityLogInput): ActivityLog {
  if (getDataProvider() === "supabase") {
    throw new Error(
      "Import createActivityLogAsync from '@/lib/services/server/activity-logs-service' in Server Components."
    )
  }

  return {
    ...input,
    createdAt: new Date().toISOString(),
    id: `${input.entityType}-${Date.now()}`,
  }
}

export async function createActivityLogAsync(input: ActivityLogInput) {
  if (getDataProvider() === "supabase") {
    throw new Error(
      "Import createActivityLogAsync from '@/lib/services/server/activity-logs-service' in Server Components."
    )
  }

  return createActivityLog(input)
}
