import {
  getCaseById as getMockCaseById,
  getCases as getMockCases,
  legalCases,
} from "@/lib/mock-data"
import { type Client, type LegalCase } from "@/lib/domain"
import { getDataProvider } from "@/lib/services/data-provider"

export type LegalCaseWithClient = LegalCase & { client?: Client }
export type CaseInput = Omit<LegalCase, "id">
export type CaseUpdateInput = Partial<CaseInput>

export function getCases() {
  if (getDataProvider() === "supabase") {
    throw new Error("Use getCasesAsync() with NEXT_PUBLIC_DATA_PROVIDER=supabase.")
  }

  return legalCases
}

export async function getCasesAsync() {
  if (getDataProvider() === "supabase") {
    throw new Error(
      "Import getCasesAsync from '@/lib/services/server/cases-service' in Server Components."
    )
  }

  return legalCases
}

export function getCasesWithClient() {
  if (getDataProvider() === "supabase") {
    throw new Error(
      "Use getCasesWithClientAsync() with NEXT_PUBLIC_DATA_PROVIDER=supabase."
    )
  }

  return getMockCases()
}

export async function getCasesWithClientAsync(): Promise<LegalCaseWithClient[]> {
  if (getDataProvider() === "supabase") {
    throw new Error(
      "Import getCasesWithClientAsync from '@/lib/services/server/cases-service' in Server Components."
    )
  }

  return getMockCases()
}

export function getCaseById(id: string) {
  if (getDataProvider() === "supabase") {
    throw new Error("Use getCaseByIdAsync() with NEXT_PUBLIC_DATA_PROVIDER=supabase.")
  }

  return getMockCaseById(id)
}

export async function getCaseByIdAsync(id: string) {
  if (getDataProvider() === "supabase") {
    throw new Error(
      "Import getCaseByIdAsync from '@/lib/services/server/cases-service' in Server Components."
    )
  }

  return getMockCaseById(id)
}

export function createCase(input: CaseInput): LegalCase {
  if (getDataProvider() === "supabase") {
    throw new Error("Use createCaseAsync() with NEXT_PUBLIC_DATA_PROVIDER=supabase.")
  }

  return {
    ...input,
    id: input.caseNumber.toLowerCase().replace(/\W+/g, "-"),
  }
}

export async function createCaseAsync(input: CaseInput) {
  if (getDataProvider() === "supabase") {
    throw new Error(
      "Import createCaseAsync from '@/lib/services/server/cases-service' in Server Components."
    )
  }

  return createCase(input)
}

export function updateCase(id: string, input: CaseUpdateInput) {
  if (getDataProvider() === "supabase") {
    throw new Error("Use updateCaseAsync() with NEXT_PUBLIC_DATA_PROVIDER=supabase.")
  }

  const currentCase = legalCases.find((legalCase) => legalCase.id === id)
  return currentCase ? { ...currentCase, ...input } : undefined
}

export async function updateCaseAsync(id: string, input: CaseUpdateInput) {
  if (getDataProvider() === "supabase") {
    throw new Error(
      "Import updateCaseAsync from '@/lib/services/server/cases-service' in Server Components."
    )
  }

  return updateCase(id, input)
}

export function deleteCase(id: string) {
  if (getDataProvider() === "supabase") {
    throw new Error("Use deleteCaseAsync() with NEXT_PUBLIC_DATA_PROVIDER=supabase.")
  }

  return legalCases.some((legalCase) => legalCase.id === id)
}

export async function deleteCaseAsync(id: string) {
  if (getDataProvider() === "supabase") {
    throw new Error(
      "Import deleteCaseAsync from '@/lib/services/server/cases-service' in Server Components."
    )
  }

  return deleteCase(id)
}
