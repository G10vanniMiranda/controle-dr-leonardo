import {
  getMonthlyBills as getMockMonthlyBills,
  getMonthlyBillsByMonth,
  getMonthlyBillsSummary,
  monthlyBills,
} from "@/lib/mock-data"
import { type MonthlyBill } from "@/lib/domain"
import { getDataProvider } from "@/lib/services/data-provider"

export type MonthlyBillInput = Omit<MonthlyBill, "id" | "paidAt" | "status">
export type MonthlyBillUpdateInput = Partial<MonthlyBillInput> &
  Pick<Partial<MonthlyBill>, "paidAt" | "status">

export function getMonthlyBills() {
  if (getDataProvider() === "supabase") {
    throw new Error(
      "Import getMonthlyBillsAsync from '@/lib/services/server/monthly-bills-service' in Server Components."
    )
  }

  return getMockMonthlyBills()
}

export function getMonthlyBillsByMonthForProvider(month: string) {
  if (getDataProvider() === "supabase") {
    throw new Error(
      "Import getMonthlyBillsByMonthAsync from '@/lib/services/server/monthly-bills-service' in Server Components."
    )
  }

  return getMonthlyBillsByMonth(month)
}

export function getMonthlyBillsSummaryForProvider(month: string) {
  if (getDataProvider() === "supabase") {
    throw new Error(
      "Import getMonthlyBillsSummaryAsync from '@/lib/services/server/monthly-bills-service' in Server Components."
    )
  }

  return getMonthlyBillsSummary(month)
}

export {
  getMonthlyBillsByMonthForProvider as getMonthlyBillsByMonth,
  getMonthlyBillsSummaryForProvider as getMonthlyBillsSummary,
}

export function createMonthlyBill(input: MonthlyBillInput): MonthlyBill {
  if (getDataProvider() === "supabase") {
    throw new Error(
      "Import createMonthlyBillAsync from '@/lib/services/server/monthly-bills-service' in Server Components."
    )
  }

  return {
    ...input,
    id: input.description.toLowerCase().replace(/\s+/g, "-"),
    status: "pending",
  }
}

export function updateMonthlyBill(id: string, input: MonthlyBillUpdateInput) {
  if (getDataProvider() === "supabase") {
    throw new Error(
      "Import updateMonthlyBillAsync from '@/lib/services/server/monthly-bills-service' in Server Components."
    )
  }

  const currentBill = monthlyBills.find((bill) => bill.id === id)
  return currentBill ? { ...currentBill, ...input } : undefined
}

export function markMonthlyBillAsPaid(id: string) {
  if (getDataProvider() === "supabase") {
    throw new Error(
      "Import markMonthlyBillAsPaidAsync from '@/lib/services/server/monthly-bills-service' in Server Components."
    )
  }

  return updateMonthlyBill(id, {
    paidAt: new Date().toISOString().slice(0, 10),
    status: "paid",
  })
}
