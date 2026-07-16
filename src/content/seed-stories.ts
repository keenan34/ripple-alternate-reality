import { BASKETBALL_DOMAIN } from "./domain-catalog";
import { LEGACY_SCENARIOS } from "./legacy-scenarios";
import {
  validateStory,
  type StoryChoice,
  type StoryDefinition,
  type StoryEffect,
  type StoryNode,
} from "@/lib/stories/schema";

type LegacyChoice = {
  text: string;
  tier: "consensus" | "plausible" | "longshot";
  points: number;
  chaos: number;
  stamp: string;
  verdict: string;
  headline: string;
  next: string | null;
};

type LegacyNode = {
  year: number;
  wire: string;
  reality: string;
  question: string;
  roster?: { label: string; players: string[] };
  choices: LegacyChoice[];
};

type LegacyScenario = {
  id: string;
  kicker: string;
  headline: string;
  deck: string;
  reality: string;
  start: string;
  nodes: Record<string, LegacyNode>;
};

const storyTags: Record<string, string[]> = {
  "kg-trade": ["nba", "trades", "dynasties", "2000s"],
  "giannis-cavs": ["nba", "draft", "cleveland", "2010s"],
  "mj-portland": ["nba", "draft", "jordan", "1980s"],
  "kd-stays": ["nba", "free-agency", "oklahoma-city", "2010s"],
};

function migrateLegacyScenario(scenario: LegacyScenario): StoryDefinition {
  const nodes = Object.fromEntries(
    Object.entries(scenario.nodes).map(([nodeId, node]) => [
      nodeId,
      {
        id: nodeId,
        kind: "event" as const,
        year: node.year,
        wire: node.wire,
        historicalContext: node.reality,
        question: node.question,
        conditions: [],
        presentation: {
          assetKey: `${scenario.id}-${nodeId}`,
          ...(node.roster ? { roster: node.roster } : {}),
        },
        seededEvents: [],
        choices: node.choices.map((choice, index) => {
          const choiceId = `${scenario.id}-${nodeId}-choice-${index + 1}`;
          return {
            id: choiceId,
            label: choice.text,
            tier: choice.tier,
            conditions: [],
            effects: [
              metricEffect("plausibility", "increment", choice.points, "Plausibility"),
              metricEffect("divergence-total", "increment", choice.chaos, "Timeline divergence"),
            ],
            outcome: {
              stamp: choice.stamp,
              verdict: choice.verdict,
              headline: choice.headline,
            },
            nextNodeId: choice.next,
            ...(choice.next === null ? {
              ending: {
                id: `${choiceId}-ending`,
                title: choice.headline,
                epilogueTemplate: `${choice.verdict} The final edition records a universe shaped by every call that came before it.`,
              },
            } : {}),
          };
        }),
      },
    ]),
  );

  const base = validateStory({
    schemaVersion: 2,
    id: scenario.id,
    slug: scenario.id,
    version: 2,
    status: "published",
    author: {
      id: "ripple-editorial",
      displayName: "RIPPLE Editorial",
    },
    metadata: {
      eyebrow: scenario.kicker,
      title: scenario.headline,
      summary: scenario.deck,
      historicalBaseline: scenario.reality,
      sport: "basketball",
      league: "nba",
      tags: storyTags[scenario.id] ?? ["nba", "alternate-history"],
      coverAssetKey: `${scenario.id}-cover`,
    },
    domain: BASKETBALL_DOMAIN,
    scoring: {
      metrics: [
        { key: "plausibility", label: "Plausibility", minimum: 0, maximum: 1000, initialValue: 0 },
        { key: "divergence-total", label: "Timeline divergence", minimum: 0, maximum: 10000, initialValue: 0 },
        { key: "legacy", label: "Legacy", minimum: -100, maximum: 100, initialValue: 0 },
        { key: "financial-health", label: "Financial health", minimum: 0, maximum: 100, initialValue: 60 },
        { key: "fan-sentiment", label: "Fan sentiment", minimum: 0, maximum: 100, initialValue: 50 },
        { key: "competitive-power", label: "Competitive power", minimum: 0, maximum: 100, initialValue: 50 },
      ],
    },
    world: {
      flags: [
        { key: "story-begun", label: "Timeline active", initialValue: true },
        { key: "thunder-champion", label: "Thunder won a title", initialValue: false },
        { key: "warriors-champion", label: "Warriors won a title", initialValue: false },
        { key: "cleveland-repeat", label: "Cleveland repeated", initialValue: false },
        { key: "kd-departure", label: "Durant left Oklahoma City", initialValue: false },
        { key: "loyalty-window", label: "Loyalty window open", initialValue: false },
        { key: "protected-prime", label: "Durant prime protected", initialValue: false },
      ],
      facts: [
        { key: "league-era", label: "League era", initialValue: storyTags[scenario.id]?.at(-1) ?? "alternate-history" },
        { key: "west-champion", label: "Western champion", initialValue: "unsettled" },
        { key: "kd-health", label: "Durant health", initialValue: "healthy" },
        { key: "free-agency-outlook", label: "Free agency outlook", initialValue: "open" },
      ],
      relationships: [
        { key: "kd-westbrook", label: "Durant / Westbrook trust", initialValue: 55 },
        { key: "players-front-office", label: "Players / front office trust", initialValue: 50 },
      ],
    },
    startNodeId: scenario.start,
    nodes,
    publishedAt: "2026-07-13T00:00:00.000Z",
  });

  return scenario.id === "kd-stays" ? validateStory(upgradeDurantStory(base)) : base;
}

function upgradeDurantStory(base: StoryDefinition): StoryDefinition {
  const story = structuredClone(base);
  const choice = (nodeId: string, index: number) => story.nodes[nodeId].choices[index];

  addEffects(choice("n1", 0), [
    flagEffect("warriors-champion", true, "Golden State takes the West"),
    factEffect("west-champion", "golden-state-warriors", "Western champion"),
    metricEffect("fan-sentiment", "decrement", 8, "Fan confidence"),
    relationshipEffect("kd-westbrook", "decrement", 5, "Durant / Westbrook trust"),
  ]);
  addEffects(choice("n1", 1), [
    flagEffect("thunder-champion", true, "Oklahoma City wins the title"),
    factEffect("west-champion", "oklahoma-city-thunder", "Western champion"),
    metricEffect("legacy", "increment", 20, "Durant legacy"),
    metricEffect("fan-sentiment", "increment", 24, "Fan confidence"),
    relationshipEffect("kd-westbrook", "increment", 16, "Durant / Westbrook trust"),
  ]);
  addEffects(choice("n1", 2), [
    flagEffect("cleveland-repeat", true, "Cleveland repeats"),
    metricEffect("competitive-power", "decrement", 7, "Western power"),
    metricEffect("fan-sentiment", "decrement", 4, "Fan confidence"),
  ]);

  addEffects(choice("n2a", 0), [
    flagEffect("loyalty-window", true, "The core stays together"),
    relationshipEffect("kd-westbrook", "increment", 7, "Durant / Westbrook trust"),
    metricEffect("financial-health", "decrement", 5, "Cap flexibility"),
  ]);
  addEffects(choice("n2a", 1), [
    flagEffect("kd-departure", true, "Durant exits in 2018"),
    factEffect("free-agency-outlook", "durant-on-market", "Free agency outlook"),
    relationshipEffect("kd-westbrook", "decrement", 22, "Durant / Westbrook trust"),
  ]);
  const sacrificeChoice = choice("n2a", 2);
  addEffects(sacrificeChoice, [
    flagEffect("kd-departure", false, "Durant remains"),
    relationshipEffect("players-front-office", "decrement", 35, "Players / front office trust"),
    metricEffect("fan-sentiment", "decrement", 20, "Fan confidence"),
    metricEffect("legacy", "decrement", 12, "Franchise legacy"),
  ]);
  sacrificeChoice.nextNodeId = null;
  sacrificeChoice.ending = {
    id: "okc-sacrifice-ending",
    title: "The Sacrifice Timeline",
    epilogueTemplate: "Oklahoma City keeps {{actor:kevin-durant}} by trading the player who embodied the city. The standings recover; the relationship between players and the front office never does. Trust closes at {{relationship:players-front-office}}/100.",
  };

  const dynastyChoice = choice("n2b", 0);
  dynastyChoice.nextNodeId = "n2dynasty";
  addEffects(dynastyChoice, [
    flagEffect("loyalty-window", true, "The loyalty window opens"),
    metricEffect("financial-health", "decrement", 14, "Supermax flexibility"),
    relationshipEffect("kd-westbrook", "increment", 8, "Durant / Westbrook trust"),
  ]);
  addEffects(choice("n2b", 1), [
    flagEffect("kd-departure", true, "Durant leaves a champion"),
    metricEffect("legacy", "increment", 4, "Durant legacy"),
    relationshipEffect("kd-westbrook", "decrement", 18, "Durant / Westbrook trust"),
  ]);
  addEffects(choice("n2b", 2), [
    relationshipEffect("kd-westbrook", "decrement", 30, "Durant / Westbrook trust"),
    metricEffect("fan-sentiment", "decrement", 18, "Fan confidence"),
  ]);

  story.nodes.n2dynasty = createDynastyNode();

  story.nodes.n3.presentation.rosterTemplate = {
    label: "{{team:oklahoma-city-thunder}} / 2019 state",
    players: ["{{actor:russell-westbrook}}", "Ferguson", "{{actor:kevin-durant}}", "Grant", "Adams"],
  };
  story.nodes.n3.seededEvents = createDurantSeededEvents();
  story.nodes.n3.choices.push(createProtectedPrimeChoice());
  addEffects(choice("n3", 0), [
    flagEffect("protected-prime", true, "Durant's late prime is protected"),
    factEffect("kd-health", "fully-healthy", "Durant health"),
    metricEffect("legacy", "increment", 12, "Durant legacy"),
  ]);
  addEffects(choice("n3", 1), [
    factEffect("kd-health", "achilles-injury", "Durant health"),
    metricEffect("competitive-power", "decrement", 18, "Competitive power"),
  ]);

  story.nodes.n4.questionTemplate = "With {{fact:kd-health}} health and {{metric:fan-sentiment}} fan sentiment, what shape does the 2020s take?";
  story.nodes.n4.choices.forEach((terminalChoice, index) => {
    terminalChoice.ending = [
      {
        id: "early-parity-ending",
        title: "The Early Parity Era",
        epilogueTemplate: "The superteam age closes early. {{actor:kevin-durant}} reaches the 2020s with a {{fact:kd-health}} health record, and six cities convince themselves June belongs to them.",
      },
      {
        id: "vacuum-superteam-ending",
        title: "The Vacuum Finds a New Empire",
        epilogueTemplate: "The league escapes one superteam only to build another. Player power rises, front-office trust finishes at {{relationship:players-front-office}}/100, and parity lasts exactly one summer.",
      },
      {
        id: "endless-warriors-ending",
        title: "The Endless Empire",
        epilogueTemplate: "Golden State turns continuity into mythology. The rest of the league spends a decade chasing a machine with {{metric:competitive-power}} competitive power on the ledger.",
      },
    ][index];
  });

  return story;
}

function createDynastyNode(): StoryNode {
  return {
    id: "n2dynasty",
    kind: "event",
    year: 2018,
    wire: "AP WIRE — JULY 2018 — The champions have paid their stars. One roster slot remains before the tax bill hardens.",
    wireTemplate: "AP WIRE — JULY 2018 — {{team:oklahoma-city-thunder}} has paid {{actor:kevin-durant}} and {{actor:russell-westbrook}}. One roster slot remains.",
    historicalContext: "Reality: Oklahoma City never got to build around a champion Durant-Westbrook core after 2016.",
    question: "How does the champion spend its last flexible dollar?",
    conditions: [{ scope: "flag", key: "thunder-champion", operator: "equals", value: true }],
    fallbackNodeId: "n3",
    presentation: {
      assetKey: "kd-stays-n2dynasty",
      rosterTemplate: {
        label: "{{team:oklahoma-city-thunder}} / defending champions",
        players: ["{{actor:russell-westbrook}}", "Roberson", "{{actor:kevin-durant}}", "Grant", "Adams"],
      },
    },
    seededEvents: [
      {
        id: "dynasty-cap-warning",
        weight: 2,
        conditions: [],
        headlineTemplate: "Luxury-tax warning lands on the {{team:oklahoma-city-thunder}} desk",
        detailTemplate: "Ownership approves one more expensive season, but every future move now carries a repeater-tax shadow.",
        effects: [metricEffect("financial-health", "decrement", 8, "Cap flexibility")],
      },
      {
        id: "dynasty-sponsor-boom",
        weight: 1,
        conditions: [{ scope: "flag", key: "thunder-champion", operator: "equals", value: true }],
        headlineTemplate: "Championship sponsors turn loyalty into a national campaign",
        detailTemplate: "A small-market champion becomes the league's most bankable counterargument to superteams.",
        effects: [metricEffect("fan-sentiment", "increment", 8, "Fan confidence")],
      },
    ],
    choices: [
      {
        id: "kd-stays-n2dynasty-choice-1",
        label: "Buy shooting — turn every Durant double-team into three points.",
        tier: "consensus",
        conditions: [],
        effects: [
          metricEffect("financial-health", "decrement", 9, "Cap flexibility"),
          metricEffect("competitive-power", "increment", 12, "Competitive power"),
        ],
        outcome: {
          stamp: "SPACING WINS",
          verdict: "The expensive, boring answer is usually the right one around two MVP creators.",
          headline: "OKC PAYS FOR SPACE: THE CHAMPS LOAD UP",
          headlineTemplate: "{{team:oklahoma-city-thunder}} pays for space around {{actor:kevin-durant}}",
        },
        nextNodeId: "n3",
      },
      {
        id: "kd-stays-n2dynasty-choice-2",
        label: "Double down on defense — make every playoff game a street fight.",
        tier: "plausible",
        conditions: [],
        effects: [
          metricEffect("competitive-power", "increment", 7, "Competitive power"),
          relationshipEffect("players-front-office", "increment", 5, "Players / front office trust"),
        ],
        outcome: {
          stamp: "OLD SCHOOL",
          verdict: "It protects the floor but keeps the half-court cramped. The champions choose identity over optimization.",
          headline: "NO EASY NIGHTS: OKC BUILDS THE LEAGUE'S MEANEST DEFENSE",
        },
        nextNodeId: "n3",
      },
    ],
  };
}

function createDurantSeededEvents() {
  return [
    {
      id: "healthy-training-camp",
      weight: 3,
      conditions: [{ scope: "flag" as const, key: "kd-departure", operator: "equals" as const, value: false }],
      headlineTemplate: "{{actor:kevin-durant}} exits camp without a minutes restriction",
      detailTemplate: "The medical staff points to continuity and a June schedule that never required a rushed return.",
      effects: [
        factEffect("kd-health", "fully-healthy", "Durant health"),
        metricEffect("competitive-power", "increment", 6, "Competitive power"),
      ],
    },
    {
      id: "locker-room-friction",
      weight: 2,
      conditions: [{ scope: "relationship" as const, key: "kd-westbrook", operator: "less-than" as const, value: 60 }],
      headlineTemplate: "A film-room argument follows {{team:oklahoma-city-thunder}} onto the road",
      detailTemplate: "The partnership survives, but every unresolved possession becomes a national segment.",
      effects: [relationshipEffect("kd-westbrook", "decrement", 6, "Durant / Westbrook trust")],
    },
    {
      id: "small-market-boom",
      weight: 2,
      conditions: [{ scope: "flag" as const, key: "thunder-champion", operator: "equals" as const, value: true }],
      headlineTemplate: "{{team:oklahoma-city-thunder}} season tickets sell out before camp",
      detailTemplate: "The loyalty story becomes an economic engine and another reason to keep the core intact.",
      effects: [
        metricEffect("financial-health", "increment", 7, "Financial health"),
        metricEffect("fan-sentiment", "increment", 6, "Fan confidence"),
      ],
    },
  ];
}

function createProtectedPrimeChoice(): StoryChoice {
  return {
    id: "kd-stays-n3-choice-4",
    label: "The champions protect the asset — no compromised June, no exceptions.",
    tier: "plausible",
    conditions: [
      { scope: "flag", key: "thunder-champion", operator: "equals", value: true },
      { scope: "flag", key: "kd-departure", operator: "equals", value: false },
    ],
    effects: [
      flagEffect("protected-prime", true, "Durant's prime is protected"),
      factEffect("kd-health", "load-managed", "Durant health"),
      metricEffect("legacy", "increment", 9, "Durant legacy"),
      metricEffect("fan-sentiment", "decrement", 3, "Short-term fan patience"),
    ],
    outcome: {
      stamp: "LONG VIEW",
      verdict: "The defending champions have the political capital to sit a star in May and answer questions in June.",
      headline: "THE LONG VIEW: OKC PROTECTS DURANT'S PRIME",
      headlineTemplate: "The long view: {{team:oklahoma-city-thunder}} protects {{actor:kevin-durant}}",
    },
    nextNodeId: "n4",
  };
}

function addEffects(choice: StoryChoice, effects: StoryEffect[]) {
  choice.effects.push(...effects);
}

function metricEffect(key: string, operation: "set" | "increment" | "decrement", value: number, label: string): StoryEffect {
  return { scope: "metric", key, operation, value, label };
}

function flagEffect(key: string, value: boolean, label: string): StoryEffect {
  return { scope: "flag", key, operation: "set", value, label };
}

function factEffect(key: string, value: string | number | boolean, label: string): StoryEffect {
  return { scope: "fact", key, operation: "set", value, label };
}

function relationshipEffect(key: string, operation: "set" | "increment" | "decrement", value: number, label: string): StoryEffect {
  return { scope: "relationship", key, operation, value, label };
}

export const seedStories = (LEGACY_SCENARIOS as LegacyScenario[]).map(migrateLegacyScenario);

export function getSeedStory(slug: string): StoryDefinition | undefined {
  return seedStories.find((story) => story.slug === slug);
}
