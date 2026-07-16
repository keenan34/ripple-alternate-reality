import { expect, test } from "@playwright/test";

test("explains the campaign rules and archives prototype stories", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: /Durant stayed/i })).toBeVisible();
  await page.getByRole("link", { name: "How to play" }).click();
  await expect(page.getByRole("heading", { name: "One decision at a time." })).toBeVisible();

  await page.getByRole("link", { name: "Campaign", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1, name: /Durant stayed/i })).toBeVisible();

  await page.goto("/stories");
  await expect(page.getByRole("heading", { level: 1, name: /3 campaigns/i })).toBeVisible();
  await expect(page.getByText("3 prototype stories archived")).toBeVisible();
});

test("autosaves and resumes an anonymous playthrough", async ({ page }) => {
  await page.goto("/story/kg-trade");
  await page.getByRole("button", { name: "Enter this timeline" }).first().click();
  await expect(page).toHaveURL(/\/play\/.*story=kg-trade/);

  await page.locator(".choice-list button").first().click();
  await page.getByRole("button", { name: "Next ripple" }).click();
  await page.reload();

  await expect(page.getByText(/Saved universe restored at Ripple 2/i)).toBeVisible();
  await expect(page.getByText("Ripple 2 of 4").first()).toBeVisible();
});

test("completes a timeline and downloads its result poster", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "Desktop poster flow is covered separately from mobile drawers.");
  await page.goto("/play/classic-poster-run?story=kd-stays&mode=classic");

  for (let round = 0; round < 4; round += 1) {
    await page.locator(".choice-list button").first().click();
    await page.locator(".verdict-panel .button").click();
    if (round < 3) {
      await expect(page.locator(".choice-list button").first()).toBeEnabled();
    }
  }

  await expect(page).toHaveURL(/\/timeline\/.*story=kd-stays.*choices=/);
  await expect(page.getByRole("heading", { level: 1, name: "Your universe" })).toBeVisible();
  await expect(page.locator(".clipping-list li")).toHaveCount(4);

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download poster" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("ripple-kd-stays-timeline.png");
});

test("opens timeline and ledger drawers on mobile", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.includes("mobile"), "Mobile-only drawer behavior.");
  await page.goto("/play/mobile-drawer-test?story=mj-portland");

  await page.getByRole("button", { name: "Timeline", exact: true }).click();
  await expect(page.locator(".mobile-drawer")).toBeVisible();
  await page.getByRole("button", { name: "Close panel" }).click();

  await page.getByRole("button", { name: "Ledger" }).click();
  await expect(page.locator(".mobile-drawer").getByText("Universe ledger")).toBeVisible();
});

test("supports keyboard access to the primary archive action", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "Desktop keyboard flow.");
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "RIPPLE home" })).toBeFocused();
});

test("unlocks a champion branch and renders deterministic consequences", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "Engine branch is covered once on desktop.");
  await page.goto("/play/classic-champion-run?story=kd-stays&mode=classic");

  await page.locator(".choice-list button").nth(1).click();
  await expect(page.getByText("Oklahoma City wins the title")).toBeVisible();
  await page.getByRole("button", { name: "Next ripple" }).click();

  await page.locator(".choice-list button").first().click();
  await page.getByRole("button", { name: "Next ripple" }).click();
  await expect(page.getByRole("heading", { name: "How does the champion spend its last flexible dollar?" })).toBeVisible();

  await page.locator(".choice-list button").first().click();
  await page.getByRole("button", { name: "Next ripple" }).click();
  await expect(page.locator(".choice-list button")).toHaveCount(4);

  await page.locator(".choice-list button").nth(3).click();
  await expect(page.getByText("Immediate consequences")).toBeVisible();
  await expect(page.getByText(/Elsewhere on the wire/)).toBeVisible();
  await page.screenshot({ path: "artifacts/phase-03/consequence-desktop.png", fullPage: true });
});

test("publishes the explicit early-ending epilogue", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "Early ending is covered once on desktop.");
  await page.goto("/play/early-ending-browser?story=kd-stays&mode=classic");
  await page.locator(".choice-list button").first().click();
  await page.getByRole("button", { name: "Next ripple" }).click();
  await page.locator(".choice-list button").nth(2).click();
  await page.getByRole("button", { name: "Read the final edition" }).click();

  await expect(page).toHaveURL(/\/timeline\/.*choices=/);
  await expect(page.getByRole("heading", { name: "The Sacrifice Timeline" })).toBeVisible();
  await expect(page.getByText(/keeps Kevin Durant by trading the player/i)).toBeVisible();
  await page.screenshot({ path: "artifacts/phase-03/early-ending-desktop.png", fullPage: true });
});
