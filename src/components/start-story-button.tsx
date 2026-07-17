import { Play } from "lucide-react";
import Link from "next/link";

export function StartStoryButton({ storySlug, label = "Enter this timeline" }: { storySlug: string; label?: string }) {
  return (
    <Link className="button button-primary" href={`/play/new?story=${encodeURIComponent(storySlug)}`}>
      <Play size={18} fill="currentColor" aria-hidden="true" />
      {label}
    </Link>
  );
}
