import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main-content" className="not-found-state">
      <p className="wire-label">404 / Edition missing</p>
      <h1>This timeline never made the presses.</h1>
      <p>The story may have moved, been archived, or never existed in this universe.</p>
      <Link className="button button-primary" href="/"><ArrowLeft size={18} aria-hidden="true" />Return to campaign HQ</Link>
    </main>
  );
}
