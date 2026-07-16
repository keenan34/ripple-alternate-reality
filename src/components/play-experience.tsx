"use client";

import {
  ArrowRight,
  Check,
  History,
  ListTree,
  RotateCcw,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { StoryArtwork } from "./story-artwork";
import type { StoryDefinition } from "@/lib/stories/schema";
import {
  SESSION_STORAGE_PREFIX,
  advanceSession,
  buildTimelineHref,
  chooseInSession,
  createPlaySession,
  getDivergence,
  getPlausibility,
  getSessionChoices,
  restorePlaySession,
  type PlaySession,
} from "@/lib/play/session";
import { getNodePresentation, numericChange } from "@/lib/play/world";

type Drawer = "timeline" | "ledger" | null;

export function PlayExperience({ story, sessionId }: { story: StoryDefinition; sessionId: string }) {
  const router = useRouter();
  const [session, setSession] = useState<PlaySession>(() => createPlaySession(story, sessionId));
  const [hydrated, setHydrated] = useState(false);
  const [restored, setRestored] = useState(false);
  const [drawer, setDrawer] = useState<Drawer>(null);

  useEffect(() => {
    let cancelled = false;
    const saved = restorePlaySession(
      window.localStorage.getItem(`${SESSION_STORAGE_PREFIX}${sessionId}`),
      story,
      sessionId,
    );
    if (saved?.status === "completed") {
      router.replace(buildTimelineHref(saved));
      return () => {
        cancelled = true;
      };
    }
    queueMicrotask(() => {
      if (cancelled) return;
      if (saved) {
        setSession(saved);
        setRestored(saved.decisions.length > 0);
      }
      setHydrated(true);
    });
    return () => {
      cancelled = true;
    };
  }, [router, sessionId, story]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(`${SESSION_STORAGE_PREFIX}${sessionId}`, JSON.stringify(session));
  }, [hydrated, session, sessionId]);

  const node = story.nodes[session.currentNodeId];
  const pendingChoice = node.choices.find((choice) => choice.id === session.pendingChoiceId) ?? null;
  const pendingDecision = pendingChoice ? session.decisions.at(-1) ?? null : null;
  const availableChoices = getSessionChoices(session, story);
  const presentation = getNodePresentation(story, node, session.worldState);
  const divergence = getDivergence(session);
  const plausibility = getPlausibility(session);
  const totalRounds = useMemo(() => Math.max(...countRouteDepths(story)), [story]);
  const round = session.decisions.length + (pendingChoice ? 0 : 1);

  function choose(choiceId: string) {
    setRestored(false);
    setSession((current) => chooseInSession(current, story, choiceId));
  }

  function continueTimeline() {
    const next = advanceSession(session, story);
    setSession(next);
    if (next.status === "completed") {
      router.push(buildTimelineHref(next));
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function restart() {
    window.localStorage.removeItem(`${SESSION_STORAGE_PREFIX}${sessionId}`);
    setSession(createPlaySession(story, sessionId));
    setRestored(false);
  }

  if (!hydrated) {
    return <main id="main-content" className="loading-state"><span className="loading-mark">R</span><p>Restoring your universe...</p></main>;
  }

  const timelinePanel = (
    <div className="timeline-panel-content">
      <p className="rail-label"><ListTree size={16} aria-hidden="true" />Your timeline</p>
      <ol className="timeline-rail-list">
        {session.decisions.map((decision, index) => (
          <li className="complete" key={decision.choiceId}>
            <span><Check size={13} aria-hidden="true" /></span>
            <div><small>{decision.year} / Ripple {index + 1}</small><strong>{decision.headline}</strong></div>
          </li>
        ))}
        <li className="current">
            <span>{session.decisions.length + 1}</span>
          <div><small>{node.year} / On the wire</small><strong>{pendingDecision?.headline ?? presentation.question}</strong></div>
        </li>
      </ol>
    </div>
  );

  const ledgerPanel = (
    <div className="ledger-panel-content">
      <p className="rail-label"><History size={16} aria-hidden="true" />Universe ledger</p>
      <dl className="live-scores">
        <div><dt>Plausibility</dt><dd>{plausibility}%</dd></div>
        <div><dt>Divergence</dt><dd>{divergence}%</dd></div>
      </dl>
      <div className="ledger-meter"><span style={{ width: `${divergence}%` }} /></div>
      <div className="world-axis-list" aria-label="World state metrics">
        {story.scoring.metrics
          .filter((metric) => !["plausibility", "divergence-total"].includes(metric.key))
          .map((metric) => (
            <div key={metric.key}>
              <span>{metric.label}</span>
              <strong>{session.worldState.metrics[metric.key]}</strong>
              <i style={{ width: `${normalizeMetric(session.worldState.metrics[metric.key], metric.minimum, metric.maximum)}%` }} />
            </div>
          ))}
      </div>
      <div className="relationship-list" aria-label="World relationships">
        <span>Relationships</span>
        {story.world.relationships.map((relationship) => (
          <div key={relationship.key}>
            <span>{relationship.label}</span>
            <strong>{session.worldState.relationships[relationship.key]}/100</strong>
          </div>
        ))}
      </div>
      <p className="ledger-baseline"><span>Original fact</span>{story.metadata.historicalBaseline}</p>
      {session.worldState.timelineFacts.length ? (
        <div className="ledger-changes">
          <span>Facts rewritten</span>
          {session.worldState.timelineFacts.map((fact) => <p className={fact.source} key={fact.id}>{fact.headline}</p>)}
        </div>
      ) : <p className="ledger-empty">Your first call will appear here.</p>}
    </div>
  );

  return (
    <main id="main-content" className="play-page">
      <div className="play-status-bar">
        <span>Ripple {Math.min(round, totalRounds)} of {totalRounds}</span>
        <strong>{story.metadata.title}</strong>
        <button type="button" onClick={restart} title="Restart timeline"><RotateCcw size={17} aria-hidden="true" /><span>Restart</span></button>
      </div>

      {restored ? <div className="resume-banner" role="status"><Check size={16} aria-hidden="true" />Saved universe restored at Ripple {round}.</div> : null}

      <div className="mobile-play-tools">
        <button type="button" aria-expanded={drawer === "timeline"} onClick={() => setDrawer("timeline")}><ListTree size={18} aria-hidden="true" />Timeline</button>
        <span>Drift {divergence}%</span>
        <button type="button" aria-expanded={drawer === "ledger"} onClick={() => setDrawer("ledger")}><History size={18} aria-hidden="true" />Ledger</button>
      </div>

      <div className="play-layout">
        <aside className="play-rail timeline-rail" aria-label="Playthrough timeline">{timelinePanel}</aside>

        <article className="event-desk">
          <header className="wire-bulletin">
            <span>Wire bulletin</span>
            <p>{presentation.wire}</p>
          </header>

          <figure className="event-visual">
            <StoryArtwork storyId={story.id} />
            <figcaption>{node.presentation.assetKey?.replaceAll("-", " ")}</figcaption>
          </figure>

          <div className="reality-split">
            <div><span>Our universe</span><p>{node.historicalContext}</p></div>
            {presentation.roster ? (
              <div><span>{presentation.roster.label}</span><p>{presentation.roster.players.join(" / ")}</p></div>
            ) : (
              <div><span>Your universe</span><p>{session.decisions.at(-1)?.headline ?? "The timeline is waiting for its first correction."}</p></div>
            )}
          </div>

          <section className="decision-desk" aria-labelledby="decision-question">
            <p className="section-kicker">The next call</p>
            <h1 id="decision-question">{presentation.question}</h1>
            <div className="choice-list">
              {availableChoices.map((choice, index) => (
                <button
                  type="button"
                  className={choice.id === session.pendingChoiceId ? "selected" : ""}
                  disabled={Boolean(session.pendingChoiceId)}
                  onClick={() => choose(choice.id)}
                  key={choice.id}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{choice.label}</strong>
                  <ArrowRight size={20} aria-hidden="true" />
                </button>
              ))}
            </div>
          </section>

          {pendingChoice && pendingDecision ? (
            <section className="verdict-panel" aria-live="polite">
              <div className="verdict-heading"><span className={`verdict-stamp ${pendingDecision.tier}`}>{pendingDecision.stamp}</span><span>{pendingDecision.tier}</span></div>
              <h2>{pendingDecision.headline}</h2>
              <p>{pendingDecision.verdict}</p>
              <div className="consequence-summary">
                <span>Immediate consequences</span>
                <ul>
                  {pendingDecision.consequences.map((consequence) => {
                    const change = numericChange(consequence);
                    return (
                      <li key={`${consequence.scope}-${consequence.key}`}>
                        <span>{consequence.label}</span>
                        <strong className={change !== null && change < 0 ? "negative" : "positive"}>
                          {change === null ? `${formatState(consequence.before)} → ${formatState(consequence.after)}` : `${change > 0 ? "+" : ""}${change}`}
                        </strong>
                      </li>
                    );
                  })}
                </ul>
              </div>
              {pendingDecision.triggeredEvent ? (
                <aside className="seeded-event">
                  <span>Elsewhere on the wire / Seeded event</span>
                  <h3>{pendingDecision.triggeredEvent.headline}</h3>
                  <p>{pendingDecision.triggeredEvent.detail}</p>
                </aside>
              ) : null}
              <button className="button button-primary" type="button" onClick={continueTimeline}>
                {pendingChoice.nextNodeId ? "Next ripple" : "Read the final edition"}<ArrowRight size={18} aria-hidden="true" />
              </button>
            </section>
          ) : null}
        </article>

        <aside className="play-rail universe-rail" aria-label="Universe ledger">{ledgerPanel}</aside>
      </div>

      {drawer ? (
        <div className="drawer-backdrop" role="presentation" onMouseDown={() => setDrawer(null)}>
          <aside className="mobile-drawer" aria-label={drawer === "timeline" ? "Playthrough timeline" : "Universe ledger"} onMouseDown={(event) => event.stopPropagation()}>
            <button className="drawer-close" type="button" onClick={() => setDrawer(null)} aria-label="Close panel"><X size={20} aria-hidden="true" /></button>
            {drawer === "timeline" ? timelinePanel : ledgerPanel}
          </aside>
        </div>
      ) : null}
    </main>
  );
}

function normalizeMetric(value: number, minimum: number, maximum: number) {
  if (maximum === minimum) return 0;
  return Math.max(0, Math.min(100, Math.round(((value - minimum) / (maximum - minimum)) * 100)));
}

function formatState(value: string | number | boolean) {
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value).replaceAll("-", " ");
}

function countRouteDepths(story: StoryDefinition) {
  const depths: number[] = [];
  function walk(nodeId: string, depth: number, visited: Set<string>) {
    if (visited.has(nodeId)) return;
    const node = story.nodes[nodeId];
    if (!node) return;
    const nextVisited = new Set(visited).add(nodeId);
    for (const choice of node.choices) {
      if (choice.nextNodeId === null) depths.push(depth);
      else walk(choice.nextNodeId, depth + 1, nextVisited);
    }
  }
  walk(story.startNodeId, 1, new Set());
  return depths.length ? depths : [1];
}
