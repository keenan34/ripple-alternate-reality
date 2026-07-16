import { ArrowLeft, RotateCcw } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ResultPoster } from "@/components/result-poster";
import { StartStoryButton } from "@/components/start-story-button";
import { StoryArtwork } from "@/components/story-artwork";
import { getSeedStory } from "@/content/seed-stories";
import {
  getDivergence,
  getPlausibility,
  getResultTitle,
  rebuildCompletedSession,
} from "@/lib/play/session";

type TimelinePageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ story?: string; choices?: string }>;
};

export const metadata: Metadata = {
  title: "Your Universe | RIPPLE",
  description: "A final edition from an alternate sports timeline.",
};

export default async function TimelinePage({ params, searchParams }: TimelinePageProps) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const story = query.story ? getSeedStory(query.story) : undefined;
  const choiceIds = query.choices?.split(".").filter(Boolean) ?? [];
  if (!story || !choiceIds.length || id.length > 100) notFound();

  const session = rebuildCompletedSession(story, id, choiceIds);
  if (!session) notFound();

  const plausibility = getPlausibility(session);
  const divergence = getDivergence(session);
  const resultTitle = session.ending?.title ?? getResultTitle(plausibility, divergence);

  return (
    <main id="main-content" className="result-page">
      <section className="result-hero">
        <StoryArtwork storyId={story.id} className="result-hero-art" />
        <div className="result-hero-scrim" aria-hidden="true" />
        <div className="result-masthead">
          <p className="wire-label">Final edition / Universe {id.slice(0, 8).toUpperCase()}</p>
          <h1>Your universe</h1>
          <p>{story.metadata.title}</p>
        </div>
        <div className="result-scoreboard">
          <div><span>Plausibility</span><strong>{plausibility}%</strong></div>
          <div><span>Timeline divergence</span><strong>{divergence}%</strong></div>
          <p>{resultTitle}</p>
        </div>
      </section>

      <section className="final-edition section-wrap" aria-labelledby="final-edition-title">
        <div className="section-heading-row">
          <div><p className="section-kicker">The record</p><h2 id="final-edition-title">How history changed</h2></div>
          <Link className="text-link" href={`/story/${story.slug}`}><ArrowLeft size={17} aria-hidden="true" />Read the original premise</Link>
        </div>
        <ol className="clipping-list">
          {session.decisions.map((decision, index) => (
            <li key={decision.choiceId} style={{ "--clip-index": index } as React.CSSProperties}>
              <div><span>{decision.year} / Your universe</span><span className={decision.tier}>{decision.tier}</span></div>
              <h3>{decision.headline}</h3>
              <p>{decision.verdict}</p>
            </li>
          ))}
        </ol>
        {session.ending ? (
          <article className="ending-editorial">
            <p className="section-kicker">Historian&apos;s final note</p>
            <h2>{session.ending.title}</h2>
            <p>{session.ending.epilogue}</p>
          </article>
        ) : null}
      </section>

      <div className="section-wrap"><ResultPoster story={story} session={session} /></div>

      <section className="result-actions-band">
        <div><p className="section-kicker">Another edition</p><h2>History is still taking calls.</h2></div>
        <div>
          <StartStoryButton storySlug={story.slug} label="Replay this story" />
          <Link className="button button-quiet" href="/stories"><RotateCcw size={18} aria-hidden="true" />Choose another timeline</Link>
        </div>
      </section>
    </main>
  );
}
