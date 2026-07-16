// RIPPLE — game engine

const $ = (id) => document.getElementById(id);

const TIER_LABEL = { consensus: "CONSENSUS", plausible: "PLAUSIBLE", longshot: "LONG SHOT" };
const TIER_EMOJI = { consensus: "🟩", plausible: "🟨", longshot: "🟥" };
const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let state = null;
let typeTimer = null;

// ---------- front page ----------

function renderFront() {
    showScreen("screen-front");
    const list = $("scenario-list");
    list.innerHTML = "";
    SCENARIOS.forEach((sc) => {
        const btn = document.createElement("button");
        btn.className = "teaser";
        btn.innerHTML = `
            <div class="teaser-top">
                <div class="teaser-body">
                    <p class="teaser-kicker">BREAKING · ${sc.kicker}</p>
                    <h2 class="teaser-headline">${sc.headline}</h2>
                    <p class="teaser-deck">${sc.deck}</p>
                </div>
                <div class="teaser-art">${ART.scenarios[sc.id] || ART.ball}</div>
            </div>
            <p class="teaser-reality">REALLY HAPPENED: ${sc.reality}</p>
            <span class="teaser-cta">PLAY THIS TIMELINE →</span>`;
        btn.addEventListener("click", () => startScenario(sc));
        list.appendChild(btn);
    });
}

// ---------- rounds ----------

function startScenario(scenario) {
    const totalRounds = countRounds(scenario);
    state = { scenario, nodeId: scenario.start, round: 1, totalRounds, score: 0, picks: [] };
    renderNode();
}

function avgDrift() {
    if (!state.picks.length) return 0;
    return Math.round(state.picks.reduce((s, p) => s + p.chaos, 0) / state.picks.length);
}

// Depth of the tree from the start node (every path has equal length by design).
function countRounds(scenario) {
    let depth = 0;
    let id = scenario.start;
    while (id) {
        depth += 1;
        id = scenario.nodes[id].choices[0].next;
    }
    return depth;
}

function renderNode() {
    showScreen("screen-round");
    const node = state.scenario.nodes[state.nodeId];

    $("round-progress").textContent = `RIPPLE ${state.round} OF ${state.totalRounds} · ${node.year}`;
    $("round-drift").textContent = state.picks.length ? `DRIFT ${avgDrift()}%` : "";
    $("round-score").textContent = `SCORE ${state.score}`;
    $("round-question").textContent = node.question;

    const photo = ART.nodePhotos[state.scenario.id]?.[state.nodeId];
    if (photo) {
        $("press-photo-img").innerHTML = ART.poses[photo.pose];
        $("press-photo-caption").textContent = photo.caption;
        $("press-photo").classList.remove("hidden");
    } else {
        $("press-photo").classList.add("hidden");
    }

    $("reality-text").textContent = node.reality;
    if (node.roster) {
        $("roster-label").textContent = node.roster.label;
        $("roster-players").textContent = node.roster.players.join(" · ");
        $("roster").classList.remove("hidden");
    } else {
        $("roster").classList.add("hidden");
    }
    $("verdict").classList.add("hidden");

    typeWire(node.wire);

    const list = $("choice-list");
    list.innerHTML = "";
    shuffle([...node.choices]).forEach((choice) => {
        const btn = document.createElement("button");
        btn.className = "choice";
        btn.textContent = choice.text;
        btn.addEventListener("click", () => pick(choice, btn));
        list.appendChild(btn);
    });

    window.scrollTo({ top: 0, behavior: "instant" });
}

function typeWire(text) {
    clearInterval(typeTimer);
    const el = $("wire-text");
    el.classList.remove("done");
    if (REDUCED_MOTION) {
        el.textContent = text;
        el.classList.add("done");
        return;
    }
    el.textContent = "";
    let i = 0;
    typeTimer = setInterval(() => {
        i += 2; // two chars a tick keeps it brisk
        el.textContent = text.slice(0, i);
        if (i >= text.length) {
            clearInterval(typeTimer);
            el.classList.add("done");
        }
    }, 18);
}

function pick(choice, btn) {
    const node = state.scenario.nodes[state.nodeId];
    state.score += choice.points;
    state.picks.push({
        year: node.year,
        tier: choice.tier,
        points: choice.points,
        chaos: choice.chaos,
        stamp: choice.stamp,
        headline: choice.headline,
    });

    document.querySelectorAll(".choice").forEach((b) => (b.disabled = true));
    btn.classList.add("picked");

    $("verdict-stamp").textContent = choice.stamp;
    $("verdict-stamp").className = `stamp ${choice.tier}`;
    $("verdict-points").textContent = `+${choice.points} PTS`;
    $("verdict-chaos").textContent = `CHAOS ${choice.chaos}`;
    $("round-drift").textContent = `DRIFT ${avgDrift()}%`;
    $("verdict-text").textContent = choice.verdict;
    $("btn-next").textContent = choice.next ? "NEXT RIPPLE →" : "READ YOUR FINAL EDITION →";
    $("btn-next").onclick = () => advance(choice.next);
    $("verdict").classList.remove("hidden");
    $("verdict").scrollIntoView({ behavior: REDUCED_MOTION ? "instant" : "smooth", block: "nearest" });

    $("round-score").textContent = `SCORE ${state.score}`;
}

function advance(nextId) {
    if (nextId) {
        state.nodeId = nextId;
        state.round += 1;
        renderNode();
    } else {
        renderReveal();
    }
}

// ---------- reveal ----------

// Title comes from BOTH axes: how plausible your calls were (pct)
// and how far your universe drifted from ours (drift).
function historianTitle(pct, drift) {
    if (pct >= 70 && drift >= 50) return {
        title: "Editor-in-Chief of the Multiverse",
        blurb: "Bold calls that hold up under scrutiny — you rewrote history and the fact-checkers found nothing.",
    };
    if (pct >= 70) return {
        title: "The Documentarian",
        blurb: "Airtight — though your universe looks suspiciously like ours. Ever considered taking a swing?",
    };
    if (pct >= 40 && drift >= 50) return {
        title: "Alt-History Columnist",
        blurb: "A wild universe held together with decent sourcing. The op-ed desk is impressed; the fact-checkers are tired.",
    };
    if (pct >= 40) return {
        title: "Cautious Beat Reporter",
        blurb: "Safe picks, shaky reasoning. You hedged your way through history and history noticed.",
    };
    if (drift >= 50) return {
        title: "Fan Fiction Laureate",
        blurb: "Zero regard for evidence, maximum regard for drama. Frankly, your universe sounds more fun than ours.",
    };
    return {
        title: "Timid Time Traveler",
        blurb: "You changed almost nothing and were still wrong about it. A remarkable achievement.",
    };
}

function renderReveal() {
    showScreen("screen-reveal");
    $("reveal-sub").textContent = state.scenario.headline;

    const stack = $("clipping-stack");
    stack.innerHTML = "";
    state.picks.forEach((p, i) => {
        const clip = document.createElement("article");
        clip.className = "clipping";
        clip.style.setProperty("--delay", `${i * 0.35}s`);
        clip.innerHTML = `
            <div class="clipping-date">
                <span>${p.year} · YOUR UNIVERSE</span>
                <span class="clipping-tier ${p.tier}">${TIER_LABEL[p.tier]}</span>
            </div>
            <h3 class="clipping-headline">${p.headline}</h3>`;
        stack.appendChild(clip);
    });

    const max = state.totalRounds * 25;
    const pct = Math.round((state.score / max) * 100);
    const drift = avgDrift();
    const rating = historianTitle(pct, drift);
    $("final-score").textContent = `${state.score}/${max}`;
    $("final-drift").textContent = `${drift}%`;
    $("drift-fill").style.width = `${drift}%`;
    $("final-title").textContent = `“${rating.title}”`;
    $("final-blurb").textContent = rating.blurb;
    $("emoji-row").textContent = state.picks.map((p) => TIER_EMOJI[p.tier]).join(" ");

    $("btn-share").textContent = "Copy result";
    $("btn-share").onclick = share;
    $("btn-again").onclick = renderFront;

    window.scrollTo({ top: 0, behavior: "instant" });
}

function share() {
    const emojis = state.picks.map((p) => TIER_EMOJI[p.tier]).join("");
    const max = state.totalRounds * 25;
    const drift = avgDrift();
    const rating = historianTitle(Math.round((state.score / max) * 100), drift);
    const text = `RIPPLE 🏀 — ${state.scenario.headline}\n${emojis} ${state.score}/${max} plausible · ${drift}% divergent\n“${rating.title}”`;
    navigator.clipboard.writeText(text).then(
        () => ($("btn-share").textContent = "Copied!"),
        () => ($("btn-share").textContent = "Copy failed — screenshot it")
    );
}

// ---------- utils ----------

function showScreen(id) {
    document.querySelectorAll(".screen").forEach((s) => s.classList.add("hidden"));
    $(id).classList.remove("hidden");
}

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

$("masthead-ball").innerHTML = ART.ball;
$("reveal-ball").innerHTML = ART.ball;
renderFront();
