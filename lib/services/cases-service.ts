import {
  getCaseById as getMockCaseById,
  getCases as getMockCases,
  legalCases,
} from "@/lib/mock-data"
import { type LegalCase } from "@/lib/domain"
import { getDataProvider } from "@/lib/services/data-provider"
import * as supabaseService from "@/lib/services/supabase/cases-service"

export type CaseInput = Omit<LegalCase, "id">
export type CaseUpdateInput = Partial<CaseInput>

export function getCases() {
  if (getDataProvider() === "supabase") {
    return supabaseService.getCases()
  }

  return legalCases
}

export function getCasesWithClient() {
  if (getDataProvider() === "supabase") {
    return supabaseService.getCasesWithClient()
  }

  return getMockCases()
}

export function getCaseById(id: string) {
  if (getDataProvider() === "supabase") {
    return supabaseService.getCaseById(id)
  }

  return getMockCaseById(id)
}

export function createCase(input: CaseInput): LegalCase {
  if (getDataProvider() === "supabase") {
    return supabaseService.createCase(input)
  }

  return {
    ...input,
    id: input.caseNumber.toLowerCase().replace(/\W+/g, "-"),
  }
}

export function updateCase(id: string, input: CaseUpdateInput) {
  if (getDataProvider() === "supabase") {
    return supabaseService.updateCase(id, input)
  }

  const currentCase = legalCases.find((legalCase) => legalCase.id === id)
  return currentCase ? { ...currentCase, ...input } : undefined
}

export function deleteCase(id: string) {
  if (getDataProvider() === "supabase") {
    return supabaseService.deleteCase(id)
  }

  return legalCases.some((legalCase) => legalCase.id === id)
}
