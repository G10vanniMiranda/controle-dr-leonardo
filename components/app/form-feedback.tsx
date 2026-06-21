import { AlertCircle, CheckCircle2 } from "lucide-react"

import { cn } from "@/lib/utils"

export function FormFeedback({
  children,
  tone = "success",
}: {
  children: React.ReactNode
  tone?: "success" | "error"
}) {
  const Icon = tone === "success" ? CheckCircle2 : AlertCircle

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-xl border px-3 py-2 text-sm",
        tone === "success"
          ? "border-primary/30 bg-primary/10 text-[#9db8ff]"
          : "border-destructive/35 bg-destructive/10 text-[#ffb4b4]"
      )}
    >
      <Icon className="size-4 shrink-0" />
      <span>{children}</span>
    </div>
  )
}
