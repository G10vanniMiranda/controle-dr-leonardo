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

export type DebtInstallmentInput = Omit<DebtInstallmentPlan, "id" | "status">
export type DebtInstallmentUpdateInput = Partial<DebtInstallmentInput> &
  Pick<Partial<DebtInstallmentPlan>, "status">

export function getDebtInstallments() {
  if (getDataProvider() === "supabase") {
    throw new Error(
      "Import getDebtInstallmentsAsync from '@/lib/services/server/debt-installments-service' in Server Components."
    )
  }

  return debtInstallments
}

export function getDebtInstallmentPaymentsForProvider(debtInstallmentId: string) {
  if (getDataProvider() === "supabase") {
    throw new Error(
      "Import getDebtInstallmentPaymentsAsync from '@/lib/services/server/debt-installments-service' in Server Components."
    )
  }

  return getDebtInstallmentPayments(debtInstallmentId)
}

export function getDebtInstallmentSummaryForProvider(debtInstallmentId: string) {
  if (getDataProvider() === "supabase") {
    throw new Error(
      "Import getDebtInstallmentSummaryAsync from '@/lib/services/server/debt-installments-service' in Server Components."
    )
  }

  return getDebtInstallmentSummary(debtInstallmentId)
}

export {
  getDebtInstallmentPaymentsForProvider as getDebtInstallmentPayments,
  getDebtInstallmentSummaryForProvider as getDebtInstallmentSummary,
}

export function createDebtInstallment(input: DebtInstallmentInput): DebtInstallmentPlan {
  if (getDataProvider() === "supabase") {
    throw new Error(
      "Import createDebtInstallmentAsync from '@/lib/services/server/debt-installments-service' in Server Components."
    )
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
    throw new Error(
      "Import updateDebtInstallmentAsync from '@/lib/services/server/debt-installments-service' in Server Components."
    )
  }

  const currentPlan = debtInstallments.find((plan) => plan.id === id)
  return currentPlan ? { ...currentPlan, ...input } : undefined
}

export function markDebtInstallmentPaymentAsPaid(
  payment: DebtInstallmentPayment
): DebtInstallmentPayment {
  if (getDataProvider() === "supabase") {
    throw new Error(
      "Use a Server Action backed by '@/lib/services/server/debt-installments-service' with NEXT_PUBLIC_DATA_PROVIDER=supabase."
    )
  }

  return {
    ...payment,
    paidAt: new Date().toISOString().slice(0, 10),
    receiptName: `comprovante-${payment.id}.pdf`,
    status: "paid",
  }
}
