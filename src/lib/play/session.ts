import type { StoryChoice, StoryDefinition } from "@/lib/stories/schema";
import {
  applyEffects,
  conditionsMatch,
  createWorldState,
  getAvailableChoices,
  hashString,
  renderTemplate,
  resolveAvailableNode,
  selectSeededEvent,
  type Consequence,
  type TriggeredEvent,
  type WorldState,
} from "./world";

export const SESSION_STORAGE_PREFIX = "ripple:session:";

export type PlayDecision = {
  nodeId: string;
  choiceId: string;
  year: number;
  label: string;
  tier: StoryChoice["tier"];
  stamp: string;
  verdict: string;
  headline: string;
  consequences: Consequence[];
  triggeredEvent: TriggeredEvent | null;
};

export type PlayEnding = {
  id: string;
  title: string;
  epilogue: string;
};

export type PlaySession = {
  schemaVersion: 2;
  id: string;
  storySlug: string;
  storyVersion: number;
  seed: number;
  currentNodeId: string;
  pendingChoiceId: string | null;
  decisions: PlayDecision[];
  worldState: WorldState;
  triggeredEventIds: string[];
  ending: PlayEnding | null;
  status: "active" | "completed";
  updatedAt: string;
};

export function createPlaySession(story: StoryDefinition, sessionId: string): PlaySession {
  return {
    schemaVersion: 2,
    id: sessionId,
    storySlug: story.slug,
    storyVersion: story.version,
    seed: hashString(`${story.slug}:${sessionId}`),
    currentNodeId: story.startNodeId,
    pendingChoiceId: null,
    decisions: [],
    worldState: createWorldState(story),
    triggeredEventIds: [],
    ending: null,
    status: "active",
    updatedAt: new Date().toISOString(),
  };
}

export function chooseInSession(
  session: PlaySession,
  story: StoryDefinition,
  choiceId: string,
): PlaySession {
  if (session.status !== "active" || session.pendingChoiceId) return session;
  const node = story.nodes[session.currentNodeId];
  const choice = getAvailableChoices(node, session.worldState).find((candidate) => candidate.id === choiceId);
  if (!node || !choice) return session;

  const choiceResult = applyEffects(session.worldState, choice.effects, story);
  let worldState = choiceResult.state;
  const eventDefinition = selectSeededEvent(
    node.seededEvents.filter((event) => !session.triggeredEventIds.includes(event.id)),
    worldState,
    session.seed,
    `${node.id}:${session.decisions.length}`,
  );
  let triggeredEvent: TriggeredEvent | null = null;
  let triggeredEventIds = session.triggeredEventIds;

  if (eventDefinition) {
    const eventResult = applyEffects(worldState, eventDefinition.effects, story);
    worldState = eventResult.state;
    triggeredEvent = {
      id: eventDefinition.id,
      headline: renderTemplate(eventDefinition.headlineTemplate, story, worldState),
      detail: renderTemplate(eventDefinition.detailTemplate, story, worldState),
      consequences: eventResult.consequences,
    };
    triggeredEventIds = [...triggeredEventIds, eventDefinition.id];
  }

  const headline = renderTemplate(choice.outcome.headlineTemplate ?? choice.outcome.headline, story, worldState);
  const verdict = renderTemplate(choice.outcome.verdictTemplate ?? choice.outcome.verdict, story, worldState);
  worldState = {
    ...worldState,
    timelineFacts: [
      ...worldState.timelineFacts,
      { id: choice.id, year: node.year, headline, source: "choice" },
      ...(triggeredEvent ? [{ id: triggeredEvent.id, year: node.year, headline: triggeredEvent.headline, source: "event" as const }] : []),
    ],
  };

  return {
    ...session,
    pendingChoiceId: choice.id,
    decisions: [
      ...session.decisions,
      {
        nodeId: node.id,
        choiceId: choice.id,
        year: node.year,
        label: choice.label,
        tier: choice.tier,
        stamp: choice.outcome.stamp,
        verdict,
        headline,
        consequences: choiceResult.consequences,
        triggeredEvent,
      },
    ],
    worldState,
    triggeredEventIds,
    updatedAt: new Date().toISOString(),
  };
}

export function advanceSession(session: PlaySession, story: StoryDefinition): PlaySession {
  if (!session.pendingChoiceId) return session;
  const node = story.nodes[session.currentNodeId];
  const choice = node?.choices.find((candidate) => candidate.id === session.pendingChoiceId);
  if (!choice) return session;

  if (choice.nextNodeId === null && choice.ending) {
    return {
      ...session,
      pendingChoiceId: null,
      ending: {
        id: choice.ending.id,
        title: choice.ending.title,
        epilogue: renderTemplate(choice.ending.epilogueTemplate, story, session.worldState),
      },
      status: "completed",
      updatedAt: new Date().toISOString(),
    };
  }

  if (!choice.nextNodeId) return session;
  const nextNodeId = resolveAvailableNode(story, choice.nextNodeId, session.worldState);
  if (!nextNodeId) return session;

  return {
    ...session,
    currentNodeId: nextNodeId,
    pendingChoiceId: null,
    updatedAt: new Date().toISOString(),
  };
}

export function restorePlaySession(input: string | null, story: StoryDefinition, sessionId: string): PlaySession | null {
  if (!input) return null;
  try {
    const parsed = JSON.parse(input) as Partial<PlaySession>;
    if (
      parsed.schemaVersion !== 2 ||
      parsed.id !== sessionId ||
      parsed.storySlug !== story.slug ||
      parsed.storyVersion !== story.version ||
      typeof parsed.currentNodeId !== "string" ||
      !story.nodes[parsed.currentNodeId] ||
      !Array.isArray(parsed.decisions) ||
      typeof parsed.worldState !== "object" ||
      !parsed.worldState ||
      typeof parsed.seed !== "number"
    ) {
      return null;
    }
    return parsed as PlaySession;
  } catch {
    return null;
  }
}

export function rebuildCompletedSession(
  story: StoryDefinition,
  sessionId: string,
  choiceIds: string[],
): PlaySession | null {
  let session = createPlaySession(story, sessionId);
  for (const choiceId of choiceIds) {
    const chosen = chooseInSession(session, story, choiceId);
    if (chosen === session) return null;
    session = advanceSession(chosen, story);
  }
  return session.status === "completed" ? session : null;
}

export function getSessionChoices(session: PlaySession, story: StoryDefinition) {
  return getAvailableChoices(story.nodes[session.currentNodeId], session.worldState);
}

export function isCurrentNodeAvailable(session: PlaySession, story: StoryDefinition) {
  return conditionsMatch(story.nodes[session.currentNodeId].conditions, session.worldState);
}

export function getDivergence(session: PlaySession): number {
  if (!session.decisions.length) return 0;
  return Math.round((session.worldState.metrics["divergence-total"] ?? 0) / session.decisions.length);
}

export function getPlausibility(session: PlaySession): number {
  if (!session.decisions.length) return 0;
  return Math.round(((session.worldState.metrics.plausibility ?? 0) / (session.decisions.length * 25)) * 100);
}

export function getResultTitle(plausibility: number, divergence: number) {
  if (plausibility >= 70 && divergence >= 50) return "Editor-in-Chief of the Multiverse";
  if (plausibility >= 70) return "The Documentarian";
  if (plausibility >= 40 && divergence >= 50) return "Alternate-History Columnist";
  if (plausibility >= 40) return "Cautious Beat Reporter";
  if (divergence >= 50) return "Fan-Fiction Laureate";
  return "Timid Time Traveler";
}

export function buildTimelineHref(session: PlaySession): string {
  const choices = session.decisions.map((decision) => decision.choiceId).join(".");
  return `/timeline/${encodeURIComponent(session.id)}?story=${encodeURIComponent(session.storySlug)}&choices=${encodeURIComponent(choices)}`;
}
