import type {
  EvidenceType,
  OutcomeCase,
  OutcomeEvaluation,
} from "./types";

const requiredEvidenceByOutcome: Record<string, EvidenceType[]> = {
  PENSION_PAYMENT_RECEIVED: ["PENSION_CREDIT"],
};

export function evaluateOutcome(input: OutcomeCase): OutcomeEvaluation {
  const requiredEvidence =
    requiredEvidenceByOutcome[input.requestedOutcome.type] ?? [];
  const availableEvidence = new Set(input.evidence.map((item) => item.type));
  const actionTypes = new Set(input.governmentActions.map((item) => item.type));
  const missingEvidence = requiredEvidence.filter(
    (item) => !availableEvidence.has(item),
  );
  const governmentActionSummary =
    input.governmentActions.at(-1)?.label ?? "No government action recorded";

  if (missingEvidence.length === 0) {
    return {
      status: "RESOLVED",
      reasonCode: "REQUIRED_EVIDENCE_PRESENT",
      requestedOutcome: input.requestedOutcome.description,
      governmentActionSummary,
      requiredEvidence,
      missingEvidence,
      recommendedAction: "NO_ACTION",
    };
  }

  if (actionTypes.has("BANK_VERIFICATION_REQUIRED")) {
    return {
      status: "ACTION_REQUIRED",
      reasonCode: "CITIZEN_ACTION_REQUIRED",
      requestedOutcome: input.requestedOutcome.description,
      governmentActionSummary,
      requiredEvidence,
      missingEvidence,
      recommendedAction: "COMPLETE_REQUIRED_ACTION",
    };
  }

  if (actionTypes.has("FORWARDED")) {
    return {
      status: "NOT_RESOLVED",
      reasonCode: "ADMINISTRATIVE_ACTION_WITHOUT_OUTCOME_EVIDENCE",
      requestedOutcome: input.requestedOutcome.description,
      governmentActionSummary,
      requiredEvidence,
      missingEvidence,
      recommendedAction: "APPEAL_CLOSURE",
    };
  }

  return {
    status: "INSUFFICIENT_EVIDENCE",
    reasonCode: "REQUIRED_EVIDENCE_MISSING",
    requestedOutcome: input.requestedOutcome.description,
    governmentActionSummary,
    requiredEvidence,
    missingEvidence,
    recommendedAction: "WAIT_FOR_EVIDENCE",
  };
}
