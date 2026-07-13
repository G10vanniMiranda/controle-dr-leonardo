"use server"

import { revalidatePath } from "next/cache"

import type { CaseInput, CaseUpdateInput } from "@/lib/services/cases-service"
import {
  createCaseAsync,
  deleteCaseAsync,
  updateCaseAsync,
} from "@/lib/services/server/cases-service"

export type CaseActionResult = {
  error?: string
  ok: boolean
}

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "Não foi possível concluir a operação."
}

export async function saveCaseAction(
  input: CaseInput,
  caseId?: string
): Promise<CaseActionResult> {
  try {
    if (caseId) {
      await updateCaseAsync(caseId, input as CaseUpdateInput)
    } else {
      await createCaseAsync(input)
    }

    revalidatePath("/processos")
    revalidatePath("/clientes")
    revalidatePath("/dashboard")
    return { ok: true }
  } catch (error) {
    return { error: getErrorMessage(error), ok: false }
  }
}

export async function deleteCaseAction(
  caseId: string
): Promise<CaseActionResult> {
  try {
    await deleteCaseAsync(caseId)

    revalidatePath("/processos")
    revalidatePath("/clientes")
    revalidatePath("/dashboard")
    return { ok: true }
  } catch (error) {
    return { error: getErrorMessage(error), ok: false }
  }
}
