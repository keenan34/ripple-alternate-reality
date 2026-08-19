import { Clock3 } from "lucide-react";
import Image from "next/image";

import { ForkBranch } from "@/components/fork-branch";
import { StartStoryButton } from "@/components/start-story-button";
import { cavsCampaign } from "@/content/cavs-campaign";

export function HomeHero() {
  return (
    <section className="fork-hero" aria-labelledby="home-title">
      <div className="fork-hero-inner section-wrap">
        <div className="fork-hero-main">
          <p className="fork-wire">From the record · NBA playoff wire · Orlando</p>
          <h1 id="home-title" className="fork-date">
            May 30, <span>2009</span>
          </h1>
          <div className="fork-split">
            <div className="fork-recorded">
              <span className="fork-tag">Recorded</span>
              <p>Orlando eliminates the 66-win Cavaliers in Game 6. LeBron walks off the floor without shaking a hand.</p>
            </div>
            <div className="fork-playable">
              <ForkBranch />
              <span className="fork-tag fork-tag-alt">Playable</span>
              <h2>{cavsCampaign.title}</h2>
              <p>Cleveland closes it out. LeBron gets Kobe in the Finals &mdash; and whether he stays is yours.</p>
              <div className="fork-hero-actions">
                <StartStoryButton storySlug={cavsCampaign.storySlug} label="Start the campaign" />
                <span><Clock3 size={14} aria-hidden="true" /> Six decisions &middot; 15&ndash;25 minutes</span>
              </div>
            </div>
          </div>
        </div>
        <figure className="fork-exhibit">
          <div>
            <Image src="/campaign/lebron-magic-2009.jpg" alt="LeBron James rising for a jump shot over a defender in Game 2 of the 2009 Eastern Conference Finals" fill sizes="(max-width: 1050px) 94vw, 26vw" priority />
          </div>
          <figcaption>Archive &middot; Game 2, the shot that only delayed it</figcaption>
        </figure>
      </div>
    </section>
  );
}
