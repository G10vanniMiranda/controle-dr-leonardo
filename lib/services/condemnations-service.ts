import {
  condemnations,
  getCondemnationPayments,
  getCondemnationSummary,
} from "@/lib/mock-data"
import { type Condemnation, type CondemnationPayment } from "@/lib/domain"
import { getDataProvider } from "@/lib/services/data-provider"
import * as supabaseService from "@/lib/services/supabase/condemnations-service"

export type CondemnationInput = Omit<Condemnation, "id" | "status">
export type CondemnationUpdateInput = Partial<CondemnationInput> &
  Pick<Partial<Condemnation>, "status">

export function getCondemnations() {
  if (getDataProvider() === "supabase") {
    return supabaseService.getCondemnations()
  }

  return condemnations
}

export function getCondemnationPaymentsForProvider(condemnationId: string) {
  if (getDataProvider() === "supabase") {
    return supabaseService.getCondemnationPayments(condemnationId)
  }

  return getCondemnationPayments(condemnationId)
}

export function getCondemnationSummaryForProvider(condemnationId: string) {
  if (getDataProvider() === "supabase") {
    return supabaseService.getCondemnationSummary(condemnationId)
  }

  return getCondemnationSummary(condemnationId)
}

export {
  getCondemnationPaymentsForProvider as getCondemnationPayments,
  getCondemnationSummaryForProvider as getCondemnationSummary,
}

export function createCondemnation(input: CondemnationInput): Condemnation {
  if (getDataProvider() === "supabase") {
    return supabaseService.createCondemnation(input)
  }

  return {
    ...input,
    id: `${input.caseId}-condenacao`,
    status: "open",
  }
}

export function updateCondemnation(id: string, input: CondemnationUpdateInput) {
  if (getDataProvider() === "supabase") {
    return supabaseService.updateCondemnation(id, input)
  }

  const currentCondemnation = condemnations.find((item) => item.id === id)
  return currentCondemnation ? { ...currentCondemnation, ...input } : undefined
}

export function registerCondemnationPayment(
  condemnation: Condemnation,
  valueCents: number
): CondemnationPayment {
  if (getDataProvider() === "supabase") {
    return supabaseService.registerCondemnationPayment(condemnation, valueCents)
  }

  return {
    condemnationId: condemnation.id,
    id: `${condemnation.id}-pagamento-novo`,
    notes: "Pagamento simulado registrado na sessao.",
    paidAt: new Date().toISOString().slice(0, 10),
    paymentMethod: "PIX",
    valueCents,
  }
}
