import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

import { hasSupabaseEnv, getSupabaseEnv } from "./env"

const privateRoutes = [
  "/dashboard",
  "/clientes",
  "/processos",
  "/honorarios",
  "/condenacoes",
  "/parcelamentos",
  "/contas",
  "/relatorios",
  "/documentos",
  "/configuracoes",
]

function isPrivateRoute(pathname: string) {
  return privateRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  )
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request,
  })

  if (!hasSupabaseEnv()) {
    return response
  }

  const { supabasePublishableKey, supabaseUrl } = getSupabaseEnv()
  const supabase = createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        )
        response = NextResponse.next({
          request,
        })
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        )
      },
    },
  })

  const { data } = await supabase.auth.getUser()
  const pathname = request.nextUrl.pathname

  if (!data?.user && isPrivateRoute(pathname)) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = "/login"
    redirectUrl.searchParams.set("redirectTo", pathname)
    return NextResponse.redirect(redirectUrl)
  }

  if (data?.user && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return response
}
