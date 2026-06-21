import { type LegalCase } from "@/lib/domain"
import { notImplementedForSupabase } from "@/lib/services/data-provider"
import type { CaseInput, CaseUpdateInput } from "@/lib/services/cases-service"

export function getCases(): LegalCase[] {
  return notImplementedForSupabase("getCases")
}

export function getCasesWithClient() {
  return notImplementedForSupabase("getCasesWithClient")
}

export function getCaseById(_id: string) {
  return notImplementedForSupabase("getCaseById")
}

export function createCase(_input: CaseInput): LegalCase {
  return notImplementedForSupabase("createCase")
}

export function updateCase(
  _id: string,
  _input: CaseUpdateInput
): LegalCase | undefined {
  return notImplementedForSupabase("updateCase")
}

export function deleteCase(_id: string): boolean {
  return notImplementedForSupabase("deleteCase")
}
