import { ArrowUpRight, BookOpen } from "lucide-react";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="site-brand" href="/" aria-label="RIPPLE home">
        <span className="site-brand-mark" aria-hidden="true">R</span>
        <span>RIPPLE<small>Alternate history, under pressure</small></span>
      </Link>
      <nav aria-label="Primary navigation">
        <Link href="/#how-it-works" aria-label="How to play"><BookOpen size={16} aria-hidden="true" /><span>How to play</span></Link>
        <Link href="/story/kd-stays" aria-label="Campaign"><ArrowUpRight size={16} aria-hidden="true" /><span>Campaign</span></Link>
      </nav>
    </header>
  );
}
