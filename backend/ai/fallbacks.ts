import type { AppealDraft, ExplanationResult, IntentResult } from "@/backend/contracts/api";
import type { OutcomeEvaluation } from "@/backend/outcome-engine/types";

const summaryByStatus: Record<OutcomeEvaluation["status"], string> = {
  RESOLVED: "We found proof that your pension reached your account.",
  NOT_RESOLVED: "We cannot see proof that your pension reached your account.",
  ACTION_REQUIRED: "You need to complete one step before the payment can be made.",
  INSUFFICIENT_EVIDENCE: "The reply does not show whether your pension was paid.",
};

const nextStepByAction: Record<OutcomeEvaluation["recommendedAction"], string> = {
  APPEAL_CLOSURE: "Ask for another review (appeal).",
  COMPLETE_REQUIRED_ACTION: "Complete the step shown for your complaint.",
  WAIT_FOR_EVIDENCE: "Wait for proof that the payment was made.",
  NO_ACTION: "You do not need to do anything now.",
};

export const fallbackIntent: IntentResult = {
  problemType: "PENSION_PAYMENT_MISSING",
  desiredOutcome: {
    type: "PENSION_PAYMENT_RECEIVED",
    description: "Pension paid into my bank account",
  },
};

export function fallbackExplanation(
  evaluation: OutcomeEvaluation,
): ExplanationResult {
  return {
    status: evaluation.status,
    summary: summaryByStatus[evaluation.status],
    requestedOutcome: evaluation.requestedOutcome,
    governmentAction: evaluation.governmentActionSummary,
    missingEvidence:
      evaluation.missingEvidence.length > 0
        ? ["Proof that the pension reached your account."]
        : [],
    recommendedAction: nextStepByAction[evaluation.recommendedAction],
  };
}

export function fallbackAppeal(caseId: string): AppealDraft {
  return {
    subject: `Please review closed complaint ${caseId}`,
    body:
      "Please review this closed complaint. I asked for my pension to be paid into my bank account. The reply says my complaint was sent to another office, but it does not show that the pension was paid. Please check the complaint again and share proof when the payment is made.",
  };
}
