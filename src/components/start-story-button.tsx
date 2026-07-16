"use client";

import { Play } from "lucide-react";
import { useRouter } from "next/navigation";

export function StartStoryButton({ storySlug, label = "Enter this timeline" }: { storySlug: string; label?: string }) {
  const router = useRouter();

  function start() {
    const sessionId = typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `local-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
    router.push(`/play/${sessionId}?story=${encodeURIComponent(storySlug)}`);
  }

  return (
    <button className="button button-primary" type="button" onClick={start}>
      <Play size={18} fill="currentColor" aria-hidden="true" />
      {label}
    </button>
  );
}
