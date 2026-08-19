import { expect, test } from "@playwright/test";

test("copies the six numbered campaign decisions as a PNG", async ({ page, context }) => {
  const decisions = [
    ["draft-night", 2003, "draft-wade", "Draft Dwyane Wade", "Detroit drafts Dwyane Wade second overall"],
    ["sheed-deadline", 2004, "small-deal", "Add quiet depth instead", "George Lynch joins the rotation"],
    ["lakers-finals", 2004, "wall-the-paint", "Single Shaq, wall off Kobe", "Detroit closes the Finals"],
    ["spurs-finals", 2005, "duncan-straight-up", "Guard Duncan straight up", "The anchor owns Game 7"],
    ["brown-standoff", 2005, "hire-flip", "Move on to the offense-first coach", "Detroit changes the voice"],
    ["ben-free-agency", 2006, "match-chicago", "Beat Chicago's offer", "The anchor stays in Detroit"],
  ].map(([turnId, year, strategyId, strategyTitle, headline]) => ({
    turnId, year, strategyId, strategyTitle, headline, success: true, chance: 82, roll: 31, changes: [],
  }));

  await page.addInitScript(({ decisions }) => {
    localStorage.setItem("ripple:campaign:export-e2e", JSON.stringify({
      schemaVersion: 1,
      id: "export-e2e",
      campaignId: "pistons-war-room",
      seed: 1,
      turnIndex: 5,
      stage: "completed",
      resources: { influence: 2, "cap-flexibility": 45, "team-cohesion": 82, "competitive-power": 88, intel: 1 },
      relationships: { "brown-trust": 60, "wallace-trust": 80, "davidson-trust": 75 },
      flags: { championships: 2, "rookie-star": true, "sheed-in-detroit": false, "brown-stays": false },
      investigatedIds: [], pendingStrategyId: null, pendingResolution: null, currentOutcome: null,
      briefingNews: [], decisions, scheduled: [], banners: [
        { id: "title-2004", label: "2004 NBA CHAMPIONS", turnId: "lakers-finals", year: 2004 },
        { id: "title-2005", label: "2005 NBA CHAMPIONS", turnId: "spurs-finals", year: 2005 },
      ], acquiredPlayers: [], updatedAt: new Date().toISOString(),
    }));
  }, { decisions });

  await page.goto("/play/export-e2e?story=darko-decision");
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.getByRole("button", { name: "Skip to the record" }).click();
  await expect(page.getByRole("button", { name: "Export result as PNG" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Copy campaign summary" })).toHaveCount(0);
  const copyPng = page.getByRole("button", { name: "Copy result as PNG" });
  await expect(copyPng).toHaveCSS("background-color", "rgb(241, 130, 62)");
  await copyPng.click();
  await expect(page.getByRole("button", { name: "PNG copied" })).toBeVisible();
});
