"use client";

import { Check, Download, Share2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import type { PlaySession } from "@/lib/play/session";
import { getDivergence, getPlausibility, getResultTitle } from "@/lib/play/session";
import type { StoryDefinition } from "@/lib/stories/schema";

export function ResultPoster({ story, session }: { story: StoryDefinition; session: PlaySession }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);
  const plausibility = getPlausibility(session);
  const divergence = getDivergence(session);
  const resultTitle = session.ending?.title ?? getResultTitle(plausibility, divergence);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    context.fillStyle = "#100f0d";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#dc651f";
    context.fillRect(0, 0, 22, canvas.height);
    context.fillStyle = "rgba(241,234,220,0.13)";
    context.fillRect(72, 95, 1056, 2);
    context.fillRect(72, 515, 1056, 2);

    context.fillStyle = "#dc651f";
    context.font = "700 26px Courier New";
    context.fillText("RIPPLE / YOUR UNIVERSE", 72, 64);

    context.fillStyle = "#f1eadc";
    context.font = "900 68px Arial Narrow, Arial";
    drawWrappedText(context, story.metadata.title, 72, 170, 720, 70, 3);

    context.fillStyle = "#cfc4b1";
    context.font = "24px Georgia";
    context.fillText(`${session.decisions.length} decisions rewrote this timeline`, 76, 444);

    context.fillStyle = "#3f8d86";
    context.font = "900 66px Arial Narrow, Arial";
    context.fillText(`${plausibility}%`, 888, 186);
    context.fillStyle = "#cfc4b1";
    context.font = "700 18px Courier New";
    context.fillText("PLAUSIBLE", 890, 216);

    context.fillStyle = "#bc3b32";
    context.font = "900 66px Arial Narrow, Arial";
    context.fillText(`${divergence}%`, 888, 310);
    context.fillStyle = "#cfc4b1";
    context.font = "700 18px Courier New";
    context.fillText("DIVERGENT", 890, 340);

    context.fillStyle = "#f1eadc";
    context.font = "900 30px Arial Narrow, Arial";
    context.fillText(resultTitle.toUpperCase(), 72, 570);
    context.fillStyle = "#94897a";
    context.font = "18px Courier New";
    context.textAlign = "right";
    context.fillText("ALL THE NEWS THAT NEVER WAS", 1128, 568);
    context.textAlign = "left";
  }, [divergence, plausibility, resultTitle, session.decisions.length, story.metadata.title]);

  async function share() {
    const shareData = {
      title: `${story.metadata.title} | RIPPLE`,
      text: `${resultTitle}: ${plausibility}% plausible, ${divergence}% divergent.`,
      url: window.location.href,
    };
    if (navigator.share) {
      await navigator.share(shareData).catch(() => undefined);
      return;
    }
    await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  function download() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `ripple-${story.slug}-timeline.png`;
      anchor.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  }

  return (
    <section className="poster-section" aria-labelledby="poster-title">
      <div className="poster-heading">
        <div><p className="section-kicker">Share desk</p><h2 id="poster-title">Publish your final edition</h2></div>
        <div className="poster-actions">
          <button className="button button-quiet" type="button" onClick={download}><Download size={18} aria-hidden="true" />Download poster</button>
          <button className="button button-primary" type="button" onClick={share}>{copied ? <Check size={18} aria-hidden="true" /> : <Share2 size={18} aria-hidden="true" />}{copied ? "Link copied" : "Share timeline"}</button>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        className="result-canvas"
        width="1200"
        height="630"
        aria-label={`RIPPLE result poster: ${resultTitle}, ${plausibility}% plausible and ${divergence}% divergent.`}
        role="img"
      />
    </section>
  );
}

function drawWrappedText(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number,
) {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (context.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  lines.slice(0, maxLines).forEach((value, index) => context.fillText(value, x, y + index * lineHeight));
}
