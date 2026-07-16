// RIPPLE — inline SVG art, newsprint woodcut style.
// All vectors, no external images: works offline, inherits theme colors via CSS vars.

// player pictograms — thick-stroke silhouettes, one per action pose
const POSE_WRAP = (inner) =>
    `<svg viewBox="0 0 120 100" fill="none" stroke="var(--paper)" stroke-width="7"
        stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;

const POSES = {
    dunk: POSE_WRAP(`
        <circle cx="58" cy="22" r="7" fill="var(--paper)" stroke="none"/>
        <path d="M56 32 L48 52"/>
        <path d="M56 33 L74 19"/>
        <circle cx="81" cy="14" r="7" stroke="var(--leather)" stroke-width="4"/>
        <path d="M55 36 L40 42"/>
        <path d="M48 52 L36 62 L28 76"/>
        <path d="M48 52 L53 68 L45 82"/>
        <path d="M90 8 L114 8" stroke-width="4"/>
        <path d="M94 8 L92 20 M102 8 L102 20 M110 8 L108 20" stroke-width="2.5"/>`),
    jumper: POSE_WRAP(`
        <circle cx="60" cy="27" r="7" fill="var(--paper)" stroke="none"/>
        <path d="M60 35 L60 58"/>
        <path d="M60 38 L49 24"/>
        <path d="M60 38 L70 26"/>
        <circle cx="56" cy="12" r="7" stroke="var(--leather)" stroke-width="4"/>
        <path d="M60 58 L51 73 L54 88"/>
        <path d="M60 58 L68 72 L65 87"/>`),
    fadeaway: POSE_WRAP(`
        <circle cx="45" cy="24" r="7" fill="var(--paper)" stroke="none"/>
        <path d="M47 32 L57 54"/>
        <path d="M49 34 L61 19"/>
        <circle cx="66" cy="13" r="7" stroke="var(--leather)" stroke-width="4"/>
        <path d="M50 38 L37 31"/>
        <path d="M57 54 L44 66 L40 80"/>
        <path d="M57 54 L61 70 L52 82"/>`),
    block: POSE_WRAP(`
        <circle cx="54" cy="28" r="7" fill="var(--paper)" stroke="none"/>
        <path d="M56 36 L59 58"/>
        <path d="M56 36 L45 14"/>
        <circle cx="40" cy="9" r="7" stroke="var(--leather)" stroke-width="4"/>
        <path d="M57 40 L69 47"/>
        <path d="M59 58 L48 72 L42 86"/>
        <path d="M59 58 L71 68 L79 80"/>`),
    trophy: POSE_WRAP(`
        <circle cx="60" cy="32" r="7" fill="var(--paper)" stroke="none"/>
        <path d="M60 40 L60 63"/>
        <path d="M60 43 L49 27"/>
        <path d="M60 43 L71 27"/>
        <path d="M50 16 h20 l-2 9 c-1 4 -4 6 -8 6 s-7 -2 -8 -6 z" stroke="var(--leather)" stroke-width="4"/>
        <path d="M60 63 L52 78 L54 90"/>
        <path d="M60 63 L68 78 L66 90"/>`),
    handshake: POSE_WRAP(`
        <circle cx="36" cy="26" r="7" fill="var(--paper)" stroke="none"/>
        <path d="M36 34 L36 60"/>
        <path d="M36 60 L30 78 M36 60 L42 78"/>
        <path d="M36 39 L54 47"/>
        <circle cx="84" cy="26" r="7" fill="var(--paper)" stroke="none"/>
        <path d="M84 34 L84 60"/>
        <path d="M84 60 L78 78 M84 60 L90 78"/>
        <path d="M84 39 L66 47"/>
        <path d="M54 47 L66 47" stroke="var(--leather)"/>`),
    baseball: POSE_WRAP(`
        <circle cx="52" cy="28" r="7" fill="var(--paper)" stroke="none"/>
        <path d="M54 36 L58 58"/>
        <path d="M55 38 L69 30"/>
        <path d="M69 30 L88 12" stroke="var(--leather)" stroke-width="5"/>
        <path d="M58 58 L48 74 L46 88"/>
        <path d="M58 58 L66 72 L70 86"/>`),
    podium: POSE_WRAP(`
        <circle cx="60" cy="22" r="7" fill="var(--paper)" stroke="none"/>
        <path d="M60 30 L60 44"/>
        <path d="M60 34 L49 45 M60 34 L71 45"/>
        <path d="M42 46 h36 l5 32 h-46 z" stroke-width="4"/>
        <path d="M72 46 L77 35" stroke-width="3"/>
        <circle cx="78" cy="32" r="2.5" fill="var(--paper)" stroke="none"/>`),
    dribble: POSE_WRAP(`
        <circle cx="56" cy="30" r="7" fill="var(--paper)" stroke="none"/>
        <path d="M56 38 L52 58"/>
        <path d="M55 41 L68 56"/>
        <circle cx="73" cy="66" r="7" stroke="var(--leather)" stroke-width="4"/>
        <path d="M54 43 L40 49"/>
        <path d="M52 58 L38 70 L34 84"/>
        <path d="M52 58 L64 70 L70 82"/>`)
};

const ART = {
    poses: POSES,

    // press photo per round, keyed by scenario id + node id
    nodePhotos: {
        "kg-trade": {
            n1: { pose: "fadeaway", caption: "KOBE, UNGUARDED BY HISTORY" },
            n2a: { pose: "trophy", caption: "THREE-PEAT WATCH IN LOS ANGELES" },
            n2b: { pose: "jumper", caption: "THE BANK IS OPEN LATE IN SAN ANTONIO" },
            n2c: { pose: "podium", caption: "THE DECISION, REVISED" },
            n3: { pose: "podium", caption: "GREENWICH, CONNECTICUT — TONIGHT" },
            n3c: { pose: "dunk", caption: "OKC'S TWIN ENGINES, INEVITABLE?" },
            n4: { pose: "jumper", caption: "SPLASH: 73 WINS AND COUNTING" }
        },
        "giannis-cavs": {
            n1: { pose: "handshake", caption: "DRAFT NIGHT, REWRITTEN" },
            n2a: { pose: "block", caption: "THE BLOCK COMES EARLY" },
            n2b: { pose: "jumper", caption: "THE SHOT, AGAIN?" },
            n2c: { pose: "dribble", caption: "KYRIE KEEPS THE KEYS" },
            n3: { pose: "jumper", caption: "FOUR BOUNCES IN TORONTO" },
            n4: { pose: "trophy", caption: "THE PARADE THAT MOVED" }
        },
        "mj-portland": {
            n1: { pose: "dribble", caption: "TWO ALPHAS, ONE BALL" },
            n2a: { pose: "dunk", caption: "AIR TRAVELS WEST" },
            n2b: { pose: "fadeaway", caption: "MJ'S TOWN NOW" },
            n2c: { pose: "handshake", caption: "THE TRADE OF THE CENTURY" },
            n3: { pose: "baseball", caption: "SPRING TRAINING, ANY UNIVERSE" },
            n4: { pose: "trophy", caption: "SIX RINGS, REDISTRIBUTED" }
        },
        "kd-stays": {
            n1: { pose: "jumper", caption: "THE REMATCH OF THE CENTURY" },
            n2a: { pose: "podium", caption: "EXIT INTERVIEWS, AGAIN" },
            n2b: { pose: "trophy", caption: "LOYALTY, PAID IN FULL" },
            n2c: { pose: "dunk", caption: "THE KING'S ENCORE" },
            n3: { pose: "fadeaway", caption: "THE JUNE THAT NEVER WAS" },
            n4: { pose: "dribble", caption: "PARITY BALL" }
        }
    },

    // classic basketball, seams only
    ball: `<svg viewBox="0 0 64 64" fill="none" stroke="var(--leather)" stroke-width="2.5" aria-hidden="true">
        <circle cx="32" cy="32" r="27"/>
        <path d="M5 32h54"/>
        <path d="M32 5v54"/>
        <path d="M13 12c8.5 6.5 13 12.8 13 20s-4.5 13.5-13 20"/>
        <path d="M51 12c-8.5 6.5-13 12.8-13 20s4.5 13.5 13 20"/>
    </svg>`,

    scenarios: {
        // torn trade agreement
        "kg-trade": `<svg viewBox="0 0 64 64" fill="none" stroke="var(--paper)" stroke-width="2" stroke-linejoin="round" aria-hidden="true">
            <path d="M10 8h19l-3 5 3 5-3 5 3 5-3 5 3 5-3 5 3 5-3 5 3 4H10z"/>
            <g transform="rotate(7 45 32)">
                <path d="M54 8H37l3 5-3 5 3 5-3 5 3 5-3 5 3 5-3 5 3 5-3 4h17z"/>
                <path d="M41 18h8M41 24h8M41 30h8" stroke="var(--byline)"/>
            </g>
            <path d="M14 18h9M14 24h9M14 30h9" stroke="var(--byline)"/>
            <path d="M15 41l9 9M24 41l-9 9" stroke="var(--wire-red)" stroke-width="2.5"/>
        </svg>`,

        // the No. 1 draft card
        "giannis-cavs": `<svg viewBox="0 0 64 64" fill="none" stroke="var(--paper)" stroke-width="2" aria-hidden="true">
            <rect x="12" y="6" width="40" height="52" rx="2"/>
            <path d="M12 18h40"/>
            <path d="M18 12.5h16" stroke="var(--byline)"/>
            <text x="32" y="47" font-size="26" font-weight="900" fill="var(--leather)" stroke="none"
                text-anchor="middle" font-family="'Big Shoulders Display',sans-serif">1</text>
            <path d="M18 52h28" stroke="var(--byline)"/>
        </svg>`,

        // the high-top that went to Portland
        "mj-portland": `<svg viewBox="0 0 64 64" fill="none" stroke="var(--paper)" stroke-width="2.5" stroke-linejoin="round" aria-hidden="true">
            <path d="M8 46c0-5 4-6.5 10-8l12-3c5-1.3 6.8-5.8 7.8-11.5L39 15l7.5 2.2-1.2 7.3c8.5 3 12.7 8.5 12.7 14.5v7H8z"/>
            <path d="M8 46v5h50v-5" />
            <path d="M30 36l4 3.5M36 33l4 3.5M42 30.5l4 3.5" stroke="var(--byline)" stroke-width="2"/>
            <circle cx="46" cy="21" r="1.6" fill="var(--wire-red)" stroke="none"/>
        </svg>`,

        // the letter that never published
        "kd-stays": `<svg viewBox="0 0 64 64" fill="none" stroke="var(--paper)" stroke-width="2" stroke-linejoin="round" aria-hidden="true">
            <rect x="8" y="14" width="48" height="36"/>
            <path d="M8 14l24 18 24-18"/>
            <g transform="rotate(-12 32 36)">
                <rect x="17" y="29" width="30" height="14" stroke="var(--wire-red)" stroke-width="2.5"/>
                <text x="32" y="40" font-size="10" font-weight="700" fill="var(--wire-red)" stroke="none"
                    text-anchor="middle" letter-spacing="3" font-family="'Courier Prime',monospace">NO</text>
            </g>
        </svg>`
    }
};
