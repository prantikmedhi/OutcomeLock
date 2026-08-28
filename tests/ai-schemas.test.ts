import { describe, expect, it } from "vitest";
import {
  actionRequiredScenario,
  insufficientEvidenceScenario,
  primaryScenario,
  resolvedScenario,
} from "@/data/scenarios";
import { fallbackAppeal, fallbackExplanation } from "@/lib/ai/fallbacks";
import {
  appealDraftSchema,
  explanationResultSchema,
  intentResultSchema,
} from "@/lib/ai/schemas";
import { evaluateOutcome } from "@/lib/outcome-engine/evaluate";

describe("AI schemas", () => {
  it("accepts valid intent structured output", () => {
    expect(
      intentResultSchema.safeParse({
        problemType: "PENSION_PAYMENT_MISSING",
        desiredOutcome: {
          type: "PENSION_PAYMENT_RECEIVED",
          description: "Pension credited to my bank account",
        },
      }).success,
    ).toBe(true);
  });

  it("rejects malformed intent output", () => {
    expect(intentResultSchema.safeParse({ problemType: "MAYBE" }).success).toBe(
      false,
    );
  });

  it("accepts explanation structured output", () => {
    expect(
      explanationResultSchema.safeParse({
        summary: "Missing evidence.",
        requestedOutcome: "Pension credited.",
        governmentAction: "Forwarded.",
        missingEvidence: ["Pension credit."],
        recommendedAction: "Appeal the closure.",
      }).success,
    ).toBe(true);
  });

  it("accepts appeal structured output", () => {
    expect(
      appealDraftSchema.safeParse({
        subject: "Appeal",
        body: "Please review this closure.",
      }).success,
    ).toBe(true);
  });
});

describe("plain-language AI fallbacks", () => {
  it("explains a missing payment with familiar words", () => {
    const explanation = fallbackExplanation(
      evaluateOutcome(primaryScenario.case),
    );

    expect(explanation.summary).toBe(
      "We cannot see proof that your pension reached your account.",
    );
    expect(explanation.missingEvidence).toEqual([
      "Proof that the pension reached your account.",
    ]);
    expect(explanation.recommendedAction).toBe(
      "Ask for another review (appeal).",
    );
  });

  it("uses a simple review request when AI is unavailable", () => {
    const appeal = fallbackAppeal(primaryScenario.grievance.id);

    expect(appeal.subject).toBe(
      `Please review closed complaint ${primaryScenario.grievance.id}`,
    );
    expect(appeal.body).toContain("Please check the complaint again");
  });

  it("uses simple messages for every result", () => {
    expect(
      fallbackExplanation(evaluateOutcome(resolvedScenario.case)).summary,
    ).toBe("We found proof that your pension reached your account.");
    expect(
      fallbackExplanation(evaluateOutcome(actionRequiredScenario.case)).summary,
    ).toBe("You need to complete one step before the payment can be made.");
    expect(
      fallbackExplanation(evaluateOutcome(insufficientEvidenceScenario.case))
        .summary,
    ).toBe("The reply does not show whether your pension was paid.");
  });
});
