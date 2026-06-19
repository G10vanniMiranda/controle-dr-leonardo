import { ModulePage } from "@/components/app/module-page"

export default function ConfiguracoesPage() {
  return (
    <ModulePage
      title="Configuracoes"
      description="Perfil, seguranca, preferencias do escritorio e integracoes futuras."
      filters={["Usuario", "Permissao", "Status"]}
      rows={[
        {
          title: "Dr. Leonardo",
          subtitle: "Administrador principal",
          status: "Ativo",
          amount: "-",
        },
      ]}
    />
  )
}
