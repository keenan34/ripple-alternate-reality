import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { ForkBranch } from "@/components/fork-branch";
import { LedgerReveal } from "@/components/ledger-reveal";
import { StartStoryButton } from "@/components/start-story-button";
import { getCampaignBySlug } from "@/content/campaigns";

export const metadata: Metadata = {
  title: "RIPPLE | The Other Timelines",
  description: "Three divergence points from the NBA record, each playable as a six-decision front-office campaign.",
};

const entries = [
  {
    slug: "kd-stays",
    date: "Jul 4, 2016",
    city: "Oklahoma City",
    recorded: "Durant announces for Golden State. The Warriors win the next two titles.",
    alternate: "The letter never posts. Durant re-signs, and the front office is yours.",
    art: "/campaign/durant-warriors.jpg",
  },
  {
    slug: "rose-never-hurt",
    date: "Apr 28, 2012",
    city: "Chicago",
    recorded: "Derrick Rose tears his left ACL in Game 1 against Philadelphia. The MVP era stalls at 23.",
    alternate: "The knee holds. Rose stays on the floor, and Chicago's front office is yours.",
    art: "/campaign/rose-down.jpg",
  },
  {
    slug: "darko-decision",
    date: "Jun 26, 2003",
    city: "Detroit",
    recorded: "The Pistons take Darko Milicic at No. 2. Anthony, Bosh, and Wade go with the next three picks.",
    alternate: "Detroit reads the board differently. The second pick is yours.",
    art: "/campaign/darko-pistons.jpg",
  },
];

export default function CampaignsPage() {
  return (
    <main id="main-content" className="fork-home">
      <LedgerReveal />
      <section className="fork-ledger section-wrap" aria-labelledby="ledger-title">
        <header className="fork-ledger-head">
          <p className="fork-wire">The open files</p>
          <h1 id="ledger-title">Three more days the league turned.</h1>
          <p>Los Angeles holds the front page. These files are still open &mdash; pick a divergence point and run it.</p>
        </header>
        <ol className="fork-ledger-list">
          {entries.map((entry) => {
            const campaign = getCampaignBySlug(entry.slug);
            if (!campaign) return null;
            return (
              <li className="fork-moment" key={entry.slug}>
                <div className="fork-moment-main">
                  <p className="fork-moment-date">
                    {entry.date} <span>{entry.city}</span>
                  </p>
                  <p className="fork-recorded-line">
                    <span className="fork-tag">Recorded</span>
                    {entry.recorded}
                  </p>
                  <div className="fork-playable fork-moment-playable">
                    <ForkBranch />
                    <span className="fork-tag fork-tag-alt">Playable</span>
                    <h2>{campaign.title}</h2>
                    <p>{entry.alternate}</p>
                    <div className="fork-moment-actions">
                      <StartStoryButton storySlug={campaign.storySlug} label="Start the campaign" />
                      <Link href={`/story/${campaign.storySlug}`}>
                        Read the premise <ArrowRight size={15} aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="fork-moment-art">
                  <Image src={entry.art} alt="" fill sizes="(max-width: 900px) 100vw, 34vw" />
                </div>
              </li>
            );
          })}
        </ol>
      </section>
    </main>
  );
}
