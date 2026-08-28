import { expect, test } from "@playwright/test";

test("primary demo journey reaches fixed state", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /try an example case/i }).click();
  await page.getByRole("button", { name: /check my complaint/i }).click();
  await page.getByRole("button", { name: /yes, this is right/i }).click();
  await page
    .getByRole("button", { name: /check if my problem was fixed/i })
    .click();
  await expect(page.getByRole("heading", { name: /not fixed yet/i })).toBeVisible();
  await page.getByRole("button", { name: /ask for another review/i }).click();
  await page.getByRole("button", { name: /send my request/i }).click();
  await page.getByRole("button", { name: /see what happens next/i }).click();
  await page.getByRole("button", { name: /check the result/i }).click();
  await expect(page.getByRole("heading", { name: /^fixed$/i })).toBeVisible();
});
