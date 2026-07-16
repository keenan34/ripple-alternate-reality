import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PlayExperience } from "@/components/play-experience";
import { CampaignExperience } from "@/components/campaign/campaign-experience";
import { getCampaignBySlug } from "@/content/campaigns";
import { getSeedStory } from "@/content/seed-stories";

type PlayPageProps = {
  params: Promise<{ sessionId: string }>;
  searchParams: Promise<{ story?: string; mode?: string }>;
};

export const metadata: Metadata = {
  title: "Live Timeline | RIPPLE",
  description: "Make the call and follow the consequences through sports history.",
};

export default async function PlayPage({ params, searchParams }: PlayPageProps) {
  const [{ sessionId }, query] = await Promise.all([params, searchParams]);
  if (!sessionId || sessionId.length > 100) notFound();
  const campaign = getCampaignBySlug(query.story);
  if (campaign && query.mode !== "classic") {
    return <CampaignExperience campaign={campaign} sessionId={sessionId} />;
  }
  const story = query.story ? getSeedStory(query.story) : undefined;
  if (!story) notFound();
  return <PlayExperience story={story} sessionId={sessionId} />;
}
