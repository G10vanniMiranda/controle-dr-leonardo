import "server-only"

import {
  getCaseById as getMockCaseById,
  getCases as getMockCases,
  legalCases,
} from "@/lib/mock-data"
import { getDataProvider } from "@/lib/services/data-provider"
import type { CaseInput, CaseUpdateInput } from "@/lib/services/cases-service"
import * as supabaseService from "@/lib/services/supabase/cases-service"

export async function getCasesAsync() {
  return getDataProvider() === "supabase"
    ? supabaseService.getCases()
    : legalCases
}

export async function getCasesWithClientAsync() {
  return getDataProvider() === "supabase"
    ? supabaseService.getCasesWithClient()
    : getMockCases()
}

export async function getCaseByIdAsync(id: string) {
  return getDataProvider() === "supabase"
    ? supabaseService.getCaseById(id)
    : getMockCaseById(id)
}

export async function createCaseAsync(input: CaseInput) {
  if (getDataProvider() === "supabase") {
    return supabaseService.createCase(input)
  }

  return {
    ...input,
    id: input.caseNumber.toLowerCase().replace(/\W+/g, "-"),
  }
}

export async function updateCaseAsync(id: string, input: CaseUpdateInput) {
  if (getDataProvider() === "supabase") {
    return supabaseService.updateCase(id, input)
  }

  const currentCase = legalCases.find((legalCase) => legalCase.id === id)
  return currentCase ? { ...currentCase, ...input } : undefined
}

export async function deleteCaseAsync(id: string) {
  return getDataProvider() === "supabase"
    ? supabaseService.deleteCase(id)
    : legalCases.some((legalCase) => legalCase.id === id)
}
