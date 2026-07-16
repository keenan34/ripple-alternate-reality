import { describe, expect, it } from "vitest";

import { seedStories } from "./seed-stories";
import { storyDefinitionSchema } from "@/lib/stories/schema";

describe("seed stories", () => {
  it("migrates and validates all four prototype scenarios", () => {
    expect(seedStories).toHaveLength(4);
    for (const story of seedStories) {
      expect(storyDefinitionSchema.safeParse(story).success).toBe(true);
    }
  });

  it("has stable, unique story and choice identifiers", () => {
    expect(new Set(seedStories.map((story) => story.id)).size).toBe(seedStories.length);

    for (const story of seedStories) {
      const choiceIds = Object.values(story.nodes).flatMap((node) =>
        node.choices.map((choice) => choice.id),
      );
      expect(new Set(choiceIds).size).toBe(choiceIds.length);
    }
  });

  it("rejects a graph that points to a missing node", () => {
    const story = structuredClone(seedStories[0]);
    story.nodes[story.startNodeId].choices[0].nextNodeId = "missing-node";

    const result = storyDefinitionSchema.safeParse(story);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.message.includes("does not exist"))).toBe(true);
    }
  });

  it("rejects unreachable content", () => {
    const story = structuredClone(seedStories[0]);
    story.nodes["orphan"] = {
      ...structuredClone(story.nodes[story.startNodeId]),
      id: "orphan",
      choices: story.nodes[story.startNodeId].choices.map((choice, index) => ({
        ...choice,
        id: `orphan-choice-${index + 1}`,
      })),
    };

    const result = storyDefinitionSchema.safeParse(story);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.message.includes("unreachable"))).toBe(true);
    }
  });

  it("rejects cycles even when another branch still reaches an ending", () => {
    const story = structuredClone(seedStories[0]);
    story.nodes.n4.choices[0].nextNodeId = story.startNodeId;
    delete story.nodes.n4.choices[0].ending;

    const result = storyDefinitionSchema.safeParse(story);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.message.includes("Cycle detected"))).toBe(true);
    }
  });

  it("rejects undefined state references and terminal choices without endings", () => {
    const story = structuredClone(seedStories[0]);
    story.nodes[story.startNodeId].conditions.push({
      scope: "flag",
      key: "undefined-flag",
      operator: "equals",
      value: true,
    });
    delete story.nodes.n4.choices[0].ending;

    const result = storyDefinitionSchema.safeParse(story);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.message.includes("is not defined"))).toBe(true);
      expect(result.error.issues.some((issue) => issue.message.includes("must define an ending"))).toBe(true);
    }
  });
});
