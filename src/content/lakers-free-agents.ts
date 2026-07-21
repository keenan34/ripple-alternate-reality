// The Lakers' August 2012 decision offers this pool of real free agents. The
// user can choose exactly one, spending cap flexibility for a competitive-power
// boost and a new name on the depth chart. Signing anyone also unlocks the
// campaign's third-title "run it back" path in the finale.
import type { CampaignEffect } from "@/lib/campaign/schema";

const resource = (key: string, value: number, label: string): CampaignEffect => ({ scope: "resource", key, operation: "add", value, label });
const relationship = (key: string, value: number, label: string): CampaignEffect => ({ scope: "relationship", key, operation: "add", value, label });

export type FreeAgent = {
  id: string;
  name: string;
  number: number;
  position: string;
  height: string;
  college: string;
  birthDate: string;
  href: string;
  rating: number;
  capCost: number;
  power: number;
  tag: string;
  blurb: string;
  effects: CampaignEffect[];
};

// power = competitive-power gained · capCost = cap flexibility spent. Marquee
// names cost more and hit harder; minimum-deal fliers are cheap and modest.
export const LAKERS_FREE_AGENTS: FreeAgent[] = [
  {
    id: "steve-nash", name: "Steve Nash", number: 10, position: "PG", height: "6'3\"", college: "Santa Clara", birthDate: "1974-02-07", href: "https://www.basketball-reference.com/players/n/nashst01.html",
    rating: 84, capCost: 16, power: 9, tag: "Two-time MVP",
    blurb: "The greatest pick-and-roll maestro of his era, and the guard the real Lakers actually traded for in 2012. On this roster he stagger-runs the offense so Chris Paul and Kobe are never both resting.",
    effects: [resource("competitive-power", 9, "Competitive power"), resource("cap-flexibility", -16, "Cap flexibility"), resource("team-cohesion", 4, "Team cohesion")],
  },
  {
    id: "ray-allen", name: "Ray Allen", number: 20, position: "SG", height: "6'5\"", college: "UConn", birthDate: "1975-07-20", href: "https://www.basketball-reference.com/players/a/allenra02.html",
    rating: 82, capCost: 11, power: 8, tag: "Greatest shooter alive",
    blurb: "The most gravity per dollar on the board. Every corner he occupies is a corner Chris Paul's drives get to punish. In our timeline he chose Miami for exactly this role.",
    effects: [resource("competitive-power", 8, "Competitive power"), resource("cap-flexibility", -11, "Cap flexibility"), relationship("cp3-trust", 4, "Chris Paul trust")],
  },
  {
    id: "jamal-crawford", name: "Jamal Crawford", number: 11, position: "SG", height: "6'5\"", college: "Michigan", birthDate: "1980-03-20", href: "https://www.basketball-reference.com/players/c/crawfja01.html",
    rating: 79, capCost: 8, power: 6, tag: "Instant offense",
    blurb: "A Sixth Man of the Year who manufactures a bucket when the possession breaks. The release valve for the minutes both stars sit.",
    effects: [resource("competitive-power", 6, "Competitive power"), resource("cap-flexibility", -8, "Cap flexibility")],
  },
  {
    id: "jason-terry", name: "Jason Terry", number: 31, position: "SG", height: "6'2\"", college: "Arizona", birthDate: "1977-09-15", href: "https://www.basketball-reference.com/players/t/terryja01.html",
    rating: 78, capCost: 7, power: 5, tag: "Closer",
    blurb: "The Jet — a champion's nerve in the last four minutes and a knockdown catch off Paul's kick-outs.",
    effects: [resource("competitive-power", 5, "Competitive power"), resource("cap-flexibility", -7, "Cap flexibility"), resource("team-cohesion", 3, "Team cohesion")],
  },
  {
    id: "nicolas-batum", name: "Nicolas Batum", number: 5, position: "SF", height: "6'8\"", college: "International", birthDate: "1988-12-14", href: "https://www.basketball-reference.com/players/b/batumni01.html",
    rating: 80, capCost: 13, power: 7, tag: "Two-way wing",
    blurb: "A 23-year-old 3-and-D forward entering his prime. The rare wing who can guard up a position and keep the floor spaced for the guards.",
    effects: [resource("competitive-power", 7, "Competitive power"), resource("cap-flexibility", -13, "Cap flexibility")],
  },
  {
    id: "courtney-lee", name: "Courtney Lee", number: 5, position: "SG", height: "6'5\"", college: "Western Kentucky", birthDate: "1985-10-03", href: "https://www.basketball-reference.com/players/l/leeco01.html",
    rating: 76, capCost: 8, power: 5, tag: "3-and-D",
    blurb: "A prime two-way guard who takes the toughest perimeter assignment and never needs a play run for him.",
    effects: [resource("competitive-power", 5, "Competitive power"), resource("cap-flexibility", -8, "Cap flexibility"), resource("team-cohesion", 3, "Team cohesion")],
  },
  {
    id: "ersan-ilyasova", name: "Ersan Ilyasova", number: 7, position: "PF", height: "6'10\"", college: "International", birthDate: "1987-05-15", href: "https://www.basketball-reference.com/players/i/ilyaser01.html",
    rating: 77, capCost: 9, power: 6, tag: "Stretch four",
    blurb: "The floor-spacing four that pulls a big away from Bynum's post and rebounds his own misses.",
    effects: [resource("competitive-power", 6, "Competitive power"), resource("cap-flexibility", -9, "Cap flexibility")],
  },
  {
    id: "marcus-camby", name: "Marcus Camby", number: 23, position: "C", height: "6'11\"", college: "UMass", birthDate: "1974-03-22", href: "https://www.basketball-reference.com/players/c/cambyma01.html",
    rating: 75, capCost: 6, power: 5, tag: "Rim protection",
    blurb: "A former Defensive Player of the Year on a bargain deal — the shot-blocking insurance policy behind a foul-prone Bynum.",
    effects: [resource("competitive-power", 5, "Competitive power"), resource("cap-flexibility", -6, "Cap flexibility")],
  },
  {
    id: "grant-hill", name: "Grant Hill", number: 33, position: "SF", height: "6'8\"", college: "Duke", birthDate: "1972-10-05", href: "https://www.basketball-reference.com/players/h/hillgr01.html",
    rating: 74, capCost: 4, power: 4, tag: "Veteran glue",
    blurb: "Ageless professionalism and a still-credible wing defender for the minimum. Pure locker-room ballast.",
    effects: [resource("competitive-power", 4, "Competitive power"), resource("cap-flexibility", -4, "Cap flexibility"), resource("team-cohesion", 5, "Team cohesion")],
  },
  {
    id: "michael-redd", name: "Michael Redd", number: 22, position: "SG", height: "6'6\"", college: "Ohio State", birthDate: "1979-08-24", href: "https://www.basketball-reference.com/players/r/reddmi01.html",
    rating: 71, capCost: 3, power: 3, tag: "Minimum flier",
    blurb: "A former All-Star shooter on a comeback minimum. Low cost, low ceiling, real range if the knees hold.",
    effects: [resource("competitive-power", 3, "Competitive power"), resource("cap-flexibility", -3, "Cap flexibility")],
  },
];

export const freeAgentProfiles: Record<string, { height: string; college: string; birthDate: string; href: string }> =
  Object.fromEntries(LAKERS_FREE_AGENTS.map((agent) => [agent.name, { height: agent.height, college: agent.college, birthDate: agent.birthDate, href: agent.href }]));
