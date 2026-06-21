import { DocumentsView } from "@/components/app/documents-view"
import { getDocumentsAsync } from "@/lib/services/server/documents-service"

export default async function DocumentosPage() {
  const documents = await getDocumentsAsync()

  return <DocumentsView documents={documents} />
}
