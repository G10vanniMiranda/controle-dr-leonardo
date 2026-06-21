import { DocumentsView } from "@/components/app/documents-view"
import { getDocuments } from "@/lib/services/documents-service"

export default function DocumentosPage() {
  return <DocumentsView documents={getDocuments()} />
}
