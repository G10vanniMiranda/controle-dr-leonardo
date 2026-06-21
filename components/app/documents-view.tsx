"use client"

import { useMemo, useState } from "react"
import { FileArchive, FileUp, Search, ShieldCheck } from "lucide-react"

import { dateFormatter } from "@/lib/formatters"
import {
  type DocumentRecord,
  documentModuleLabels,
  documentTypeLabels,
} from "@/lib/domain"
import { EmptyState } from "@/components/app/empty-state"
import { FormFeedback } from "@/components/app/form-feedback"
import {
  ListPagination,
  SortHeader,
  useListControls,
} from "@/components/app/list-controls"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type DocumentSortKey = "createdAt" | "fileName" | "linkedEntity" | "module" | "type"

const documentSortAccessors: Record<
  DocumentSortKey,
  (document: DocumentRecord) => number | string
> = {
  createdAt: (document) => document.createdAt,
  fileName: (document) => document.fileName,
  linkedEntity: (document) => document.linkedEntityLabel,
  module: (document) => documentModuleLabels[document.module],
  type: (document) => documentTypeLabels[document.type],
}

export function DocumentsView({ documents }: { documents: DocumentRecord[] }) {
  const [query, setQuery] = useState("")
  const [module, setModule] = useState("todos")
  const [type, setType] = useState("todos")
  const [uploadedFile, setUploadedFile] = useState<string | null>(null)

  const filteredDocuments = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return documents.filter((document) => {
      const matchesModule = module === "todos" || document.module === module
      const matchesType = type === "todos" || document.type === type
      const matchesQuery =
        !normalizedQuery ||
        document.fileName.toLowerCase().includes(normalizedQuery) ||
        document.linkedEntityLabel.toLowerCase().includes(normalizedQuery)

      return matchesModule && matchesType && matchesQuery
    })
  }, [documents, module, query, type])

  const {
    canNextPage,
    canPreviousPage,
    endIndex,
    page,
    pageItems,
    setNextPage,
    setPreviousPage,
    sort,
    startIndex,
    toggleSort,
    totalPages,
  } = useListControls<DocumentRecord, DocumentSortKey>({
    initialSort: { direction: "desc", field: "createdAt" },
    items: filteredDocuments,
    pageSize: 6,
    sortAccessors: documentSortAccessors,
  })

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          Fase 6
        </p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
          Documentos
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Anexos vinculados a clientes, processos, honorarios, condenacoes e parcelamentos.
        </p>
      </div>

      <section className="grid gap-4 lg:grid-cols-[1fr_420px]">
        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
            <CardDescription>
              Pesquisa e vinculacao visual dos documentos protegidos por usuario.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-[1fr_200px_220px]">
              <div className="relative">
                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-tertiary" />
                <Input
                  className="pl-9"
                  placeholder="Buscar documento"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </div>
              <select
                className="h-10 rounded-xl border border-input bg-input px-3 text-sm text-foreground focus:border-ring focus:ring-2 focus:ring-ring/35 focus:outline-none"
                value={module}
                onChange={(event) => setModule(event.target.value)}
              >
                <option value="todos">Todos os modulos</option>
                {Object.entries(documentModuleLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <select
                className="h-10 rounded-xl border border-input bg-input px-3 text-sm text-foreground focus:border-ring focus:ring-2 focus:ring-ring/35 focus:outline-none"
                value={type}
                onChange={(event) => setType(event.target.value)}
              >
                <option value="todos">Todos os tipos</option>
                {Object.entries(documentTypeLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upload simulado</CardTitle>
            <CardDescription>
              O arquivo sera enviado ao Supabase Storage quando o banco for conectado.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-secondary p-4 text-center text-sm text-muted-foreground transition-colors hover:bg-hover">
              <FileUp className="mb-2 size-5 text-primary" />
              <span>{uploadedFile ?? "Selecionar arquivo"}</span>
              <input
                className="sr-only"
                type="file"
                onChange={(event) => {
                  setUploadedFile(event.target.files?.[0]?.name ?? null)
                }}
              />
            </label>
            {uploadedFile ? (
              <FormFeedback>
                Arquivo selecionado no mock. O envio real sera ligado ao Supabase
                Storage.
              </FormFeedback>
            ) : null}
            <div className="flex items-center gap-2 rounded-xl border border-border bg-secondary p-3 text-sm text-muted-foreground">
              <ShieldCheck className="size-4 text-primary" />
              Documentos ficarao protegidos por usuario no Storage.
            </div>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Arquivos vinculados</CardTitle>
          <CardDescription>
            {filteredDocuments.length} documento(s) encontrado(s) no mock local.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <SortHeader field="fileName" sort={sort} onSort={toggleSort}>
                    Arquivo
                  </SortHeader>
                </TableHead>
                <TableHead>
                  <SortHeader field="type" sort={sort} onSort={toggleSort}>
                    Tipo
                  </SortHeader>
                </TableHead>
                <TableHead>
                  <SortHeader field="module" sort={sort} onSort={toggleSort}>
                    Modulo
                  </SortHeader>
                </TableHead>
                <TableHead>
                  <SortHeader
                    field="linkedEntity"
                    sort={sort}
                    onSort={toggleSort}
                  >
                    Vinculo
                  </SortHeader>
                </TableHead>
                <TableHead className="text-right">
                  <SortHeader
                    align="right"
                    field="createdAt"
                    sort={sort}
                    onSort={toggleSort}
                  >
                    Data
                  </SortHeader>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageItems.map((document) => (
                <TableRow key={document.id}>
                  <TableCell>
                    <div className="flex items-center gap-2 font-medium text-foreground">
                      <FileArchive className="size-4 text-primary" />
                      {document.fileName}
                    </div>
                    <div className="text-xs text-tertiary">
                      {(document.sizeBytes / 1000).toFixed(0)} KB | {document.storagePath}
                    </div>
                  </TableCell>
                  <TableCell>{documentTypeLabels[document.type]}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {documentModuleLabels[document.module]}
                    </Badge>
                  </TableCell>
                  <TableCell>{document.linkedEntityLabel}</TableCell>
                  <TableCell className="text-right">
                    {dateFormatter.format(new Date(document.createdAt))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredDocuments.length === 0 ? (
            <EmptyState
              className="mt-4"
              title="Nenhum documento encontrado"
              description="Revise modulo, tipo ou termo de busca para localizar arquivos vinculados."
            />
          ) : (
            <ListPagination
              canNextPage={canNextPage}
              canPreviousPage={canPreviousPage}
              endIndex={endIndex}
              onNextPage={setNextPage}
              onPreviousPage={setPreviousPage}
              page={page}
              startIndex={startIndex}
              totalCount={filteredDocuments.length}
              totalPages={totalPages}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
