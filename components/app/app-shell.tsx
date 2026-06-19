"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, Menu, Scale, Search } from "lucide-react"

import { navigationItems, quickActions } from "@/lib/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

function NavLink({
  href,
  icon: Icon,
  label,
}: {
  href: string
  icon: React.ComponentType<{ className?: string }>
  label: string
}) {
  const pathname = usePathname()
  const active = pathname === href || pathname.startsWith(`${href}/`)

  return (
    <Link
      href={href}
      className={cn(
        "flex h-9 items-center gap-3 rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
        active && "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
      )}
    >
      <Icon className="size-4" />
      <span>{label}</span>
    </Link>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const currentItem = navigationItems.find(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`)
  )

  return (
    <div className="min-h-svh bg-muted/30 text-foreground">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r bg-background px-4 py-5 lg:block">
        <Link href="/dashboard" className="flex items-center gap-3 px-2">
          <span className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Scale className="size-5" />
          </span>
          <span>
            <span className="block text-sm font-semibold">Dr. Leonardo</span>
            <span className="block text-xs text-muted-foreground">
              Controle juridico e financeiro
            </span>
          </span>
        </Link>

        <nav className="mt-8 grid gap-1">
          {navigationItems.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </nav>

        <div className="mt-8 rounded-lg border bg-muted/40 p-3">
          <p className="text-xs font-medium uppercase text-muted-foreground">
            Acoes rapidas
          </p>
          <div className="mt-3 grid gap-2">
            {quickActions.map((action) => (
              <Button key={action.href} asChild variant="outline" className="justify-start">
                <Link href={action.href}>
                  <action.icon className="size-4" />
                  {action.label}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="size-5" />
              <span className="sr-only">Abrir menu</span>
            </Button>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted-foreground">Area autenticada</p>
              <h1 className="truncate text-base font-semibold">
                {currentItem?.label ?? "Painel"}
              </h1>
            </div>
            <div className="hidden w-full max-w-xs items-center gap-2 rounded-lg border bg-background px-3 sm:flex">
              <Search className="size-4 text-muted-foreground" />
              <Input
                className="h-9 border-0 px-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder="Buscar cliente, processo ou CPF"
              />
            </div>
            <Button variant="outline" size="icon">
              <Bell className="size-4" />
              <span className="sr-only">Notificacoes</span>
            </Button>
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium">Dr. Leonardo</p>
              <p className="text-xs text-muted-foreground">Administrador</p>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 pb-24 sm:px-6 lg:pb-8">{children}</main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t bg-background p-2 lg:hidden">
        {navigationItems.slice(0, 5).map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 rounded-lg px-2 py-2 text-[0.68rem] text-muted-foreground",
                active && "bg-primary text-primary-foreground"
              )}
            >
              <item.icon className="size-4" />
              <span className="max-w-full truncate">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
