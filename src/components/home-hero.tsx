import { Clock3 } from "lucide-react";
import Image from "next/image";

import { ForkBranch } from "@/components/fork-branch";
import { StartStoryButton } from "@/components/start-story-button";
import { roseCampaign } from "@/content/rose-campaign";

export function HomeHero() {
  return (
    <section className="fork-hero" aria-labelledby="home-title">
      <div className="fork-hero-inner section-wrap">
        <div className="fork-hero-main">
          <p className="fork-wire">From the record · NBA playoffs · Chicago</p>
          <h1 id="home-title" className="fork-date">
            April 28, <span>2012</span>
          </h1>
          <div className="fork-split">
            <div className="fork-recorded">
              <span className="fork-tag">Recorded</span>
              <p>Derrick Rose tears his left ACL in Game 1 against Philadelphia. The MVP era stalls at 23.</p>
            </div>
            <div className="fork-playable">
              <ForkBranch />
              <span className="fork-tag fork-tag-alt">Playable</span>
              <p>The knee holds. Rose stays on the floor &mdash; and Chicago&rsquo;s front office is yours.</p>
              <div className="fork-hero-actions">
                <StartStoryButton storySlug={roseCampaign.storySlug} label="Start the campaign" />
                <span><Clock3 size={14} aria-hidden="true" /> Six decisions &middot; 15&ndash;25 minutes</span>
              </div>
            </div>
          </div>
        </div>
        <figure className="fork-exhibit">
          <div>
            <Image src="/campaign/rose-down.jpg" alt="Derrick Rose lying on the court after his injury" fill sizes="(max-width: 1050px) 94vw, 26vw" priority />
          </div>
          <figcaption>Archive &middot; Game 1, United Center</figcaption>
        </figure>
      </div>
    </section>
  );
}
