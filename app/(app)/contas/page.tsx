import { MonthlyBillForm } from "@/components/app/monthly-bill-form"
import { MonthlyBillsView } from "@/components/app/monthly-bills-view"
import { getMonthlyBillsAsync } from "@/lib/services/server/monthly-bills-service"

export default async function ContasPage() {
  const bills = await getMonthlyBillsAsync()

  return (
    <div className="grid gap-6">
      <MonthlyBillsView bills={bills} />
      <MonthlyBillForm />
    </div>
  )
}
