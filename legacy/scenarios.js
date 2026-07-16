// RIPPLE — scenario data.
// Branching tree of ripple nodes; choice.next = null ends the timeline.
// points 0–25 (plausibility) · chaos 0–100 (drift from our universe)
// roster = optional projected lineup card for the round. Keep all copy SHORT.

const SCENARIOS = [
    {
        id: "kg-trade",
        kicker: "JULY 31, 2007 — MINNEAPOLIS",
        headline: "THE GARNETT TRADE COLLAPSES",
        deck: "Minnesota pulls out at the eleventh hour. KG stays a Wolf. Boston's Big Three is never born.",
        reality: "KG went to Boston · Big Three won 66 games · 2008 title",
        start: "n1",
        nodes: {
            n1: {
                year: 2008,
                wire: "AP WIRE — JUNE 2008 — No Celtics juggernaut. Boston's Pierce–Allen duo is out in round two.",
                reality: "2008: Celtics won 66, beat the Lakers in six for banner 17.",
                roster: { label: "YOUR 2008 CELTICS — NO KG", players: ["Rondo", "R. Allen", "Pierce", "Al Jefferson", "Perkins"] },
                question: "Who wins the 2008 title?",
                choices: [
                    {
                        text: "Lakers — Gasol still arrives; only Boston stopped them.",
                        tier: "consensus", points: 25, chaos: 20, stamp: "CHALK", next: "n2a",
                        verdict: "The chalk: LA made the real '08 Finals, and the one defense built to stop Kobe doesn't exist here.",
                        headline: "KOBE GETS NO. 4 — LAKERS ROLL THROUGH JUNE"
                    },
                    {
                        text: "Spurs repeat — champs until proven otherwise.",
                        tier: "plausible", points: 12, chaos: 30, stamp: "SAFE PRESS", next: "n2b",
                        verdict: "The real Lakers beat these Spurs in five that May. Age was showing.",
                        headline: "DUNCAN'S FIFTH: SPURS REPEAT"
                    },
                    {
                        text: "LeBron drags Cleveland to its first.",
                        tier: "longshot", points: 5, chaos: 65, stamp: "HOMER CALL", next: "n2c",
                        verdict: "Romantic — but the '08 Cavs won 45 games and Detroit still guards the East.",
                        headline: "WITNESS: LEBRON DELIVERS CLEVELAND'S FIRST"
                    }
                ]
            },
            n2a: {
                year: 2009,
                wire: "AP WIRE — OCT 2008 — Champion Lakers open camp loose. Phil Jackson: 'dangerously comfortable.'",
                reality: "2009–10: Lakers lost '08, came back angry, won back-to-back.",
                roster: { label: "YOUR 2009 LAKERS — NEVER HUMBLED", players: ["Fisher", "Kobe", "Ariza", "Gasol", "Bynum"] },
                question: "The '08 Finals loss never hardened them. What now?",
                choices: [
                    {
                        text: "Three-peat. Talent settles it.",
                        tier: "consensus", points: 22, chaos: 45, stamp: "DYNASTY MATH", next: "n3",
                        verdict: "Best roster in the league both years — and the team that beat them twice doesn't exist.",
                        headline: "THREE-PEAT: KOBE COLLECTS RING NO. 6"
                    },
                    {
                        text: "Comfort kills them — someone hungrier takes 2009.",
                        tier: "plausible", points: 13, chaos: 35, stamp: "TALK RADIO", next: "n3",
                        verdict: "'Champions get complacent' loses to 'best team wins' more than talk radio admits.",
                        headline: "MILE HIGH ROBBERY: NUGGETS DETHRONE LA"
                    },
                    {
                        text: "Kobe's trade demand resurfaces.",
                        tier: "longshot", points: 4, chaos: 85, stamp: "DELUSIONAL", next: "n3",
                        verdict: "Nothing buries a trade request like a parade.",
                        headline: "KOBE TO CHICAGO: THE UNTHINKABLE DEAL"
                    }
                ]
            },
            n2b: {
                year: 2009,
                wire: "AP WIRE — JUNE 2008 — Duncan, 32, hoists ring No. 5 and shrugs at every dynasty question.",
                reality: "2009: Spurs lost round one to Dallas · retooled · won again in 2014.",
                roster: { label: "YOUR 2009 SPURS — AGING CHAMPS", players: ["Parker", "Ginobili", "Bowen", "Duncan", "Oberto"] },
                question: "The core is 32+. What's next for San Antonio?",
                choices: [
                    {
                        text: "Graceful decline — quiet retool, stay a 50-win machine.",
                        tier: "consensus", points: 25, chaos: 15, stamp: "DEAD ON", next: "n3",
                        verdict: "Exactly what the real Spurs did: aged, adapted, drafted Kawhi, returned in 2014.",
                        headline: "QUIET DYNASTY: SPURS RELOAD, NEVER RUST"
                    },
                    {
                        text: "One more run — back to the 2009 Finals.",
                        tier: "plausible", points: 11, chaos: 35, stamp: "RERUN", next: "n3",
                        verdict: "The real '09 Spurs lost round one with Ginobili hurt. Rings don't heal ankles.",
                        headline: "GROUNDHOG JUNE: SPURS BACK AGAIN"
                    },
                    {
                        text: "Duncan retires on top.",
                        tier: "longshot", points: 4, chaos: 70, stamp: "POETIC LICENSE", next: "n3",
                        verdict: "The man played until 2016. Walking away was never his move.",
                        headline: "TIM CALLS IT: EXIT AT THE SUMMIT"
                    }
                ]
            },
            n2c: {
                year: 2010,
                wire: "AP WIRE — JULY 2010 — A banner hangs in Cleveland. A one-hour ESPN special is still scheduled.",
                reality: "2010: Ringless LeBron left home for Miami on live TV.",
                roster: { label: "YOUR CHAMPION CAVS", players: ["M. Williams", "West", "LeBron", "Varejao", "Ilgauskas"] },
                question: "LeBron is a champion at home. Does The Decision still happen?",
                choices: [
                    {
                        text: "He stays. Champions don't run from home.",
                        tier: "consensus", points: 22, chaos: 75, stamp: "LOYALTY CLAUSE", next: "n3c",
                        verdict: "2010 was fueled by seven ringless years — hand him a banner and the calculus flips.",
                        headline: "LOYAL KING: LEBRON SIGNS FOR LIFE"
                    },
                    {
                        text: "Miami anyway — the pact predates everything.",
                        tier: "plausible", points: 14, chaos: 40, stamp: "COLD-BLOODED", next: "n3c",
                        verdict: "The banana-boat pull was real, but 'hometown champion walks' is a heavy lift.",
                        headline: "THE DECISION ANYWAY: SOUTH BEACH STUNNER"
                    },
                    {
                        text: "The Knicks. Broadway calls.",
                        tier: "longshot", points: 3, chaos: 90, stamp: "TABLOID BAIT", next: "n3c",
                        verdict: "New York cleared a decade of cap space for this dream and got Amar'e.",
                        headline: "BROADWAY BRON: KING OF NEW YORK"
                    }
                ]
            },
            n3: {
                year: 2010,
                wire: "AP WIRE — JULY 8, 2010 — Cameras assemble in Greenwich. In your universe, Boston's superteam proof never existed.",
                reality: "2010: The Decision — LeBron, Wade, Bosh in Miami · 4 straight Finals · 2 rings.",
                roster: { label: "RILEY'S PITCH IN MIAMI", players: ["Wade", "Bosh", "+ one max slot"] },
                question: "Does LeBron still take his talents to South Beach?",
                choices: [
                    {
                        text: "Yes — the pact was made on Team USA, not in Boston.",
                        tier: "consensus", points: 25, chaos: 10, stamp: "BANANA BOAT", next: "n4",
                        verdict: "The players hatched 2010 themselves years earlier. Seven empty years still hurt. He goes.",
                        headline: "SOUTH BEACH SUPERTEAM ASSEMBLES"
                    },
                    {
                        text: "No — without Boston's example, ring-chasing stays taboo.",
                        tier: "plausible", points: 13, chaos: 65, stamp: "REVISIONIST", next: "n4",
                        verdict: "Sharp theory, but stigma beating Wade, Bosh, and Pat Riley is betting against gravity.",
                        headline: "KING STAYS: SUPERTEAM ERA STILLBORN"
                    },
                    {
                        text: "He joins Rose in Chicago.",
                        tier: "longshot", points: 5, chaos: 80, stamp: "SECOND CITY", next: "n4",
                        verdict: "Real meeting, real look — and a lifetime in Jordan's shadow. Pass.",
                        headline: "BRON JOINS ROSE: BULLS REBORN"
                    }
                ]
            },
            n3c: {
                year: 2012,
                wire: "AP WIRE — DEC 2011 — The lockout ends. Your 2010 call reshaped free agency — the early 2010s are wide open.",
                reality: "2011–13: Miami won two · OKC's trio made the 2012 Finals, then traded Harden.",
                roster: { label: "MEANWHILE IN OKC", players: ["Westbrook", "Harden", "Durant", "Ibaka", "Perkins"] },
                question: "Who owns the early 2010s?",
                choices: [
                    {
                        text: "Durant's Thunder seize the vacuum.",
                        tier: "consensus", points: 24, chaos: 55, stamp: "VACUUM THEORY", next: "n4",
                        verdict: "Three future MVPs on rookie deals — only a Harden trade and a Miami wall stopped a dynasty.",
                        headline: "OKC'S DECADE: DURANT AND WESTBROOK REIGN"
                    },
                    {
                        text: "Wherever LeBron is, he wins back-to-back.",
                        tier: "plausible", points: 13, chaos: 35, stamp: "KING'S ODDS", next: "n4",
                        verdict: "Never dumb to bet the best player alive — but without Miami's exact cast, it's hope.",
                        headline: "WHEREVER HE GOES, HE WINS: BACK-TO-BACK"
                    },
                    {
                        text: "Rose's Bulls take it all.",
                        tier: "longshot", points: 4, chaos: 75, stamp: "HEARTBREAKER", next: "n4",
                        verdict: "One torn ACL in April 2012 — some ripples can't reach an injury.",
                        headline: "THE ROSE THAT GREW: BULLS TAKE IT ALL"
                    }
                ]
            },
            n4: {
                year: 2016,
                wire: "AP WIRE — JULY 4, 2016 — The Players' Tribune readies a post titled 'My Next Chapter.'",
                reality: "2016: KD joined the 73-win Warriors · 2 titles · 'ruined the league' era.",
                roster: { label: "73-WIN WARRIORS — HOMEGROWN", players: ["Curry", "Klay", "Barnes", "Green", "Bogut"] },
                question: "Does Durant still go to Golden State?",
                choices: [
                    {
                        text: "Yes — 73 wins bends anyone.",
                        tier: "consensus", points: 25, chaos: 15, stamp: "GRAVITY", next: null,
                        verdict: "The Warriors were homegrown — they rise in your universe too, and the Bay still calls.",
                        headline: "KD TO THE BAY: THE DYNASTY LOCKS IN"
                    },
                    {
                        text: "No — no superteam precedent, so he stays and OKC breaks through.",
                        tier: "plausible", points: 13, chaos: 60, stamp: "LOYALTY CLAUSE", next: null,
                        verdict: "Clean logic — it just needs the most scrutinized free agent ever to ignore an open door.",
                        headline: "LOYALTY WINS: THUNDER TAKE 2017"
                    },
                    {
                        text: "He joins LeBron — the forbidden duo.",
                        tier: "longshot", points: 3, chaos: 95, stamp: "FORBIDDEN INK", next: null,
                        verdict: "Never allowed by ego, cap math, or the basketball gods. Fun to type, though.",
                        headline: "FORBIDDEN DUO: KD AND BRON UNITE"
                    }
                ]
            }
        }
    },

    {
        id: "giannis-cavs",
        kicker: "JUNE 27, 2013 — BROOKLYN",
        headline: "CAVS DRAFT GIANNIS AT NO. 1",
        deck: "The card never reads Anthony Bennett. An 18-year-old from Sepolia goes first. Milwaukee never gets its Freak.",
        reality: "Cavs took Anthony Bennett — biggest No. 1 bust ever · Giannis went 15th to Milwaukee",
        start: "n1",
        nodes: {
            n1: {
                year: 2014,
                wire: "AP WIRE — JULY 2014 — Sports Illustrated readies an essay: 'I'm Coming Home.'",
                reality: "2014: LeBron came home · No. 1 pick Wiggins was flipped for Kevin Love.",
                roster: { label: "YOUR 2014 CAVS", players: ["Kyrie", "Waiters", "Giannis", "Thompson", "Varejao"] },
                question: "Does LeBron still come home?",
                choices: [
                    {
                        text: "Yes — faster. The young core just got scarier.",
                        tier: "consensus", points: 25, chaos: 25, stamp: "HOMECOMING", next: "n2a",
                        verdict: "The essay was about Ohio, not the depth chart — and this time he keeps the prodigy.",
                        headline: "HE'S HOME — AND THE FREAK HAS A MENTOR"
                    },
                    {
                        text: "Yes, but Giannis is flipped for Kevin Love anyway.",
                        tier: "plausible", points: 14, chaos: 15, stamp: "MIRROR WORLD", next: "n2b",
                        verdict: "Exactly what happened to Wiggins. Half credit for cynicism earned.",
                        headline: "FREAK FLIPPED: LOVE ARRIVES, GIANNIS SHIPPED"
                    },
                    {
                        text: "No — he stays in Miami.",
                        tier: "longshot", points: 4, chaos: 80, stamp: "COLD FEET", next: "n2c",
                        verdict: "Coming home was the point. A Greek teenager doesn't change what 2010 felt like.",
                        headline: "KING KEEPS HIS CROWN IN MIAMI"
                    }
                ]
            },
            n2a: {
                year: 2016,
                wire: "AP WIRE — JUNE 2016 — Golden State, 73–9, leads the Finals 3–1.",
                reality: "2016: Cavs came back from 3–1 · Cleveland's first title in 52 years.",
                roster: { label: "YOUR 2016 CAVS", players: ["Kyrie", "J.R. Smith", "LeBron", "Giannis", "Thompson"] },
                question: "Cavs–Warriors II: how does it end?",
                choices: [
                    {
                        text: "Cavs in six — the comeback comes early.",
                        tier: "consensus", points: 24, chaos: 30, stamp: "FREAK MATH", next: "n3",
                        verdict: "They won it in seven without him. Add a 21-year-old Giannis and the margin widens.",
                        headline: "BLOCK PARTY: CLEVELAND ENDS IT EARLY"
                    },
                    {
                        text: "Still seven. Some miracles are fixed points.",
                        tier: "plausible", points: 13, chaos: 10, stamp: "FATALIST", next: "n3",
                        verdict: "Poetic — but rosters aren't fate, and an extra All-NBA wing changes the math.",
                        headline: "3-1 COMEBACK, NOW WITH EXTRA FREAK"
                    },
                    {
                        text: "The 73-win Warriors finish the job.",
                        tier: "longshot", points: 5, chaos: 55, stamp: "HERESY", next: "n3",
                        verdict: "They couldn't close against a weaker Cavs roster. Bold way to earn five points.",
                        headline: "73 AND DONE: GOLDEN STATE IMMORTAL"
                    }
                ]
            },
            n2b: {
                year: 2016,
                wire: "AP WIRE — JUNE 2016 — Your trade rebuilt our universe almost exactly. The Finals arrive on schedule.",
                reality: "2016: LeBron, Kyrie, and Love beat the 73-win Warriors in seven.",
                roster: { label: "YOUR 2016 CAVS — MIRROR BUILD", players: ["Kyrie", "J.R. Smith", "LeBron", "Love", "Thompson"] },
                question: "Who wins the 2016 title?",
                choices: [
                    {
                        text: "Cavs in seven — same script, same miracle.",
                        tier: "consensus", points: 25, chaos: 5, stamp: "MIRROR WORLD", next: "n3",
                        verdict: "Sharp eye: this is literally the real 2016 Finals. History repeats when you hand it the script.",
                        headline: "MIRROR UNIVERSE: CAVS IN SEVEN ANYWAY"
                    },
                    {
                        text: "Warriors close it this time.",
                        tier: "plausible", points: 12, chaos: 45, stamp: "COIN FLIP", next: "n3",
                        verdict: "It was a one-suspension coin flip in real life — but identical setup, identical outcome.",
                        headline: "NO SLIP THIS TIME: WARRIORS FINISH 73-9"
                    },
                    {
                        text: "The Giannis–Towns Wolves crash the party.",
                        tier: "longshot", points: 3, chaos: 85, stamp: "CUB REPORTER", next: "n3",
                        verdict: "A 21- and a 20-year-old past both superpowers? Great ceiling, wrong year.",
                        headline: "WOLVES RISING: YOUNGEST CONTENDERS EVER"
                    }
                ]
            },
            n2c: {
                year: 2016,
                wire: "AP WIRE — MAY 2016 — LeBron's Heat rule the East a sixth straight year. Cleveland is done waiting.",
                reality: "2016: LeBron — back in Cleveland — won it all · Kyrie hit The Shot.",
                roster: { label: "YOUR CAVS — NO LEBRON", players: ["Kyrie", "Waiters", "Giannis", "Thompson", "Mozgov"] },
                question: "What is Kyrie + Giannis Cleveland by 2016?",
                choices: [
                    {
                        text: "A rising 50-win team that can't get past LeBron.",
                        tier: "consensus", points: 23, chaos: 45, stamp: "SLOW COOK", next: "n3",
                        verdict: "Giannis wasn't MVP-level until 2017. The leap is coming — just not yet.",
                        headline: "FREAK SHOW RISING — HEAT STILL RULE"
                    },
                    {
                        text: "Giannis leaps early — Cavs shock the East.",
                        tier: "plausible", points: 12, chaos: 65, stamp: "FAST FORWARD", next: "n3",
                        verdict: "Kyrie's gravity could speed the timeline — but beating prime LeBron at 21 asks a lot.",
                        headline: "TOO GOOD TOO FAST: CAVS TAKE THE EAST"
                    },
                    {
                        text: "He stalls — Cleveland shops him.",
                        tier: "longshot", points: 4, chaos: 55, stamp: "BAD BEAT", next: "n3",
                        verdict: "He improved every season, everywhere. Nobody's ever won betting against Giannis's motor.",
                        headline: "PROJECT STALLED: FREAK ON THE BLOCK"
                    }
                ]
            },
            n3: {
                year: 2019,
                wire: "AP WIRE — JUNE 2019 — In Toronto, Kawhi's shot bounces four times on the rim.",
                reality: "2019: Kawhi's Raptors beat injury-hit Golden State in six.",
                roster: { label: "2019 RAPTORS — UNTOUCHED BY YOUR FORK", players: ["Lowry", "D. Green", "Kawhi", "Siakam", "M. Gasol"] },
                question: "Does Kawhi's 2019 run still happen?",
                choices: [
                    {
                        text: "Yes. The Klaw's year was untouchable.",
                        tier: "consensus", points: 25, chaos: 10, stamp: "FOUR BOUNCES", next: "n4",
                        verdict: "Kawhi's path never touched your fork. The shot bounces four times in every universe.",
                        headline: "KAWHI'S RUN SURVIVES EVERY UNIVERSE"
                    },
                    {
                        text: "No — MVP Giannis takes it, wherever he is.",
                        tier: "plausible", points: 12, chaos: 60, stamp: "FREAK JUNE", next: "n4",
                        verdict: "The real MVP Giannis lost to these exact Raptors in six. The ring comes later.",
                        headline: "FREAK JUNE: GIANNIS GETS HIS RING EARLY"
                    },
                    {
                        text: "A healthy Golden State three-peats.",
                        tier: "longshot", points: 4, chaos: 70, stamp: "BUBBLE WRAP", next: "n4",
                        verdict: "No 2013 draft card unsnaps a tendon. The injuries come regardless.",
                        headline: "STAY WHOLE, STAY GOLDEN: THREE-PEAT"
                    }
                ]
            },
            n4: {
                year: 2021,
                wire: "AP WIRE — JULY 2021 — In our universe tonight, Giannis drops 50 in a closeout game. In yours, Fiserv Forum sits quiet.",
                reality: "2021: Giannis stayed in Milwaukee, dropped 50 in the closeout, won the title.",
                roster: { label: "MILWAUKEE — NO FREAK, EVER", players: ["Bledsoe", "DiVincenzo", "Middleton", "Ilyasova", "B. Lopez"] },
                question: "What's the lasting ripple?",
                choices: [
                    {
                        text: "Milwaukee stays in the lottery — the loyalty fairy tale never exists.",
                        tier: "consensus", points: 25, chaos: 50, stamp: "STONE COLD", next: null,
                        verdict: "Your draft card cost the league its best counterargument to superteams.",
                        headline: "THE RING THAT NEVER WAS: MILWAUKEE'S LONG WINTER"
                    },
                    {
                        text: "Giannis wins one anyway — different jersey.",
                        tier: "plausible", points: 13, chaos: 40, stamp: "TRAVELING CALL", next: null,
                        verdict: "Greatness travels — but 'a superstar won somewhere' isn't the story. Milwaukee was the story.",
                        headline: "GREEK FREAK GETS HIS RING — ELSEWHERE"
                    },
                    {
                        text: "Healthy Brooklyn Big Three takes 2021.",
                        tier: "longshot", points: 4, chaos: 75, stamp: "HOSPITAL BET", next: null,
                        verdict: "Brooklyn staying healthy AND harmonious for two months is the longest shot in any universe.",
                        headline: "BROOKLYN'S BIG THREE FINALLY WHOLE"
                    }
                ]
            }
        }
    },

    {
        id: "mj-portland",
        kicker: "JUNE 19, 1984 — NEW YORK",
        headline: "BLAZERS TAKE JORDAN AT NO. 2",
        deck: "Sam Bowie's name is never called. Michael Jordan lands next to Clyde Drexler in Portland.",
        reality: "Portland took Sam Bowie · Chicago took Jordan at 3 · six rings followed",
        start: "n1",
        nodes: {
            n1: {
                year: 1988,
                wire: "UPI WIRE — APRIL 1988 — Portland's twin-guard experiment is the best show west of Showtime.",
                reality: "Late '80s: MJ put up 37 a game on mediocre Bulls · Drexler's Blazers rose out West.",
                roster: { label: "YOUR 1988 BLAZERS", players: ["Porter", "Drexler", "Jordan", "Kersey", "Duckworth"] },
                question: "Two alpha guards, one ball. What happens?",
                choices: [
                    {
                        text: "It works — MJ bends any roster. Blazers rule the West.",
                        tier: "consensus", points: 22, chaos: 45, stamp: "TALENT WINS", next: "n2a",
                        verdict: "He averaged 37 on a bad Bulls roster — the 'fit' question was always GM cover.",
                        headline: "RIP CITY RISING: MJ AND CLYDE RULE THE WEST"
                    },
                    {
                        text: "Drexler is traded by '87.",
                        tier: "plausible", points: 14, chaos: 55, stamp: "ONE BALL RULE", next: "n2b",
                        verdict: "Cold and plausible — but '80s front offices hoarded talent for years first.",
                        headline: "CLYDE SHIPPED: PORTLAND PICKS ITS ALPHA"
                    },
                    {
                        text: "MJ chafes and forces his way out.",
                        tier: "longshot", points: 4, chaos: 85, stamp: "EXIT DRAFT", next: "n2c",
                        verdict: "In the '80s stars had no leverage — and MJ beat situations, he didn't flee them.",
                        headline: "JORDAN DEMANDS OUT OF PORTLAND"
                    }
                ]
            },
            n2a: {
                year: 1992,
                wire: "UPI WIRE — JUNE 1990 — The Finals run through Oregon. Out West, MJ never faces the Bad Boys.",
                reality: "1990–92: Pistons won two, then MJ's Bulls beat Drexler's Blazers in the '92 Finals.",
                roster: { label: "YOUR 1990 BLAZERS", players: ["Porter", "Drexler", "Jordan", "Kersey", "Duckworth"] },
                question: "Who wins 1990 through '92?",
                choices: [
                    {
                        text: "Portland three-peats — those Finals teams plus MJ don't lose.",
                        tier: "consensus", points: 23, chaos: 50, stamp: "WESTERN WALL", next: "n3",
                        verdict: "The real Blazers made two Finals WITHOUT the best player alive — and MJ skips the Jordan Rules entirely.",
                        headline: "THREE STRAIGHT IN RIP CITY: MJ'S FIRST DYNASTY"
                    },
                    {
                        text: "The Bad Boys stretch their reign — no one in the East stops Detroit now.",
                        tier: "plausible", points: 13, chaos: 45, stamp: "BAD BOYS FOREVER", next: "n3",
                        verdict: "True in the East — but the Finals still run through MJ's Portland in June.",
                        headline: "BAD BOYS THREE-PEAT: DETROIT UNBOTHERED"
                    },
                    {
                        text: "Showtime holds the throne.",
                        tier: "longshot", points: 5, chaos: 60, stamp: "SHOWTIME ETERNAL", next: "n3",
                        verdict: "Magic's 1991 announcement arrives on a date no draft card touches.",
                        headline: "SHOWTIME FOREVER: LAKERS HOLD THE LINE"
                    }
                ]
            },
            n2b: {
                year: 1992,
                wire: "UPI WIRE — FEB 1987 — Drexler dealt at the deadline for a war chest of picks and vets.",
                reality: "1990–92: Bulls broke through in '91 · Blazers made two Finals, won neither.",
                roster: { label: "YOUR BLAZERS — MJ'S TEAM NOW", players: ["Porter", "Jordan", "Kersey", "B. Williams", "Duckworth"] },
                question: "What does MJ-era Portland become?",
                choices: [
                    {
                        text: "The war chest + MJ = title machine by 1990.",
                        tier: "consensus", points: 21, chaos: 50, stamp: "WAR CHEST", next: "n3",
                        verdict: "MJ turns hauls into banners — same clock as the real Bulls, different coast.",
                        headline: "THE HAUL PAYS OFF: PORTLAND BUILDS A MONSTER"
                    },
                    {
                        text: "The haul disappoints — MJ carries them, but not until '92.",
                        tier: "plausible", points: 14, chaos: 40, stamp: "LONE STAR", next: "n3",
                        verdict: "That's the real Bulls timeline in a different jersey. History rhyming is a fair bet.",
                        headline: "ONE-MAN SHOW: MJ WAITS ON HELP"
                    },
                    {
                        text: "The trade curses them — Bowie karma anyway.",
                        tier: "longshot", points: 4, chaos: 70, stamp: "CURSED INK", next: "n3",
                        verdict: "Vibes-based karma grades poorly at this desk. They have Michael Jordan.",
                        headline: "THE CURSE FINDS RIP CITY"
                    }
                ]
            },
            n2c: {
                year: 1992,
                wire: "UPI WIRE — OCT 1988 — After two years of cold war, Portland caves. MJ is on the move.",
                reality: "Reality check: MJ never demanded a trade anywhere — he stayed and conquered.",
                roster: { label: "CHICAGO'S OFFER", players: ["Pippen?", "Grant?", "Three firsts?"] },
                question: "Where does MJ land?",
                choices: [
                    {
                        text: "Chicago — the universe self-corrects.",
                        tier: "consensus", points: 20, chaos: 30, stamp: "SELF-CORRECTING", next: "n3",
                        verdict: "Chicago was desperate and had the assets. The timeline bends back toward its banners.",
                        headline: "HOME AT LAST: BULLS LAND JORDAN"
                    },
                    {
                        text: "LA — he succeeds Showtime.",
                        tier: "plausible", points: 13, chaos: 70, stamp: "HOLLYWOOD", next: "n3",
                        verdict: "No one trades the best player alive inside their own conference.",
                        headline: "CROWN JEWEL: JORDAN JOINS THE LAKERS"
                    },
                    {
                        text: "New York — MSG gets its god.",
                        tier: "longshot", points: 5, chaos: 80, stamp: "BROADWAY", next: "n3",
                        verdict: "The Garden worships him — from the visitors' locker room. No assets, no deal.",
                        headline: "GOD PLAYS AT MSG: JORDAN IS A KNICK"
                    }
                ]
            },
            n3: {
                year: 1993,
                wire: "UPI WIRE — OCT 6, 1993 — A podium is set. The greatest player alive, at 30, is expected to say 'retire.'",
                reality: "Oct 1993: MJ retired after his father's murder · minor-league baseball · returned March '95.",
                question: "His father's murder happens in every universe. Does the baseball detour still happen?",
                choices: [
                    {
                        text: "Yes — it was about grief, not geography.",
                        tier: "consensus", points: 24, chaos: 20, stamp: "GRIEF DOESN'T TRADE", next: "n4",
                        verdict: "No draft card in 1984 reaches that October. He walks away in every timeline.",
                        headline: "JORDAN WALKS AWAY — BASEBALL BECKONS"
                    },
                    {
                        text: "No — a lighter career load means he plays through.",
                        tier: "plausible", points: 12, chaos: 55, stamp: "IRON MAN", next: "n4",
                        verdict: "Skipping the Pistons wars softens the burnout — but the heaviest weight wasn't basketball.",
                        headline: "NO DETOUR: MJ PLAYS THROUGH"
                    },
                    {
                        text: "He retires and never comes back.",
                        tier: "longshot", points: 3, chaos: 90, stamp: "COLD PRESS", next: "n4",
                        verdict: "The man came back twice. 'I'm back' gets faxed in every universe.",
                        headline: "GONE FOR GOOD: JORDAN NEVER RETURNS"
                    }
                ]
            },
            n4: {
                year: 1998,
                wire: "UPI WIRE — JUNE 1998 — The '90s end and Chicago's skyline has nothing to hang. Six rings have to go somewhere.",
                reality: "1991–98: Bulls won six · Ewing, Barkley, Malone, Stockton won zero.",
                roster: { label: "THE RINGLESS CLUB, FREED", players: ["Stockton", "Miller", "Barkley", "Malone", "Ewing"] },
                question: "What is 1990s basketball without the Bulls dynasty?",
                choices: [
                    {
                        text: "The ringless legends feast — Ewing, Barkley, Malone split the spoils.",
                        tier: "consensus", points: 25, chaos: 55, stamp: "REDISTRIBUTION", next: null,
                        verdict: "A whole Hall of Fame generation went ringless because one man existed. Move him West; karma clears.",
                        headline: "THE FORGIVEN GENERATION: BARKLEY AND EWING GET THEIRS"
                    },
                    {
                        text: "Pippen still arrives in '87 — the Bulls win one anyway.",
                        tier: "plausible", points: 12, chaos: 60, stamp: "ROBIN RISES", next: null,
                        verdict: "Every Pippen-led team without MJ topped out at the conference finals. Great engine, no closer.",
                        headline: "PIPPEN'S TOWN: BULLS BAG ONE WITHOUT MIKE"
                    },
                    {
                        text: "The global-icon era never happens — the '90s boom deflates.",
                        tier: "longshot", points: 5, chaos: 75, stamp: "DARK TIMELINE", next: null,
                        verdict: "The Dream Team, the shoes, the bald head all travel to Portland fine. The boom needed the man, not the market.",
                        headline: "THE BOOM THAT NEVER WAS"
                    }
                ]
            }
        }
    },

    {
        id: "kd-stays",
        kicker: "JULY 4, 2016 — THE HAMPTONS",
        headline: "DURANT SAYS NO TO GOLDEN STATE",
        deck: "The Players' Tribune post never publishes. KD re-signs in OKC — eleven months after blowing a 3–1 lead to the team that courted him.",
        reality: "KD joined the 73-win Warriors · 16–1 playoffs · two Finals MVPs",
        start: "n1",
        nodes: {
            n1: {
                year: 2017,
                wire: "AP WIRE — JUNE 2017 — The rematch everyone demanded: the 73-win core vs. the team that had them dead to rights.",
                reality: "2017: KD's Warriors went 16–1 in the playoffs · Finals MVP over LeBron.",
                roster: { label: "YOUR 2017 THUNDER", players: ["Westbrook", "Roberson", "Durant", "Sabonis", "Adams"] },
                question: "Who takes the 2017 title?",
                choices: [
                    {
                        text: "Warriors anyway — historic before KD ever visited.",
                        tier: "consensus", points: 21, chaos: 30, stamp: "HOUSE ALWAYS WINS", next: "n2a",
                        verdict: "73 wins without him; the 2016 collapse took a suspension and a hobbled Curry.",
                        headline: "NO HELP NEEDED: WARRIORS TAKE IT BACK"
                    },
                    {
                        text: "OKC breaks through — revenge tour.",
                        tier: "plausible", points: 15, chaos: 55, stamp: "REVENGE TOUR", next: "n2b",
                        verdict: "This core had the 73-win Warriors down 3–1. Barely even alt-history.",
                        headline: "THUNDERSTRUCK: OKC'S PARADE ARRIVES"
                    },
                    {
                        text: "LeBron repeats through the chaos.",
                        tier: "longshot", points: 6, chaos: 50, stamp: "KING'S RANSOM", next: "n2c",
                        verdict: "The real 2017 Cavs lost 4–1 — somebody healthy still comes out of the West.",
                        headline: "BACK-TO-BACK: LEBRON REPEATS ANYWAY"
                    }
                ]
            },
            n2a: {
                year: 2018,
                wire: "AP WIRE — MAY 2018 — KD and Russ leave the floor separately after another June exit. Neither speaks.",
                reality: "2018: KD's Warriors swept the Finals · he repeated as Finals MVP.",
                roster: { label: "YOUR THUNDER — ON FIRE", players: ["Westbrook", "Roberson", "Durant", "Grant", "Adams"] },
                question: "The loyalty bet lost again. What now?",
                choices: [
                    {
                        text: "They run it back — contracts and pride.",
                        tier: "consensus", points: 20, chaos: 40, stamp: "GOLDEN HANDCUFFS", next: "n3",
                        verdict: "After the 2016 re-up, exits get harder every year. Uneasy NBA marriages mostly just continue.",
                        headline: "RUNNING IT BACK: OKC'S UNEASY TRUCE HOLDS"
                    },
                    {
                        text: "KD leaves in 2018 — the itch was never about one summer.",
                        tier: "plausible", points: 15, chaos: 35, stamp: "DELAYED DECISION", next: "n3",
                        verdict: "Strong read: one loyal re-up doesn't cure wanting a new basketball life.",
                        headline: "THE DECISION, DELAYED: KD WALKS IN '18"
                    },
                    {
                        text: "OKC trades Russ to save the marriage.",
                        tier: "longshot", points: 5, chaos: 65, stamp: "SACRIFICE PLAY", next: "n3",
                        verdict: "Small markets don't trade the local icon to appease the quiet one.",
                        headline: "RUSS SHIPPED: OKC PICKS DURANT"
                    }
                ]
            },
            n2b: {
                year: 2018,
                wire: "AP WIRE — JUNE 2017 — Confetti in Oklahoma City. Durant, Finals MVP, hugs Westbrook at midcourt.",
                reality: "2018: In our universe, OKC (with Paul George) lost in round one.",
                roster: { label: "YOUR CHAMPION THUNDER", players: ["Westbrook", "Roberson", "Durant", "Grant", "Adams"] },
                question: "What does the ring change?",
                choices: [
                    {
                        text: "KD signs the supermax — OKC becomes the league's loyalty gospel.",
                        tier: "consensus", points: 22, chaos: 65, stamp: "GOSPEL OF OKC", next: "n3",
                        verdict: "A ring answers the only question that made him look elsewhere — the Giannis parable, four years early.",
                        headline: "SUPERMAX SIGNED: OKC BECOMES THE MODEL"
                    },
                    {
                        text: "He still walks — champions leave too.",
                        tier: "plausible", points: 12, chaos: 70, stamp: "RING AND RUN", next: "n3",
                        verdict: "Leaving the summer after a title in the city that bet on you is a PR inferno even he wouldn't book.",
                        headline: "MISSION COMPLETE: KD LEAVES A CHAMPION"
                    },
                    {
                        text: "Russ demands out — one ball, one crown.",
                        tier: "longshot", points: 4, chaos: 80, stamp: "THRONE WAR", next: "n3",
                        verdict: "Russ stayed loyal even after being LEFT. Winning buries beef; it doesn't birth it.",
                        headline: "CROWN FIGHT: WESTBROOK WANTS OUT"
                    }
                ]
            },
            n2c: {
                year: 2018,
                wire: "AP WIRE — JULY 2017 — Cleveland celebrates a repeat. In the front office, a trade request sits unread.",
                reality: "2017–18: Kyrie forced his trade · LeBron left for LA a year later.",
                roster: { label: "YOUR REPEAT CHAMP CAVS", players: ["Kyrie", "J.R. Smith", "LeBron", "Love", "Thompson"] },
                question: "What breaks first?",
                choices: [
                    {
                        text: "Nothing in Cleveland — but Golden State retools and takes 2018 back.",
                        tier: "consensus", points: 20, chaos: 45, stamp: "EMPIRE REBUILDS", next: "n3",
                        verdict: "A wounded 73-win core reloads fast. That machine wasn't done in any universe.",
                        headline: "THE EMPIRE ANSWERS: GOLDEN STATE RETAKES JUNE"
                    },
                    {
                        text: "Kyrie still demands his trade.",
                        tier: "plausible", points: 14, chaos: 40, stamp: "RESTLESS PRINCE", next: "n3",
                        verdict: "The real Kyrie asked out a month after a Finals run. Rings don't cure restlessness.",
                        headline: "SHADOW WAR: KYRIE ASKS OUT ANYWAY"
                    },
                    {
                        text: "LeBron never leaves Cleveland.",
                        tier: "longshot", points: 5, chaos: 70, stamp: "FOREVER LAND", next: "n3",
                        verdict: "LA was about the next 40 years, not the next ring. More banners make the goodbye sweeter.",
                        headline: "FOREVER KING: LEBRON NEVER LEAVES AGAIN"
                    }
                ]
            },
            n3: {
                year: 2019,
                wire: "AP WIRE — JUNE 10, 2019 — In our universe tonight, KD ruptures an Achilles in a Warriors uniform, rushed back too soon.",
                reality: "2019: KD tore his Achilles in Game 5, left for Brooklyn that summer.",
                roster: { label: "YOUR 2019 THUNDER", players: ["Westbrook", "Ferguson", "Durant", "Grant", "Adams"] },
                question: "Your universe rewrote his June. What's KD's late prime?",
                choices: [
                    {
                        text: "Healthier — no rushed comeback, no rupture.",
                        tier: "consensus", points: 22, chaos: 55, stamp: "LOAD MANAGED", next: "n4",
                        verdict: "The tear followed a specific rushed June that you erased. Change the June, keep the tendon.",
                        headline: "NEVER BROKEN: KD'S PRIME RUNS LONG"
                    },
                    {
                        text: "The Achilles was coming anyway.",
                        tier: "plausible", points: 12, chaos: 30, stamp: "ACTUARIAL TABLE", next: "n4",
                        verdict: "Fair fatalism — but this tear had a documented chain of causes, and you broke the chain.",
                        headline: "THE BILL COMES DUE: KD GOES DOWN ANYWAY"
                    },
                    {
                        text: "He ends up in Brooklyn anyway.",
                        tier: "longshot", points: 5, chaos: 45, stamp: "MANIFEST DESTINY", next: "n4",
                        verdict: "Brooklyn happened because the Warriors chapter closed painfully. No wreckage, no Nets.",
                        headline: "DESTINATION BROOKLYN, EVERY TIME"
                    }
                ]
            },
            n4: {
                year: 2023,
                wire: "AP WIRE — JUNE 2023 — A sixth different champ in six years. Columnists argue when 'the parity era' really began.",
                reality: "2020s: Six different champions in six years once the KD Warriors broke up.",
                question: "No KD-to-GSW means no 'ruined the league' era. What's the 2020s' shape?",
                choices: [
                    {
                        text: "Parity arrives early — the dynasty era ends in 2017, not 2022.",
                        tier: "consensus", points: 23, chaos: 60, stamp: "EARLY PARITY", next: null,
                        verdict: "The KD Warriors were the last forgone conclusion. Remove them; the coin-flip era starts two years sooner.",
                        headline: "EVERYBODY EATS: THE PARITY DECADE STARTS EARLY"
                    },
                    {
                        text: "Some other superteam forms — the league abhors a vacuum.",
                        tier: "plausible", points: 13, chaos: 40, stamp: "VACUUM LAW", next: null,
                        verdict: "Stars kept teaming up before and after KD — but nothing else in that window came close to inevitable.",
                        headline: "NEW MONSTER, SAME LEAGUE: A SUPERTEAM RISES"
                    },
                    {
                        text: "The Warriors dynasty never ends — Curry collects eight.",
                        tier: "longshot", points: 4, chaos: 85, stamp: "INFINITY GAUNTLET", next: null,
                        verdict: "Even with KD they broke by 2019. Eight rings is a video-game save file, not a forecast.",
                        headline: "GAUNTLET COMPLETE: CURRY'S ENDLESS EMPIRE"
                    }
                ]
            }
        }
    }
];
