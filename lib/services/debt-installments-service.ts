import {
  debtInstallments,
  getDebtInstallmentPayments,
  getDebtInstallmentSummary,
} from "@/lib/mock-data"
import {
  type DebtInstallmentPayment,
  type DebtInstallmentPlan,
} from "@/lib/domain"
import { getDataProvider } from "@/lib/services/data-provider"
import * as supabaseService from "@/lib/services/supabase/debt-installments-service"

export type DebtInstallmentInput = Omit<DebtInstallmentPlan, "id" | "status">
export type DebtInstallmentUpdateInput = Partial<DebtInstallmentInput> &
  Pick<Partial<DebtInstallmentPlan>, "status">

export function getDebtInstallments() {
  if (getDataProvider() === "supabase") {
    return supabaseService.getDebtInstallments()
  }

  return debtInstallments
}

export function getDebtInstallmentPaymentsForProvider(debtInstallmentId: string) {
  if (getDataProvider() === "supabase") {
    return supabaseService.getDebtInstallmentPayments(debtInstallmentId)
  }

  return getDebtInstallmentPayments(debtInstallmentId)
}

export function getDebtInstallmentSummaryForProvider(debtInstallmentId: string) {
  if (getDataProvider() === "supabase") {
    return supabaseService.getDebtInstallmentSummary(debtInstallmentId)
  }

  return getDebtInstallmentSummary(debtInstallmentId)
}

export {
  getDebtInstallmentPaymentsForProvider as getDebtInstallmentPayments,
  getDebtInstallmentSummaryForProvider as getDebtInstallmentSummary,
}

export function createDebtInstallment(input: DebtInstallmentInput): DebtInstallmentPlan {
  if (getDataProvider() === "supabase") {
    return supabaseService.createDebtInstallment(input)
  }

  return {
    ...input,
    id: input.description.toLowerCase().replace(/\s+/g, "-"),
    status: "active",
  }
}

export function updateDebtInstallment(
  id: string,
  input: DebtInstallmentUpdateInput
) {
  if (getDataProvider() === "supabase") {
    return supabaseService.updateDebtInstallment(id, input)
  }

  const currentPlan = debtInstallments.find((plan) => plan.id === id)
  return currentPlan ? { ...currentPlan, ...input } : undefined
}

export function markDebtInstallmentPaymentAsPaid(
  payment: DebtInstallmentPayment
): DebtInstallmentPayment {
  if (getDataProvider() === "supabase") {
    return supabaseService.markDebtInstallmentPaymentAsPaid(payment)
  }

  return {
    ...payment,
    paidAt: new Date().toISOString().slice(0, 10),
    receiptName: `comprovante-${payment.id}.pdf`,
    status: "paid",
  }
}
