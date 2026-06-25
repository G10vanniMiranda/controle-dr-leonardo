"use server"

import { revalidatePath } from "next/cache"

import type { LegalFeeInput } from "@/lib/services/legal-fees-service"
import {
  createLegalFeeAsync,
  markFeeInstallmentAsPaidAsync,
} from "@/lib/services/server/legal-fees-service"

export type LegalFeeActionResult = {
  error?: string
  ok: boolean
}

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "Nao foi possivel concluir a operacao."
}

export async function createLegalFeeAction(
  input: LegalFeeInput
): Promise<LegalFeeActionResult> {
  try {
    await createLegalFeeAsync(input)
    revalidatePath("/honorarios")
    revalidatePath("/dashboard")
    revalidatePath("/relatorios")
    return { ok: true }
  } catch (error) {
    return { error: getErrorMessage(error), ok: false }
  }
}

export async function markFeeInstallmentAsPaidAction(
  id: string
): Promise<LegalFeeActionResult> {
  try {
    await markFeeInstallmentAsPaidAsync(id)
    revalidatePath("/honorarios")
    revalidatePath("/dashboard")
    revalidatePath("/relatorios")
    return { ok: true }
  } catch (error) {
    return { error: getErrorMessage(error), ok: false }
  }
}
