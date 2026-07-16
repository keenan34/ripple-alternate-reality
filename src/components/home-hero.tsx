import { ArrowDown, Clock3 } from "lucide-react";
import Image from "next/image";

import { StartStoryButton } from "@/components/start-story-button";
import { durantCampaign } from "@/content/durant-campaign";

export function HomeHero() {
  return (
    <section className="clean-hero" aria-labelledby="home-title">
      <Image src="/campaign/war-room.png" alt="Basketball operations room overlooking an arena" fill priority sizes="100vw" />
      <div className="clean-hero-overlay" aria-hidden="true" />
      <div className="clean-hero-content section-wrap">
        <p className="clean-eyebrow"><span>Playable campaign</span> Oklahoma City · 2016</p>
        <h1 id="home-title">Durant stayed.<br />What happens next?</h1>
        <p>You run the front office. Six decisions. One alternate history.</p>
        <div className="clean-hero-action">
          <StartStoryButton storySlug={durantCampaign.storySlug} label="Start the campaign" />
          <span><Clock3 size={15} /> 15–25 minutes</span>
        </div>
      </div>
      <a className="clean-scroll" href="#how-it-works"><span>See how it works</span><ArrowDown size={16} /></a>
    </section>
  );
}
