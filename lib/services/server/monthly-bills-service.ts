import "server-only"

import {
  getMonthlyBills as getMockMonthlyBills,
  getMonthlyBillsByMonth,
  getMonthlyBillsSummary,
  monthlyBills,
} from "@/lib/mock-data"
import { getDataProvider } from "@/lib/services/data-provider"
import type {
  MonthlyBillInput,
  MonthlyBillUpdateInput,
} from "@/lib/services/monthly-bills-service"
import * as supabaseService from "@/lib/services/supabase/monthly-bills-service"

export async function getMonthlyBillsAsync() {
  return getDataProvider() === "supabase"
    ? supabaseService.getMonthlyBills()
    : getMockMonthlyBills()
}

export async function getMonthlyBillsByMonthAsync(month: string) {
  return getDataProvider() === "supabase"
    ? supabaseService.getMonthlyBillsByMonth(month)
    : getMonthlyBillsByMonth(month)
}

export async function getMonthlyBillsSummaryAsync(month: string) {
  return getDataProvider() === "supabase"
    ? supabaseService.getMonthlyBillsSummary(month)
    : getMonthlyBillsSummary(month)
}

export async function createMonthlyBillAsync(input: MonthlyBillInput) {
  if (getDataProvider() === "supabase") {
    return supabaseService.createMonthlyBill(input)
  }

  return {
    ...input,
    id: input.description.toLowerCase().replace(/\s+/g, "-"),
    status: "pending" as const,
  }
}

export async function updateMonthlyBillAsync(
  id: string,
  input: MonthlyBillUpdateInput
) {
  if (getDataProvider() === "supabase") {
    return supabaseService.updateMonthlyBill(id, input)
  }

  const currentBill = monthlyBills.find((bill) => bill.id === id)
  return currentBill ? { ...currentBill, ...input } : undefined
}

export async function markMonthlyBillAsPaidAsync(id: string) {
  if (getDataProvider() === "supabase") {
    return supabaseService.markMonthlyBillAsPaid(id)
  }

  return updateMonthlyBillAsync(id, {
    paidAt: new Date().toISOString().slice(0, 10),
    status: "paid",
  })
}
