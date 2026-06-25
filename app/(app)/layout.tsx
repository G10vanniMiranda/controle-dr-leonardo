import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { AppShell } from "@/components/app/app-shell"
import { createClient } from "@/lib/supabase/server"

export default async function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  await cookies()
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data.user) {
    redirect("/login")
  }

  return <AppShell>{children}</AppShell>
}
