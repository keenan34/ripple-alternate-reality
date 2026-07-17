import { describe, expect, it } from "vitest";

import { campaigns } from "@/content/campaigns";
import { durantCampaign } from "@/content/durant-campaign";
import { pistonsCampaign } from "@/content/pistons-campaign";
import { roseCampaign } from "@/content/rose-campaign";
import {
  advanceCampaign,
  commitStrategy,
  createCampaignState,
  getCampaignEnding,
  getCampaignGrade,
  getCampaignMaxScore,
  getCampaignScore,
  getCampaignTurnCopy,
  getChanceBreakdown,
  getObjectiveProgress,
  getStrategyChance,
  investigate,
  ownerTrustCollapsed,
  resolveCounteroffer,
  restoreCampaignState,
  strategyRequirementsMet,
  type CampaignState,
} from "./engine";

describe("campaign engine", () => {
  it("grades against the campaign's achievable maximum", () => {
    expect(getCampaignGrade(950, 1000)).toBe("S+");
    expect(getCampaignGrade(949, 1000)).toBe("S");
    expect(getCampaignGrade(899, 1000)).toBe("S-");
    expect(getCampaignGrade(859, 1000)).toBe("A+");
    expect(getCampaignGrade(809, 1000)).toBe("A");
    expect(getCampaignGrade(759, 1000)).toBe("A-");
    expect(getCampaignGrade(699, 1000)).toBe("B+");
    expect(getCampaignGrade(639, 1000)).toBe("B");
    expect(getCampaignGrade(579, 1000)).toBe("B-");
    expect(getCampaignGrade(519, 1000)).toBe("C+");
    expect(getCampaignGrade(459, 1000)).toBe("C");
    expect(getCampaignGrade(399, 1000)).toBe("C-");
    expect(getCampaignGrade(339, 1000)).toBe("D+");
    expect(getCampaignGrade(259, 1000)).toBe("D");
    expect(getCampaignGrade(179, 1000)).toBe("D-");
  });

  it("computes a campaign maximum that puts S+ out of reach of ordinary runs", () => {
    for (const campaign of campaigns) {
      const max = getCampaignMaxScore(campaign);
      const primaries = campaign.objectives.filter((item) => item.primary).length;
      const secondaries = campaign.objectives.length - primaries;
      // Every campaign currently offers exactly two winnable banners.
      expect(max).toBe(primaries * 250 + secondaries * 100 + 2 * 300 + campaign.turns.length * 50 + 200);
      // A strong-but-imperfect run (one banner short, one secondary missed,
      // one decision lost, 75 trust and health) must not reach the S tier.
      const strong = primaries * 250 + (secondaries - 1) * 100 + 300 + (campaign.turns.length - 1) * 50 + 150;
      expect(getCampaignGrade(strong, max)).toMatch(/^[AB]/);
    }
  });
  it("resolves the same strategy deterministically", () => {
    const a = commitStrategy(createCampaignState(durantCampaign, "same-seed"), durantCampaign, "basketball-first", 1);
    const b = commitStrategy(createCampaignState(durantCampaign, "same-seed"), durantCampaign, "basketball-first", 1);
    expect(a.decisions[0].roll).toBe(b.decisions[0].roll);
    expect(a.decisions[0].headline).toBe(b.decisions[0].headline);
  });

  it("spends intel and improves a matching strategy forecast", () => {
    const state = createCampaignState(durantCampaign, "intel-run");
    const strategy = durantCampaign.turns[0].strategies[0];
    const before = getStrategyChance(state, durantCampaign, strategy);
    const afterState = investigate(state, durantCampaign, "hampton-debrief");
    expect(afterState.resources.intel).toBe(3);
    expect(getStrategyChance(afterState, durantCampaign, strategy)).toBeGreaterThan(before);
  });

  it("spends committed influence in addition to strategy costs", () => {
    const state = createCampaignState(durantCampaign, "influence-run");
    const next = commitStrategy(state, durantCampaign, "basketball-first", 2);
    expect(next.resources.influence).toBe(1);
  });

  it("surfaces scheduled consequences on their future turn", () => {
    let state = createCampaignState(durantCampaign, "delayed-run");
    state = commitStrategy(state, durantCampaign, "basketball-first", 2);
    state = advanceCampaign(state, durantCampaign);
    state = commitStrategy(state, durantCampaign, "switch-defense", 0);
    state = advanceCampaign(state, durantCampaign);
    expect(state.turnIndex).toBe(2);
    expect(state.briefingNews.some((item) => item.headline.includes("shared-offense"))).toBe(true);
  });

  it("supports negotiation counteroffers", () => {
    let state = createCampaignState(durantCampaign, "negotiation-run");
    state.turnIndex = 3;
    state = investigate(state, durantCampaign, "agent-channel");
    state = commitStrategy(state, durantCampaign, "joint-meeting", 2);
    if (state.stage === "negotiation") {
      state = resolveCounteroffer(state, durantCampaign, "accept");
      expect(state.stage).toBe("fallout");
      expect(state.decisions.at(-1)?.negotiationChoice).toBe("accept");
    } else {
      expect(state.stage).toBe("fallout");
    }
  });

  it("restores only the matching campaign session", () => {
    const state = createCampaignState(durantCampaign, "restore-me");
    expect(restoreCampaignState(JSON.stringify(state), durantCampaign, "restore-me")?.id).toBe("restore-me");
    expect(restoreCampaignState(JSON.stringify(state), durantCampaign, "different")).toBeNull();
  });

  it("backfills banners and acquisitions on saves written before they existed", () => {
    const state = createCampaignState(durantCampaign, "legacy-save");
    const legacy = JSON.parse(JSON.stringify(state)) as Record<string, unknown>;
    delete legacy.banners;
    delete legacy.acquiredPlayers;
    const restored = restoreCampaignState(JSON.stringify(legacy), durantCampaign, "legacy-save");
    expect(restored?.banners).toEqual([]);
    expect(restored?.acquiredPlayers).toEqual([]);
  });

  it("repairs a stale Game 7 success headline when the recorded decision was a setback", () => {
    let lost: CampaignState | undefined;
    for (let attempt = 0; attempt < 200; attempt += 1) {
      const state = { ...createCampaignState(pistonsCampaign, `sheed-loss-${attempt}`), turnIndex: 3 };
      state.flags = { ...state.flags, "sheed-in-detroit": true };
      const next = commitStrategy(state, pistonsCampaign, "unleash-sheed", 0);
      if (next.decisions.at(-1)?.success === false) { lost = next; break; }
    }
    expect(lost).toBeDefined();
    const stale = structuredClone(lost!);
    stale.currentOutcome = {
      ...stale.currentOutcome!,
      headline: pistonsCampaign.turns[3].strategies.find((strategy) => strategy.id === "unleash-sheed")!.success.headline,
    };
    stale.decisions.at(-1)!.headline = stale.currentOutcome.headline;

    const restored = restoreCampaignState(JSON.stringify(stale), pistonsCampaign, stale.id);
    expect(restored?.currentOutcome?.success).toBe(false);
    expect(restored?.currentOutcome?.headline).toContain("San Antonio switches");
    expect(restored?.decisions.at(-1)?.headline).toContain("San Antonio switches");
    expect(restored?.currentOutcome?.headline).not.toContain("repeat as champions");
  });

  it("classifies a balanced, healthy contender as a dynasty architect", () => {
    const state = createCampaignState(durantCampaign, "ending-run");
    state.resources["competitive-power"] = 90;
    state.relationships["durant-trust"] = 80;
    state.relationships["westbrook-trust"] = 70;
    expect(getCampaignEnding(state, durantCampaign).id).toBe("dynasty-architect");
  });

  it("falls back to the final ending when nothing matches", () => {
    const state = createCampaignState(durantCampaign, "fallback-run");
    state.resources["competitive-power"] = 10;
    state.relationships["durant-trust"] = 10;
    state.relationships["westbrook-trust"] = 10;
    state.flags["durant-healthy"] = false;
    expect(getCampaignEnding(state, durantCampaign).id).toBe("window-burned");
  });

  function commitWithResult(campaign: typeof durantCampaign, turnIndex: number, strategyId: string, wantSuccess: boolean): CampaignState {
    for (let attempt = 0; attempt < 200; attempt += 1) {
      const state = { ...createCampaignState(campaign, `seeded-${strategyId}-${wantSuccess}-${attempt}`), turnIndex };
      const next = commitStrategy(state, campaign, strategyId, 0);
      if (next.decisions.at(-1)?.success === wantSuccess) return next;
    }
    throw new Error(`No seed produced success=${wantSuccess} for ${strategyId}`);
  }

  it("awards a banner once, mirrors it into the championships flag, and reports it as a change", () => {
    const state = commitWithResult(durantCampaign, 5, "full-clearance", true);
    expect(state.banners).toHaveLength(1);
    expect(state.banners[0].label).toBe("2019 NBA CHAMPIONS");
    expect(state.flags.championships).toBe(1);
    expect(state.currentOutcome?.changes.some((change) => change.scope === "banner")).toBe(true);

    const failed = commitWithResult(durantCampaign, 5, "full-clearance", false);
    expect(failed.banners).toHaveLength(0);
    expect(failed.flags.championships).toBe(0);
  });

  it("shows the 2017 Thunder banner on the winning timeline update", () => {
    const won = commitWithResult(durantCampaign, 2, "minutes-cap", true);
    expect(won.banners.map((item) => item.label)).toEqual(["2017 NBA CHAMPIONS"]);
    expect(won.currentOutcome?.changes.some((change) => change.scope === "banner")).toBe(true);
    const next = advanceCampaign(won, durantCampaign);
    expect(next.banners.map((item) => item.label)).toEqual(["2017 NBA CHAMPIONS"]);
    expect(next.flags.championships).toBe(1);
    expect(next.briefingNews.some((news) => news.headline.includes("2017 NBA championship"))).toBe(false);

    const lost = commitWithResult(durantCampaign, 2, "minutes-cap", false);
    const after = advanceCampaign(lost, durantCampaign);
    expect(after.banners).toHaveLength(0);
  });

  it("reveals a completed acquisition even when its basketball result disappoints", () => {
    const won = commitWithResult(durantCampaign, 1, "switch-defense", true);
    expect(won.acquiredPlayers.map((player) => player.name)).toEqual(["P.J. Tucker"]);
    expect(won.currentOutcome?.acquiredPlayer?.name).toBe("P.J. Tucker");

    const lost = commitWithResult(durantCampaign, 1, "switch-defense", false);
    expect(lost.acquiredPlayers.map((player) => player.name)).toEqual(["P.J. Tucker"]);
    expect(lost.currentOutcome?.acquiredPlayer?.name).toBe("P.J. Tucker");
    expect(lost.currentOutcome?.headline).toContain("P.J. Tucker");
  });

  it("does not reveal a player when a proposed trade is rejected", () => {
    const rejected = commitWithResult(durantCampaign, 4, "protected-first", false);
    expect(rejected.acquiredPlayers).toHaveLength(0);
    expect(rejected.currentOutcome?.acquiredPlayer).toBeUndefined();
  });

  it("does not add Rodney Hood when the protected-pick counteroffer is declined", () => {
    let negotiating: CampaignState | undefined;
    for (let attempt = 0; attempt < 200; attempt += 1) {
      const state = { ...createCampaignState(durantCampaign, `hood-decline-${attempt}`), turnIndex: 4 };
      const next = commitStrategy(state, durantCampaign, "protected-first", 0);
      if (next.stage === "negotiation") { negotiating = next; break; }
    }
    expect(negotiating).toBeDefined();
    const declined = resolveCounteroffer(negotiating!, durantCampaign, "decline");
    expect(declined.currentOutcome?.acquiredPlayer).toBeUndefined();
    expect(declined.acquiredPlayers).toHaveLength(0);
  });

  it("names Detroit's veteran return whether the pick trade haul lands or disappoints", () => {
    for (const success of [true, false]) {
      const traded = commitWithResult(pistonsCampaign, 0, "trade-pick", success);
      expect(traded.currentOutcome?.acquiredPlayer?.name).toBe("Shane Battier");
      expect(traded.currentOutcome?.headline).toContain("Shane Battier");
    }
  });

  it("branches Rose's Miami options from the Philadelphia workload response", () => {
    const protectedRose = commitWithResult(roseCampaign, 0, "empty-bench", true);
    const protectedBrief = advanceCampaign(protectedRose, roseCampaign);
    const protectedChoices = roseCampaign.turns[1].strategies.filter((strategy) => strategyRequirementsMet(protectedBrief, strategy)).map((strategy) => strategy.id);
    expect(getCampaignTurnCopy(protectedBrief, roseCampaign.turns[1]).headline).toContain("rotation is fresh");
    expect(protectedChoices).toContain("ten-man-wave");
    expect(protectedChoices).not.toContain("rose-gauntlet");

    const rodeRose = commitWithResult(roseCampaign, 0, "finish-possession", true);
    const rodeBrief = advanceCampaign(rodeRose, roseCampaign);
    const rodeChoices = roseCampaign.turns[1].strategies.filter((strategy) => strategyRequirementsMet(rodeBrief, strategy)).map((strategy) => strategy.id);
    expect(getCampaignTurnCopy(rodeBrief, roseCampaign.turns[1]).headline).toContain("Rose trusts the ball");
    expect(rodeChoices).toContain("rose-gauntlet");
    expect(rodeChoices).not.toContain("ten-man-wave");
  });

  it("reveals Rose-campaign signings even when their fit disappoints", () => {
    const crawford = commitWithResult(roseCampaign, 2, "sign-crawford", false);
    expect(crawford.currentOutcome?.acquiredPlayer?.name).toBe("Jamal Crawford");
    expect(crawford.departedPlayers).toEqual(expect.arrayContaining(["Omer Asik", "Kyle Korver", "C.J. Watson", "Ronnie Brewer"]));

    const pau = commitWithResult(roseCampaign, 3, "sign-pau", false);
    expect(pau.currentOutcome?.acquiredPlayer?.name).toBe("Pau Gasol");

    const mirotic = commitWithResult(roseCampaign, 3, "bring-mirotic", false);
    expect(mirotic.currentOutcome?.acquiredPlayer?.name).toBe("Nikola Mirotic");
  });

  it("unlocks roster-specific Cleveland decisions from the 2014 response", () => {
    const signedMelo = commitWithResult(roseCampaign, 3, "sign-melo", true);
    expect(signedMelo.currentOutcome?.acquiredPlayer?.name).toBe("Carmelo Anthony");
    const cleveland = { ...advanceCampaign(signedMelo, roseCampaign), turnIndex: 4 };
    const choices = roseCampaign.turns[4].strategies.filter((strategy) => strategyRequirementsMet(cleveland, strategy)).map((strategy) => strategy.id);
    expect(getCampaignTurnCopy(cleveland, roseCampaign.turns[4]).headline).toContain("Carmelo Anthony");
    expect(choices).toContain("melo-clear-side");
    expect(choices).not.toContain("gasol-elbow");
    expect(choices).not.toContain("mirotic-five-out");

    const missedMelo = commitWithResult(roseCampaign, 3, "sign-melo", false);
    expect(missedMelo.currentOutcome?.acquiredPlayer).toBeUndefined();
    expect(missedMelo.flags["star-signing"]).toBe("melo-missed");
  });

  it("shows Rose's 2015 title on the winning timeline update", () => {
    const wonCleveland = commitWithResult(roseCampaign, 4, "rose-butler-action", true);
    expect(wonCleveland.banners.map((item) => item.label)).toEqual(["2015 NBA CHAMPIONS"]);
    expect(wonCleveland.currentOutcome?.changes.some((change) => change.scope === "banner")).toBe(true);
    const coachingRoom = advanceCampaign(wonCleveland, roseCampaign);
    expect(coachingRoom.turnIndex).toBe(5);
    expect(coachingRoom.banners.map((item) => item.label)).toEqual(["2015 NBA CHAMPIONS"]);
    expect(coachingRoom.briefingNews.some((item) => item.headline.includes("2015 NBA championship"))).toBe(false);
  });

  it("adds a drafted player even when the roster-fit outcome fails", () => {
    const drafted = commitWithResult(pistonsCampaign, 0, "draft-melo", false);
    expect(drafted.acquiredPlayers.map((player) => player.name)).toEqual(["Carmelo Anthony"]);
    expect(drafted.currentOutcome?.acquiredPlayer?.name).toBe("Carmelo Anthony");

    const next = advanceCampaign(drafted, pistonsCampaign);
    expect(next.briefingNews.some((news) => news.headline === drafted.currentOutcome?.headline)).toBe(false);
    expect(next.briefingNews.find((news) => news.acquiredPlayer)).toMatchObject({
      headline: "Carmelo Anthony joins the roster",
      acquiredPlayer: { name: "Carmelo Anthony", position: "SF" },
    });
    expect(next.briefingNews.some((news) => news.headline.includes("Denver takes Darko"))).toBe(true);
  });

  it("identifies the Pistons quiet-depth addition on either outcome", () => {
    const won = commitWithResult(pistonsCampaign, 1, "small-deal", true);
    expect(won.currentOutcome?.acquiredPlayer?.name).toBe("George Lynch");

    const underperformed = commitWithResult(pistonsCampaign, 1, "small-deal", false);
    expect(underperformed.currentOutcome?.acquiredPlayer?.name).toBe("George Lynch");
    expect(underperformed.acquiredPlayers.map((player) => player.name)).toContain("George Lynch");
  });

  it("changes later prompts to reflect the drafted star", () => {
    const drafted = commitWithResult(pistonsCampaign, 0, "draft-wade", true);
    const next = advanceCampaign(drafted, pistonsCampaign);
    const finals = { ...next, turnIndex: 2 };
    expect(getCampaignTurnCopy(finals, pistonsCampaign.turns[2]).headline).toContain("Dwyane Wade");
    const choices = pistonsCampaign.turns[2].strategies.filter((strategy) => strategyRequirementsMet(finals, strategy));
    expect(choices.map((strategy) => strategy.id)).toContain("wade-closer");
    expect(choices.map((strategy) => strategy.id)).not.toContain("melo-closer");
  });

  it("ends the campaign when owner trust collapses", () => {
    const state = createCampaignState(pistonsCampaign, "owner-collapse");
    state.relationships["davidson-trust"] = 10;
    state.stage = "fallout";
    expect(ownerTrustCollapsed(state, pistonsCampaign)).toBe(true);
    const ended = advanceCampaign(state, pistonsCampaign);
    expect(ended.stage).toBe("completed");
    expect(getCampaignEnding(ended, pistonsCampaign).id).toBe("owner-fired-you");
  });

  it("records a consequential free-agent arrival and the incumbent departure", () => {
    const signed = commitWithResult(pistonsCampaign, 5, "sign-nazr", true);
    expect(signed.acquiredPlayers.map((player) => player.name)).toContain("Nazr Mohammed");
    expect(signed.departedPlayers).toContain("Ben Wallace");
  });

  it("reveals Tyson Chandler as the successful sign-and-trade return", () => {
    const completed = commitWithResult(pistonsCampaign, 5, "sign-and-trade", true);
    expect(completed.currentOutcome?.acquiredPlayer?.name).toBe("Tyson Chandler");
    expect(completed.acquiredPlayers.map((player) => player.name)).toContain("Tyson Chandler");
    expect(completed.departedPlayers).toContain("Ben Wallace");
    completed.acquiredPlayers = [];
    expect(restoreCampaignState(JSON.stringify(completed), pistonsCampaign, completed.id)?.acquiredPlayers.map((player) => player.name)).toContain("Tyson Chandler");

    const collapsed = commitWithResult(pistonsCampaign, 5, "sign-and-trade", false);
    expect(collapsed.currentOutcome?.acquiredPlayer).toBeUndefined();
    expect(collapsed.acquiredPlayers.map((player) => player.name)).not.toContain("Tyson Chandler");
  });

  it("repairs an existing save that lost an always-acquired draft pick", () => {
    const drafted = commitWithResult(pistonsCampaign, 0, "draft-melo", false);
    drafted.acquiredPlayers = [];
    delete drafted.flags["drafted-player"];
    const restored = restoreCampaignState(JSON.stringify(drafted), pistonsCampaign, drafted.id);
    expect(restored?.acquiredPlayers.map((player) => player.name)).toEqual(["Carmelo Anthony"]);
    expect(restored?.flags["drafted-player"]).toBe("melo");
  });

  it("breaks the forecast into parts that clamp to the total", () => {
    const state = createCampaignState(durantCampaign, "breakdown-run");
    for (const turn of durantCampaign.turns) {
      for (const strategy of turn.strategies) {
        for (const influence of [0, 1, 2]) {
          const breakdown = getChanceBreakdown(state, durantCampaign, strategy, influence);
          expect(breakdown.total).toBe(getStrategyChance(state, durantCampaign, strategy, influence));
          expect(breakdown.total).toBeGreaterThanOrEqual(5);
          expect(breakdown.total).toBeLessThanOrEqual(98);
        }
      }
    }
  });

  it("reports numeric objective progress with targets", () => {
    const state = createCampaignState(durantCampaign, "progress-run");
    const progress = getObjectiveProgress(state, durantCampaign);
    const power = progress.find((item) => item.id === "contend")!;
    expect(power.current).toBe(67);
    expect(power.target).toBe(75);
    expect(power.met).toBe(false);
    const bannerObjective = progress.find((item) => item.id === "raise-banner")!;
    expect(bannerObjective.current).toBe(0);
    expect(bannerObjective.target).toBe(1);
  });

  it("scores a run deterministically and grades tiers", () => {
    const state = createCampaignState(durantCampaign, "score-run");
    const score = getCampaignScore(state, durantCampaign);
    expect(score.total).toBe(getCampaignScore(state, durantCampaign).total);
    expect(score.lines.length).toBeGreaterThanOrEqual(6);

    const strong = createCampaignState(durantCampaign, "score-strong");
    strong.resources["competitive-power"] = 90;
    strong.relationships["durant-trust"] = 80;
    strong.relationships["westbrook-trust"] = 70;
    strong.flags.championships = 2;
    strong.banners = [
      { id: "title-2017", label: "2017 NBA CHAMPIONS", turnId: "extension-room", year: 2017 },
      { id: "title-2019", label: "2019 NBA CHAMPIONS", turnId: "medical-call", year: 2019 },
    ];
    const strongScore = getCampaignScore(strong, durantCampaign);
    expect(strongScore.total).toBeGreaterThan(score.total);
    expect(strongScore.grade).toMatch(/^[SA]/);
  });

  it("validates every campaign's effects and requirements against declared keys", () => {
    for (const campaign of campaigns) {
      const resourceKeys = new Set(campaign.resources.map((item) => item.key));
      const relationshipKeys = new Set(campaign.relationships.map((item) => item.key));
      const flagKeys = new Set(Object.keys(campaign.initialFlags));
      const check = (effect: { scope: string; key: string }, where: string) => {
        if (effect.scope === "resource") expect(resourceKeys.has(effect.key), `${where}: resource ${effect.key}`).toBe(true);
        if (effect.scope === "relationship") expect(relationshipKeys.has(effect.key), `${where}: relationship ${effect.key}`).toBe(true);
        if (effect.scope === "flag") expect(flagKeys.has(effect.key), `${where}: flag ${effect.key}`).toBe(true);
      };
      for (const turn of campaign.turns) {
        for (const strategy of turn.strategies) {
          const where = `${campaign.id}/${turn.id}/${strategy.id}`;
          for (const outcome of [strategy.success, strategy.failure]) {
            outcome.effects.forEach((effect) => check(effect, where));
            outcome.delayed?.effects.forEach((effect) => check(effect, where));
          }
          strategy.delayed?.effects.forEach((effect) => check(effect, where));
          strategy.requirements.forEach((condition) => check(condition, where));
          if (strategy.counteroffer) {
            strategy.counteroffer.accept.effects.forEach((effect) => check(effect, where));
            strategy.counteroffer.decline.effects.forEach((effect) => check(effect, where));
            strategy.counteroffer.accept.delayed?.effects.forEach((effect) => check(effect, where));
            strategy.counteroffer.decline.delayed?.effects.forEach((effect) => check(effect, where));
          }
        }
        for (const investigation of turn.investigations) {
          for (const strategyId of Object.keys(investigation.bonuses)) {
            expect(turn.strategies.some((strategy) => strategy.id === strategyId), `${campaign.id}/${turn.id}/${investigation.id}: bonus ${strategyId}`).toBe(true);
          }
        }
      }
      for (const objective of campaign.objectives) check(objective.condition, `${campaign.id}/objective/${objective.id}`);
      for (const ending of campaign.endings) ending.conditions.forEach((condition) => check(condition, `${campaign.id}/ending/${ending.id}`));
    }
  });

  it("gates the Pistons Sheed strategy behind the deadline trade flag", () => {
    const state = { ...createCampaignState(pistonsCampaign, "sheed-gate"), turnIndex: 3 };
    const sheedStrategy = pistonsCampaign.turns[3].strategies.find((strategy) => strategy.id === "unleash-sheed")!;
    expect(getStrategyChance(state, pistonsCampaign, sheedStrategy)).toBeGreaterThan(0);
    expect(strategyRequirementsMet(state, sheedStrategy)).toBe(false);
    const locked = commitStrategy(state, pistonsCampaign, "unleash-sheed", 0);
    expect(locked.decisions).toHaveLength(0);
    const stateWithSheed = { ...state, flags: { ...state.flags, "sheed-in-detroit": true } };
    expect(strategyRequirementsMet(stateWithSheed, sheedStrategy)).toBe(true);
    const unlocked = commitStrategy(stateWithSheed, pistonsCampaign, "unleash-sheed", 0);
    expect(unlocked.decisions).toHaveLength(1);
  });

  it("plays a full Pistons campaign to a completed ending", () => {
    let state = createCampaignState(pistonsCampaign, "pistons-full-run");
    const picks = ["draft-wade", "trade-sheed", "wall-the-paint", "duncan-straight-up", "hire-flip", "match-chicago"];
    for (const strategyId of picks) {
      state = commitStrategy(state, pistonsCampaign, strategyId, 0);
      if (state.stage === "negotiation") state = resolveCounteroffer(state, pistonsCampaign, "accept");
      expect(state.stage).toBe("fallout");
      state = advanceCampaign(state, pistonsCampaign);
    }
    expect(state.stage).toBe("completed");
    expect(state.decisions).toHaveLength(6);
    const ending = getCampaignEnding(state, pistonsCampaign);
    expect(pistonsCampaign.endings.map((item) => item.id)).toContain(ending.id);
    const score = getCampaignScore(state, pistonsCampaign);
    expect(score.total).toBeGreaterThan(0);
  });
});
