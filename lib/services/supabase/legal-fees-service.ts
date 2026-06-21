import { type FeeInstallment, type LegalFee } from "@/lib/domain"
import type {
  LegalFeeInput,
  LegalFeeUpdateInput,
} from "@/lib/services/legal-fees-service"
import { createClient as createSupabaseClient } from "@/lib/supabase/server"

type LegalFeeRow = {
  id: string
  client_id: string
  case_id: string | null
  contract_name: string
  total_value_cents: number
  entry_value_cents: number
  installments_count: number
  installment_value_cents: number
  first_due_date: string | null
  status: LegalFee["status"]
  notes: string | null
}

type FeeInstallmentRow = {
  id: string
  legal_fee_id: string
  installment_number: number
  value_cents: number
  due_date: string
  paid_at: string | null
  payment_method: string | null
  status: FeeInstallment["status"]
}

function mapLegalFeeRow(row: LegalFeeRow): LegalFee {
  return {
    caseId: row.case_id ?? undefined,
    clientId: row.client_id,
    contractName: row.contract_name,
    entryValueCents: row.entry_value_cents,
    firstDueDate: row.first_due_date ?? "",
    id: row.id,
    installmentValueCents: row.installment_value_cents,
    installmentsCount: row.installments_count,
    notes: row.notes ?? "",
    status: row.status,
    totalValueCents: row.total_value_cents,
  }
}

function mapFeeInstallmentRow(row: FeeInstallmentRow): FeeInstallment {
  return {
    dueDate: row.due_date,
    id: row.id,
    installmentNumber: row.installment_number,
    legalFeeId: row.legal_fee_id,
    paidAt: row.paid_at ?? undefined,
    paymentMethod: row.payment_method ?? undefined,
    status: row.status,
    valueCents: row.value_cents,
  }
}

function toLegalFeePayload(input: LegalFeeInput | LegalFeeUpdateInput) {
  const payload: Record<string, unknown> = {}

  if (input.caseId !== undefined) payload.case_id = input.caseId || null
  if (input.clientId !== undefined) payload.client_id = input.clientId
  if (input.contractName !== undefined) payload.contract_name = input.contractName
  if (input.entryValueCents !== undefined) {
    payload.entry_value_cents = input.entryValueCents
  }
  if (input.firstDueDate !== undefined) payload.first_due_date = input.firstDueDate
  if (input.installmentValueCents !== undefined) {
    payload.installment_value_cents = input.installmentValueCents
  }
  if (input.installmentsCount !== undefined) {
    payload.installments_count = input.installmentsCount
  }
  if (input.notes !== undefined) payload.notes = input.notes
  if ("status" in input && input.status !== undefined) payload.status = input.status
  if (input.totalValueCents !== undefined) {
    payload.total_value_cents = input.totalValueCents
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

const legalFeeColumns =
  "id, client_id, case_id, contract_name, total_value_cents, entry_value_cents, installments_count, installment_value_cents, first_due_date, status, notes"

const installmentColumns =
  "id, legal_fee_id, installment_number, value_cents, due_date, paid_at, payment_method, status"

export async function getLegalFees(): Promise<LegalFee[]> {
  const { supabase } = await getCurrentUserId()
  const { data, error } = await supabase
    .from("legal_fees")
    .select(legalFeeColumns)
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error(`Erro ao carregar honorarios: ${error.message}`)
  }

  return (data ?? []).map((row) => mapLegalFeeRow(row as LegalFeeRow))
}

export async function getLegalFeeInstallments(
  legalFeeId: string
): Promise<FeeInstallment[]> {
  const { supabase } = await getCurrentUserId()
  const { data, error } = await supabase
    .from("fee_installments")
    .select(installmentColumns)
    .eq("legal_fee_id", legalFeeId)
    .order("installment_number", { ascending: true })

  if (error) {
    throw new Error(`Erro ao carregar parcelas de honorarios: ${error.message}`)
  }

  return (data ?? []).map((row) => mapFeeInstallmentRow(row as FeeInstallmentRow))
}

export async function getLegalFeeSummary(legalFeeId: string) {
  const installments = await getLegalFeeInstallments(legalFeeId)
  const paidCents = installments
    .filter((installment) => installment.status === "paid")
    .reduce((total, installment) => total + installment.valueCents, 0)
  const overdueCents = installments
    .filter((installment) => installment.status === "overdue")
    .reduce((total, installment) => total + installment.valueCents, 0)
  const pendingCents = installments
    .filter((installment) => installment.status !== "paid")
    .reduce((total, installment) => total + installment.valueCents, 0)

  return {
    overdueCents,
    paidCents,
    paidCount: installments.filter((installment) => installment.status === "paid")
      .length,
    pendingCents,
    totalCount: installments.length,
  }
}

export function generateInstallmentPreview({
  entryValueCents,
  firstDueDate,
  installmentsCount,
  installmentValueCents,
}: {
  entryValueCents: number
  firstDueDate: string
  installmentsCount: number
  installmentValueCents: number
}): FeeInstallment[] {
  const preview: FeeInstallment[] = []

  if (entryValueCents > 0) {
    preview.push({
      dueDate: firstDueDate,
      id: "preview-entry",
      installmentNumber: 0,
      legalFeeId: "preview",
      status: "pending",
      valueCents: entryValueCents,
    })
  }

  for (let index = 0; index < installmentsCount; index += 1) {
    const dueDate = new Date(`${firstDueDate}T00:00:00`)
    dueDate.setMonth(dueDate.getMonth() + index)

    preview.push({
      dueDate: dueDate.toISOString().slice(0, 10),
      id: `preview-${index + 1}`,
      installmentNumber: index + 1,
      legalFeeId: "preview",
      status: "pending",
      valueCents: installmentValueCents,
    })
  }

  return preview
}

async function createFeeInstallments(
  legalFeeId: string,
  userId: string,
  input: LegalFeeInput
) {
  const preview = generateInstallmentPreview({
    entryValueCents: input.entryValueCents,
    firstDueDate: input.firstDueDate,
    installmentsCount: input.installmentsCount,
    installmentValueCents: input.installmentValueCents,
  })

  if (preview.length === 0) {
    return
  }

  const { supabase } = await getCurrentUserId()
  const { error } = await supabase.from("fee_installments").insert(
    preview.map((installment) => ({
      due_date: installment.dueDate,
      installment_number: installment.installmentNumber,
      legal_fee_id: legalFeeId,
      status: installment.status,
      user_id: userId,
      value_cents: installment.valueCents,
    }))
  )

  if (error) {
    throw new Error(`Erro ao gerar parcelas de honorarios: ${error.message}`)
  }
}

export async function createLegalFee(input: LegalFeeInput): Promise<LegalFee> {
  const { supabase, userId } = await getCurrentUserId()
  const { data, error } = await supabase
    .from("legal_fees")
    .insert({
      ...toLegalFeePayload(input),
      status: "pending",
      user_id: userId,
    })
    .select(legalFeeColumns)
    .single()

  if (error) {
    throw new Error(`Erro ao criar contrato de honorarios: ${error.message}`)
  }

  await createFeeInstallments((data as LegalFeeRow).id, userId, input)

  return mapLegalFeeRow(data as LegalFeeRow)
}

export async function updateLegalFee(
  id: string,
  input: LegalFeeUpdateInput
): Promise<LegalFee | undefined> {
  const { supabase } = await getCurrentUserId()
  const { data, error } = await supabase
    .from("legal_fees")
    .update(toLegalFeePayload(input))
    .eq("id", id)
    .select(legalFeeColumns)
    .maybeSingle()

  if (error) {
    throw new Error(`Erro ao atualizar honorarios: ${error.message}`)
  }

  return data ? mapLegalFeeRow(data as LegalFeeRow) : undefined
}

export async function markFeeInstallmentAsPaid(
  id: string
): Promise<FeeInstallment | undefined> {
  const { supabase } = await getCurrentUserId()
  const { data, error } = await supabase
    .from("fee_installments")
    .update({
      paid_at: new Date().toISOString().slice(0, 10),
      payment_method: "PIX",
      status: "paid",
    })
    .eq("id", id)
    .select(installmentColumns)
    .maybeSingle()

  if (error) {
    throw new Error(`Erro ao marcar parcela como paga: ${error.message}`)
  }

  return data ? mapFeeInstallmentRow(data as FeeInstallmentRow) : undefined
}
