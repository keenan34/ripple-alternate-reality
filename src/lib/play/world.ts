import type {
  SeededEvent,
  StoryCondition,
  StoryDefinition,
  StoryEffect,
  StoryNode,
} from "@/lib/stories/schema";

export type TimelineFact = {
  id: string;
  year: number;
  headline: string;
  source: "choice" | "event";
};

export type WorldState = {
  metrics: Record<string, number>;
  flags: Record<string, boolean>;
  facts: Record<string, string | number | boolean>;
  relationships: Record<string, number>;
  timelineFacts: TimelineFact[];
};

export type Consequence = {
  scope: StoryEffect["scope"];
  key: string;
  label: string;
  before: string | number | boolean;
  after: string | number | boolean;
};

export type TriggeredEvent = {
  id: string;
  headline: string;
  detail: string;
  consequences: Consequence[];
};

export function createWorldState(story: StoryDefinition): WorldState {
  return {
    metrics: Object.fromEntries(story.scoring.metrics.map((definition) => [definition.key, definition.initialValue])),
    flags: Object.fromEntries(story.world.flags.map((definition) => [definition.key, definition.initialValue])),
    facts: Object.fromEntries(story.world.facts.map((definition) => [definition.key, definition.initialValue])),
    relationships: Object.fromEntries(story.world.relationships.map((definition) => [definition.key, definition.initialValue])),
    timelineFacts: [],
  };
}

export function conditionsMatch(conditions: StoryCondition[], state: WorldState): boolean {
  return conditions.every((condition) => {
    const actual = getStateValue(state, condition.scope, condition.key);
    const expected = condition.value;
    switch (condition.operator) {
      case "exists": return actual !== undefined && actual !== null;
      case "equals": return actual === expected;
      case "not-equals": return actual !== expected;
      case "greater-than": return typeof actual === "number" && typeof expected === "number" && actual > expected;
      case "at-least": return typeof actual === "number" && typeof expected === "number" && actual >= expected;
      case "less-than": return typeof actual === "number" && typeof expected === "number" && actual < expected;
      case "at-most": return typeof actual === "number" && typeof expected === "number" && actual <= expected;
    }
  });
}

export function applyEffects(
  state: WorldState,
  effects: StoryEffect[],
  story: StoryDefinition,
): { state: WorldState; consequences: Consequence[] } {
  const next = structuredClone(state);
  const consequences: Consequence[] = [];

  for (const effect of effects) {
    const before = getStateValue(next, effect.scope, effect.key);
    if (before === undefined) continue;
    let after: string | number | boolean = before;

    if (effect.operation === "set") after = effect.value;
    if (effect.operation === "increment" && typeof before === "number" && typeof effect.value === "number") after = before + effect.value;
    if (effect.operation === "decrement" && typeof before === "number" && typeof effect.value === "number") after = before - effect.value;
    if (effect.operation === "append") after = `${String(before)}${before ? ", " : ""}${String(effect.value)}`;
    if (effect.operation === "remove") after = String(before).replace(String(effect.value), "").replace(/^, |, $/g, "");

    if (effect.scope === "metric" && typeof after === "number") {
      const definition = story.scoring.metrics.find((candidate) => candidate.key === effect.key);
      if (definition) after = clamp(after, definition.minimum, definition.maximum);
      next.metrics[effect.key] = after;
    }
    if (effect.scope === "relationship" && typeof after === "number") {
      after = clamp(after, 0, 100);
      next.relationships[effect.key] = after;
    }
    if (effect.scope === "flag" && typeof after === "boolean") next.flags[effect.key] = after;
    if (effect.scope === "fact") next.facts[effect.key] = after;

    consequences.push({
      scope: effect.scope,
      key: effect.key,
      label: effect.label ?? getStateLabel(story, effect.scope, effect.key),
      before,
      after,
    });
  }

  return { state: next, consequences };
}

export function getAvailableChoices(node: StoryNode, state: WorldState) {
  return node.choices.filter((choice) => conditionsMatch(choice.conditions, state));
}

export function resolveAvailableNode(story: StoryDefinition, requestedNodeId: string, state: WorldState): string | null {
  let nodeId: string | undefined = requestedNodeId;
  const visited = new Set<string>();
  while (nodeId && !visited.has(nodeId)) {
    visited.add(nodeId);
    const node: StoryNode | undefined = story.nodes[nodeId];
    if (!node) return null;
    if (conditionsMatch(node.conditions, state)) return nodeId;
    nodeId = node.fallbackNodeId;
  }
  return null;
}

export function selectSeededEvent(
  events: SeededEvent[],
  state: WorldState,
  seed: number,
  salt: string,
): SeededEvent | null {
  const eligible = events.filter((event) => conditionsMatch(event.conditions, state));
  if (!eligible.length) return null;
  const totalWeight = eligible.reduce((total, event) => total + event.weight, 0);
  let selection = stableFraction(`${seed}:${salt}`) * totalWeight;
  for (const event of eligible) {
    selection -= event.weight;
    if (selection < 0) return event;
  }
  return eligible.at(-1) ?? null;
}

export function renderTemplate(template: string, story: StoryDefinition, state: WorldState): string {
  return template.replace(
    /\{\{(actor|team|league|metric|flag|fact|relationship):([a-z0-9-]+)\}\}/g,
    (token, kind: string, key: string) => {
      if (kind === "actor") return story.domain.actors.find((actor) => actor.id === key)?.name ?? token;
      if (kind === "team") return story.domain.teams.find((team) => team.id === key)?.name ?? token;
      if (kind === "league") return story.domain.leagues.find((league) => league.id === key)?.name ?? token;
      const value = getStateValue(state, kind as StoryEffect["scope"], key);
      if (typeof value === "boolean") return value ? "yes" : "no";
      return value === undefined ? token : String(value);
    },
  );
}

export function getNodePresentation(story: StoryDefinition, node: StoryNode, state: WorldState) {
  const roster = node.presentation.rosterTemplate
    ? {
        label: renderTemplate(node.presentation.rosterTemplate.label, story, state),
        players: node.presentation.rosterTemplate.players.map((player) => renderTemplate(player, story, state)),
      }
    : node.presentation.roster;
  return {
    wire: renderTemplate(node.wireTemplate ?? node.wire, story, state),
    question: renderTemplate(node.questionTemplate ?? node.question, story, state),
    roster,
  };
}

export function numericChange(consequence: Consequence): number | null {
  if (typeof consequence.before !== "number" || typeof consequence.after !== "number") return null;
  return consequence.after - consequence.before;
}

function getStateValue(state: WorldState, scope: StoryEffect["scope"], key: string) {
  if (scope === "metric") return state.metrics[key];
  if (scope === "flag") return state.flags[key];
  if (scope === "fact") return state.facts[key];
  return state.relationships[key];
}

function getStateLabel(story: StoryDefinition, scope: StoryEffect["scope"], key: string) {
  if (scope === "metric") return story.scoring.metrics.find((definition) => definition.key === key)?.label ?? key;
  if (scope === "flag") return story.world.flags.find((definition) => definition.key === key)?.label ?? key;
  if (scope === "fact") return story.world.facts.find((definition) => definition.key === key)?.label ?? key;
  return story.world.relationships.find((definition) => definition.key === key)?.label ?? key;
}

function stableFraction(input: string) {
  return hashString(input) / 0x1_0000_0000;
}

export function hashString(input: string) {
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}
