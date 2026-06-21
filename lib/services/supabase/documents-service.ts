/* eslint-disable @typescript-eslint/no-unused-vars */
import { type DocumentRecord } from "@/lib/domain"
import { notImplementedForSupabase } from "@/lib/services/data-provider"
import type { DocumentInput } from "@/lib/services/documents-service"

export function getDocuments(): DocumentRecord[] {
  return notImplementedForSupabase("getDocuments")
}

export function uploadDocument(_input: DocumentInput): DocumentRecord {
  return notImplementedForSupabase("uploadDocument")
}
