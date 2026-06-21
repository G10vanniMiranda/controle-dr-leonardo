"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, Menu, Scale, Search } from "lucide-react"

import { navigationItems, quickActions } from "@/lib/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative flex h-10 items-center gap-3 rounded-xl px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-hover hover:text-foreground",
        active &&
          "bg-hover text-foreground before:absolute before:left-0 before:h-5 before:w-1 before:rounded-full before:bg-primary"
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

  const sidebarContent = (
    <>
      <Link href="/dashboard" className="flex items-center gap-3 px-2">
        <span className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[0_12px_24px_rgba(37,99,235,0.24)]">
          <Scale className="size-5" />
        </span>
        <span>
          <span className="block text-sm font-semibold text-foreground">
            Dr. Leonardo
          </span>
          <span className="block text-xs text-muted-foreground">
            Controle juridico e financeiro
          </span>
        </span>
      </Link>

      <div className="mt-8 border-t border-sidebar-border pt-5">
        <p className="px-3 text-xs font-semibold uppercase tracking-[0.12em] text-tertiary">
          Navegacao
        </p>
        <nav className="mt-3 grid gap-1">
          {navigationItems.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </nav>
      </div>

      <div className="mt-8 rounded-2xl border border-sidebar-border bg-secondary/45 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-tertiary">
          Acoes rapidas
        </p>
        <div className="mt-3 grid gap-2">
          {quickActions.map((action) => (
            <Button
              key={action.href}
              asChild
              variant="outline"
              className="justify-start"
            >
              <Link href={action.href}>
                <action.icon className="size-4" />
                {action.label}
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </>
  )

  return (
    <div className="min-h-svh bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-sidebar-border bg-sidebar px-4 py-5 lg:block">
        {sidebarContent}
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-border bg-header/95 backdrop-blur">
          <div className="flex h-18 items-center gap-3 px-4 sm:px-6">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="size-5" />
                  <span className="sr-only">Abrir menu</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="left-4 top-4 h-[calc(100svh-2rem)] max-w-[22rem] translate-x-0 translate-y-0 overflow-y-auto p-4 data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left">
                <DialogHeader className="sr-only">
                  <DialogTitle>Menu principal</DialogTitle>
                </DialogHeader>
                {sidebarContent}
              </DialogContent>
            </Dialog>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-tertiary">
                Dr. Leonardo Controle
              </p>
              <h1 className="truncate text-base font-semibold text-foreground">
                {currentItem?.label ?? "Painel"}
              </h1>
            </div>
            <div className="hidden w-full max-w-sm items-center gap-2 rounded-xl border border-border bg-input px-3 sm:flex">
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
            <div className="hidden items-center gap-3 rounded-2xl border border-border bg-secondary px-3 py-2 sm:flex">
              <div className="flex size-9 items-center justify-center rounded-xl bg-hover text-sm font-semibold text-foreground">
                DL
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-foreground">Dr. Leonardo</p>
                <p className="text-xs text-muted-foreground">Administrador</p>
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 py-7 pb-24 sm:px-6 lg:px-8 lg:pb-10">
          {children}
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-border bg-header p-2 lg:hidden">
        {navigationItems.slice(0, 5).map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`)
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-[0.68rem] text-muted-foreground transition-colors hover:bg-hover hover:text-foreground",
                active &&
                  "bg-hover text-foreground before:absolute before:top-1 before:h-0.5 before:w-6 before:rounded-full before:bg-primary"
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
