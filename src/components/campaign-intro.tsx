import { ArrowRight, BriefcaseBusiness, Eye, GitBranch } from "lucide-react";

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
  return (
    <div className="fork-intro">
      {steps.map((item, index) => <input className="sr-only fork-intro-toggle" type="radio" name="campaign-intro-step" id={`campaign-intro-step-${index}`} defaultChecked={index === 0} key={item.label} />)}
      <div className="fork-intro-tabs" role="group" aria-label="How the campaign works">
        {steps.map((item, index) => (
          <label
            htmlFor={`campaign-intro-step-${index}`}
            key={item.label}
          >
            {item.label}
          </label>
        ))}
      </div>
      <div className="fork-intro-panels">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const nextIndex = index < steps.length - 1 ? index + 1 : 0;
          return <article role="tabpanel" key={step.label}>
            <div className="fork-intro-icon"><Icon size={24} aria-hidden="true" /></div>
            <h3>{step.title}</h3>
            <div className="fork-intro-copy"><p>{step.copy}</p><small>{step.note}</small></div>
            <label className="fork-intro-next" htmlFor={`campaign-intro-step-${nextIndex}`}>{index < steps.length - 1 ? <>Next <ArrowRight size={16} aria-hidden="true" /></> : "Start over"}</label>
          </article>;
        })}
      </div>
    </div>
  );
}
