import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { CampaignIntro } from "@/components/campaign-intro";
import { HomeHero } from "@/components/home-hero";
import { StartStoryButton } from "@/components/start-story-button";
import { campaigns } from "@/content/campaigns";

const campaignArt: Record<string, string> = {
  "war-room": "/campaign/war-room.png",
  "deadline-board": "/campaign/contract-table.png",
  "contract-table": "/campaign/contract-table.png",
  "playoff-tunnel": "/campaign/playoff-tunnel.png",
};

export default function HomePage() {
  return (
    <main id="main-content" className="clean-home">
      <HomeHero />

      <section className="clean-campaigns section-wrap" aria-labelledby="campaigns-title">
        <header>
          <p className="clean-eyebrow">Playable now</p>
          <h2 id="campaigns-title">Choose your timeline.</h2>
        </header>
        <div className="clean-campaign-grid">
          {campaigns.map((campaign) => (
            <article key={campaign.id}>
              <div className="clean-campaign-art">
                <Image src={campaignArt[campaign.hero.artKey]} alt="" fill sizes="(max-width: 760px) 100vw, 40vw" />
                <span>{campaign.hero.eyebrow}</span>
              </div>
              <div className="clean-campaign-body">
                <h3>{campaign.hero.title.split("\n").map((line, index) => index === 0 ? line : <span key={line}><br />{line}</span>)}</h3>
                <p>{campaign.hero.tagline}</p>
                <div className="clean-campaign-actions">
                  <StartStoryButton storySlug={campaign.storySlug} label="Start the campaign" />
                  <Link href={`/story/${campaign.storySlug}`}>The premise <ArrowRight size={15} /></Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="clean-how section-wrap" aria-labelledby="how-title">
        <header>
          <p className="clean-eyebrow">How it works</p>
          <h2 id="how-title">One decision at a time.</h2>
        </header>
        <CampaignIntro />
      </section>

    </main>
  );
}
