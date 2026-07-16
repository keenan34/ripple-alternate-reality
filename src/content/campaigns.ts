import type { CampaignDefinition } from "@/lib/campaign/schema";
import { durantCampaign } from "./durant-campaign";
import { pistonsCampaign } from "./pistons-campaign";
import { roseCampaign } from "./rose-campaign";

export const campaigns: CampaignDefinition[] = [durantCampaign, pistonsCampaign, roseCampaign];

export function getCampaignBySlug(slug: string | undefined) {
  if (!slug) return undefined;
  return campaigns.find((campaign) => campaign.storySlug === slug);
}
