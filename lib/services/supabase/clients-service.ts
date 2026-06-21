import { type Client } from "@/lib/domain"
import { notImplementedForSupabase } from "@/lib/services/data-provider"
import type { ClientInput, ClientUpdateInput } from "@/lib/services/clients-service"

export function getClients(): Client[] {
  return notImplementedForSupabase("getClients")
}

export function getClientById(_id: string): Client | undefined {
  return notImplementedForSupabase("getClientById")
}

export function getCasesByClientId(_clientId: string) {
  return notImplementedForSupabase("getCasesByClientId")
}

export function createClient(_input: ClientInput): Client {
  return notImplementedForSupabase("createClient")
}

export function updateClient(
  _id: string,
  _input: ClientUpdateInput
): Client | undefined {
  return notImplementedForSupabase("updateClient")
}

export function deleteClient(_id: string): boolean {
  return notImplementedForSupabase("deleteClient")
}
