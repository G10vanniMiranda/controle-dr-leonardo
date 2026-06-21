import { DocumentsView } from "@/components/app/documents-view"
import { getDocuments } from "@/lib/mock-data"

export default function DocumentosPage() {
  return <DocumentsView documents={getDocuments()} />
}
