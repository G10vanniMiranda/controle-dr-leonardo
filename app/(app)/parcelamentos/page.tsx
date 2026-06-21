import { DebtInstallmentsView } from "@/components/app/debt-installments-view"
import { getDebtInstallments } from "@/lib/services/debt-installments-service"

export default function ParcelamentosPage() {
  return <DebtInstallmentsView debtInstallments={getDebtInstallments()} />
}
