export type DataProvider = "mock" | "supabase"

export function getDataProvider(): DataProvider {
  return process.env.NEXT_PUBLIC_DATA_PROVIDER === "supabase"
    ? "supabase"
    : "mock"
}

export function selectService<TService>({
  mock,
  supabase,
}: {
  mock: TService
  supabase: TService
}) {
  return getDataProvider() === "supabase" ? supabase : mock
}

export function notImplementedForSupabase(methodName: string): never {
  throw new Error(
    `${methodName} ainda nao foi implementado para NEXT_PUBLIC_DATA_PROVIDER=supabase.`
  )
}
