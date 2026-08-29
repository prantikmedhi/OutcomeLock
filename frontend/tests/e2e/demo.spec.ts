import { expect, test } from "@playwright/test";

test("validates custom input", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Write a pension example" }).click();
  await page.getByLabel("Your complaint").fill("My ration card is delayed.");
  await page.getByRole("button", { name: "Check my complaint" }).click();
  await expect(page.locator("#problem-error")).toContainText("missing pension payment");
  await page.route("**/api/interpret", (route) => route.fulfill({
    json: {
      problemType: "PENSION_PAYMENT_MISSING",
      desiredOutcome: {
        type: "PENSION_PAYMENT_RECEIVED",
        description: "Pension paid into my bank account",
      },
    },
  }));
  await page.getByLabel("Your complaint").fill("My pension payment is missing.");
  await page.getByRole("button", { name: "Check my complaint" }).click();
  await expect(page.getByRole("heading", { name: "Let's check the right thing." })).toBeVisible();
});

test("completes the synthetic pension journey through backend APIs", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator("body")).not.toContainText(/hackathon|prototype/i);
  await expect(page.locator(".disclosure-note-primary:visible, .disclosure-note-mobile:visible")).toContainText("Independent citizen tool");
  await page.getByRole("button", { name: "Try an example case" }).click();
  const interpretResponse = page.waitForResponse((response) => response.url().includes("/api/interpret"));
  await page.getByRole("button", { name: "Check my complaint" }).click();
  expect((await interpretResponse).ok()).toBe(true);
  await page.getByRole("button", { name: "Yes, that's what I need" }).click();
  await expect(page.locator(".case-heading").getByText("GRV-48291")).toBeVisible();
  const explainResponse = page.waitForResponse((response) => response.url().includes("/api/explain"));
  await page.getByRole("button", { name: "Check if this is actually resolved" }).click();
  expect((await explainResponse).ok()).toBe(true);
  await expect(page.getByRole("heading", { name: "Not resolved" })).toBeVisible();
  const appealResponse = page.waitForResponse((response) => response.url().includes("/api/appeal"));
  await page.getByRole("button", { name: "Appeal the closure" }).click();
  expect((await appealResponse).ok()).toBe(true);
  await expect(page.getByLabel("Appeal text")).not.toHaveValue(/INR 8,450|19 August 2026/);
  await page.getByLabel("Appeal text").fill("Please review this closure and confirm the pension credit.");
  await page.getByRole("button", { name: "Submit appeal" }).click();
  await expect(page.getByText("It was not sent to any department.", { exact: false })).toBeVisible();
  await page.getByRole("button", { name: "Track my case" }).click();
  await page.getByRole("button", { name: "Confirm payment" }).click();
  await expect(page.getByRole("heading", { name: "Resolved" })).toBeVisible();
  await expect(page.getByText("INR 8,450")).toBeVisible();
});
