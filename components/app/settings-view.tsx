import { CheckCircle2, LockKeyhole, ShieldCheck, UserCog } from "lucide-react"

import { type ActivityLog } from "@/lib/domain"
import { dateFormatter } from "@/lib/formatters"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const securityItems = [
  "Rotas privadas protegidas pelo proxy do Supabase quando as envs existirem",
  "RLS previsto no schema Supabase para isolamento por usuario",
  "Chaves sensiveis fora do frontend",
  "Confirmação em ações destrutivas",
  "Logs de atividades importantes previstos",
]

export function SettingsView({ activityLogs }: { activityLogs: ActivityLog[] }) {
  return (
    <div className="grid gap-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          Fase 6
        </p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
          Configurações
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Perfil, segurança, logs e preferências preparadas para a etapa com banco.
        </p>
      </div>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Perfil</CardTitle>
            <CardDescription>Usuário mockado da sessão atual.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 rounded-xl border border-border bg-secondary p-4">
              <span className="flex size-11 items-center justify-center rounded-xl bg-hover text-sm font-semibold text-foreground">
                DL
              </span>
              <div>
                <p className="font-semibold text-foreground">Dr. Leonardo</p>
                <p className="text-sm text-muted-foreground">Administrador</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Checklist de segurança</CardTitle>
            <CardDescription>
              Itens fundamentais para fechar antes de conectar o banco.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {securityItems.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-xl border border-border bg-secondary p-3 text-sm text-muted-foreground"
              >
                <CheckCircle2 className="size-4 text-primary" />
                {item}
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Permissões</CardDescription>
            <CardTitle className="flex items-center gap-2 text-xl">
              <UserCog className="size-5 text-primary" />
              Administrador
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Autenticação</CardDescription>
            <CardTitle className="flex items-center gap-2 text-xl">
              <LockKeyhole className="size-5 text-primary" />
              Supabase Auth
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Storage</CardDescription>
            <CardTitle className="flex items-center gap-2 text-xl">
              <ShieldCheck className="size-5 text-primary" />
              Protegido por usuário
            </CardTitle>
          </CardHeader>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Logs de atividade</CardTitle>
          <CardDescription>
            Histórico das principais operações do sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ação</TableHead>
                <TableHead>Entidade</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activityLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <div className="font-medium text-foreground">{log.action}</div>
                    <div className="text-xs text-tertiary">{log.metadata}</div>
                  </TableCell>
                  <TableCell>{log.entityLabel}</TableCell>
                  <TableCell>{log.actor}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{log.entityType}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {dateFormatter.format(new Date(log.createdAt))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
