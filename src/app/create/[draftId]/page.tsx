import type { Metadata } from "next";

import { CreatorStudio } from "@/components/creator/creator-studio";

export const metadata: Metadata = { title: "Edit Story | RIPPLE Creator" };

export default async function CreatorDraftPage({ params }: { params: Promise<{ draftId: string }> }) {
  const { draftId } = await params;
  return <CreatorStudio draftId={draftId} />;
}
