import {
  BackToDashboardButton,
  RouteState,
} from "@/components/app/route-state"

export default function NotFound() {
  return (
    <RouteState
      action={<BackToDashboardButton />}
      description="O registro ou pagina solicitada não foi encontrada. Verifique se o endereco esta correto ou retorne para a visão geral do sistema."
      eyebrow="Não encontrado"
      title="Não localizamos este conteúdo"
    />
  )
}
