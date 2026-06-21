import {
  type DebtInstallmentPayment,
  type DebtInstallmentPlan,
} from "@/lib/domain"
import type {
  DebtInstallmentInput,
  DebtInstallmentUpdateInput,
} from "@/lib/services/debt-installments-service"
import { createClient as createSupabaseClient } from "@/lib/supabase/server"

type DebtInstallmentRow = {
  id: string
  client_id: string
  case_id: string | null
  description: string
  total_value_cents: number
  entry_value_cents: number
  installments_count: number
  installment_value_cents: number
  due_day: number
  status: DebtInstallmentPlan["status"]
  notes: string | null
}

type DebtInstallmentPaymentRow = {
  id: string
  debt_installment_id: string
  installment_number: number
  value_cents: number
  due_date: string
  paid_at: string | null
  receipt_name: string | null
  status: DebtInstallmentPayment["status"]
}

function mapDebtInstallmentRow(row: DebtInstallmentRow): DebtInstallmentPlan {
  return {
    caseId: row.case_id ?? undefined,
    clientId: row.client_id,
    description: row.description,
    dueDay: row.due_day,
    entryValueCents: row.entry_value_cents,
    id: row.id,
    installmentValueCents: row.installment_value_cents,
    installmentsCount: row.installments_count,
    notes: row.notes ?? "",
    status: row.status,
    totalValueCents: row.total_value_cents,
  }
}

function mapDebtInstallmentPaymentRow(
  row: DebtInstallmentPaymentRow
): DebtInstallmentPayment {
  return {
    debtInstallmentId: row.debt_installment_id,
    dueDate: row.due_date,
    id: row.id,
    installmentNumber: row.installment_number,
    paidAt: row.paid_at ?? undefined,
    receiptName: row.receipt_name ?? undefined,
    status: row.status,
    valueCents: row.value_cents,
  }
}

function toDebtInstallmentPayload(
  input: DebtInstallmentInput | DebtInstallmentUpdateInput
) {
  const payload: Record<string, unknown> = {}

  if (input.caseId !== undefined) payload.case_id = input.caseId || null
  if (input.clientId !== undefined) payload.client_id = input.clientId
  if (input.description !== undefined) payload.description = input.description
  if (input.dueDay !== undefined) payload.due_day = input.dueDay
  if (input.entryValueCents !== undefined) {
    payload.entry_value_cents = input.entryValueCents
  }
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

const debtInstallmentColumns =
  "id, client_id, case_id, description, total_value_cents, entry_value_cents, installments_count, installment_value_cents, due_day, status, notes"

const debtPaymentColumns =
  "id, debt_installment_id, installment_number, value_cents, due_date, paid_at, receipt_name, status"

export async function getDebtInstallments(): Promise<DebtInstallmentPlan[]> {
  const { supabase } = await getCurrentUserId()
  const { data, error } = await supabase
    .from("debt_installments")
    .select(debtInstallmentColumns)
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error(`Erro ao carregar parcelamentos: ${error.message}`)
  }

  return (data ?? []).map((row) =>
    mapDebtInstallmentRow(row as DebtInstallmentRow)
  )
}

export async function getDebtInstallmentPayments(
  debtInstallmentId: string
): Promise<DebtInstallmentPayment[]> {
  const { supabase } = await getCurrentUserId()
  const { data, error } = await supabase
    .from("debt_installment_payments")
    .select(debtPaymentColumns)
    .eq("debt_installment_id", debtInstallmentId)
    .order("installment_number", { ascending: true })

  if (error) {
    throw new Error(`Erro ao carregar parcelas: ${error.message}`)
  }

  return (data ?? []).map((row) =>
    mapDebtInstallmentPaymentRow(row as DebtInstallmentPaymentRow)
  )
}

export async function getDebtInstallmentSummary(debtInstallmentId: string) {
  const payments = await getDebtInstallmentPayments(debtInstallmentId)
  const paidCents = payments
    .filter((payment) => payment.status === "paid")
    .reduce((total, payment) => total + payment.valueCents, 0)
  const overdueCents = payments
    .filter((payment) => payment.status === "overdue")
    .reduce((total, payment) => total + payment.valueCents, 0)
  const pendingCents = payments
    .filter((payment) => payment.status !== "paid")
    .reduce((total, payment) => total + payment.valueCents, 0)

  return {
    overdueCents,
    paidCents,
    paidCount: payments.filter((payment) => payment.status === "paid").length,
    pendingCents,
    totalCount: payments.length,
  }
}

function buildPaymentPreview(
  planId: string,
  input: DebtInstallmentInput
): Omit<DebtInstallmentPayment, "id">[] {
  const payments: Omit<DebtInstallmentPayment, "id">[] = []
  const now = new Date()

  if (input.entryValueCents > 0) {
    payments.push({
      debtInstallmentId: planId,
      dueDate: now.toISOString().slice(0, 10),
      installmentNumber: 0,
      status: "pending",
      valueCents: input.entryValueCents,
    })
  }

  for (let index = 0; index < input.installmentsCount; index += 1) {
    const dueDate = new Date(now)
    dueDate.setMonth(dueDate.getMonth() + index + 1)
    dueDate.setDate(Math.min(input.dueDay, 28))

    payments.push({
      debtInstallmentId: planId,
      dueDate: dueDate.toISOString().slice(0, 10),
      installmentNumber: index + 1,
      status: "pending",
      valueCents: input.installmentValueCents,
    })
  }

  return payments
}

async function createDebtInstallmentPayments(
  planId: string,
  userId: string,
  input: DebtInstallmentInput
) {
  const preview = buildPaymentPreview(planId, input)

  if (preview.length === 0) {
    return
  }

  const { supabase } = await getCurrentUserId()
  const { error } = await supabase.from("debt_installment_payments").insert(
    preview.map((payment) => ({
      debt_installment_id: planId,
      due_date: payment.dueDate,
      installment_number: payment.installmentNumber,
      status: payment.status,
      user_id: userId,
      value_cents: payment.valueCents,
    }))
  )

  if (error) {
    throw new Error(`Erro ao gerar parcelas: ${error.message}`)
  }
}

export async function createDebtInstallment(
  input: DebtInstallmentInput
): Promise<DebtInstallmentPlan> {
  const { supabase, userId } = await getCurrentUserId()
  const { data, error } = await supabase
    .from("debt_installments")
    .insert({
      ...toDebtInstallmentPayload(input),
      status: "active",
      user_id: userId,
    })
    .select(debtInstallmentColumns)
    .single()

  if (error) {
    throw new Error(`Erro ao criar parcelamento: ${error.message}`)
  }

  await createDebtInstallmentPayments(
    (data as DebtInstallmentRow).id,
    userId,
    input
  )

  return mapDebtInstallmentRow(data as DebtInstallmentRow)
}

export async function updateDebtInstallment(
  id: string,
  input: DebtInstallmentUpdateInput
): Promise<DebtInstallmentPlan | undefined> {
  const { supabase } = await getCurrentUserId()
  const { data, error } = await supabase
    .from("debt_installments")
    .update(toDebtInstallmentPayload(input))
    .eq("id", id)
    .select(debtInstallmentColumns)
    .maybeSingle()

  if (error) {
    throw new Error(`Erro ao atualizar parcelamento: ${error.message}`)
  }

  return data ? mapDebtInstallmentRow(data as DebtInstallmentRow) : undefined
}

export async function markDebtInstallmentPaymentAsPaid(
  payment: DebtInstallmentPayment
): Promise<DebtInstallmentPayment> {
  const { supabase } = await getCurrentUserId()
  const { data, error } = await supabase
    .from("debt_installment_payments")
    .update({
      paid_at: new Date().toISOString().slice(0, 10),
      receipt_name: `comprovante-${payment.id}.pdf`,
      status: "paid",
    })
    .eq("id", payment.id)
    .select(debtPaymentColumns)
    .single()

  if (error) {
    throw new Error(`Erro ao marcar parcela como paga: ${error.message}`)
  }

  const updatedPayment = mapDebtInstallmentPaymentRow(
    data as DebtInstallmentPaymentRow
  )
  const summary = await getDebtInstallmentSummary(payment.debtInstallmentId)

  if (summary.pendingCents <= 0) {
    await updateDebtInstallment(payment.debtInstallmentId, { status: "paid" })
  }

  return updatedPayment
}
