import { type DocumentRecord } from "@/lib/domain"
import type { DocumentInput } from "@/lib/services/documents-service"
import { createClient as createSupabaseClient } from "@/lib/supabase/server"

type DocumentRow = {
  id: string
  user_id: string
  module: DocumentRecord["module"]
  type: DocumentRecord["type"]
  linked_entity_label: string
  client_id: string | null
  case_id: string | null
  file_name: string
  storage_path: string
  mime_type: string | null
  size_bytes: number | null
  created_at: string
}

function mapDocumentRow(row: DocumentRow): DocumentRecord {
  return {
    caseId: row.case_id ?? undefined,
    clientId: row.client_id ?? undefined,
    createdAt: row.created_at,
    fileName: row.file_name,
    id: row.id,
    linkedEntityLabel: row.linked_entity_label,
    mimeType: row.mime_type ?? "",
    module: row.module,
    sizeBytes: row.size_bytes ?? 0,
    storagePath: row.storage_path,
    type: row.type,
    userId: row.user_id,
  }
}

function sanitizeFileName(fileName: string) {
  return fileName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase()
}

async function getCurrentUserId() {
  const supabase = await createSupabaseClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data.user) {
    throw new Error("Usuario nao autenticado.")
  }

  return { supabase, userId: data.user.id }
}

const documentColumns =
  "id, user_id, module, type, linked_entity_label, client_id, case_id, file_name, storage_path, mime_type, size_bytes, created_at"

export async function getDocuments(): Promise<DocumentRecord[]> {
  const { supabase } = await getCurrentUserId()
  const { data, error } = await supabase
    .from("documents")
    .select(documentColumns)
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error(`Erro ao carregar documentos: ${error.message}`)
  }

  return (data ?? []).map((row) => mapDocumentRow(row as DocumentRow))
}

export async function uploadDocument(
  input: DocumentInput
): Promise<DocumentRecord> {
  const { supabase, userId } = await getCurrentUserId()
  const storagePath = `${userId}/${input.module}/${Date.now()}-${sanitizeFileName(
    input.fileName
  )}`
  const { data, error } = await supabase
    .from("documents")
    .insert({
      case_id: input.caseId ?? null,
      client_id: input.clientId ?? null,
      file_name: input.fileName,
      linked_entity_label: input.linkedEntityLabel,
      mime_type: input.mimeType,
      module: input.module,
      size_bytes: input.sizeBytes,
      storage_path: storagePath,
      type: input.type,
      user_id: userId,
    })
    .select(documentColumns)
    .single()

  if (error) {
    throw new Error(`Erro ao registrar documento: ${error.message}`)
  }

  return mapDocumentRow(data as DocumentRow)
}
