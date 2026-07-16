"use client";

import { BookCopy, Clock3, FilePlus2, GitFork, LockKeyhole, PenLine, Plus, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import type { StoryDefinition } from "@/lib/stories/schema";
import {
  cloneDraft,
  createNextVersion,
  createStarterDraft,
  draftFromPublishedStory,
  loadDrafts,
  saveDraft,
  type CreatorDraft,
} from "@/lib/creator/drafts";

type RemixSource = { story: StoryDefinition; title: string; author: string };

export function CreatorDashboard({ remixSources }: { remixSources: RemixSource[] }) {
  const [drafts, setDrafts] = useState<CreatorDraft[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Browser storage is only available after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDrafts(loadDrafts(localStorage));
    setReady(true);
  }, []);

  function openNew(draft: CreatorDraft) {
    saveDraft(localStorage, draft);
    window.location.assign(`/create/${draft.id}`);
  }

  function duplicate(draft: CreatorDraft) {
    openNew(cloneDraft(draft, "duplicate"));
  }

  return (
    <main id="main-content" className="creator-home">
      <header className="creator-home-head section-wrap">
        <div>
          <p className="section-kicker">RIPPLE newsroom tools</p>
          <h1>Creator Studio</h1>
          <p>Write the premise, map every decision, test the consequences, and publish a versioned interactive story.</p>
        </div>
        <button className="button button-primary" type="button" onClick={() => openNew(createStarterDraft())}>
          <Plus size={18} aria-hidden="true" /> New story
        </button>
      </header>

      <section className="creator-dashboard section-wrap" aria-labelledby="your-work-heading">
        <div className="creator-section-head">
          <div>
            <p className="wire-label">Local workspace</p>
            <h2 id="your-work-heading">Your stories</h2>
          </div>
          <span><Clock3 size={15} aria-hidden="true" /> Autosaved in this browser</span>
        </div>

        {!ready ? <div className="creator-empty">Opening your newsroom…</div> : drafts.length ? (
          <div className="draft-table" role="list">
            {drafts.map((draft) => (
              <article className="draft-row" role="listitem" key={draft.id}>
                <div className="draft-status" data-status={draft.story.status}>{draft.story.status.replace("-", " ")}</div>
                <div className="draft-title">
                  <h3>{draft.story.metadata.title}</h3>
                  <p>Version {draft.story.version} · Updated {formatTime(draft.updatedAt)}</p>
                  {draft.source ? <small><GitFork size={13} /> {draft.source.kind} of {draft.source.title} by {draft.source.author}</small> : null}
                </div>
                <div className="draft-actions">
                  {draft.story.status === "published" || draft.story.status === "archived" ? (
                    <>
                      <span className="locked-label"><LockKeyhole size={14} /> Immutable</span>
                      <button className="icon-action" type="button" title="Create next version" aria-label={`Create next version of ${draft.story.metadata.title}`} onClick={() => openNew(createNextVersion(draft))}>
                        <FilePlus2 size={18} />
                      </button>
                    </>
                  ) : (
                    <Link className="button button-quiet compact-button" href={`/create/${draft.id}`}>
                      <PenLine size={16} /> Continue
                    </Link>
                  )}
                  <button className="icon-action" type="button" title="Duplicate story" aria-label={`Duplicate ${draft.story.metadata.title}`} onClick={() => duplicate(draft)}>
                    <BookCopy size={18} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="creator-empty">
            <FilePlus2 size={28} aria-hidden="true" />
            <h3>Your desk is clear.</h3>
            <p>Start with a guided story that is ready to edit and preview.</p>
            <button className="button button-quiet" type="button" onClick={() => openNew(createStarterDraft())}>Create first story</button>
          </div>
        )}
      </section>

      <section className="remix-band" aria-labelledby="remix-heading">
        <div className="section-wrap">
          <div className="creator-section-head">
            <div><p className="wire-label">Start from the archive</p><h2 id="remix-heading">Remix a published timeline</h2></div>
            <span><Sparkles size={15} /> Attribution included</span>
          </div>
          <div className="remix-grid">
            {remixSources.map(({ story, title, author }) => (
              <article className="remix-item" key={story.id}>
                <p>{story.metadata.eyebrow}</p>
                <h3>{title}</h3>
                <span>By {author} · {Object.keys(story.nodes).length} decision points</span>
                <button className="button button-quiet" type="button" onClick={() => openNew(draftFromPublishedStory(story))}>
                  <GitFork size={16} /> Remix
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(value));
}
