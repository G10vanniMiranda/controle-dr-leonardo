"use client"

import { useMemo, useState } from "react"
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

import { Button } from "@/components/ui/button"

type SortDirection = "asc" | "desc"
type SortValue = number | string

export type SortState<TSortKey extends string> = {
  direction: SortDirection
  field: TSortKey
}

function compareSortValues(first: SortValue, second: SortValue) {
  if (typeof first === "number" && typeof second === "number") {
    return first - second
  }

  return String(first).localeCompare(String(second), "pt-BR", {
    numeric: true,
    sensitivity: "base",
  })
}

export function useListControls<TItem, TSortKey extends string>({
  initialSort,
  items,
  pageSize = 6,
  sortAccessors,
}: {
  initialSort: SortState<TSortKey>
  items: TItem[]
  pageSize?: number
  sortAccessors: Record<TSortKey, (item: TItem) => SortValue>
}) {
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState<SortState<TSortKey>>(initialSort)

  const totalPages = Math.max(Math.ceil(items.length / pageSize), 1)
  const currentPage = Math.min(page, totalPages)

  const sortedItems = useMemo(() => {
    const accessor = sortAccessors[sort.field]

    return [...items].sort((first, second) => {
      const result = compareSortValues(accessor(first), accessor(second))
      return sort.direction === "asc" ? result : -result
    })
  }, [items, sort.direction, sort.field, sortAccessors])

  const startIndex = (currentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, sortedItems.length)
  const pageItems = sortedItems.slice(startIndex, endIndex)

  function toggleSort(field: TSortKey) {
    setPage(1)
    setSort((currentSort) => ({
      direction:
        currentSort.field === field && currentSort.direction === "asc"
          ? "desc"
          : "asc",
      field,
    }))
  }

  return {
    canNextPage: currentPage < totalPages,
    canPreviousPage: currentPage > 1,
    endIndex,
    page: currentPage,
    pageItems,
    setNextPage: () =>
      setPage((currentPage) => Math.min(currentPage + 1, totalPages)),
    setPreviousPage: () => setPage((currentPage) => Math.max(currentPage - 1, 1)),
    sort,
    startIndex,
    toggleSort,
    totalPages,
  }
}

export function SortHeader<TSortKey extends string>({
  align = "left",
  children,
  field,
  sort,
  onSort,
}: {
  align?: "left" | "right"
  children: React.ReactNode
  field: TSortKey
  sort: SortState<TSortKey>
  onSort: (field: TSortKey) => void
}) {
  const active = sort.field === field
  const Icon = !active ? ArrowUpDown : sort.direction === "asc" ? ArrowUp : ArrowDown

  return (
    <button
      type="button"
      className={
        align === "right"
          ? "ml-auto inline-flex items-center gap-2 text-right transition-colors hover:text-foreground"
          : "inline-flex items-center gap-2 transition-colors hover:text-foreground"
      }
      onClick={() => onSort(field)}
    >
      {children}
      <Icon className="size-3" />
    </button>
  )
}

export function ListPagination({
  canNextPage,
  canPreviousPage,
  endIndex,
  onNextPage,
  onPreviousPage,
  page,
  startIndex,
  totalCount,
  totalPages,
}: {
  canNextPage: boolean
  canPreviousPage: boolean
  endIndex: number
  onNextPage: () => void
  onPreviousPage: () => void
  page: number
  startIndex: number
  totalCount: number
  totalPages: number
}) {
  if (totalCount === 0) {
    return null
  }

  return (
    <div className="mt-4 flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
      <span>
        Mostrando {startIndex + 1}-{endIndex} de {totalCount} registros
      </span>
      <div className="flex items-center gap-2">
        <span className="hidden text-xs text-tertiary sm:inline">
          Pagina {page} de {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={!canPreviousPage}
          onClick={onPreviousPage}
        >
          <ChevronLeft className="size-4" />
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={!canNextPage}
          onClick={onNextPage}
        >
          Proxima
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}
