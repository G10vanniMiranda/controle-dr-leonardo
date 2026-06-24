"use server"

import { revalidatePath } from "next/cache"

import type { ClientInput, ClientUpdateInput } from "@/lib/services/clients-service"
import {
  createClientAsync,
  deleteClientAsync,
  updateClientAsync,
} from "@/lib/services/server/clients-service"

export type ClientActionResult = {
  error?: string
  ok: boolean
}

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "Nao foi possivel concluir a operacao."
}

export async function saveClientAction(
  input: ClientInput,
  clientId?: string
): Promise<ClientActionResult> {
  try {
    if (clientId) {
      await updateClientAsync(clientId, input as ClientUpdateInput)
    } else {
      await createClientAsync(input)
    }

    revalidatePath("/clientes")
    revalidatePath("/dashboard")
    return { ok: true }
  } catch (error) {
    return { error: getErrorMessage(error), ok: false }
  }
}

export async function deleteClientAction(
  clientId: string
): Promise<ClientActionResult> {
  try {
    await deleteClientAsync(clientId)

    revalidatePath("/clientes")
    revalidatePath("/dashboard")
    return { ok: true }
  } catch (error) {
    return { error: getErrorMessage(error), ok: false }
  }
}
