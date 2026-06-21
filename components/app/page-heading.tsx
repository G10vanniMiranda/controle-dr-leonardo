import { Button } from "@/components/ui/button"

type PageHeadingProps = {
  eyebrow: string
  title: string
  description: string
  action?: React.ReactNode
}

export function PageHeading({
  action,
  description,
  eyebrow,
  title,
}: PageHeadingProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          {eyebrow}
        </p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
          {title}
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  )
}

export function BackButton({ href }: { href: string }) {
  return (
    <Button asChild variant="outline">
      <a href={href}>Voltar</a>
    </Button>
  )
}
