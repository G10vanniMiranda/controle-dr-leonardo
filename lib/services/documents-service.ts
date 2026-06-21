import { type DocumentRecord } from "@/lib/domain"
import { documents } from "@/lib/mock-data"
import { getDataProvider } from "@/lib/services/data-provider"
import * as supabaseService from "@/lib/services/supabase/documents-service"

export type DocumentInput = Omit<DocumentRecord, "createdAt" | "id" | "storagePath">

export function getDocuments() {
  if (getDataProvider() === "supabase") {
    return supabaseService.getDocuments()
  }

  return documents
}

export function uploadDocument(input: DocumentInput): DocumentRecord {
  if (getDataProvider() === "supabase") {
    return supabaseService.uploadDocument(input)
  }

  return {
    ...input,
    createdAt: new Date().toISOString().slice(0, 10),
    id: input.fileName.toLowerCase().replace(/\W+/g, "-"),
    storagePath: `mock/uploads/${input.fileName}`,
  }
}
