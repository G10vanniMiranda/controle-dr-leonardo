import { existsSync, readFileSync, readdirSync } from "node:fs"
import { join } from "node:path"

const root = process.cwd()
const envFiles = [".env", ".env.local", ".env.production", ".env.production.local"]
const requiredEnv = [
  "NEXT_PUBLIC_DATA_PROVIDER",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
]

function readEnvFile(fileName) {
  const filePath = join(root, fileName)

  if (!existsSync(filePath)) {
    return {}
  }

  return Object.fromEntries(
    readFileSync(filePath, "utf8")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"))
      .map((line) => {
        const separatorIndex = line.indexOf("=")

        if (separatorIndex === -1) {
          return [line, ""]
        }

        const key = line.slice(0, separatorIndex).trim()
        const value = line
          .slice(separatorIndex + 1)
          .trim()
          .replace(/^['"]|['"]$/g, "")

        return [key, value]
      })
  )
}

function getEnv() {
  return envFiles.reduce(
    (env, fileName) => ({ ...env, ...readEnvFile(fileName) }),
    { ...process.env }
  )
}

function collectSupabaseStubs() {
  const supabaseServicesDir = join(root, "lib", "services", "supabase")

  if (!existsSync(supabaseServicesDir)) {
    return ["lib/services/supabase directory is missing"]
  }

  return readdirSync(supabaseServicesDir)
    .filter((fileName) => fileName.endsWith(".ts"))
    .flatMap((fileName) => {
      const relativePath = `lib/services/supabase/${fileName}`
      const contents = readFileSync(join(supabaseServicesDir, fileName), "utf8")

      return contents.includes("notImplementedForSupabase")
        ? [relativePath]
        : []
    })
}

const env = getEnv()
const failures = []
const warnings = []

for (const key of requiredEnv) {
  if (!env[key]) {
    failures.push(`Missing required environment variable: ${key}`)
  }
}

if (env.NEXT_PUBLIC_DATA_PROVIDER && env.NEXT_PUBLIC_DATA_PROVIDER !== "supabase") {
  failures.push("NEXT_PUBLIC_DATA_PROVIDER must be supabase for production.")
}

if (
  env.NEXT_PUBLIC_SUPABASE_URL &&
  !env.NEXT_PUBLIC_SUPABASE_URL.startsWith("https://")
) {
  failures.push("NEXT_PUBLIC_SUPABASE_URL must be an HTTPS Supabase project URL.")
}

if (
  env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY &&
  env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.length < 20
) {
  failures.push("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY looks too short.")
}

if (!existsSync(join(root, "proxy.ts"))) {
  failures.push("proxy.ts is required to protect private routes.")
}

if (!existsSync(join(root, "supabase", "migrations"))) {
  failures.push("supabase/migrations is required before production.")
}

const stubs = collectSupabaseStubs()

if (stubs.length > 0) {
  failures.push(
    `Supabase service implementations are still incomplete:\n${stubs
      .map((filePath) => `  - ${filePath}`)
      .join("\n")}`
  )
}

if (!existsSync(join(root, "app", "(app)", "error.tsx"))) {
  warnings.push("Missing app/(app)/error.tsx route error boundary.")
}

if (!existsSync(join(root, "app", "(app)", "not-found.tsx"))) {
  warnings.push("Missing app/(app)/not-found.tsx route not-found state.")
}

if (warnings.length > 0) {
  console.warn("Production check warnings:")
  warnings.forEach((warning) => console.warn(`- ${warning}`))
  console.warn("")
}

if (failures.length > 0) {
  console.error("Production check failed:")
  failures.forEach((failure) => console.error(`- ${failure}`))
  process.exit(1)
}

console.log("Production check passed.")
