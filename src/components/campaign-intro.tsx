"use client";

import { ArrowRight, BriefcaseBusiness, Eye, GitBranch } from "lucide-react";
import { useState } from "react";

const steps = [
  {
    label: "Your role",
    icon: BriefcaseBusiness,
    title: "Run basketball operations.",
    copy: "Enter a pivotal NBA timeline and build a championship plan without breaking the roster, the relationships, or the future.",
    note: "Your campaign autosaves after every decision.",
  },
  {
    label: "Each turn",
    icon: Eye,
    title: "Brief. Investigate. Decide.",
    copy: "Read the situation, spend intel only if you need it, then choose one strategy. Your objectives and their target numbers are visible at every step, so you always know what you're playing for.",
    note: "Influence can improve a risky forecast—but it runs out.",
  },
  {
    label: "The outcome",
    icon: GitBranch,
    title: "Every choice carries forward.",
    copy: "Trust, team strength, and cap flexibility change with your decisions. Win it all and a championship banner joins your record. After the final turn, your complete run becomes a legacy score and an ending.",
    note: "Chase the banners, the score, and the leadership profiles.",
  },
];

export function CampaignIntro() {
  const [active, setActive] = useState(0);
  const step = steps[active];
  const Icon = step.icon;

  return (
    <div className="clean-intro">
      <div className="clean-intro-tabs" role="tablist" aria-label="How the campaign works">
        {steps.map((item, index) => <button type="button" role="tab" aria-selected={active === index} className={active === index ? "active" : ""} onClick={() => setActive(index)} key={item.label}><span>0{index + 1}</span>{item.label}</button>)}
      </div>
      <article role="tabpanel" key={step.label}>
        <div className="clean-intro-icon"><Icon size={26} /></div>
        <p>{step.label}</p>
        <h3>{step.title}</h3>
        <div className="clean-intro-copy"><p>{step.copy}</p><small>{step.note}</small></div>
        {active < steps.length - 1 ? <button type="button" onClick={() => setActive(active + 1)}>Next <ArrowRight size={16} /></button> : <button type="button" onClick={() => setActive(0)}>Start over</button>}
      </article>
    </div>
  );
}
