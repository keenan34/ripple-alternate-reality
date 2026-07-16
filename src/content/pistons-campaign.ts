import { validateCampaign, type CampaignEffect } from "@/lib/campaign/schema";

const resource = (key: string, value: number, label: string): CampaignEffect => ({ scope: "resource", key, operation: "add", value, label });
const relationship = (key: string, value: number, label: string): CampaignEffect => ({ scope: "relationship", key, operation: "add", value, label });
const flag = (key: string, value: boolean | string, label: string): CampaignEffect => ({ scope: "flag", key, operation: "set", value, label });
const banner = (key: string, label: string): CampaignEffect => ({ scope: "banner", key, operation: "set", value: label, label });

const coreDepthChart = [
  { name: "Chauncey Billups", number: 1, position: "PG", depth: 1 },
  { name: "Chucky Atkins", number: 12, position: "PG", depth: 2 },
  { name: "Richard Hamilton", number: 32, position: "SG", depth: 1 },
  { name: "Lindsey Hunter", number: 10, position: "SG", depth: 2 },
  { name: "Tayshaun Prince", number: 22, position: "SF", depth: 1 },
  { name: "Corliss Williamson", number: 34, position: "SF", depth: 2 },
  { name: "Mehmet Okur", number: 13, position: "PF", depth: 1 },
  { name: "Elden Campbell", number: 41, position: "PF", depth: 2 },
  { name: "Ben Wallace", number: 3, position: "C", depth: 1 },
  { name: "Zeljko Rebraca", number: 25, position: "C", depth: 2 },
];

const laterDepthChart = [
  ...coreDepthChart.filter((player) => player.name !== "Elden Campbell"),
  { name: "Antonio McDyess", number: 24, position: "PF", depth: 2 },
];

export const pistonsCampaign = validateCampaign({
  schemaVersion: 1,
  id: "pistons-war-room",
  storySlug: "darko-decision",
  title: "The Second Pick",
  role: "President of Basketball Operations",
  organization: "Detroit Pistons",
  objective: {
    title: "Fix the most famous draft mistake in NBA history",
    description: "Detroit holds the second pick in the loaded 2003 draft. Take the right player, protect the Goin' to Work core, and turn one title window into a dynasty.",
  },
  hero: {
    eyebrow: "Campaign 02 · Detroit",
    title: "Darko never happened.\nThe 2003 draft is yours.",
    tagline: "Six front-office calls decide whether the Goin' to Work era becomes a dynasty.",
    artKey: "war-room",
  },
  resources: [
    { key: "influence", label: "Front-office influence", shortLabel: "Influence", description: "Your political capital with ownership, the coaching staff, and agents. Spend it to force risky calls through or to boost a strategy's odds — it never regenerates.", minimum: 0, maximum: 6, initialValue: 4 },
    { key: "cap-flexibility", label: "Cap flexibility", shortLabel: "Cap", description: "Room under the salary cap and Bill Davidson's tax tolerance. High cap means you can still add players; near zero means every move costs a relationship instead.", minimum: 0, maximum: 100, initialValue: 60 },
    { key: "team-cohesion", label: "Team cohesion", shortLabel: "Cohesion", description: "How much the locker room believes in the plan. Cohesion above 50 quietly improves every strategy's success chance; below 50 it drags them down.", minimum: 0, maximum: 100, initialValue: 66 },
    { key: "competitive-power", label: "Competitive power", shortLabel: "Power", description: "How good the roster actually is. Your primary objective needs this at 78 or higher by the end of the campaign.", minimum: 0, maximum: 100, initialValue: 70 },
    { key: "intel", label: "Intelligence budget", shortLabel: "Intel", description: "Scouting reports you can open before deciding. You get 4 for the whole campaign — revealed intel raises the odds of the strategies it supports.", minimum: 0, maximum: 4, initialValue: 4 },
  ],
  relationships: [
    { key: "brown-trust", name: "Larry Brown", role: "Head coach", initialValue: 58 },
    { key: "wallace-trust", name: "Ben Wallace", role: "Defensive anchor", initialValue: 64 },
    { key: "davidson-trust", name: "Bill Davidson", role: "Owner", initialValue: 60 },
  ],
  initialFlags: { championships: 0, "rookie-star": false, "drafted-player": "none", "sheed-in-detroit": false, "brown-stays": true },
  objectives: [
    { id: "raise-banner", label: "Raise a banner", description: "Win at least one NBA championship in this timeline.", primary: true, condition: { scope: "flag", key: "championships", operator: "at-least", value: 1 } },
    { id: "sixty-wins", label: "Build a 60-win machine", description: "Finish with competitive power of 78 or higher.", primary: true, condition: { scope: "resource", key: "competitive-power", operator: "at-least", value: 78 } },
    { id: "back-to-back", label: "Go back-to-back", description: "Win two championships before the window closes.", primary: false, condition: { scope: "flag", key: "championships", operator: "at-least", value: 2 } },
    { id: "keep-anchor", label: "Keep the anchor", description: "Finish with Ben Wallace trust of 55 or higher.", primary: false, condition: { scope: "relationship", key: "wallace-trust", operator: "at-least", value: 55 } },
    { id: "checkbook", label: "Respect the checkbook", description: "Finish with at least 30 cap flexibility.", primary: false, condition: { scope: "resource", key: "cap-flexibility", operator: "at-least", value: 30 } },
  ],
  turns: [
    {
      id: "draft-night",
      year: 2003,
      date: "June 26, 2003",
      deadline: "Pick 2 is on the clock",
      phase: "Draft night command",
      headline: "Cleveland just took LeBron. Detroit is on the clock, and the Serbian teenager is off your board.",
      brief: "The scouting department spent a year on an 18-year-old in Vršac. You have decided Detroit will not draft him. Three future Hall of Famers are still available, your new head coach famously refuses to play rookies, and a contending roster needs help now.",
      historicalContext: "In reality, Detroit selected Darko Miličić second — ahead of Carmelo Anthony, Chris Bosh, and Dwyane Wade. The Pistons still won the 2004 title, but Darko played only 96 games in Detroit and the pick became shorthand for the road not taken.",
      artKey: "war-room",
      roster: coreDepthChart,
      advisors: [
        { advisorId: "brown-trust", subject: "I don't play rookies", body: "Brown wants a veteran or nothing. Whoever you draft will fight him for every minute, and he wants that understood before the pick is announced.", stance: "warning" },
        { advisorId: "wallace-trust", subject: "Don't draft me a project", body: "Ben anchors the league's best defense right now. He is not interested in babysitting a development plan while his prime burns.", stance: "neutral" },
        { advisorId: "davidson-trust", subject: "Take the best player", body: "Mr. D remembers passing on local kids before. He wants the best player available and will live with the growing pains.", stance: "support" },
      ],
      investigations: [
        { id: "workout-tapes", label: "Review the closed workout tapes", description: "Compare the three lottery prospects side by side one last time.", intelCost: 1, reveal: "Carmelo Anthony is the most NBA-ready scorer in the class. Dwyane Wade's first step grades faster than anything your staff has ever measured — his shooting is the only question mark.", bonuses: { "draft-melo": 10, "draft-wade": 12 } },
        { id: "combine-medicals", label: "Pull the combine medicals", description: "Ask the doctors which body holds up over a decade.", intelCost: 1, reveal: "Chris Bosh's frame projects to add fifteen pounds cleanly. The trade offers on the table are lighter than the market believes.", bonuses: { "draft-bosh": 10, "trade-pick": -6 } },
      ],
      strategies: [
        {
          id: "draft-melo", title: "Draft Carmelo Anthony", summary: "Take the most polished scorer in the class and hand the Goin' to Work defense a first option.", approach: "Instant offense / Coach friction", baseChance: 72, costs: { influence: 1 }, requirements: [],
          acquisition: { always: true, hint: "He just carried a freshman class to a national title and averaged 22 in the tournament.", player: { name: "Carmelo Anthony", number: 15, position: "SF", depth: 1, blurb: "The national-champion freshman with the most ready jump shot in the draft. In our timeline he went third to Denver and made ten All-Star teams." }, reciprocal: { headline: "Denver takes Darko Miličić at No. 3", detail: "Detroit's choice pushes the Serbian teenager one chair down the draft board. Denver pairs Darko with its young frontcourt and inherits the development gamble the Pistons avoided." } },
          success: { stamp: "PICK HEARD ROUND THE LEAGUE", headline: "Detroit drafts Carmelo Anthony second overall", detail: "The pick gives the league's stingiest defense the one thing it never had: a 20-a-night scorer who wants the last shot.", effects: [resource("competitive-power", 8, "Competitive power"), flag("rookie-star", true, "A franchise rookie arrives"), flag("drafted-player", "melo", "Carmelo Anthony is Detroit's pick"), relationship("brown-trust", -6, "Larry Brown trust"), relationship("davidson-trust", 6, "Owner trust")] },
          failure: { stamp: "ROOKIE MEETS BROWN", headline: "Anthony arrives, and Larry Brown starts the cold war", detail: "The talent is obvious. The minutes are not. Brown buries the rookie in film sessions and the locker room quietly picks sides.", effects: [resource("competitive-power", 4, "Competitive power"), flag("rookie-star", true, "A franchise rookie arrives"), flag("drafted-player", "melo", "Carmelo Anthony is Detroit's pick"), relationship("brown-trust", -10, "Larry Brown trust"), resource("team-cohesion", -6, "Team cohesion")] },
          delayed: { turnsLater: 2, headline: "The rookie's rapid growth changes the scouting report", detail: "Opponents now game-plan for Detroit's offense, not just its defense.", effects: [resource("competitive-power", 6, "Competitive power")] },
        },
        {
          id: "draft-wade", title: "Draft Dwyane Wade", summary: "Bet on the fiercest competitor in the class, even with two established guards ahead of him.", approach: "Highest ceiling / Crowded backcourt", baseChance: 66, costs: { influence: 1 }, requirements: [],
          acquisition: { always: true, hint: "Scouts keep flying back to Milwaukee to watch a combo guard nobody can stay in front of.", player: { name: "Dwyane Wade", number: 9, position: "SG", depth: 2, blurb: "The fastest first step your staff has ever timed. Wears 9 in Detroit — Ben Wallace was not giving up the 3. In our timeline he went fifth and won three rings in Miami." }, reciprocal: { headline: "Miami drafts Darko Miličić fifth overall", detail: "With Wade gone, Pat Riley takes the mystery big who once sat atop international boards. The Heat now own Detroit's original development bet, while the Pistons own Miami's future Finals icon." } },
          success: { stamp: "FLASH IN MOTOWN", headline: "Detroit drafts Dwyane Wade second overall", detail: "By December the second unit belongs to him. By April, opposing coaches are asking who scouted the kid from Marquette.", effects: [resource("competitive-power", 9, "Competitive power"), flag("rookie-star", true, "A franchise rookie arrives"), flag("drafted-player", "wade", "Dwyane Wade is Detroit's pick"), resource("team-cohesion", 4, "Team cohesion"), relationship("brown-trust", -4, "Larry Brown trust")] },
          failure: { stamp: "THREE GUARDS, ONE BALL", headline: "Wade arrives and the backcourt becomes a negotiation", detail: "Billups and Hamilton earned their minutes. The rookie deserves his. Somebody's agent calls every week.", effects: [resource("competitive-power", 5, "Competitive power"), flag("rookie-star", true, "A franchise rookie arrives"), flag("drafted-player", "wade", "Dwyane Wade is Detroit's pick"), resource("team-cohesion", -7, "Team cohesion")] },
          delayed: { turnsLater: 2, headline: "The rookie's rapid growth changes the scouting report", detail: "Opponents now game-plan for Detroit's offense, not just its defense.", effects: [resource("competitive-power", 6, "Competitive power")] },
        },
        {
          id: "draft-bosh", title: "Draft Chris Bosh", summary: "Take the stretch big whose game answers the question the roster will be asking in three years.", approach: "Future-proof / Patience required", baseChance: 76, costs: {}, requirements: [],
          acquisition: { always: true, hint: "A wiry nineteen-year-old in Atlanta shoots like a guard and blocks shots like a center.", player: { name: "Chris Bosh", number: 4, position: "PF", depth: 2, blurb: "A face-up big a decade ahead of his era. In our timeline he went fourth to Toronto and made eleven straight All-Star teams." }, reciprocal: { headline: "Toronto makes Darko Miličić its new centerpiece", detail: "Bosh's move to Detroit leaves Toronto staring at the same size-and-upside case Joe Dumars rejected. The Raptors take Darko fourth and commit their rebuild to his development." } },
          success: { stamp: "THE QUIET PICK", headline: "Detroit drafts Chris Bosh second overall", detail: "No fireworks, no controversy — just the frontcourt heir apparent learning championship habits behind Ben Wallace.", effects: [resource("competitive-power", 6, "Competitive power"), flag("rookie-star", true, "A franchise rookie arrives"), flag("drafted-player", "bosh", "Chris Bosh is Detroit's pick"), relationship("wallace-trust", 5, "Ben Wallace trust"), relationship("brown-trust", -3, "Larry Brown trust")] },
          failure: { stamp: "SLOW BURN", headline: "Bosh needs time Detroit's window may not have", detail: "The talent is real and the timeline is wrong. A contender's veterans watch a teenager take minutes they wanted for a title run.", effects: [resource("competitive-power", 3, "Competitive power"), flag("rookie-star", true, "A franchise rookie arrives"), flag("drafted-player", "bosh", "Chris Bosh is Detroit's pick"), resource("team-cohesion", -5, "Team cohesion")] },
          delayed: { turnsLater: 3, headline: "The stretch big's development bill comes due — with interest", detail: "The face-up game that looked early now looks inevitable.", effects: [resource("competitive-power", 7, "Competitive power")] },
        },
        {
          id: "trade-pick", title: "Trade the pick for veteran help", summary: "Turn the second pick into a proven starter and a future first, and keep Larry Brown's rotation rookie-free.", approach: "Win now / Ceiling capped", baseChance: 85, costs: {}, requirements: [],
          acquisition: { always: true, hint: "Memphis is willing to move its elite young wing defender if Detroit sends the second pick back west.", player: { name: "Shane Battier", number: 31, position: "SF", depth: 2, blurb: "The proven two-way wing Larry Brown wanted: a disciplined defender, willing spacer, and instant playoff rotation piece entering his third season." } },
          success: { stamp: "BROWN'S ROSTER", headline: "Detroit trades the pick for Shane Battier and a future first", detail: "Battier is the proven two-way starter Brown wanted, and Detroit extracts another protected pick. Nobody has to argue about rookie minutes.", effects: [resource("competitive-power", 5, "Competitive power"), relationship("brown-trust", 10, "Larry Brown trust"), resource("cap-flexibility", 5, "Cap flexibility"), relationship("davidson-trust", -4, "Owner trust")] },
          failure: { stamp: "THE HAUL SHRINKS", headline: "Shane Battier arrives, but the rest of Detroit's return underwhelms", detail: "Every GM knows Detroit doesn't want the teenager. Battier helps immediately, but the extra first is so heavily protected that ownership sees a starter sold as a haul.", effects: [resource("competitive-power", 1, "Competitive power"), relationship("davidson-trust", -8, "Owner trust"), relationship("brown-trust", 4, "Larry Brown trust")] },
        },
      ],
    },
    {
      id: "sheed-deadline",
      year: 2004,
      date: "February 19, 2004",
      deadline: "3:00 PM ET",
      phase: "Trade deadline",
      headline: "Portland will move its volcanic All-Star forward. Three teams are on the call.",
      brief: "Detroit is second in the East with the league's best defense and a half-court offense that stalls in the playoffs. A three-team framework would land a stretch four with a temper, an expiring deal, and a championship skill set.",
      historicalContext: "In reality, Joe Dumars sent Lindsey Hunter, Chucky Atkins, and a first to land Rasheed Wallace at this deadline. Sheed became the final piece of the 2004 champions.",
      artKey: "deadline-board",
      promptVariants: [
        { conditions: [{ scope: "flag", key: "drafted-player", operator: "equals", value: "wade" }], headline: "Dwyane Wade has cracked Detroit's rotation. Now Portland is offering the veteran frontcourt piece that could finish the roster.", brief: "Wade's downhill game changed the second unit and raised the ceiling. The remaining weakness is size and shooting at the four, where Portland's volatile All-Star fits perfectly and threatens the minutes balance Brown only just settled." },
        { conditions: [{ scope: "flag", key: "drafted-player", operator: "equals", value: "melo" }], headline: "Carmelo Anthony has solved Detroit's scoring problem. Portland is offering a frontcourt star who could make the lineup complete—or combustible.", brief: "Anthony already commands late possessions, so this is no longer a search for offense. The question is whether adding another strong personality and another scorer makes the contender unguardable or fractures Brown's hierarchy." },
        { conditions: [{ scope: "flag", key: "drafted-player", operator: "equals", value: "bosh" }], headline: "Chris Bosh is growing into Detroit's frontcourt. Portland is offering the veteran who could accelerate him—or take his role.", brief: "Bosh needs playoff minutes to develop, while Rasheed Wallace is ready to win tonight. Trading for the veteran raises the championship odds and forces an immediate choice about the rookie's place in the rotation." },
      ],
      roster: coreDepthChart,
      advisors: [
        { advisorId: "brown-trust", subject: "I can coach him", body: "Brown has wanted a four who can guard, shoot, and talk since the day he arrived. He is personally vouching for the fit.", stance: "support" },
        { advisorId: "wallace-trust", subject: "Get me my running mate", body: "Ben has guarded two positions at once for three years. He wants the frontcourt partner and doesn't care about the reputation.", stance: "support" },
        { advisorId: "davidson-trust", subject: "The technicals travel", body: "Ownership sees the talent and also sees the league-leading technical count. It wants a plan for the temperament, not a shrug.", stance: "warning" },
      ],
      investigations: [
        { id: "portland-locker", label: "Call around the Portland locker room", description: "Find out who the forward actually is when the cameras are off.", intelCost: 1, reveal: "Teammates swear by him. The technicals are theater; the film study is monastic. Every locker room he's been in would take him back.", bonuses: { "trade-sheed": 14 } },
        { id: "market-scan", label: "Scan the wing market", description: "Price the quieter alternatives before the deadline forces your hand.", intelCost: 1, reveal: "New Orleans will move George Lynch for a second-rounder. The ceiling is lower; so is every risk attached.", bonuses: { "small-deal": 10 } },
      ],
      strategies: [
        {
          id: "trade-sheed", title: "Make the three-team call", summary: "Send the guards and the pick. Land the stretch four who completes the identity.", approach: "All in / Temperament risk", baseChance: 74, costs: { "cap-flexibility": 10 }, requirements: [],
          acquisition: { hint: "A four-time All-Star in the Northwest can guard Duncan, stretch the floor, and hit the biggest shot of a series.", player: { name: "Rasheed Wallace", number: 30, position: "PF", depth: 1, blurb: "The stretch four with a championship IQ and a league-leading technical count. In our timeline this exact trade made the 2004 Pistons champions." } },
          success: { stamp: "SHEED COMES HOME", headline: "Detroit lands Rasheed Wallace at the deadline", detail: "The fit is instant. The defense becomes historic, the huddles get louder, and the East suddenly runs through Detroit.", effects: [resource("competitive-power", 12, "Competitive power"), resource("team-cohesion", 6, "Team cohesion"), flag("sheed-in-detroit", true, "Rasheed Wallace joins the core"), relationship("wallace-trust", 8, "Ben Wallace trust")] },
          failure: { stamp: "THIRD TEAM BLINKS", headline: "The three-team framework collapses at the deadline", detail: "The middle team pulls out with an hour left. Detroit's cap sheet paid the price of a deal that never closed.", effects: [resource("competitive-power", -3, "Competitive power"), relationship("davidson-trust", -6, "Owner trust"), relationship("wallace-trust", -5, "Ben Wallace trust")] },
        },
        {
          id: "small-deal", title: "Add quiet depth instead", summary: "Trade for a veteran defensive wing, keep the guards, and trust the defense to travel in May.", approach: "Low risk / Lower ceiling", baseChance: 88, costs: { "cap-flexibility": 4 }, requirements: [],
          acquisition: { always: true, hint: "A respected veteran in New Orleans can defend either wing spot and will not ask for touches.", player: { name: "George Lynch", number: 7, position: "SF", depth: 3, blurb: "A rugged 6'8\" defender with Finals experience, added to absorb difficult wing minutes without changing Detroit's identity." } },
          success: { stamp: "DEPTH WINS ROUNDS", headline: "Detroit adds the eighth man every playoff team needs", detail: "No headlines, no locker-room variables — just twelve more reliable minutes a night for a team built on reliability.", effects: [resource("competitive-power", 5, "Competitive power"), resource("team-cohesion", 4, "Team cohesion"), relationship("davidson-trust", 5, "Owner trust")] },
          failure: { stamp: "EIGHT MEN DEEP, ONE SHORT", headline: "The safe move leaves the ceiling untouched", detail: "The rotation is deeper and the fatal flaw is identical. The film from last May still applies.", effects: [resource("competitive-power", 1, "Competitive power"), relationship("wallace-trust", -4, "Ben Wallace trust")] },
        },
        {
          id: "stand-firm", title: "Stand firm", summary: "This roster is already first in defense. Keep the assets and dare the East to score on it.", approach: "Patient / Locker-room risk", baseChance: 92, costs: {}, requirements: [],
          success: { stamp: "BELIEF AS STRATEGY", headline: "Detroit tells the room: you are enough", detail: "The front office bets on the group it built, and the group hears it. The cap sheet enters summer untouched.", effects: [resource("cap-flexibility", 6, "Cap flexibility"), resource("team-cohesion", 5, "Team cohesion"), relationship("davidson-trust", 6, "Owner trust"), resource("competitive-power", -2, "Competitive power")] },
          failure: { stamp: "QUIET PHONE, LOUD ROOM", headline: "The deadline passes and the stars notice", detail: "Every contender improved except the one with the league's best defense. The veterans start asking what the assets are for.", effects: [relationship("wallace-trust", -7, "Ben Wallace trust"), resource("team-cohesion", -5, "Team cohesion"), resource("competitive-power", -3, "Competitive power")] },
        },
      ],
    },
    {
      id: "lakers-finals",
      year: 2004,
      date: "June 15, 2004",
      deadline: "Game 5 tips at 9:00 PM",
      phase: "NBA Finals",
      headline: "Detroit leads the Lakers 3-1. One more night decides whether the dynasty talk starts here or in Los Angeles.",
      brief: "Shaq is averaging a monster series. Kobe is forcing everything. The Palace is sold out for a closeout game, and the coaching staff wants a final answer on the defensive plan.",
      historicalContext: "In reality, the 2004 Pistons finished this series 4-1 in one of the great Finals upsets — single-covering Shaq, walling off Kobe, and burying the Lakers' superteam.",
      artKey: "playoff-tunnel",
      promptVariants: [
        { conditions: [{ scope: "flag", key: "drafted-player", operator: "equals", value: "wade" }], headline: "Detroit leads 3-1, and rookie Dwyane Wade has become the downhill threat Los Angeles cannot keep out of the paint.", brief: "Wade forced his way into the starting group by spring. The Lakers are loading the lane against him, Shaq is still destroying single coverage, and Brown must decide whether the rookie closes the biggest game of the year.", historicalContext: "In our history Wade was preparing for his second season in Miami while Detroit beat Los Angeles without a perimeter star. This timeline puts his first championship chance in Detroit." },
        { conditions: [{ scope: "flag", key: "drafted-player", operator: "equals", value: "melo" }], headline: "Detroit leads 3-1, and Carmelo Anthony is one home win from becoming a rookie champion and Finals closer.", brief: "Anthony is already the half-court scorer Detroit lacked, but Brown still distrusts rookie possessions late. The Lakers cannot hide an old forward on him and still protect Shaq inside.", historicalContext: "In our history Anthony watched these Finals from Denver after a first-round exit. Here, Detroit's defense has carried him to the edge of a title in year one." },
        { conditions: [{ scope: "flag", key: "drafted-player", operator: "equals", value: "bosh" }], headline: "Detroit leads 3-1, and Chris Bosh gives the frontcourt a spacing answer the Lakers never prepared to defend.", brief: "Bosh has grown from apprentice to starter during the run. Pulling a big away from the rim opens the floor, but asking a teenager to anchor a Finals adjustment changes the risk entirely.", historicalContext: "In our history Bosh was finishing his rookie year in Toronto while Detroit won with defense and balance. Here, his face-up game is already part of the championship plan." },
      ],
      roster: coreDepthChart,
      advisors: [
        { advisorId: "brown-trust", subject: "Play the right way", body: "Brown wants no gimmicks: single Shaq, wall the paint, make Kobe a volume shooter. He's asking the front office to hold its nerve with him.", stance: "support" },
        { advisorId: "wallace-trust", subject: "Let me take him alone", body: "Ben wants Shaq one-on-one and the shooters run off the line. He has waited his whole career for this assignment.", stance: "support" },
        { advisorId: "davidson-trust", subject: "Finish it at home", body: "Mr. D has owned this team for thirty years and never seen a closeout Finals game at the Palace. He wants no Game 6 in Los Angeles.", stance: "neutral" },
      ],
      investigations: [
        { id: "lakers-fracture", label: "Probe the Lakers' locker room", description: "The feud is public. Find out how deep it actually runs before Game 5.", intelCost: 1, reveal: "The Kobe-Shaq cold war is worse than reported — late-clock possessions collapse into one-on-one theater. Force them to co-exist and the offense eats itself.", bonuses: { "wall-the-paint": 12, "trap-kobe": 8 } },
      ],
      strategies: [
        {
          id: "wall-the-paint", title: "Single Shaq, wall off Kobe", summary: "Trust Ben Wallace alone on the giant and put two bodies on every Kobe drive.", approach: "The right way / Nerve required", baseChance: 78, costs: { influence: 1 }, requirements: [],
          success: { stamp: "GOIN' TO WORK, GONE TO GLORY", headline: "The Pistons are 2004 NBA champions", detail: "Five men on a string dismantle a superteam. The Palace shakes, Larry Brown cries, and the blueprint becomes the league's obsession.", effects: [banner("title-2004", "2004 NBA CHAMPIONS"), resource("competitive-power", 8, "Competitive power"), resource("team-cohesion", 10, "Team cohesion"), relationship("brown-trust", 10, "Larry Brown trust"), relationship("davidson-trust", 8, "Owner trust")] },
          failure: { stamp: "THE GIANT ANSWERS", headline: "Shaq drags the series back to Los Angeles — and takes it", detail: "The single coverage holds for three quarters a night and collapses in the fourth. The Lakers win three straight, and Detroit spends the summer explaining a 3-1 lead.", effects: [resource("competitive-power", -7, "Competitive power"), resource("team-cohesion", -8, "Team cohesion"), relationship("davidson-trust", -6, "Owner trust")] },
        },
        {
          id: "trap-kobe", title: "Trap Kobe full court", summary: "Take the ball out of Kobe's hands entirely and force the supporting cast to beat you.", approach: "Aggressive / Foul trouble risk", baseChance: 68, costs: { influence: 1 }, requirements: [],
          success: { stamp: "MOTOWN'S CROWN", headline: "The Pistons are 2004 NBA champions", detail: "The traps turn Kobe into a decoy and the role players shrink from the moment. Detroit closes it at the Palace.", effects: [banner("title-2004", "2004 NBA CHAMPIONS"), resource("competitive-power", 7, "Competitive power"), resource("team-cohesion", 9, "Team cohesion"), relationship("brown-trust", 6, "Larry Brown trust"), relationship("davidson-trust", 8, "Owner trust")] },
          failure: { stamp: "WHISTLES AND FREE THROWS", headline: "The trapping scheme sends the Lakers to the line 44 times", detail: "The gamble bleeds fouls, the bench gets exposed, and the series turns on a parade to the free-throw line.", effects: [resource("competitive-power", -6, "Competitive power"), resource("team-cohesion", -6, "Team cohesion"), relationship("brown-trust", -6, "Larry Brown trust")] },
        },
        {
          id: "run-the-lakers", title: "Push the tempo on old legs", summary: "Karl Malone is hurt and Payton can't keep up anymore. Make Game 5 a track meet.", approach: "Volatile / Age exploit", baseChance: 60, costs: {}, requirements: [],
          success: { stamp: "FAST BREAK TO A BANNER", headline: "The Pistons are 2004 NBA champions", detail: "Detroit runs a tired dynasty off the floor. It's not the Pistons' identity — it's better: it's whatever wins tonight.", effects: [banner("title-2004", "2004 NBA CHAMPIONS"), resource("competitive-power", 9, "Competitive power"), resource("team-cohesion", 7, "Team cohesion"), relationship("davidson-trust", 8, "Owner trust")] },
          failure: { stamp: "PACE CUTS BOTH WAYS", headline: "The track meet wakes up the wrong superstar", detail: "Open floor means open Shaq sprints and Kobe in transition. The identity abandoned, the series slips away in seven.", effects: [resource("competitive-power", -8, "Competitive power"), resource("team-cohesion", -9, "Team cohesion"), relationship("brown-trust", -8, "Larry Brown trust")] },
        },
        {
          id: "wade-closer", title: "Give Wade the closing possessions", summary: "Turn the rookie loose against Payton and make the Lakers contain the first step for forty-eight minutes.", approach: "Your timeline / Wade required", baseChance: 74, costs: {}, requirements: [{ scope: "flag", key: "drafted-player", operator: "equals", value: "wade" }],
          success: { stamp: "FLASH ARRIVES EARLY", headline: "Wade closes the Lakers and becomes a champion at twenty-two", detail: "The rookie lives at the rim, owns the fourth quarter, and changes Detroit's hierarchy in one night.", effects: [banner("title-2004", "2004 NBA CHAMPIONS"), resource("competitive-power", 10, "Competitive power"), resource("team-cohesion", 8, "Team cohesion")] },
          failure: { stamp: "ROOKIE WALL", headline: "Los Angeles loads the paint and forces Wade into a lesson", detail: "The first step gets him into traffic and no farther. Brown retakes the controls after the series slips away.", effects: [resource("competitive-power", -5, "Competitive power"), relationship("brown-trust", -7, "Larry Brown trust")] },
        },
        {
          id: "melo-closer", title: "Clear a side for Carmelo", summary: "Make the rookie scorer the answer every time the half-court offense stalls.", approach: "Your timeline / Melo required", baseChance: 72, costs: {}, requirements: [{ scope: "flag", key: "drafted-player", operator: "equals", value: "melo" }],
          success: { stamp: "MELO'S PALACE", headline: "Anthony shoots Detroit to the 2004 championship", detail: "Every late clock ends on the same elbow and every answer falls. Detroit finds its closer years ahead of schedule.", effects: [banner("title-2004", "2004 NBA CHAMPIONS"), resource("competitive-power", 11, "Competitive power"), resource("team-cohesion", 7, "Team cohesion")] },
          failure: { stamp: "TOO MUCH, TOO SOON", headline: "The rookie isolation diet freezes Detroit's five-man machine", detail: "The shots are makeable and the offense becomes predictable. Los Angeles drags the series back west.", effects: [resource("competitive-power", -6, "Competitive power"), resource("team-cohesion", -5, "Team cohesion")] },
        },
        {
          id: "bosh-spacing", title: "Start Bosh as the stretch five", summary: "Pull Shaq away from the paint and turn Detroit's youngest player into the geometry of the series.", approach: "Your timeline / Bosh required", baseChance: 70, costs: {}, requirements: [{ scope: "flag", key: "drafted-player", operator: "equals", value: "bosh" }],
          success: { stamp: "THE FUTURE SPREADS OUT", headline: "Bosh stretches Detroit to a 2004 championship", detail: "Shaq cannot guard the arc and the rim at once. The rookie makes the impossible choice visible on every possession.", effects: [banner("title-2004", "2004 NBA CHAMPIONS"), resource("competitive-power", 10, "Competitive power"), relationship("wallace-trust", 6, "Ben Wallace trust")] },
          failure: { stamp: "LIGHT FRONTCOURT", headline: "The spacing works until Shaq turns every miss into a collision", detail: "Bosh creates room and gives it back on the glass. The experiment arrives one season too early.", effects: [resource("competitive-power", -6, "Competitive power"), relationship("wallace-trust", -5, "Ben Wallace trust")] },
        },
      ],
    },
    {
      id: "spurs-game7",
      year: 2005,
      date: "June 23, 2005",
      deadline: "Game 7 in San Antonio",
      phase: "NBA Finals",
      headline: "Game 7 against the Spurs. Forty-eight minutes between this core and back-to-back immortality.",
      brief: "The series is a rock fight between the two best defenses of the decade. Duncan is exhausted, Ginóbili is a live wire, and your staff has one last chance to tilt a coin-flip game.",
      historicalContext: "In reality, the 2005 Finals went the distance and Duncan's Spurs survived Game 7 at home, 81-74. It remains the closest Detroit ever came to a repeat.",
      artKey: "playoff-tunnel",
      roster: laterDepthChart,
      advisors: [
        { advisorId: "wallace-trust", subject: "Give me Duncan, no help", body: "Ben wants the Duncan assignment straight up so the shooters can't breathe. It worked for stretches of Game 5; he wants the full 48.", stance: "support" },
        { advisorId: "brown-trust", subject: "Ginóbili decides this", body: "The coaching staff's film says Duncan is spent — the series lives and dies with Ginóbili's chaos. Take him away and the Spurs are mortal.", stance: "neutral" },
        { advisorId: "davidson-trust", subject: "Leave nothing", body: "Ownership has no notes on strategy. It has one request: however this ends, empty the tank.", stance: "support" },
      ],
      investigations: [
        { id: "duncan-ankle", label: "Verify Duncan's ankle", description: "The big man has looked human. Find out how human before you set the coverage.", intelCost: 1, reveal: "The ankle is worse than reported — lateral push-offs are costing him. Single coverage holds if the wall shows early.", bonuses: { "smother-manu": 10, "duncan-straight-up": 14 } },
        { id: "sheed-focus", label: "Take the frontcourt's temperature", description: "One ill-timed defensive gamble already cost a game this series. Ask who wants the moment.", intelCost: 1, reveal: "The frontcourt wants a defined rule: no leaving shooters, no matter what. Give them one absolute and they will not break it.", bonuses: { "smother-manu": 8 } },
      ],
      strategies: [
        {
          id: "duncan-straight-up", title: "Guard Duncan straight up", summary: "Trust the anchor one-on-one against a hobbled superstar and stay glued to every shooter.", approach: "Discipline / Anchor bet", baseChance: 66, costs: { influence: 1 }, requirements: [],
          success: { stamp: "BACK TO BACK", headline: "The Pistons win Game 7 and repeat as champions", detail: "Ben Wallace plays the game of his life on a hobbled Duncan, and the wall never cracks. Two straight titles — the word is dynasty now.", effects: [banner("title-2005", "2005 NBA CHAMPIONS"), resource("competitive-power", 8, "Competitive power"), resource("team-cohesion", 9, "Team cohesion"), relationship("wallace-trust", 12, "Ben Wallace trust"), relationship("davidson-trust", 8, "Owner trust")] },
          failure: { stamp: "EIGHTY-ONE TO SEVENTY-FOUR", headline: "Duncan finds fifteen quiet points and San Antonio survives", detail: "The ankle holds up just enough. The rock fight ends the way road Game 7s usually do, and the locker room ages a year in one night.", effects: [resource("competitive-power", -5, "Competitive power"), resource("team-cohesion", -6, "Team cohesion"), relationship("wallace-trust", -4, "Ben Wallace trust")] },
        },
        {
          id: "smother-manu", title: "Blitz Ginóbili off the floor", summary: "Assign your best perimeter pest to deny Ginóbili every catch and make Duncan create alone on one ankle.", approach: "Film-room bet / Rotation strain", baseChance: 72, costs: { influence: 1 }, requirements: [],
          success: { stamp: "REPEAT COMPLETE", headline: "The Pistons win Game 7 and repeat as champions", detail: "Ginóbili never gets loose, Duncan runs out of legs, and Detroit's five-man string strangles the last great defense standing. Back-to-back.", effects: [banner("title-2005", "2005 NBA CHAMPIONS"), resource("competitive-power", 8, "Competitive power"), resource("team-cohesion", 9, "Team cohesion"), relationship("brown-trust", 8, "Larry Brown trust"), relationship("davidson-trust", 8, "Owner trust")] },
          failure: { stamp: "THE THIRD MAN", headline: "Horry and Parker beat the scheme built for someone else", detail: "The blitzes hold Ginóbili down and open the exact corners the film session warned about. San Antonio's role players end the repeat.", effects: [resource("competitive-power", -5, "Competitive power"), resource("team-cohesion", -6, "Team cohesion"), relationship("brown-trust", -5, "Larry Brown trust")] },
        },
        {
          id: "unleash-sheed", title: "Run the offense through Rasheed", summary: "Duncan can't slide on that ankle. Make him defend the stretch four thirty feet from the rim all night.", approach: "Matchup hunt / Requires Sheed", baseChance: 76, costs: {}, requirements: [{ scope: "flag", key: "sheed-in-detroit", operator: "equals", value: true }],
          success: { stamp: "SHEED'S NIGHT", headline: "The Pistons win Game 7 and repeat as champions", detail: "Rasheed drags Duncan to the perimeter and shoots San Antonio out of its own building. The trade that won 2004 wins 2005 too.", effects: [banner("title-2005", "2005 NBA CHAMPIONS"), resource("competitive-power", 9, "Competitive power"), resource("team-cohesion", 8, "Team cohesion"), relationship("wallace-trust", 8, "Ben Wallace trust"), relationship("davidson-trust", 8, "Owner trust")] },
          failure: { stamp: "POPOVICH ADJUSTS", headline: "San Antonio switches the matchup dead by halftime", detail: "The Spurs put Bowen on the four, hide Duncan on the weak side, and the matchup hunt becomes a turnover festival.", effects: [resource("competitive-power", -5, "Competitive power"), resource("team-cohesion", -5, "Team cohesion")] },
        },
      ],
    },
    {
      id: "brown-summer",
      year: 2005,
      date: "July 19, 2005",
      deadline: "Press conference at noon",
      phase: "Coaching crisis",
      headline: "Larry Brown spent the Finals run flirting with the Cavaliers' front office. The locker room read every word.",
      brief: "The most decorated coach in the sport wants a bigger title and a listening tour. The veterans feel betrayed, ownership feels used, and every day without a decision costs the franchise credibility.",
      historicalContext: "In reality, Detroit and Larry Brown separated in July 2005 after his public flirtations, and Flip Saunders took over a team that kept winning 60 games but never won another title.",
      artKey: "contract-table",
      roster: laterDepthChart,
      advisors: [
        { advisorId: "brown-trust", subject: "One more year, my way", body: "Brown insists the Cleveland talks were noise. He wants an extension, an apology tour on his terms, and more say over the roster.", stance: "neutral" },
        { advisorId: "wallace-trust", subject: "The room has moved on", body: "Ben speaks for the veterans: they'll play for Brown if told to, but the trust is spent. Whatever you choose, choose fast.", stance: "warning" },
        { advisorId: "davidson-trust", subject: "Nobody is bigger than the team", body: "Mr. D built this franchise on loyalty. He will pay a coach, but he will not chase one who negotiates through back channels.", stance: "warning" },
      ],
      investigations: [
        { id: "agent-sweep", label: "Sweep the coaching market", description: "Quietly price the available replacements before deciding Brown's future.", intelCost: 1, reveal: "An offense-first coach with playoff scars is available and the veterans respect him. The drop-off, if any, is smaller than the headlines will claim.", bonuses: { "hire-flip": 12, "back-brown": -4 } },
      ],
      strategies: [
        {
          id: "back-brown", title: "Extend Larry Brown", summary: "Swallow the flirtation, pay the Hall of Famer, and bet the locker room follows winning.", approach: "Continuity / Pride swallowed", baseChance: 64, costs: { influence: 1 }, requirements: [],
          success: { stamp: "THE TEACHER STAYS", headline: "Brown signs the extension and owns the apology", detail: "The mea culpa lands because it's specific. The veterans grumble, then remember the man wins everywhere he goes.", effects: [relationship("brown-trust", 14, "Larry Brown trust"), resource("competitive-power", 5, "Competitive power"), resource("team-cohesion", -3, "Team cohesion")] },
          failure: { stamp: "FOOL ME TWICE", headline: "Brown re-signs and resumes the listening tour by spring", detail: "The extension buys a season of half-in leadership. The locker room notices before the media does.", effects: [relationship("brown-trust", 4, "Larry Brown trust"), resource("team-cohesion", -9, "Team cohesion"), relationship("wallace-trust", -6, "Ben Wallace trust")] },
          counteroffer: { advisorId: "brown-trust", title: "Brown wants final say on the rotation — in writing", detail: "He'll stay, but he wants contractual control over minutes and matchups, including any young star you drafted. Accepting keeps the best coach alive; it also hands him your development plan.", acceptLabel: "Give him the rotation", declineLabel: "Keep roster authority", accept: { stamp: "BROWN'S BALL", headline: "Detroit hands Larry Brown the keys", detail: "The offense tightens, the veterans buy back in, and every young player's minutes now run through the coach's whistle.", effects: [relationship("brown-trust", 16, "Larry Brown trust"), resource("competitive-power", 4, "Competitive power"), resource("influence", -1, "Front-office influence"), resource("team-cohesion", 4, "Team cohesion")], delayed: { turnsLater: 1, headline: "The rotation clause bites the youth movement", detail: "The young core's development stalls under playoff-only minutes.", effects: [resource("competitive-power", -4, "Competitive power")] } }, decline: { stamp: "AUTHORITY KEPT", headline: "Detroit refuses the rotation clause and Brown walks", detail: "The line holds and the partnership ends. The franchise keeps its plan and loses its Hall of Famer.", effects: [relationship("brown-trust", -12, "Larry Brown trust"), flag("brown-stays", false, "Larry Brown departs"), resource("team-cohesion", 3, "Team cohesion"), relationship("davidson-trust", 6, "Owner trust")] } },
        },
        {
          id: "hire-flip", title: "Move on to the offense-first coach", summary: "Thank Brown at the podium, hire the coach who modernizes the offense, and reset the room.", approach: "Clean break / Playoff unknowns", baseChance: 80, costs: {}, requirements: [],
          success: { stamp: "NEW VOICE", headline: "Detroit turns the page and the offense wakes up", detail: "The sets open up, the stars get easier shots, and the franchise proves the system outlasts any single voice.", effects: [flag("brown-stays", false, "Larry Brown departs"), resource("competitive-power", 6, "Competitive power"), resource("team-cohesion", 6, "Team cohesion"), relationship("davidson-trust", 6, "Owner trust"), relationship("brown-trust", -8, "Larry Brown trust")] },
          failure: { stamp: "REGULAR SEASON COACH", headline: "The new offense hums until the games slow down", detail: "Sixty wins, prettier basketball — and a nagging question about who calls the last play of a Game 7.", effects: [flag("brown-stays", false, "Larry Brown departs"), resource("competitive-power", 3, "Competitive power"), resource("team-cohesion", 2, "Team cohesion"), relationship("brown-trust", -8, "Larry Brown trust")] },
        },
        {
          id: "let-him-dangle", title: "Let Brown twist publicly", summary: "Neither extend nor fire him. Make the Hall of Famer coach for his reputation on an expiring deal.", approach: "Leverage play / Morale hazard", baseChance: 55, costs: {}, requirements: [],
          success: { stamp: "PROVE-IT YEAR", headline: "Brown coaches angry and the team feeds on it", detail: "The awkwardness becomes fuel. Brown coaches the season of his life to prove the flirtation meant nothing.", effects: [relationship("brown-trust", -4, "Larry Brown trust"), resource("competitive-power", 7, "Competitive power"), resource("team-cohesion", 3, "Team cohesion")] },
          failure: { stamp: "LAME DUCK, LOUD ROOM", headline: "The standoff poisons the season", detail: "Every loss becomes a referendum, every rotation choice a conspiracy. The veterans stop playing for the whistle.", effects: [relationship("brown-trust", -10, "Larry Brown trust"), resource("team-cohesion", -10, "Team cohesion"), relationship("wallace-trust", -5, "Ben Wallace trust")] },
        },
      ],
    },
    {
      id: "big-ben-decision",
      year: 2006,
      date: "July 3, 2006",
      deadline: "Chicago's offer expires at midnight",
      phase: "Free agency command",
      headline: "Chicago just offered Ben Wallace $60 million. The heart of the franchise is standing in your doorway.",
      brief: "Four Defensive Player of the Year trophies, one icon, and a body with a decade of collisions on it. The Bulls' offer is real, the owner's patience with the tax is finite, and whatever you decide becomes the story of this era's ending — or its extension.",
      historicalContext: "In reality, Ben Wallace left for Chicago in July 2006 on a four-year, $60 million deal. Detroit kept winning regular-season games, but the Goin' to Work era never lifted another banner.",
      artKey: "contract-table",
      roster: laterDepthChart,
      advisors: [
        { advisorId: "wallace-trust", subject: "I never asked to be recruited", body: "Ben has been the franchise's identity for six years and has never once been the highest-paid player on his own team. He isn't asking for a hometown discount again.", stance: "warning" },
        { advisorId: "brown-trust", subject: "Bodies age, identities don't", body: "The coaching staff's projection is honest: the rebounding declines are already visible on film. The leadership is not replaceable. Choose which one you're paying for.", stance: "neutral" },
        { advisorId: "davidson-trust", subject: "I'll pay for banners", body: "Mr. D will authorize the tax for a championship roster. He will not authorize it for a farewell tour. Tell him which one this is.", stance: "warning" },
      ],
      investigations: [
        { id: "medical-projection", label: "Commission the aging curve", description: "Ask the medical staff to project the anchor's next four seasons honestly.", intelCost: 1, reveal: "Two more elite defensive seasons, then a steep cliff. Years three and four of any max-style deal are dead money — but years one and two can anchor a contender.", bonuses: { "match-chicago": 8, "sign-and-trade": 10 } },
      ],
      strategies: [
        {
          id: "match-chicago", title: "Beat Chicago's offer", summary: "Pay the icon what the market says and keep the identity intact to the end.", approach: "Loyalty / Cap pain", baseChance: 82, costs: { "cap-flexibility": 16 }, requirements: [],
          freeAgent: { name: "Ben Wallace", position: "C", note: "Four-time Defensive Player of the Year · incumbent icon" },
          success: { stamp: "THE FIST STAYS", headline: "Ben Wallace re-signs and the Palace roars", detail: "The face of the franchise finishes what he started. The deal will hurt in year four; tonight, nobody in Detroit cares.", effects: [relationship("wallace-trust", 15, "Ben Wallace trust"), resource("team-cohesion", 8, "Team cohesion"), resource("competitive-power", 5, "Competitive power"), relationship("davidson-trust", -6, "Owner trust")] },
          failure: { stamp: "PAID PAST THE PEAK", headline: "The contract lands a year after the prime left", detail: "The loyalty is rewarded and the decline arrives on schedule. The books now own the choice for four more summers.", effects: [relationship("wallace-trust", 10, "Ben Wallace trust"), resource("competitive-power", -4, "Competitive power"), resource("cap-flexibility", -6, "Cap flexibility"), relationship("davidson-trust", -8, "Owner trust")] },
          counteroffer: { advisorId: "davidson-trust", title: "Ownership will pay — if you own the tax", detail: "Mr. D will approve the full match, but the luxury-tax overage becomes your personal ledger: your remaining influence backs the bill. Decline, and the match shrinks to a three-year offer Ben may read as an insult.", acceptLabel: "Back the bill personally", declineLabel: "Offer three years instead", accept: { stamp: "ALL IN ON THE ANCHOR", headline: "Detroit matches every dollar and the era gets its ending", detail: "The franchise keeps its soul and the front office spends its last political capital to do it.", effects: [resource("influence", -2, "Front-office influence"), relationship("wallace-trust", 14, "Ben Wallace trust"), resource("team-cohesion", 8, "Team cohesion"), resource("competitive-power", 5, "Competitive power")] }, decline: { stamp: "THREE-YEAR COMPROMISE", headline: "The shorter offer keeps the books clean and cools the room", detail: "Ben signs it — and remembers it. The balance sheet wins a negotiation the locker room needed to lose.", effects: [relationship("wallace-trust", 4, "Ben Wallace trust"), resource("cap-flexibility", 6, "Cap flexibility"), relationship("davidson-trust", 6, "Owner trust"), resource("team-cohesion", -4, "Team cohesion")] } },
        },
        {
          id: "sign-nazr", title: "Sign Nazr Mohammed", summary: "Let Ben take Chicago's offer and use the market to replace his minutes with a younger veteran center.", approach: "Free-agent pivot / Identity loss", baseChance: 78, costs: { "cap-flexibility": 8 }, requirements: [],
          freeAgent: { name: "Nazr Mohammed", position: "C", note: "Age 28 · championship experience · unrestricted free agent" },
          acquisition: { always: true, hint: "A Detroit-born center with a championship ring is prepared to take the starting job.", player: { name: "Nazr Mohammed", number: 13, position: "C", depth: 1, blurb: "A sturdy veteran center and 2005 champion, signed to replace Ben Wallace's minutes without replacing his mythology." } },
          success: { stamp: "THE PIVOT LANDS", headline: "Detroit signs Nazr Mohammed and stays structurally sound", detail: "The defense loses its terror and keeps its shape. Mohammed absorbs the position while the drafted star becomes the new identity.", departures: ["Ben Wallace"], effects: [resource("cap-flexibility", 5, "Cap flexibility"), resource("competitive-power", 1, "Competitive power"), relationship("davidson-trust", 7, "Owner trust"), relationship("wallace-trust", -14, "Ben Wallace trust")] },
          failure: { stamp: "A NAMEPLATE, NOT AN ANCHOR", headline: "Mohammed arrives and the paint still feels empty", detail: "The signing fills the roster slot, not the leadership vacuum. Detroit learns the difference every night.", departures: ["Ben Wallace"], effects: [resource("competitive-power", -6, "Competitive power"), resource("team-cohesion", -7, "Team cohesion"), relationship("wallace-trust", -16, "Ben Wallace trust")] },
        },
        {
          id: "sign-and-trade", title: "Negotiate a sign-and-trade", summary: "Send Ben where he chooses and bring back Tyson Chandler plus a protected future first.", approach: "Cold-eyed / Return maximized", baseChance: 62, costs: { influence: 1 }, requirements: [],
          acquisition: { hint: "Chicago has a 23-year-old seven-footer whose defense is ready now, even if his offense still needs a runway.", player: { name: "Tyson Chandler", number: 6, position: "C", depth: 1, blurb: "A 7'1\" defensive center entering his prime. Chicago planned to move him after signing Ben; in this timeline Detroit makes Chandler the centerpiece of the sign-and-trade return, along with a protected future first." } },
          success: { stamp: "BUSINESS DONE RIGHT", headline: "Detroit sends Ben home with Tyson Chandler coming back", detail: "Ben gets his money and chosen destination. Detroit receives a younger defensive center and a protected future first, turning a painful farewell into an actual succession plan.", departures: ["Ben Wallace"], effects: [resource("competitive-power", 4, "Competitive power"), resource("cap-flexibility", 10, "Cap flexibility"), relationship("davidson-trust", 8, "Owner trust"), relationship("wallace-trust", -8, "Ben Wallace trust")] },
          failure: { stamp: "AGENT HANGS UP", headline: "The sign-and-trade collapses and Ben walks for nothing", detail: "Chicago's clean offer beats Detroit's clever one. The franchise loses the player, the return, and a piece of its story in one midnight.", departures: ["Ben Wallace"], effects: [relationship("wallace-trust", -14, "Ben Wallace trust"), resource("competitive-power", -6, "Competitive power"), resource("team-cohesion", -8, "Team cohesion")] },
        },
        {
          id: "let-ben-walk", title: "Thank him and let him go", summary: "Take the cap room, trust the succession plan, and let the icon leave on Chicago's dollar.", approach: "Financially ruthless / Identity cost", baseChance: 90, costs: {}, requirements: [],
          success: { stamp: "COLD MATH", headline: "Detroit lets its heart walk and banks the room", detail: "The spreadsheet wins. The cap opens, the tax vanishes, and the franchise bets its future on everything except sentiment.", departures: ["Ben Wallace"], effects: [resource("cap-flexibility", 14, "Cap flexibility"), relationship("davidson-trust", 8, "Owner trust"), relationship("wallace-trust", -16, "Ben Wallace trust"), resource("team-cohesion", -8, "Team cohesion"), resource("competitive-power", -5, "Competitive power")] },
          failure: { stamp: "EMPTY MIDDLE", headline: "The room is clean and the paint is wide open", detail: "The money was saved and never spent on anything that mattered. Opposing bigs feast, and the fans chant a departed man's name.", departures: ["Ben Wallace"], effects: [resource("cap-flexibility", 10, "Cap flexibility"), relationship("wallace-trust", -16, "Ben Wallace trust"), resource("team-cohesion", -10, "Team cohesion"), resource("competitive-power", -8, "Competitive power")] },
        },
      ],
    },
  ],
  endings: [
    {
      id: "owner-fired-you",
      eyebrow: "Front-office dismissal",
      title: "The Owner Takes the Keys",
      summary: "Trust with Bill Davidson collapsed below the point a winning argument could repair. Ownership ends the experiment, removes you from basketball operations, and hands the timeline to somebody else.",
      conditions: [{ scope: "relationship", key: "davidson-trust", operator: "at-most", value: 10 }],
    },
    {
      id: "detroit-dynasty",
      eyebrow: "Franchise legacy",
      title: "The Deee-troit Dynasty",
      summary: "Two banners, a superstar the real Pistons never drafted, and a culture that outlasted every ego inside it. The 2003 war room becomes the case study every front office teaches.",
      conditions: [
        { scope: "flag", key: "championships", operator: "at-least", value: 2 },
        { scope: "relationship", key: "wallace-trust", operator: "at-least", value: 55 },
      ],
    },
    {
      id: "banner-and-books",
      eyebrow: "Franchise legacy",
      title: "The Sustainable Contender",
      summary: "A championship in the trophy case, a balance sheet ownership brags about, and a roster that never mortgaged its future. Not the loudest dynasty — the longest one.",
      conditions: [
        { scope: "flag", key: "championships", operator: "at-least", value: 1 },
        { scope: "resource", key: "cap-flexibility", operator: "at-least", value: 30 },
      ],
    },
    {
      id: "talent-whisperer",
      eyebrow: "Franchise legacy",
      title: "The Talent Whisperer",
      summary: "The banner count can be argued. The draft night cannot: you found the superstar Detroit spent two decades wishing it had taken, and built a team the whole league feared.",
      conditions: [
        { scope: "flag", key: "rookie-star", operator: "equals", value: true },
        { scope: "resource", key: "competitive-power", operator: "at-least", value: 78 },
      ],
    },
    {
      id: "almost-era",
      eyebrow: "Franchise legacy",
      title: "The Almost Era",
      summary: "Every spring ended a round short of the story you were building. Detroit stayed proud and competitive — and learned that avoiding one famous mistake doesn't guarantee you avoid the quiet ones.",
      conditions: [],
    },
  ],
  realHistory: "Detroit drafted Darko Miličić second overall in 2003, passing on Carmelo Anthony, Chris Bosh, and Dwyane Wade. The Pistons still won the 2004 title and reached six straight conference finals, but lost the 2005 Finals in seven games, let Ben Wallace leave in 2006, and never raised another banner. Darko played 96 games in Detroit.",
});
