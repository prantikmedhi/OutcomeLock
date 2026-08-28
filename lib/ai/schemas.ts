import { z } from "zod";

export const intentResultSchema = z.object({
  problemType: z.enum(["PENSION_PAYMENT_MISSING", "UNKNOWN"]),
  desiredOutcome: z.object({
    type: z.enum(["PENSION_PAYMENT_RECEIVED", "UNKNOWN"]),
    description: z.string().min(1),
  }),
});

export const explanationResultSchema = z.object({
  summary: z.string().min(1),
  requestedOutcome: z.string().min(1),
  governmentAction: z.string().min(1),
  missingEvidence: z.array(z.string()).default([]),
  recommendedAction: z.string().min(1),
});

export const appealDraftSchema = z.object({
  subject: z.string().min(1),
  body: z.string().min(1),
});

export type IntentResult = z.infer<typeof intentResultSchema>;
export type ExplanationResult = z.infer<typeof explanationResultSchema>;
export type AppealDraft = z.infer<typeof appealDraftSchema>;
