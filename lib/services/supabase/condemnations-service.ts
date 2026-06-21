import { type Condemnation, type CondemnationPayment } from "@/lib/domain"
import { notImplementedForSupabase } from "@/lib/services/data-provider"
import type {
  CondemnationInput,
  CondemnationUpdateInput,
} from "@/lib/services/condemnations-service"

export function getCondemnations(): Condemnation[] {
  return notImplementedForSupabase("getCondemnations")
}

export function getCondemnationPayments(
  _condemnationId: string
): CondemnationPayment[] {
  return notImplementedForSupabase("getCondemnationPayments")
}

export function getCondemnationSummary(_condemnationId: string) {
  return notImplementedForSupabase("getCondemnationSummary")
}

export function createCondemnation(_input: CondemnationInput): Condemnation {
  return notImplementedForSupabase("createCondemnation")
}

export function updateCondemnation(
  _id: string,
  _input: CondemnationUpdateInput
): Condemnation | undefined {
  return notImplementedForSupabase("updateCondemnation")
}

export function registerCondemnationPayment(
  _condemnation: Condemnation,
  _valueCents: number
): CondemnationPayment {
  return notImplementedForSupabase("registerCondemnationPayment")
}
