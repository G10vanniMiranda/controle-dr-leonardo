"use server"

import { revalidatePath } from "next/cache"

import {
  type DocumentModule,
  type DocumentType,
} from "@/lib/domain"
import { createClient as createSupabaseClient } from "@/lib/supabase/server"

export type DocumentUploadActionResult = {
  error?: string
  ok: boolean
}

const allowedModules: DocumentModule[] = [
  "case",
  "client",
  "condemnation",
  "debt_installment",
  "legal_fee",
]

const allowedTypes: DocumentType[] = [
  "agreement",
  "contract",
  "identity",
  "other",
  "payment_receipt",
  "petition",
  "power_of_attorney",
  "sentence",
]

function sanitizeFileName(fileName: string) {
  return fileName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase()
}

function getString(formData: FormData, key: string) {
  const value = formData.get(key)
  return typeof value === "string" ? value.trim() : ""
}

export async function uploadDocumentAction(
  formData: FormData
): Promise<DocumentUploadActionResult> {
  try {
    const documentModule = getString(formData, "module") as DocumentModule
    const type = getString(formData, "type") as DocumentType
    const linkedEntityLabel = getString(formData, "linkedEntityLabel")
    const file = formData.get("file")

    if (!allowedModules.includes(documentModule)) {
      return { error: "Módulo do documento inválido.", ok: false }
    }

    if (!allowedTypes.includes(type)) {
      return { error: "Tipo do documento inválido.", ok: false }
    }

    if (!linkedEntityLabel) {
      return { error: "Informe o vínculo do documento.", ok: false }
    }

    if (!(file instanceof File) || file.size === 0) {
      return { error: "Selecione um arquivo para enviar.", ok: false }
    }

    const supabase = await createSupabaseClient()
    const { data: userData, error: userError } = await supabase.auth.getUser()

    if (userError || !userData.user) {
      return { error: "Usuário não autenticado.", ok: false }
    }

    const storagePath = `${userData.user.id}/${documentModule}/${Date.now()}-${sanitizeFileName(
      file.name
    )}`
    const upload = await supabase.storage
      .from("legal-documents")
      .upload(storagePath, file, {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      })

    if (upload.error) {
      return { error: `Erro ao enviar arquivo: ${upload.error.message}`, ok: false }
    }

    const insert = await supabase.from("documents").insert({
      file_name: file.name,
      linked_entity_label: linkedEntityLabel,
      mime_type: file.type || "application/octet-stream",
      module: documentModule,
      size_bytes: file.size,
      storage_path: storagePath,
      type,
      user_id: userData.user.id,
    })

    if (insert.error) {
      await supabase.storage.from("legal-documents").remove([storagePath])
      return {
        error: `Erro ao registrar documento: ${insert.error.message}`,
        ok: false,
      }
    }

    revalidatePath("/documentos")
    return { ok: true }
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Não foi possivel enviar o documento.",
      ok: false,
    }
  }
}
