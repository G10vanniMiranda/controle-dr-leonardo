"use server"

import { revalidatePath } from "next/cache"

import type { MonthlyBillInput } from "@/lib/services/monthly-bills-service"
import {
  createMonthlyBillAsync,
  markMonthlyBillAsPaidAsync,
} from "@/lib/services/server/monthly-bills-service"

export type MonthlyBillActionResult = {
  error?: string
  ok: boolean
}

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "Não foi possivel concluir a operação."
}

export async function createMonthlyBillAction(
  input: MonthlyBillInput
): Promise<MonthlyBillActionResult> {
  try {
    await createMonthlyBillAsync(input)
    revalidatePath("/contas")
    revalidatePath("/dashboard")
    revalidatePath("/relatorios")
    return { ok: true }
  } catch (error) {
    return { error: getErrorMessage(error), ok: false }
  }
}

export async function markMonthlyBillAsPaidAction(
  id: string
): Promise<MonthlyBillActionResult> {
  try {
    await markMonthlyBillAsPaidAsync(id)
    revalidatePath("/contas")
    revalidatePath("/dashboard")
    revalidatePath("/relatorios")
    return { ok: true }
  } catch (error) {
    return { error: getErrorMessage(error), ok: false }
  }
}
