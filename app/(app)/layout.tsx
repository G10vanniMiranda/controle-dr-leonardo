import { cookies } from "next/headers"

import { AppShell } from "@/components/app/app-shell"

export default async function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  await cookies()

  return <AppShell>{children}</AppShell>
}
