import { validateCampaign, type CampaignEffect } from "@/lib/campaign/schema";

const resource = (key: string, value: number, label: string): CampaignEffect => ({ scope: "resource", key, operation: "add", value, label });
const relationship = (key: string, value: number, label: string): CampaignEffect => ({ scope: "relationship", key, operation: "add", value, label });
const flag = (key: string, value: boolean | string, label: string): CampaignEffect => ({ scope: "flag", key, operation: "set", value, label });
const banner = (key: string, label: string): CampaignEffect => ({ scope: "banner", key, operation: "set", value: label, label });

const roster2012 = [
  { name: "Derrick Rose", number: 1, position: "PG", depth: 1 },
  { name: "C.J. Watson", number: 7, position: "PG", depth: 2 },
  { name: "Richard Hamilton", number: 32, position: "SG", depth: 1 },
  { name: "Ronnie Brewer", number: 11, position: "SG", depth: 2 },
  { name: "Jimmy Butler", number: 21, position: "SG", depth: 3 },
  { name: "Luol Deng", number: 9, position: "SF", depth: 1 },
  { name: "Kyle Korver", number: 26, position: "SF", depth: 2 },
  { name: "Carlos Boozer", number: 5, position: "PF", depth: 1 },
  { name: "Taj Gibson", number: 22, position: "PF", depth: 2 },
  { name: "Joakim Noah", number: 13, position: "C", depth: 1 },
  { name: "Omer Asik", number: 3, position: "C", depth: 2 },
];

const roster2014 = [
  { name: "Derrick Rose", number: 1, position: "PG", depth: 1 },
  { name: "Kirk Hinrich", number: 12, position: "PG", depth: 2 },
  { name: "C.J. Watson", number: 7, position: "PG", depth: 3 },
  { name: "Jimmy Butler", number: 21, position: "SG", depth: 1 },
  { name: "Ronnie Brewer", number: 11, position: "SG", depth: 2 },
  { name: "Luol Deng", number: 9, position: "SF", depth: 1 },
  { name: "Kyle Korver", number: 26, position: "SF", depth: 2 },
  { name: "Mike Dunleavy", number: 34, position: "SF", depth: 3 },
  { name: "Carlos Boozer", number: 5, position: "PF", depth: 1 },
  { name: "Taj Gibson", number: 22, position: "PF", depth: 2 },
  { name: "Joakim Noah", number: 13, position: "C", depth: 1 },
  { name: "Omer Asik", number: 3, position: "C", depth: 2 },
];

const roster2015 = roster2014.filter((player) => player.name !== "Carlos Boozer");

const title2012 = {
  turnsLater: 1,
  headline: "Chicago finishes the run and wins the 2012 NBA championship",
  detail: "Rose controls the Finals, Noah owns the glass, and the deepest defense in basketball finally gives Chicago its seventh banner.",
  effects: [banner("title-2012", "2012 NBA CHAMPIONS"), resource("competitive-power", 7, "Competitive power"), relationship("rose-trust", 8, "Derrick Rose trust"), relationship("thibs-trust", 7, "Tom Thibodeau trust")],
};

const title2015 = {
  turnsLater: 1,
  headline: "The healthy Bulls finish the road and win the 2015 NBA championship",
  detail: "Cleveland never recovers from Chicago's fourth-quarter answer. The Bulls clear Atlanta and outlast Golden State before the dynasty learns how to begin.",
  effects: [banner("title-2015", "2015 NBA CHAMPIONS"), resource("competitive-power", 8, "Competitive power"), relationship("rose-trust", 8, "Derrick Rose trust"), relationship("butler-trust", 8, "Jimmy Butler trust"), relationship("reinsdorf-trust", 7, "Owner trust")],
};

export const roseCampaign = validateCampaign({
  schemaVersion: 1,
  id: "rose-war-room",
  storySlug: "rose-never-hurt",
  title: "The Rose That Grew from Concrete",
  role: "Executive VP, Basketball Operations",
  organization: "Chicago Bulls",
  objective: {
    title: "Give Chicago the healthy Derrick Rose era it never got",
    description: "Protect the youngest MVP in league history without wasting his prime, build the right roster around him, and decide whether the Bulls' uncompromising culture becomes a dynasty or burns itself out.",
  },
  hero: {
    eyebrow: "Campaign 03 · Chicago",
    title: "The Rose That Grew\nfrom Concrete.",
    tagline: "Six decisions determine whether a healthy MVP changes one postseason—or an entire decade.",
    artKey: "playoff-tunnel",
  },
  resources: [
    { key: "influence", label: "Front-office influence", shortLabel: "Influence", description: "Political capital with ownership, the coaching staff, and agents. Spend it to force contested decisions through; it never regenerates.", minimum: 0, maximum: 6, initialValue: 4 },
    { key: "cap-flexibility", label: "Cap flexibility", shortLabel: "Cap", description: "Room beneath the tax line and Jerry Reinsdorf's willingness to spend. High cap preserves optionality; low cap makes every addition a political fight.", minimum: 0, maximum: 100, initialValue: 58 },
    { key: "team-cohesion", label: "Team cohesion", shortLabel: "Cohesion", description: "How fully the locker room trusts the plan. Strong cohesion improves every forecast; a divided room makes even obvious calls fragile.", minimum: 0, maximum: 100, initialValue: 72 },
    { key: "competitive-power", label: "Competitive power", shortLabel: "Power", description: "The roster's real championship strength. Chicago begins as a contender, but standing still will not keep pace with Miami and Cleveland.", minimum: 0, maximum: 100, initialValue: 78 },
    { key: "rose-health", label: "Rose workload reserve", shortLabel: "Health", description: "The physical margin protecting Rose's explosiveness across long playoff runs. High health means the franchise learned to preserve its engine.", minimum: 0, maximum: 100, initialValue: 82 },
    { key: "intel", label: "Intelligence budget", shortLabel: "Intel", description: "Scouting, medical, and agent reports you can open before deciding. You receive four for the entire campaign.", minimum: 0, maximum: 4, initialValue: 4 },
  ],
  relationships: [
    { key: "rose-trust", name: "Derrick Rose", role: "Franchise MVP", initialValue: 70 },
    { key: "thibs-trust", name: "Tom Thibodeau", role: "Head coach", initialValue: 66 },
    { key: "butler-trust", name: "Jimmy Butler", role: "Emerging two-way wing", initialValue: 48 },
    { key: "reinsdorf-trust", name: "Jerry Reinsdorf", role: "Owner", initialValue: 60 },
  ],
  initialFlags: {
    "rose-healthy": true,
    "rose-managed": false,
    "closeout-plan": "unset",
    "bench-plan": "unset",
    "secondary-creator": "none",
    "star-signing": "none",
    "butler-elevated": false,
    "thibs-stays": true,
    championships: 0,
  },
  objectives: [
    { id: "raise-banner", label: "Finish the run", description: "Win at least one championship with Rose leading Chicago.", primary: true, condition: { scope: "flag", key: "championships", operator: "at-least", value: 1 } },
    { id: "protect-mvp", label: "Protect the MVP", description: "Finish with Rose's workload reserve at 70 or higher.", primary: true, condition: { scope: "resource", key: "rose-health", operator: "at-least", value: 70 } },
    { id: "sustain-window", label: "Sustain a contender", description: "Finish with competitive power at 80 or higher.", primary: true, condition: { scope: "resource", key: "competitive-power", operator: "at-least", value: 80 } },
    { id: "two-banners", label: "Build the dynasty", description: "Win championships in two different versions of the roster.", primary: false, condition: { scope: "flag", key: "championships", operator: "at-least", value: 2 } },
    { id: "share-franchise", label: "Make room for Jimmy", description: "Finish with Jimmy Butler's trust at 62 or higher.", primary: false, condition: { scope: "relationship", key: "butler-trust", operator: "at-least", value: 62 } },
    { id: "keep-room", label: "Keep the locker room", description: "Finish with team cohesion at 62 or higher.", primary: false, condition: { scope: "resource", key: "team-cohesion", operator: "at-least", value: 62 } },
    { id: "respect-books", label: "Preserve another move", description: "Finish with at least 25 cap flexibility.", primary: false, condition: { scope: "resource", key: "cap-flexibility", operator: "at-least", value: 25 } },
  ],
  turns: [
    {
      id: "philadelphia-closeout",
      year: 2012,
      date: "April 28, 2012",
      deadline: "1:22 remaining",
      phase: "Eastern Conference First Round · Game 1",
      headline: "Chicago leads by twelve. Rose is still on the floor.",
      brief: "The game is functionally over, but Philadelphia has not emptied its bench. Thibodeau wants one clean possession before he pulls the starters. Your medical staff wants the MVP sitting now.",
      historicalContext: "In reality, Rose drove into traffic with 1:22 left and tore the ACL in his left knee. He missed the entire next season, later suffered two meniscus tears, and Chicago's title window never returned intact.",
      artKey: "playoff-tunnel",
      roster: roster2012,
      advisors: [
        { advisorId: "thibs-trust", subject: "Finish the possession", body: "Thibodeau believes habits survive because stars execute them when the result feels decided. He wants one organized trip, then the horn.", stance: "warning" },
        { advisorId: "rose-trust", subject: "I am not asking out", body: "Rose feels fine and hates symbolic protection. He will follow the call, but he wants it made for basketball reasons—not fear.", stance: "neutral" },
        { advisorId: "reinsdorf-trust", subject: "Protect the asset", body: "Ownership sees the score, the contract, and the downside. The instruction is plain: do not expose the franchise to a meaningless minute.", stance: "support" },
      ],
      investigations: [
        { id: "movement-screen", label: "Check Rose's live movement screen", description: "Ask performance staff whether fatigue has changed his landing mechanics tonight.", intelCost: 1, reveal: "Rose's acceleration remains elite, but his last three decelerations have drifted inward. The staff recommends no more live traffic tonight.", bonuses: { "empty-bench": 12, "stagger-exit": 8, "finish-possession": -8 } },
      ],
      strategies: [
        {
          id: "empty-bench", title: "Empty the bench now", summary: "Signal timeout, remove every starter, and make workload discipline an organizational rule before anyone can debate it.", approach: "Maximum protection / Coach friction", baseChance: 92, costs: {}, requirements: [],
          success: { stamp: "SEVENTY-TWO SECONDS SAVED", headline: "Rose sits, Chicago wins, and nothing breaks", detail: "The MVP watches the final possession with a towel over his shoulders. The rule feels excessive for one night and essential for everything after it.", effects: [resource("rose-health", 8, "Rose workload reserve"), relationship("reinsdorf-trust", 8, "Owner trust"), relationship("thibs-trust", -7, "Tom Thibodeau trust"), flag("rose-managed", true, "Rose enters a workload plan"), flag("closeout-plan", "pull", "Chicago pulls its stars early")] },
          failure: { stamp: "THE RUN THAT DID NOT MATTER", headline: "Philadelphia cuts the margin and Chicago still leaves healthy", detail: "The bench makes the box score untidy. Nobody remembers the final margin when Rose walks through the tunnel without a limp.", effects: [resource("rose-health", 6, "Rose workload reserve"), resource("team-cohesion", -3, "Team cohesion"), relationship("thibs-trust", -9, "Tom Thibodeau trust"), flag("rose-managed", true, "Rose enters a workload plan"), flag("closeout-plan", "pull", "Chicago pulls its stars early")] },
        },
        {
          id: "stagger-exit", title: "Call timeout and stagger the exits", summary: "Let Rose initiate once without entering the paint, then substitute all five players at the next whistle.", approach: "Shared authority / One-possession risk", baseChance: 81, costs: {}, requirements: [],
          success: { stamp: "ONE CLEAN TRIP", headline: "Rose organizes the possession and walks off whole", detail: "The ball never enters traffic. Rose points to the bench, Thibodeau gets his execution, and the performance staff gets the boundary it demanded.", effects: [resource("rose-health", 5, "Rose workload reserve"), relationship("rose-trust", 5, "Derrick Rose trust"), relationship("thibs-trust", 3, "Tom Thibodeau trust"), flag("rose-managed", true, "Rose enters a workload plan"), flag("closeout-plan", "stagger", "Chicago staggers star exits")] },
          failure: { stamp: "MESSAGE MUDDLED", headline: "The compromise protects Rose and satisfies nobody", detail: "Rose stays above the arc and exits safely, but both basketball operations and the coaching staff claim the possession proved their point.", effects: [resource("rose-health", 3, "Rose workload reserve"), resource("team-cohesion", -5, "Team cohesion"), relationship("reinsdorf-trust", -4, "Owner trust"), flag("rose-managed", true, "Rose enters a workload plan"), flag("closeout-plan", "stagger", "Chicago staggers star exits")] },
        },
        {
          id: "finish-possession", title: "Let the MVP close it", summary: "Trust Rose and Thibodeau to finish the possession exactly as they would in a one-score game.", approach: "Player trust / Maximum exposure", baseChance: 67, costs: {}, requirements: [],
          success: { stamp: "THE FOOT PLANTS CLEAN", headline: "Rose rises, kicks to Korver, and jogs into the alternate timeline", detail: "The pass reaches the corner before the second defender arrives. Rose lands on balance. The possession that ended an era in our history becomes an ordinary assist.", effects: [relationship("rose-trust", 9, "Derrick Rose trust"), relationship("thibs-trust", 8, "Tom Thibodeau trust"), resource("competitive-power", 3, "Competitive power"), resource("rose-health", -4, "Rose workload reserve"), flag("closeout-plan", "ride", "Chicago rides its stars") ] },
          failure: { stamp: "WARNING WITHOUT CATASTROPHE", headline: "Rose turns an ankle—and the knee survives", detail: "The arena goes silent before Rose stands. The scan is clean, the lesson is not, and Chicago enters May knowing it spent risk for nothing.", effects: [resource("rose-health", -12, "Rose workload reserve"), relationship("reinsdorf-trust", -10, "Owner trust"), relationship("rose-trust", 3, "Derrick Rose trust"), flag("closeout-plan", "ride", "Chicago rides its stars") ] },
        },
      ],
    },
    {
      id: "miami-rematch",
      year: 2012,
      date: "May 21, 2012",
      deadline: "36 hours to Game 2",
      phase: "Eastern Conference Finals",
      headline: "Miami is loading three defenders toward Rose again.",
      brief: "Chicago survived Philadelphia and Boston with the MVP intact. The Heat remember the 2011 formula: trap Rose, ignore the weakest shooter, and force every late possession through the same narrow door.",
      historicalContext: "The 2011 Heat eliminated Chicago in five by crowding Rose late. The 2012 Bulls again earned the East's best record, but Rose's ACL tear prevented the rematch this roster had spent a year preparing for.",
      artKey: "war-room",
      roster: roster2012,
      promptVariants: [
        { conditions: [{ scope: "flag", key: "closeout-plan", operator: "equals", value: "pull" }], headline: "The rotation is fresh. Miami still owns last year's answer.", brief: "Your workload rule survived two rounds and Rose has the best legs in the series. Thibodeau now wants to cash in every minute you saved by shrinking the rotation against Miami." },
        { conditions: [{ scope: "flag", key: "closeout-plan", operator: "equals", value: "ride" }], headline: "Rose trusts the ball in his hands. Miami is betting everything on it.", brief: "You backed the MVP's instincts in Philadelphia. Miami now turns that trust into a tactical question: keep asking Rose to break the trap, or move the decision somewhere else." },
      ],
      advisors: [
        { advisorId: "rose-trust", subject: "Give me the second defender", body: "Rose does not want the ball protected from pressure. He wants the release valve positioned where the next pass can punish it.", stance: "support" },
        { advisorId: "thibs-trust", subject: "Defense still travels", body: "Thibodeau believes the series turns on transition defense and rebounding. He will change the offense only if the new structure protects the floor behind it.", stance: "neutral" },
        { advisorId: "butler-trust", subject: "The rookie can take a shift", body: "Jimmy Butler has barely played. The development staff believes his size can absorb LeBron minutes and preserve Deng for offense.", stance: "neutral" },
      ],
      investigations: [
        { id: "heat-trap-map", label: "Map every Miami trap", description: "Chart where the Heat sent the second defender in the 2011 series.", intelCost: 1, reveal: "Miami's low man leaves the strong-side corner early whenever Noah screens. Korver's gravity or a Noah short roll can force the rotation to declare itself.", bonuses: { "korver-spacing": 13, "noah-hub": 11, "rose-gauntlet": -4, "ten-man-wave": 6 } },
      ],
      strategies: [
        {
          id: "korver-spacing", title: "Start Korver and stretch the trap", summary: "Trade a defensive matchup for the shooter Miami refuses to leave and make every double-team cross the entire floor.", approach: "Spacing / Defensive exposure", baseChance: 72, costs: {}, requirements: [],
          success: { stamp: "THE CORNER STAYS HOME", headline: "Miami's trap breaks before Rose does", detail: "Korver's first three forces Wade to stay attached. Rose reaches the paint with one defender, and the entire geometry of the rematch changes.", effects: [resource("competitive-power", 9, "Competitive power"), relationship("rose-trust", 7, "Derrick Rose trust"), resource("team-cohesion", 5, "Team cohesion")], delayed: title2012 },
          failure: { stamp: "TARGET FOUND", headline: "Miami scores through the shooter Chicago needed", detail: "The floor opens at one end and catches fire at the other. The series becomes a race Chicago's defense was built to prevent.", effects: [resource("competitive-power", -6, "Competitive power"), relationship("thibs-trust", -7, "Tom Thibodeau trust"), resource("team-cohesion", -4, "Team cohesion")] },
        },
        {
          id: "noah-hub", title: "Run the offense through Noah", summary: "Let Rose surrender the first pass, cut behind the trap, and trust Noah to play four-on-three from the elbow.", approach: "Structural change / Frontcourt reads", baseChance: 76, costs: { influence: 1 }, requirements: [],
          success: { stamp: "THE SECOND ENGINE", headline: "Noah turns Miami's pressure into Chicago's advantage", detail: "Every trap gives Noah a runway and Rose a moving defense. The Bulls stop asking one player to solve five defenders.", effects: [resource("competitive-power", 10, "Competitive power"), relationship("rose-trust", 6, "Derrick Rose trust"), relationship("thibs-trust", 5, "Tom Thibodeau trust"), resource("team-cohesion", 7, "Team cohesion")], delayed: title2012 },
          failure: { stamp: "PASSING WINDOW CLOSED", headline: "Miami turns Noah's reads into a transition track meet", detail: "The concept is right and the processing speed is not. Live-ball turnovers feed the one opponent Chicago cannot defend while retreating.", effects: [resource("competitive-power", -7, "Competitive power"), resource("team-cohesion", -5, "Team cohesion"), relationship("rose-trust", -3, "Derrick Rose trust")] },
        },
        {
          id: "rose-gauntlet", title: "Put every late possession in Rose's hands", summary: "Shrink the rotation, flatten the floor, and bet the healthy MVP solves the defense built specifically for him.", approach: "Star power / Workload cost", baseChance: 69, costs: {}, requirements: [{ scope: "flag", key: "rose-managed", operator: "equals", value: false }],
          success: { stamp: "MVP ANSWER", headline: "Rose beats the coverage that defined him", detail: "The pull-up arrives before the trap and the rim attacks arrive after it retreats. Miami runs out of places to send the second body.", effects: [resource("competitive-power", 11, "Competitive power"), relationship("rose-trust", 10, "Derrick Rose trust"), resource("rose-health", -9, "Rose workload reserve")], delayed: title2012 },
          failure: { stamp: "SAME WALL, HEALTHIER BODY", headline: "Rose survives the gauntlet and Chicago does not", detail: "The knee holds. The old offensive burden does too. Miami makes one superstar carry every answer until the series runs out.", effects: [resource("competitive-power", -8, "Competitive power"), resource("rose-health", -12, "Rose workload reserve"), relationship("reinsdorf-trust", -6, "Owner trust")] },
        },
        {
          id: "ten-man-wave", title: "Turn the series into a ten-man fight", summary: "Use Butler on LeBron, preserve the starters' legs, and attack Miami with the depth that won 50 games in 66 nights.", approach: "Depth / Rookie responsibility", baseChance: 74, costs: {}, requirements: [{ scope: "flag", key: "rose-managed", operator: "equals", value: true }],
          success: { stamp: "EVERY BODY COUNTS", headline: "Chicago's depth exhausts the Heat", detail: "Butler steals eight credible minutes, the Bench Mob changes the pace, and Rose reaches every closing stretch with another gear.", effects: [resource("competitive-power", 9, "Competitive power"), resource("rose-health", 6, "Rose workload reserve"), relationship("butler-trust", 10, "Jimmy Butler trust"), resource("team-cohesion", 8, "Team cohesion")], delayed: title2012 },
          failure: { stamp: "PLAYOFF ROTATION TAX", headline: "Miami hunts every reserve Chicago tries to protect", detail: "The extra rest cannot repay the points lost before Rose returns. The rookie learns, and the window pays tuition.", effects: [resource("competitive-power", -6, "Competitive power"), relationship("thibs-trust", -6, "Tom Thibodeau trust"), relationship("butler-trust", 4, "Jimmy Butler trust")] },
        },
      ],
    },
    {
      id: "bench-mob-summer",
      year: 2012,
      date: "July 18, 2012",
      deadline: "48 hours to the Asik deadline",
      phase: "Restricted Free Agency",
      headline: "Houston's poison-pill offer forces a choice about Chicago's depth.",
      brief: "Omer Asik has signed a three-year offer sheet designed to punish Chicago in the final season. Korver, Watson, and Brewer can be retained only if ownership accepts a tax bill for a bench that just proved its playoff value.",
      historicalContext: "In reality, Chicago declined to match Houston's offer for Asik, moved Korver to Atlanta, and let Watson and Brewer go. The celebrated Bench Mob was replaced while Rose recovered from ACL surgery.",
      artKey: "contract-table",
      roster: roster2012,
      promptVariants: [
        { conditions: [{ scope: "flag", key: "championships", operator: "at-least", value: 1 }], headline: "A banner makes every reserve more expensive—and harder to discard.", brief: "The parade confirmed that Chicago's depth could survive four rounds. Houston now prices Asik like a starter, while ownership asks whether sentiment is about to become the league's largest bench bill." },
      ],
      advisors: [
        { advisorId: "reinsdorf-trust", subject: "The third year is the trap", body: "Ownership will pay for a contender, not for four backups at escalating numbers. Match Asik only if another salary leaves.", stance: "warning" },
        { advisorId: "thibs-trust", subject: "Do not dismantle the defense", body: "Thibodeau built distinct units with shared habits. Remove the second center and two wing defenders at once, and the starters absorb every missing minute.", stance: "support" },
        { advisorId: "rose-trust", subject: "Find one more creator", body: "Rose values the Bench Mob, but the playoffs showed the offense still needs someone who can bend a defense while he sits.", stance: "neutral" },
      ],
      investigations: [
        { id: "tax-ledger", label: "Audit the three-year tax ledger", description: "Model every retention path through the final season of Asik's offer.", intelCost: 1, reveal: "Keeping all four reserves creates a severe third-year bill. Keeping Korver and the wing group is manageable; adding a proven bench creator offers the highest playoff upside per dollar.", bonuses: { "match-asik": 5, "keep-bench-mob": 9, "sign-crawford": 12 } },
      ],
      strategies: [
        {
          id: "match-asik", title: "Match Omer Asik", summary: "Keep the defensive center, accept the balloon payment, and replace the perimeter bench with minimum contracts.", approach: "Rim protection / Tax exposure", baseChance: 79, costs: { "cap-flexibility": 15 }, requirements: [], freeAgent: { name: "Omer Asik", position: "C", note: "Restricted free agent · elite reserve defender · three-year poison pill" },
          success: { stamp: "THE PAINT STAYS CLOSED", headline: "Chicago matches Asik and preserves forty-eight minutes of rim protection", detail: "Noah can play with full violence because Asik owns every minute behind him. The perimeter bench becomes the bill's casualty.", departures: ["Kyle Korver", "C.J. Watson", "Ronnie Brewer"], effects: [flag("bench-plan", "asik", "Chicago matches Omer Asik"), resource("competitive-power", 6, "Competitive power"), relationship("thibs-trust", 8, "Tom Thibodeau trust"), relationship("reinsdorf-trust", -8, "Owner trust")] },
          failure: { stamp: "YEAR THREE ARRIVES EARLY", headline: "Asik stays and the contract controls every next conversation", detail: "The defense remains elite, but agents and rival teams know exactly which future season can squeeze Chicago.", departures: ["Kyle Korver", "C.J. Watson", "Ronnie Brewer"], effects: [flag("bench-plan", "asik", "Chicago matches Omer Asik"), resource("cap-flexibility", -8, "Cap flexibility"), relationship("reinsdorf-trust", -12, "Owner trust"), resource("competitive-power", 2, "Competitive power")] },
        },
        {
          id: "keep-bench-mob", title: "Keep Korver, Watson, and Brewer", summary: "Let Asik walk, preserve the perimeter unit, and trust Noah and Gibson to cover the backup center minutes.", approach: "Continuity / Thin at center", baseChance: 84, costs: { "cap-flexibility": 8 }, requirements: [],
          success: { stamp: "THE MOB REMAINS", headline: "Chicago keeps the bench identity that Miami could not rest against", detail: "Korver stretches second units, Watson keeps pace, and Brewer protects the hardest wing assignment available.", departures: ["Omer Asik"], effects: [flag("bench-plan", "mob", "Chicago keeps the perimeter Bench Mob"), resource("competitive-power", 6, "Competitive power"), resource("team-cohesion", 9, "Team cohesion"), relationship("thibs-trust", 6, "Tom Thibodeau trust")] },
          failure: { stamp: "NO SECOND CENTER", headline: "The Bench Mob stays and every Noah foul becomes an emergency", detail: "The perimeter group remains connected, but the frontcourt loses the safety net that allowed Thibodeau's defense to attack.", departures: ["Omer Asik"], effects: [flag("bench-plan", "mob", "Chicago keeps the perimeter Bench Mob"), resource("competitive-power", -2, "Competitive power"), resource("team-cohesion", 5, "Team cohesion"), relationship("reinsdorf-trust", -5, "Owner trust")] },
        },
        {
          id: "sign-crawford", title: "Sign Jamal Crawford as the second creator", summary: "Let the defensive bench scatter and spend the available money on a guard who can manufacture offense without Rose.", approach: "Shot creation / Identity change", baseChance: 71, costs: { "cap-flexibility": 11 }, requirements: [], freeAgent: { name: "Jamal Crawford", position: "SG", note: "Unrestricted free agent · instant offense · Sixth Man profile" },
          acquisition: { always: true, hint: "A Chicago-raised scorer is choosing between another contender's bench and a homecoming with the ball in his hands.", player: { name: "Jamal Crawford", number: 6, position: "SG", depth: 2, blurb: "The improvisational bench scorer Chicago's Rose-dependent offense never had. In our timeline Crawford signed with the Clippers and won Sixth Man of the Year twice more." } },
          success: { stamp: "SECOND HANDLE FOUND", headline: "Jamal Crawford comes home and gives Rose a real release valve", detail: "For the first time, Chicago can lose structure without losing the possession. Crawford turns broken plays into a bench offense.", departures: ["Omer Asik", "Kyle Korver", "C.J. Watson", "Ronnie Brewer"], effects: [flag("bench-plan", "creator", "Chicago replaces the Bench Mob"), flag("secondary-creator", "crawford", "Jamal Crawford becomes the second creator"), resource("competitive-power", 8, "Competitive power"), relationship("rose-trust", 8, "Derrick Rose trust"), relationship("thibs-trust", -5, "Tom Thibodeau trust")] },
          failure: { stamp: "TWO GAMES AT ONCE", headline: "Crawford scores, and Chicago's defensive identity splits at the seams", detail: "The second unit finally creates shots and gives just as many back. Thibodeau treats every closing lineup like a referendum.", departures: ["Omer Asik", "Kyle Korver", "C.J. Watson", "Ronnie Brewer"], effects: [flag("bench-plan", "creator", "Chicago replaces the Bench Mob"), flag("secondary-creator", "crawford", "Jamal Crawford becomes the second creator"), resource("competitive-power", 2, "Competitive power"), resource("team-cohesion", -7, "Team cohesion"), relationship("thibs-trust", -8, "Tom Thibodeau trust")] },
        },
      ],
    },
    {
      id: "2014-free-agency",
      year: 2014,
      date: "July 1, 2014",
      deadline: "Six hours before New York's meeting",
      phase: "Free Agency",
      headline: "A healthy Rose makes Chicago the market's most dangerous pitch.",
      brief: "Carmelo Anthony wants a path to contention without surrendering his offensive identity. Pau Gasol wants a championship structure. Nikola Mirotic is finally ready to leave Madrid. Chicago can build only one version of the next roster.",
      historicalContext: "In reality, Anthony praised Chicago's recruitment but re-signed with New York. The Bulls signed Pau Gasol, brought Mirotic over from Real Madrid, and amnestied Carlos Boozer.",
      artKey: "contract-table",
      roster: roster2014,
      promptVariants: [
        { conditions: [{ scope: "flag", key: "bench-plan", operator: "equals", value: "creator" }], headline: "Chicago already found a second creator. The next star must share the ball.", brief: "Crawford solved the empty bench possessions and complicated the closing ones. Anthony offers overwhelming scoring; Gasol offers connective play; Mirotic preserves a clearer hierarchy." },
        { conditions: [{ scope: "flag", key: "bench-plan", operator: "equals", value: "asik" }], headline: "The frontcourt is deep, expensive, and one decision from becoming crowded.", brief: "Matching Asik protected the paint and consumed flexibility. Landing a star now requires choosing which big-man skill Chicago actually intends to build around." },
      ],
      advisors: [
        { advisorId: "rose-trust", subject: "I will recruit them", body: "A healthy Rose is willing to lead the meeting himself. He wants the front office to define the basketball partnership before it discusses branding or market size.", stance: "support" },
        { advisorId: "butler-trust", subject: "Do not bury the wing you developed", body: "Butler is ready for a larger offensive role. Adding Anthony can win immediately, but it makes Jimmy's next contract and place in the hierarchy harder to explain.", stance: "warning" },
        { advisorId: "reinsdorf-trust", subject: "One major commitment", body: "Ownership approves one premium path after Boozer's amnesty: max scoring, veteran size, or internal growth. There is no budget for combining them.", stance: "neutral" },
      ],
      investigations: [
        { id: "agent-channels", label: "Open all three agent channels", description: "Learn which pitch is real before committing the room.", intelCost: 1, reveal: "Anthony will seriously consider Chicago if Rose promises shared creation. Gasol will take less for a starting role. Mirotic's buyout is settled and he expects rotation minutes immediately.", bonuses: { "sign-melo": 12, "sign-pau": 9, "bring-mirotic": 10 } },
      ],
      strategies: [
        {
          id: "sign-melo", title: "Build a Rose–Butler–Anthony big three", summary: "Use the full room on Anthony, move Deng's slot into scoring, and ask Butler to become the defensive bridge between two stars.", approach: "Maximum talent / Hierarchy risk", baseChance: 61, costs: { "cap-flexibility": 18, influence: 1 }, requirements: [], freeAgent: { name: "Carmelo Anthony", position: "SF", note: "Age 30 · seven-time All-Star · unrestricted free agent" },
          acquisition: { hint: "The league's most complete isolation scorer is willing to hear one final basketball pitch before returning to New York.", player: { name: "Carmelo Anthony", number: 7, position: "SF", depth: 1, blurb: "A 30-year-old scoring champion joining a healthy former MVP and an emerging Jimmy Butler. In our timeline Anthony returned to New York after Chicago's celebrated pitch." }, reciprocal: { headline: "New York pivots from Carmelo to a full reset", detail: "With Anthony in Chicago, the Knicks lose the star around whom they planned the next five years. Their cap sheet opens immediately—and the Eastern Conference's balance shifts west to the United Center." } },
          success: { stamp: "THREE STARS IN RED", headline: "Carmelo Anthony chooses Chicago's healthy core", detail: "Rose promises shared creation, Butler accepts the hardest assignment, and Anthony chooses a real title structure over the extra year in New York.", departures: ["Luol Deng", "Carlos Boozer"], effects: [flag("star-signing", "melo", "Carmelo Anthony signs with Chicago"), resource("competitive-power", 14, "Competitive power"), relationship("rose-trust", 7, "Derrick Rose trust"), relationship("butler-trust", -5, "Jimmy Butler trust"), relationship("reinsdorf-trust", -7, "Owner trust")] },
          failure: { stamp: "THE EXTRA YEAR WINS", headline: "Anthony returns to New York after Chicago builds the stage", detail: "The pitch changes the league's perception of the Bulls and not their roster. Chicago used its first week chasing a star who still valued the fifth year.", departures: ["Carlos Boozer"], effects: [flag("star-signing", "melo-missed", "Carmelo Anthony stays in New York"), resource("competitive-power", -4, "Competitive power"), relationship("rose-trust", -5, "Derrick Rose trust"), relationship("reinsdorf-trust", -6, "Owner trust")] },
        },
        {
          id: "sign-pau", title: "Sign Pau Gasol", summary: "Add championship passing and size, keep Butler's runway open, and trust Rose to remain the perimeter engine.", approach: "Veteran fit / Aging curve", baseChance: 86, costs: { "cap-flexibility": 12 }, requirements: [], freeAgent: { name: "Pau Gasol", position: "PF", note: "Age 34 · two-time champion · unrestricted free agent" },
          acquisition: { always: true, hint: "A two-time champion turned down larger numbers because he believes this roster can reach June.", player: { name: "Pau Gasol", number: 16, position: "PF", depth: 1, blurb: "The seven-foot passing hub and two-time champion who chose Chicago in real history. Here he joins an MVP whose prime never paused." } },
          success: { stamp: "CHAMPIONSHIP LANGUAGE", headline: "Pau Gasol chooses Chicago and connects every level of the offense", detail: "Gasol gives Rose a pick-and-pop partner, Noah a second passer, and Butler space to grow without surrendering the present.", departures: ["Carlos Boozer"], effects: [flag("star-signing", "pau", "Pau Gasol signs with Chicago"), resource("competitive-power", 10, "Competitive power"), resource("team-cohesion", 7, "Team cohesion"), relationship("butler-trust", 5, "Jimmy Butler trust"), relationship("reinsdorf-trust", 3, "Owner trust")] },
          failure: { stamp: "YEARS SHOW FIRST", headline: "Gasol arrives, but the frontcourt becomes slower than the league around it", detail: "The intelligence is immediate and the recovery time is too. Chicago gains another half-court answer while transition defense starts sending invoices.", departures: ["Carlos Boozer"], effects: [flag("star-signing", "pau", "Pau Gasol signs with Chicago"), resource("competitive-power", 3, "Competitive power"), resource("team-cohesion", 3, "Team cohesion"), resource("cap-flexibility", -5, "Cap flexibility")] },
        },
        {
          id: "bring-mirotic", title: "Bring Nikola Mirotic over and elevate Butler", summary: "Use the smaller commitment on the stretch forward, reserve the next contract for Butler, and let the core grow into larger roles.", approach: "Internal growth / Unproven ceiling", baseChance: 75, costs: { "cap-flexibility": 7 }, requirements: [], freeAgent: { name: "Nikola Mirotic", position: "PF", note: "Age 23 · Spanish League MVP · NBA rights held by Chicago" },
          acquisition: { always: true, hint: "Europe's best stretch forward has finished his Real Madrid buyout and wants a real role, not a ceremonial arrival.", player: { name: "Nikola Mirotic", number: 44, position: "PF", depth: 2, blurb: "The Spanish League MVP and long-awaited floor spacer. Chicago turns down a veteran shortcut to give Mirotic and Butler the runway together." } },
          success: { stamp: "THE NEXT CORE ARRIVES", headline: "Mirotic stretches the floor and Butler claims the open chair", detail: "The offense gets younger without asking Rose to wait. Butler's usage rises, Mirotic drags a big out of the paint, and Chicago preserves one more move.", departures: ["Carlos Boozer"], effects: [flag("star-signing", "internal", "Chicago bets on Mirotic and Butler"), flag("butler-elevated", true, "Jimmy Butler enters the core"), resource("competitive-power", 8, "Competitive power"), resource("cap-flexibility", 7, "Cap flexibility"), relationship("butler-trust", 12, "Jimmy Butler trust"), relationship("rose-trust", 4, "Derrick Rose trust")] },
          failure: { stamp: "A YEAR TOO EARLY", headline: "Mirotic arrives before the playoff game slows down for him", detail: "The shooting flashes, the defense gets hunted, and Butler inherits offensive responsibility before either young player has learned where it bends.", departures: ["Carlos Boozer"], effects: [flag("star-signing", "internal", "Chicago bets on Mirotic and Butler"), flag("butler-elevated", true, "Jimmy Butler enters the core"), resource("competitive-power", -2, "Competitive power"), relationship("butler-trust", 7, "Jimmy Butler trust"), resource("team-cohesion", -4, "Team cohesion")] },
        },
      ],
    },
    {
      id: "cleveland-game-four",
      year: 2015,
      date: "May 10, 2015",
      deadline: "22 seconds remaining",
      phase: "Eastern Conference Semifinals · Game 4",
      headline: "Chicago leads the series 2–1. Cleveland knows the ball is finding Rose.",
      brief: "Rose's banked three won Game 3. Now Game 4 is tied, Cleveland has no Kevin Love, Kyrie Irving is compromised, and the next set can put LeBron's team one loss from elimination.",
      historicalContext: "In reality, LeBron James hit the Game 4 winner after changing David Blatt's drawn play. Cleveland won the next two games, and Chicago's last serious run with Rose, Butler, Noah, Gasol, and Thibodeau ended in six.",
      artKey: "playoff-tunnel",
      roster: roster2015,
      promptVariants: [
        { conditions: [{ scope: "flag", key: "star-signing", operator: "equals", value: "melo" }], headline: "Cleveland can load up on Rose—or leave Carmelo Anthony with one defender.", brief: "The big three has reached its defining possession. Rose wants the first action, Anthony wants the final matchup, and Butler has spent the night exhausting LeBron." },
        { conditions: [{ scope: "flag", key: "star-signing", operator: "equals", value: "pau" }], headline: "Gasol gives Chicago the release valve it lacked in our history.", brief: "Cleveland expects another Rose isolation. Pau can screen, pop, or facilitate from the elbow, but his hamstring is beginning to tighten under the playoff workload." },
        { conditions: [{ scope: "flag", key: "star-signing", operator: "equals", value: "internal" }], headline: "The young core has arrived at its first franchise possession.", brief: "Rose remains the engine, Butler is no longer just the defender, and Mirotic can pull Cleveland's last rim protector out of the lane. The hierarchy now has to become an action." },
      ],
      advisors: [
        { advisorId: "rose-trust", subject: "Use me as the threat", body: "Rose wants the defense committed to him before the final decision. He does not care whether the shot is his if the possession begins with Cleveland fearing it will be.", stance: "support" },
        { advisorId: "butler-trust", subject: "Jimmy has earned a side", body: "Butler has defended LeBron and created offense all series. Another decoy assignment will be remembered long after the possession.", stance: "warning" },
        { advisorId: "thibs-trust", subject: "Win with the defense behind the play", body: "Thibodeau wants a set that keeps two players above the break so Cleveland cannot turn a miss into LeBron in transition.", stance: "neutral" },
      ],
      investigations: [
        { id: "cleveland-last-two", label: "Review Cleveland's final two-minute coverages", description: "Identify which defender is pre-switching onto Rose before the screen arrives.", intelCost: 1, reveal: "Cleveland is pre-switching LeBron onto Rose and hiding Irving on the weak-side guard. A Butler screen or a big at the elbow forces the defense to reveal its preferred compromise.", bonuses: { "rose-butler-action": 12, "noah-elbow": 7, "melo-clear-side": 10, "gasol-elbow": 12, "mirotic-five-out": 11 } },
      ],
      strategies: [
        {
          id: "rose-butler-action", title: "Run a Rose–Butler inverted screen", summary: "Make LeBron choose between switching onto Rose and releasing Butler downhill against a guard.", approach: "Shared stars / Complex read", baseChance: 76, costs: {}, requirements: [],
          success: { stamp: "TWO ENGINES", headline: "Rose draws two and Butler finishes the possession", detail: "The MVP creates the panic and the emerging star creates the points. Chicago finally makes Cleveland guard both timelines at once.", effects: [resource("competitive-power", 10, "Competitive power"), relationship("rose-trust", 7, "Derrick Rose trust"), relationship("butler-trust", 11, "Jimmy Butler trust"), flag("butler-elevated", true, "Jimmy Butler shares the franchise")], delayed: title2015 },
          failure: { stamp: "ONE BEAT LATE", headline: "The handoff hesitates and LeBron erases the second option", detail: "Rose and Butler see the same opening at different moments. Cleveland survives the possession and takes back the series tempo.", effects: [resource("competitive-power", -6, "Competitive power"), relationship("butler-trust", -5, "Jimmy Butler trust"), resource("team-cohesion", -5, "Team cohesion")] },
        },
        {
          id: "noah-elbow", title: "Put Noah at the elbow and cut Rose behind him", summary: "Return to the structure that beat Miami: remove the first trap and make every defender guard movement.", approach: "Continuity / Limited shooting", baseChance: 71, costs: {}, requirements: [],
          success: { stamp: "OLD ANSWER, NEW NIGHT", headline: "Noah finds Rose before Cleveland can load the lane", detail: "The pass arrives between switches. Rose finishes, Chicago takes a 3–1 lead, and the offense proves its oldest adjustment still travels.", effects: [resource("competitive-power", 8, "Competitive power"), relationship("thibs-trust", 8, "Tom Thibodeau trust"), resource("team-cohesion", 6, "Team cohesion")], delayed: title2015 },
          failure: { stamp: "PAINT SHRINKS", headline: "Cleveland ignores Noah and closes every cutting lane", detail: "The familiar structure meets a defense willing to abandon the scorer it does not fear. The possession ends outside its first three options.", effects: [resource("competitive-power", -6, "Competitive power"), relationship("rose-trust", -4, "Derrick Rose trust"), relationship("thibs-trust", -3, "Tom Thibodeau trust")] },
        },
        {
          id: "melo-clear-side", title: "Clear a side for Carmelo", summary: "Use Rose as the entry threat, force a smaller switch, and let Anthony own the matchup Chicago signed him to decide.", approach: "Big-three branch / Isolation", baseChance: 79, costs: {}, requirements: [{ scope: "flag", key: "star-signing", operator: "equals", value: "melo" }],
          success: { stamp: "THE REASON HE CAME", headline: "Anthony buries the shot New York could never give him", detail: "LeBron stays attached to Rose, the switch leaves Anthony one-on-one, and Chicago's largest gamble produces its cleanest answer.", effects: [resource("competitive-power", 12, "Competitive power"), relationship("rose-trust", 5, "Derrick Rose trust"), relationship("butler-trust", 4, "Jimmy Butler trust")], delayed: title2015 },
          failure: { stamp: "THREE STARS WATCH", headline: "The isolation stalls while Rose and Butler become spectators", detail: "Anthony gets the matchup and not the separation. The possession reveals the cost of collecting creators without defining their sequence.", effects: [resource("competitive-power", -7, "Competitive power"), resource("team-cohesion", -8, "Team cohesion"), relationship("butler-trust", -7, "Jimmy Butler trust")] },
        },
        {
          id: "gasol-elbow", title: "Let Gasol make the final read", summary: "Screen Rose into the double-team and place Gasol at the foul line with Butler cutting behind LeBron.", approach: "Pau branch / Veteran read", baseChance: 82, costs: {}, requirements: [{ scope: "flag", key: "star-signing", operator: "equals", value: "pau" }],
          success: { stamp: "THE VETERAN SEES IT", headline: "Gasol finds Butler on the cut and Cleveland loses the map", detail: "The pass travels through the exact space Rose's gravity opens. Chicago's veteran addition and emerging wing finish the MVP's possession together.", effects: [resource("competitive-power", 10, "Competitive power"), relationship("butler-trust", 8, "Jimmy Butler trust"), relationship("rose-trust", 5, "Derrick Rose trust"), resource("team-cohesion", 7, "Team cohesion")], delayed: title2015 },
          failure: { stamp: "HAMSTRING SECOND", headline: "Gasol sees the pass and cannot reach the window", detail: "The read is correct, the body is late, and Cleveland turns the deflection into the transition chance Chicago designed against.", effects: [resource("competitive-power", -5, "Competitive power"), resource("team-cohesion", -3, "Team cohesion")] },
        },
        {
          id: "mirotic-five-out", title: "Go five-out with Mirotic", summary: "Remove the last rim protector, give Rose the entire lane, and trust the young forward to survive the other end.", approach: "Youth branch / Maximum space", baseChance: 74, costs: {}, requirements: [{ scope: "flag", key: "star-signing", operator: "equals", value: "internal" }],
          success: { stamp: "LANE WITHOUT A BIG", headline: "Mirotic pulls the floor apart and Rose ends the argument at the rim", detail: "Cleveland refuses to leave the shooter. Rose sees one defender, one gap, and the future the franchise protected for him.", effects: [resource("competitive-power", 11, "Competitive power"), relationship("rose-trust", 8, "Derrick Rose trust"), relationship("butler-trust", 6, "Jimmy Butler trust"), resource("rose-health", 3, "Rose workload reserve")], delayed: title2015 },
          failure: { stamp: "THE MATCHUP HUNTS BACK", headline: "The spacing works and Cleveland chooses the other end", detail: "Rose gets the lane. LeBron gets Mirotic after the timeout. The young lineup discovers that every tactical advantage sends an invoice.", effects: [resource("competitive-power", -5, "Competitive power"), relationship("thibs-trust", -5, "Tom Thibodeau trust"), relationship("butler-trust", 3, "Jimmy Butler trust")] },
        },
      ],
    },
    {
      id: "thibodeau-reckoning",
      year: 2015,
      date: "May 28, 2015",
      deadline: "Ownership meeting in 90 minutes",
      phase: "Organizational Direction",
      headline: "The Rose era survived. The relationship running it may not.",
      brief: "Thibodeau and the front office no longer agree on minutes, communication, or who owns the final basketball decision. Rose wants standards. Butler wants a voice. Ownership wants the conflict out of public view.",
      historicalContext: "In reality, Chicago fired Thibodeau after five seasons and a 255–139 record. The Bulls hired Fred Hoiberg, missed the 2016 playoffs, and traded Rose to New York that summer.",
      artKey: "war-room",
      roster: roster2015,
      promptVariants: [
        { conditions: [{ scope: "flag", key: "championships", operator: "at-least", value: 2 }], headline: "Two banners make the argument harder to end—and impossible to ignore.", brief: "Thibodeau has delivered a dynasty's beginning, the performance staff has kept Rose whole, and both sides believe the trophies validate their authority. Success has turned a workplace conflict into a constitutional one." },
        { conditions: [{ scope: "flag", key: "championships", operator: "at-least", value: 1 }], headline: "A banner changes the price of every organizational grudge.", brief: "Thibodeau can point to the rafters. Basketball operations can point to the healthy MVP who got him there. Ownership must decide whether winning settled the dispute or merely made it more expensive." },
        { conditions: [{ scope: "resource", key: "rose-health", operator: "at-most", value: 55 }], headline: "Rose is healthy enough to play—and carrying every argument in his legs.", brief: "The catastrophic injury never happened, but the workload reserve is nearly gone. Any coaching structure that survives this meeting must give preservation actual authority." },
      ],
      advisors: [
        { advisorId: "rose-trust", subject: "Do not make me choose a side", body: "Rose believes Thibodeau made him better and the medical plan kept him available. He wants both truths inside the next structure.", stance: "warning" },
        { advisorId: "butler-trust", subject: "Define who speaks for the players", body: "Butler has grown from the last wing in the rotation into a franchise voice. He will not accept a reset that treats him like the rookie from 2012.", stance: "neutral" },
        { advisorId: "reinsdorf-trust", subject: "No more public war", body: "Ownership will fund continuity or change. It will not tolerate another season of leaks, competing instructions, and postgame messages aimed upstairs.", stance: "warning" },
      ],
      investigations: [
        { id: "locker-room-vote", label: "Take the private locker-room vote", description: "Ask the rotation which structure it will still follow next season.", intelCost: 1, reveal: "Players still trust Thibodeau's preparation, but a majority wants written workload limits and a formal leadership role for Rose and Butler. A clean coaching change would be accepted, not celebrated.", bonuses: { "repair-thibs": 12, "hire-gentry": 7, "player-council": 11, "championship-mandate": 5 } },
      ],
      strategies: [
        {
          id: "repair-thibs", title: "Reconcile with Thibodeau", summary: "Keep the championship defense, install a performance council, and put decision rights in writing before anyone returns to the podium.", approach: "Continuity / Shared authority", baseChance: 69, costs: { influence: 1 }, requirements: [],
          success: { stamp: "ONE MORE TERM", headline: "Thibodeau agrees to a written division of power", detail: "The coach accepts the premise, then asks for one protection of his own before he signs the structure.", effects: [] },
          failure: { stamp: "TOO MANY SCARS", headline: "The reconciliation meeting becomes the final argument", detail: "Every proposed boundary sounds like an accusation. Thibodeau leaves, Rose loses a trusted coach, and ownership blames the room that promised a repair.", effects: [flag("thibs-stays", false, "Tom Thibodeau leaves Chicago"), relationship("thibs-trust", -18, "Tom Thibodeau trust"), relationship("rose-trust", -8, "Derrick Rose trust"), relationship("reinsdorf-trust", -10, "Owner trust"), resource("team-cohesion", -8, "Team cohesion")] },
          counteroffer: {
            advisorId: "thibs-trust", title: "Thibodeau wants final say inside the game", detail: "He will accept medical limits before tipoff and front-office control of roster decisions. Once the ball goes up, rotations and matchups belong exclusively to the coaching staff.", acceptLabel: "Give him game authority", declineLabel: "Keep shared rotation control",
            accept: { stamp: "BOUNDARIES SIGNED", headline: "Chicago keeps Thibodeau and finally defines the lines", detail: "The performance staff owns availability, the coach owns the game, and the front office owns the roster. Rose no longer has to mediate the building.", effects: [flag("thibs-stays", true, "Tom Thibodeau stays in Chicago"), relationship("thibs-trust", 13, "Tom Thibodeau trust"), relationship("rose-trust", 8, "Derrick Rose trust"), resource("rose-health", 7, "Rose workload reserve"), resource("team-cohesion", 8, "Team cohesion")] },
            decline: { stamp: "CONTROL WINS", headline: "Chicago keeps shared authority and Thibodeau walks", detail: "The front office preserves the system that protected Rose and loses the coach who built everything around him.", effects: [flag("thibs-stays", false, "Tom Thibodeau leaves Chicago"), relationship("thibs-trust", -14, "Tom Thibodeau trust"), relationship("reinsdorf-trust", 5, "Owner trust"), resource("team-cohesion", -5, "Team cohesion")] },
          },
        },
        {
          id: "hire-gentry", title: "Hire Alvin Gentry and modernize the offense", summary: "Make a clean coaching change, install pace and spacing around Rose, and retain the defensive staff for continuity.", approach: "Modernization / Culture reset", baseChance: 76, costs: {}, requirements: [],
          success: { stamp: "A FASTER CHICAGO", headline: "Gentry unlocks the healthy Rose offense before the league catches up", detail: "Rose attacks tilted floors, Butler handles the second side, and the old defense survives because the assistants remain in the room.", effects: [flag("thibs-stays", false, "Tom Thibodeau leaves Chicago"), resource("competitive-power", 7, "Competitive power"), resource("rose-health", 6, "Rose workload reserve"), relationship("rose-trust", 5, "Derrick Rose trust"), relationship("butler-trust", 8, "Jimmy Butler trust"), relationship("thibs-trust", -12, "Tom Thibodeau trust")] },
          failure: { stamp: "IDENTITY BETWEEN SYSTEMS", headline: "The pace arrives before the roster learns what it replaced", detail: "Chicago plays faster, defends less precisely, and discovers that removing the conflict also removed the standard everyone knew.", effects: [flag("thibs-stays", false, "Tom Thibodeau leaves Chicago"), resource("competitive-power", -5, "Competitive power"), resource("team-cohesion", -9, "Team cohesion"), relationship("rose-trust", -4, "Derrick Rose trust"), relationship("thibs-trust", -12, "Tom Thibodeau trust")] },
        },
        {
          id: "player-council", title: "Build the structure around Rose and Butler", summary: "Keep Thibodeau for one year, create a formal player council, and make the two stars co-owners of workload and offensive priorities.", approach: "Player power / Fragile chain", baseChance: 73, costs: { influence: 1 }, requirements: [],
          success: { stamp: "THE FRANCHISE SHARES A TABLE", headline: "Rose and Butler turn competing voices into one leadership group", detail: "Thibodeau keeps the whistle, the stars gain a defined channel, and every disagreement reaches the room before it reaches a reporter.", effects: [flag("thibs-stays", true, "Tom Thibodeau stays in Chicago"), flag("butler-elevated", true, "Jimmy Butler shares the franchise"), relationship("rose-trust", 10, "Derrick Rose trust"), relationship("butler-trust", 13, "Jimmy Butler trust"), resource("team-cohesion", 9, "Team cohesion"), resource("rose-health", 5, "Rose workload reserve")] },
          failure: { stamp: "FOUR FINAL VOICES", headline: "The council gives every faction a microphone and nobody the last word", detail: "Rose tries to mediate, Butler pushes for clarity, and Thibodeau treats consultation like an attack on the bench.", effects: [flag("thibs-stays", true, "Tom Thibodeau stays in Chicago"), relationship("rose-trust", -6, "Derrick Rose trust"), relationship("butler-trust", 5, "Jimmy Butler trust"), relationship("thibs-trust", -9, "Tom Thibodeau trust"), resource("team-cohesion", -10, "Team cohesion"), relationship("reinsdorf-trust", -7, "Owner trust")] },
        },
        {
          id: "championship-mandate", title: "Give Thibodeau the champion's mandate", summary: "End the internal debate, extend the coach, and trust the structure that already put multiple banners in the rafters.", approach: "Dynasty branch / Workload danger", baseChance: 82, costs: {}, requirements: [{ scope: "flag", key: "championships", operator: "at-least", value: 2 }],
          success: { stamp: "THE STANDARD WINS", headline: "Two banners buy Thibodeau a unified final word", detail: "The building stops litigating the method and returns to defending the result. Rose demands—and receives—one private promise on workload.", effects: [flag("thibs-stays", true, "Tom Thibodeau stays in Chicago"), relationship("thibs-trust", 15, "Tom Thibodeau trust"), relationship("reinsdorf-trust", 10, "Owner trust"), resource("team-cohesion", 7, "Team cohesion"), resource("rose-health", -5, "Rose workload reserve")] },
          failure: { stamp: "TROPHIES AS ARMOR", headline: "The mandate turns every concern into disloyalty", detail: "Winning ends the argument without solving it. The rotation tightens, the medical staff retreats, and Rose's remaining physical margin becomes the next season's hidden cost.", effects: [flag("thibs-stays", true, "Tom Thibodeau stays in Chicago"), relationship("thibs-trust", 8, "Tom Thibodeau trust"), relationship("rose-trust", -9, "Derrick Rose trust"), resource("rose-health", -14, "Rose workload reserve"), resource("team-cohesion", -7, "Team cohesion")] },
        },
      ],
    },
  ],
  endings: [
    { id: "owner-ends-run", eyebrow: "Front-office dismissal", title: "The Chairman Takes Back the Room", summary: "The basketball case may still be defensible. The political one is not. Trust with Jerry Reinsdorf collapses, ownership removes you from the Rose era, and somebody else inherits the healthy MVP you preserved.", conditions: [{ scope: "relationship", key: "reinsdorf-trust", operator: "at-most", value: 10 }] },
    { id: "unbroken-dynasty", eyebrow: "Franchise legacy", title: "The Unbroken Bulls Dynasty", summary: "Two banners, a healthy hometown MVP, and a second star who grew beside him instead of replacing him. Chicago does not spend the decade mourning the team that might have been; it spends it measuring everyone else against the team that was.", conditions: [{ scope: "flag", key: "championships", operator: "at-least", value: 2 }, { scope: "resource", key: "rose-health", operator: "at-least", value: 70 }, { scope: "resource", key: "competitive-power", operator: "at-least", value: 82 }] },
    { id: "one-banner-era", eyebrow: "Franchise legacy", title: "The Seventh Banner", summary: "The healthy Rose era reaches the destination once and changes Chicago forever. Not every relationship survives the climb, but the question that haunted the real Bulls—whether this core was good enough—receives an answer in the rafters.", conditions: [{ scope: "flag", key: "championships", operator: "at-least", value: 1 }, { scope: "relationship", key: "rose-trust", operator: "at-least", value: 62 }] },
    { id: "load-management-pioneer", eyebrow: "League legacy", title: "The Team That Learned Before the League", summary: "Chicago never raises the banner it expected, but it proves that protecting a superstar can be an organizational strength rather than a lack of toughness. Rose remains whole, Butler becomes a partner, and the next window stays open.", conditions: [{ scope: "flag", key: "championships", operator: "equals", value: 0 }, { scope: "resource", key: "rose-health", operator: "at-least", value: 76 }, { scope: "relationship", key: "butler-trust", operator: "at-least", value: 60 }] },
    { id: "mvp-overdrawn", eyebrow: "Franchise warning", title: "Healthy Was Not the Same as Protected", summary: "The ACL never tears, yet Chicago keeps borrowing from Rose's body until availability becomes another kind of burden. The alternate timeline saves one moment and repeats the thinking that made it dangerous.", conditions: [{ scope: "resource", key: "rose-health", operator: "at-most", value: 40 }] },
    { id: "unfinished-window", eyebrow: "Franchise legacy", title: "One Healthy Knee, No Easy Answers", summary: "Rose stays on the floor and every other weakness becomes visible: the tax line, the offensive hierarchy, the coaching war, and the thin margin between a contender and a champion. The tragedy disappears. The hard basketball questions remain.", conditions: [] },
  ],
  realHistory: "Derrick Rose tore his left ACL with 1:22 remaining in Chicago's 2012 playoff opener, missed the entire following season, and later suffered meniscus injuries in both knees. The Bulls never returned to the conference finals with that core, fired Tom Thibodeau in 2015, and traded Rose to New York in June 2016.",
});
