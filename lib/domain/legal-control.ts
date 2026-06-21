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

export const clientStatusLabels: Record<ClientStatus, string> = {
  active: "Ativo",
  inactive: "Inativo",
}

export const caseStatusLabels: Record<CaseStatus, string> = {
  agreement: "Acordo",
  archived: "Arquivado",
  closed: "Encerrado",
  execution: "Execucao",
  in_progress: "Em andamento",
  in_review: "Em analise",
  sentence: "Sentenca",
  waiting_hearing: "Aguardando audiencia",
}

export const legalFeeStatusLabels: Record<LegalFeeStatus, string> = {
  cancelled: "Cancelado",
  overdue: "Vencido",
  paid: "Pago",
  pending: "Pendente",
}

export const feeInstallmentStatusLabels: Record<FeeInstallmentStatus, string> = {
  cancelled: "Cancelado",
  overdue: "Vencido",
  paid: "Pago",
  pending: "Pendente",
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
