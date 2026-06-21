import {
  feeInstallments,
  generateInstallmentPreview,
  getFeeInstallmentsByLegalFeeId,
  getLegalFeeSummary,
  legalFees,
} from "@/lib/mock-data"
import { type FeeInstallment, type LegalFee } from "@/lib/domain"
import { getDataProvider } from "@/lib/services/data-provider"

export type LegalFeeInput = Omit<LegalFee, "id" | "status">
export type LegalFeeUpdateInput = Partial<LegalFeeInput> & Pick<Partial<LegalFee>, "status">

export function getLegalFees() {
  if (getDataProvider() === "supabase") {
    throw new Error(
      "Import getLegalFeesAsync from '@/lib/services/server/legal-fees-service' in Server Components."
    )
  }

  return legalFees
}

export function getLegalFeeInstallments(legalFeeId: string) {
  if (getDataProvider() === "supabase") {
    throw new Error(
      "Import getLegalFeeInstallmentsAsync from '@/lib/services/server/legal-fees-service' in Server Components."
    )
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
    return generateInstallmentPreview(input)
  }

  return generateInstallmentPreview(input)
}

export function getLegalFeeSummaryForProvider(legalFeeId: string) {
  if (getDataProvider() === "supabase") {
    throw new Error(
      "Import getLegalFeeSummaryAsync from '@/lib/services/server/legal-fees-service' in Server Components."
    )
  }

  return getLegalFeeSummary(legalFeeId)
}

export {
  generateInstallmentPreviewForProvider as generateInstallmentPreview,
  getLegalFeeSummaryForProvider as getLegalFeeSummary,
}

export function createLegalFee(input: LegalFeeInput): LegalFee {
  if (getDataProvider() === "supabase") {
    throw new Error(
      "Import createLegalFeeAsync from '@/lib/services/server/legal-fees-service' in Server Components."
    )
  }

  return {
    ...input,
    id: input.contractName.toLowerCase().replace(/\s+/g, "-"),
    status: "pending",
  }
}

export function updateLegalFee(id: string, input: LegalFeeUpdateInput) {
  if (getDataProvider() === "supabase") {
    throw new Error(
      "Import updateLegalFeeAsync from '@/lib/services/server/legal-fees-service' in Server Components."
    )
  }

  const currentFee = legalFees.find((legalFee) => legalFee.id === id)
  return currentFee ? { ...currentFee, ...input } : undefined
}

export function markFeeInstallmentAsPaid(id: string): FeeInstallment | undefined {
  if (getDataProvider() === "supabase") {
    throw new Error(
      "Import markFeeInstallmentAsPaidAsync from '@/lib/services/server/legal-fees-service' in Server Components."
    )
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
