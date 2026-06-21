import { createClient as createSupabaseClient } from "@/lib/supabase/server"

export type ReportItem = {
  id: string
  title: string
  description: string
  status: string
  valueCents?: number
  valueText?: string
}

type ValueRow = {
  value_cents: number
  status?: string
}

type CondemnationRow = {
  updated_value_cents: number
  status: string
}

type CaseRow = {
  status: string
}

async function getCurrentUserId() {
  const supabase = await createSupabaseClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data.user) {
    throw new Error("Usuario nao autenticado.")
  }

  return { supabase }
}

function getCurrentMonthRange() {
  const now = new Date()
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1))

  return {
    endDate: end.toISOString().slice(0, 10),
    startDate: start.toISOString().slice(0, 10),
  }
}

function sumValues(rows: ValueRow[], predicate?: (row: ValueRow) => boolean) {
  return rows
    .filter((row) => (predicate ? predicate(row) : true))
    .reduce((total, row) => total + row.value_cents, 0)
}

export async function getReports(): Promise<ReportItem[]> {
  const { supabase } = await getCurrentUserId()
  const { endDate, startDate } = getCurrentMonthRange()
  const [
    feeInstallmentsResult,
    monthlyBillsResult,
    debtPaymentsResult,
    condemnationsResult,
    casesResult,
  ] = await Promise.all([
    supabase
      .from("fee_installments")
      .select("value_cents, status")
      .gte("due_date", startDate)
      .lt("due_date", endDate),
    supabase
      .from("monthly_bills")
      .select("value_cents, status")
      .gte("due_date", startDate)
      .lt("due_date", endDate),
    supabase
      .from("debt_installment_payments")
      .select("value_cents, status")
      .gte("due_date", startDate)
      .lt("due_date", endDate),
    supabase.from("condemnations").select("updated_value_cents, status"),
    supabase.from("cases").select("status"),
  ])

  if (feeInstallmentsResult.error) {
    throw new Error(
      `Erro ao carregar parcelas de honorarios: ${feeInstallmentsResult.error.message}`
    )
  }
  if (monthlyBillsResult.error) {
    throw new Error(
      `Erro ao carregar despesas mensais: ${monthlyBillsResult.error.message}`
    )
  }
  if (debtPaymentsResult.error) {
    throw new Error(
      `Erro ao carregar parcelas de dividas: ${debtPaymentsResult.error.message}`
    )
  }
  if (condemnationsResult.error) {
    throw new Error(
      `Erro ao carregar condenacoes: ${condemnationsResult.error.message}`
    )
  }
  if (casesResult.error) {
    throw new Error(`Erro ao carregar processos: ${casesResult.error.message}`)
  }

  const feeInstallments =
    (feeInstallmentsResult.data as ValueRow[] | null) ?? []
  const monthlyBills = (monthlyBillsResult.data as ValueRow[] | null) ?? []
  const debtPayments = (debtPaymentsResult.data as ValueRow[] | null) ?? []
  const condemnations =
    (condemnationsResult.data as CondemnationRow[] | null) ?? []
  const cases = (casesResult.data as CaseRow[] | null) ?? []

  const legalFeesReceivedCents = sumValues(
    feeInstallments,
    (row) => row.status === "paid"
  )
  const debtReceivedCents = sumValues(
    debtPayments,
    (row) => row.status === "paid"
  )
  const monthlyExpensesCents = sumValues(monthlyBills)
  const overdueFeesCents = sumValues(
    feeInstallments,
    (row) => row.status === "overdue"
  )
  const overdueDebtCents = sumValues(
    debtPayments,
    (row) => row.status === "overdue"
  )
  const activeCasesCount = cases.filter(
    (legalCase) =>
      legalCase.status !== "archived" && legalCase.status !== "closed"
  ).length
  const openCondemnationsCents = condemnations
    .filter((condemnation) => condemnation.status !== "paid")
    .reduce(
      (total, condemnation) => total + condemnation.updated_value_cents,
      0
    )
  const receiptsCents = legalFeesReceivedCents + debtReceivedCents

  return [
    {
      description: "Honorarios, condenacoes e parcelamentos recebidos no mes.",
      id: "recebimentos-mensais",
      status: "Disponivel",
      title: "Recebimentos mensais",
      valueCents: receiptsCents,
    },
    {
      description: "Contas pagas, pendentes e vencidas do periodo.",
      id: "despesas-mensais",
      status: "Disponivel",
      title: "Despesas mensais",
      valueCents: monthlyExpensesCents,
    },
    {
      description: "Parcelas de honorarios em aberto ou vencidas.",
      id: "honorarios-pendentes",
      status: overdueFeesCents > 0 ? "Atencao" : "Disponivel",
      title: "Honorarios pendentes",
      valueCents: overdueFeesCents,
    },
    {
      description: "Parcelas de quitacao de dividas vencidas.",
      id: "parcelas-vencidas",
      status: overdueDebtCents > 0 ? "Atencao" : "Disponivel",
      title: "Parcelas vencidas",
      valueCents: overdueDebtCents,
    },
    {
      description: "Processos nao arquivados e nao encerrados.",
      id: "processos-ativos",
      status: "Disponivel",
      title: "Processos ativos",
      valueText: String(activeCasesCount),
    },
    {
      description: "Valores atualizados ainda nao quitados.",
      id: "condenacoes-abertas",
      status: openCondemnationsCents > 0 ? "Atencao" : "Disponivel",
      title: "Condenacoes em aberto",
      valueCents: openCondemnationsCents,
    },
    {
      description: "Recebimentos menos despesas previstas.",
      id: "saldo-financeiro",
      status: "Disponivel",
      title: "Saldo financeiro mensal",
      valueCents: receiptsCents - monthlyExpensesCents,
    },
  ]
}
