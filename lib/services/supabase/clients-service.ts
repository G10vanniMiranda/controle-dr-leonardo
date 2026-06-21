import { type Client } from "@/lib/domain"
import { createClient as createSupabaseClient } from "@/lib/supabase/server"
import type { ClientInput, ClientUpdateInput } from "@/lib/services/clients-service"
import { mapCaseRow, type CaseRow } from "@/lib/services/supabase/cases-service"

type ClientRow = {
  id: string
  full_name: string
  document_number: string
  phone: string | null
  email: string | null
  address: string | null
  notes: string | null
  status: Client["status"]
  created_at: string
}

function mapClientRow(row: ClientRow): Client {
  return {
    address: row.address ?? "",
    createdAt: row.created_at,
    documentNumber: row.document_number,
    email: row.email ?? "",
    fullName: row.full_name,
    id: row.id,
    notes: row.notes ?? "",
    phone: row.phone ?? "",
    status: row.status,
  }
}

function toClientPayload(input: ClientInput | ClientUpdateInput) {
  return {
    address: input.address,
    document_number: input.documentNumber,
    email: input.email,
    full_name: input.fullName,
    notes: input.notes,
    phone: input.phone,
    status: input.status,
  }
}

async function getCurrentUserId() {
  const supabase = await createSupabaseClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data.user) {
    throw new Error("Usuario nao autenticado.")
  }

  return { supabase, userId: data.user.id }
}

export async function getClients(): Promise<Client[]> {
  const { supabase } = await getCurrentUserId()
  const { data, error } = await supabase
    .from("clients")
    .select(
      "id, full_name, document_number, phone, email, address, notes, status, created_at"
    )
    .order("full_name", { ascending: true })

  if (error) {
    throw new Error(`Erro ao carregar clientes: ${error.message}`)
  }

  return (data ?? []).map((row) => mapClientRow(row as ClientRow))
}

export async function getClientById(id: string): Promise<Client | undefined> {
  const { supabase } = await getCurrentUserId()
  const { data, error } = await supabase
    .from("clients")
    .select(
      "id, full_name, document_number, phone, email, address, notes, status, created_at"
    )
    .eq("id", id)
    .maybeSingle()

  if (error) {
    throw new Error(`Erro ao carregar cliente: ${error.message}`)
  }

  return data ? mapClientRow(data as ClientRow) : undefined
}

export async function getCasesByClientId(clientId: string) {
  const { supabase } = await getCurrentUserId()
  const { data, error } = await supabase
    .from("cases")
    .select(
      "id, client_id, case_number, action_type, court, district, state, opposing_party, claim_value_cents, status, procedural_phase, start_date, notes"
    )
    .eq("client_id", clientId)
    .order("start_date", { ascending: false })

  if (error) {
    throw new Error(`Erro ao carregar processos do cliente: ${error.message}`)
  }

  return (data ?? []).map((row) => mapCaseRow(row as CaseRow))
}

export async function createClient(input: ClientInput): Promise<Client> {
  const { supabase, userId } = await getCurrentUserId()
  const { data, error } = await supabase
    .from("clients")
    .insert({ ...toClientPayload(input), user_id: userId })
    .select(
      "id, full_name, document_number, phone, email, address, notes, status, created_at"
    )
    .single()

  if (error) {
    throw new Error(`Erro ao criar cliente: ${error.message}`)
  }

  return mapClientRow(data as ClientRow)
}

export async function updateClient(
  id: string,
  input: ClientUpdateInput
): Promise<Client | undefined> {
  const { supabase } = await getCurrentUserId()
  const { data, error } = await supabase
    .from("clients")
    .update(toClientPayload(input))
    .eq("id", id)
    .select(
      "id, full_name, document_number, phone, email, address, notes, status, created_at"
    )
    .maybeSingle()

  if (error) {
    throw new Error(`Erro ao atualizar cliente: ${error.message}`)
  }

  return data ? mapClientRow(data as ClientRow) : undefined
}

export async function deleteClient(id: string): Promise<boolean> {
  const { supabase } = await getCurrentUserId()
  const { error } = await supabase.from("clients").delete().eq("id", id)

  if (error) {
    throw new Error(`Erro ao excluir cliente: ${error.message}`)
  }

  return true
}
