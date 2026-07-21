import { Clock3 } from "lucide-react";
import Image from "next/image";

import { ForkBranch } from "@/components/fork-branch";
import { StartStoryButton } from "@/components/start-story-button";
import { lakersCampaign } from "@/content/lakers-campaign";

export function HomeHero() {
  return (
    <section className="fork-hero" aria-labelledby="home-title">
      <div className="fork-hero-inner section-wrap">
        <div className="fork-hero-main">
          <p className="fork-wire">From the record · NBA trade wire · New York</p>
          <h1 id="home-title" className="fork-date">
            December 8, <span>2011</span>
          </h1>
          <div className="fork-split">
            <div className="fork-recorded">
              <span className="fork-tag">Recorded</span>
              <p>David Stern vetoes the three-team Chris Paul trade for &ldquo;basketball reasons.&rdquo; CP3 never wears the purple and gold.</p>
            </div>
            <div className="fork-playable">
              <ForkBranch />
              <span className="fork-tag fork-tag-alt">Playable</span>
              <h2>{lakersCampaign.title}</h2>
              <p>The veto never comes. Chris Paul is a Laker &mdash; and every ripple after it is yours to call.</p>
              <div className="fork-hero-actions">
                <StartStoryButton storySlug={lakersCampaign.storySlug} label="Start the campaign" />
                <span><Clock3 size={14} aria-hidden="true" /> Six decisions &middot; 15&ndash;25 minutes</span>
              </div>
            </div>
          </div>
        </div>
        <figure className="fork-exhibit">
          <div>
            <Image src="/campaign/cp3-lakers.webp" alt="Chris Paul bringing the ball up the floor in a Clippers uniform" fill sizes="(max-width: 1050px) 94vw, 26vw" priority />
          </div>
          <figcaption>Archive &middot; The Clipper detour after the veto</figcaption>
        </figure>
      </div>
    </section>
  );
}
