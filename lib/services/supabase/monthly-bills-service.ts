import { type MonthlyBill } from "@/lib/domain"
import { notImplementedForSupabase } from "@/lib/services/data-provider"
import type {
  MonthlyBillInput,
  MonthlyBillUpdateInput,
} from "@/lib/services/monthly-bills-service"

export function getMonthlyBills(): MonthlyBill[] {
  return notImplementedForSupabase("getMonthlyBills")
}

export function getMonthlyBillsByMonth(_month: string): MonthlyBill[] {
  return notImplementedForSupabase("getMonthlyBillsByMonth")
}

export function getMonthlyBillsSummary(_month: string) {
  return notImplementedForSupabase("getMonthlyBillsSummary")
}

export function createMonthlyBill(_input: MonthlyBillInput): MonthlyBill {
  return notImplementedForSupabase("createMonthlyBill")
}

export function updateMonthlyBill(
  _id: string,
  _input: MonthlyBillUpdateInput
): MonthlyBill | undefined {
  return notImplementedForSupabase("updateMonthlyBill")
}

export function markMonthlyBillAsPaid(_id: string): MonthlyBill | undefined {
  return notImplementedForSupabase("markMonthlyBillAsPaid")
}
