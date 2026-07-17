import { expect, test } from "@playwright/test";

test("places the timeline update cleanly below the command bar", async ({ page }, testInfo) => {
  await page.goto(`/play/timeline-layout-${testInfo.project.name}?story=rose-never-hurt`);
  await page.getByRole("button", { name: "Decide", exact: true }).click();
  await page.getByRole("button", { name: /Empty the bench now/ }).click();
  await page.getByRole("button", { name: /Commit strategy/ }).click();
  await expect(page.getByText("Timeline update")).toBeVisible();
  await page.waitForTimeout(600);

  const hero = await page.locator("#campaign-story-header").boundingBox();
  const commandBar = await page.locator(".campaign-command-bar").boundingBox();
  expect(hero).not.toBeNull();
  expect(commandBar).not.toBeNull();
  const dividerOffset = (hero!.y + hero!.height) - (commandBar!.y + commandBar!.height);
  expect(dividerOffset).toBeLessThanOrEqual(16);
  expect(dividerOffset).toBeGreaterThanOrEqual(-64);

  if (testInfo.project.name.includes("mobile")) {
    const mobileAdvance = page.locator(".fallout-advance-mobile");
    await expect(mobileAdvance).toBeVisible();
    const updateBox = await page.locator(".fallout-broadcast").boundingBox();
    const advanceBox = await mobileAdvance.boundingBox();
    expect(advanceBox!.y - (updateBox!.y + updateBox!.height)).toBeLessThanOrEqual(16);
  }
});

test("uses the same landing point for a new arrival", async ({ page }, testInfo) => {
  await page.goto(`/play/new-arrival-layout-${testInfo.project.name}?story=kd-stays`);
  await page.getByRole("button", { name: "Decide", exact: true }).click();
  await page.getByRole("button", { name: /Promise a new offense/ }).click();
  await page.getByRole("button", { name: /Commit strategy/ }).click();
  await page.getByRole("button", { name: /Advance the timeline/ }).click();
  await page.getByRole("button", { name: "Decide", exact: true }).click();
  await page.getByRole("button", { name: /Acquire a veteran shooting guard/ }).click();
  await page.getByRole("button", { name: /Commit strategy/ }).click();
  await expect(page.getByText("Timeline update")).toBeVisible();
  await expect(page.getByText("Your new arrival")).toBeVisible();
  await page.waitForTimeout(600);

  const hero = await page.locator("#campaign-story-header").boundingBox();
  const commandBar = await page.locator(".campaign-command-bar").boundingBox();
  expect(hero).not.toBeNull();
  expect(commandBar).not.toBeNull();
  const dividerOffset = (hero!.y + hero!.height) - (commandBar!.y + commandBar!.height);
  expect(dividerOffset).toBeLessThanOrEqual(testInfo.project.name.includes("mobile") ? 16 : 0);
  expect(dividerOffset).toBeGreaterThanOrEqual(-64);
});
