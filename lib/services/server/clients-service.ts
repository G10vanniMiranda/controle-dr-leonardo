import "server-only"

import {
  getCasesByClientId as getMockCasesByClientId,
  getClientById as getMockClientById,
  getClients as getMockClients,
} from "@/lib/mock-data"
import { getDataProvider } from "@/lib/services/data-provider"
import type { ClientInput, ClientUpdateInput } from "@/lib/services/clients-service"
import * as supabaseService from "@/lib/services/supabase/clients-service"

export async function getClientsAsync() {
  return getDataProvider() === "supabase"
    ? supabaseService.getClients()
    : getMockClients()
}

export async function getClientByIdAsync(id: string) {
  return getDataProvider() === "supabase"
    ? supabaseService.getClientById(id)
    : getMockClientById(id)
}

export async function getCasesByClientIdAsync(clientId: string) {
  return getDataProvider() === "supabase"
    ? supabaseService.getCasesByClientId(clientId)
    : getMockCasesByClientId(clientId)
}

export async function createClientAsync(input: ClientInput) {
  if (getDataProvider() === "supabase") {
    return supabaseService.createClient(input)
  }

  return {
    ...input,
    createdAt: new Date().toISOString().slice(0, 10),
    id: input.fullName.toLowerCase().replace(/\s+/g, "-"),
  }
}

export async function updateClientAsync(id: string, input: ClientUpdateInput) {
  if (getDataProvider() === "supabase") {
    return supabaseService.updateClient(id, input)
  }

  const currentClient = getMockClients().find((client) => client.id === id)
  return currentClient ? { ...currentClient, ...input } : undefined
}

export async function deleteClientAsync(id: string) {
  return getDataProvider() === "supabase"
    ? supabaseService.deleteClient(id)
    : getMockClients().some((client) => client.id === id)
}
