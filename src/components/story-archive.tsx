"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";

import { StoryList } from "./story-list";
import type { StoryDefinition } from "@/lib/stories/schema";

const eras = ["all", "1980s", "2000s", "2010s"] as const;

export function StoryArchive({ stories }: { stories: StoryDefinition[] }) {
  const [query, setQuery] = useState("");
  const [era, setEra] = useState<(typeof eras)[number]>("all");

  const filteredStories = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return stories.filter((story) => {
      const matchesEra = era === "all" || story.metadata.tags.includes(era);
      const haystack = [
        story.metadata.title,
        story.metadata.summary,
        story.metadata.eyebrow,
        ...story.metadata.tags,
      ].join(" ").toLowerCase();
      return matchesEra && (!normalized || haystack.includes(normalized));
    });
  }, [era, query, stories]);

  return (
    <div className="archive-browser">
      <div className="archive-tools">
        <label className="search-field">
          <Search size={19} aria-hidden="true" />
          <span className="sr-only">Search stories</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search players, teams, or turning points"
          />
          {query ? (
            <button type="button" onClick={() => setQuery("")} aria-label="Clear search">
              <X size={17} aria-hidden="true" />
            </button>
          ) : null}
        </label>
        <div className="era-filter" aria-label="Filter stories by era">
          <SlidersHorizontal size={18} aria-hidden="true" />
          {eras.map((value) => (
            <button
              type="button"
              className={value === era ? "active" : ""}
              aria-pressed={value === era}
              onClick={() => setEra(value)}
              key={value}
            >
              {value === "all" ? "All eras" : value}
            </button>
          ))}
        </div>
      </div>

      <div className="archive-count" aria-live="polite">
        <span>{filteredStories.length} editions found</span>
        <span>Sorted by editorial date</span>
      </div>

      {filteredStories.length ? (
        <StoryList stories={filteredStories} />
      ) : (
        <div className="empty-state">
          <NewspaperEmpty />
          <h2>No edition matches that search.</h2>
          <p>Try another player, team, or era.</p>
          <button className="button button-quiet" type="button" onClick={() => { setQuery(""); setEra("all"); }}>
            Reset archive
          </button>
        </div>
      )}
    </div>
  );
}

function NewspaperEmpty() {
  return (
    <span className="empty-paper" aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
  );
}
