import { z } from "zod";

export const identifierSchema = z
  .string()
  .min(1)
  .max(80)
  .regex(/^[a-z0-9][a-z0-9-]*$/, "Use lowercase letters, numbers, and hyphens.");

export const stateValueSchema = z.union([z.string(), z.number(), z.boolean()]);
export const stateScopeSchema = z.enum(["flag", "metric", "fact", "relationship"]);

export const storyConditionSchema = z.object({
  scope: stateScopeSchema,
  key: identifierSchema,
  operator: z.enum(["equals", "not-equals", "greater-than", "at-least", "less-than", "at-most", "exists"]),
  value: stateValueSchema.optional(),
});

export const storyEffectSchema = z.object({
  scope: stateScopeSchema,
  key: identifierSchema,
  operation: z.enum(["set", "increment", "decrement", "append", "remove"]),
  value: stateValueSchema,
  label: z.string().min(1).max(100).optional(),
});

export const storyEndingSchema = z.object({
  id: identifierSchema,
  title: z.string().min(1).max(160),
  epilogueTemplate: z.string().min(1).max(1200),
});

export const seededEventSchema = z.object({
  id: identifierSchema,
  weight: z.number().int().positive().max(1000),
  conditions: z.array(storyConditionSchema),
  headlineTemplate: z.string().min(1).max(220),
  detailTemplate: z.string().min(1).max(700),
  effects: z.array(storyEffectSchema),
});

export const storyChoiceSchema = z.object({
  id: identifierSchema,
  label: z.string().min(1).max(280),
  tier: z.enum(["consensus", "plausible", "longshot", "unrated"]),
  conditions: z.array(storyConditionSchema),
  effects: z.array(storyEffectSchema),
  outcome: z.object({
    stamp: z.string().min(1).max(80),
    verdict: z.string().min(1).max(800),
    verdictTemplate: z.string().min(1).max(1000).optional(),
    headline: z.string().min(1).max(180),
    headlineTemplate: z.string().min(1).max(220).optional(),
  }),
  nextNodeId: identifierSchema.nullable(),
  ending: storyEndingSchema.optional(),
});

export const storyNodeSchema = z.object({
  id: identifierSchema,
  kind: z.enum(["event", "ending"]),
  year: z.number().int().min(1800).max(2200),
  wire: z.string().min(1).max(800),
  wireTemplate: z.string().min(1).max(1000).optional(),
  historicalContext: z.string().min(1).max(800),
  question: z.string().min(1).max(300),
  questionTemplate: z.string().min(1).max(400).optional(),
  conditions: z.array(storyConditionSchema),
  fallbackNodeId: identifierSchema.optional(),
  presentation: z.object({
    assetKey: identifierSchema.optional(),
    roster: z
      .object({
        label: z.string().min(1).max(120),
        players: z.array(z.string().min(1).max(80)).min(1).max(20),
      })
      .optional(),
    rosterTemplate: z
      .object({
        label: z.string().min(1).max(160),
        players: z.array(z.string().min(1).max(120)).min(1).max(20),
      })
      .optional(),
  }),
  seededEvents: z.array(seededEventSchema).max(12),
  choices: z.array(storyChoiceSchema).min(1).max(8),
});

const metricDefinitionSchema = z.object({
  key: identifierSchema,
  label: z.string().min(1).max(80),
  minimum: z.number(),
  maximum: z.number(),
  initialValue: z.number(),
});

const stateDefinitionSchema = z.object({
  key: identifierSchema,
  label: z.string().min(1).max(80),
  initialValue: stateValueSchema,
});

const actorSchema = z.object({
  id: identifierSchema,
  name: z.string().min(1).max(100),
  role: z.string().min(1).max(100),
  teamId: identifierSchema.optional(),
});

const teamSchema = z.object({
  id: identifierSchema,
  name: z.string().min(1).max(120),
  abbreviation: z.string().min(1).max(12),
  leagueId: identifierSchema,
});

const leagueSchema = z.object({
  id: identifierSchema,
  name: z.string().min(1).max(120),
  sport: identifierSchema,
});

const storyDefinitionBaseSchema = z.object({
  schemaVersion: z.literal(2),
  id: identifierSchema,
  slug: identifierSchema,
  version: z.number().int().positive(),
  status: z.enum(["draft", "in-review", "published", "archived"]),
  author: z.object({
    id: identifierSchema,
    displayName: z.string().min(1).max(80),
  }),
  metadata: z.object({
    eyebrow: z.string().min(1).max(120),
    title: z.string().min(1).max(160),
    summary: z.string().min(1).max(500),
    historicalBaseline: z.string().min(1).max(500),
    sport: identifierSchema,
    league: identifierSchema,
    tags: z.array(identifierSchema).max(12),
    coverAssetKey: identifierSchema.optional(),
  }),
  domain: z.object({
    actors: z.array(actorSchema),
    teams: z.array(teamSchema),
    leagues: z.array(leagueSchema),
  }),
  scoring: z.object({
    metrics: z.array(metricDefinitionSchema).min(1),
  }),
  world: z.object({
    flags: z.array(stateDefinitionSchema.extend({ initialValue: z.boolean() })),
    facts: z.array(stateDefinitionSchema),
    relationships: z.array(stateDefinitionSchema.extend({ initialValue: z.number().min(0).max(100) })),
  }),
  startNodeId: identifierSchema,
  nodes: z.record(identifierSchema, storyNodeSchema),
  publishedAt: z.string().datetime().nullable(),
});

export const storyDefinitionSchema = storyDefinitionBaseSchema.superRefine((story, context) => {
  const nodeIds = new Set(Object.keys(story.nodes));
  const choiceIds = new Set<string>();
  const eventIds = new Set<string>();
  const metricKeys = uniqueDefinitionKeys(story.scoring.metrics, "scoring.metrics", context);
  const flagKeys = uniqueDefinitionKeys(story.world.flags, "world.flags", context);
  const factKeys = uniqueDefinitionKeys(story.world.facts, "world.facts", context);
  const relationshipKeys = uniqueDefinitionKeys(story.world.relationships, "world.relationships", context);
  const stateKeys = { metric: metricKeys, flag: flagKeys, fact: factKeys, relationship: relationshipKeys };

  for (const [index, metric] of story.scoring.metrics.entries()) {
    if (metric.minimum > metric.maximum || metric.initialValue < metric.minimum || metric.initialValue > metric.maximum) {
      context.addIssue({
        code: "custom",
        path: ["scoring", "metrics", index],
        message: `Metric "${metric.key}" has invalid bounds or initial value.`,
      });
    }
  }

  const leagueIds = new Set(story.domain.leagues.map((league) => league.id));
  const teamIds = new Set(story.domain.teams.map((team) => team.id));
  for (const [index, team] of story.domain.teams.entries()) {
    if (!leagueIds.has(team.leagueId)) {
      context.addIssue({ code: "custom", path: ["domain", "teams", index, "leagueId"], message: `League "${team.leagueId}" does not exist.` });
    }
  }
  for (const [index, actor] of story.domain.actors.entries()) {
    if (actor.teamId && !teamIds.has(actor.teamId)) {
      context.addIssue({ code: "custom", path: ["domain", "actors", index, "teamId"], message: `Team "${actor.teamId}" does not exist.` });
    }
  }

  if (!nodeIds.has(story.startNodeId)) {
    context.addIssue({ code: "custom", path: ["startNodeId"], message: `Start node "${story.startNodeId}" does not exist.` });
  }

  for (const [nodeKey, node] of Object.entries(story.nodes)) {
    if (nodeKey !== node.id) {
      context.addIssue({ code: "custom", path: ["nodes", nodeKey, "id"], message: `Node key "${nodeKey}" must match node id "${node.id}".` });
    }
    if (node.fallbackNodeId && !nodeIds.has(node.fallbackNodeId)) {
      context.addIssue({ code: "custom", path: ["nodes", nodeKey, "fallbackNodeId"], message: `Fallback node "${node.fallbackNodeId}" does not exist.` });
    }
    validateConditions(node.conditions, stateKeys, ["nodes", nodeKey, "conditions"], context);

    for (const [eventIndex, event] of node.seededEvents.entries()) {
      if (eventIds.has(event.id)) {
        context.addIssue({ code: "custom", path: ["nodes", nodeKey, "seededEvents", eventIndex, "id"], message: `Seeded event id "${event.id}" is duplicated.` });
      }
      eventIds.add(event.id);
      validateConditions(event.conditions, stateKeys, ["nodes", nodeKey, "seededEvents", eventIndex, "conditions"], context);
      validateEffects(event.effects, stateKeys, ["nodes", nodeKey, "seededEvents", eventIndex, "effects"], context);
    }

    for (const [choiceIndex, choice] of node.choices.entries()) {
      if (choiceIds.has(choice.id)) {
        context.addIssue({ code: "custom", path: ["nodes", nodeKey, "choices", choiceIndex, "id"], message: `Choice id "${choice.id}" is duplicated.` });
      }
      choiceIds.add(choice.id);
      validateConditions(choice.conditions, stateKeys, ["nodes", nodeKey, "choices", choiceIndex, "conditions"], context);
      validateEffects(choice.effects, stateKeys, ["nodes", nodeKey, "choices", choiceIndex, "effects"], context);

      if (choice.nextNodeId !== null && !nodeIds.has(choice.nextNodeId)) {
        context.addIssue({ code: "custom", path: ["nodes", nodeKey, "choices", choiceIndex, "nextNodeId"], message: `Next node "${choice.nextNodeId}" does not exist.` });
      }
      if (choice.nextNodeId === null && !choice.ending) {
        context.addIssue({ code: "custom", path: ["nodes", nodeKey, "choices", choiceIndex, "ending"], message: "Every terminal choice must define an ending." });
      }
      if (choice.nextNodeId !== null && choice.ending) {
        context.addIssue({ code: "custom", path: ["nodes", nodeKey, "choices", choiceIndex, "ending"], message: "Only terminal choices may define an ending." });
      }
    }
  }

  if (!nodeIds.has(story.startNodeId)) return;
  const graph = buildGraph(story.nodes);
  validateReachability(story.startNodeId, nodeIds, graph, context);
  validateCycles(nodeIds, graph, context);
  validateEndingRoutes(nodeIds, story.nodes, graph, context);
});

type RefinementContext = z.RefinementCtx;
type Definition = { key: string };
type StateKeySets = Record<z.infer<typeof stateScopeSchema>, Set<string>>;

function uniqueDefinitionKeys(definitions: Definition[], path: string, context: RefinementContext) {
  const keys = new Set<string>();
  definitions.forEach((definition, index) => {
    if (keys.has(definition.key)) {
      context.addIssue({ code: "custom", path: [...path.split("."), index, "key"], message: `State key "${definition.key}" is duplicated.` });
    }
    keys.add(definition.key);
  });
  return keys;
}

function validateConditions(conditions: StoryCondition[], keys: StateKeySets, path: (string | number)[], context: RefinementContext) {
  conditions.forEach((condition, index) => {
    if (!keys[condition.scope].has(condition.key)) {
      context.addIssue({ code: "custom", path: [...path, index, "key"], message: `${condition.scope} state "${condition.key}" is not defined.` });
    }
  });
}

function validateEffects(effects: StoryEffect[], keys: StateKeySets, path: (string | number)[], context: RefinementContext) {
  effects.forEach((effect, index) => {
    if (!keys[effect.scope].has(effect.key)) {
      context.addIssue({ code: "custom", path: [...path, index, "key"], message: `${effect.scope} state "${effect.key}" is not defined.` });
    }
    if ((effect.operation === "increment" || effect.operation === "decrement") && typeof effect.value !== "number") {
      context.addIssue({ code: "custom", path: [...path, index, "value"], message: `${effect.operation} effects require a numeric value.` });
    }
  });
}

function buildGraph(nodes: Record<string, StoryNode>) {
  return new Map(Object.entries(nodes).map(([nodeId, node]) => {
    const edges = new Set(node.choices.flatMap((choice) => choice.nextNodeId ? [choice.nextNodeId] : []));
    if (node.fallbackNodeId) edges.add(node.fallbackNodeId);
    return [nodeId, edges];
  }));
}

function validateReachability(startNodeId: string, nodeIds: Set<string>, graph: Map<string, Set<string>>, context: RefinementContext) {
  const reachable = new Set<string>();
  const pending = [startNodeId];
  while (pending.length) {
    const nodeId = pending.pop();
    if (!nodeId || reachable.has(nodeId)) continue;
    reachable.add(nodeId);
    graph.get(nodeId)?.forEach((next) => pending.push(next));
  }
  nodeIds.forEach((nodeId) => {
    if (!reachable.has(nodeId)) context.addIssue({ code: "custom", path: ["nodes", nodeId], message: `Node "${nodeId}" is unreachable from the start node.` });
  });
}

function validateCycles(nodeIds: Set<string>, graph: Map<string, Set<string>>, context: RefinementContext) {
  const visiting = new Set<string>();
  const visited = new Set<string>();
  function visit(nodeId: string) {
    if (visiting.has(nodeId)) {
      context.addIssue({ code: "custom", path: ["nodes", nodeId], message: `Cycle detected at node "${nodeId}".` });
      return;
    }
    if (visited.has(nodeId)) return;
    visiting.add(nodeId);
    graph.get(nodeId)?.forEach(visit);
    visiting.delete(nodeId);
    visited.add(nodeId);
  }
  nodeIds.forEach(visit);
}

function validateEndingRoutes(nodeIds: Set<string>, nodes: Record<string, StoryNode>, graph: Map<string, Set<string>>, context: RefinementContext) {
  const canReachEnding = new Set(
    Object.entries(nodes)
      .filter(([, node]) => node.choices.some((choice) => choice.nextNodeId === null && choice.ending))
      .map(([nodeId]) => nodeId),
  );
  let changed = true;
  while (changed) {
    changed = false;
    nodeIds.forEach((nodeId) => {
      if (!canReachEnding.has(nodeId) && [...(graph.get(nodeId) ?? [])].some((next) => canReachEnding.has(next))) {
        canReachEnding.add(nodeId);
        changed = true;
      }
    });
  }
  nodeIds.forEach((nodeId) => {
    if (!canReachEnding.has(nodeId)) context.addIssue({ code: "custom", path: ["nodes", nodeId], message: `Node "${nodeId}" cannot reach a defined ending.` });
  });
}

export type StoryCondition = z.infer<typeof storyConditionSchema>;
export type StoryEffect = z.infer<typeof storyEffectSchema>;
export type StoryEnding = z.infer<typeof storyEndingSchema>;
export type SeededEvent = z.infer<typeof seededEventSchema>;
export type StoryChoice = z.infer<typeof storyChoiceSchema>;
export type StoryNode = z.infer<typeof storyNodeSchema>;
export type StoryDefinition = z.infer<typeof storyDefinitionSchema>;

export function validateStory(input: unknown): StoryDefinition {
  return storyDefinitionSchema.parse(input);
}
