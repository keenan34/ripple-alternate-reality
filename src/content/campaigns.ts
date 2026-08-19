import type { CampaignDefinition } from "@/lib/campaign/schema";
import { cavsCampaign } from "./cavs-campaign";
import { durantCampaign } from "./durant-campaign";
import { lakersCampaign } from "./lakers-campaign";
import { pistonsCampaign } from "./pistons-campaign";
import { roseCampaign } from "./rose-campaign";

export const campaigns: CampaignDefinition[] = [cavsCampaign, lakersCampaign, durantCampaign, pistonsCampaign, roseCampaign];

export function getCampaignBySlug(slug: string | undefined) {
  if (!slug) return undefined;
  return campaigns.find((campaign) => campaign.storySlug === slug);
}
