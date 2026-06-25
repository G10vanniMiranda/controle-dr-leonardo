import "server-only"

import {
  condemnations,
  getCondemnationPayments,
  getCondemnationSummary,
} from "@/lib/mock-data"
import type { Condemnation } from "@/lib/domain"
import { getDataProvider } from "@/lib/services/data-provider"
import type {
  CondemnationInput,
  CondemnationUpdateInput,
} from "@/lib/services/condemnations-service"
import * as supabaseService from "@/lib/services/supabase/condemnations-service"

export async function getCondemnationsAsync() {
  return getDataProvider() === "supabase"
    ? supabaseService.getCondemnations()
    : condemnations
}

export async function getCondemnationPaymentsAsync(condemnationId: string) {
  return getDataProvider() === "supabase"
    ? supabaseService.getCondemnationPayments(condemnationId)
    : getCondemnationPayments(condemnationId)
}

export async function getAllCondemnationPaymentsAsync() {
  if (getDataProvider() === "supabase") {
    const items = await supabaseService.getCondemnations()
    const payments = await Promise.all(
      items.map((item) => supabaseService.getCondemnationPayments(item.id))
    )

    return payments.flat()
  }

  return condemnations.flatMap((item) => getCondemnationPayments(item.id))
}

export async function getCondemnationSummaryAsync(condemnationId: string) {
  return getDataProvider() === "supabase"
    ? supabaseService.getCondemnationSummary(condemnationId)
    : getCondemnationSummary(condemnationId)
}

export async function createCondemnationAsync(input: CondemnationInput) {
  if (getDataProvider() === "supabase") {
    return supabaseService.createCondemnation(input)
  }

  return {
    ...input,
    id: `${input.caseId}-condenacao`,
    status: "open" as const,
  }
}

export async function updateCondemnationAsync(
  id: string,
  input: CondemnationUpdateInput
) {
  if (getDataProvider() === "supabase") {
    return supabaseService.updateCondemnation(id, input)
  }

  const currentCondemnation = condemnations.find((item) => item.id === id)
  return currentCondemnation
    ? { ...currentCondemnation, ...input }
    : undefined
}

export async function registerCondemnationPaymentAsync(
  condemnation: Condemnation,
  valueCents: number
) {
  if (getDataProvider() === "supabase") {
    return supabaseService.registerCondemnationPayment(condemnation, valueCents)
  }

  return {
    condemnationId: condemnation.id,
    id: `${condemnation.id}-pagamento-novo`,
    notes: "Pagamento registrado pelo sistema.",
    paidAt: new Date().toISOString().slice(0, 10),
    paymentMethod: "PIX",
    valueCents,
  }
}
