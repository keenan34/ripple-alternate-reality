import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { CampaignIntro } from "@/components/campaign-intro";
import { HomeHero } from "@/components/home-hero";
import { StartStoryButton } from "@/components/start-story-button";

export default function HomePage() {
  return (
    <main id="main-content" className="fork-home">
      <HomeHero />

      <section id="how-it-works" className="fork-how" aria-labelledby="how-title">
        <div className="section-wrap">
          <header className="fork-how-head">
            <p className="fork-wire">How a campaign works</p>
            <h2 id="how-title">You get six decisions. History gets the rest.</h2>
          </header>
          <CampaignIntro />
        </div>
      </section>

      <section className="fork-cta" aria-labelledby="cta-title">
        <div className="section-wrap">
          <p className="fork-wire">Your move</p>
          <h2 id="cta-title">The record is written. Yours isn&rsquo;t.</h2>
          <div className="fork-cta-actions">
            <StartStoryButton storySlug="cp3-lakers" label="Start the campaign" />
            <Link href="/campaigns">
              See the other timelines <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
