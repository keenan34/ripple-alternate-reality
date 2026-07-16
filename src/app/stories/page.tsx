import { Archive, ArrowRight, Clock3, GitBranch, LockKeyhole } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { StartStoryButton } from "@/components/start-story-button";
import { campaigns } from "@/content/campaigns";
import { seedStories } from "@/content/seed-stories";

export const metadata: Metadata = {
  title: "Current Campaigns | RIPPLE",
  description: "Enter RIPPLE's playable alternate-history campaigns.",
};

const campaignArt: Record<string, string> = {
  "war-room": "/campaign/war-room.png",
  "deadline-board": "/campaign/contract-table.png",
  "contract-table": "/campaign/contract-table.png",
  "playoff-tunnel": "/campaign/playoff-tunnel.png",
};

export default function StoriesPage() {
  const campaignSlugs = new Set(campaigns.map((campaign) => campaign.storySlug));
  const archivedCount = seedStories.filter((story) => !campaignSlugs.has(story.slug)).length;

  return (
    <main id="main-content" className="campaign-index-page">
      <header className="campaign-index-head section-wrap">
        <p className="section-kicker">Playable now</p>
        <h1>{campaigns.length === 1 ? "One campaign." : `${campaigns.length} campaigns.`}<br />Every consequence.</h1>
        <p>RIPPLE is focused on complete, replayable front-office simulations. Earlier story prototypes have been moved out of public rotation while they are rebuilt.</p>
      </header>

      {campaigns.map((campaign, index) => (
        <section className="current-campaign section-wrap" aria-labelledby={`campaign-title-${campaign.id}`} key={campaign.id}>
          <div className="current-campaign-image">
            <Image src={campaignArt[campaign.hero.artKey]} alt="Basketball operations room overlooking an arena" fill priority={index === 0} sizes="(max-width: 800px) 100vw, 55vw" />
            <span>{campaign.hero.eyebrow}</span>
          </div>
          <article>
            <p className="section-kicker">{campaign.turns[0].date}</p>
            <h2 id={`campaign-title-${campaign.id}`}>{campaign.turns[0].headline}</h2>
            <p>{campaign.objective.description}</p>
            <dl>
              <div><Clock3 size={16} /><dt>Length</dt><dd>15–25 minutes</dd></div>
              <div><GitBranch size={16} /><dt>Structure</dt><dd>{campaign.turns.length} major decisions</dd></div>
              <div><LockKeyhole size={16} /><dt>Progress</dt><dd>Local autosave</dd></div>
            </dl>
            <div className="current-campaign-actions">
              <StartStoryButton storySlug={campaign.storySlug} label="Enter the war room" />
              <Link className="button button-quiet" href={`/story/${campaign.storySlug}`}>Read the premise <ArrowRight size={17} /></Link>
            </div>
          </article>
        </section>
      ))}

      <aside className="archive-notice section-wrap">
        <Archive size={22} />
        <div><strong>{archivedCount} prototype stories archived</strong><p>The earlier branching editions are preserved in the project, but removed from public discovery until they meet the campaign standard.</p></div>
        <span>Not currently playable</span>
      </aside>
    </main>
  );
}
