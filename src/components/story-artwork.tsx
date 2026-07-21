type StoryArtworkProps = {
  storyId: string;
  className?: string;
  label?: string;
};

export function StoryArtwork({ storyId, className = "", label }: StoryArtworkProps) {
  const title = label ? <title>{label}</title> : undefined;
  const ariaProps = label
    ? { role: "img" as const, "aria-label": label }
    : { "aria-hidden": true as const };

  if (storyId === "kg-trade") {
    return (
      <svg className={`story-art story-art-contract ${className}`} viewBox="0 0 900 600" {...ariaProps}>
        {title}
        <rect width="900" height="600" fill="currentColor" opacity="0.04" />
        <g transform="rotate(-7 450 300)">
          <path className="art-paper" d="M142 72h616v446l-42-22-40 23-40-22-41 23-41-22-40 22-41-22-40 22-41-22-40 22-42-23-42 21-44-23-42 21-40-22-44 21-46-22z" />
          <path className="art-rule" d="M210 165h480M210 211h480M210 257h328M210 379h480M210 425h350" />
          <path className="art-accent" d="M180 104h224v34H180z" />
          <path className="art-rip" d="M436 68l-24 60 32 42-28 48 32 45-31 48 33 48-28 47 28 52-32 61" />
          <circle className="art-stamp" cx="627" cy="326" r="88" />
          <path className="art-stamp" d="M568 326h118M627 267v118" />
        </g>
      </svg>
    );
  }

  if (storyId === "giannis-cavs") {
    return (
      <svg className={`story-art story-art-draft ${className}`} viewBox="0 0 900 600" {...ariaProps}>
        {title}
        <path className="art-court" d="M0 470h900V0H0z" />
        <circle className="art-court-line" cx="450" cy="290" r="190" />
        <path className="art-court-line" d="M0 290h900M450 0v600" />
        <g transform="rotate(6 450 300)">
          <rect className="art-paper" x="268" y="58" width="364" height="484" />
          <path className="art-accent" d="M268 58h364v86H268z" />
          <path className="art-rule" d="M326 205h248M326 248h248M326 431h248M326 472h174" />
          <text className="art-number" x="450" y="395" textAnchor="middle">1</text>
        </g>
      </svg>
    );
  }

  if (storyId === "mj-portland") {
    return (
      <svg className={`story-art story-art-shoe ${className}`} viewBox="0 0 900 600" {...ariaProps}>
        {title}
        <path className="art-rays" d="M450 300L52 80M450 300L240 0M450 300L641 0M450 300L850 82M450 300L900 300M450 300L790 600M450 300L450 600M450 300L102 600M450 300L0 300" />
        <g transform="rotate(-8 450 300)">
          <path className="art-shoe-fill" d="M143 386c0-62 48-82 132-104l124-34c49-13 73-60 83-135l10-74 116 36-16 84c111 36 172 107 172 178v79H143z" />
          <path className="art-shoe-line" d="M143 416v70h621v-70M381 261l55 48M449 230l55 48M517 200l55 48" />
          <circle className="art-accent-fill" cx="600" cy="130" r="22" />
        </g>
      </svg>
    );
  }

  if (storyId === "cp3-lakers") {
    return (
      <svg className={`story-art story-art-fax ${className}`} viewBox="0 0 900 600" {...ariaProps}>
        {title}
        <path className="art-grid" d="M0 100h900M0 200h900M0 300h900M0 400h900M0 500h900M150 0v600M300 0v600M450 0v600M600 0v600M750 0v600" />
        <g transform="rotate(4 450 300)">
          <rect className="art-paper" x="176" y="72" width="548" height="456" />
          <path className="art-accent" d="M176 72h548v58H176z" />
          <path className="art-rule" d="M240 196h420M240 242h420M240 288h300M240 448h268" />
          <path className="art-rip" d="M240 334h180M480 334h180" />
          <g transform="rotate(-10 560 400)">
            <rect className="art-stamp" x="410" y="346" width="300" height="108" />
            <text className="art-no" x="560" y="424" textAnchor="middle">YES</text>
          </g>
        </g>
      </svg>
    );
  }

  return (
    <svg className={`story-art story-art-letter ${className}`} viewBox="0 0 900 600" {...ariaProps}>
      {title}
      <path className="art-grid" d="M0 100h900M0 200h900M0 300h900M0 400h900M0 500h900M150 0v600M300 0v600M450 0v600M600 0v600M750 0v600" />
      <g transform="rotate(-5 450 300)">
        <rect className="art-paper" x="150" y="110" width="600" height="380" />
        <path className="art-letter-line" d="M150 110l300 220 300-220M150 490l224-208M750 490L526 282" />
        <g transform="rotate(-8 560 346)">
          <rect className="art-stamp" x="426" y="289" width="268" height="114" />
          <text className="art-no" x="560" y="368" textAnchor="middle">NO</text>
        </g>
      </g>
    </svg>
  );
}
