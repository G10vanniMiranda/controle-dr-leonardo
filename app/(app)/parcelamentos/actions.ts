"use server"

import { revalidatePath } from "next/cache"

import type { DebtInstallmentPayment } from "@/lib/domain"
import { markDebtInstallmentPaymentAsPaidAsync } from "@/lib/services/server/debt-installments-service"

export type DebtInstallmentActionResult = {
  error?: string
  ok: boolean
}

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "Não foi possivel concluir a operação."
}

export async function markDebtInstallmentPaymentAsPaidAction(
  payment: DebtInstallmentPayment
): Promise<DebtInstallmentActionResult> {
  try {
    await markDebtInstallmentPaymentAsPaidAsync(payment)
    revalidatePath("/parcelamentos")
    revalidatePath("/dashboard")
    revalidatePath("/relatorios")
    return { ok: true }
  } catch (error) {
    return { error: getErrorMessage(error), ok: false }
  }
}
