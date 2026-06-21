import {
  getMonthlyBills as getMockMonthlyBills,
  getMonthlyBillsByMonth,
  getMonthlyBillsSummary,
  monthlyBills,
} from "@/lib/mock-data"
import { type MonthlyBill } from "@/lib/domain"
import { getDataProvider } from "@/lib/services/data-provider"
import * as supabaseService from "@/lib/services/supabase/monthly-bills-service"

export type MonthlyBillInput = Omit<MonthlyBill, "id" | "paidAt" | "status">
export type MonthlyBillUpdateInput = Partial<MonthlyBillInput> &
  Pick<Partial<MonthlyBill>, "paidAt" | "status">

export function getMonthlyBills() {
  if (getDataProvider() === "supabase") {
    return supabaseService.getMonthlyBills()
  }

  return getMockMonthlyBills()
}

export function getMonthlyBillsByMonthForProvider(month: string) {
  if (getDataProvider() === "supabase") {
    return supabaseService.getMonthlyBillsByMonth(month)
  }

  return getMonthlyBillsByMonth(month)
}

export function getMonthlyBillsSummaryForProvider(month: string) {
  if (getDataProvider() === "supabase") {
    return supabaseService.getMonthlyBillsSummary(month)
  }

  return getMonthlyBillsSummary(month)
}

export {
  getMonthlyBillsByMonthForProvider as getMonthlyBillsByMonth,
  getMonthlyBillsSummaryForProvider as getMonthlyBillsSummary,
}

export function createMonthlyBill(input: MonthlyBillInput): MonthlyBill {
  if (getDataProvider() === "supabase") {
    return supabaseService.createMonthlyBill(input)
  }

  return {
    ...input,
    id: input.description.toLowerCase().replace(/\s+/g, "-"),
    status: "pending",
  }
}

export function updateMonthlyBill(id: string, input: MonthlyBillUpdateInput) {
  if (getDataProvider() === "supabase") {
    return supabaseService.updateMonthlyBill(id, input)
  }

  const currentBill = monthlyBills.find((bill) => bill.id === id)
  return currentBill ? { ...currentBill, ...input } : undefined
}

export function markMonthlyBillAsPaid(id: string) {
  if (getDataProvider() === "supabase") {
    return supabaseService.markMonthlyBillAsPaid(id)
  }

  return updateMonthlyBill(id, {
    paidAt: new Date().toISOString().slice(0, 10),
    status: "paid",
  })
}
