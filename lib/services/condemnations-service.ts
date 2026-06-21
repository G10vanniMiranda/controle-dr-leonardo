import {
  condemnations,
  getCondemnationPayments,
  getCondemnationSummary,
} from "@/lib/mock-data"
import { type Condemnation, type CondemnationPayment } from "@/lib/domain"
import { getDataProvider } from "@/lib/services/data-provider"

export type CondemnationInput = Omit<Condemnation, "id" | "status">
export type CondemnationUpdateInput = Partial<CondemnationInput> &
  Pick<Partial<Condemnation>, "status">

export function getCondemnations() {
  if (getDataProvider() === "supabase") {
    throw new Error(
      "Import getCondemnationsAsync from '@/lib/services/server/condemnations-service' in Server Components."
    )
  }

  return condemnations
}

export function getCondemnationPaymentsForProvider(condemnationId: string) {
  if (getDataProvider() === "supabase") {
    throw new Error(
      "Import getCondemnationPaymentsAsync from '@/lib/services/server/condemnations-service' in Server Components."
    )
  }

  return getCondemnationPayments(condemnationId)
}

export function getCondemnationSummaryForProvider(condemnationId: string) {
  if (getDataProvider() === "supabase") {
    throw new Error(
      "Import getCondemnationSummaryAsync from '@/lib/services/server/condemnations-service' in Server Components."
    )
  }

  return getCondemnationSummary(condemnationId)
}

export {
  getCondemnationPaymentsForProvider as getCondemnationPayments,
  getCondemnationSummaryForProvider as getCondemnationSummary,
}

export function createCondemnation(input: CondemnationInput): Condemnation {
  if (getDataProvider() === "supabase") {
    throw new Error(
      "Import createCondemnationAsync from '@/lib/services/server/condemnations-service' in Server Components."
    )
  }

  return {
    ...input,
    id: `${input.caseId}-condenacao`,
    status: "open",
  }
}

export function updateCondemnation(id: string, input: CondemnationUpdateInput) {
  if (getDataProvider() === "supabase") {
    throw new Error(
      "Import updateCondemnationAsync from '@/lib/services/server/condemnations-service' in Server Components."
    )
  }

  const currentCondemnation = condemnations.find((item) => item.id === id)
  return currentCondemnation ? { ...currentCondemnation, ...input } : undefined
}

export function registerCondemnationPayment(
  condemnation: Condemnation,
  valueCents: number
): CondemnationPayment {
  if (getDataProvider() === "supabase") {
    throw new Error(
      "Use a Server Action backed by '@/lib/services/server/condemnations-service' with NEXT_PUBLIC_DATA_PROVIDER=supabase."
    )
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
