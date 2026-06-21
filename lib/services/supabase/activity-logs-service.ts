import { type ActivityLog } from "@/lib/domain"
import type { ActivityLogInput } from "@/lib/services/activity-logs-service"
import { createClient as createSupabaseClient } from "@/lib/supabase/server"

type ActivityLogRow = {
  id: string
  entity_type: string
  entity_id: string | null
  entity_label: string | null
  action: string
  actor: string | null
  metadata: Record<string, unknown> | string | null
  created_at: string
}

function mapActivityLogRow(row: ActivityLogRow): ActivityLog {
  return {
    action: row.action,
    actor: row.actor ?? "",
    createdAt: row.created_at,
    entityLabel: row.entity_label ?? row.entity_id ?? "",
    entityType: row.entity_type,
    id: row.id,
    metadata:
      typeof row.metadata === "string"
        ? row.metadata
        : JSON.stringify(row.metadata ?? {}),
  }
}

function toActivityLogPayload(input: ActivityLogInput) {
  return {
    action: input.action,
    actor: input.actor,
    entity_label: input.entityLabel,
    entity_type: input.entityType,
    metadata: parseMetadata(input.metadata),
  }
}

function parseMetadata(metadata: string) {
  try {
    return metadata ? JSON.parse(metadata) : {}
  } catch {
    return { note: metadata }
  }
}

async function getCurrentUserId() {
  const supabase = await createSupabaseClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data.user) {
    throw new Error("Usuario nao autenticado.")
  }

  return { supabase, userId: data.user.id }
}

export async function getActivityLogs(): Promise<ActivityLog[]> {
  const { supabase } = await getCurrentUserId()
  const { data, error } = await supabase
    .from("activity_logs")
    .select(
      "id, entity_type, entity_id, entity_label, action, actor, metadata, created_at"
    )
    .order("created_at", { ascending: false })
    .limit(50)

  if (error) {
    throw new Error(`Erro ao carregar logs de atividade: ${error.message}`)
  }

  return (data ?? []).map((row) => mapActivityLogRow(row as ActivityLogRow))
}

export async function createActivityLog(
  input: ActivityLogInput
): Promise<ActivityLog> {
  const { supabase, userId } = await getCurrentUserId()
  const { data, error } = await supabase
    .from("activity_logs")
    .insert({ ...toActivityLogPayload(input), user_id: userId })
    .select(
      "id, entity_type, entity_id, entity_label, action, actor, metadata, created_at"
    )
    .single()

  if (error) {
    throw new Error(`Erro ao criar log de atividade: ${error.message}`)
  }

  return mapActivityLogRow(data as ActivityLogRow)
}
