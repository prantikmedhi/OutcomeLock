export type IntentResult = {
  problemType: "PENSION_PAYMENT_MISSING" | "UNKNOWN";
  desiredOutcome: {
    type: "PENSION_PAYMENT_RECEIVED" | "UNKNOWN";
    description: string;
  };
};

export type ExplanationResult = {
  status: "RESOLVED" | "NOT_RESOLVED" | "ACTION_REQUIRED" | "INSUFFICIENT_EVIDENCE";
  summary: string;
  requestedOutcome: string;
  governmentAction: string;
  missingEvidence: string[];
  recommendedAction: string;
};

export type AppealDraft = {
  subject: string;
  body: string;
};
