import {
  type MonthlyBill,
  type MonthlyBillCategory,
  type MonthlyBillStatus,
} from "@/lib/domain"
import type {
  MonthlyBillInput,
  MonthlyBillUpdateInput,
} from "@/lib/services/monthly-bills-service"
import { createClient as createSupabaseClient } from "@/lib/supabase/server"

type MonthlyBillRow = {
  id: string
  description: string
  category: MonthlyBillCategory
  value_cents: number
  due_date: string
  paid_at: string | null
  status: MonthlyBillStatus
  recurring: boolean
  notes: string | null
}

function mapMonthlyBillRow(row: MonthlyBillRow): MonthlyBill {
  return {
    category: row.category,
    description: row.description,
    dueDate: row.due_date,
    id: row.id,
    notes: row.notes ?? "",
    paidAt: row.paid_at ?? undefined,
    recurring: row.recurring,
    status: row.status,
    valueCents: row.value_cents,
  }
}

function toMonthlyBillPayload(input: MonthlyBillInput | MonthlyBillUpdateInput) {
  const payload: Record<string, unknown> = {}

  if (input.category !== undefined) payload.category = input.category
  if (input.description !== undefined) payload.description = input.description
  if (input.dueDate !== undefined) payload.due_date = input.dueDate
  if (input.notes !== undefined) payload.notes = input.notes
  if (input.recurring !== undefined) payload.recurring = input.recurring
  if (input.valueCents !== undefined) payload.value_cents = input.valueCents
  if ("paidAt" in input && input.paidAt !== undefined) {
    payload.paid_at = input.paidAt
  }
  if ("status" in input && input.status !== undefined) {
    payload.status = input.status
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

const monthlyBillColumns =
  "id, description, category, value_cents, due_date, paid_at, status, recurring, notes"

export async function getMonthlyBills(): Promise<MonthlyBill[]> {
  const { supabase } = await getCurrentUserId()
  const { data, error } = await supabase
    .from("monthly_bills")
    .select(monthlyBillColumns)
    .order("due_date", { ascending: false })

  if (error) {
    throw new Error(`Erro ao carregar contas mensais: ${error.message}`)
  }

  return (data ?? []).map((row) => mapMonthlyBillRow(row as MonthlyBillRow))
}

export async function getMonthlyBillsByMonth(month: string): Promise<MonthlyBill[]> {
  const { supabase } = await getCurrentUserId()
  const startDate = `${month}-01`
  const endDate = new Date(`${startDate}T00:00:00`)
  endDate.setMonth(endDate.getMonth() + 1)
  const endMonth = endDate.toISOString().slice(0, 10)

  const { data, error } = await supabase
    .from("monthly_bills")
    .select(monthlyBillColumns)
    .gte("due_date", startDate)
    .lt("due_date", endMonth)
    .order("due_date", { ascending: true })

  if (error) {
    throw new Error(`Erro ao carregar contas do mes: ${error.message}`)
  }

  return (data ?? []).map((row) => mapMonthlyBillRow(row as MonthlyBillRow))
}

export async function getMonthlyBillsSummary(month: string) {
  const bills = await getMonthlyBillsByMonth(month)

  return {
    bills,
    overdueCents: bills
      .filter((bill) => bill.status === "overdue")
      .reduce((total, bill) => total + bill.valueCents, 0),
    paidCents: bills
      .filter((bill) => bill.status === "paid")
      .reduce((total, bill) => total + bill.valueCents, 0),
    pendingCents: bills
      .filter((bill) => bill.status === "pending")
      .reduce((total, bill) => total + bill.valueCents, 0),
    totalCents: bills.reduce((total, bill) => total + bill.valueCents, 0),
  }
}

export async function createMonthlyBill(
  input: MonthlyBillInput
): Promise<MonthlyBill> {
  const { supabase, userId } = await getCurrentUserId()
  const { data, error } = await supabase
    .from("monthly_bills")
    .insert({
      ...toMonthlyBillPayload(input),
      status: "pending",
      user_id: userId,
    })
    .select(monthlyBillColumns)
    .single()

  if (error) {
    throw new Error(`Erro ao criar conta mensal: ${error.message}`)
  }

  return mapMonthlyBillRow(data as MonthlyBillRow)
}

export async function updateMonthlyBill(
  id: string,
  input: MonthlyBillUpdateInput
): Promise<MonthlyBill | undefined> {
  const { supabase } = await getCurrentUserId()
  const { data, error } = await supabase
    .from("monthly_bills")
    .update(toMonthlyBillPayload(input))
    .eq("id", id)
    .select(monthlyBillColumns)
    .maybeSingle()

  if (error) {
    throw new Error(`Erro ao atualizar conta mensal: ${error.message}`)
  }

  return data ? mapMonthlyBillRow(data as MonthlyBillRow) : undefined
}

export async function markMonthlyBillAsPaid(
  id: string
): Promise<MonthlyBill | undefined> {
  return updateMonthlyBill(id, {
    paidAt: new Date().toISOString().slice(0, 10),
    status: "paid",
  })
}
