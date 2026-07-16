"use client";

import { RefreshCw } from "lucide-react";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main id="main-content" className="not-found-state">
      <p className="wire-label">Press interruption</p>
      <h1>The edition failed at the printer.</h1>
      <p>Your saved playthrough has not been removed. Reload this page to try the press again.</p>
      <button className="button button-primary" type="button" onClick={reset}><RefreshCw size={18} aria-hidden="true" />Try again</button>
    </main>
  );
}
