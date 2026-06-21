import { type DocumentRecord } from "@/lib/domain"
import { documents } from "@/lib/mock-data"
import { getDataProvider } from "@/lib/services/data-provider"

export type DocumentInput = Omit<DocumentRecord, "createdAt" | "id" | "storagePath">

export function getDocuments() {
  if (getDataProvider() === "supabase") {
    throw new Error(
      "Import getDocumentsAsync from '@/lib/services/server/documents-service' in Server Components."
    )
  }

  return documents
}

export function uploadDocument(input: DocumentInput): DocumentRecord {
  if (getDataProvider() === "supabase") {
    throw new Error(
      "Import uploadDocumentAsync from '@/lib/services/server/documents-service' in Server Components."
    )
  }

  return {
    ...input,
    createdAt: new Date().toISOString().slice(0, 10),
    id: input.fileName.toLowerCase().replace(/\W+/g, "-"),
    storagePath: `mock/uploads/${input.fileName}`,
  }
}
