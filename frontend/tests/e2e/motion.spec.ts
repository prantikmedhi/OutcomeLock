import { expect, test } from "@playwright/test";

const intentResult = {
  problemType: "PENSION_PAYMENT_MISSING",
  desiredOutcome: {
    type: "PENSION_PAYMENT_RECEIVED",
    description: "Pension paid into my bank account",
  },
};

const explanationResult = {
  status: "NOT_RESOLVED",
  summary: "We cannot see proof that your pension reached your account.",
  requestedOutcome: "Pension paid into my bank account",
  governmentAction: "Complaint sent to another office",
  missingEvidence: ["Proof that the pension reached your account."],
  recommendedAction: "Ask for another review (appeal).",
};

test("moves focus with stage transitions without stealing initial focus", async ({ page }) => {
  await page.route("**/api/interpret", (route) => route.fulfill({ json: intentResult }));
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Did you get what you asked for?" })).not.toBeFocused();
  await page.getByRole("button", { name: "Try an example case" }).click();
  await expect(page.getByRole("heading", { name: "What happened?" })).toBeFocused();
  await expect(page.locator("[data-stage-heading]")).toHaveCount(1);

  await page.getByRole("button", { name: "Back" }).click();
  await expect(page.getByRole("heading", { name: "Did you get what you asked for?" })).toBeFocused();
  await expect(page.locator("[data-stage-heading]")).toHaveCount(1);
});

test("uses static motion and WebGL modes when reduced motion is requested", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.route("**/api/interpret", (route) => route.fulfill({ json: intentResult }));
  await page.route("**/api/explain", (route) => route.fulfill({ json: explanationResult }));
  await page.goto("/");

  const canvas = page.locator(".thesis-ambient-canvas");
  await expect(canvas).toHaveAttribute("aria-hidden", "true");
  await expect(canvas).toHaveCSS("pointer-events", "none");
  await expect(canvas).toHaveAttribute("data-webgl-state", /static|unavailable/);

  const dimensions = await canvas.evaluate((element: HTMLCanvasElement) => {
    const rect = element.getBoundingClientRect();
    return {
      cssHeight: rect.height,
      cssWidth: rect.width,
      height: element.height,
      width: element.width,
    };
  });
  expect(dimensions.width).toBeLessThanOrEqual(Math.ceil(dimensions.cssWidth * 1.5));
  expect(dimensions.height).toBeLessThanOrEqual(Math.ceil(dimensions.cssHeight * 1.5));

  await page.getByRole("button", { name: "Try an example case" }).click();
  await expect(canvas).toHaveCount(0);
  await expect(page.locator(".stage-motion-frame")).toHaveCSS("transform", "none");
  await page.getByRole("button", { name: "Check my complaint" }).click();
  await page.getByRole("button", { name: "Yes, that's what I need" }).click();
  await page.getByRole("button", { name: "Check if this is actually resolved" }).click();

  await expect(page.getByRole("heading", { name: "Not resolved" })).toBeVisible();
  const verdictParts = page.locator("[data-verdict-part]");
  await expect(verdictParts.first()).toHaveCSS("transform", "none");
  await expect(verdictParts.first()).toHaveCSS("opacity", "1");
});

test("recovers ambient canvas after real WebGL context loss", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const canvas = page.locator(".thesis-ambient-canvas");
  await expect(canvas).toHaveAttribute("data-webgl-state", /static|unavailable/);
  const canLoseContext = await canvas.evaluate((element: HTMLCanvasElement) =>
    Boolean(element.getContext("webgl")?.getExtension("WEBGL_lose_context")),
  );
  test.skip(!canLoseContext, "WebGL context-loss extension unavailable in this browser");

  await canvas.evaluate((element: HTMLCanvasElement) => {
    const extension = element
      .getContext("webgl")
      ?.getExtension("WEBGL_lose_context");
    extension?.loseContext();
    setTimeout(() => extension?.restoreContext(), 100);
  });
  await expect(canvas).toHaveAttribute("data-webgl-state", "lost");
  await expect(canvas).toHaveAttribute("data-webgl-state", "static", {
    timeout: 10_000,
  });
});
