import { type Condemnation, type CondemnationPayment } from "@/lib/domain"
import type {
  CondemnationInput,
  CondemnationUpdateInput,
} from "@/lib/services/condemnations-service"
import { createClient as createSupabaseClient } from "@/lib/supabase/server"

type CondemnationRow = {
  id: string
  case_id: string
  debtor_party: string
  creditor_party: string
  original_value_cents: number
  updated_value_cents: number
  interest_cents: number
  fine_cents: number
  decision_date: string | null
  status: Condemnation["status"]
  notes: string | null
}

type CondemnationPaymentRow = {
  id: string
  condemnation_id: string
  value_cents: number
  paid_at: string
  payment_method: string | null
  notes: string | null
}

function mapCondemnationRow(row: CondemnationRow): Condemnation {
  return {
    caseId: row.case_id,
    creditorParty: row.creditor_party,
    debtorParty: row.debtor_party,
    decisionDate: row.decision_date ?? "",
    fineCents: row.fine_cents,
    id: row.id,
    interestCents: row.interest_cents,
    notes: row.notes ?? "",
    originalValueCents: row.original_value_cents,
    status: row.status,
    updatedValueCents: row.updated_value_cents,
  }
}

function mapCondemnationPaymentRow(
  row: CondemnationPaymentRow
): CondemnationPayment {
  return {
    condemnationId: row.condemnation_id,
    id: row.id,
    notes: row.notes ?? "",
    paidAt: row.paid_at,
    paymentMethod: row.payment_method ?? "",
    valueCents: row.value_cents,
  }
}

function toCondemnationPayload(
  input: CondemnationInput | CondemnationUpdateInput
) {
  const payload: Record<string, unknown> = {}

  if (input.caseId !== undefined) payload.case_id = input.caseId
  if (input.creditorParty !== undefined) {
    payload.creditor_party = input.creditorParty
  }
  if (input.debtorParty !== undefined) payload.debtor_party = input.debtorParty
  if (input.decisionDate !== undefined) {
    payload.decision_date = input.decisionDate || null
  }
  if (input.fineCents !== undefined) payload.fine_cents = input.fineCents
  if (input.interestCents !== undefined) {
    payload.interest_cents = input.interestCents
  }
  if (input.notes !== undefined) payload.notes = input.notes
  if (input.originalValueCents !== undefined) {
    payload.original_value_cents = input.originalValueCents
  }
  if ("status" in input && input.status !== undefined) {
    payload.status = input.status
  }
  if (input.updatedValueCents !== undefined) {
    payload.updated_value_cents = input.updatedValueCents
  }

  return payload
}

async function getCurrentUserId() {
  const supabase = await createSupabaseClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data.user) {
    throw new Error("Usuario nao autenticado.")
  }

  return { supabase, userId: data.user.id }
}

const condemnationColumns =
  "id, case_id, debtor_party, creditor_party, original_value_cents, updated_value_cents, interest_cents, fine_cents, decision_date, status, notes"

const condemnationPaymentColumns =
  "id, condemnation_id, value_cents, paid_at, payment_method, notes"

export async function getCondemnations(): Promise<Condemnation[]> {
  const { supabase } = await getCurrentUserId()
  const { data, error } = await supabase
    .from("condemnations")
    .select(condemnationColumns)
    .order("decision_date", { ascending: false })

  if (error) {
    throw new Error(`Erro ao carregar condenacoes: ${error.message}`)
  }

  return (data ?? []).map((row) =>
    mapCondemnationRow(row as CondemnationRow)
  )
}

export async function getCondemnationPayments(
  condemnationId: string
): Promise<CondemnationPayment[]> {
  const { supabase } = await getCurrentUserId()
  const { data, error } = await supabase
    .from("condemnation_payments")
    .select(condemnationPaymentColumns)
    .eq("condemnation_id", condemnationId)
    .order("paid_at", { ascending: true })

  if (error) {
    throw new Error(
      `Erro ao carregar pagamentos de condenacao: ${error.message}`
    )
  }

  return (data ?? []).map((row) =>
    mapCondemnationPaymentRow(row as CondemnationPaymentRow)
  )
}

export async function getCondemnationSummary(condemnationId: string) {
  const [condemnations, payments] = await Promise.all([
    getCondemnations(),
    getCondemnationPayments(condemnationId),
  ])
  const condemnation = condemnations.find((item) => item.id === condemnationId)
  const paidCents = payments.reduce(
    (total, payment) => total + payment.valueCents,
    0
  )
  const updatedValueCents = condemnation?.updatedValueCents ?? 0

  return {
    paidCents,
    remainingCents: Math.max(updatedValueCents - paidCents, 0),
    updatedValueCents,
  }
}

export async function createCondemnation(
  input: CondemnationInput
): Promise<Condemnation> {
  const { supabase, userId } = await getCurrentUserId()
  const { data, error } = await supabase
    .from("condemnations")
    .insert({ ...toCondemnationPayload(input), status: "open", user_id: userId })
    .select(condemnationColumns)
    .single()

  if (error) {
    throw new Error(`Erro ao criar condenacao: ${error.message}`)
  }

  return mapCondemnationRow(data as CondemnationRow)
}

export async function updateCondemnation(
  id: string,
  input: CondemnationUpdateInput
): Promise<Condemnation | undefined> {
  const { supabase } = await getCurrentUserId()
  const { data, error } = await supabase
    .from("condemnations")
    .update(toCondemnationPayload(input))
    .eq("id", id)
    .select(condemnationColumns)
    .maybeSingle()

  if (error) {
    throw new Error(`Erro ao atualizar condenacao: ${error.message}`)
  }

  return data ? mapCondemnationRow(data as CondemnationRow) : undefined
}

export async function registerCondemnationPayment(
  condemnation: Condemnation,
  valueCents: number
): Promise<CondemnationPayment> {
  const { supabase, userId } = await getCurrentUserId()
  const { data, error } = await supabase
    .from("condemnation_payments")
    .insert({
      condemnation_id: condemnation.id,
      notes: "Pagamento registrado pelo sistema.",
      paid_at: new Date().toISOString().slice(0, 10),
      payment_method: "PIX",
      user_id: userId,
      value_cents: valueCents,
    })
    .select(condemnationPaymentColumns)
    .single()

  if (error) {
    throw new Error(`Erro ao registrar pagamento: ${error.message}`)
  }

  const summary = await getCondemnationSummary(condemnation.id)

  if (summary.remainingCents <= 0) {
    await updateCondemnation(condemnation.id, { status: "paid" })
  }

  return mapCondemnationPaymentRow(data as CondemnationPaymentRow)
}
