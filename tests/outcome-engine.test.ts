import { describe, expect, it } from "vitest";
import {
  actionRequiredScenario,
  insufficientEvidenceScenario,
  primaryScenario,
  resolvedScenario,
} from "@/data/scenarios";
import { evaluateOutcome } from "@/lib/outcome-engine/evaluate";

describe("evaluateOutcome", () => {
  it("returns NOT_RESOLVED when the case is only forwarded", () => {
    expect(evaluateOutcome(primaryScenario.case).status).toBe("NOT_RESOLVED");
  });

  it("returns RESOLVED when pension credit evidence is present", () => {
    expect(evaluateOutcome(resolvedScenario.case).status).toBe("RESOLVED");
  });

  it("returns ACTION_REQUIRED when bank verification is required", () => {
    expect(evaluateOutcome(actionRequiredScenario.case).status).toBe(
      "ACTION_REQUIRED",
    );
  });

  it("returns INSUFFICIENT_EVIDENCE for vague processing without credit evidence", () => {
    expect(evaluateOutcome(insufficientEvidenceScenario.case).status).toBe(
      "INSUFFICIENT_EVIDENCE",
    );
  });
});
