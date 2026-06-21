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

export type CondemnationStatus = "open" | "installment" | "paid" | "execution"

export type Condemnation = {
  id: string
  caseId: string
  debtorParty: string
  creditorParty: string
  originalValueCents: number
  updatedValueCents: number
  interestCents: number
  fineCents: number
  decisionDate: string
  status: CondemnationStatus
  notes: string
}

export type CondemnationPayment = {
  id: string
  condemnationId: string
  valueCents: number
  paidAt: string
  paymentMethod: string
  notes: string
}

export type DebtInstallmentStatus = "active" | "paid" | "overdue" | "cancelled"

export type DebtInstallmentPlan = {
  id: string
  clientId: string
  caseId?: string
  description: string
  totalValueCents: number
  entryValueCents: number
  installmentsCount: number
  installmentValueCents: number
  dueDay: number
  status: DebtInstallmentStatus
  notes: string
}

export type DebtInstallmentPaymentStatus = "pending" | "paid" | "overdue"

export type DebtInstallmentPayment = {
  id: string
  debtInstallmentId: string
  installmentNumber: number
  valueCents: number
  dueDate: string
  paidAt?: string
  receiptName?: string
  status: DebtInstallmentPaymentStatus
}

export type DocumentType =
  | "contract"
  | "power_of_attorney"
  | "identity"
  | "payment_receipt"
  | "petition"
  | "sentence"
  | "agreement"
  | "other"

export type DocumentModule =
  | "client"
  | "case"
  | "legal_fee"
  | "condemnation"
  | "debt_installment"

export type DocumentRecord = {
  id: string
  userId: string
  module: DocumentModule
  type: DocumentType
  linkedEntityLabel: string
  clientId?: string
  caseId?: string
  fileName: string
  storagePath: string
  mimeType: string
  sizeBytes: number
  createdAt: string
}

export type ActivityLog = {
  id: string
  entityType: string
  entityLabel: string
  action: string
  actor: string
  createdAt: string
  metadata: string
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

export const condemnations: Condemnation[] = [
  {
    id: "condenacao-rafael",
    caseId: "execucao-rafael",
    debtorParty: "Construtora Norte Ltda.",
    creditorParty: "Rafael Costa",
    originalValueCents: 3210000,
    updatedValueCents: 3715000,
    interestCents: 350000,
    fineCents: 155000,
    decisionDate: "2026-02-14",
    status: "execution",
    notes: "Execucao em andamento com pedido de bloqueio de ativos.",
  },
  {
    id: "condenacao-marina",
    caseId: "revisional-marina",
    debtorParty: "Banco Alfa S.A.",
    creditorParty: "Marina Almeida",
    originalValueCents: 1840000,
    updatedValueCents: 2015000,
    interestCents: 125000,
    fineCents: 50000,
    decisionDate: "2026-04-02",
    status: "open",
    notes: "Aguardando prazo para pagamento voluntario.",
  },
  {
    id: "condenacao-ls",
    caseId: "cobranca-ls",
    debtorParty: "Norte Distribuidora",
    creditorParty: "LS Comercio Ltda.",
    originalValueCents: 6150000,
    updatedValueCents: 6425000,
    interestCents: 210000,
    fineCents: 65000,
    decisionDate: "2026-05-20",
    status: "installment",
    notes: "Acordo parcelado em acompanhamento.",
  },
]

export const condemnationPayments: CondemnationPayment[] = [
  {
    id: "pagamento-condenacao-ls-1",
    condemnationId: "condenacao-ls",
    valueCents: 1200000,
    paidAt: "2026-06-05",
    paymentMethod: "Transferencia",
    notes: "Primeira parcela do acordo.",
  },
  {
    id: "pagamento-condenacao-rafael-1",
    condemnationId: "condenacao-rafael",
    valueCents: 500000,
    paidAt: "2026-05-29",
    paymentMethod: "Deposito judicial",
    notes: "Pagamento parcial registrado.",
  },
]

export const debtInstallments: DebtInstallmentPlan[] = [
  {
    id: "parcelamento-ls-acordo",
    clientId: "ls-comercio",
    caseId: "cobranca-ls",
    description: "Acordo de quitacao Norte Distribuidora",
    totalValueCents: 6425000,
    entryValueCents: 1200000,
    installmentsCount: 8,
    installmentValueCents: 653125,
    dueDay: 10,
    status: "active",
    notes: "Parcelamento originado de condenacao em aberto.",
  },
  {
    id: "parcelamento-rafael-divida",
    clientId: "rafael-costa",
    caseId: "execucao-rafael",
    description: "Quitacao de saldo residual",
    totalValueCents: 1550000,
    entryValueCents: 250000,
    installmentsCount: 5,
    installmentValueCents: 260000,
    dueDay: 20,
    status: "overdue",
    notes: "Duas parcelas vencidas.",
  },
]

export const debtInstallmentPayments: DebtInstallmentPayment[] = [
  {
    id: "ls-acordo-entrada",
    debtInstallmentId: "parcelamento-ls-acordo",
    installmentNumber: 0,
    valueCents: 1200000,
    dueDate: "2026-06-05",
    paidAt: "2026-06-05",
    receiptName: "comprovante-entrada-ls.pdf",
    status: "paid",
  },
  {
    id: "ls-acordo-1",
    debtInstallmentId: "parcelamento-ls-acordo",
    installmentNumber: 1,
    valueCents: 653125,
    dueDate: "2026-07-10",
    status: "pending",
  },
  {
    id: "ls-acordo-2",
    debtInstallmentId: "parcelamento-ls-acordo",
    installmentNumber: 2,
    valueCents: 653125,
    dueDate: "2026-08-10",
    status: "pending",
  },
  {
    id: "rafael-divida-entrada",
    debtInstallmentId: "parcelamento-rafael-divida",
    installmentNumber: 0,
    valueCents: 250000,
    dueDate: "2026-02-01",
    paidAt: "2026-02-01",
    receiptName: "entrada-rafael.pdf",
    status: "paid",
  },
  {
    id: "rafael-divida-1",
    debtInstallmentId: "parcelamento-rafael-divida",
    installmentNumber: 1,
    valueCents: 260000,
    dueDate: "2026-03-20",
    status: "overdue",
  },
  {
    id: "rafael-divida-2",
    debtInstallmentId: "parcelamento-rafael-divida",
    installmentNumber: 2,
    valueCents: 260000,
    dueDate: "2026-04-20",
    status: "overdue",
  },
]

export const documents: DocumentRecord[] = [
  {
    id: "doc-contrato-marina",
    userId: "mock-user",
    module: "legal_fee",
    type: "contract",
    linkedEntityLabel: "Contrato revisional Marina Almeida",
    clientId: "marina-almeida",
    caseId: "revisional-marina",
    fileName: "contrato-honorarios-marina.pdf",
    storagePath: "mock/legal-fees/contrato-honorarios-marina.pdf",
    mimeType: "application/pdf",
    sizeBytes: 482000,
    createdAt: "2026-01-25",
  },
  {
    id: "doc-procuracao-rafael",
    userId: "mock-user",
    module: "client",
    type: "power_of_attorney",
    linkedEntityLabel: "Rafael Costa",
    clientId: "rafael-costa",
    fileName: "procuracao-rafael.pdf",
    storagePath: "mock/clients/procuracao-rafael.pdf",
    mimeType: "application/pdf",
    sizeBytes: 356000,
    createdAt: "2026-02-04",
  },
  {
    id: "doc-sentenca-patricia",
    userId: "mock-user",
    module: "case",
    type: "sentence",
    linkedEntityLabel: "0003333-22.2025.8.04.0001",
    clientId: "patricia-nunes",
    caseId: "indenizacao-patricia",
    fileName: "sentenca-patricia.pdf",
    storagePath: "mock/cases/sentenca-patricia.pdf",
    mimeType: "application/pdf",
    sizeBytes: 721000,
    createdAt: "2026-05-11",
  },
  {
    id: "doc-comprovante-ls",
    userId: "mock-user",
    module: "debt_installment",
    type: "payment_receipt",
    linkedEntityLabel: "Acordo de quitacao Norte Distribuidora",
    clientId: "ls-comercio",
    caseId: "cobranca-ls",
    fileName: "comprovante-entrada-ls.pdf",
    storagePath: "mock/debt-installments/comprovante-entrada-ls.pdf",
    mimeType: "application/pdf",
    sizeBytes: 198000,
    createdAt: "2026-06-05",
  },
]

export const activityLogs: ActivityLog[] = [
  {
    id: "log-cliente-marina",
    entityType: "client",
    entityLabel: "Marina Almeida",
    action: "Cliente criado",
    actor: "Dr. Leonardo",
    createdAt: "2026-01-12T10:20:00",
    metadata: "Cadastro inicial no sistema mock.",
  },
  {
    id: "log-processo-rafael",
    entityType: "case",
    entityLabel: "0009876-12.2025.8.04.0001",
    action: "Processo atualizado",
    actor: "Dr. Leonardo",
    createdAt: "2026-05-29T15:45:00",
    metadata: "Registro de pagamento parcial em condenacao.",
  },
  {
    id: "log-parcela-ls",
    entityType: "debt_installment",
    entityLabel: "Acordo de quitacao Norte Distribuidora",
    action: "Comprovante anexado",
    actor: "Dr. Leonardo",
    createdAt: "2026-06-05T09:10:00",
    metadata: "Documento mock vinculado ao parcelamento.",
  },
  {
    id: "log-conta-sistema",
    entityType: "monthly_bill",
    entityLabel: "Sistema juridico",
    action: "Conta marcada como paga",
    actor: "Dr. Leonardo",
    createdAt: "2026-06-10T11:00:00",
    metadata: "Pagamento mensal registrado.",
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

export const condemnationStatusLabels: Record<CondemnationStatus, string> = {
  execution: "Em execucao",
  installment: "Parcelado",
  open: "Em aberto",
  paid: "Quitado",
}

export const debtInstallmentStatusLabels: Record<DebtInstallmentStatus, string> = {
  active: "Ativo",
  cancelled: "Cancelado",
  overdue: "Vencido",
  paid: "Quitado",
}

export const debtInstallmentPaymentStatusLabels: Record<
  DebtInstallmentPaymentStatus,
  string
> = {
  overdue: "Vencida",
  paid: "Paga",
  pending: "Pendente",
}

export const documentTypeLabels: Record<DocumentType, string> = {
  agreement: "Acordo",
  contract: "Contrato",
  identity: "RG/CPF",
  other: "Outros",
  payment_receipt: "Comprovante de pagamento",
  petition: "Peticao",
  power_of_attorney: "Procuracao",
  sentence: "Sentenca",
}

export const documentModuleLabels: Record<DocumentModule, string> = {
  case: "Processo",
  client: "Cliente",
  condemnation: "Condenacao",
  debt_installment: "Parcelamento",
  legal_fee: "Honorarios",
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

export function getCondemnations() {
  return condemnations.map((condemnation) => ({
    ...condemnation,
    case: getCaseById(condemnation.caseId),
    payments: getCondemnationPayments(condemnation.id),
  }))
}

export function getCondemnationPayments(condemnationId: string) {
  return condemnationPayments.filter(
    (payment) => payment.condemnationId === condemnationId
  )
}

export function getCondemnationSummary(condemnationId: string) {
  const condemnation = condemnations.find((item) => item.id === condemnationId)
  const paidCents = getCondemnationPayments(condemnationId).reduce(
    (total, payment) => total + payment.valueCents,
    0
  )
  const updatedValueCents = condemnation?.updatedValueCents ?? 0

  return {
    paidCents,
    remainingCents: Math.max(updatedValueCents - paidCents, 0),
    updatedValueCents,
  }
}

export function getDebtInstallments() {
  return debtInstallments.map((installment) => ({
    ...installment,
    case: installment.caseId ? getCaseById(installment.caseId) : undefined,
    client: getClientById(installment.clientId),
    payments: getDebtInstallmentPayments(installment.id),
  }))
}

export function getDebtInstallmentPayments(debtInstallmentId: string) {
  return debtInstallmentPayments.filter(
    (payment) => payment.debtInstallmentId === debtInstallmentId
  )
}

export function getDebtInstallmentSummary(debtInstallmentId: string) {
  const payments = getDebtInstallmentPayments(debtInstallmentId)
  const paidCents = payments
    .filter((payment) => payment.status === "paid")
    .reduce((total, payment) => total + payment.valueCents, 0)
  const overdueCents = payments
    .filter((payment) => payment.status === "overdue")
    .reduce((total, payment) => total + payment.valueCents, 0)
  const pendingCents = payments
    .filter((payment) => payment.status !== "paid")
    .reduce((total, payment) => total + payment.valueCents, 0)

  return {
    overdueCents,
    paidCents,
    paidCount: payments.filter((payment) => payment.status === "paid").length,
    pendingCents,
    totalCount: payments.length,
  }
}

export function getDocuments() {
  return documents
}

export function getActivityLogs() {
  return activityLogs
}

export function getReports() {
  const monthlyBillSummary = getMonthlyBillsSummary("2026-06")
  const legalFeesReceivedCents = feeInstallments
    .filter((installment) => installment.status === "paid")
    .reduce((total, installment) => total + installment.valueCents, 0)
  const overdueFeesCents = feeInstallments
    .filter((installment) => installment.status === "overdue")
    .reduce((total, installment) => total + installment.valueCents, 0)
  const activeCasesCount = legalCases.filter(
    (legalCase) =>
      legalCase.status !== "archived" && legalCase.status !== "closed"
  ).length
  const openCondemnationsCents = condemnations
    .filter((condemnation) => condemnation.status !== "paid")
    .reduce((total, condemnation) => total + condemnation.updatedValueCents, 0)

  return [
    {
      id: "recebimentos-mensais",
      title: "Recebimentos mensais",
      description: "Honorarios, pagamentos de condenacoes e parcelamentos.",
      status: "Disponivel",
      valueCents: legalFeesReceivedCents,
    },
    {
      id: "despesas-mensais",
      title: "Despesas mensais",
      description: "Contas pagas, pendentes e vencidas do periodo.",
      status: "Disponivel",
      valueCents: monthlyBillSummary.totalCents,
    },
    {
      id: "honorarios-pendentes",
      title: "Honorarios pendentes",
      description: "Parcelas de honorarios em aberto ou vencidas.",
      status: "Atencao",
      valueCents: overdueFeesCents,
    },
    {
      id: "processos-ativos",
      title: "Processos ativos",
      description: "Processos nao arquivados e nao encerrados.",
      status: "Disponivel",
      valueText: String(activeCasesCount),
    },
    {
      id: "condenacoes-abertas",
      title: "Condenacoes em aberto",
      description: "Valores atualizados ainda nao quitados.",
      status: "Atencao",
      valueCents: openCondemnationsCents,
    },
    {
      id: "saldo-financeiro",
      title: "Saldo financeiro mensal",
      description: "Recebimentos menos despesas previstas.",
      status: "Disponivel",
      valueCents: legalFeesReceivedCents - monthlyBillSummary.totalCents,
    },
  ]
}
