import { expect, test, type Page } from "@playwright/test";

async function chooseStrategy(page: Page, strategy: RegExp) {
  await page.getByRole("button", { name: "Decide", exact: true }).click();
  await page.getByRole("button", { name: strategy }).click();
  await expect(page.getByText("Commitment desk")).toBeVisible();
  await expect(page.locator(".chance-breakdown")).toContainText(/% base/);
  await page.getByRole("button", { name: /Commit strategy/ }).click();
  await expect(page.getByText("Timeline update")).toBeVisible();
}

async function advance(page: Page) {
  await page.getByRole("button", { name: "Advance the timeline" }).click();
}

async function openScoutingReport(page: Page, report: RegExp) {
  await page.getByRole("button", { name: "Decide", exact: true }).click();
  const reports = page.locator(".focus-decision-intel");
  await reports.locator("summary").click();
  await reports.getByRole("button", { name: report }).click();
}

test("plays the six-turn Durant operations campaign", async ({ page }, testInfo) => {
  await page.goto("/play/campaign-e2e-0?story=kd-stays");
  await expect(page.getByRole("heading", { name: /Durant said no to Golden State/ })).toBeVisible();
  await expect(page.getByText("Executive VP, Basketball Operations")).toBeVisible();
  await expect(page.locator(".starting-five article")).toHaveCount(5);
  await page.getByRole("button", { name: /Full depth chart/ }).click();
  await expect(page.locator(".bench-panel")).toContainText("Cameron Payne");
  await page.getByRole("button", { name: /Hide depth chart/ }).click();
  if (testInfo.project.name.includes("mobile")) await expect(page.getByText("Decision 1 of 6")).toBeVisible();
  else await expect(page.getByText("Decision 1 / 6")).toBeVisible();
  await page.locator("button.campaign-scorebug").click();
  await expect(page.locator(".objective-drawer")).toContainText("Stay in the title race");
  await expect(page.locator(".objective-drawer")).toContainText("67 / 75");
  await expect(page.locator(".objective-drawer")).toContainText("What do these numbers mean?");
  await page.locator(".objective-drawer-head button").click();
  await expect.poll(() => page.locator(".campaign-hero img").evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
  await page.screenshot({ path: `artifacts/phase-04-5/${testInfo.project.name}-campaign-briefing.png`, fullPage: true });

  await openScoutingReport(page, /Debrief the Hampton meeting/);
  await expect(page.getByText(/role clarity and effortless spacing/)).toBeVisible();
  await chooseStrategy(page, /Promise a new offense/);
  await expect(page.getByRole("heading", { name: /OKC hands Durant the keys|new offense sounds familiar/i })).toBeVisible();
  await expect(page.locator(".fallout-pulse")).toContainText("Campaign pulse");
  await advance(page);

  await openScoutingReport(page, /Pull the shooting guard's medical file/);
  await chooseStrategy(page, /Acquire a veteran shooting guard/);
  await advance(page);

  await expect(page.locator(".focus-news")).toBeVisible();
  await openScoutingReport(page, /Order an independent scan/);
  await chooseStrategy(page, /Set a hard minutes cap/);
  await advance(page);

  await openScoutingReport(page, /Open the agent backchannel/);
  await page.getByRole("button", { name: "Decide", exact: true }).click();
  await page.getByRole("button", { name: /Negotiate in one room/ }).click();
  await page.getByRole("button", { name: /Commit strategy/ }).click();
  await expect(page.getByRole("dialog", { name: /Durant asks for final say/ })).toBeVisible();
  await page.waitForTimeout(350);
  await page.screenshot({ path: `artifacts/phase-04-5/${testInfo.project.name}-counteroffer.png` });
  await page.getByRole("button", { name: /Grant medical authority/ }).click();
  await expect(page.getByText("Timeline update")).toBeVisible();
  await advance(page);

  await chooseStrategy(page, /Stand pat/);
  await advance(page);

  await page.getByRole("button", { name: "Decide", exact: true }).click();
  await page.locator(".focus-decision-intel summary").click();
  await expect(page.locator(".focus-decision-intel").getByRole("button", { name: /Meet Durant without staff/ })).toBeDisabled();
  await chooseStrategy(page, /Rule him out/);
  await page.getByRole("button", { name: "See your legacy" }).click();

  await expect(page.getByText("Leadership profile")).toBeVisible();
  await expect(page.getByRole("heading", { name: /The Dynasty Architect|The Player-First Steward|The Ruthless Operator|The Window Burned/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Our universe" })).toBeVisible();
  await expect(page.locator(".legacy-score")).toContainText("Legacy score");
  await expect(page.locator(".legacy-score")).toContainText("Championships");
  await expect(page.locator(".ending-banners")).toBeVisible();
  await expect(page.locator(".ending-decisions > div")).toHaveCount(6);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(100);
  await page.screenshot({ path: `artifacts/phase-04-5/${testInfo.project.name}-campaign-ending.png` });
  await page.locator(".ending-report").scrollIntoViewIfNeeded();
  await page.screenshot({ path: `artifacts/phase-04-5/${testInfo.project.name}-campaign-report.png` });
});

test("autosaves and restores a campaign decision", async ({ page }, testInfo) => {
  await page.goto("/play/campaign-restore?story=kd-stays");
  await chooseStrategy(page, /Put the supermax on the table/);
  await advance(page);
  await page.reload();
  await expect(page.getByText(/Operations room restored at February 22, 2017/)).toBeVisible();
  if (testInfo.project.name.includes("mobile")) await expect(page.getByText("Decision 2 of 6")).toBeVisible();
  else await expect(page.getByText("Decision 2 / 6")).toBeVisible();
});

test("plays the Pistons draft-night opening with a mystery-pick reveal", async ({ page }) => {
  await page.goto("/story/darko-decision");
  await expect(page.getByRole("heading", { name: /Darko never happened/ })).toBeVisible();
  await page.getByRole("button", { name: "Start the campaign" }).click();

  await expect(page.getByRole("heading", { name: /Cleveland just took LeBron/ })).toBeVisible();
  await expect(page.getByText("President of Basketball Operations")).toBeVisible();
  await expect(page.getByRole("button", { name: "Previous decision" })).toBeDisabled();
  await expect(page.getByRole("button", { name: "Next decision" })).toBeDisabled();
  await expect(page.locator(".objective-tracker").first()).toContainText("Raise a banner");

  await page.getByRole("button", { name: "Decide", exact: true }).click();
  const wadeStrategy = page.getByRole("button", { name: /Draft Dwyane Wade/ });
  await expect(wadeStrategy).toContainText("Scouts keep flying back to Milwaukee");
  await wadeStrategy.click();
  await expect(page.getByText("Commitment desk")).toBeVisible();
  await expect(page.getByText(/Scouting whisper/)).toBeVisible();
  await page.getByRole("button", { name: /Commit strategy/ }).click();
  await expect(page.getByText("Timeline update")).toBeVisible();
  await expect(page.getByRole("heading", { name: /Detroit drafts Dwyane Wade|the backcourt becomes a negotiation/ })).toBeVisible();
  const reveal = page.locator(".player-reveal-card");
  if (await reveal.isVisible()) {
    await expect(reveal).toContainText("Dwyane Wade");
    await expect.poll(() => page.locator("#new-arrival").evaluate((element) => {
      const commandBar = document.querySelector(".campaign-command-bar");
      return Math.round(element.getBoundingClientRect().top - (commandBar?.getBoundingClientRect().bottom ?? 0));
    })).toBeGreaterThanOrEqual(12);
    await page.getByRole("button", { name: "Advance the timeline" }).click();
    await expect(page.locator(".focus-news .news-player")).toContainText("Dwyane Wade joins the roster");
    await expect(page.locator(".focus-news")).toContainText("Miami drafts Darko Miličić fifth overall");
    await page.getByRole("button", { name: "Previous decision" }).click();
    await expect(page.locator(".decision-review")).toContainText("Draft Dwyane Wade");
    await expect(page.getByRole("button", { name: "Next decision" })).toBeEnabled();
    await page.getByRole("button", { name: "Next decision" }).click();
    await expect(page.getByRole("heading", { name: /Dwyane Wade has cracked Detroit's rotation/ })).toBeVisible();
    await expect(page.locator(".starting-five")).toContainText("Dwyane Wade");
    await page.getByRole("button", { name: /Full depth chart/ }).click();
    await expect(page.locator(".bench-panel")).toContainText("Richard Hamilton");
  }
});

test("opens Campaign 3 and branches the Rose timeline from the first response", async ({ page }) => {
  await page.goto("/story/rose-never-hurt");
  await expect(page.getByRole("heading", { name: /The Rose That Grew from Concrete/ })).toBeVisible();
  await page.getByRole("button", { name: "Start the campaign" }).click();

  await expect(page.getByRole("heading", { name: /Rose is still on the floor/ })).toBeVisible();
  await expect(page.getByText("Chicago Bulls", { exact: true })).toBeVisible();
  await expect(page.locator(".starting-five")).toContainText("Derrick Rose");
  await expect(page.locator(".command-decision-nav")).toContainText("Decision 1 / 6");

  await page.getByRole("button", { name: /Continue to decision/ }).click();
  const decisionStep = page.locator("#campaign-decision-step");
  await expect(decisionStep).toBeVisible();
  await expect.poll(() => decisionStep.evaluate((element) => {
    const commandBar = document.querySelector(".campaign-command-bar");
    return Math.round(element.getBoundingClientRect().top - (commandBar?.getBoundingClientRect().bottom ?? 0));
  })).toBeGreaterThanOrEqual(0);

  await page.getByRole("button", { name: /Empty the bench now/ }).click();
  await page.getByRole("button", { name: /Commit strategy/ }).click();
  await expect(page.getByText("Timeline update")).toBeVisible();
  await page.getByRole("button", { name: "Advance the timeline" }).click();

  await expect(page.getByRole("heading", { name: /rotation is fresh/i })).toBeVisible();
  await page.getByRole("button", { name: "Decide", exact: true }).click();
  await expect(page.getByRole("button", { name: /Turn the series into a ten-man fight/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Put every late possession in Rose's hands/ })).toHaveCount(0);
});
