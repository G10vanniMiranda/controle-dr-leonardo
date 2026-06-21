import "server-only"

import { documents } from "@/lib/mock-data"
import { getDataProvider } from "@/lib/services/data-provider"
import type { DocumentInput } from "@/lib/services/documents-service"
import * as supabaseService from "@/lib/services/supabase/documents-service"

export async function getDocumentsAsync() {
  return getDataProvider() === "supabase"
    ? supabaseService.getDocuments()
    : documents
}

export async function uploadDocumentAsync(input: DocumentInput) {
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
