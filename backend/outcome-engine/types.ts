export type OutcomeStatus =
  | "RESOLVED"
  | "NOT_RESOLVED"
  | "ACTION_REQUIRED"
  | "INSUFFICIENT_EVIDENCE";

export type RequestedOutcomeType = "PENSION_PAYMENT_RECEIVED";

export type EvidenceType =
  | "PENSION_CREDIT"
  | "FORWARDING_NOTICE"
  | "BANK_VERIFICATION_REQUEST"
  | "GENERIC_PROCESSING_NOTICE";

export type GovernmentActionType =
  | "FORWARDED"
  | "PAYMENT_PROCESSED"
  | "BANK_VERIFICATION_REQUIRED"
  | "GENERIC_PROCESSED";

export type RecommendedAction =
  | "APPEAL_CLOSURE"
  | "COMPLETE_REQUIRED_ACTION"
  | "WAIT_FOR_EVIDENCE"
  | "NO_ACTION";

export type RequestedOutcome = {
  type: RequestedOutcomeType;
  description: string;
};

export type Evidence = {
  type: EvidenceType;
  label: string;
  date?: string;
  amount?: string;
};

export type GovernmentAction = {
  type: GovernmentActionType;
  label: string;
  response: string;
};

export type OutcomeCase = {
  id: string;
  requestedOutcome: RequestedOutcome;
  governmentActions: GovernmentAction[];
  evidence: Evidence[];
};

export type OutcomeEvaluation = {
  status: OutcomeStatus;
  reasonCode: string;
  requestedOutcome: string;
  governmentActionSummary: string;
  requiredEvidence: EvidenceType[];
  missingEvidence: EvidenceType[];
  recommendedAction: RecommendedAction;
};
