import { DebtInstallmentsView } from "@/components/app/debt-installments-view"
import { getClientsAsync } from "@/lib/services/server/clients-service"
import {
  getAllDebtInstallmentPaymentsAsync,
  getDebtInstallmentsAsync,
} from "@/lib/services/server/debt-installments-service"

export default async function ParcelamentosPage() {
  const [clients, debtInstallments, payments] = await Promise.all([
    getClientsAsync(),
    getDebtInstallmentsAsync(),
    getAllDebtInstallmentPaymentsAsync(),
  ])

  return (
    <DebtInstallmentsView
      clients={clients}
      debtInstallments={debtInstallments}
      initialPayments={payments}
    />
  )
}
