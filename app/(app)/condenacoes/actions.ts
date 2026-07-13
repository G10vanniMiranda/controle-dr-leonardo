"use server"

import { revalidatePath } from "next/cache"

import type { Condemnation } from "@/lib/domain"
import {
  registerCondemnationPaymentAsync,
  updateCondemnationAsync,
} from "@/lib/services/server/condemnations-service"

export type CondemnationActionResult = {
  error?: string
  ok: boolean
}

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "Não foi possivel concluir a operação."
}

export async function registerCondemnationPaymentAction(
  condemnation: Condemnation,
  valueCents: number
): Promise<CondemnationActionResult> {
  try {
    await registerCondemnationPaymentAsync(condemnation, valueCents)
    revalidatePath("/condenacoes")
    revalidatePath("/dashboard")
    revalidatePath("/relatorios")
    return { ok: true }
  } catch (error) {
    return { error: getErrorMessage(error), ok: false }
  }
}

export async function updateCondemnationStatusAction(
  id: string,
  status: Condemnation["status"]
): Promise<CondemnationActionResult> {
  try {
    await updateCondemnationAsync(id, { status })
    revalidatePath("/condenacoes")
    revalidatePath("/dashboard")
    revalidatePath("/relatorios")
    return { ok: true }
  } catch (error) {
    return { error: getErrorMessage(error), ok: false }
  }
}
