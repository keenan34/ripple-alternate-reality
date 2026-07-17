import { expect, test } from "@playwright/test";

test("opens a scrollable mobile depth-chart sheet without covering the game", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-chromium", "Mobile-only interaction");

  await page.goto("/play/mobile-depth-chart?story=rose-never-hurt");
  await page.getByRole("button", { name: "Full depth chart" }).click();

  const drawer = page.getByRole("dialog", { name: "Full depth chart" });
  await expect(drawer).toBeVisible();
  await expect(drawer).toContainText("Derrick Rose");
  await expect(drawer).toContainText("Joakim Noah");

  await drawer.locator(".mobile-depth-list").evaluate((element) => element.scrollTo({ top: element.scrollHeight }));
  await expect(drawer.getByText("Joakim Noah")).toBeVisible();

  await drawer.getByRole("button", { name: "Close depth chart" }).click();
  await expect(drawer).toBeHidden();
});
