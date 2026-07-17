import { z } from "zod";

const id = z.string().regex(/^[a-z0-9][a-z0-9-]*$/);

// A "banner" effect awards a championship: key identifies the banner, value is its
// display label. The engine also mirrors the running banner total into the
// "championships" flag so objectives and endings can condition on titles won.
export const campaignEffectSchema = z.object({
  scope: z.enum(["resource", "relationship", "flag", "banner"]),
  key: id,
  operation: z.enum(["add", "set"]),
  value: z.union([z.number(), z.string(), z.boolean()]),
  label: z.string().min(1),
});

export const campaignConditionSchema = z.object({
  scope: z.enum(["resource", "relationship", "flag"]),
  key: id,
  operator: z.enum(["at-least", "at-most", "equals"]),
  value: z.union([z.number(), z.string(), z.boolean()]),
});

const delayedSchema = z.object({
  turnsLater: z.number().int().min(1).max(5),
  headline: z.string().min(1),
  detail: z.string().min(1),
  effects: z.array(campaignEffectSchema),
});

// Strategy-level `delayed` fires whether the strategy succeeds or fails;
// outcome-level `delayed` fires only when that specific outcome occurs.
const outcomeSchema = z.object({
  stamp: z.string().min(1),
  headline: z.string().min(1),
  detail: z.string().min(1),
  effects: z.array(campaignEffectSchema),
  departures: z.array(z.string().min(1)).optional(),
  delayed: delayedSchema.optional(),
});

const rosterPlayerSchema = z.object({
  name: z.string().min(1),
  number: z.number().int().min(0).max(99),
  position: z.string().min(1),
  depth: z.number().int().min(1).max(5).optional(),
  status: z.string().min(1).optional(),
});

const strategySchema = z.object({
  id,
  title: z.string().min(1),
  summary: z.string().min(1),
  approach: z.string().min(1),
  baseChance: z.number().int().min(5).max(100),
  costs: z.record(id, z.number().int().nonnegative()),
  requirements: z.array(campaignConditionSchema),
  acquisition: z.object({
    always: z.boolean().optional(),
    hint: z.string().min(1),
    player: rosterPlayerSchema.extend({ blurb: z.string().min(1) }),
    reciprocal: z.object({ headline: z.string().min(1), detail: z.string().min(1) }).optional(),
  }).optional(),
  freeAgent: z.object({ name: z.string().min(1), position: z.string().min(1), note: z.string().min(1) }).optional(),
  success: outcomeSchema,
  failure: outcomeSchema,
  delayed: delayedSchema.optional(),
  counteroffer: z.object({
    advisorId: id,
    title: z.string().min(1),
    detail: z.string().min(1),
    acceptLabel: z.string().min(1),
    declineLabel: z.string().min(1),
    accept: outcomeSchema,
    decline: outcomeSchema,
  }).optional(),
});

const turnSchema = z.object({
  id,
  year: z.number().int().min(1900).max(2200),
  date: z.string().min(1),
  deadline: z.string().min(1),
  phase: z.string().min(1),
  headline: z.string().min(1),
  brief: z.string().min(1),
  historicalContext: z.string().min(1),
  artKey: id,
  roster: z.array(rosterPlayerSchema).min(5).max(18),
  advisors: z.array(z.object({
    advisorId: id,
    subject: z.string().min(1),
    body: z.string().min(1),
    stance: z.enum(["support", "warning", "neutral"]),
  })).min(2),
  investigations: z.array(z.object({
    id,
    label: z.string().min(1),
    description: z.string().min(1),
    intelCost: z.number().int().min(1).max(3),
    reveal: z.string().min(1),
    bonuses: z.record(id, z.number().int().min(-50).max(50)),
  })).min(1),
  strategies: z.array(strategySchema).min(2).max(8),
  promptVariants: z.array(z.object({
    conditions: z.array(campaignConditionSchema).min(1),
    headline: z.string().min(1),
    brief: z.string().min(1),
    historicalContext: z.string().min(1).optional(),
  })).optional(),
});

export const campaignDefinitionSchema = z.object({
  schemaVersion: z.literal(1),
  id,
  storySlug: id,
  title: z.string().min(1),
  role: z.string().min(1),
  organization: z.string().min(1),
  objective: z.object({ title: z.string().min(1), description: z.string().min(1) }),
  hero: z.object({
    eyebrow: z.string().min(1),
    title: z.string().min(1),
    tagline: z.string().min(1),
    artKey: id,
  }),
  resources: z.array(z.object({
    key: id,
    label: z.string().min(1),
    shortLabel: z.string().min(1),
    description: z.string().min(1),
    minimum: z.number(),
    maximum: z.number(),
    initialValue: z.number(),
  })).min(3),
  relationships: z.array(z.object({
    key: id,
    name: z.string().min(1),
    role: z.string().min(1),
    initialValue: z.number().min(0).max(100),
  })).min(2),
  initialFlags: z.record(id, z.union([z.string(), z.number(), z.boolean()])),
  objectives: z.array(z.object({
    id,
    label: z.string().min(1),
    description: z.string().min(1),
    primary: z.boolean(),
    condition: campaignConditionSchema,
  })).min(2),
  turns: z.array(turnSchema).min(4),
  // Evaluated in order; the first ending whose conditions all match wins.
  // The final entry acts as the fallback and must have no conditions.
  endings: z.array(z.object({
    id,
    eyebrow: z.string().min(1),
    title: z.string().min(1),
    summary: z.string().min(1),
    conditions: z.array(campaignConditionSchema),
  })).min(2).refine((endings) => endings[endings.length - 1].conditions.length === 0, {
    message: "The last ending is the fallback and must have no conditions",
  }),
  realHistory: z.string().min(1),
});

export type CampaignEffect = z.infer<typeof campaignEffectSchema>;
export type CampaignCondition = z.infer<typeof campaignConditionSchema>;
export type CampaignDefinition = z.infer<typeof campaignDefinitionSchema>;
export type CampaignTurn = CampaignDefinition["turns"][number];
export type CampaignStrategy = CampaignTurn["strategies"][number];
export type CampaignOutcome = CampaignStrategy["success"];
export type CampaignRosterPlayer = CampaignTurn["roster"][number];
export type CampaignEndingDefinition = CampaignDefinition["endings"][number];

export function validateCampaign(value: unknown) {
  return campaignDefinitionSchema.parse(value);
}
