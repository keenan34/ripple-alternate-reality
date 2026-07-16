import { expect, test } from "@playwright/test";

test.describe("Creator Studio", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/create");
    await page.evaluate(() => localStorage.removeItem("ripple:creator:drafts:v1"));
    await page.reload();
  });

  test("creates, recovers, previews, publishes, and versions a story", async ({ page }, testInfo) => {
    await page.getByRole("button", { name: "New story" }).click();
    await expect(page).toHaveURL(/\/create\/draft-/);
    await expect(page.getByRole("heading", { name: "Story brief" })).toBeVisible();

    const title = page.getByLabel("Title");
    await title.fill("The Night Seattle Stayed");
    await page.getByLabel("Premise").fill("A final vote keeps a beloved basketball team in Seattle and redirects two conferences.");
    await expect.poll(() => page.evaluate(() => localStorage.getItem("ripple:creator:drafts:v1"))).toContain("The Night Seattle Stayed");

    await page.reload();
    await expect(page.getByText("Recovered your latest local autosave.")).toBeVisible();
    await expect(page.getByLabel("Title")).toHaveValue("The Night Seattle Stayed");
    await page.screenshot({ path: `artifacts/phase-04/${testInfo.project.name}-setup.png`, fullPage: true });

    await page.getByRole("button", { name: /Story map/ }).click();
    await expect(page.getByTestId("story-graph")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Decision node" })).toBeVisible();
    await page.screenshot({ path: `artifacts/phase-04/${testInfo.project.name}-story-map.png` });
    await page.getByRole("button", { name: /Change course/ }).click();
    await expect(page.getByRole("heading", { name: "Choice" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Ending" })).toBeVisible();

    await page.getByRole("button", { name: "Preview" }).click();
    await expect(page.getByRole("dialog", { name: "Story preview" })).toBeVisible();
    await page.getByRole("button", { name: /Change course and accept/ }).click();
    await expect(page.getByRole("dialog").getByRole("heading", { name: "THE FUTURE BREAKS FROM THE PAST" })).toBeVisible();
    await page.getByRole("button", { name: /Continue/ }).click();
    await expect(page.getByRole("heading", { name: "A Different Future" })).toBeVisible();
    await page.getByRole("button", { name: "Close preview" }).click();

    await page.getByRole("button", { name: /Review & publish/ }).click();
    await expect(page.getByText("All checks passed")).toBeVisible();
    await page.screenshot({ path: `artifacts/phase-04/${testInfo.project.name}-publish.png`, fullPage: true });
    await page.getByRole("button", { name: "Send to review" }).click();
    await expect(page.getByText(/v1 · in review/)).toBeVisible();
    await page.getByRole("button", { name: /Publish version 1/ }).click();
    await expect(page.getByText("This edition is live.")).toBeVisible();
    await expect(page.getByText(/immutable/)).toBeVisible();

    await page.getByRole("button", { name: /Create version 2/ }).click();
    await expect(page).toHaveURL(/\/create\/draft-/);
    await expect(page.getByText("v2 · draft")).toBeVisible();
    await expect(page.getByLabel("Title")).toBeEditable();
  });

  test("creates an attributed remix from the archive", async ({ page }) => {
    const firstRemix = page.getByRole("button", { name: "Remix" }).first();
    await firstRemix.click();
    await expect(page).toHaveURL(/\/create\/draft-/);
    await page.getByRole("button", { name: /Review & publish/ }).click();
    await expect(page.getByText("Attribution attached")).toBeVisible();
  });
});
