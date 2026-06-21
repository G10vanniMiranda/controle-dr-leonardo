import { type FeeInstallment, type LegalFee } from "@/lib/domain"
import { notImplementedForSupabase } from "@/lib/services/data-provider"
import type {
  LegalFeeInput,
  LegalFeeUpdateInput,
} from "@/lib/services/legal-fees-service"

export function getLegalFees(): LegalFee[] {
  return notImplementedForSupabase("getLegalFees")
}

export function getLegalFeeInstallments(_legalFeeId: string): FeeInstallment[] {
  return notImplementedForSupabase("getLegalFeeInstallments")
}

export function getLegalFeeSummary(_legalFeeId: string) {
  return notImplementedForSupabase("getLegalFeeSummary")
}

export function generateInstallmentPreview(_input: {
  entryValueCents: number
  firstDueDate: string
  installmentsCount: number
  installmentValueCents: number
}): FeeInstallment[] {
  return notImplementedForSupabase("generateInstallmentPreview")
}

export function createLegalFee(_input: LegalFeeInput): LegalFee {
  return notImplementedForSupabase("createLegalFee")
}

export function updateLegalFee(
  _id: string,
  _input: LegalFeeUpdateInput
): LegalFee | undefined {
  return notImplementedForSupabase("updateLegalFee")
}

export function markFeeInstallmentAsPaid(
  _id: string
): FeeInstallment | undefined {
  return notImplementedForSupabase("markFeeInstallmentAsPaid")
}
