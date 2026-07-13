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
    <main className="grid min-h-svh place-items-center bg-background px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[0_14px_30px_rgba(37,99,235,0.22)]">
            <Scale className="size-6" />
          </div>
          <CardTitle className="text-2xl font-bold">Dr. Leonardo Controle</CardTitle>
          <CardDescription>
            Acesse o painel juridico e financeiro do escritório.
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
