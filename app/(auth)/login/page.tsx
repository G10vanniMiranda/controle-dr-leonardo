import { Scale } from "lucide-react"
import { Suspense } from "react"

import { LoginForm } from "./login-form"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function LoginPage() {
  return (
    <main className="grid min-h-svh place-items-center bg-muted/30 px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Scale className="size-6" />
          </div>
          <CardTitle className="text-2xl">Dr. Leonardo Controle</CardTitle>
          <CardDescription>
            Acesse o painel juridico e financeiro do escritorio.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </CardContent>
      </Card>
    </main>
  )
}
