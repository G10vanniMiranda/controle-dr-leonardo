import "server-only"

import {
  debtInstallments,
  getDebtInstallmentPayments,
  getDebtInstallmentSummary,
} from "@/lib/mock-data"
import { getDataProvider } from "@/lib/services/data-provider"
import type {
  DebtInstallmentInput,
  DebtInstallmentUpdateInput,
} from "@/lib/services/debt-installments-service"
import * as supabaseService from "@/lib/services/supabase/debt-installments-service"

export async function getDebtInstallmentsAsync() {
  return getDataProvider() === "supabase"
    ? supabaseService.getDebtInstallments()
    : debtInstallments
}

export async function getDebtInstallmentPaymentsAsync(
  debtInstallmentId: string
) {
  return getDataProvider() === "supabase"
    ? supabaseService.getDebtInstallmentPayments(debtInstallmentId)
    : getDebtInstallmentPayments(debtInstallmentId)
}

export async function getAllDebtInstallmentPaymentsAsync() {
  if (getDataProvider() === "supabase") {
    const plans = await supabaseService.getDebtInstallments()
    const payments = await Promise.all(
      plans.map((plan) => supabaseService.getDebtInstallmentPayments(plan.id))
    )

    return payments.flat()
  }

  return debtInstallments.flatMap((plan) => getDebtInstallmentPayments(plan.id))
}

export async function getDebtInstallmentSummaryAsync(debtInstallmentId: string) {
  return getDataProvider() === "supabase"
    ? supabaseService.getDebtInstallmentSummary(debtInstallmentId)
    : getDebtInstallmentSummary(debtInstallmentId)
}

export async function createDebtInstallmentAsync(input: DebtInstallmentInput) {
  if (getDataProvider() === "supabase") {
    return supabaseService.createDebtInstallment(input)
  }

  return {
    ...input,
    id: input.description.toLowerCase().replace(/\s+/g, "-"),
    status: "active" as const,
  }
}

export async function updateDebtInstallmentAsync(
  id: string,
  input: DebtInstallmentUpdateInput
) {
  if (getDataProvider() === "supabase") {
    return supabaseService.updateDebtInstallment(id, input)
  }

  const currentPlan = debtInstallments.find((plan) => plan.id === id)
  return currentPlan ? { ...currentPlan, ...input } : undefined
}
