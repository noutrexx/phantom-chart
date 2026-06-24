import { expect, test } from "@playwright/test";

test.describe("Phantom Eats core flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.clear());
  });

  test("lets a user build and place a phantom order", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: /crave it/i })).toBeVisible();
    await page.getByRole("button", { name: /get started/i }).click();

    await expect(page.getByText("Tonight picks")).toBeVisible();
    await page.getByRole("button", { name: /open place/i }).click();

    await expect(page.getByRole("tab", { name: /menu/i })).toBeVisible();
    await page.getByRole("button", { name: /add/i }).first().click();

    await expect(page.getByRole("dialog")).toBeVisible();
    await page.getByRole("button", { name: /add to cart/i }).click();

    await expect(page.getByRole("button", { name: /view cart/i })).toBeVisible();
    await page.getByRole("button", { name: /view cart/i }).click();

    await expect(page.getByRole("heading", { name: /checkout/i })).toBeVisible();
    await expect(page.getByText("Payment method")).toBeVisible();
    await page.getByLabel(/card number/i).fill("4242 4242 4242 4242");
    await page.getByLabel(/expiry/i).fill("1230");
    await page.getByLabel(/cvc/i).fill("123");
    await page.getByLabel(/zip/i).fill("10001");
    await page.getByRole("button", { name: /authorize phantom payment/i }).click();

    await expect(page.getByText("Live tracking")).toBeVisible();
    await page.getByRole("button", { name: /minimize tracking/i }).click();

    await page.getByRole("button", { name: /orders/i }).click();
    await expect(page.getByRole("heading", { name: /your orders/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /track order/i })).toBeVisible();
  });

  test("supports keyboard dismissal for the item sheet", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /get started/i }).click();
    await page.getByRole("button", { name: /open place/i }).click();
    await page.getByRole("button", { name: /add/i }).first().click();

    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toBeHidden();
  });
});
