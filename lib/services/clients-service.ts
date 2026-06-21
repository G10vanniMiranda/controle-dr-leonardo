import {
  clients,
  getCasesByClientId as getMockCasesByClientId,
  getClientById as getMockClientById,
  getClients as getMockClients,
} from "@/lib/mock-data"
import { type Client } from "@/lib/domain"
import { getDataProvider } from "@/lib/services/data-provider"

export type ClientInput = Omit<Client, "createdAt" | "id">
export type ClientUpdateInput = Partial<ClientInput>

export function getClients() {
  if (getDataProvider() === "supabase") {
    throw new Error("Use getClientsAsync() with NEXT_PUBLIC_DATA_PROVIDER=supabase.")
  }

  return getMockClients()
}

export async function getClientsAsync() {
  if (getDataProvider() === "supabase") {
    throw new Error(
      "Import getClientsAsync from '@/lib/services/server/clients-service' in Server Components."
    )
  }

  return getMockClients()
}

export function getClientById(id: string) {
  if (getDataProvider() === "supabase") {
    throw new Error(
      "Use getClientByIdAsync() with NEXT_PUBLIC_DATA_PROVIDER=supabase."
    )
  }

  return getMockClientById(id)
}

export async function getClientByIdAsync(id: string) {
  if (getDataProvider() === "supabase") {
    throw new Error(
      "Import getClientByIdAsync from '@/lib/services/server/clients-service' in Server Components."
    )
  }

  return getMockClientById(id)
}

export function getCasesByClientId(clientId: string) {
  if (getDataProvider() === "supabase") {
    throw new Error(
      "Use getCasesByClientIdAsync() with NEXT_PUBLIC_DATA_PROVIDER=supabase."
    )
  }

  return getMockCasesByClientId(clientId)
}

export async function getCasesByClientIdAsync(clientId: string) {
  if (getDataProvider() === "supabase") {
    throw new Error(
      "Import getCasesByClientIdAsync from '@/lib/services/server/clients-service' in Server Components."
    )
  }

  return getMockCasesByClientId(clientId)
}

export function createClient(input: ClientInput): Client {
  if (getDataProvider() === "supabase") {
    throw new Error("Use createClientAsync() with NEXT_PUBLIC_DATA_PROVIDER=supabase.")
  }

  return {
    ...input,
    createdAt: new Date().toISOString().slice(0, 10),
    id: input.fullName.toLowerCase().replace(/\s+/g, "-"),
  }
}

export async function createClientAsync(input: ClientInput) {
  if (getDataProvider() === "supabase") {
    throw new Error(
      "Import createClientAsync from '@/lib/services/server/clients-service' in Server Components."
    )
  }

  return createClient(input)
}

export function updateClient(id: string, input: ClientUpdateInput) {
  if (getDataProvider() === "supabase") {
    throw new Error("Use updateClientAsync() with NEXT_PUBLIC_DATA_PROVIDER=supabase.")
  }

  const currentClient = clients.find((client) => client.id === id)
  return currentClient ? { ...currentClient, ...input } : undefined
}

export async function updateClientAsync(id: string, input: ClientUpdateInput) {
  if (getDataProvider() === "supabase") {
    throw new Error(
      "Import updateClientAsync from '@/lib/services/server/clients-service' in Server Components."
    )
  }

  return updateClient(id, input)
}

export function deleteClient(id: string) {
  if (getDataProvider() === "supabase") {
    throw new Error("Use deleteClientAsync() with NEXT_PUBLIC_DATA_PROVIDER=supabase.")
  }

  return clients.some((client) => client.id === id)
}

export async function deleteClientAsync(id: string) {
  if (getDataProvider() === "supabase") {
    throw new Error(
      "Import deleteClientAsync from '@/lib/services/server/clients-service' in Server Components."
    )
  }

  return deleteClient(id)
}
