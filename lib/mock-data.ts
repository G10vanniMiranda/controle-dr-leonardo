export type ClientStatus = "active" | "inactive"

export type Client = {
  id: string
  fullName: string
  documentNumber: string
  phone: string
  email: string
  address: string
  notes: string
  status: ClientStatus
  createdAt: string
}

export type CaseStatus =
  | "in_review"
  | "in_progress"
  | "waiting_hearing"
  | "sentence"
  | "execution"
  | "agreement"
  | "archived"
  | "closed"

export type LegalCase = {
  id: string
  clientId: string
  caseNumber: string
  actionType: string
  court: string
  district: string
  state: string
  opposingParty: string
  claimValueCents: number
  status: CaseStatus
  proceduralPhase: string
  startDate: string
  notes: string
}

export type LegalFeeStatus = "pending" | "paid" | "overdue" | "cancelled"

export type FeeInstallmentStatus = "pending" | "paid" | "overdue" | "cancelled"

export type LegalFee = {
  id: string
  clientId: string
  caseId?: string
  contractName: string
  totalValueCents: number
  entryValueCents: number
  installmentsCount: number
  installmentValueCents: number
  firstDueDate: string
  status: LegalFeeStatus
  notes: string
}

export type FeeInstallment = {
  id: string
  legalFeeId: string
  installmentNumber: number
  valueCents: number
  dueDate: string
  paidAt?: string
  paymentMethod?: string
  status: FeeInstallmentStatus
}

export type MonthlyBillStatus = "pending" | "paid" | "overdue"

export type MonthlyBillCategory =
  | "office"
  | "personal"
  | "employee"
  | "system"
  | "marketing"
  | "court_costs"
  | "taxes"
  | "card"
  | "other"

export type MonthlyBill = {
  id: string
  description: string
  category: MonthlyBillCategory
  valueCents: number
  dueDate: string
  paidAt?: string
  status: MonthlyBillStatus
  recurring: boolean
  notes: string
}

export const clients: Client[] = [
  {
    id: "marina-almeida",
    fullName: "Marina Almeida",
    documentNumber: "000.000.000-00",
    phone: "(92) 99123-4567",
    email: "marina.almeida@email.com",
    address: "Av. Darcy Vargas, Manaus - AM",
    notes: "Cliente com contrato de honorarios ativo e audiencia agendada.",
    status: "active",
    createdAt: "2026-01-12",
  },
  {
    id: "rafael-costa",
    fullName: "Rafael Costa",
    documentNumber: "111.111.111-11",
    phone: "(92) 99234-5678",
    email: "rafael.costa@email.com",
    address: "Rua Recife, Manaus - AM",
    notes: "Acompanhamento prioritario em execucao.",
    status: "active",
    createdAt: "2026-02-03",
  },
  {
    id: "ls-comercio",
    fullName: "LS Comercio Ltda.",
    documentNumber: "00.000.000/0001-00",
    phone: "(92) 3232-1000",
    email: "juridico@lscomercio.com",
    address: "Distrito Industrial, Manaus - AM",
    notes: "Pessoa juridica com cobranca empresarial recorrente.",
    status: "active",
    createdAt: "2026-03-18",
  },
  {
    id: "patricia-nunes",
    fullName: "Patricia Nunes",
    documentNumber: "222.222.222-22",
    phone: "(92) 99345-6789",
    email: "patricia.nunes@email.com",
    address: "Ponta Negra, Manaus - AM",
    notes: "Processo em fase de sentenca.",
    status: "inactive",
    createdAt: "2025-12-07",
  },
]

export const legalCases: LegalCase[] = [
  {
    id: "revisional-marina",
    clientId: "marina-almeida",
    caseNumber: "0001234-56.2026.8.04.0001",
    actionType: "Revisional contratual",
    court: "3a Vara Civel",
    district: "Manaus",
    state: "AM",
    opposingParty: "Banco Alfa S.A.",
    claimValueCents: 4500000,
    status: "in_progress",
    proceduralPhase: "Instrucao",
    startDate: "2026-01-20",
    notes: "Aguardando juntada de documentos complementares.",
  },
  {
    id: "execucao-rafael",
    clientId: "rafael-costa",
    caseNumber: "0009876-12.2025.8.04.0001",
    actionType: "Execucao de acordo",
    court: "8a Vara Civel",
    district: "Manaus",
    state: "AM",
    opposingParty: "Construtora Norte Ltda.",
    claimValueCents: 7200000,
    status: "execution",
    proceduralPhase: "Cumprimento de sentenca",
    startDate: "2025-10-04",
    notes: "Penhora online solicitada.",
  },
  {
    id: "cobranca-ls",
    clientId: "ls-comercio",
    caseNumber: "0004567-89.2026.8.04.0001",
    actionType: "Cobranca empresarial",
    court: "1a Vara Empresarial",
    district: "Manaus",
    state: "AM",
    opposingParty: "Norte Distribuidora",
    claimValueCents: 8900000,
    status: "waiting_hearing",
    proceduralPhase: "Audiencia de conciliacao",
    startDate: "2026-03-28",
    notes: "Audiencia prevista para julho.",
  },
  {
    id: "indenizacao-patricia",
    clientId: "patricia-nunes",
    caseNumber: "0003333-22.2025.8.04.0001",
    actionType: "Indenizacao por danos morais",
    court: "5a Vara Civel",
    district: "Manaus",
    state: "AM",
    opposingParty: "Clinica Vida",
    claimValueCents: 1625000,
    status: "sentence",
    proceduralPhase: "Sentenca",
    startDate: "2025-11-11",
    notes: "Aguardando publicacao da decisao.",
  },
]

export const legalFees: LegalFee[] = [
  {
    id: "honorarios-marina",
    clientId: "marina-almeida",
    caseId: "revisional-marina",
    contractName: "Contrato revisional Marina Almeida",
    totalValueCents: 960000,
    entryValueCents: 240000,
    installmentsCount: 6,
    installmentValueCents: 120000,
    firstDueDate: "2026-02-10",
    status: "pending",
    notes: "Contrato com entrada paga e parcelas mensais no dia 10.",
  },
  {
    id: "honorarios-ls",
    clientId: "ls-comercio",
    caseId: "cobranca-ls",
    contractName: "Contrato empresarial LS Comercio",
    totalValueCents: 2400000,
    entryValueCents: 0,
    installmentsCount: 12,
    installmentValueCents: 200000,
    firstDueDate: "2026-04-15",
    status: "pending",
    notes: "Contrato parcelado em 12 vezes, vinculado a cobranca empresarial.",
  },
  {
    id: "honorarios-rafael",
    clientId: "rafael-costa",
    caseId: "execucao-rafael",
    contractName: "Execucao de acordo Rafael Costa",
    totalValueCents: 840000,
    entryValueCents: 140000,
    installmentsCount: 5,
    installmentValueCents: 140000,
    firstDueDate: "2026-01-20",
    status: "overdue",
    notes: "Duas parcelas pendentes para regularizacao.",
  },
]

export const feeInstallments: FeeInstallment[] = [
  {
    id: "marina-entrada",
    legalFeeId: "honorarios-marina",
    installmentNumber: 0,
    valueCents: 240000,
    dueDate: "2026-01-25",
    paidAt: "2026-01-25",
    paymentMethod: "PIX",
    status: "paid",
  },
  {
    id: "marina-1",
    legalFeeId: "honorarios-marina",
    installmentNumber: 1,
    valueCents: 120000,
    dueDate: "2026-02-10",
    paidAt: "2026-02-10",
    paymentMethod: "PIX",
    status: "paid",
  },
  {
    id: "marina-2",
    legalFeeId: "honorarios-marina",
    installmentNumber: 2,
    valueCents: 120000,
    dueDate: "2026-03-10",
    status: "overdue",
  },
  {
    id: "marina-3",
    legalFeeId: "honorarios-marina",
    installmentNumber: 3,
    valueCents: 120000,
    dueDate: "2026-04-10",
    status: "pending",
  },
  {
    id: "ls-1",
    legalFeeId: "honorarios-ls",
    installmentNumber: 1,
    valueCents: 200000,
    dueDate: "2026-04-15",
    paidAt: "2026-04-15",
    paymentMethod: "Transferencia",
    status: "paid",
  },
  {
    id: "ls-2",
    legalFeeId: "honorarios-ls",
    installmentNumber: 2,
    valueCents: 200000,
    dueDate: "2026-05-15",
    status: "pending",
  },
  {
    id: "rafael-entrada",
    legalFeeId: "honorarios-rafael",
    installmentNumber: 0,
    valueCents: 140000,
    dueDate: "2026-01-05",
    paidAt: "2026-01-05",
    paymentMethod: "Dinheiro",
    status: "paid",
  },
  {
    id: "rafael-1",
    legalFeeId: "honorarios-rafael",
    installmentNumber: 1,
    valueCents: 140000,
    dueDate: "2026-01-20",
    status: "overdue",
  },
  {
    id: "rafael-2",
    legalFeeId: "honorarios-rafael",
    installmentNumber: 2,
    valueCents: 140000,
    dueDate: "2026-02-20",
    status: "overdue",
  },
]

export const monthlyBills: MonthlyBill[] = [
  {
    id: "aluguel-junho",
    description: "Aluguel do escritorio",
    category: "office",
    valueCents: 320000,
    dueDate: "2026-06-05",
    status: "pending",
    recurring: true,
    notes: "Despesa fixa mensal do escritorio.",
  },
  {
    id: "sistema-juridico-junho",
    description: "Sistema juridico",
    category: "system",
    valueCents: 38900,
    dueDate: "2026-06-10",
    paidAt: "2026-06-10",
    status: "paid",
    recurring: true,
    notes: "Assinatura mensal.",
  },
  {
    id: "marketing-junho",
    description: "Gestao de trafego e marketing",
    category: "marketing",
    valueCents: 150000,
    dueDate: "2026-06-12",
    status: "overdue",
    recurring: true,
    notes: "Campanhas institucionais.",
  },
  {
    id: "custas-processuais-junho",
    description: "Custas processuais",
    category: "court_costs",
    valueCents: 78000,
    dueDate: "2026-06-18",
    status: "pending",
    recurring: false,
    notes: "Custas vinculadas a processos em andamento.",
  },
  {
    id: "impostos-junho",
    description: "Impostos e guias",
    category: "taxes",
    valueCents: 112000,
    dueDate: "2026-06-20",
    status: "pending",
    recurring: false,
    notes: "Guias do mes.",
  },
  {
    id: "cartao-junho",
    description: "Cartao corporativo",
    category: "card",
    valueCents: 94000,
    dueDate: "2026-06-22",
    status: "pending",
    recurring: true,
    notes: "Despesas operacionais.",
  },
  {
    id: "folha-julho",
    description: "Assistente administrativo",
    category: "employee",
    valueCents: 260000,
    dueDate: "2026-07-05",
    status: "pending",
    recurring: true,
    notes: "Folha prevista para julho.",
  },
]

export const clientStatusLabels: Record<ClientStatus, string> = {
  active: "Ativo",
  inactive: "Inativo",
}

export const caseStatusLabels: Record<CaseStatus, string> = {
  in_review: "Em analise",
  in_progress: "Em andamento",
  waiting_hearing: "Aguardando audiencia",
  sentence: "Sentenca",
  execution: "Execucao",
  agreement: "Acordo",
  archived: "Arquivado",
  closed: "Encerrado",
}

export const legalFeeStatusLabels: Record<LegalFeeStatus, string> = {
  pending: "Pendente",
  paid: "Pago",
  overdue: "Vencido",
  cancelled: "Cancelado",
}

export const feeInstallmentStatusLabels: Record<FeeInstallmentStatus, string> = {
  pending: "Pendente",
  paid: "Pago",
  overdue: "Vencido",
  cancelled: "Cancelado",
}

export const monthlyBillStatusLabels: Record<MonthlyBillStatus, string> = {
  overdue: "Vencido",
  paid: "Pago",
  pending: "Pendente",
}

export const monthlyBillCategoryLabels: Record<MonthlyBillCategory, string> = {
  card: "Cartao",
  court_costs: "Custas processuais",
  employee: "Funcionario",
  marketing: "Marketing",
  office: "Escritorio",
  other: "Outros",
  personal: "Pessoal",
  system: "Sistema",
  taxes: "Impostos",
}

export function getClients() {
  return clients
}

export function getClientById(id: string) {
  return clients.find((client) => client.id === id)
}

export function getCases() {
  return legalCases.map((legalCase) => ({
    ...legalCase,
    client: getClientById(legalCase.clientId),
  }))
}

export function getCaseById(id: string) {
  const legalCase = legalCases.find((currentCase) => currentCase.id === id)

  if (!legalCase) {
    return undefined
  }

  return {
    ...legalCase,
    client: getClientById(legalCase.clientId),
  }
}

export function getCasesByClientId(clientId: string) {
  return legalCases.filter((legalCase) => legalCase.clientId === clientId)
}

export function getLegalFees() {
  return legalFees.map((legalFee) => ({
    ...legalFee,
    case: legalFee.caseId ? getCaseById(legalFee.caseId) : undefined,
    client: getClientById(legalFee.clientId),
    installments: getFeeInstallmentsByLegalFeeId(legalFee.id),
  }))
}

export function getFeeInstallmentsByLegalFeeId(legalFeeId: string) {
  return feeInstallments.filter(
    (installment) => installment.legalFeeId === legalFeeId
  )
}

export function getLegalFeeSummary(legalFeeId: string) {
  const installments = getFeeInstallmentsByLegalFeeId(legalFeeId)
  const paidCents = installments
    .filter((installment) => installment.status === "paid")
    .reduce((total, installment) => total + installment.valueCents, 0)
  const overdueCents = installments
    .filter((installment) => installment.status === "overdue")
    .reduce((total, installment) => total + installment.valueCents, 0)
  const pendingCents = installments
    .filter((installment) => installment.status !== "paid")
    .reduce((total, installment) => total + installment.valueCents, 0)

  return {
    overdueCents,
    paidCents,
    pendingCents,
    paidCount: installments.filter((installment) => installment.status === "paid")
      .length,
    totalCount: installments.length,
  }
}

export function generateInstallmentPreview({
  entryValueCents,
  firstDueDate,
  installmentsCount,
  installmentValueCents,
}: {
  entryValueCents: number
  firstDueDate: string
  installmentsCount: number
  installmentValueCents: number
}) {
  const preview: FeeInstallment[] = []

  if (entryValueCents > 0) {
    preview.push({
      id: "preview-entry",
      legalFeeId: "preview",
      installmentNumber: 0,
      valueCents: entryValueCents,
      dueDate: firstDueDate,
      status: "pending",
    })
  }

  for (let index = 0; index < installmentsCount; index += 1) {
    const dueDate = new Date(`${firstDueDate}T00:00:00`)
    dueDate.setMonth(dueDate.getMonth() + index)

    preview.push({
      id: `preview-${index + 1}`,
      legalFeeId: "preview",
      installmentNumber: index + 1,
      valueCents: installmentValueCents,
      dueDate: dueDate.toISOString().slice(0, 10),
      status: "pending",
    })
  }

  return preview
}

export function getMonthlyBills() {
  return monthlyBills
}

export function getMonthlyBillsByMonth(month: string) {
  return monthlyBills.filter((bill) => bill.dueDate.startsWith(month))
}

export function getMonthlyBillsSummary(month: string) {
  const bills = getMonthlyBillsByMonth(month)
  const paidCents = bills
    .filter((bill) => bill.status === "paid")
    .reduce((total, bill) => total + bill.valueCents, 0)
  const pendingCents = bills
    .filter((bill) => bill.status === "pending")
    .reduce((total, bill) => total + bill.valueCents, 0)
  const overdueCents = bills
    .filter((bill) => bill.status === "overdue")
    .reduce((total, bill) => total + bill.valueCents, 0)
  const totalCents = bills.reduce((total, bill) => total + bill.valueCents, 0)

  return {
    bills,
    overdueCents,
    paidCents,
    pendingCents,
    totalCents,
  }
}
