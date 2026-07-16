import { expect, test } from "@playwright/test";

test.describe("Creator Studio launch gate", () => {
  test("removes the Studio entry point from public navigation", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: "Studio" })).toHaveCount(0);
  });

  test("returns not found for direct Studio URLs", async ({ page }) => {
    const dashboard = await page.goto("/create");
    expect(dashboard?.status()).toBe(404);

    const draft = await page.goto("/create/example-draft");
    expect(draft?.status()).toBe(404);
  });
});
