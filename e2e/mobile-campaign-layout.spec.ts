import { expect, test } from "@playwright/test";

test.use({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });

test("keeps the mobile brief and all decision options discoverable", async ({ page }) => {
  await page.goto("/play/mobile-layout?story=rose-never-hurt");

  const starters = page.locator(".starting-five article");
  await expect(starters).toHaveCount(5);
  for (let index = 0; index < 5; index += 1) {
    const box = await starters.nth(index).boundingBox();
    expect(box?.x).toBeGreaterThanOrEqual(0);
    expect((box?.x ?? 0) + (box?.width ?? 0)).toBeLessThanOrEqual(390);
  }
  await expect(starters.first().locator("small")).toBeVisible();
  await expect(starters.first().locator("small")).toContainText(/Age \d+/);

  await page.getByRole("button", { name: "Decide", exact: true }).click();
  await page.waitForTimeout(500);

  const commandBar = page.locator(".campaign-command-bar");
  const compactTitle = commandBar.locator(".command-identity.showing-decision strong");
  await expect(compactTitle).toContainText("Rose is still on the floor");
  await expect(compactTitle).toBeVisible();

  const options = page.locator(".focus-strategy-list > button");
  await expect(options).toHaveCount(3);
  for (let index = 0; index < 3; index += 1) {
    const box = await options.nth(index).boundingBox();
    expect(box?.y).toBeGreaterThanOrEqual(0);
    expect((box?.y ?? 0) + (box?.height ?? 0)).toBeLessThanOrEqual(844);
  }
});
