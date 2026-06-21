import { type Client, type LegalCase } from "@/lib/domain"
import type {
  CaseInput,
  CaseUpdateInput,
  LegalCaseWithClient,
} from "@/lib/services/cases-service"
import { createClient as createSupabaseClient } from "@/lib/supabase/server"

export type CaseRow = {
  id: string
  client_id: string
  case_number: string
  action_type: string
  court: string | null
  district: string | null
  state: string | null
  opposing_party: string | null
  claim_value_cents: number
  status: LegalCase["status"]
  procedural_phase: string | null
  start_date: string | null
  notes: string | null
}

type RelatedClientRow = {
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

type CaseWithClientRow = CaseRow & {
  clients: RelatedClientRow | RelatedClientRow[] | null
}

export function mapCaseRow(row: CaseRow): LegalCase {
  return {
    actionType: row.action_type,
    caseNumber: row.case_number,
    claimValueCents: row.claim_value_cents,
    clientId: row.client_id,
    court: row.court ?? "",
    district: row.district ?? "",
    id: row.id,
    notes: row.notes ?? "",
    opposingParty: row.opposing_party ?? "",
    proceduralPhase: row.procedural_phase ?? "",
    startDate: row.start_date ?? "",
    state: row.state ?? "",
    status: row.status,
  }
}

function mapClient(row: RelatedClientRow): Client {
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

function mapCaseWithClientRow(row: CaseWithClientRow): LegalCaseWithClient {
  const client = Array.isArray(row.clients) ? row.clients[0] : row.clients

  return {
    ...mapCaseRow(row),
    client: client ? mapClient(client) : undefined,
  }
}

function toCasePayload(input: CaseInput | CaseUpdateInput) {
  return {
    action_type: input.actionType,
    case_number: input.caseNumber,
    claim_value_cents: input.claimValueCents,
    client_id: input.clientId,
    court: input.court,
    district: input.district,
    notes: input.notes,
    opposing_party: input.opposingParty,
    procedural_phase: input.proceduralPhase,
    start_date: input.startDate || null,
    state: input.state,
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

const caseColumns =
  "id, client_id, case_number, action_type, court, district, state, opposing_party, claim_value_cents, status, procedural_phase, start_date, notes"

const caseWithClientColumns = `${caseColumns}, clients:client_id(id, full_name, document_number, phone, email, address, notes, status, created_at)`

export async function getCases(): Promise<LegalCase[]> {
  const { supabase } = await getCurrentUserId()
  const { data, error } = await supabase
    .from("cases")
    .select(caseColumns)
    .order("start_date", { ascending: false })

  if (error) {
    throw new Error(`Erro ao carregar processos: ${error.message}`)
  }

  return (data ?? []).map((row) => mapCaseRow(row as CaseRow))
}

export async function getCasesWithClient(): Promise<LegalCaseWithClient[]> {
  const { supabase } = await getCurrentUserId()
  const { data, error } = await supabase
    .from("cases")
    .select(caseWithClientColumns)
    .order("start_date", { ascending: false })

  if (error) {
    throw new Error(`Erro ao carregar processos: ${error.message}`)
  }

  return (data ?? []).map((row) => mapCaseWithClientRow(row as CaseWithClientRow))
}

export async function getCaseById(id: string): Promise<LegalCaseWithClient | undefined> {
  const { supabase } = await getCurrentUserId()
  const { data, error } = await supabase
    .from("cases")
    .select(caseWithClientColumns)
    .eq("id", id)
    .maybeSingle()

  if (error) {
    throw new Error(`Erro ao carregar processo: ${error.message}`)
  }

  return data ? mapCaseWithClientRow(data as CaseWithClientRow) : undefined
}

export async function createCase(input: CaseInput): Promise<LegalCase> {
  const { supabase, userId } = await getCurrentUserId()
  const { data, error } = await supabase
    .from("cases")
    .insert({ ...toCasePayload(input), user_id: userId })
    .select(caseColumns)
    .single()

  if (error) {
    throw new Error(`Erro ao criar processo: ${error.message}`)
  }

  return mapCaseRow(data as CaseRow)
}

export async function updateCase(
  id: string,
  input: CaseUpdateInput
): Promise<LegalCase | undefined> {
  const { supabase } = await getCurrentUserId()
  const { data, error } = await supabase
    .from("cases")
    .update(toCasePayload(input))
    .eq("id", id)
    .select(caseColumns)
    .maybeSingle()

  if (error) {
    throw new Error(`Erro ao atualizar processo: ${error.message}`)
  }

  return data ? mapCaseRow(data as CaseRow) : undefined
}

export async function deleteCase(id: string): Promise<boolean> {
  const { supabase } = await getCurrentUserId()
  const { error } = await supabase.from("cases").delete().eq("id", id)

  if (error) {
    throw new Error(`Erro ao excluir processo: ${error.message}`)
  }

  return true
}
