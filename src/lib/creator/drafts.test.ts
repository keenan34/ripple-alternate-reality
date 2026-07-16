import { describe, expect, it } from "vitest";

import {
  canEditDraft,
  cloneDraft,
  createNextVersion,
  createStarterDraft,
  loadDrafts,
  saveDraft,
  setWorkflowStatus,
  validateCreatorStory,
} from "./drafts";

function memoryStorage() {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
  };
}

describe("creator drafts", () => {
  it("starts with a valid, publishable story", () => {
    expect(validateCreatorStory(createStarterDraft().story)).toEqual([]);
  });

  it("saves and restores a draft", () => {
    const storage = memoryStorage();
    const draft = createStarterDraft("2026-01-01T00:00:00.000Z");
    saveDraft(storage, draft);
    expect(loadDrafts(storage)[0].id).toBe(draft.id);
  });

  it("locks published versions and creates an editable next version", () => {
    const draft = createStarterDraft();
    const published = setWorkflowStatus(draft, "published");
    expect(canEditDraft(published)).toBe(false);
    const next = createNextVersion(published);
    expect(next.story.version).toBe(2);
    expect(next.story.status).toBe("draft");
    expect(canEditDraft(next)).toBe(true);
  });

  it("rejects edits from a different local owner", () => {
    const draft = createStarterDraft();
    draft.ownerId = "another-creator";
    expect(canEditDraft(draft)).toBe(false);
  });

  it("preserves attribution while creating an independent remix lineage", () => {
    const original = createStarterDraft();
    const remix = cloneDraft(original, "remix");
    expect(remix.source).toMatchObject({ kind: "remix", storyId: original.story.id });
    expect(remix.lineageId).not.toBe(original.lineageId);
  });

  it("will not publish an invalid graph", () => {
    const draft = createStarterDraft();
    draft.story.startNodeId = "missing-node";
    expect(setWorkflowStatus(draft, "published").story.status).toBe("draft");
  });
});
