import {
  Banknote,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  FileArchive,
  FileText,
  Gauge,
  HandCoins,
  Landmark,
  ReceiptText,
  Scale,
  Settings,
  Users,
} from "lucide-react"

export const navigationItems = [
  { href: "/dashboard", label: "Dashboard", icon: Gauge },
  { href: "/clientes", label: "Clientes", icon: Users },
  { href: "/processos", label: "Processos", icon: BriefcaseBusiness },
  { href: "/honorarios", label: "Honorarios", icon: HandCoins },
  { href: "/condenacoes", label: "Condenacoes", icon: Scale },
  { href: "/parcelamentos", label: "Parcelamentos", icon: Landmark },
  { href: "/contas", label: "Contas", icon: ReceiptText },
  { href: "/relatorios", label: "Relatorios", icon: ChartNoAxesCombined },
  { href: "/documentos", label: "Documentos", icon: FileArchive },
  { href: "/configuracoes", label: "Configuracoes", icon: Settings },
]

export const quickActions = [
  { href: "/clientes/novo", label: "Novo cliente", icon: Users },
  { href: "/processos/novo", label: "Novo processo", icon: FileText },
  { href: "/honorarios", label: "Honorarios", icon: Banknote },
]
