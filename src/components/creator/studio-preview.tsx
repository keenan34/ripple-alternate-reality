"use client";

import { ArrowRight, RotateCcw, X } from "lucide-react";
import { useState } from "react";

import {
  advanceSession,
  chooseInSession,
  createPlaySession,
  getSessionChoices,
  type PlaySession,
} from "@/lib/play/session";
import type { StoryDefinition } from "@/lib/stories/schema";

export function StudioPreview({ story, onClose }: { story: StoryDefinition; onClose: () => void }) {
  const [session, setSession] = useState<PlaySession>(() => createPlaySession(story, `preview-${Date.now()}`));
  const node = story.nodes[session.currentNodeId];
  const lastDecision = session.decisions.at(-1);

  function reset() {
    setSession(createPlaySession(story, `preview-${Date.now()}`));
  }

  return (
    <div className="preview-overlay" role="dialog" aria-modal="true" aria-label="Story preview">
      <header className="preview-toolbar">
        <div><span>PREVIEW MODE</span><strong>{story.metadata.title}</strong></div>
        <div>
          <button className="icon-action" type="button" title="Restart preview" aria-label="Restart preview" onClick={reset}><RotateCcw size={18} /></button>
          <button className="icon-action" type="button" title="Close preview" aria-label="Close preview" onClick={onClose}><X size={20} /></button>
        </div>
      </header>
      <main className="preview-stage">
        {session.status === "completed" && session.ending ? (
          <article className="preview-ending">
            <p className="section-kicker">Final edition</p>
            <h1>{session.ending.title}</h1>
            <p>{session.ending.epilogue}</p>
            <div className="preview-decision-count">{session.decisions.length} decisions shaped this timeline</div>
            <button className="button button-primary" type="button" onClick={reset}><RotateCcw size={17} /> Play another route</button>
          </article>
        ) : session.pendingChoiceId && lastDecision ? (
          <article className="preview-result">
            <p className="preview-stamp">{lastDecision.stamp}</p>
            <h1>{lastDecision.headline}</h1>
            <p>{lastDecision.verdict}</p>
            <button className="button button-primary" type="button" onClick={() => setSession(advanceSession(session, story))}>
              Continue <ArrowRight size={17} />
            </button>
          </article>
        ) : (
          <article className="preview-decision">
            <div className="preview-year">{node.year}</div>
            <p className="wire-label">News wire</p>
            <h1>{node.wire}</h1>
            <p className="preview-context"><strong>Historical baseline</strong>{node.historicalContext}</p>
            <h2>{node.question}</h2>
            <div className="preview-choices">
              {getSessionChoices(session, story).map((choice, index) => (
                <button type="button" key={choice.id} onClick={() => setSession(chooseInSession(session, story, choice.id))}>
                  <span>{String(index + 1).padStart(2, "0")}</span>{choice.label}<ArrowRight size={17} />
                </button>
              ))}
            </div>
          </article>
        )}
      </main>
    </div>
  );
}
