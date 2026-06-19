import {
  AlertTriangle,
  Banknote,
  BriefcaseBusiness,
  CircleDollarSign,
  Clock3,
  FileClock,
  HandCoins,
  ReceiptText,
} from "lucide-react"

export const dashboardMetrics = [
  {
    label: "Recebido no mes",
    value: "R$ 42.860,00",
    detail: "+18% sobre o mes anterior",
    icon: CircleDollarSign,
  },
  {
    label: "A receber no mes",
    value: "R$ 31.240,00",
    detail: "36 parcelas previstas",
    icon: HandCoins,
  },
  {
    label: "Total vencido",
    value: "R$ 8.740,00",
    detail: "7 pendencias exigem acao",
    icon: AlertTriangle,
  },
  {
    label: "Processos ativos",
    value: "128",
    detail: "14 com audiencia agendada",
    icon: BriefcaseBusiness,
  },
  {
    label: "Honorarios pendentes",
    value: "R$ 19.300,00",
    detail: "22 contratos em aberto",
    icon: Banknote,
  },
  {
    label: "Parcelamentos ativos",
    value: "41",
    detail: "R$ 52.900,00 em saldo",
    icon: FileClock,
  },
  {
    label: "Contas pendentes",
    value: "R$ 6.180,00",
    detail: "12 vencem neste mes",
    icon: ReceiptText,
  },
  {
    label: "Condenacoes abertas",
    value: "R$ 74.500,00",
    detail: "5 em execucao",
    icon: Clock3,
  },
]

export const monthlyFlow = [
  { month: "Jan", entradas: 32800, saidas: 14600 },
  { month: "Fev", entradas: 38200, saidas: 15800 },
  { month: "Mar", entradas: 35100, saidas: 17200 },
  { month: "Abr", entradas: 44700, saidas: 16600 },
  { month: "Mai", entradas: 41800, saidas: 19100 },
  { month: "Jun", entradas: 52800, saidas: 20300 },
]

export const categoryReceipts = [
  { name: "Honorarios", value: 56 },
  { name: "Condenacoes", value: 24 },
  { name: "Parcelamentos", value: 15 },
  { name: "Outros", value: 5 },
]

export const caseStatus = [
  { name: "Em andamento", total: 54 },
  { name: "Audiencia", total: 18 },
  { name: "Sentenca", total: 14 },
  { name: "Execucao", total: 26 },
  { name: "Acordo", total: 9 },
  { name: "Arquivado", total: 7 },
]

export const recentMatters = [
  {
    client: "Marina Almeida",
    matter: "Revisional contratual",
    status: "Em andamento",
    amount: "R$ 4.800,00",
  },
  {
    client: "Rafael Costa",
    matter: "Execucao de acordo",
    status: "Execucao",
    amount: "R$ 12.400,00",
  },
  {
    client: "LS Comercio Ltda.",
    matter: "Cobranca empresarial",
    status: "Aguardando audiencia",
    amount: "R$ 8.900,00",
  },
  {
    client: "Patricia Nunes",
    matter: "Indenizacao",
    status: "Sentenca",
    amount: "R$ 16.250,00",
  },
]
