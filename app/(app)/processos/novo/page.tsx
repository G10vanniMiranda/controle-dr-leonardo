import { ModulePage } from "@/components/app/module-page"

export default function NovoProcessoPage() {
  return (
    <ModulePage
      title="Novo processo"
      description="Formulario inicial para cliente, numero, vara, comarca, valor e fase."
      filters={["Cliente", "Numero do processo", "Status"]}
    />
  )
}
