import {
  BackToDashboardButton,
  RouteState,
} from "@/components/app/route-state"

export default function NotFound() {
  return (
    <RouteState
      action={<BackToDashboardButton />}
      description="O registro ou pagina solicitada nao foi encontrado. Verifique se o endereco esta correto ou retorne para a visao geral do sistema."
      eyebrow="Nao encontrado"
      title="Nao localizamos este conteudo"
    />
  )
}
