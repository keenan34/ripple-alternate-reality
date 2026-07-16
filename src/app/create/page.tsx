import type { Metadata } from "next";

import { CreatorDashboard } from "@/components/creator/creator-dashboard";
import { seedStories } from "@/content/seed-stories";

export const metadata: Metadata = {
  title: "Creator Studio | RIPPLE",
  description: "Build and publish an interactive alternate sports history.",
};

export default function CreatePage() {
  const remixSources = seedStories.map((story) => ({
    story,
    title: story.metadata.title,
    author: story.author.displayName,
  }));
  return <CreatorDashboard remixSources={remixSources} />;
}
