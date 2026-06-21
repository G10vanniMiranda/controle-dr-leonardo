import { MonthlyBillForm } from "@/components/app/monthly-bill-form"
import { MonthlyBillsView } from "@/components/app/monthly-bills-view"
import { getMonthlyBills } from "@/lib/services/monthly-bills-service"

export default function ContasPage() {
  return (
    <div className="grid gap-6">
      <MonthlyBillsView bills={getMonthlyBills()} />
      <MonthlyBillForm />
    </div>
  )
}
