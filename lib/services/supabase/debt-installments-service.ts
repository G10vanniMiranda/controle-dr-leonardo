import {
  type DebtInstallmentPayment,
  type DebtInstallmentPlan,
} from "@/lib/domain"
import { notImplementedForSupabase } from "@/lib/services/data-provider"
import type {
  DebtInstallmentInput,
  DebtInstallmentUpdateInput,
} from "@/lib/services/debt-installments-service"

export function getDebtInstallments(): DebtInstallmentPlan[] {
  return notImplementedForSupabase("getDebtInstallments")
}

export function getDebtInstallmentPayments(
  _debtInstallmentId: string
): DebtInstallmentPayment[] {
  return notImplementedForSupabase("getDebtInstallmentPayments")
}

export function getDebtInstallmentSummary(_debtInstallmentId: string) {
  return notImplementedForSupabase("getDebtInstallmentSummary")
}

export function createDebtInstallment(
  _input: DebtInstallmentInput
): DebtInstallmentPlan {
  return notImplementedForSupabase("createDebtInstallment")
}

export function updateDebtInstallment(
  _id: string,
  _input: DebtInstallmentUpdateInput
): DebtInstallmentPlan | undefined {
  return notImplementedForSupabase("updateDebtInstallment")
}

export function markDebtInstallmentPaymentAsPaid(
  _payment: DebtInstallmentPayment
): DebtInstallmentPayment {
  return notImplementedForSupabase("markDebtInstallmentPaymentAsPaid")
}
