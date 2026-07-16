import { ArrowLeft, Clock3, GitFork, Newspaper, PenTool, Trophy } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { StartStoryButton } from "@/components/start-story-button";
import { StoryArtwork } from "@/components/story-artwork";
import { campaigns, getCampaignBySlug } from "@/content/campaigns";
import { seedStories } from "@/content/seed-stories";
import { getSeedStory } from "@/content/seed-stories";
import { getStoryStats } from "@/lib/stories/stats";

const campaignArt: Record<string, string> = {
  "war-room": "/campaign/war-room.png",
  "deadline-board": "/campaign/contract-table.png",
  "contract-table": "/campaign/contract-table.png",
  "playoff-tunnel": "/campaign/playoff-tunnel.png",
};

type StoryPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  const slugs = new Set([
    ...seedStories.map((story) => story.slug),
    ...campaigns.map((campaign) => campaign.storySlug),
  ]);
  return [...slugs].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: StoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const campaign = getCampaignBySlug(slug);
  if (campaign) return { title: `${campaign.title} | RIPPLE`, description: campaign.objective.description };
  const story = getSeedStory(slug);
  if (!story) return { title: "Story unavailable | RIPPLE" };
  return { title: `${story.metadata.title} | RIPPLE`, description: story.metadata.summary };
}

export default async function StoryPage({ params }: StoryPageProps) {
  const { slug } = await params;
  const campaign = getCampaignBySlug(slug);

  if (campaign) {
    return (
      <main id="main-content" className="clean-story-page">
        <section className="clean-story-hero">
          <Image src={campaignArt[campaign.hero.artKey]} alt="Basketball operations room overlooking an arena" fill priority sizes="100vw" />
          <div aria-hidden="true" />
          <article className="section-wrap">
            <Link className="clean-story-back" href="/"><ArrowLeft size={16} /> Home</Link>
            <p className="clean-eyebrow">{campaign.hero.eyebrow}</p>
            <h1>{campaign.hero.title.split("\n").map((line, index) => index === 0 ? line : <span key={line}><br />{line}</span>)}</h1>
            <p>{campaign.hero.tagline}</p>
            <StartStoryButton storySlug={campaign.storySlug} label="Start the campaign" />
          </article>
        </section>
        <section className="clean-story-details section-wrap" aria-label="Campaign details">
          <div><Clock3 /><span><small>Time</small><strong>15–25 minutes</strong></span></div>
          <div><GitFork /><span><small>Decisions</small><strong>{campaign.turns.length} turns</strong></span></div>
          <div><Trophy /><span><small>Endings</small><strong>{campaign.endings.length} profiles</strong></span></div>
          <div><Newspaper /><span><small>Progress</small><strong>Autosaves</strong></span></div>
        </section>
      </main>
    );
  }

  const story = getSeedStory(slug);
  if (!story) notFound();
  const stats = getStoryStats(story);

  return (
    <main id="main-content" className="story-page">
      <section className="story-detail-hero">
        <StoryArtwork storyId={story.id} className="story-detail-art" />
        <div className="story-detail-overlay" aria-hidden="true" />
        <div className="story-detail-copy">
          <Link className="back-link" href="/stories"><ArrowLeft size={17} aria-hidden="true" />Archive</Link>
          <p className="wire-label">{story.metadata.eyebrow}</p>
          <h1>{story.metadata.title}</h1>
          <p className="story-deck">{story.metadata.summary}</p>
          <StartStoryButton storySlug={story.slug} />
        </div>
      </section>

      <section className="story-brief section-wrap">
        <div className="story-brief-main">
          <p className="section-kicker">Reality file</p>
          <h2>Before the timeline splits</h2>
          <p className="baseline-copy">{story.metadata.historicalBaseline}</p>
          <div className="byline"><PenTool size={17} aria-hidden="true" />Written by {story.author.displayName}</div>
        </div>
        <aside className="story-facts" aria-label="Story play statistics">
          <h2>Edition statistics</h2>
          <dl>
            <div><Clock3 aria-hidden="true" /><dt>Estimated read</dt><dd>{stats.estimatedMinutes} minutes</dd></div>
            <div><GitFork aria-hidden="true" /><dt>Decision points</dt><dd>{stats.nodeCount}</dd></div>
            <div><Newspaper aria-hidden="true" /><dt>Possible calls</dt><dd>{stats.choiceCount}</dd></div>
            <div><Trophy aria-hidden="true" /><dt>Final outcomes</dt><dd>{stats.endingCount}</dd></div>
          </dl>
          <div className="tag-list" aria-label="Story tags">
            {story.metadata.tags.map((tag) => <span key={tag}>{tag}</span>)}
          </div>
        </aside>
      </section>

      <section className="story-cta-band">
        <div>
          <p className="section-kicker">The wire is waiting</p>
          <h2>Your first call changes everything after it.</h2>
        </div>
        <StartStoryButton storySlug={story.slug} label="Start this edition" />
      </section>
    </main>
  );
}
