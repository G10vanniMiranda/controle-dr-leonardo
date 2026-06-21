import { SettingsView } from "@/components/app/settings-view"
import { getActivityLogsAsync } from "@/lib/services/server/activity-logs-service"

export default async function ConfiguracoesPage() {
  const activityLogs = await getActivityLogsAsync()

  return <SettingsView activityLogs={activityLogs} />
}
