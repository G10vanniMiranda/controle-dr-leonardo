import { type ActivityLog } from "@/lib/domain"
import { notImplementedForSupabase } from "@/lib/services/data-provider"
import type { ActivityLogInput } from "@/lib/services/activity-logs-service"

export function getActivityLogs(): ActivityLog[] {
  return notImplementedForSupabase("getActivityLogs")
}

export function createActivityLog(_input: ActivityLogInput): ActivityLog {
  return notImplementedForSupabase("createActivityLog")
}
