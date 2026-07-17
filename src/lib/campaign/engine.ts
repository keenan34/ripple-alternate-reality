import type {
  CampaignCondition,
  CampaignDefinition,
  CampaignEffect,
  CampaignEndingDefinition,
  CampaignOutcome,
  CampaignRosterPlayer,
  CampaignStrategy,
  CampaignTurn,
} from "./schema";

export const CAMPAIGN_STORAGE_PREFIX = "ripple:campaign:";

export type CampaignChange = CampaignEffect & { before: string | number | boolean; after: string | number | boolean };
export type CampaignDecision = {
  turnId: string;
  year: number;
  strategyId: string;
  strategyTitle: string;
  success: boolean;
  chance: number;
  roll: number;
  headline: string;
  changes: CampaignChange[];
  negotiationChoice?: "accept" | "decline";
};

export type ScheduledConsequence = {
  id: string;
  dueTurnIndex: number;
  headline: string;
  detail: string;
  effects: CampaignEffect[];
};

export type CampaignBanner = { id: string; label: string; turnId: string; year: number };
export type AcquiredPlayer = CampaignRosterPlayer & { blurb: string; acquiredTurnId: string };
export type BriefingNews = {
  headline: string;
  detail: string;
  changes: CampaignChange[];
  acquiredPlayer?: AcquiredPlayer;
};

export type CampaignState = {
  schemaVersion: 1;
  id: string;
  campaignId: string;
  seed: number;
  turnIndex: number;
  stage: "briefing" | "negotiation" | "fallout" | "completed";
  resources: Record<string, number>;
  relationships: Record<string, number>;
  flags: Record<string, string | number | boolean>;
  investigatedIds: string[];
  pendingStrategyId: string | null;
  pendingResolution: { success: boolean; chance: number; roll: number; influence: number } | null;
  currentOutcome: (CampaignOutcome & { changes: CampaignChange[]; success: boolean; acquiredPlayer?: AcquiredPlayer }) | null;
  briefingNews: BriefingNews[];
  decisions: CampaignDecision[];
  scheduled: ScheduledConsequence[];
  banners: CampaignBanner[];
  acquiredPlayers: AcquiredPlayer[];
  departedPlayers: string[];
  updatedAt: string;
};

function cloneCampaignValue<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function createCampaignState(campaign: CampaignDefinition, sessionId: string): CampaignState {
  return {
    schemaVersion: 1,
    id: sessionId,
    campaignId: campaign.id,
    seed: hash(`${campaign.id}:${sessionId}`),
    turnIndex: 0,
    stage: "briefing",
    resources: Object.fromEntries(campaign.resources.map((item) => [item.key, item.initialValue])),
    relationships: Object.fromEntries(campaign.relationships.map((item) => [item.key, item.initialValue])),
    flags: { ...campaign.initialFlags },
    investigatedIds: [],
    pendingStrategyId: null,
    pendingResolution: null,
    currentOutcome: null,
    briefingNews: [],
    decisions: [],
    scheduled: [],
    banners: [],
    acquiredPlayers: [],
    departedPlayers: [],
    updatedAt: new Date().toISOString(),
  };
}

export function restoreCampaignState(input: string | null, campaign: CampaignDefinition, sessionId: string) {
  if (!input) return null;
  try {
    const value = JSON.parse(input) as CampaignState;
    if (
      value.schemaVersion !== 1 ||
      value.id !== sessionId ||
      value.campaignId !== campaign.id ||
      !Number.isInteger(value.turnIndex) ||
      value.turnIndex < 0 ||
      value.turnIndex >= campaign.turns.length ||
      !value.resources ||
      !value.relationships ||
      !Array.isArray(value.decisions)
    ) return null;
    // Saves written before banners and player acquisitions existed stay valid.
    if (!Array.isArray(value.banners)) value.banners = [];
    if (!Array.isArray(value.acquiredPlayers)) value.acquiredPlayers = [];
    if (!Array.isArray(value.departedPlayers)) value.departedPlayers = [];
    for (const decision of value.decisions) {
      const turn = campaign.turns.find((item) => item.id === decision.turnId);
      const strategy = turn?.strategies.find((item) => item.id === decision.strategyId);
      const resolvedOutcome = decision.negotiationChoice
        ? strategy?.counteroffer?.[decision.negotiationChoice]
        : decision.success ? strategy?.success : strategy?.failure;
      if (resolvedOutcome) decision.headline = resolvedOutcome.headline;
      for (const effect of resolvedOutcome?.effects ?? []) {
        if (effect.scope === "flag" && !(effect.key in value.flags)) value.flags[effect.key] = effect.value;
      }
      if (turn && strategy?.acquisition && acquisitionCompleted(strategy, decision.success, decision.negotiationChoice) && !value.acquiredPlayers.some((player) => player.name === strategy.acquisition!.player.name)) {
        value.acquiredPlayers.push({ ...strategy.acquisition.player, acquiredTurnId: turn.id });
      }
    }
    const latestDecision = value.decisions[value.decisions.length - 1];
    if (value.stage === "fallout" && value.currentOutcome && latestDecision) {
      const turn = campaign.turns.find((item) => item.id === latestDecision.turnId);
      const strategy = turn?.strategies.find((item) => item.id === latestDecision.strategyId);
      const resolvedOutcome = latestDecision.negotiationChoice
        ? strategy?.counteroffer?.[latestDecision.negotiationChoice]
        : latestDecision.success ? strategy?.success : strategy?.failure;
      if (resolvedOutcome) {
        const acquiredPlayer = strategy?.acquisition && acquisitionCompleted(strategy, latestDecision.success, latestDecision.negotiationChoice)
          ? value.acquiredPlayers.find((player) => player.name === strategy.acquisition!.player.name)
          : undefined;
        value.currentOutcome = {
          ...value.currentOutcome,
          ...resolvedOutcome,
          changes: value.currentOutcome.changes,
          success: latestDecision.success,
          acquiredPlayer,
        };
      }
    }
    return value;
  } catch {
    return null;
  }
}

export function investigate(state: CampaignState, campaign: CampaignDefinition, investigationId: string) {
  if (state.stage !== "briefing" || state.investigatedIds.includes(investigationId)) return state;
  const investigation = campaign.turns[state.turnIndex].investigations.find((item) => item.id === investigationId);
  if (!investigation || state.resources.intel < investigation.intelCost) return state;
  return stamp({
    ...state,
    resources: { ...state.resources, intel: state.resources.intel - investigation.intelCost },
    investigatedIds: [...state.investigatedIds, investigation.id],
  });
}

export const INFLUENCE_CHANCE_BONUS = 12;

export function getChanceBreakdown(state: CampaignState, campaign: CampaignDefinition, strategy: CampaignStrategy, influence = 0) {
  const turn = campaign.turns[state.turnIndex];
  const investigation = turn.investigations
    .filter((item) => state.investigatedIds.includes(item.id))
    .reduce((total, item) => total + (item.bonuses[strategy.id] ?? 0), 0);
  const cohesion = Math.round(((state.resources["team-cohesion"] ?? 50) - 50) / 8);
  const influenceBonus = influence * INFLUENCE_CHANCE_BONUS;
  const total = clamp(strategy.baseChance + investigation + cohesion + influenceBonus, 5, 98);
  return { base: strategy.baseChance, investigation, cohesion, influence: influenceBonus, total };
}

export function getStrategyChance(state: CampaignState, campaign: CampaignDefinition, strategy: CampaignStrategy, influence = 0) {
  return getChanceBreakdown(state, campaign, strategy, influence).total;
}

export function strategyRequirementsMet(state: CampaignState, strategy: CampaignStrategy) {
  return strategy.requirements.every((condition) => conditionMatches(state, condition));
}

export function getCampaignTurnCopy(state: CampaignState, turn: CampaignTurn) {
  const variant = turn.promptVariants?.find((item) => item.conditions.every((condition) => conditionMatches(state, condition)));
  return {
    headline: variant?.headline ?? turn.headline,
    brief: variant?.brief ?? turn.brief,
    historicalContext: variant?.historicalContext ?? turn.historicalContext,
  };
}

export function ownerTrustCollapsed(state: CampaignState, campaign: CampaignDefinition) {
  const owner = campaign.relationships.find((item) => /owner/i.test(`${item.name} ${item.role}`));
  return owner ? (state.relationships[owner.key] ?? owner.initialValue) <= 10 : false;
}

export function canCommitStrategy(state: CampaignState, strategy: CampaignStrategy, influence = 0) {
  if (state.stage !== "briefing" || !strategyRequirementsMet(state, strategy)) return false;
  if ((state.resources.influence ?? 0) < influence + (strategy.costs.influence ?? 0)) return false;
  return Object.entries(strategy.costs).every(([key, cost]) => (state.resources[key] ?? 0) >= cost);
}

export function commitStrategy(state: CampaignState, campaign: CampaignDefinition, strategyId: string, influence = 0) {
  const turn = campaign.turns[state.turnIndex];
  const strategy = turn.strategies.find((item) => item.id === strategyId);
  if (!strategy || !canCommitStrategy(state, strategy, influence)) return state;

  const next = cloneCampaignValue(state);
  for (const [key, cost] of Object.entries(strategy.costs)) {
    next.resources[key] = clampToResource(campaign, key, next.resources[key] - cost);
  }
  next.resources.influence = clampToResource(campaign, "influence", next.resources.influence - influence);

  const chance = getStrategyChance(state, campaign, strategy, influence);
  const roll = (hash(`${state.seed}:${turn.id}:${strategy.id}`) % 100) + 1;
  const success = roll <= chance;
  const resolution = { success, chance, roll, influence };

  if (strategy.counteroffer && success) {
    return stamp({ ...next, stage: "negotiation", pendingStrategyId: strategy.id, pendingResolution: resolution });
  }

  return finalizeStrategy(next, campaign, strategy, success ? strategy.success : strategy.failure, resolution);
}

export function resolveCounteroffer(state: CampaignState, campaign: CampaignDefinition, response: "accept" | "decline") {
  if (state.stage !== "negotiation" || !state.pendingStrategyId || !state.pendingResolution) return state;
  const turn = campaign.turns[state.turnIndex];
  const strategy = turn.strategies.find((item) => item.id === state.pendingStrategyId);
  if (!strategy?.counteroffer) return state;
  const outcome = response === "accept" ? strategy.counteroffer.accept : strategy.counteroffer.decline;
  return finalizeStrategy(state, campaign, strategy, outcome, state.pendingResolution, response);
}

function finalizeStrategy(
  state: CampaignState,
  campaign: CampaignDefinition,
  strategy: CampaignStrategy,
  outcome: CampaignOutcome,
  resolution: NonNullable<CampaignState["pendingResolution"]>,
  negotiationChoice?: "accept" | "decline",
) {
  const turn = campaign.turns[state.turnIndex];
  const applied = applyCampaignEffects(state, campaign, outcome.effects, turn);
  const acquiredPlayer = strategy.acquisition && acquisitionCompleted(strategy, resolution.success, negotiationChoice)
    && !applied.state.acquiredPlayers.some((player) => player.name === strategy.acquisition!.player.name)
    ? { ...strategy.acquisition.player, acquiredTurnId: turn.id }
    : null;
  if (acquiredPlayer) applied.state.acquiredPlayers = [...applied.state.acquiredPlayers, acquiredPlayer];
  if (outcome.departures?.length) applied.state.departedPlayers = [...new Set([...applied.state.departedPlayers, ...outcome.departures])];
  const decision: CampaignDecision = {
    turnId: turn.id,
    year: turn.year,
    strategyId: strategy.id,
    strategyTitle: strategy.title,
    success: resolution.success,
    chance: resolution.chance,
    roll: resolution.roll,
    headline: outcome.headline,
    changes: applied.changes,
    ...(negotiationChoice ? { negotiationChoice } : {}),
  };
  const delayedEntries = [
    ...(strategy.delayed ? [{ suffix: "delayed", delayed: strategy.delayed }] : []),
    ...(outcome.delayed ? [{ suffix: "outcome-delayed", delayed: outcome.delayed }] : []),
  ];
  const scheduled = [...applied.state.scheduled, ...delayedEntries.map(({ suffix, delayed }) => ({
    id: `${turn.id}-${strategy.id}-${suffix}`,
    dueTurnIndex: Math.min(campaign.turns.length - 1, state.turnIndex + delayed.turnsLater),
    headline: delayed.headline,
    detail: delayed.detail,
    effects: delayed.effects,
  }))];

  return stamp({
    ...applied.state,
    stage: "fallout",
    pendingStrategyId: null,
    pendingResolution: null,
    currentOutcome: { ...outcome, changes: applied.changes, success: resolution.success, ...(acquiredPlayer ? { acquiredPlayer } : {}) },
    decisions: [...applied.state.decisions, decision],
    scheduled,
  });
}

function acquisitionCompleted(strategy: CampaignStrategy, success: boolean, negotiationChoice?: "accept" | "decline") {
  return negotiationChoice !== "decline" && (success || strategy.acquisition?.always === true);
}

export function advanceCampaign(state: CampaignState, campaign: CampaignDefinition) {
  if (state.stage !== "fallout") return state;
  if (ownerTrustCollapsed(state, campaign)) return stamp({ ...state, stage: "completed", currentOutcome: null });
  if (state.turnIndex >= campaign.turns.length - 1) return stamp({ ...state, stage: "completed", currentOutcome: null });

  const nextTurnIndex = state.turnIndex + 1;
  const due = state.scheduled.filter((item) => item.dueTurnIndex === nextTurnIndex);
  let next = cloneCampaignValue(state);
  const briefingNews: CampaignState["briefingNews"] = [];
  const acquiredPlayer = state.currentOutcome?.acquiredPlayer;
  if (acquiredPlayer) {
    briefingNews.push({
      headline: `${acquiredPlayer.name} joins the roster`,
      detail: acquiredPlayer.blurb,
      changes: [],
      acquiredPlayer,
    });
    const latestDecision = state.decisions[state.decisions.length - 1];
    const strategy = campaign.turns[state.turnIndex].strategies.find((item) => item.id === latestDecision?.strategyId);
    if (strategy?.acquisition?.reciprocal) briefingNews.push({ ...strategy.acquisition.reciprocal, changes: [] });
  }
  for (const consequence of due) {
    const applied = applyCampaignEffects(next, campaign, consequence.effects, campaign.turns[nextTurnIndex]);
    next = applied.state;
    briefingNews.push({ headline: consequence.headline, detail: consequence.detail, changes: applied.changes });
  }
  return stamp({
    ...next,
    turnIndex: nextTurnIndex,
    stage: "briefing",
    investigatedIds: [],
    pendingStrategyId: null,
    pendingResolution: null,
    currentOutcome: null,
    briefingNews,
    scheduled: next.scheduled.filter((item) => item.dueTurnIndex !== nextTurnIndex),
  });
}

export function objectiveComplete(state: CampaignState, condition: CampaignCondition) {
  return conditionMatches(state, condition);
}

export function getCampaignEnding(state: CampaignState, campaign: CampaignDefinition): CampaignEndingDefinition {
  const matched = campaign.endings.find((ending) => ending.conditions.every((condition) => conditionMatches(state, condition)));
  return matched ?? campaign.endings[campaign.endings.length - 1];
}

export type ObjectiveProgress = {
  id: string;
  label: string;
  description: string;
  primary: boolean;
  met: boolean;
  current: number | null;
  target: number | null;
};

export function getObjectiveProgress(state: CampaignState, campaign: CampaignDefinition): ObjectiveProgress[] {
  return campaign.objectives.map((objective) => {
    const condition = objective.condition;
    const value = condition.scope === "resource" ? state.resources[condition.key]
      : condition.scope === "relationship" ? state.relationships[condition.key]
        : state.flags[condition.key];
    const numeric = typeof value === "number" && typeof condition.value === "number" && condition.operator !== "equals";
    return {
      id: objective.id,
      label: objective.label,
      description: objective.description,
      primary: objective.primary,
      met: conditionMatches(state, condition),
      current: numeric ? (value as number) : null,
      target: numeric ? (condition.value as number) : null,
    };
  });
}

export type CampaignScore = {
  total: number;
  max: number;
  percent: number;
  grade: (typeof CAMPAIGN_GRADE_BANDS)[number]["grade"];
  lines: { label: string; points: number; detail: string }[];
};

// Bands are percentages of the campaign's achievable maximum, so an S+ means
// the same thing in every campaign regardless of how many points it offers.
export const CAMPAIGN_GRADE_BANDS = [
  { grade: "S+", minimum: 95 }, { grade: "S", minimum: 90 }, { grade: "S-", minimum: 86 },
  { grade: "A+", minimum: 81 }, { grade: "A", minimum: 76 }, { grade: "A-", minimum: 70 },
  { grade: "B+", minimum: 64 }, { grade: "B", minimum: 58 }, { grade: "B-", minimum: 52 },
  { grade: "C+", minimum: 46 }, { grade: "C", minimum: 40 }, { grade: "C-", minimum: 34 },
  { grade: "D+", minimum: 26 }, { grade: "D", minimum: 18 }, { grade: "D-", minimum: 0 },
] as const;

// The best score a campaign can hand out: every objective secured, every
// distinct banner raised, every decision won, and perfect trust and health.
export function getCampaignMaxScore(campaign: CampaignDefinition): number {
  const primaryCount = campaign.objectives.filter((item) => item.primary).length;
  const secondaryCount = campaign.objectives.length - primaryCount;
  const bannerKeys = new Set<string>();
  for (const turn of campaign.turns) {
    for (const strategy of turn.strategies) {
      const outcomes = [strategy.success, strategy.failure, strategy.counteroffer?.accept, strategy.counteroffer?.decline];
      for (const outcome of outcomes) {
        for (const effect of outcome?.effects ?? []) if (effect.scope === "banner") bannerKeys.add(effect.key);
        for (const effect of outcome?.delayed?.effects ?? []) if (effect.scope === "banner") bannerKeys.add(effect.key);
      }
      for (const effect of strategy.delayed?.effects ?? []) if (effect.scope === "banner") bannerKeys.add(effect.key);
    }
  }
  return primaryCount * 250 + secondaryCount * 100 + bannerKeys.size * 300 + campaign.turns.length * 50 + 200;
}

export function getCampaignGrade(total: number, max: number): CampaignScore["grade"] {
  const percent = max > 0 ? (total / max) * 100 : 0;
  return CAMPAIGN_GRADE_BANDS.find((band) => percent >= band.minimum)?.grade ?? "D-";
}

export function getCampaignScore(state: CampaignState, campaign: CampaignDefinition): CampaignScore {
  const lines: CampaignScore["lines"] = [];
  const primaryMet = campaign.objectives.filter((item) => item.primary && conditionMatches(state, item.condition));
  const secondaryMet = campaign.objectives.filter((item) => !item.primary && conditionMatches(state, item.condition));
  lines.push({ label: "Primary objectives", points: primaryMet.length * 250, detail: `${primaryMet.length} of ${campaign.objectives.filter((item) => item.primary).length} secured · 250 each` });
  lines.push({ label: "Secondary objectives", points: secondaryMet.length * 100, detail: `${secondaryMet.length} of ${campaign.objectives.filter((item) => !item.primary).length} secured · 100 each` });
  lines.push({ label: "Championships", points: state.banners.length * 300, detail: state.banners.length ? state.banners.map((banner) => banner.label).join(" · ") : "No banner raised · 300 each" });
  const wins = state.decisions.filter((decision) => decision.success).length;
  lines.push({ label: "Decisions won", points: wins * 50, detail: `${wins} of ${state.decisions.length} calls landed · 50 each` });
  const relationshipValues = campaign.relationships.map((item) => state.relationships[item.key] ?? 0);
  const relationshipAverage = relationshipValues.length ? relationshipValues.reduce((total, value) => total + value, 0) / relationshipValues.length : 0;
  lines.push({ label: "Locker-room trust", points: Math.round(relationshipAverage), detail: `Average relationship ${Math.round(relationshipAverage)} of 100` });
  const healthResources = campaign.resources.filter((item) => item.maximum === 100);
  const healthValues = healthResources.map((item) => state.resources[item.key] ?? 0);
  const healthAverage = healthValues.length ? healthValues.reduce((total, value) => total + value, 0) / healthValues.length : 0;
  lines.push({ label: "Franchise health", points: Math.round(healthAverage), detail: `Average of ${healthResources.map((item) => item.shortLabel.toLowerCase()).join(", ")}` });
  const total = lines.reduce((sum, line) => sum + line.points, 0);
  const max = getCampaignMaxScore(campaign);
  const percent = max > 0 ? Math.round((total / max) * 100) : 0;
  const grade = getCampaignGrade(total, max);
  return { total, max, percent, grade, lines };
}

export function riskLabel(chance: number) {
  if (chance >= 82) return "Controlled";
  if (chance >= 65) return "Contested";
  return "Volatile";
}

function conditionMatches(state: CampaignState, condition: CampaignCondition) {
  const value = condition.scope === "resource" ? state.resources[condition.key]
    : condition.scope === "relationship" ? state.relationships[condition.key]
      : state.flags[condition.key];
  if (condition.operator === "equals") return value === condition.value;
  if (typeof value !== "number" || typeof condition.value !== "number") return false;
  return condition.operator === "at-least" ? value >= condition.value : value <= condition.value;
}

function applyCampaignEffects(state: CampaignState, campaign: CampaignDefinition, effects: CampaignEffect[], turn: CampaignDefinition["turns"][number]) {
  const next = cloneCampaignValue(state);
  const changes: CampaignChange[] = [];
  for (const effect of effects) {
    if (effect.scope === "banner") {
      if (!next.banners.some((banner) => banner.id === effect.key)) {
        next.banners = [...next.banners, { id: effect.key, label: String(effect.value), turnId: turn.id, year: turn.year }];
        next.flags.championships = next.banners.length;
        changes.push({ ...effect, before: false, after: true });
      }
      continue;
    }
    const target = effect.scope === "resource" ? next.resources : effect.scope === "relationship" ? next.relationships : next.flags;
    const before = target[effect.key] ?? (effect.operation === "add" ? 0 : effect.value);
    let after: string | number | boolean = effect.operation === "add" && typeof before === "number" && typeof effect.value === "number" ? before + effect.value : effect.value;
    if (effect.scope === "resource" && typeof after === "number") after = clampToResource(campaign, effect.key, after);
    if (effect.scope === "relationship" && typeof after === "number") after = clamp(after, 0, 100);
    (target as Record<string, string | number | boolean>)[effect.key] = after;
    changes.push({ ...effect, before, after });
  }
  return { state: next, changes };
}

function clampToResource(campaign: CampaignDefinition, key: string, value: number) {
  const definition = campaign.resources.find((item) => item.key === key);
  return definition ? clamp(value, definition.minimum, definition.maximum) : value;
}

function stamp<T extends CampaignState>(state: T): T {
  return { ...state, updatedAt: new Date().toISOString() };
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.max(minimum, Math.min(maximum, value));
}

function hash(input: string) {
  let value = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    value ^= input.charCodeAt(index);
    value = Math.imul(value, 16777619);
  }
  return value >>> 0;
}
