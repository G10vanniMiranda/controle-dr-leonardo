import { DebtInstallmentsView } from "@/components/app/debt-installments-view"
import { debtInstallments } from "@/lib/mock-data"

export default function ParcelamentosPage() {
  return <DebtInstallmentsView debtInstallments={debtInstallments} />
}
