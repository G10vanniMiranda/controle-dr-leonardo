import Link from "next/link"
import { ArrowLeft, RefreshCw, ShieldAlert } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

type RouteStateProps = {
  action?: React.ReactNode
  description: string
  eyebrow: string
  title: string
}

export function RouteState({
  action,
  description,
  eyebrow,
  title,
}: RouteStateProps) {
  return (
    <div className="flex min-h-[calc(100vh-9rem)] items-center justify-center">
      <Card className="w-full max-w-xl">
        <CardContent className="px-6 py-10 text-center sm:px-10">
          <span className="mx-auto flex size-12 items-center justify-center rounded-2xl border border-border bg-secondary text-primary">
            <ShieldAlert className="size-5" />
          </span>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            {eyebrow}
          </p>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground">
            {title}
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
            {description}
          </p>
          {action ? (
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              {action}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}

export function BackToDashboardButton() {
  return (
    <Button asChild variant="outline">
      <Link href="/dashboard">
        <ArrowLeft className="size-4" />
        Voltar ao dashboard
      </Link>
    </Button>
  )
}

export function RetryButton({ onRetry }: { onRetry: () => void }) {
  return (
    <Button onClick={onRetry}>
      <RefreshCw className="size-4" />
      Tentar novamente
    </Button>
  )
}
