"use client"

import { useEffect } from "react"

import {
  BackToDashboardButton,
  RetryButton,
  RouteState,
} from "@/components/app/route-state"

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <RouteState
      action={
        <>
          <RetryButton onRetry={unstable_retry} />
          <BackToDashboardButton />
        </>
      }
      description="Uma falha inesperada impediu o carregamento desta área. Tente novamente ou retorne ao dashboard para continuar usando o sistema."
      eyebrow={error.digest ? `Erro ${error.digest}` : "Erro de sistema"}
      title="Não foi possível carregar esta tela"
    />
  )
}
