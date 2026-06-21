import {
  clients,
  getCasesByClientId as getMockCasesByClientId,
  getClientById as getMockClientById,
  getClients as getMockClients,
} from "@/lib/mock-data"
import { type Client } from "@/lib/domain"
import { getDataProvider } from "@/lib/services/data-provider"
import * as supabaseService from "@/lib/services/supabase/clients-service"

export type ClientInput = Omit<Client, "createdAt" | "id">
export type ClientUpdateInput = Partial<ClientInput>

export function getClients() {
  if (getDataProvider() === "supabase") {
    return supabaseService.getClients()
  }

  return getMockClients()
}

export function getClientById(id: string) {
  if (getDataProvider() === "supabase") {
    return supabaseService.getClientById(id)
  }

  return getMockClientById(id)
}

export function getCasesByClientId(clientId: string) {
  if (getDataProvider() === "supabase") {
    return supabaseService.getCasesByClientId(clientId)
  }

  return getMockCasesByClientId(clientId)
}

export function createClient(input: ClientInput): Client {
  if (getDataProvider() === "supabase") {
    return supabaseService.createClient(input)
  }

  return {
    ...input,
    createdAt: new Date().toISOString().slice(0, 10),
    id: input.fullName.toLowerCase().replace(/\s+/g, "-"),
  }
}

export function updateClient(id: string, input: ClientUpdateInput) {
  if (getDataProvider() === "supabase") {
    return supabaseService.updateClient(id, input)
  }

  const currentClient = clients.find((client) => client.id === id)
  return currentClient ? { ...currentClient, ...input } : undefined
}

export function deleteClient(id: string) {
  if (getDataProvider() === "supabase") {
    return supabaseService.deleteClient(id)
  }

  return clients.some((client) => client.id === id)
}
