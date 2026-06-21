import "server-only"

import {
  feeInstallments,
  generateInstallmentPreview,
  getFeeInstallmentsByLegalFeeId,
  getLegalFeeSummary,
  legalFees,
} from "@/lib/mock-data"
import { getDataProvider } from "@/lib/services/data-provider"
import type {
  LegalFeeInput,
  LegalFeeUpdateInput,
} from "@/lib/services/legal-fees-service"
import * as supabaseService from "@/lib/services/supabase/legal-fees-service"

export async function getLegalFeesAsync() {
  return getDataProvider() === "supabase"
    ? supabaseService.getLegalFees()
    : legalFees
}

export async function getLegalFeeInstallmentsAsync(legalFeeId: string) {
  return getDataProvider() === "supabase"
    ? supabaseService.getLegalFeeInstallments(legalFeeId)
    : getFeeInstallmentsByLegalFeeId(legalFeeId)
}

export async function getAllLegalFeeInstallmentsAsync() {
  if (getDataProvider() === "supabase") {
    const fees = await supabaseService.getLegalFees()
    const installments = await Promise.all(
      fees.map((fee) => supabaseService.getLegalFeeInstallments(fee.id))
    )

    return installments.flat()
  }

  return feeInstallments
}

export async function getLegalFeeSummaryAsync(legalFeeId: string) {
  return getDataProvider() === "supabase"
    ? supabaseService.getLegalFeeSummary(legalFeeId)
    : getLegalFeeSummary(legalFeeId)
}

export function generateInstallmentPreviewForServer(input: {
  entryValueCents: number
  firstDueDate: string
  installmentsCount: number
  installmentValueCents: number
}) {
  return getDataProvider() === "supabase"
    ? supabaseService.generateInstallmentPreview(input)
    : generateInstallmentPreview(input)
}

export async function createLegalFeeAsync(input: LegalFeeInput) {
  if (getDataProvider() === "supabase") {
    return supabaseService.createLegalFee(input)
  }

  return {
    ...input,
    id: input.contractName.toLowerCase().replace(/\s+/g, "-"),
    status: "pending" as const,
  }
}

export async function updateLegalFeeAsync(
  id: string,
  input: LegalFeeUpdateInput
) {
  if (getDataProvider() === "supabase") {
    return supabaseService.updateLegalFee(id, input)
  }

  const currentFee = legalFees.find((legalFee) => legalFee.id === id)
  return currentFee ? { ...currentFee, ...input } : undefined
}

export async function markFeeInstallmentAsPaidAsync(id: string) {
  if (getDataProvider() === "supabase") {
    return supabaseService.markFeeInstallmentAsPaid(id)
  }

  const installment = feeInstallments.find((item) => item.id === id)

  return installment
    ? {
        ...installment,
        paidAt: new Date().toISOString().slice(0, 10),
        paymentMethod: "PIX",
        status: "paid" as const,
      }
    : undefined
}
