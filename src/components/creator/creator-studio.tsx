"use client";

import {
  AlertCircle,
  ArrowLeft,
  Check,
  ChevronRight,
  Eye,
  FilePlus2,
  ImagePlus,
  LockKeyhole,
  Plus,
  Redo2,
  Rocket,
  Save,
  Send,
  Trash2,
  Undo2,
  X,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { StoryGraph } from "./story-graph";
import { StudioPreview } from "./studio-preview";
import {
  canEditDraft,
  createNextVersion,
  loadDrafts,
  saveDraft,
  setWorkflowStatus,
  slugify,
  validateCreatorStory,
  type CreatorDraft,
  type ValidationIssue,
} from "@/lib/creator/drafts";
import type { StoryChoice, StoryCondition, StoryEffect, StoryNode } from "@/lib/stories/schema";

type StudioTab = "setup" | "map" | "publish";
type SaveState = "saved" | "saving";

export function CreatorStudio({ draftId }: { draftId: string }) {
  const [draft, setDraft] = useState<CreatorDraft | null>(null);
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState<StudioTab>("setup");
  const [selectedNodeId, setSelectedNodeId] = useState("");
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [history, setHistory] = useState<CreatorDraft[]>([]);
  const [future, setFuture] = useState<CreatorDraft[]>([]);
  const [saveState, setSaveState] = useState<SaveState>("saved");
  const [recovered, setRecovered] = useState(false);
  const [preview, setPreview] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const restored = loadDrafts(localStorage).find((candidate) => candidate.id === draftId) ?? null;
    // Browser storage is only available after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDraft(restored);
    setSelectedNodeId(restored?.story.startNodeId ?? "");
    setRecovered(Boolean(restored));
    setReady(true);
  }, [draftId]);

  useEffect(() => {
    if (!draft || !ready) return;
    // Reflect the debounce state while synchronizing the external store.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSaveState("saving");
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      const stamped = { ...draft, updatedAt: new Date().toISOString() };
      saveDraft(localStorage, stamped);
      setSaveState("saved");
    }, 500);
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  }, [draft, ready]);

  const commit = useCallback((mutate: (next: CreatorDraft) => void) => {
    setDraft((current) => {
      if (!current || !canEditDraft(current)) return current;
      const next = structuredClone(current);
      mutate(next);
      setHistory((items) => [...items.slice(-39), current]);
      setFuture([]);
      return next;
    });
  }, []);

  function undo() {
    const previous = history.at(-1);
    if (!previous || !draft) return;
    setHistory((items) => items.slice(0, -1));
    setFuture((items) => [draft, ...items].slice(0, 40));
    setDraft(previous);
  }

  function redo() {
    const next = future[0];
    if (!next || !draft) return;
    setFuture((items) => items.slice(1));
    setHistory((items) => [...items, draft].slice(-40));
    setDraft(next);
  }

  if (!ready) return <main id="main-content" className="studio-loading">Opening Creator Studio…</main>;
  if (!draft) return (
    <main id="main-content" className="studio-missing">
      <AlertCircle size={32} />
      <h1>Draft not found</h1>
      <p>This local draft may have been created in another browser or removed from storage.</p>
      <Link className="button button-primary" href="/create">Return to Creator Studio</Link>
    </main>
  );

  const issues = validateCreatorStory(draft.story);
  const editable = canEditDraft(draft);
  const selectedNode = draft.story.nodes[selectedNodeId] ?? draft.story.nodes[draft.story.startNodeId];
  const selectedChoice = selectedNode?.choices.find((choice) => choice.id === selectedChoiceId) ?? null;

  function changeStatus(status: "in-review" | "published" | "archived") {
    const next = setWorkflowStatus(draft!, status);
    setDraft(next);
    saveDraft(localStorage, next);
    setHistory([]);
    setFuture([]);
  }

  function nextVersion() {
    const next = createNextVersion(draft!);
    saveDraft(localStorage, next);
    window.location.assign(`/create/${next.id}`);
  }

  function openIssue(issue: ValidationIssue) {
    setTab(issue.section === "map" ? "map" : "setup");
    const nodeId = issue.path.split(".")[1];
    if (nodeId && draft!.story.nodes[nodeId]) setSelectedNodeId(nodeId);
  }

  return (
    <main id="main-content" className="creator-studio">
      <header className="studio-topbar">
        <div className="studio-title-block">
          <Link className="icon-action" href="/create" aria-label="Back to Creator Studio" title="Back to Creator Studio"><ArrowLeft size={19} /></Link>
          <div><strong>{draft.story.metadata.title}</strong><span>v{draft.story.version} · {draft.story.status.replace("-", " ")}</span></div>
        </div>
        <div className="studio-save-state" aria-live="polite">
          {saveState === "saving" ? <><Save size={14} /> Saving…</> : <><Check size={14} /> Saved locally</>}
        </div>
        <div className="studio-toolbar">
          <button className="icon-action" type="button" onClick={undo} disabled={!history.length || !editable} aria-label="Undo" title="Undo"><Undo2 size={18} /></button>
          <button className="icon-action" type="button" onClick={redo} disabled={!future.length || !editable} aria-label="Redo" title="Redo"><Redo2 size={18} /></button>
          <button className="button button-quiet compact-button" type="button" disabled={Boolean(issues.length)} onClick={() => setPreview(true)}><Eye size={16} /> Preview</button>
          <button className="button button-primary compact-button" type="button" onClick={() => setTab("publish")}><Rocket size={16} /> Publish</button>
        </div>
      </header>

      {recovered ? (
        <div className="recovery-banner"><Check size={15} /> Recovered your latest local autosave.<button type="button" aria-label="Dismiss recovery notice" onClick={() => setRecovered(false)}><X size={16} /></button></div>
      ) : null}

      <nav className="studio-tabs" aria-label="Story editor sections">
        <button type="button" className={tab === "setup" ? "active" : ""} onClick={() => setTab("setup")}><span>1</span> Setup</button>
        <button type="button" className={tab === "map" ? "active" : ""} onClick={() => setTab("map")}><span>2</span> Story map</button>
        <button type="button" className={tab === "publish" ? "active" : ""} onClick={() => setTab("publish")}><span>3</span> Review & publish {issues.length ? <b>{issues.length}</b> : <Check size={14} />}</button>
      </nav>

      {!editable ? <div className="locked-banner"><LockKeyhole size={16} /> This edition is {draft.story.status} and immutable. Create a new version to make changes.<button className="button button-quiet compact-button" type="button" onClick={nextVersion}><FilePlus2 size={15} /> New version</button></div> : null}

      {tab === "setup" ? <SetupEditor draft={draft} editable={editable} commit={commit} /> : null}
      {tab === "map" ? (
        <div className="map-workspace">
          <section className="map-canvas-panel">
            <div className="map-toolbar">
              <div><strong>Decision map</strong><span>{Object.keys(draft.story.nodes).length} nodes · {Object.values(draft.story.nodes).reduce((sum, node) => sum + node.choices.length, 0)} choices</span></div>
              <button className="button button-quiet compact-button" type="button" disabled={!editable} onClick={() => addNode(draft, commit, setSelectedNodeId)}><Plus size={16} /> Add node</button>
            </div>
            <StoryGraph
              draft={draft}
              selectedNodeId={selectedNodeId}
              selectedChoiceId={selectedChoiceId}
              onSelect={(nodeId, choiceId) => { setSelectedNodeId(nodeId); setSelectedChoiceId(choiceId ?? null); }}
              onMove={(nodeId, position) => commit((next) => { next.layout[nodeId] = position; })}
              onConnect={(nodeId, choiceId, targetNodeId) => commit((next) => {
                const choice = next.story.nodes[nodeId].choices.find((item) => item.id === choiceId);
                if (choice) { choice.nextNodeId = targetNodeId; delete choice.ending; }
              })}
            />
          </section>
          <StoryInspector
            draft={draft}
            node={selectedNode}
            selectedChoice={selectedChoice}
            editable={editable}
            commit={commit}
            onSelectChoice={setSelectedChoiceId}
            onDeleteNode={() => deleteNode(draft, selectedNode.id, commit, setSelectedNodeId)}
          />
        </div>
      ) : null}
      {tab === "publish" ? (
        <PublishPanel
          draft={draft}
          issues={issues}
          onIssue={openIssue}
          onPreview={() => setPreview(true)}
          onStatus={changeStatus}
          onNextVersion={nextVersion}
        />
      ) : null}
      {preview ? <StudioPreview story={draft.story} onClose={() => setPreview(false)} /> : null}
    </main>
  );
}

function SetupEditor({ draft, editable, commit }: { draft: CreatorDraft; editable: boolean; commit: (fn: (next: CreatorDraft) => void) => void }) {
  const story = draft.story;
  function metadata(key: keyof typeof story.metadata, value: string | string[]) {
    commit((next) => { (next.story.metadata as Record<string, unknown>)[key] = value; });
  }
  function cover(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith("image/") || file.size > 2_000_000) return;
    const reader = new FileReader();
    reader.onload = () => commit((next) => { next.coverDataUrl = String(reader.result); });
    reader.readAsDataURL(file);
  }
  return (
    <div className="setup-workspace">
      <section className="editor-section editor-intro">
        <div className="editor-section-head"><span>01</span><div><h2>Story brief</h2><p>The promise readers see before they enter the timeline.</p></div></div>
        <div className="form-grid">
          <Field label="Title" wide><input disabled={!editable} value={story.metadata.title} onChange={(e) => { metadata("title", e.target.value); commit((next) => { next.story.slug = slugify(e.target.value); }); }} /></Field>
          <Field label="URL slug"><input disabled={!editable} value={story.slug} onChange={(e) => commit((next) => { next.story.slug = slugify(e.target.value); })} /></Field>
          <Field label="Eyebrow"><input disabled={!editable} value={story.metadata.eyebrow} onChange={(e) => metadata("eyebrow", e.target.value)} /></Field>
          <Field label="Premise" wide><textarea disabled={!editable} rows={3} value={story.metadata.summary} onChange={(e) => metadata("summary", e.target.value)} /></Field>
          <Field label="Historical baseline" wide><textarea disabled={!editable} rows={4} value={story.metadata.historicalBaseline} onChange={(e) => metadata("historicalBaseline", e.target.value)} /></Field>
          <Field label="Sport"><input disabled={!editable} value={story.metadata.sport} onChange={(e) => metadata("sport", slugify(e.target.value))} /></Field>
          <Field label="League"><input disabled={!editable} value={story.metadata.league} onChange={(e) => metadata("league", slugify(e.target.value))} /></Field>
          <Field label="Tags" wide hint="Comma separated"><input disabled={!editable} value={story.metadata.tags.join(", ")} onChange={(e) => metadata("tags", e.target.value.split(",").map(slugify).filter(Boolean))} /></Field>
          <Field label="Byline"><input disabled={!editable} value={story.author.displayName} onChange={(e) => commit((next) => { next.story.author.displayName = e.target.value; })} /></Field>
        </div>
      </section>

      <section className="editor-section cover-editor">
        <div className="editor-section-head"><span>02</span><div><h2>Cover art</h2><p>Upload a JPG, PNG, or WebP up to 2 MB.</p></div></div>
        <div className="cover-upload">
          <div className="cover-preview" style={draft.coverDataUrl ? { backgroundImage: `url(${draft.coverDataUrl})` } : undefined}>{!draft.coverDataUrl ? <ImagePlus size={32} /> : null}</div>
          <div><strong>{draft.coverDataUrl ? "Custom cover ready" : "Add an editorial image"}</strong><p>A 16:9 image works best across archive and story pages.</p><label className="button button-quiet compact-button"><ImagePlus size={16} /> Choose image<input disabled={!editable} type="file" accept="image/png,image/jpeg,image/webp" onChange={cover} /></label></div>
        </div>
      </section>

      <section className="editor-section">
        <div className="editor-section-head"><span>03</span><div><h2>Characters</h2><p>The people whose names and roles anchor the timeline.</p></div></div>
        <div className="repeat-editor">
          {story.domain.actors.map((actor, index) => (
            <div className="repeat-row" key={`${actor.id}-${index}`}>
              <Field label="Name"><input disabled={!editable} value={actor.name} onChange={(e) => commit((next) => { next.story.domain.actors[index].name = e.target.value; })} /></Field>
              <Field label="Role"><input disabled={!editable} value={actor.role} onChange={(e) => commit((next) => { next.story.domain.actors[index].role = e.target.value; })} /></Field>
              <button className="icon-action danger" disabled={!editable} type="button" aria-label={`Remove ${actor.name}`} onClick={() => commit((next) => { next.story.domain.actors.splice(index, 1); })}><Trash2 size={17} /></button>
            </div>
          ))}
          <button className="add-row" disabled={!editable} type="button" onClick={() => commit((next) => { const id = `character-${next.story.domain.actors.length + 1}`; next.story.domain.actors.push({ id, name: "New Character", role: "Player" }); })}><Plus size={16} /> Add character</button>
        </div>
      </section>

      <section className="editor-section">
        <div className="editor-section-head"><span>04</span><div><h2>World state</h2><p>Metrics and flags let choices carry consequences into later scenes.</p></div></div>
        <div className="state-columns">
          <StateDefinitions title="Metrics" rows={story.scoring.metrics} editable={editable} onAdd={() => commit((next) => next.story.scoring.metrics.push({ key: `metric-${next.story.scoring.metrics.length + 1}`, label: "New metric", minimum: 0, maximum: 100, initialValue: 50 }))} onChange={(index, key, value) => commit((next) => { (next.story.scoring.metrics[index] as unknown as Record<string, unknown>)[key] = key === "label" || key === "key" ? value : Number(value); })} />
          <StateDefinitions title="Flags" rows={story.world.flags} editable={editable} onAdd={() => commit((next) => next.story.world.flags.push({ key: `flag-${next.story.world.flags.length + 1}`, label: "New flag", initialValue: false }))} onChange={(index, key, value) => commit((next) => { const flag = next.story.world.flags[index]; if (key === "initialValue") flag.initialValue = value === "true"; else (flag as unknown as Record<string, unknown>)[key] = value; })} />
        </div>
      </section>
    </div>
  );
}

function StoryInspector({ draft, node, selectedChoice, editable, commit, onSelectChoice, onDeleteNode }: {
  draft: CreatorDraft; node: StoryNode; selectedChoice: StoryChoice | null; editable: boolean;
  commit: (fn: (next: CreatorDraft) => void) => void; onSelectChoice: (id: string | null) => void; onDeleteNode: () => void;
}) {
  const nodeId = node.id;
  const choiceIndex = selectedChoice ? node.choices.findIndex((choice) => choice.id === selectedChoice.id) : -1;
  const updateNode = (key: keyof StoryNode, value: unknown) => commit((next) => { (next.story.nodes[nodeId] as unknown as Record<string, unknown>)[key] = value; });
  const updateChoice = (key: keyof StoryChoice, value: unknown) => commit((next) => { (next.story.nodes[nodeId].choices[choiceIndex] as unknown as Record<string, unknown>)[key] = value; });
  function nodeAsset(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith("image/") || file.size > 2_000_000) return;
    const reader = new FileReader();
    reader.onload = () => commit((next) => {
      const assetKey = `${nodeId}-art`;
      next.story.nodes[nodeId].presentation.assetKey = assetKey;
      next.assetDataUrls ??= {};
      next.assetDataUrls[assetKey] = String(reader.result);
    });
    reader.readAsDataURL(file);
  }
  return (
    <aside className="story-inspector" aria-label="Story inspector">
      <div className="inspector-head"><div><p className="wire-label">Inspector</p><h2>{selectedChoice ? "Choice" : "Decision node"}</h2></div>{node.id !== draft.story.startNodeId ? <button className="icon-action danger" disabled={!editable} type="button" onClick={onDeleteNode} aria-label="Delete node" title="Delete node"><Trash2 size={17} /></button> : null}</div>
      {!selectedChoice ? (
        <>
          <Field label="Node ID"><input disabled value={node.id} /></Field>
          <Field label="Year / date"><input disabled={!editable} type="number" min="1800" max="2200" value={node.year} onChange={(e) => updateNode("year", Number(e.target.value))} /></Field>
          <Field label="News wire"><textarea disabled={!editable} rows={3} value={node.wire} onChange={(e) => updateNode("wire", e.target.value)} /></Field>
          <Field label="Historical context"><textarea disabled={!editable} rows={4} value={node.historicalContext} onChange={(e) => updateNode("historicalContext", e.target.value)} /></Field>
          <Field label="Decision question"><textarea disabled={!editable} rows={2} value={node.question} onChange={(e) => updateNode("question", e.target.value)} /></Field>
          <div className="node-asset-editor">
            {node.presentation.assetKey && draft.assetDataUrls?.[node.presentation.assetKey] ? <div className="node-asset-preview" style={{ backgroundImage: `url(${draft.assetDataUrls[node.presentation.assetKey]})` }} /> : <div className="node-asset-preview"><ImagePlus size={22} /></div>}
            <label className="button button-quiet compact-button"><ImagePlus size={15} /> Scene art<input disabled={!editable} type="file" accept="image/png,image/jpeg,image/webp" onChange={nodeAsset} /></label>
          </div>
          <ConditionsEditor conditions={node.conditions} draft={draft} editable={editable} onChange={(conditions) => updateNode("conditions", conditions)} />
          <div className="inspector-subhead"><strong>Choices</strong><button type="button" disabled={!editable || node.choices.length >= 8} onClick={() => commit((next) => { const choice = makeChoice(nodeId, next.story.nodes[nodeId].choices.length + 1); next.story.nodes[nodeId].choices.push(choice); onSelectChoice(choice.id); })}><Plus size={14} /> Add</button></div>
          <div className="inspector-choice-list">
            {node.choices.map((choice, index) => <button type="button" key={choice.id} onClick={() => onSelectChoice(choice.id)}><span>{index + 1}</span><strong>{choice.label}</strong><ChevronRight size={15} /></button>)}
          </div>
        </>
      ) : (
        <>
          <button className="inspector-back" type="button" onClick={() => onSelectChoice(null)}><ArrowLeft size={15} /> Back to node</button>
          <Field label="Choice label"><textarea disabled={!editable} rows={3} value={selectedChoice.label} onChange={(e) => updateChoice("label", e.target.value)} /></Field>
          <Field label="Plausibility tier"><select disabled={!editable} value={selectedChoice.tier} onChange={(e) => updateChoice("tier", e.target.value)}>{["consensus", "plausible", "longshot", "unrated"].map((tier) => <option key={tier}>{tier}</option>)}</select></Field>
          <Field label="Next step"><select disabled={!editable} value={selectedChoice.nextNodeId ?? "ending"} onChange={(e) => commit((next) => { const choice = next.story.nodes[nodeId].choices[choiceIndex]; if (e.target.value === "ending") { choice.nextNodeId = null; choice.ending ??= { id: `${choice.id}-ending`, title: "A New Ending", epilogueTemplate: "The timeline reaches its final edition." }; } else { choice.nextNodeId = e.target.value; delete choice.ending; } })}><option value="ending">End the story</option>{Object.values(draft.story.nodes).filter((item) => item.id !== nodeId).map((item) => <option key={item.id} value={item.id}>{item.year} · {item.question}</option>)}</select></Field>
          <div className="inspector-outcome"><h3>Immediate outcome</h3><Field label="Stamp"><input disabled={!editable} value={selectedChoice.outcome.stamp} onChange={(e) => commit((next) => { next.story.nodes[nodeId].choices[choiceIndex].outcome.stamp = e.target.value; })} /></Field><Field label="Headline"><textarea disabled={!editable} rows={2} value={selectedChoice.outcome.headline} onChange={(e) => commit((next) => { next.story.nodes[nodeId].choices[choiceIndex].outcome.headline = e.target.value; })} /></Field><Field label="Verdict"><textarea disabled={!editable} rows={4} value={selectedChoice.outcome.verdict} onChange={(e) => commit((next) => { next.story.nodes[nodeId].choices[choiceIndex].outcome.verdict = e.target.value; })} /></Field></div>
          <ConditionsEditor conditions={selectedChoice.conditions} draft={draft} editable={editable} onChange={(conditions) => updateChoice("conditions", conditions)} />
          <EffectsEditor effects={selectedChoice.effects} draft={draft} editable={editable} onChange={(effects) => updateChoice("effects", effects)} />
          {selectedChoice.nextNodeId === null && selectedChoice.ending ? <div className="ending-editor"><h3>Ending</h3><Field label="Title"><input disabled={!editable} value={selectedChoice.ending.title} onChange={(e) => commit((next) => { next.story.nodes[nodeId].choices[choiceIndex].ending!.title = e.target.value; })} /></Field><Field label="Epilogue"><textarea disabled={!editable} rows={5} value={selectedChoice.ending.epilogueTemplate} onChange={(e) => commit((next) => { next.story.nodes[nodeId].choices[choiceIndex].ending!.epilogueTemplate = e.target.value; })} /></Field></div> : null}
          <button className="delete-choice" disabled={!editable || node.choices.length <= 1} type="button" onClick={() => { commit((next) => { next.story.nodes[nodeId].choices.splice(choiceIndex, 1); }); onSelectChoice(null); }}><Trash2 size={15} /> Delete choice</button>
        </>
      )}
    </aside>
  );
}

function ConditionsEditor({ conditions, draft, editable, onChange }: { conditions: StoryCondition[]; draft: CreatorDraft; editable: boolean; onChange: (value: StoryCondition[]) => void }) {
  return <RuleEditor title="Conditions" rows={conditions} draft={draft} editable={editable} kind="condition" onChange={onChange} />;
}
function EffectsEditor({ effects, draft, editable, onChange }: { effects: StoryEffect[]; draft: CreatorDraft; editable: boolean; onChange: (value: StoryEffect[]) => void }) {
  return <RuleEditor title="Effects" rows={effects} draft={draft} editable={editable} kind="effect" onChange={onChange} />;
}

function RuleEditor({ title, rows, draft, editable, kind, onChange }: { title: string; rows: (StoryCondition | StoryEffect)[]; draft: CreatorDraft; editable: boolean; kind: "condition" | "effect"; onChange: (value: never[]) => void }) {
  const definitions = stateKeys(draft);
  function update(index: number, patch: Record<string, unknown>) { const next = structuredClone(rows); Object.assign(next[index], patch); onChange(next as never[]); }
  function add() { const row = kind === "condition" ? { scope: "flag", key: definitions.flag[0] ?? "timeline-diverged", operator: "equals", value: true } : { scope: "metric", key: definitions.metric[0] ?? "plausibility", operation: "increment", value: 5, label: "State change" }; onChange([...rows, row] as never[]); }
  return <div className="rule-editor"><div className="inspector-subhead"><strong>{title}</strong><button type="button" disabled={!editable} onClick={add}><Plus size={14} /> Add</button></div>{rows.map((row, index) => <div className="rule-row" key={index}><select disabled={!editable} value={row.scope} onChange={(e) => { const scope = e.target.value as keyof typeof definitions; update(index, { scope, key: definitions[scope][0] ?? "undefined-state" }); }}>{Object.keys(definitions).map((scope) => <option key={scope}>{scope}</option>)}</select><select disabled={!editable} value={row.key} onChange={(e) => update(index, { key: e.target.value })}>{definitions[row.scope].map((key) => <option key={key}>{key}</option>)}</select><select disabled={!editable} value={kind === "condition" ? (row as StoryCondition).operator : (row as StoryEffect).operation} onChange={(e) => update(index, kind === "condition" ? { operator: e.target.value } : { operation: e.target.value })}>{(kind === "condition" ? ["equals", "not-equals", "greater-than", "at-least", "less-than", "at-most", "exists"] : ["set", "increment", "decrement", "append", "remove"]).map((op) => <option key={op}>{op}</option>)}</select><input disabled={!editable} aria-label={`${title} value`} value={String(row.value ?? "")} onChange={(e) => update(index, { value: parseStateValue(e.target.value) })} /><button className="icon-action danger" disabled={!editable} type="button" aria-label={`Remove ${title.toLowerCase()} row`} onClick={() => onChange(rows.filter((_, item) => item !== index) as never[])}><X size={14} /></button></div>)}</div>;
}

function PublishPanel({ draft, issues, onIssue, onPreview, onStatus, onNextVersion }: { draft: CreatorDraft; issues: ValidationIssue[]; onIssue: (issue: ValidationIssue) => void; onPreview: () => void; onStatus: (status: "in-review" | "published" | "archived") => void; onNextVersion: () => void }) {
  const status = draft.story.status;
  return <div className="publish-workspace"><header><p className="section-kicker">Editorial desk</p><h1>{issues.length ? "Your story needs attention." : status === "published" ? "This edition is live." : "Your story is ready."}</h1><p>{issues.length ? "Resolve each item below before previewing or publishing." : "The graph is connected, every route reaches an ending, and the story contract is valid."}</p></header><div className="publish-columns"><section><div className="publish-section-title"><h2>Validation report</h2><span className={issues.length ? "issue-count" : "valid-count"}>{issues.length ? `${issues.length} issues` : "All checks passed"}</span></div>{issues.length ? <div className="validation-list">{issues.map((issue, index) => <button type="button" onClick={() => onIssue(issue)} key={`${issue.path}-${index}`}><AlertCircle size={17} /><span><strong>{friendlyPath(issue.path)}</strong>{issue.message}</span><ChevronRight size={16} /></button>)}</div> : <div className="validation-success"><Check size={28} /><div><strong>Ready for the press</strong><p>Metadata, state references, graph routes, conditions, effects, and endings passed validation.</p></div></div>}</section><aside className="workflow-panel"><p className="wire-label">Workflow</p><div className="workflow-steps"><span className="done"><Check size={14} /> Draft</span><span className={status === "in-review" || status === "published" ? "done" : ""}><Check size={14} /> Review</span><span className={status === "published" ? "done" : ""}><Check size={14} /> Published</span></div>{draft.source ? <div className="attribution-note"><GitForkIcon /> <span><strong>Attribution attached</strong>{draft.source.kind} of {draft.source.title} by {draft.source.author}</span></div> : null}<button className="button button-quiet" disabled={Boolean(issues.length)} type="button" onClick={onPreview}><Eye size={17} /> Full preview</button>{status === "draft" ? <button className="button button-quiet" disabled={Boolean(issues.length)} type="button" onClick={() => onStatus("in-review")}><Send size={17} /> Send to review</button> : null}{status === "in-review" || status === "draft" ? <button className="button button-primary" disabled={Boolean(issues.length)} type="button" onClick={() => onStatus("published")}><Rocket size={17} /> Publish version {draft.story.version}</button> : null}{status === "published" ? <><button className="button button-primary" type="button" onClick={onNextVersion}><FilePlus2 size={17} /> Create version {draft.story.version + 1}</button><button className="archive-action" type="button" onClick={() => onStatus("archived")}>Unpublish and archive</button></> : null}{status === "archived" ? <button className="button button-primary" type="button" onClick={onNextVersion}><FilePlus2 size={17} /> Create new version</button> : null}</aside></div></div>;
}

function Field({ label, hint, wide, children }: { label: string; hint?: string; wide?: boolean; children: React.ReactNode }) { return <label className={`editor-field${wide ? " wide" : ""}`}><span>{label}{hint ? <small>{hint}</small> : null}</span>{children}</label>; }
function StateDefinitions({ title, rows, editable, onAdd, onChange }: { title: string; rows: Record<string, unknown>[]; editable: boolean; onAdd: () => void; onChange: (index: number, key: string, value: string) => void }) { return <div className="state-definition"><div className="inspector-subhead"><strong>{title}</strong><button type="button" disabled={!editable} onClick={onAdd}><Plus size={14} /> Add</button></div>{rows.map((row, index) => <div className="state-row" key={String(row.key)}><input disabled={!editable} aria-label={`${title} key`} value={String(row.key)} onChange={(e) => onChange(index, "key", slugify(e.target.value))} /><input disabled={!editable} aria-label={`${title} label`} value={String(row.label)} onChange={(e) => onChange(index, "label", e.target.value)} />{"minimum" in row ? <input disabled={!editable} aria-label={`${title} initial value`} type="number" value={String(row.initialValue)} onChange={(e) => onChange(index, "initialValue", e.target.value)} /> : <select disabled={!editable} aria-label={`${title} initial value`} value={String(row.initialValue)} onChange={(e) => onChange(index, "initialValue", e.target.value)}><option>true</option><option>false</option></select>}</div>)}</div>; }
function stateKeys(draft: CreatorDraft) { return { flag: draft.story.world.flags.map((item) => item.key), metric: draft.story.scoring.metrics.map((item) => item.key), fact: draft.story.world.facts.map((item) => item.key), relationship: draft.story.world.relationships.map((item) => item.key) }; }
function parseStateValue(value: string) { if (value === "true") return true; if (value === "false") return false; if (value !== "" && !Number.isNaN(Number(value))) return Number(value); return value; }
function friendlyPath(path: string) { return path ? path.replaceAll(".", " › ").replace(/\bmetadata\b/, "Story brief").replace(/\bnodes\b/, "Story map") : "Story"; }
function GitForkIcon() { return <span className="source-mark">R</span>; }

function makeChoice(nodeId: string, index: number): StoryChoice { const id = `${nodeId}-choice-${index}`; return { id, label: "A new decision", tier: "unrated", conditions: [], effects: [], outcome: { stamp: "UPDATE", verdict: "Describe the immediate consequence of this choice.", headline: "A NEW TIMELINE TAKES SHAPE" }, nextNodeId: null, ending: { id: `${id}-ending`, title: "A New Ending", epilogueTemplate: "The timeline reaches its final edition." } }; }
function addNode(draft: CreatorDraft, commit: (fn: (next: CreatorDraft) => void) => void, select: (id: string) => void) { let index = Object.keys(draft.story.nodes).length + 1; let id = `decision-${index}`; while (draft.story.nodes[id]) { index += 1; id = `decision-${index}`; } const finalId = id; commit((next) => { next.story.nodes[finalId] = { id: finalId, kind: "event", year: new Date().getFullYear(), wire: "A new development changes the direction of the story.", historicalContext: "Explain the real-world context for this moment.", question: "What happens next?", conditions: [], presentation: {}, seededEvents: [], choices: [makeChoice(finalId, 1)] }; next.layout[finalId] = { x: 360, y: 160 + Object.keys(next.story.nodes).length * 35 }; }); select(finalId); }
function deleteNode(draft: CreatorDraft, nodeId: string, commit: (fn: (next: CreatorDraft) => void) => void, select: (id: string) => void) { if (nodeId === draft.story.startNodeId) return; commit((next) => { delete next.story.nodes[nodeId]; delete next.layout[nodeId]; Object.values(next.story.nodes).forEach((node) => node.choices.forEach((choice) => { if (choice.nextNodeId === nodeId) { choice.nextNodeId = null; choice.ending = { id: `${choice.id}-ending`, title: "A New Ending", epilogueTemplate: "The timeline reaches its final edition." }; } })); }); select(draft.story.startNodeId); }
