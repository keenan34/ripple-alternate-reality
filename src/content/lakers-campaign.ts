import { validateCampaign, type CampaignEffect } from "@/lib/campaign/schema";

const resource = (key: string, value: number, label: string): CampaignEffect => ({ scope: "resource", key, operation: "add", value, label });
const relationship = (key: string, value: number, label: string): CampaignEffect => ({ scope: "relationship", key, operation: "add", value, label });
const flag = (key: string, value: boolean | string, label: string): CampaignEffect => ({ scope: "flag", key, operation: "set", value, label });
const banner = (key: string, label: string): CampaignEffect => ({ scope: "banner", key, operation: "set", value: label, label });

const roster2012 = [
  { name: "Chris Paul", number: 3, position: "PG", depth: 1 },
  { name: "Steve Blake", number: 5, position: "PG", depth: 2 },
  { name: "Kobe Bryant", number: 24, position: "SG", depth: 1 },
  { name: "Andrew Goudelock", number: 0, position: "SG", depth: 2 },
  { name: "Metta World Peace", number: 15, position: "SF", depth: 1 },
  { name: "Matt Barnes", number: 9, position: "SF", depth: 2 },
  { name: "Josh McRoberts", number: 6, position: "PF", depth: 1 },
  { name: "Troy Murphy", number: 14, position: "PF", depth: 2 },
  { name: "Andrew Bynum", number: 17, position: "C", depth: 1 },
  { name: "Jordan Hill", number: 27, position: "C", depth: 2 },
];

const roster2013 = [
  { name: "Chris Paul", number: 3, position: "PG", depth: 1 },
  { name: "Steve Blake", number: 5, position: "PG", depth: 2 },
  { name: "Kobe Bryant", number: 24, position: "SG", depth: 1 },
  { name: "Andrew Goudelock", number: 0, position: "SG", depth: 2 },
  { name: "Metta World Peace", number: 15, position: "SF", depth: 1 },
  { name: "Antawn Jamison", number: 4, position: "SF", depth: 2 },
  { name: "Earl Clark", number: 6, position: "PF", depth: 1 },
  { name: "Jordan Hill", number: 27, position: "PF", depth: 2 },
  { name: "Andrew Bynum", number: 17, position: "C", depth: 1 },
  { name: "Robert Sacre", number: 50, position: "C", depth: 2 },
];

const title2012Effects = [banner("title-2012", "2012 NBA CHAMPIONS"), relationship("buss-trust", 8, "Ownership trust"), resource("team-cohesion", 6, "Team cohesion")];
const title2013Effects = [banner("title-2013", "2013 NBA CHAMPIONS"), relationship("cp3-trust", 8, "Chris Paul trust"), relationship("kobe-trust", 6, "Kobe Bryant trust"), relationship("buss-trust", 7, "Ownership trust")];

export const lakersCampaign = validateCampaign({
  schemaVersion: 1,
  id: "lakers-war-room",
  storySlug: "cp3-lakers",
  title: "Basketball Reasons",
  role: "Executive VP, Basketball Operations",
  organization: "Los Angeles Lakers",
  objective: {
    title: "Turn the trade that stood into banner seventeen",
    description: "Balance two Hall of Fame guards who both close games, survive the Dwight Howard question, protect Kobe Bryant's last great years, and make sure Chris Paul never reaches a podium in another uniform.",
  },
  hero: {
    eyebrow: "Campaign 04 · Los Angeles",
    title: "The veto never came.\nThe pressure did.",
    tagline: "Six front-office decisions decide whether Chris Paul and Kobe Bryant become a dynasty or a cautionary tale.",
    artKey: "cp3-lakers",
  },
  resources: [
    { key: "influence", label: "Front-office influence", shortLabel: "Influence", description: "Political capital with the Buss family, agents, and the coaching staff. Spend it to force contested calls through — it never regenerates.", minimum: 0, maximum: 6, initialValue: 4 },
    { key: "cap-flexibility", label: "Cap flexibility", shortLabel: "Cap", description: "Room beneath the new CBA's punitive tax line. The trade shed Gasol and Odom but imported Paul's max — every further addition is a fight with the ledger.", minimum: 0, maximum: 100, initialValue: 52 },
    { key: "team-cohesion", label: "Team cohesion", shortLabel: "Cohesion", description: "How fully a re-assembled locker room believes the hierarchy. Two alphas, no training camp, and a lockout schedule make this the campaign's quietest currency.", minimum: 0, maximum: 100, initialValue: 62 },
    { key: "competitive-power", label: "Competitive power", shortLabel: "Power", description: "The roster's real championship strength. The backcourt is historic; the frontcourt behind Bynum is a rumor.", minimum: 0, maximum: 100, initialValue: 76 },
    { key: "kobe-health", label: "Kobe mileage reserve", shortLabel: "Mileage", description: "The physical margin left in a 16-season body. In our timeline this account overdrafted on April 12, 2013. High mileage reserve means the franchise learned to spend it on June.", minimum: 0, maximum: 100, initialValue: 64 },
    { key: "intel", label: "Intelligence budget", shortLabel: "Intel", description: "Medical, scouting, and agent reports you can open before deciding. You receive four for the entire campaign.", minimum: 0, maximum: 4, initialValue: 4 },
  ],
  relationships: [
    { key: "cp3-trust", name: "Chris Paul", role: "Franchise point guard", initialValue: 64 },
    { key: "kobe-trust", name: "Kobe Bryant", role: "Franchise icon", initialValue: 56 },
    { key: "bynum-trust", name: "Andrew Bynum", role: "All-Star center", initialValue: 44 },
    { key: "buss-trust", name: "Jim Buss", role: "Ownership", initialValue: 52 },
  ],
  initialFlags: {
    "kobe-healthy": true,
    "offense-plan": "unset",
    "center-plan": "bynum",
    "dwight-era": false,
    "cp3-extended": false,
    "free-agent-signed": false,
    championships: 0,
  },
  objectives: [
    { id: "banner-seventeen", label: "Raise banner seventeen", description: "Win at least one championship with Paul and Bryant sharing the backcourt.", primary: true, condition: { scope: "flag", key: "championships", operator: "at-least", value: 1 } },
    { id: "protect-kobe", label: "Protect the icon", description: "Finish with Kobe's mileage reserve at 60 or higher — the Achilles never gets its April.", primary: true, condition: { scope: "resource", key: "kobe-health", operator: "at-least", value: 60 } },
    { id: "sustain-window", label: "Sustain a contender", description: "Finish with competitive power at 78 or higher.", primary: true, condition: { scope: "resource", key: "competitive-power", operator: "at-least", value: 78 } },
    { id: "keep-cp3", label: "Keep the Point God", description: "Finish with Chris Paul's trust at 68 or higher.", primary: false, condition: { scope: "relationship", key: "cp3-trust", operator: "at-least", value: 68 } },
    { id: "kobe-partnership", label: "Win the alpha détente", description: "Finish with Kobe Bryant's trust at 55 or higher.", primary: false, condition: { scope: "relationship", key: "kobe-trust", operator: "at-least", value: 55 } },
    { id: "respect-books", label: "Respect the tax man", description: "Finish with at least 22 cap flexibility under the new CBA.", primary: false, condition: { scope: "resource", key: "cap-flexibility", operator: "at-least", value: 22 } },
  ],
  turns: [
    {
      id: "christmas-showcase",
      year: 2011,
      date: "December 25, 2011",
      deadline: "Tipoff in four hours",
      phase: "Opening Night · Lockout Season",
      headline: "Chris Paul wears the gold warmups tonight. Nobody has decided whose offense this is.",
      brief: "The trade survived the league office, but it cost Gasol, Odom, and every ounce of continuity. Mike Brown wants a defined hierarchy before the national broadcast, Kobe wants his usual diet, and Paul wants the ball where he has always kept it.",
      historicalContext: "In reality, Stern's veto sent Paul to the Clippers, Odom was traded to Dallas within the week, and the Lakers opened the lockout season with Derek Fisher at point guard.",
      artKey: "war-room",
      roster: roster2012,
      advisors: [
        { advisorId: "kobe-trust", subject: "Sixteen years of receipts", body: "Kobe will share the offense for a real chance at six rings. He will not share it for a press release, and he will test whichever plan you announce by the second quarter.", stance: "warning" },
        { advisorId: "cp3-trust", subject: "Let me organize the game", body: "Paul does not need the last shot. He needs the possession to run through his reads so the last shot is the right one. He is watching how you handle tonight more than what you say.", stance: "support" },
        { advisorId: "buss-trust", subject: "Sell the product", body: "Ownership traded two beloved champions for this backcourt. The Buss family wants a coherent identity on the Christmas broadcast, not a turf war in the first month.", stance: "neutral" },
      ],
      investigations: [
        { id: "brown-playbook", label: "Audit Mike Brown's playbook", description: "Ask the staff how many of Brown's sets actually use a table-setting point guard.", intelCost: 1, reveal: "Brown's system defaults to wing isolation — barely a tenth of his actions begin with a true organizer. Handing Paul the keys means rebuilding the call sheet, not just the depth chart.", bonuses: { "hand-the-keys": 12, "two-man-game": 8, "kobe-first": -6 } },
      ],
      strategies: [
        {
          id: "hand-the-keys", title: "Give Paul the offense", summary: "Make Chris Paul the primary organizer from night one and move Kobe into the league's most dangerous off-ball role.", approach: "Structural change / Icon friction", baseChance: 72, costs: { influence: 1 }, requirements: [],
          success: { stamp: "POINT GOD INSTALLED", headline: "Paul runs the show and Kobe's efficiency spikes off the ball", detail: "The possessions get cleaner, the shot quality jumps, and the loudest skeptic in the building starts getting layups out of sets he never had to call for.", effects: [flag("offense-plan", "paul", "Paul runs the offense"), resource("competitive-power", 8, "Competitive power"), relationship("cp3-trust", 10, "Chris Paul trust"), relationship("kobe-trust", -5, "Kobe Bryant trust")] },
          failure: { stamp: "TWO OPERATING SYSTEMS", headline: "The new hierarchy lasts until the first cold quarter", detail: "Kobe answers a scoring drought the only way he ever has. The offense splits into shifts, and the broadcast spends the fourth quarter reading body language.", effects: [flag("offense-plan", "paul", "Paul runs the offense"), relationship("kobe-trust", -9, "Kobe Bryant trust"), resource("team-cohesion", -6, "Team cohesion")] },
          delayed: { turnsLater: 2, headline: "The league adjusts to the Paul-led Lakers and finds nothing to take away", detail: "Coaches admit the problem privately: pick your poison is not a scouting report.", effects: [resource("competitive-power", 4, "Competitive power"), relationship("kobe-trust", 3, "Kobe Bryant trust")] },
        },
        {
          id: "two-man-game", title: "Build everything around the two-man game", summary: "Refuse to pick a king. Make the Paul–Bryant pick-and-roll the entire identity and let the hierarchy solve itself possession by possession.", approach: "Shared authority / Chemistry bet", baseChance: 80, costs: {}, requirements: [],
          success: { stamp: "TWO CLOSERS", headline: "The Paul–Bryant two-man game becomes unguardable by February", detail: "Switch it and Paul hunts the big. Trap it and Kobe slips to the elbow. The league's oldest question — whose team is it — stops mattering for entire quarters.", effects: [flag("offense-plan", "shared", "The offense runs through the two-man game"), resource("competitive-power", 6, "Competitive power"), relationship("cp3-trust", 5, "Chris Paul trust"), relationship("kobe-trust", 5, "Kobe Bryant trust"), resource("team-cohesion", 5, "Team cohesion")] },
          failure: { stamp: "POLITE STALEMATE", headline: "The two-man game works and the other three watch", detail: "The action is efficient and the offense is narrow. Bynum touches the ball less each week, and the role players stop cutting because the ball never comes.", effects: [flag("offense-plan", "shared", "The offense runs through the two-man game"), resource("team-cohesion", -4, "Team cohesion"), relationship("bynum-trust", -6, "Andrew Bynum trust")] },
        },
        {
          id: "kobe-first", title: "Keep Kobe primary", summary: "Change nothing loudly. Kobe stays the engine, Paul becomes the league's most overqualified control valve, and the locker room keeps its familiar order.", approach: "Continuity / Wasted ceiling", baseChance: 86, costs: {}, requirements: [],
          success: { stamp: "NO SUDDEN MOVES", headline: "The familiar hierarchy holds the room together", detail: "Kobe gets his touches, Paul quietly fixes every broken possession, and the standings look fine. The ceiling question is deferred, not answered.", effects: [flag("offense-plan", "kobe", "Kobe remains primary"), relationship("kobe-trust", 8, "Kobe Bryant trust"), relationship("buss-trust", 4, "Ownership trust"), resource("competitive-power", 3, "Competitive power"), relationship("cp3-trust", -5, "Chris Paul trust")] },
          failure: { stamp: "OVERQUALIFIED", headline: "Paul runs the second unit like a man taking notes", detail: "The best point guard alive spends fourth quarters spotting up. His camp starts asking, politely, what exactly the trade was for.", effects: [flag("offense-plan", "kobe", "Kobe remains primary"), relationship("cp3-trust", -9, "Chris Paul trust"), resource("competitive-power", -4, "Competitive power")] },
          delayed: { turnsLater: 2, headline: "The iso-heavy diet shows up in Kobe's medical file", detail: "Sixteen seasons of workload plus a lockout schedule is arithmetic, not opinion.", effects: [resource("kobe-health", -6, "Kobe mileage reserve")] },
        },
      ],
    },
    {
      id: "bynum-deadline",
      year: 2012,
      date: "March 15, 2012",
      deadline: "3:00 PM ET",
      phase: "Trade Deadline",
      headline: "Bynum made the All-Star team, then got benched for jacking threes. The market is calling anyway.",
      brief: "Andrew Bynum is having the best season of his life between discipline incidents. Orlando's Dwight Howard drama has every contender circling, and your center's name is in each version of the rumor. Extend him, hold the line, or spend the deadline on the spacing Paul keeps requesting.",
      historicalContext: "In reality, Bynum made his first All-Star team in 2012, was benched for ignoring team rules, and was traded that August in the four-team Dwight Howard deal.",
      artKey: "deadline-board",
      roster: roster2012,
      advisors: [
        { advisorId: "bynum-trust", subject: "Pay me like the future", body: "Bynum's camp sees a 23-year-old All-Star center on a title team and wants the extension conversation now. Every deadline his name appears in a rumor, the price of his patience rises.", stance: "warning" },
        { advisorId: "buss-trust", subject: "Andrew is my pick", body: "Jim Buss drafted Bynum and has defended him for seven years. Moving him without a superstar coming back would be read upstairs as a personal betrayal.", stance: "support" },
        { advisorId: "cp3-trust", subject: "I need shooters, not size", body: "Paul's pick-and-roll dies against loaded lanes. He is lobbying for one knockdown shooter and promises the offense will do the rest.", stance: "neutral" },
      ],
      investigations: [
        { id: "locker-pulse", label: "Take the locker-room pulse on Bynum", description: "Ask the veterans, off the record, whether the talent is worth the weather.", intelCost: 1, reveal: "The room respects Bynum's season and trusts none of his habits. The veterans' advice: make him play for the extension, because everything given to him early has been treated as a floor, not a ceiling.", bonuses: { "hold-the-line": 10, "extend-bynum": -6, "deadline-spacing": 6 } },
        { id: "orlando-line", label: "Open the Orlando back channel", description: "Find out whether the Dwight Howard sweepstakes are real this week or this summer.", intelCost: 1, reveal: "Orlando will not move Howard at the deadline — the new GM wants to run the playoff string out. The real auction opens in August, and every bidder will start with your center's name.", bonuses: { "hold-the-line": 8, "extend-bynum": -4 } },
      ],
      strategies: [
        {
          id: "extend-bynum", title: "Extend Bynum now", summary: "Lock in the 23-year-old All-Star center before his price hits the open market, and accept the maturity risk as the cost of continuity.", approach: "Continuity / Character risk", baseChance: 78, costs: { "cap-flexibility": 10 }, requirements: [],
          success: { stamp: "TOWER SECURED", headline: "Bynum signs and the league's best young center stops reading rumors", detail: "The extension lands before the market can bid. Bynum plays the last month like a man with nothing to prove and everything to protect.", effects: [flag("center-plan", "bynum", "Bynum is the long-term center"), relationship("bynum-trust", 12, "Andrew Bynum trust"), relationship("buss-trust", 6, "Ownership trust"), resource("competitive-power", 4, "Competitive power")] },
          failure: { stamp: "PAID IN FULL, EARLY", headline: "The extension calms Bynum and removes his urgency with it", detail: "The number is fair and the message is received: the behavior was never a dealbreaker. The three-point celebrations continue, now guaranteed.", effects: [flag("center-plan", "bynum", "Bynum is the long-term center"), relationship("bynum-trust", 6, "Andrew Bynum trust"), resource("cap-flexibility", -6, "Cap flexibility"), resource("team-cohesion", -4, "Team cohesion")] },
        },
        {
          id: "hold-the-line", title: "Hold the line", summary: "No extension, no trade. Tell Bynum the contract is earned in May, and keep every August option open.", approach: "Discipline / Deferred decision", baseChance: 84, costs: {}, requirements: [],
          success: { stamp: "PROVE-IT SPRING", headline: "Bynum hears the message and plays like the market is watching", detail: "The front office keeps its powder dry for the summer and gets a motivated 23-year-old anchoring the paint in the meantime.", effects: [flag("center-plan", "bynum", "Bynum plays for his contract"), relationship("buss-trust", 3, "Ownership trust"), resource("cap-flexibility", 5, "Cap flexibility"), relationship("bynum-trust", -4, "Andrew Bynum trust")] },
          failure: { stamp: "MESSAGE MISREAD", headline: "Bynum treats the silence as a verdict", detail: "The benching stories multiply. The talent still shows up most nights; the trust doesn't, and the rumor mill fills the vacuum you left open.", effects: [flag("center-plan", "bynum", "Bynum plays for his contract"), relationship("bynum-trust", -10, "Andrew Bynum trust"), resource("team-cohesion", -5, "Team cohesion")] },
        },
        {
          id: "deadline-spacing", title: "Buy Paul his shooter", summary: "Send Troy Murphy and a future second to New Jersey for the knockdown wing Paul's pick-and-roll is starving for.", approach: "Spacing / Modest price", baseChance: 76, costs: { "cap-flexibility": 8 }, requirements: [],
          acquisition: { always: true, hint: "A career 42% shooter is buried on a lottery team's wing rotation and available for spare parts.", player: { name: "Anthony Morrow", number: 22, position: "SG", depth: 2, blurb: "One of the purest catch-and-shoot wings of his generation, hitting 42% from deep on a going-nowhere Nets team. In our timeline no contender made the call." } },
          success: { stamp: "CORNER OCCUPIED", headline: "Morrow arrives and the paint opens for everyone", detail: "The first time Paul turns the corner and the low man stays home, the trade explains itself. Kobe's post-ups and Bynum's duck-ins both get roomier.", departures: ["Troy Murphy"], effects: [resource("competitive-power", 7, "Competitive power"), relationship("cp3-trust", 6, "Chris Paul trust"), resource("team-cohesion", 3, "Team cohesion")] },
          failure: { stamp: "SPACING ON PAPER", headline: "Morrow shoots well and defends the way the scouting report promised", detail: "Every point he adds in the corner leaks back at the other end. The rotation math gets harder in the exact games it was supposed to solve.", departures: ["Troy Murphy"], effects: [resource("competitive-power", -2, "Competitive power"), relationship("buss-trust", -5, "Ownership trust")] },
        },
      ],
    },
    {
      id: "thunder-game-five",
      year: 2012,
      date: "May 21, 2012",
      deadline: "8:30 PM tip",
      phase: "Western Conference Semifinals · Game 5",
      headline: "Oklahoma City's kids have taken the home crowd. The series is 2–2, and tonight decides the West.",
      brief: "Durant, Westbrook, and Harden are averaging 105 through four games and turning every dead ball into a track meet. Paul wants the tempo strangled to a walk. Kobe wants Westbrook as a personal assignment. Bynum wants the ball every trip until somebody proves they can move him.",
      historicalContext: "In reality, the post-veto Lakers lost this exact series in five games. Oklahoma City reached the Finals and lost to Miami in LeBron's first championship run.",
      artKey: "playoff-tunnel",
      roster: roster2012,
      promptVariants: [
        { conditions: [{ scope: "flag", key: "offense-plan", operator: "equals", value: "paul" }], headline: "Paul's offense has controlled three quarters a night. OKC owns the fourth.", brief: "The organized possessions are winning their minutes. The chaos possessions are losing the series. Tonight's call decides which version of basketball the West final berth is played in." },
        { conditions: [{ scope: "flag", key: "offense-plan", operator: "equals", value: "kobe" }], headline: "Kobe has scored 34 a night in this series. It is 2–2 anyway.", brief: "The hero-ball diet is producing points and exhaustion in equal measure. Paul has quietly asked for the keys to one playoff game. Tonight is the night he means." },
      ],
      advisors: [
        { advisorId: "cp3-trust", subject: "Make it ugly", body: "Paul wants every possession to take twenty seconds and end in a shot somebody chose. OKC's average age is 24 — he believes a rockfight ages them ten years in one night.", stance: "support" },
        { advisorId: "kobe-trust", subject: "Give me Westbrook", body: "Kobe wants the assignment everyone else is avoiding. The medical staff notes, quietly, that chasing Russell Westbrook for 40 minutes is the most expensive request in basketball.", stance: "warning" },
        { advisorId: "bynum-trust", subject: "They have no answer for me", body: "Perkins is giving up four inches of reach and Ibaka leaves his feet on every fake. Bynum wants twenty-five touches and promises twenty-five points.", stance: "neutral" },
      ],
      investigations: [
        { id: "harden-coverage", label: "Chart OKC's bench units", description: "Break down the eight minutes a night when Durant sits and Harden runs everything.", intelCost: 1, reveal: "The Harden units bleed against pressure — blitz him at half court and OKC's offense becomes contested pull-ups. The series' hidden margin lives in those eight minutes, not in the star matchups.", bonuses: { "mud-the-game": 12, "hunt-the-third-star": 14, "feed-bynum": 4 } },
      ],
      strategies: [
        {
          id: "mud-the-game", title: "Strangle the tempo", summary: "Hand Paul the whistle. Walk it up, milk every clock, and force three kids to win a 78-possession rockfight in May.", approach: "Control / Trust the Point God", baseChance: 74, costs: {}, requirements: [],
          success: { stamp: "MUD WINS", headline: "The Lakers drag OKC into deep water and hold them under", detail: "The game ends 91–84 and feels like it ended 9–8. The kids press first. Paul's fourth quarter is a clinic in never being where the trap arrives, and the West runs through Figueroa.", effects: [resource("competitive-power", 9, "Competitive power"), relationship("cp3-trust", 8, "Chris Paul trust"), resource("team-cohesion", 5, "Team cohesion"), ...title2012Effects] },
          failure: { stamp: "YOUTH REFUSES", headline: "OKC turns four dead possessions into twelve points and the mud never sets", detail: "Westbrook refuses the walking pace and Durant makes the shot-clock bailouts anyway. The strangle plan needed fifteen stops it only got eleven of.", effects: [resource("competitive-power", -7, "Competitive power"), resource("team-cohesion", -4, "Team cohesion"), relationship("kobe-trust", -4, "Kobe Bryant trust")] },
        },
        {
          id: "hunt-the-third-star", title: "Blitz Harden off the floor", summary: "Concede the stars their thirty and send the game's real pressure at the third one — trap Harden the moment Durant sits.", approach: "Matchup surgery / Film-room bet", baseChance: 68, costs: { influence: 1 }, requirements: [],
          success: { stamp: "THIRD STAR DIMMED", headline: "The bench minutes flip and OKC's margin disappears", detail: "Harden's eight minutes become a nightly deficit. Brooks shortens his rotation, the kids play tired in the fourth, and the oldest closers on the floor collect the series.", effects: [resource("competitive-power", 10, "Competitive power"), relationship("kobe-trust", 8, "Kobe Bryant trust"), relationship("cp3-trust", 5, "Chris Paul trust"), ...title2012Effects] },
          failure: { stamp: "BEARD ANSWERS", headline: "Harden splits the first three traps and the gamble feeds the fire", detail: "The blitz needed to demoralize him by the second quarter. Instead the third star plays the best game of his series, and the defense spent its legs chasing a theory.", effects: [resource("competitive-power", -6, "Competitive power"), resource("kobe-health", -6, "Kobe mileage reserve"), relationship("kobe-trust", -4, "Kobe Bryant trust")] },
        },
        {
          id: "feed-bynum", title: "Pound it inside", summary: "Make the series a size argument. Twenty-five touches for Bynum, offensive rebounds for everyone, and let OKC's athleticism chase the ball out of the paint.", approach: "Rim protection / Old-school leverage", baseChance: 71, costs: {}, requirements: [{ scope: "flag", key: "center-plan", operator: "equals", value: "bynum" }],
          success: { stamp: "SIZE SETTLES IT", headline: "Bynum posts 28 and 16 and the kids foul out of the West", detail: "Perkins lasts seven minutes, Ibaka stops leaving his feet, and every OKC run dies at the free-throw line. The All-Star season becomes a playoff résumé in one night.", effects: [relationship("bynum-trust", 10, "Andrew Bynum trust"), resource("competitive-power", 8, "Competitive power"), ...title2012Effects] },
          failure: { stamp: "POUNDED INTO STAGNATION", headline: "The post-ups become the slowest turnovers in basketball", detail: "OKC fronts, digs, and sprints the other way. Every entry pass that doesn't arrive becomes two points of transition, and the backcourt watches its series decided at the wrong end.", effects: [relationship("bynum-trust", -6, "Andrew Bynum trust"), relationship("cp3-trust", -5, "Chris Paul trust"), resource("team-cohesion", -5, "Team cohesion")] },
        },
      ],
    },
    {
      id: "dwight-summit",
      year: 2012,
      date: "August 10, 2012",
      deadline: "Orlando wants an answer by Friday",
      phase: "Superteam Summit",
      headline: "Orlando is finally ready to move Dwight Howard. Every version of the deal starts with Bynum.",
      brief: "The Dwight Howard sweepstakes have reached their endgame, and Orlando's new front office prefers your center to any pick package in the league. Paul, Bryant, and the best defensive player alive could share one roster — if you can stomach the back surgery, the extension risk, and what it does to the man you'd be trading.",
      historicalContext: "In reality, the Lakers landed Howard on this exact date without Chris Paul. The season collapsed under injuries and Mike D'Antoni's system, and Dwight left for Houston after one year.",
      artKey: "contract-table",
      roster: roster2012,
      promptVariants: [
        { conditions: [{ scope: "flag", key: "championships", operator: "at-least", value: 1 }], headline: "The champions are being offered the best center alive. Greed is now a strategy question.", brief: "The parade is three months old and Orlando is still calling, because champions' assets carry the highest prices. Adding Howard to a title team might end the decade early — or teach a satisfied locker room to fight over touches." },
      ],
      advisors: [
        { advisorId: "bynum-trust", subject: "I hear everything", body: "Bynum's camp knows he headlines every offer. However this ends, he will remember whether the front office treated him like a franchise player or a package headliner.", stance: "warning" },
        { advisorId: "kobe-trust", subject: "Is he serious enough?", body: "Kobe respects Howard's defense and doubts his appetite for the fight. His question for the room: are we trading size for greatness, or size for a personality conflict in the playoffs?", stance: "neutral" },
        { advisorId: "buss-trust", subject: "Don't trade my center for a rental", body: "Jim Buss will approve the Howard deal on one condition: real confidence in an extension. Losing Bynum and Howard inside eighteen months would be a franchise catastrophe with his name on it.", stance: "warning" },
      ],
      investigations: [
        { id: "dwight-medical", label: "Pull Howard's surgical file", description: "Get an independent read on the April back surgery every rival is whispering about.", intelCost: 1, reveal: "The independent review is cleaner than the rumors: full recovery expected by December, no structural concern beyond it. The market is discounting the best center alive for a healed injury.", bonuses: { "swing-dwight": 14 } },
        { id: "agent-temperature", label: "Take the agent's temperature", description: "Find out what Howard actually wants before you bid the franchise's center on him.", intelCost: 1, reveal: "Howard will commit long-term to a contender that features him defensively and treats him as the future, not the third option. The pitch matters as much as the trade.", bonuses: { "swing-dwight": 6, "keep-bynum-core": 6 } },
      ],
      strategies: [
        {
          id: "swing-dwight", title: "Swing the Howard trade", summary: "Send Bynum to Orlando, absorb the surgery risk, and put Chris Paul, Kobe Bryant, and Dwight Howard on the same roster.", approach: "Maximum talent / Extension risk", baseChance: 66, costs: { influence: 1, "cap-flexibility": 8 }, requirements: [],
          acquisition: { hint: "The best defensive player of his generation wants out of Orlando, and every serious deal starts with your center.", player: { name: "Dwight Howard", number: 12, position: "C", depth: 1, blurb: "Three-time Defensive Player of the Year, five months removed from back surgery. In our timeline he arrived without Chris Paul, feuded with Kobe, and left in a year. This time the point god does the recruiting." }, reciprocal: { headline: "Orlando begins its rebuild around Bynum and the picks", detail: "The Magic get their franchise center answer and a war chest. The East's playoff ladder loses a rung, and every contender's margin for error shrinks the day the trade call ends." } },
          success: { stamp: "THREE PILLARS", headline: "Paul, Bryant, and Howard share a practice facility", detail: "The recruiting pitch was one sentence: come get organized by the best point guard alive. The defense has a new spine, the lobs have a new address, and the league has a new problem.", departures: ["Andrew Bynum"], effects: [flag("center-plan", "dwight", "Howard anchors the middle"), flag("dwight-era", true, "The Howard era begins"), resource("competitive-power", 13, "Competitive power"), relationship("cp3-trust", 6, "Chris Paul trust"), relationship("kobe-trust", 4, "Kobe Bryant trust"), relationship("buss-trust", -3, "Ownership trust")], delayed: { turnsLater: 2, headline: "The Howard extension question follows the team into spring", detail: "Every loss becomes a referendum on whether the future franchise center has decided to be one.", effects: [relationship("buss-trust", -3, "Ownership trust"), resource("team-cohesion", -3, "Team cohesion")] } },
          failure: { stamp: "DEAL DIES AT THE TABLE", headline: "The trade collapses over extension assurances — and Bynum heard every word", detail: "Orlando pivots to a pick package at the deadline. Your center returns to camp knowing exactly how the franchise ranks him, with three years of leverage left to spend.", effects: [flag("center-plan", "bynum", "Bynum remains after the failed deal"), relationship("bynum-trust", -12, "Andrew Bynum trust"), resource("team-cohesion", -6, "Team cohesion")] },
        },
        {
          id: "keep-bynum-core", title: "Commit to Bynum", summary: "Take Howard off the board yourselves. Extend the 24-year-old All-Star long-term and sell continuity as the superpower.", approach: "Continuity / Character bet", baseChance: 82, costs: { "cap-flexibility": 10 }, requirements: [],
          success: { stamp: "HOMEGROWN TOWER", headline: "Bynum signs long-term and the trade winds die overnight", detail: "The extension ends two years of rumors in an afternoon. Bynum repays the faith with the most professional camp of his career, and the locker room notices who the franchise chose.", effects: [flag("center-plan", "bynum", "Bynum is the franchise center"), relationship("bynum-trust", 14, "Andrew Bynum trust"), relationship("buss-trust", 5, "Ownership trust"), resource("competitive-power", 5, "Competitive power")] },
          failure: { stamp: "FAITH, GUARANTEED", headline: "The extension is signed and the habits come with it", detail: "The talent is locked in and so is everything else. The first benching of the season lands twice as hard now that the number is guaranteed through 2017.", effects: [flag("center-plan", "bynum", "Bynum is the franchise center"), relationship("bynum-trust", 6, "Andrew Bynum trust"), resource("cap-flexibility", -6, "Cap flexibility"), relationship("buss-trust", -6, "Ownership trust")] },
        },
        {
          id: "sign-shooters", title: "Spend the summer on the margins", summary: "Let the Howard circus pass. Use the midlevel on shooting and keep the core that just learned to play together.", approach: "Patient / Depth first", baseChance: 88, costs: { "cap-flexibility": 5 }, requirements: [],
          acquisition: { always: true, hint: "A rotation-starved shooting guard just averaged 20 a night for the worst team in basketball's biggest market.", player: { name: "Jodie Meeks", number: 20, position: "SG", depth: 2, blurb: "A career 37% three-point shooter available for the taxpayer midlevel. In our timeline he signed with these exact Lakers; here he joins a backcourt that can actually find him." } },
          success: { stamp: "QUIET SUMMER, LOUD FLOOR", headline: "The margins get better while the rivals get older", detail: "Meeks gives the second unit a release valve and the closing lineup another corner to punish. Continuity does the rest — the offense opens camp mid-season sharp.", effects: [resource("competitive-power", 6, "Competitive power"), relationship("cp3-trust", 5, "Chris Paul trust"), resource("team-cohesion", 6, "Team cohesion")] },
          failure: { stamp: "MARGINS STAY MARGINAL", headline: "The shooters sign and the ceiling stays exactly where it was", detail: "The bench improves a rounding error's worth while Oklahoma City adds and Miami reloads. The front page asks the question the summer refused to: was standing still the boldest risk of all?", effects: [resource("competitive-power", -2, "Competitive power"), relationship("cp3-trust", -4, "Chris Paul trust")] },
        },
      ],
    },
    {
      id: "april-in-the-legs",
      year: 2013,
      date: "April 12, 2013",
      deadline: "Tipoff vs. Golden State",
      phase: "Medical Command",
      headline: "Kobe has played 46 minutes a night for two weeks. Tonight the performance staff wants the word 'no' back.",
      brief: "The seed is nearly locked, but Kobe smells home court through the West and refuses to coast into it. The strain markers in his left calf have crossed every threshold the staff tracks. Paul has already volunteered to carry the closing lineups. Somebody has to decide whose call this actually is.",
      historicalContext: "In reality, Kobe — dragging a 45-win roster toward the eighth seed — ruptured his Achilles on this exact night against Golden State. He returned eight months later and was never the same player.",
      artKey: "playoff-tunnel",
      roster: roster2013.map((player) => player.name === "Kobe Bryant" ? { ...player, status: "Overload warning" } : player),
      promptVariants: [
        { conditions: [{ scope: "flag", key: "dwight-era", operator: "equals", value: true }], headline: "The superteam is healthy everywhere except the fatigue reports.", brief: "Howard's defense has made the regular season almost easy — which is exactly why Kobe's 46-minute fortnight makes no sense to anyone but him. The staff wants him capped. He wants the West's best record. Paul wants the keys." },
        { conditions: [{ scope: "flag", key: "championships", operator: "at-least", value: 1 }], headline: "The champion is 34 and playing like the banner proved nothing.", brief: "The ring was supposed to quiet the furnace. Instead Kobe is stacking 46-minute nights in April of a locked season. The medical staff's language has stopped being advisory." },
      ],
      advisors: [
        { advisorId: "kobe-trust", subject: "I decide when I sit", body: "Kobe has heard every version of this speech since 2006. He will respect a plan built on basketball logic and treat anything framed as protection like an insult with a spreadsheet attached.", stance: "warning" },
        { advisorId: "cp3-trust", subject: "Give me two weeks", body: "Paul's pitch is simple: hand him the closing lineups until the playoffs and Kobe arrives in May with fresh legs and zero cost in the standings. He has been preparing for this exact assignment all season.", stance: "support" },
        { advisorId: "buss-trust", subject: "Protect the face of the franchise", body: "Ownership remembers what happened to every icon who played through an April warning. The instruction from upstairs is unusually direct: do not let the franchise's face become a cautionary tale on your desk.", stance: "support" },
      ],
      investigations: [
        { id: "soleus-flags", label: "Review the strain markers", description: "Have the performance staff walk you through exactly what the left-calf data says.", intelCost: 1, reveal: "The overload signature in Kobe's left calf is the precise pattern that precedes tendon failure — the same one our timeline's April 12 made famous. Two weeks at 32 minutes or fewer clears it almost entirely.", bonuses: { "shut-it-down": 16, "minutes-truce": 12, "let-him-ride": -10 } },
      ],
      strategies: [
        {
          id: "minutes-truce", title: "Broker the 32-minute truce", summary: "Cap Kobe at 32 minutes through the playoffs' start, hand Paul the closing lineups, and sell it to both stars as strategy rather than protection.", approach: "Shared authority / Managed risk", baseChance: 75, costs: { influence: 1 }, requirements: [],
          success: { stamp: "TRUCE HOLDS", headline: "Kobe takes the cap, Paul takes the fourth quarters, and April costs nothing", detail: "The furnace grumbles and complies, because the plan is framed as weaponizing Paul rather than babying Bryant. The legs that would have given out in our timeline arrive in May at full charge.", effects: [resource("kobe-health", 10, "Kobe mileage reserve"), relationship("cp3-trust", 8, "Chris Paul trust"), flag("kobe-healthy", true, "The Achilles never tears"), ...title2013Effects] },
          failure: { stamp: "TRUCE FRAYS", headline: "The cap survives on paper and dies in overtime", detail: "The first close game breaks the agreement — Kobe simply refuses to exit. The minutes get protected most nights, the relationship pays for every one of them.", effects: [resource("kobe-health", 4, "Kobe mileage reserve"), relationship("kobe-trust", -8, "Kobe Bryant trust"), resource("team-cohesion", -5, "Team cohesion"), flag("kobe-healthy", true, "The tendon survives the spring")] },
        },
        {
          id: "shut-it-down", title: "Shut him down for two weeks", summary: "Make it an organizational decision, not a negotiation. Kobe sits until the playoffs; the seeding lands where Paul carries it.", approach: "Player first / Icon friction", baseChance: 90, costs: { influence: 1 }, requirements: [],
          success: { stamp: "NO IS A SENTENCE", headline: "The franchise sits its icon and eats the headlines", detail: "Kobe is furious in exactly the way the staff predicted and healthy in exactly the way they promised. Paul's fortnight audition doubles as proof the torch has a willing carrier.", effects: [resource("kobe-health", 14, "Kobe mileage reserve"), flag("kobe-healthy", true, "The Achilles never tears"), relationship("buss-trust", 5, "Ownership trust"), relationship("cp3-trust", 5, "Chris Paul trust"), relationship("kobe-trust", -6, "Kobe Bryant trust")] },
          failure: { stamp: "COLD WAR APRIL", headline: "The shutdown protects the tendon and poisons the spring", detail: "Kobe treats the decision as a verdict on his judgment and lets every camera know it. The body arrives in the playoffs whole; the alliance arrives on crutches.", effects: [resource("kobe-health", 8, "Kobe mileage reserve"), flag("kobe-healthy", true, "The tendon survives the spring"), relationship("kobe-trust", -12, "Kobe Bryant trust"), resource("team-cohesion", -6, "Team cohesion")] },
        },
        {
          id: "let-him-ride", title: "Let him ride", summary: "Trust the furnace one more April. Kobe keeps his minutes, the team keeps its rhythm, and the medical flags stay a private memo.", approach: "Star trust / Maximum exposure", baseChance: 58, costs: {}, requirements: [],
          success: { stamp: "THE FURNACE HOLDS", headline: "Kobe survives his April and makes it everyone's problem in May", detail: "The overload flags stay flags. The 34-year-old plays angry, seeded, and whole — and the front office quietly deletes the memo it almost sent.", effects: [relationship("kobe-trust", 10, "Kobe Bryant trust"), resource("competitive-power", 6, "Competitive power"), resource("kobe-health", -12, "Kobe mileage reserve"), flag("kobe-healthy", true, "The gamble survives"), ...title2013Effects] },
          failure: { stamp: "APRIL 12 KEEPS ITS DATE", headline: "The Achilles goes in the third quarter, in every timeline that dares it", detail: "Two free throws on a ruptured tendon, a walk to the locker room, and the sound of a franchise's spine cracking. The alternate history bought sixteen months — and then let the same night happen anyway.", effects: [flag("kobe-healthy", false, "The Achilles ruptures"), resource("kobe-health", -30, "Kobe mileage reserve"), resource("competitive-power", -14, "Competitive power"), resource("team-cohesion", -10, "Team cohesion"), relationship("buss-trust", -8, "Ownership trust")] },
        },
      ],
    },
    {
      id: "the-2013-table",
      year: 2013,
      date: "July 1, 2013",
      deadline: "Midnight ET",
      phase: "Free Agency Command",
      headline: "Chris Paul is a free agent at midnight. Every promise from December 2011 comes due tonight.",
      brief: "Paul controls his market for the first time in his career, and every team with cap room has rehearsed a pitch. Kobe wants a final competitive guarantee before he blesses any structure. Ownership wants the repeater tax defended in the same meeting. Three futures, one table, one night.",
      historicalContext: "In reality, Paul re-signed with the Clippers within hours of Doc Rivers's arrival, and the Lakers spent the same summer watching Dwight Howard walk to Houston for nothing.",
      artKey: "contract-table",
      roster: roster2013,
      promptVariants: [
        { conditions: [{ scope: "flag", key: "dwight-era", operator: "equals", value: true }], headline: "Two franchise free agents, one tax bill, one midnight.", brief: "Paul and Howard both hit the market tonight, and the new CBA prices keeping both as the most expensive roster in league history. The pitch meetings are scheduled an hour apart. The order you take them in is itself a message." },
        { conditions: [{ scope: "flag", key: "kobe-healthy", operator: "equals", value: false }], headline: "The rehab hangs over the table nobody wants to name.", brief: "Paul's free agency was supposed to be a coronation. Instead the franchise is selling a future whose second star is on crutches, and every rival pitch leads with that photograph." },
        { conditions: [{ scope: "flag", key: "championships", operator: "at-least", value: 2 }], headline: "The dynasty negotiates from the head of the table.", brief: "Two banners in two years makes this the easiest hard meeting in basketball. The only question left is what a dynasty pays to stay one — and who takes less to keep the era open." },
      ],
      advisors: [
        { advisorId: "cp3-trust", subject: "Make it about the next three years", body: "Paul's camp is not chasing the last dollar — it is chasing proof the roster stays serious. A max offer with a fading supporting cast loses to a structure with a plan.", stance: "neutral" },
        { advisorId: "kobe-trust", subject: "Two more years at the top", body: "Kobe intends to finish his career competing, not touring. He will co-sign whatever structure keeps the roster dangerous — and he expects his own extension to reflect what he has meant to the franchise.", stance: "warning" },
        { advisorId: "buss-trust", subject: "The repeater tax is a wall", body: "Ownership's model shows the new CBA turning this payroll into the most expensive in sports by 2015. The family will pay for a contender, not for nostalgia at max prices.", stance: "warning" },
      ],
      investigations: [
        { id: "market-sweep", label: "Sweep the market", description: "Find out which max-room pitches Paul's camp is actually taking seriously.", intelCost: 1, reveal: "Houston and Atlanta have real room and real presentations. The old Clippers pitch no longer exists in this timeline — Paul's alternative isn't across the hallway, but it is real, and it starts with the word 'featured.'", bonuses: { "full-max": 10, "legacy-structure": 8 } },
      ],
      strategies: [
        {
          id: "full-max", title: "Open with the five-year max", summary: "No theater. Put the largest legal number on the table at 12:01 and make every rival pitch an argument about second place.", approach: "Full commitment / Tax exposure", baseChance: 85, costs: { "cap-flexibility": 14 }, requirements: [],
          success: { stamp: "POINT GOD, SIGNED", headline: "Paul signs at 12:20 AM and the market moves on", detail: "The number ends the conversation before it starts. Paul stays the organizing force of the franchise through his prime, and every promise from December 2011 converts into ink.", effects: [flag("cp3-extended", true, "Paul signs long-term"), relationship("cp3-trust", 14, "Chris Paul trust"), resource("competitive-power", 4, "Competitive power"), relationship("buss-trust", -6, "Ownership trust")] },
          failure: { stamp: "SIGNED, NOT SETTLED", headline: "Paul takes the max and the hierarchy question comes due with it", detail: "The contract makes Paul the franchise's future in writing. Kobe reads the same document and hears a countdown. The alliance that won the West starts negotiating over whose era this is.", effects: [flag("cp3-extended", true, "Paul signs long-term"), relationship("cp3-trust", 8, "Chris Paul trust"), relationship("kobe-trust", -8, "Kobe Bryant trust"), resource("team-cohesion", -4, "Team cohesion")] },
        },
        {
          id: "legacy-structure", title: "Pitch the legacy structure", summary: "Ask both stars to take structured deals that keep a third addition possible — the Spurs' math with Hollywood's marquee.", approach: "Shared sacrifice / Volatile pride", baseChance: 64, costs: { influence: 1 }, requirements: [],
          success: { stamp: "STRUCTURE SURVIVES FIRST CONTACT", headline: "Both camps accept the premise — then Kobe names his condition", detail: "Paul agrees in principle within the hour. Kobe listens, nods, and asks for one term that has nothing to do with money.", effects: [] },
          failure: { stamp: "PRIDE BEATS MATH", headline: "The discount pitch dies inside sixty minutes", detail: "Paul signs anyway — at the full number, with notes. Asking two Hall of Famers to subsidize the roster in the same meeting turned generosity into a ranking exercise.", effects: [flag("cp3-extended", true, "Paul signs at the max"), relationship("cp3-trust", -6, "Chris Paul trust"), relationship("kobe-trust", -5, "Kobe Bryant trust"), resource("cap-flexibility", -10, "Cap flexibility")] },
          counteroffer: {
            advisorId: "kobe-trust", title: "Kobe will take the discount if the last contract is announced as his", detail: "He accepts the structured number on one term: the franchise publicly names this extension his final contract, on his timeline, with no succession language until he says so. Paul's camp will notice what the announcement doesn't say.", acceptLabel: "Give Kobe the farewell terms", declineLabel: "Keep the announcement neutral",
            accept: { stamp: "THE LAST CONTRACT", headline: "Both stars sign structured deals and the era stays open", detail: "Kobe gets his ending on his terms, Paul gets a roster with a future, and the front office gets the only thing it asked for: room for one more move.", effects: [flag("cp3-extended", true, "Paul signs the structured deal"), relationship("kobe-trust", 12, "Kobe Bryant trust"), relationship("cp3-trust", 8, "Chris Paul trust"), resource("cap-flexibility", 10, "Cap flexibility"), resource("team-cohesion", 8, "Team cohesion")] },
            decline: { stamp: "NEUTRAL WORDING, LOUD SILENCE", headline: "The structure holds and Kobe signs a colder version of it", detail: "The math survives; the warmth doesn't. Kobe takes the deal as written and files the meeting where he files everything — as fuel.", effects: [flag("cp3-extended", true, "Paul signs the structured deal"), relationship("kobe-trust", -10, "Kobe Bryant trust"), relationship("cp3-trust", 6, "Chris Paul trust"), resource("cap-flexibility", 8, "Cap flexibility"), relationship("buss-trust", 4, "Ownership trust")] },
          },
        },
        {
          id: "keep-dwight-too", title: "Keep the whole trio", summary: "Max Paul, re-sign Howard, and dare the repeater tax to say no. The most expensive roster ever assembled, defended as the cost of a dynasty.", approach: "Empire price / Board revolt risk", baseChance: 70, costs: { "cap-flexibility": 16, influence: 1 }, requirements: [{ scope: "flag", key: "dwight-era", operator: "equals", value: true }],
          success: { stamp: "EMPIRE FUNDED", headline: "Ownership swallows hard and signs the most expensive roster in sports", detail: "Paul at midnight, Howard at 2 AM, and a tax bill that reads like a misprint. The Buss family buys the dynasty argument for exactly as long as the winning lasts.", effects: [flag("cp3-extended", true, "Paul signs long-term"), resource("competitive-power", 10, "Competitive power"), relationship("cp3-trust", 8, "Chris Paul trust"), relationship("buss-trust", -8, "Ownership trust"), resource("team-cohesion", 4, "Team cohesion")] },
          failure: { stamp: "HOUSTON AT 2 AM", headline: "Paul stays. Howard takes the Rockets' call before yours ends.", detail: "The trio needed both signatures inside three hours and got one. The center walks for nothing, and the tax argument you lost upstairs becomes the roster hole you own downstairs.", effects: [flag("cp3-extended", true, "Paul signs long-term"), flag("dwight-era", false, "Howard leaves for Houston"), resource("competitive-power", -10, "Competitive power"), relationship("buss-trust", 3, "Ownership trust"), resource("team-cohesion", -5, "Team cohesion")] },
        },
        {
          id: "run-it-back", title: "Run it back for the three-peat", summary: "Re-sign Paul, hand the difference-maker you found on the wire a real role, and go all-in on a third straight June with the group you built.", approach: "Dynasty branch / Depth payoff", baseChance: 74, costs: { "cap-flexibility": 9 }, requirements: [{ scope: "flag", key: "free-agent-signed", operator: "equals", value: true }],
          success: { stamp: "THREE-PEAT SEALED", headline: "The roster you assembled runs it back and wins the 2014 title", detail: "Paul signs, the wire addition swings the rotation you were missing, and Los Angeles closes out a third June while the rest of the league is still arguing about the veto that never happened.", effects: [flag("cp3-extended", true, "Paul signs long-term"), banner("title-2014", "2014 NBA CHAMPIONS"), resource("competitive-power", 8, "Competitive power"), relationship("cp3-trust", 6, "Chris Paul trust"), relationship("kobe-trust", 5, "Kobe Bryant trust")] },
          failure: { stamp: "ONE JUNE SHORT", headline: "The band runs it back and comes up a round short", detail: "Paul re-signs and the depth is real, but the miles finally show in May. A proud, expensive team walks off the floor knowing the window is closing on its own terms.", effects: [flag("cp3-extended", true, "Paul signs long-term"), resource("competitive-power", 3, "Competitive power"), resource("cap-flexibility", -6, "Cap flexibility"), relationship("cp3-trust", 4, "Chris Paul trust")] },
        },
        {
          id: "bet-on-loyalty", title: "Bet on loyalty", summary: "Offer the partnership deal — real money, not max money — and trust that eighteen months of December promises kept mean more than a rival's spreadsheet.", approach: "Financial discipline / Franchise risk", baseChance: 45, costs: {}, requirements: [],
          success: { stamp: "LOYALTY, DISCOUNTED", headline: "Paul takes the partnership deal and the books breathe", detail: "The gamble that ends careers pays off instead. Paul signs below his market because the market can't offer him this roster, and ownership owes basketball operations a very public thank-you.", effects: [flag("cp3-extended", true, "Paul signs the partnership deal"), relationship("cp3-trust", 6, "Chris Paul trust"), resource("cap-flexibility", 12, "Cap flexibility"), relationship("buss-trust", 10, "Ownership trust")] },
          failure: { stamp: "THE POINT GOD WALKS", headline: "Houston's max beats your handshake", detail: "The pitch that was supposed to honor the partnership priced it instead. Paul leaves the way stars leave franchises that blink — politely, completely, and for a contender you'll see in May.", departures: ["Chris Paul"], effects: [flag("cp3-extended", false, "Paul leaves in free agency"), relationship("cp3-trust", -25, "Chris Paul trust"), resource("competitive-power", -18, "Competitive power"), resource("team-cohesion", -12, "Team cohesion")] },
        },
      ],
    },
  ],
  endings: [
    { id: "buss-dismissal", eyebrow: "Front-office dismissal", title: "The Family Takes Back the Franchise", summary: "The basketball argument stopped mattering when the trust upstairs ran out. The Buss family removes you from the timeline you authored, and somebody else inherits the backcourt the veto never broke up.", conditions: [{ scope: "relationship", key: "buss-trust", operator: "at-most", value: 10 }] },
    { id: "the-three-peat", eyebrow: "Immortality", title: "The Three-Peat", summary: "Three straight banners for a team the league office tried to prevent from existing. Chris Paul is a champion many times over, Kobe added to his count, and the players you scouted off the wire became the depth that turned a superteam into a dynasty. The 2011 veto becomes the most famous mistake the NBA never made.", conditions: [{ scope: "flag", key: "championships", operator: "at-least", value: 3 }] },
    { id: "fourth-dynasty", eyebrow: "Franchise legacy", title: "The Fourth Lakers Dynasty", summary: "Mikan's, Magic's, Shaq and Kobe's — and now this one. Multiple banners, a protected icon, and the point guard who organized it all. The veto that never happened becomes the league's sorest hypothetical, argued forever by everyone who lost to it.", conditions: [{ scope: "flag", key: "championships", operator: "at-least", value: 2 }, { scope: "resource", key: "competitive-power", operator: "at-least", value: 80 }, { scope: "flag", key: "kobe-healthy", operator: "equals", value: true }] },
    { id: "banner-seventeen", eyebrow: "Franchise legacy", title: "The Seventeenth Banner", summary: "One title with Paul and Bryant sharing a backcourt settles both men's loudest arguments at once — the Point God has his ring, the icon has his sixth, and the front page finally reads the way December 2011 promised it would.", conditions: [{ scope: "flag", key: "championships", operator: "at-least", value: 1 }, { scope: "relationship", key: "cp3-trust", operator: "at-least", value: 62 }] },
    { id: "graceful-handoff", eyebrow: "Franchise legacy", title: "The Handoff", summary: "No new banner, but no broken tendon and no bitter exit either. Kobe's last great years stay great, Paul inherits a franchise instead of a rebuild, and the era ends the way almost none do: on purpose.", conditions: [{ scope: "flag", key: "championships", operator: "equals", value: 0 }, { scope: "resource", key: "kobe-health", operator: "at-least", value: 62 }, { scope: "relationship", key: "cp3-trust", operator: "at-least", value: 66 }] },
    { id: "cold-war-on-figueroa", eyebrow: "Franchise warning", title: "The Cold War on Figueroa", summary: "The roster stayed dangerous and the marriage behind it froze solid. Two Hall of Fame guards spent an era proving a point to each other, and the banners that talent owed the franchise stayed in the argument column.", conditions: [{ scope: "resource", key: "competitive-power", operator: "at-least", value: 78 }, { scope: "relationship", key: "kobe-trust", operator: "at-most", value: 48 }] },
    { id: "basketball-reasons", eyebrow: "Franchise legacy", title: "Basketball Reasons, Revisited", summary: "The trade stood, the era happened, and the ledger came out complicated — some promises kept, some Aprils survived, some questions left for the talk shows. History got its alternate; the debt collectors got their say.", conditions: [] },
  ],
  realHistory: "On December 8, 2011, commissioner David Stern — acting for the league-owned Hornets — vetoed the agreed three-team trade sending Chris Paul to the Lakers, citing 'basketball reasons.' Paul was traded to the Clippers instead, Lamar Odom was dealt to Dallas within the week, and Kobe Bryant ruptured his Achilles in April 2013 carrying a diminished roster. Paul did not reach a Finals until 2021 and never won a championship.",
});
