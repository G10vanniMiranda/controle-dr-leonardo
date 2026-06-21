import {
  feeInstallments,
  generateInstallmentPreview,
  getFeeInstallmentsByLegalFeeId,
  getLegalFeeSummary,
  legalFees,
} from "@/lib/mock-data"
import { type FeeInstallment, type LegalFee } from "@/lib/domain"
import { getDataProvider } from "@/lib/services/data-provider"
import * as supabaseService from "@/lib/services/supabase/legal-fees-service"

export type LegalFeeInput = Omit<LegalFee, "id" | "status">
export type LegalFeeUpdateInput = Partial<LegalFeeInput> & Pick<Partial<LegalFee>, "status">

export function getLegalFees() {
  if (getDataProvider() === "supabase") {
    return supabaseService.getLegalFees()
  }

  return legalFees
}

export function getLegalFeeInstallments(legalFeeId: string) {
  if (getDataProvider() === "supabase") {
    return supabaseService.getLegalFeeInstallments(legalFeeId)
  }

  return getFeeInstallmentsByLegalFeeId(legalFeeId)
}

export function generateInstallmentPreviewForProvider(input: {
  entryValueCents: number
  firstDueDate: string
  installmentsCount: number
  installmentValueCents: number
}) {
  if (getDataProvider() === "supabase") {
    return supabaseService.generateInstallmentPreview(input)
  }

  return generateInstallmentPreview(input)
}

export function getLegalFeeSummaryForProvider(legalFeeId: string) {
  if (getDataProvider() === "supabase") {
    return supabaseService.getLegalFeeSummary(legalFeeId)
  }

  return getLegalFeeSummary(legalFeeId)
}

export {
  generateInstallmentPreviewForProvider as generateInstallmentPreview,
  getLegalFeeSummaryForProvider as getLegalFeeSummary,
}

export function createLegalFee(input: LegalFeeInput): LegalFee {
  if (getDataProvider() === "supabase") {
    return supabaseService.createLegalFee(input)
  }

  return {
    ...input,
    id: input.contractName.toLowerCase().replace(/\s+/g, "-"),
    status: "pending",
  }
}

export function updateLegalFee(id: string, input: LegalFeeUpdateInput) {
  if (getDataProvider() === "supabase") {
    return supabaseService.updateLegalFee(id, input)
  }

  const currentFee = legalFees.find((legalFee) => legalFee.id === id)
  return currentFee ? { ...currentFee, ...input } : undefined
}

export function markFeeInstallmentAsPaid(id: string): FeeInstallment | undefined {
  if (getDataProvider() === "supabase") {
    return supabaseService.markFeeInstallmentAsPaid(id)
  }

  const installment = feeInstallments.find((item) => item.id === id)

  return installment
    ? {
        ...installment,
        paidAt: new Date().toISOString().slice(0, 10),
        paymentMethod: "PIX",
        status: "paid",
      }
    : undefined
}
