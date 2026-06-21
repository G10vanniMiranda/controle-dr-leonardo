import { SearchX } from "lucide-react"

import { cn } from "@/lib/utils"

export function EmptyState({
  className,
  description,
  title = "Nenhum registro encontrado",
}: {
  className?: string
  description: string
  title?: string
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-secondary/60 px-6 py-10 text-center",
        className
      )}
    >
      <span className="flex size-11 items-center justify-center rounded-xl border border-border bg-card text-primary">
        <SearchX className="size-5" />
      </span>
      <p className="mt-4 font-semibold text-foreground">{title}</p>
      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  )
}
