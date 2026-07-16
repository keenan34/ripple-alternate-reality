import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { StoryArtwork } from "./story-artwork";
import { getStoryStats } from "@/lib/stories/stats";
import type { StoryDefinition } from "@/lib/stories/schema";

export function StoryList({ stories }: { stories: StoryDefinition[] }) {
  return (
    <ol className="story-list">
      {stories.map((story, index) => {
        const stats = getStoryStats(story);
        return (
          <li key={story.id}>
            <Link href={`/story/${story.slug}`}>
              <span className="story-index">{String(index + 1).padStart(2, "0")}</span>
              <span className="story-thumb">
                <StoryArtwork storyId={story.id} />
              </span>
              <span className="story-list-copy">
                <span className="wire-label">{story.metadata.eyebrow}</span>
                <strong>{story.metadata.title}</strong>
                <span>{story.metadata.summary}</span>
              </span>
              <span className="story-list-meta">
                {stats.maximumRounds} ripples / {stats.estimatedMinutes} min
                <ArrowUpRight size={22} aria-hidden="true" />
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
