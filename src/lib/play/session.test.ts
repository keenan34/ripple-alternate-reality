import { describe, expect, it } from "vitest";

import { seedStories } from "@/content/seed-stories";
import {
  advanceSession,
  buildTimelineHref,
  chooseInSession,
  createPlaySession,
  getSessionChoices,
  rebuildCompletedSession,
  restorePlaySession,
} from "./session";
import { getNodePresentation } from "./world";

describe("play sessions", () => {
  const story = seedStories[0];

  it("records a choice and advances without mutating the previous session", () => {
    const session = createPlaySession(story, "test-session");
    const choice = story.nodes[story.startNodeId].choices[0];
    const chosen = chooseInSession(session, story, choice.id);
    const advanced = advanceSession(chosen, story);

    expect(session.decisions).toHaveLength(0);
    expect(chosen.decisions).toHaveLength(1);
    expect(chosen.pendingChoiceId).toBe(choice.id);
    expect(advanced.currentNodeId).toBe(choice.nextNodeId);
  });

  it("round-trips a completed deterministic result URL", () => {
    let session = createPlaySession(story, "shareable-session");
    while (session.status === "active") {
      const choice = story.nodes[session.currentNodeId].choices[0];
      session = advanceSession(chooseInSession(session, story, choice.id), story);
    }

    const choiceIds = session.decisions.map((decision) => decision.choiceId);
    const rebuilt = rebuildCompletedSession(story, session.id, choiceIds);
    expect(rebuilt?.decisions).toEqual(session.decisions);
    expect(buildTimelineHref(session)).toContain("choices=");
  });

  it("rejects stale or mismatched local sessions", () => {
    const session = createPlaySession(story, "saved-session");
    expect(restorePlaySession(JSON.stringify(session), story, "saved-session")).not.toBeNull();
    expect(restorePlaySession(JSON.stringify(session), story, "another-session")).toBeNull();
  });

  it("unlocks champion-only content from earlier world-state effects", () => {
    const durant = seedStories.find((candidate) => candidate.id === "kd-stays")!;
    let champion = createPlaySession(durant, "champion-path");
    champion = pickAndAdvance(champion, durant, "kd-stays-n1-choice-2");
    champion = pickAndAdvance(champion, durant, "kd-stays-n2b-choice-1");

    expect(champion.worldState.flags["thunder-champion"]).toBe(true);
    expect(champion.currentNodeId).toBe("n2dynasty");
    expect(getNodePresentation(durant, durant.nodes.n2dynasty, champion.worldState).roster?.label)
      .toContain("Oklahoma City Thunder");

    champion = pickAndAdvance(champion, durant, "kd-stays-n2dynasty-choice-1");
    expect(getSessionChoices(champion, durant).map((choice) => choice.id)).toContain("kd-stays-n3-choice-4");

    let nonChampion = createPlaySession(durant, "non-champion-path");
    nonChampion = pickAndAdvance(nonChampion, durant, "kd-stays-n1-choice-1");
    nonChampion = pickAndAdvance(nonChampion, durant, "kd-stays-n2a-choice-1");
    expect(getSessionChoices(nonChampion, durant).map((choice) => choice.id)).not.toContain("kd-stays-n3-choice-4");
  });

  it("supports an explicit early ending", () => {
    const durant = seedStories.find((candidate) => candidate.id === "kd-stays")!;
    let session = createPlaySession(durant, "early-ending");
    session = pickAndAdvance(session, durant, "kd-stays-n1-choice-1");
    session = pickAndAdvance(session, durant, "kd-stays-n2a-choice-3");

    expect(session.status).toBe("completed");
    expect(session.decisions).toHaveLength(2);
    expect(session.ending?.id).toBe("okc-sacrifice-ending");
    expect(session.ending?.epilogue).toContain("Kevin Durant");
  });

  it("reproduces seeded events and state changes for the same session id", () => {
    const durant = seedStories.find((candidate) => candidate.id === "kd-stays")!;
    const simulate = () => {
      let session = createPlaySession(durant, "deterministic-seed");
      session = pickAndAdvance(session, durant, "kd-stays-n1-choice-1");
      session = pickAndAdvance(session, durant, "kd-stays-n2a-choice-1");
      return chooseInSession(session, durant, "kd-stays-n3-choice-1");
    };

    const first = simulate();
    const second = simulate();
    expect(first.decisions.at(-1)?.triggeredEvent).toEqual(second.decisions.at(-1)?.triggeredEvent);
    expect(first.worldState).toEqual(second.worldState);
    expect(first.decisions.at(-1)?.consequences.length).toBeGreaterThan(2);
  });
});

function pickAndAdvance(
  session: ReturnType<typeof createPlaySession>,
  story: (typeof seedStories)[number],
  choiceId: string,
) {
  return advanceSession(chooseInSession(session, story, choiceId), story);
}
