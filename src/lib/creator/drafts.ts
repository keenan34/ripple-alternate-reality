import { storyDefinitionSchema, type StoryDefinition } from "@/lib/stories/schema";

export const CREATOR_STORAGE_KEY = "ripple:creator:drafts:v1";
export const LOCAL_CREATOR_ID = "local-creator";

export type NodePosition = { x: number; y: number };
export type DraftSource = {
  kind: "duplicate" | "remix";
  storyId: string;
  title: string;
  author: string;
};

export type CreatorDraft = {
  id: string;
  ownerId: string;
  lineageId: string;
  story: StoryDefinition;
  source?: DraftSource;
  coverDataUrl?: string;
  assetDataUrls?: Record<string, string>;
  layout: Record<string, NodePosition>;
  createdAt: string;
  updatedAt: string;
};

export type ValidationIssue = {
  path: string;
  section: "setup" | "map" | "publish";
  message: string;
};

function uid(prefix: string) {
  const value = typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID().slice(0, 8)
    : Math.random().toString(36).slice(2, 10);
  return `${prefix}-${value}`;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72) || "untitled-story";
}

export function createStarterDraft(now = new Date().toISOString()): CreatorDraft {
  const id = uid("draft");
  const nodeId = "opening-night";
  const story: StoryDefinition = {
    schemaVersion: 2,
    id,
    slug: id,
    version: 1,
    status: "draft",
    author: { id: LOCAL_CREATOR_ID, displayName: "Local Creator" },
    metadata: {
      eyebrow: "An alternate sports history",
      title: "Untitled Ripple",
      summary: "One decision sends a familiar sports timeline in a new direction.",
      historicalBaseline: "Describe what happened in the real timeline before your point of divergence.",
      sport: "basketball",
      league: "nba",
      tags: ["alternate-history"],
    },
    domain: {
      leagues: [{ id: "nba", name: "National Basketball Association", sport: "basketball" }],
      teams: [],
      actors: [{ id: "lead-character", name: "Lead Character", role: "Decision maker" }],
    },
    scoring: {
      metrics: [{ key: "plausibility", label: "Plausibility", minimum: 0, maximum: 100, initialValue: 50 }],
    },
    world: {
      flags: [{ key: "timeline-diverged", label: "Timeline diverged", initialValue: false }],
      facts: [],
      relationships: [],
    },
    startNodeId: nodeId,
    nodes: {
      [nodeId]: {
        id: nodeId,
        kind: "event",
        year: new Date().getFullYear(),
        wire: "A franchise-defining decision reaches the front office.",
        historicalContext: "In the real timeline, the organization stayed on its expected course.",
        question: "What changes first?",
        conditions: [],
        presentation: {},
        seededEvents: [],
        choices: [
          {
            id: "change-course",
            label: "Change course and accept the uncertainty.",
            tier: "plausible",
            conditions: [],
            effects: [{ scope: "flag", key: "timeline-diverged", operation: "set", value: true, label: "Timeline diverges" }],
            outcome: {
              stamp: "BREAKING",
              verdict: "The choice creates a new timeline and a new set of consequences.",
              headline: "THE FUTURE BREAKS FROM THE PAST",
            },
            nextNodeId: null,
            ending: {
              id: "changed-future",
              title: "A Different Future",
              epilogueTemplate: "The record books now carry the consequences of a decision nobody expected.",
            },
          },
          {
            id: "hold-course",
            label: "Hold the line and trust the original plan.",
            tier: "consensus",
            conditions: [],
            effects: [],
            outcome: {
              stamp: "AS EXPECTED",
              verdict: "The familiar plan survives the pressure of the moment.",
              headline: "THE ORIGINAL PLAN HOLDS",
            },
            nextNodeId: null,
            ending: {
              id: "familiar-future",
              title: "History Holds",
              epilogueTemplate: "The timeline bends under pressure, then settles back into a recognizable shape.",
            },
          },
        ],
      },
    },
    publishedAt: null,
  };

  return {
    id,
    ownerId: LOCAL_CREATOR_ID,
    lineageId: uid("lineage"),
    story,
    layout: { [nodeId]: { x: 80, y: 120 } },
    createdAt: now,
    updatedAt: now,
  };
}

export function parseDrafts(input: string | null): CreatorDraft[] {
  if (!input) return [];
  try {
    const value = JSON.parse(input) as CreatorDraft[];
    if (!Array.isArray(value)) return [];
    return value.filter((draft) => draft && typeof draft.id === "string" && draft.story?.schemaVersion === 2);
  } catch {
    return [];
  }
}

export function loadDrafts(storage: Pick<Storage, "getItem">): CreatorDraft[] {
  return parseDrafts(storage.getItem(CREATOR_STORAGE_KEY)).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function saveDraft(storage: Pick<Storage, "getItem" | "setItem">, draft: CreatorDraft) {
  const drafts = loadDrafts(storage).filter((candidate) => candidate.id !== draft.id);
  storage.setItem(CREATOR_STORAGE_KEY, JSON.stringify([draft, ...drafts]));
}

export function deleteDraft(storage: Pick<Storage, "getItem" | "setItem">, draftId: string) {
  storage.setItem(CREATOR_STORAGE_KEY, JSON.stringify(loadDrafts(storage).filter((draft) => draft.id !== draftId)));
}

export function canEditDraft(draft: CreatorDraft, ownerId = LOCAL_CREATOR_ID) {
  return draft.ownerId === ownerId && (draft.story.status === "draft" || draft.story.status === "in-review");
}

export function validateCreatorStory(story: StoryDefinition): ValidationIssue[] {
  const result = storyDefinitionSchema.safeParse(story);
  if (result.success) return [];
  return result.error.issues.map((issue) => {
    const path = issue.path.join(".");
    const section = path.startsWith("nodes") || path === "startNodeId" ? "map" : path ? "setup" : "publish";
    return { path, section, message: issue.message };
  });
}

export function cloneDraft(
  original: CreatorDraft,
  kind: "duplicate" | "remix",
  now = new Date().toISOString(),
): CreatorDraft {
  const copy = structuredClone(original);
  const id = uid("draft");
  copy.id = id;
  copy.ownerId = LOCAL_CREATOR_ID;
  copy.lineageId = uid("lineage");
  copy.createdAt = now;
  copy.updatedAt = now;
  copy.story.id = id;
  copy.story.slug = `${slugify(original.story.metadata.title)}-${id.slice(-4)}`;
  copy.story.version = 1;
  copy.story.status = "draft";
  copy.story.publishedAt = null;
  copy.story.author = { id: LOCAL_CREATOR_ID, displayName: "Local Creator" };
  copy.story.metadata.title = `${original.story.metadata.title} ${kind === "remix" ? "Remix" : "Copy"}`;
  copy.source = {
    kind,
    storyId: original.story.id,
    title: original.story.metadata.title,
    author: original.story.author.displayName,
  };
  return copy;
}

export function draftFromPublishedStory(story: StoryDefinition, now = new Date().toISOString()): CreatorDraft {
  const base: CreatorDraft = {
    id: story.id,
    ownerId: story.author.id,
    lineageId: story.id,
    story: structuredClone(story),
    layout: Object.fromEntries(Object.keys(story.nodes).map((nodeId, index) => [nodeId, { x: 80 + (index % 3) * 300, y: 80 + Math.floor(index / 3) * 220 }])),
    createdAt: now,
    updatedAt: now,
  };
  return cloneDraft(base, "remix", now);
}

export function createNextVersion(original: CreatorDraft, now = new Date().toISOString()): CreatorDraft {
  const copy = structuredClone(original);
  const id = uid("draft");
  copy.id = id;
  copy.story.id = id;
  copy.story.slug = original.story.slug;
  copy.story.version = original.story.version + 1;
  copy.story.status = "draft";
  copy.story.publishedAt = null;
  copy.createdAt = now;
  copy.updatedAt = now;
  return copy;
}

export function setWorkflowStatus(draft: CreatorDraft, status: StoryDefinition["status"], now = new Date().toISOString()) {
  if (!canEditDraft(draft) && status !== "archived") return draft;
  if ((status === "in-review" || status === "published") && validateCreatorStory(draft.story).length) return draft;
  const next = structuredClone(draft);
  next.story.status = status;
  next.story.publishedAt = status === "published" ? now : next.story.publishedAt;
  next.updatedAt = now;
  return next;
}
