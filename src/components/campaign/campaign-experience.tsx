"use client";

import Image from "next/image";
import {
  Activity,
  ArrowRight,
  BriefcaseBusiness,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Copy,
  FileSearch,
  LockKeyhole,
  Minus,
  Plus,
  Radio,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  Trophy,
  Users,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import "./campaign-mobile.css";

import type { CampaignDefinition, CampaignStrategy, CampaignTurn } from "@/lib/campaign/schema";
import {
  CAMPAIGN_GRADE_BANDS,
  CAMPAIGN_STORAGE_PREFIX,
  advanceCampaign,
  canCommitStrategy,
  commitStrategy,
  createCampaignState,
  getCampaignEnding,
  getCampaignScore,
  getCampaignTurnCopy,
  getChanceBreakdown,
  getObjectiveProgress,
  getStrategyChance,
  investigate,
  objectiveComplete,
  ownerTrustCollapsed,
  resolveCounteroffer,
  restoreCampaignState,
  riskLabel,
  strategyRequirementsMet,
  type CampaignChange,
  type CampaignState,
} from "@/lib/campaign/engine";

const art: Record<string, string> = {
  "war-room": "/campaign/war-room.png",
  "deadline-board": "/campaign/contract-table.png",
  "contract-table": "/campaign/contract-table.png",
  "playoff-tunnel": "/campaign/playoff-tunnel.png",
};

const depthChartPositions = ["PG", "SG", "SF", "PF", "C"] as const;

type PlayerProfile = { height: string; college: string; birthDate: string; href: string };

const playerProfiles: Record<string, PlayerProfile> = {
  "Russell Westbrook": { height: "6'3\"", college: "UCLA", birthDate: "1988-11-12", href: "https://www.basketball-reference.com/players/w/westbru01.html" },
  "Victor Oladipo": { height: "6'4\"", college: "Indiana", birthDate: "1992-05-04", href: "https://www.basketball-reference.com/players/o/oladivi01.html" },
  "Andre Roberson": { height: "6'7\"", college: "Colorado", birthDate: "1991-12-04", href: "https://www.basketball-reference.com/players/r/roberan03.html" },
  "Kevin Durant": { height: "6'9\"", college: "Texas", birthDate: "1988-09-29", href: "https://www.basketball-reference.com/players/d/duranke01.html" },
  "Steven Adams": { height: "7'0\"", college: "Pittsburgh", birthDate: "1993-07-20", href: "https://www.basketball-reference.com/players/a/adamsst01.html" },
  "Chauncey Billups": { height: "6'3\"", college: "Colorado", birthDate: "1976-09-25", href: "https://www.basketball-reference.com/players/b/billuch01.html" },
  "Richard Hamilton": { height: "6'7\"", college: "UConn", birthDate: "1978-02-14", href: "https://www.basketball-reference.com/players/h/hamilri01.html" },
  "Tayshaun Prince": { height: "6'9\"", college: "Kentucky", birthDate: "1980-02-28", href: "https://www.basketball-reference.com/players/p/princta01.html" },
  "Mehmet Okur": { height: "6'11\"", college: "International", birthDate: "1979-05-26", href: "https://www.basketball-reference.com/players/o/okurme01.html" },
  "Ben Wallace": { height: "6'9\"", college: "Virginia Union", birthDate: "1974-09-10", href: "https://www.basketball-reference.com/players/w/wallabe01.html" },
  "Lou Williams": { height: "6'1\"", college: "South Gwinnett HS", birthDate: "1986-10-27", href: "https://www.basketball-reference.com/players/w/willilo02.html" },
  "P.J. Tucker": { height: "6'5\"", college: "Texas", birthDate: "1985-05-05", href: "https://www.basketball-reference.com/players/t/tuckepj01.html" },
  "Josh Huestis": { height: "6'7\"", college: "Stanford", birthDate: "1991-12-19", href: "https://www.basketball-reference.com/players/h/huestjo01.html" },
  "Rodney Hood": { height: "6'8\"", college: "Duke", birthDate: "1992-10-20", href: "https://www.basketball-reference.com/players/h/hoodro01.html" },
  "Carmelo Anthony": { height: "6'7\"", college: "Syracuse", birthDate: "1984-05-29", href: "https://www.basketball-reference.com/players/a/anthoca01.html" },
  "Dwyane Wade": { height: "6'4\"", college: "Marquette", birthDate: "1982-01-17", href: "https://www.basketball-reference.com/players/w/wadedw01.html" },
  "Chris Bosh": { height: "6'11\"", college: "Georgia Tech", birthDate: "1984-03-24", href: "https://www.basketball-reference.com/players/b/boshch01.html" },
  "Rasheed Wallace": { height: "6'11\"", college: "North Carolina", birthDate: "1974-09-17", href: "https://www.basketball-reference.com/players/w/wallara01.html" },
  "George Lynch": { height: "6'8\"", college: "North Carolina", birthDate: "1970-09-03", href: "https://www.basketball-reference.com/players/l/lynchge01.html" },
  "Nazr Mohammed": { height: "6'10\"", college: "Kentucky", birthDate: "1977-09-05", href: "https://www.basketball-reference.com/players/m/mohamna01.html" },
  "Tyson Chandler": { height: "7'1\"", college: "Dominguez HS", birthDate: "1982-10-02", href: "https://www.basketball-reference.com/players/c/chandty01.html" },
  "Shane Battier": { height: "6'8\"", college: "Duke", birthDate: "1978-09-09", href: "https://www.basketball-reference.com/players/b/battish01.html" },
  "Derrick Rose": { height: "6'2\"", college: "Memphis", birthDate: "1988-10-04", href: "https://www.basketball-reference.com/players/r/rosede01.html" },
  "Jimmy Butler": { height: "6'7\"", college: "Marquette", birthDate: "1989-09-14", href: "https://www.basketball-reference.com/players/b/butleji01.html" },
  "Luol Deng": { height: "6'9\"", college: "Duke", birthDate: "1985-04-16", href: "https://www.basketball-reference.com/players/d/denglu01.html" },
  "Carlos Boozer": { height: "6'9\"", college: "Duke", birthDate: "1981-11-20", href: "https://www.basketball-reference.com/players/b/boozeca01.html" },
  "Joakim Noah": { height: "6'11\"", college: "Florida", birthDate: "1985-02-25", href: "https://www.basketball-reference.com/players/n/noahjo01.html" },
  "Taj Gibson": { height: "6'9\"", college: "USC", birthDate: "1985-06-24", href: "https://www.basketball-reference.com/players/g/gibsota01.html" },
  "Kyle Korver": { height: "6'7\"", college: "Creighton", birthDate: "1981-03-17", href: "https://www.basketball-reference.com/players/k/korveky01.html" },
  "C.J. Watson": { height: "6'2\"", college: "Tennessee", birthDate: "1984-04-17", href: "https://www.basketball-reference.com/players/w/watsocj01.html" },
  "Omer Asik": { height: "7'0\"", college: "International", birthDate: "1986-07-04", href: "https://www.basketball-reference.com/players/a/asikom01.html" },
  "Jamal Crawford": { height: "6'5\"", college: "Michigan", birthDate: "1980-03-20", href: "https://www.basketball-reference.com/players/c/crawfja01.html" },
  "Pau Gasol": { height: "7'0\"", college: "International", birthDate: "1980-07-06", href: "https://www.basketball-reference.com/players/g/gasolpa01.html" },
  "Nikola Mirotic": { height: "6'10\"", college: "International", birthDate: "1991-02-11", href: "https://www.basketball-reference.com/players/m/mirotni01.html" },
  "Kirk Hinrich": { height: "6'4\"", college: "Kansas", birthDate: "1981-01-02", href: "https://www.basketball-reference.com/players/h/hinriki01.html" },
  "Mike Dunleavy": { height: "6'9\"", college: "Duke", birthDate: "1980-09-15", href: "https://www.basketball-reference.com/players/d/dunlemi02.html" },
  "Ronnie Brewer": { height: "6'7\"", college: "Arkansas", birthDate: "1985-03-20", href: "https://www.basketball-reference.com/players/b/brewero02.html" },
};

const depthChartPlayerProfiles: Record<string, PlayerProfile> = {
  "Cameron Payne": { height: "6'3\"", college: "Murray State", birthDate: "1994-08-08", href: "https://www.basketball-reference.com/players/p/payneca01.html" },
  "Semaj Christon": { height: "6'3\"", college: "Xavier", birthDate: "1992-11-01", href: "https://www.basketball-reference.com/players/c/chrisse01.html" },
  "Alex Abrines": { height: "6'6\"", college: "International", birthDate: "1993-08-01", href: "https://www.basketball-reference.com/players/a/abrinal01.html" },
  "Anthony Morrow": { height: "6'5\"", college: "Georgia Tech", birthDate: "1985-09-27", href: "https://www.basketball-reference.com/players/m/morroan01.html" },
  "Jerami Grant": { height: "6'8\"", college: "Syracuse", birthDate: "1994-03-12", href: "https://www.basketball-reference.com/players/g/grantje01.html" },
  "Kyle Singler": { height: "6'8\"", college: "Duke", birthDate: "1988-05-04", href: "https://www.basketball-reference.com/players/s/singlky01.html" },
  "Domantas Sabonis": { height: "6'11\"", college: "Gonzaga", birthDate: "1996-05-03", href: "https://www.basketball-reference.com/players/s/sabondo01.html" },
  "Nick Collison": { height: "6'10\"", college: "Kansas", birthDate: "1980-10-26", href: "https://www.basketball-reference.com/players/c/collini01.html" },
  "Enes Kanter": { height: "6'10\"", college: "Kentucky", birthDate: "1992-05-20", href: "https://www.basketball-reference.com/players/k/kanteen01.html" },
  "Joffrey Lauvergne": { height: "6'11\"", college: "International", birthDate: "1991-09-30", href: "https://www.basketball-reference.com/players/l/lauvejo01.html" },
  "Chucky Atkins": { height: "5'11\"", college: "South Florida", birthDate: "1974-08-14", href: "https://www.basketball-reference.com/players/a/atkinch01.html" },
  "Lindsey Hunter": { height: "6'2\"", college: "Jackson State", birthDate: "1970-12-03", href: "https://www.basketball-reference.com/players/h/hunteli01.html" },
  "Corliss Williamson": { height: "6'7\"", college: "Arkansas", birthDate: "1973-12-04", href: "https://www.basketball-reference.com/players/w/willico02.html" },
  "Elden Campbell": { height: "6'11\"", college: "Clemson", birthDate: "1968-07-23", href: "https://www.basketball-reference.com/players/c/campbel01.html" },
  "Zeljko Rebraca": { height: "7'0\"", college: "International", birthDate: "1972-04-09", href: "https://www.basketball-reference.com/players/r/rebraze01.html" },
  "Antonio McDyess": { height: "6'9\"", college: "Alabama", birthDate: "1974-09-07", href: "https://www.basketball-reference.com/players/m/mcdyean01.html" },
};

function ageOnDate(birthDate: string, dateLabel: string) {
  const date = new Date(`${dateLabel} 12:00:00`);
  const [birthYear, birthMonth, birthDay] = birthDate.split("-").map(Number);
  let age = date.getFullYear() - birthYear;
  if (date.getMonth() + 1 < birthMonth || (date.getMonth() + 1 === birthMonth && date.getDate() < birthDay)) age -= 1;
  return age;
}

function mergedRoster(turn: CampaignTurn, state: CampaignState, campaign: CampaignDefinition) {
  const arrivals = state.acquiredPlayers
    .filter((player) => !state.departedPlayers.includes(player.name) && !turn.roster.some((existing) => existing.name === player.name))
    .map((player) => {
      const acquiredTurn = campaign.turns.find((item) => item.id === player.acquiredTurnId);
      const developedStarter = acquiredTurn?.phase.toLowerCase().includes("draft") && turn.year > acquiredTurn.year;
      return { ...player, depth: developedStarter ? 1 : player.depth, status: developedStarter ? "Developed starter" : player.status ?? "New arrival" };
    });
  return [...arrivals, ...turn.roster.filter((player) => !state.departedPlayers.includes(player.name))];
}

export function CampaignExperience({ campaign, sessionId }: { campaign: CampaignDefinition; sessionId: string }) {
  const [state, setState] = useState(() => createCampaignState(campaign, sessionId));
  const [hydrated, setHydrated] = useState(false);
  const [restored, setRestored] = useState(false);
  const [selectedStrategyId, setSelectedStrategyId] = useState<string | null>(null);
  const [influence, setInfluence] = useState(0);
  const [activeAdvisor, setActiveAdvisor] = useState<string | null>(null);
  const [view, setView] = useState<"brief" | "decision">("brief");
  const [showObjectives, setShowObjectives] = useState(false);
  const [showBench, setShowBench] = useState(false);
  const [showDecisionTitle, setShowDecisionTitle] = useState(false);
  const [decisionCursor, setDecisionCursor] = useState(0);
  const [mobileAdvisorIndex, setMobileAdvisorIndex] = useState(0);
  const [mobileStrategyIndex, setMobileStrategyIndex] = useState(0);
  const [entering, setEntering] = useState(true);
  const decisionTitleRef = useRef<HTMLHeadingElement>(null);
  const mobileAdvisorListRef = useRef<HTMLDivElement>(null);
  const mobileStrategyListRef = useRef<HTMLDivElement>(null);
  const pendingTimelineAdvanceRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    let saved: CampaignState | null = null;
    try {
      saved = restoreCampaignState(window.localStorage.getItem(`${CAMPAIGN_STORAGE_PREFIX}${sessionId}`), campaign, sessionId);
    } catch {
      // Safari can deny storage in private or restricted browsing. The campaign
      // should still open and play normally for the current tab.
    }
    Promise.resolve().then(() => {
      if (cancelled) return;
      if (saved) {
        setState(saved);
        setDecisionCursor(saved.turnIndex);
        setRestored(saved.decisions.length > 0);
      }
      setHydrated(true);
    });
    return () => { cancelled = true; };
  }, [campaign, sessionId]);

  // Drop the arrival class once the load-in has played, so nothing that mounts
  // later inherits its delay.
  useEffect(() => {
    const timer = window.setTimeout(() => setEntering(false), 1400);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(`${CAMPAIGN_STORAGE_PREFIX}${sessionId}`, JSON.stringify(state));
    } catch {
      // Keep the live session playable when persistent storage is unavailable.
    }
  }, [hydrated, sessionId, state]);

  useEffect(() => {
    if (!hydrated || state.stage !== "fallout" || !state.currentOutcome) return;
    const frame = window.requestAnimationFrame(() => {
      document.getElementById("campaign-active-desk")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [hydrated, state.currentOutcome, state.stage]);

  useEffect(() => {
    if (!pendingTimelineAdvanceRef.current || (state.stage !== "briefing" && state.stage !== "completed")) return;
    pendingTimelineAdvanceRef.current = false;
    let secondFrame = 0;
    const firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });
    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
    };
  }, [state.stage, state.turnIndex]);

  const turn = campaign.turns[state.turnIndex];
  const turnCopy = getCampaignTurnCopy(state, turn);
  const cursorTurn = campaign.turns[decisionCursor];
  const cursorCopy = getCampaignTurnCopy(state, cursorTurn);
  const strategy = turn.strategies.find((item) => item.id === selectedStrategyId) ?? null;
  const availableStrategies = turn.strategies.filter((item) => strategyRequirementsMet(state, item));
  const freeAgentStrategies = availableStrategies.filter((item) => item.freeAgent);
  const counterofferStrategy = state.pendingStrategyId ? turn.strategies.find((item) => item.id === state.pendingStrategyId) : null;
  const completedObjectives = campaign.objectives.filter((item) => objectiveComplete(state, item.condition)).length;
  const roster = mergedRoster(turn, state, campaign);
  const titleObservationKey = hydrated ? state.turnIndex : -1;
  const visibleMobileAdvisorIndex = Math.min(mobileAdvisorIndex, Math.max(turn.advisors.length - 1, 0));
  const visibleMobileStrategyIndex = Math.min(mobileStrategyIndex, Math.max(availableStrategies.length - 1, 0));

  useEffect(() => {
    const title = decisionTitleRef.current;
    if (!title) return;

    let frame = 0;
    const updateTitle = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const commandBar = document.querySelector<HTMLElement>(".campaign-command-bar");
        const commandBottom = commandBar?.getBoundingClientRect().bottom ?? 0;
        setShowDecisionTitle(title.getBoundingClientRect().bottom <= commandBottom);
      });
    };

    updateTitle();
    window.addEventListener("scroll", updateTitle, { passive: true });
    window.addEventListener("resize", updateTitle);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateTitle);
      window.removeEventListener("resize", updateTitle);
    };
  }, [titleObservationKey]);

  function selectStrategy(id: string) {
    setSelectedStrategyId(id);
    setInfluence(0);
    window.setTimeout(() => document.getElementById("commit-panel")?.scrollIntoView({ behavior: "smooth", block: "center" }), 40);
  }

  function browseDecision(direction: -1 | 1) {
    const next = Math.max(0, Math.min(state.turnIndex, decisionCursor + direction));
    if (next === decisionCursor) return;
    setDecisionCursor(next);
    setSelectedStrategyId(null);
    setActiveAdvisor(null);
    setMobileAdvisorIndex(0);
    setMobileStrategyIndex(0);
    window.setTimeout(() => document.getElementById("campaign-active-desk")?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
  }

  function browseMobileStrategy(direction: -1 | 1) {
    const next = Math.max(0, Math.min(availableStrategies.length - 1, visibleMobileStrategyIndex + direction));
    setMobileStrategyIndex(next);
    const list = mobileStrategyListRef.current;
    const item = list?.children.item(next) as HTMLElement | null;
    item?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
  }

  function browseMobileAdvisor(direction: -1 | 1) {
    const next = Math.max(0, Math.min(turn.advisors.length - 1, visibleMobileAdvisorIndex + direction));
    setMobileAdvisorIndex(next);
    const items = mobileAdvisorListRef.current?.querySelectorAll<HTMLElement>(":scope > button");
    items?.item(next)?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
  }

  function showFocusView(nextView: "brief" | "decision") {
    setView(nextView);
    if (nextView === "decision") setMobileStrategyIndex(0);
    window.requestAnimationFrame(() => {
      document.getElementById(nextView === "decision" ? "campaign-decision-step" : "campaign-brief-step")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function continueToDecision() {
    showFocusView("decision");
  }

  function commit() {
    if (!strategy) return;
    setState((current) => commitStrategy(current, campaign, strategy.id, influence));
    setSelectedStrategyId(null);
    setInfluence(0);
    setRestored(false);
  }

  function respond(response: "accept" | "decline") {
    setState((current) => resolveCounteroffer(current, campaign, response));
  }

  function nextTurn() {
    const next = advanceCampaign(state, campaign);
    pendingTimelineAdvanceRef.current = true;
    setState(next);
    setDecisionCursor(next.turnIndex);
    setSelectedStrategyId(null);
    setInfluence(0);
    setActiveAdvisor(null);
    setShowBench(false);
    setMobileAdvisorIndex(0);
    setMobileStrategyIndex(0);
    setView("brief");
  }

  function restart() {
    try {
      window.localStorage.removeItem(`${CAMPAIGN_STORAGE_PREFIX}${sessionId}`);
    } catch {
      // The in-memory reset below is enough when Safari blocks storage.
    }
    setState(createCampaignState(campaign, sessionId));
    setSelectedStrategyId(null);
    setInfluence(0);
    setRestored(false);
    setDecisionCursor(0);
    setMobileAdvisorIndex(0);
    setMobileStrategyIndex(0);
    setView("brief");
  }

  if (state.stage === "completed") return <CampaignEndingView campaign={campaign} state={state} onRestart={restart} />;

  return (
    <main id="main-content" className={`campaign-page${entering ? " campaign-entering" : ""}`} data-campaign={campaign.id}>
      <header className="campaign-command-bar campaign-command-simple">
        <div className={`command-identity${showDecisionTitle || decisionCursor !== state.turnIndex ? " showing-decision" : ""}`}><span><BriefcaseBusiness size={16} /></span><div>{showDecisionTitle || decisionCursor !== state.turnIndex ? <><strong>{cursorCopy.headline}</strong><small>Decision {decisionCursor + 1} · {cursorTurn.phase}</small></> : <><strong>{campaign.role}</strong><small>{campaign.organization}</small></>}</div><b className="command-mobile-turn">Decision {decisionCursor + 1} of {campaign.turns.length}</b></div>
        <div className="command-decision-nav">
          <button type="button" aria-label="Previous decision" title="Previous decision" disabled={decisionCursor === 0} onClick={() => browseDecision(-1)}><ChevronLeft size={19} /></button>
          <div className="command-progress" aria-label={`Decision ${decisionCursor + 1} of ${campaign.turns.length}`}><span>Decision {decisionCursor + 1} / {campaign.turns.length}</span><i><b style={{ width: `${((decisionCursor + 1) / campaign.turns.length) * 100}%` }} /></i></div>
          <button type="button" aria-label="Next decision" title="Next decision" disabled={decisionCursor === state.turnIndex} onClick={() => browseDecision(1)}><ChevronRight size={19} /></button>
        </div>
        {state.banners.length ? <div className="command-banners" aria-label={`${state.banners.length} championship${state.banners.length === 1 ? "" : "s"} won`}><Trophy size={15} /><b>{state.banners.length}</b><span>{state.banners.length === 1 ? "title" : "titles"}</span></div> : null}
        <button type="button" onClick={restart}><RotateCcw size={16} /><span>Restart</span></button>
      </header>

      {restored ? <div className="campaign-resume"><Check size={15} /> Operations room restored at {turn.date}.<button type="button" aria-label="Dismiss restore notice" onClick={() => setRestored(false)}><X size={15} /></button></div> : null}

      <section id="campaign-story-header" className="campaign-hero campaign-hero-simple" data-art={turn.artKey}>
        <Image src={art[turn.artKey]} alt="" fill priority={state.turnIndex === 0} sizes="100vw" />
        <div className="campaign-hero-scrim" />
        <div className="campaign-hero-content">
          <div className="campaign-date"><Radio size={14} /> Live operations · {turn.date}</div>
          <p>{turn.phase}</p>
          <h1 ref={decisionTitleRef}>{turnCopy.headline}</h1>
          <div className="campaign-deadline"><Clock3 size={16} /><span>Decision window</span><strong>{turn.deadline}</strong></div>
          <div className="campaign-roster" aria-label="Team roster">
            <p>Starting five <button type="button" className="depth-toggle" aria-expanded={showBench} onClick={() => setShowBench((open) => !open)}><Users size={13} /> {showBench ? "Hide depth chart" : "Full depth chart"}</button></p>
            <div className="starting-five">
              {depthChartPositions.map((position) => {
                const starter = roster.filter((player) => player.position === position).sort((a, b) => (a.depth ?? 1) - (b.depth ?? 1))[0];
                if (!starter) return null;
                const profile = playerProfiles[starter.name];
                return <article key={position}>
                  <a href={profile?.href} target="_blank" rel="noreferrer" aria-label={`View ${starter.name} on Basketball Reference`}>
                    <b className="player-position">{position}</b>
                    <span>
                      <strong>{starter.name}</strong>
                      <small className="starter-meta">
                        {profile ? <><span>{profile.height} · {profile.college}</span><span>Age {ageOnDate(profile.birthDate, turn.date)}{starter.status ? ` · ${starter.status}` : ""}</span></> : <span>Player profile{starter.status ? ` · ${starter.status}` : ""}</span>}
                      </small>
                    </span>
                  </a>
                </article>;
              })}
            </div>
            <div className={`bench-panel-shell${showBench ? " open" : ""}`} aria-hidden={!showBench}>
              <div className="bench-panel" aria-label="Second unit and reserves">
                {depthChartPositions.map((position) => {
                const bench = roster.filter((player) => player.position === position).sort((a, b) => (a.depth ?? 1) - (b.depth ?? 1)).slice(1);
                  return bench.map((player, benchIndex) => {
                    const profile = playerProfiles[player.name] ?? depthChartPlayerProfiles[player.name];
                    return <a href={profile?.href} target="_blank" rel="noreferrer" tabIndex={showBench ? 0 : -1} aria-label={`View ${player.name} on Basketball Reference`} key={player.name}>
                      <b>{position}</b>
                      <strong>{player.name}</strong>
                      <small>#{player.number}{profile ? ` · ${profile.height} · ${profile.college} · Age ${ageOnDate(profile.birthDate, turn.date)}` : ""} · {benchIndex === 0 ? "Second unit" : "Reserve"}{player.status ? ` · ${player.status}` : ""}</small>
                    </a>;
                  });
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className={`mobile-depth-drawer-layer${showBench ? " open" : ""}`} aria-hidden={!showBench}>
        <button type="button" className="mobile-depth-backdrop" aria-label="Close depth chart" tabIndex={showBench ? 0 : -1} onClick={() => setShowBench(false)} />
        <section className="mobile-depth-drawer" role="dialog" aria-modal={showBench} aria-label="Full depth chart">
          <header>
            <div><span>Team personnel</span><h2>Full depth chart</h2></div>
            <button type="button" aria-label="Close depth chart" tabIndex={showBench ? 0 : -1} onClick={() => setShowBench(false)}><X size={18} /></button>
          </header>
          <div className="mobile-depth-list">
            {depthChartPositions.map((position) => {
              const players = roster.filter((player) => player.position === position).sort((a, b) => (a.depth ?? 1) - (b.depth ?? 1));
              return <div className="mobile-depth-group" key={position}>
                <b>{position}</b>
                <div>
                  {players.map((player, playerIndex) => {
                    const profile = playerProfiles[player.name] ?? depthChartPlayerProfiles[player.name];
                    return <a href={profile?.href} target="_blank" rel="noreferrer" tabIndex={showBench ? 0 : -1} aria-label={`View ${player.name} on Basketball Reference`} key={player.name}>
                      <span><strong>{player.name}</strong><small>#{player.number}{profile ? ` · ${profile.height} · ${profile.college}` : ""}{player.status ? ` · ${player.status}` : ""}</small></span>
                      <em>{playerIndex === 0 ? "Starter" : playerIndex === 1 ? "Second unit" : "Reserve"}</em>
                    </a>;
                  })}
                </div>
              </div>;
            })}
          </div>
        </section>
      </div>

      <button
        type="button"
        className="campaign-scorebug"
        aria-label={`View objectives: ${completedObjectives} of ${campaign.objectives.length} on track`}
        aria-expanded={showObjectives}
        aria-controls="campaign-objectives"
        onClick={() => setShowObjectives((open) => !open)}
      >
        <Target size={16} aria-hidden="true" />
        <strong>{completedObjectives}/{campaign.objectives.length}</strong>
      </button>

      <div className={`objective-drawer-layer${showObjectives ? " open" : ""}`} aria-hidden={!showObjectives}>
        <button type="button" className="objective-drawer-backdrop" aria-label="Close objectives" tabIndex={showObjectives ? 0 : -1} onClick={() => setShowObjectives(false)} />
        <section id="campaign-objectives" className="objective-drawer" role="dialog" aria-modal={showObjectives} aria-label="Campaign objectives">
          <div className="objective-drawer-head"><p className="campaign-label"><Target size={15} /> What you&apos;re aiming for</p><button type="button" aria-label="Close objectives" tabIndex={showObjectives ? 0 : -1} onClick={() => setShowObjectives(false)}><X size={16} /></button></div>
          <p className="objective-drawer-progress"><strong>{completedObjectives}/{campaign.objectives.length}</strong> objectives currently on track</p>
          <ObjectiveTracker campaign={campaign} state={state} />
          <MetricLegend campaign={campaign} />
        </section>
      </div>

      {decisionCursor < state.turnIndex ? (
        <DecisionReview campaign={campaign} state={state} decisionIndex={decisionCursor} />
      ) : state.stage === "fallout" && state.currentOutcome ? (
        <FalloutView state={state} campaign={campaign} onContinue={nextTurn} />
      ) : (
        <div id="campaign-active-desk" className="campaign-focus-shell">
          <nav className="campaign-stepper" aria-label="Decision steps">
            {(["brief", "decision"] as const).map((step, index) => { const label = step === "brief" ? "Brief" : "Decide"; return <button type="button" aria-label={label} key={step} className={view === step ? "active" : ""} onClick={() => showFocusView(step)}><span aria-hidden="true">{index + 1}</span>{label}</button>; })}
          </nav>

          {view === "brief" ? <section id="campaign-brief-step" className="focus-stage focus-brief" aria-labelledby="focus-brief-title">
            <div className="focus-stage-heading"><p className="campaign-label">Step 1 · Understand the moment</p><h2 id="focus-brief-title">{turnCopy.brief}</h2></div>
            {state.briefingNews.length ? <div className="focus-news">{state.briefingNews.map((news) => {
              const isBanner = news.changes.some((change) => change.scope === "banner");
              return <article key={news.headline} className={isBanner ? "news-banner" : news.acquiredPlayer ? "news-player" : ""}>{isBanner ? <b className="news-trophy"><Trophy size={16} /></b> : news.acquiredPlayer ? <b className="news-player-position">{news.acquiredPlayer.position}</b> : null}<strong>{news.headline}</strong><p>{news.detail}</p></article>;
            })}</div> : null}
            <div className="mobile-advisor-nav" aria-label="Advisor navigation">
              <span>{visibleMobileAdvisorIndex + 1} of {turn.advisors.length}</span>
              <div><button type="button" aria-label="Previous advisor" disabled={visibleMobileAdvisorIndex === 0} onClick={() => browseMobileAdvisor(-1)}><ChevronLeft size={17} /></button><button type="button" aria-label="Next advisor" disabled={visibleMobileAdvisorIndex === turn.advisors.length - 1} onClick={() => browseMobileAdvisor(1)}><ChevronRight size={17} /></button></div>
            </div>
            <div className="focus-advisors" ref={mobileAdvisorListRef} onScroll={(event) => {
              const list = event.currentTarget;
              const items = Array.from(list.querySelectorAll<HTMLElement>(":scope > button"));
              if (items.length <= 1) return;
              const nearest = items.reduce((best, item, index) => Math.abs(item.offsetLeft - list.scrollLeft) < Math.abs(items[best].offsetLeft - list.scrollLeft) ? index : best, 0);
              setMobileAdvisorIndex(nearest);
            }}>
              <p className="campaign-label"><Users size={14} /> What your advisors see</p>
              {turn.advisors.map((message) => {
                const advisor = campaign.relationships.find((item) => item.key === message.advisorId);
                const open = activeAdvisor === message.advisorId;
                return <button type="button" className={open ? "open" : ""} aria-expanded={open} onClick={() => setActiveAdvisor(open ? null : message.advisorId)} key={message.advisorId}><span className={`advisor-avatar ${message.stance}`}>{initials(advisor?.name ?? "Advisor")}</span><span><small>{advisor?.role}</small><strong>{message.subject}</strong><span className="advisor-detail" aria-hidden={!open}><span>{message.body}</span></span></span><ChevronRight size={16} /></button>;
              })}
            </div>
            <details className="focus-history"><summary>What happened in our history</summary><p>{turnCopy.historicalContext}</p></details>
            <button className="button button-primary focus-next" type="button" onClick={continueToDecision}>Continue to decision <ArrowRight size={17} /></button>
          </section> : null}

          {view === "decision" ? <section id="campaign-decision-step" className="focus-stage focus-decision" aria-labelledby="strategy-heading">
            <div className="focus-stage-heading"><p className="campaign-label">Step 2 · Your call</p><h2 id="strategy-heading">Choose one direction.</h2><p>Forecasts show probability, not certainty.</p></div>
            <details className="focus-decision-intel">
              <summary><span><FileSearch size={16} /> Optional scouting reports</span><b>{state.resources.intel} {state.resources.intel === 1 ? "report" : "reports"} left <ChevronRight size={16} /></b></summary>
              <div>
                <p>Opening a report costs intel that never resets. Revealed information immediately updates the forecasts below.</p>
                <div className="intel-actions focus-intel-actions">
                  {turn.investigations.map((item) => {
                    const revealed = state.investigatedIds.includes(item.id);
                    return <button type="button" className={revealed ? "revealed" : ""} disabled={revealed || state.resources.intel < item.intelCost} onClick={() => setState((current) => investigate(current, campaign, item.id))} key={item.id}><span>{revealed ? <Check size={17} /> : <FileSearch size={17} />}</span><span><strong>{item.label}</strong><small>{revealed ? item.reveal : item.description}</small></span><b>{revealed ? "Revealed" : `${item.intelCost} intel`}</b></button>;
                  })}
                </div>
              </div>
            </details>
            {freeAgentStrategies.length ? <section className="free-agent-board" aria-labelledby="free-agent-title"><div><p className="campaign-label">Consequential market · {turn.year}</p><h3 id="free-agent-title">Choose the player attached to your direction.</h3><p>This board only appears when the market can materially change the timeline.</p></div><div>{freeAgentStrategies.map((item) => <button type="button" className={selectedStrategyId === item.id ? "selected" : ""} onClick={() => selectStrategy(item.id)} key={item.id}><span>{item.freeAgent!.position}</span><strong>{item.freeAgent!.name}</strong><small>{item.freeAgent!.note}</small><ChevronRight size={17} /></button>)}</div></section> : null}
            <div className="mobile-strategy-nav" aria-label="Strategy navigation">
              <span>Option {visibleMobileStrategyIndex + 1} of {availableStrategies.length}</span>
              <div><button type="button" aria-label="Previous strategy" disabled={visibleMobileStrategyIndex === 0} onClick={() => browseMobileStrategy(-1)}><ChevronLeft size={17} /></button><button type="button" aria-label="Next strategy" disabled={visibleMobileStrategyIndex === availableStrategies.length - 1} onClick={() => browseMobileStrategy(1)}><ChevronRight size={17} /></button></div>
            </div>
            <div className="strategy-list focus-strategy-list" ref={mobileStrategyListRef} onScroll={(event) => {
              const list = event.currentTarget;
              const maximum = list.scrollWidth - list.clientWidth;
              if (maximum <= 0 || availableStrategies.length <= 1) return;
              setMobileStrategyIndex(Math.round((list.scrollLeft / maximum) * (availableStrategies.length - 1)));
            }}>
              {availableStrategies.map((item, index) => {
                const chance = getStrategyChance(state, campaign, item, 0);
                return <button type="button" className={selectedStrategyId === item.id ? "selected" : ""} onClick={() => selectStrategy(item.id)} key={item.id}><span className="strategy-number">{String(index + 1).padStart(2, "0")}</span><span className="strategy-copy"><small>{item.approach}</small><strong>{item.title}</strong><p>{item.summary}</p>{item.acquisition ? <em className="strategy-scout"><Sparkles size={13} /> {item.acquisition.hint}</em> : null}</span><span className={`strategy-risk risk-${riskLabel(chance).toLowerCase()}`}><small>Forecast</small><strong>{chance}%</strong></span><ChevronRight size={20} /></button>;
              })}
            </div>
            {strategy ? <CommitPanel strategy={strategy} state={state} campaign={campaign} influence={influence} onInfluence={setInfluence} onCancel={() => setSelectedStrategyId(null)} onCommit={commit} /> : null}
            <div className="focus-snapshot" aria-label="Current campaign state">
              {campaign.resources.slice(0, 4).map((item) => <span key={item.key} title={item.description}><small>{item.shortLabel}</small><strong>{state.resources[item.key]}</strong></span>)}
            </div>
            <MetricLegend campaign={campaign} />
            <button className="focus-back-link" type="button" onClick={() => showFocusView("brief")}><ChevronLeft size={15} /> Back to brief</button>
          </section> : null}
        </div>
      )}

      {decisionCursor === state.turnIndex && state.stage === "negotiation" && counterofferStrategy?.counteroffer ? <NegotiationOverlay campaign={campaign} state={state} strategy={counterofferStrategy} onResponse={respond} /> : null}
    </main>
  );
}

function ObjectiveTracker({ campaign, state }: { campaign: CampaignDefinition; state: CampaignState }) {
  const progress = getObjectiveProgress(state, campaign);
  return (
    <div className="objective-tracker">
      {progress.map((item) => {
        const percent = item.current !== null && item.target !== null ? Math.max(0, Math.min(100, (item.current / item.target) * 100)) : null;
        return <div className={item.met ? "met" : ""} key={item.id}>
          <span className="objective-check">{item.met ? <Check size={14} /> : <Activity size={14} />}</span>
          <div>
            <strong>{item.label}{item.primary ? <b>Primary</b> : null}</strong>
            <small>{item.description}</small>
            {percent !== null ? <span className="objective-meter"><i><b style={{ width: `${percent}%` }} /></i><em>{item.current} / {item.target}</em></span> : <span className="objective-status">{item.met ? "Secured" : "Not yet"}</span>}
          </div>
        </div>;
      })}
    </div>
  );
}

function MetricLegend({ campaign }: { campaign: CampaignDefinition }) {
  return (
    <details className="metric-legend">
      <summary>What do these numbers mean?</summary>
      <ul>
        {campaign.resources.map((item) => <li key={item.key}><strong>{item.label}</strong><span>{item.description}</span></li>)}
        {campaign.relationships.map((item) => <li key={item.key}><strong>{item.name} trust</strong><span>{item.role}. Relationships run 0–100 and shape which endings and objectives you can reach.</span></li>)}
      </ul>
    </details>
  );
}

function CommitPanel({ strategy, state, campaign, influence, onInfluence, onCancel, onCommit }: { strategy: CampaignStrategy; state: CampaignState; campaign: CampaignDefinition; influence: number; onInfluence: (value: number) => void; onCancel: () => void; onCommit: () => void }) {
  const breakdown = getChanceBreakdown(state, campaign, strategy, influence);
  const chance = breakdown.total;
  const influenceBudget = state.resources.influence ?? 0;
  const maxInfluence = Math.min(2, Math.max(0, influenceBudget - (strategy.costs.influence ?? 0)));
  const canCommit = canCommitStrategy(state, strategy, influence);
  const requiredResources = { ...strategy.costs, influence: (strategy.costs.influence ?? 0) + influence };
  const shortfalls = Object.entries(requiredResources).flatMap(([key, cost]) => {
    const missing = cost - (state.resources[key] ?? 0);
    return missing > 0 ? [`${missing} more ${resourceLabel(campaign, key)}`] : [];
  });
  const unavailableReason = shortfalls.length ? `You need ${shortfalls.join(" and ")} to commit this strategy.` : "This strategy's campaign requirement has not been met.";
  const breakdownText = [
    `${breakdown.base}% base`,
    ...[
      { label: "intel", value: breakdown.investigation },
      { label: "cohesion", value: breakdown.cohesion },
      { label: "influence", value: breakdown.influence },
    ].filter((part) => part.value !== 0).map((part) => `${part.value > 0 ? "+" : "−"} ${Math.abs(part.value)}% ${part.label}`),
  ].join(" ");
  const rawSum = breakdown.base + breakdown.investigation + breakdown.cohesion + breakdown.influence;
  const capNote = rawSum !== chance ? (rawSum > chance ? " (capped at 98%)" : " (floor of 5%)") : "";
  return <section id="commit-panel" className="commit-panel"><div className="commit-heading"><div><p className="campaign-label">Commitment desk</p><h2>{strategy.title}</h2></div><button type="button" onClick={onCancel} aria-label="Close commitment desk"><X size={18} /></button></div>{strategy.acquisition ? <p className="commit-scout"><Sparkles size={15} /> Scouting whisper: {strategy.acquisition.hint} {strategy.acquisition.always ? "Commit" : "Succeed"}, and you&apos;ll find out who it is.</p> : null}<div className="commit-grid"><div className="forecast-dial"><span>Modeled success</span><strong>{chance}%</strong><i><b style={{ width: `${chance}%` }} /></i><small>{riskLabel(chance)} risk profile</small><p className="chance-breakdown" aria-label="How this forecast is calculated">{breakdownText} = {chance}%{capNote}</p></div><div className="influence-control"><span>Spend influence to raise the odds</span><div><button type="button" disabled={influence <= 0} onClick={() => onInfluence(influence - 1)} aria-label="Decrease influence"><Minus size={16} /></button><strong>{influence}</strong><button type="button" disabled={influence >= maxInfluence} onClick={() => onInfluence(influence + 1)} aria-label="Increase influence"><Plus size={16} /></button></div><small>Each point adds 12% to this forecast and is gone for the rest of the campaign. You have {influenceBudget} influence left{strategy.costs.influence ? ` (this strategy already costs ${strategy.costs.influence})` : ""}.</small></div><div className="commit-costs"><span>Immediate cost</span>{Object.keys(strategy.costs).length ? Object.entries(strategy.costs).map(([key, value]) => <strong key={key}>−{value} {resourceLabel(campaign, key)}</strong>) : <strong>No fixed cost</strong>}{influence ? <strong>−{influence} influence boost</strong> : null}</div></div>{!canCommit ? <p className="commit-warning" role="status"><ShieldAlert size={16} />{unavailableReason}</p> : null}<button className="button button-primary commit-action" type="button" disabled={!canCommit} onClick={onCommit}><LockKeyhole size={17} /> {canCommit ? "Commit strategy" : "Resources required"} <ArrowRight size={17} /></button></section>;
}

function FalloutView({ state, campaign, onContinue }: { state: CampaignState; campaign: CampaignDefinition; onContinue: () => void }) {
  const outcome = state.currentOutcome!;
  const acquiredProfile = outcome.acquiredPlayer ? playerProfiles[outcome.acquiredPlayer.name] : undefined;
  const ownershipEndedRun = ownerTrustCollapsed(state, campaign);
  const final = state.turnIndex === campaign.turns.length - 1 || ownershipEndedRun;
  const advanceLabel = ownershipEndedRun ? "Face ownership" : final ? "See your legacy" : "Advance the timeline";
  const bannerChange = outcome.changes.find((change) => change.scope === "banner");
  const progress = getObjectiveProgress(state, campaign);
  const changedKeys = new Map(outcome.changes.filter((change) => typeof change.before === "number" && typeof change.after === "number").map((change) => [`${change.scope}:${change.key}`, (change.after as number) - (change.before as number)]));
  return <section id="campaign-active-desk" className="campaign-fallout" aria-live="polite">
    {bannerChange ? <div className="banner-celebration"><span className="banner-trophy"><Trophy size={26} /></span><p>Championship won</p><strong>{String(bannerChange.value)}</strong><small>The banner goes to the rafters. It counts toward your objectives and legacy score.</small></div> : null}
    {outcome.acquiredPlayer ? <div id="new-arrival" className="player-reveal"><p><Sparkles size={15} /> Your new arrival</p><div className="player-reveal-card"><span className="reveal-player-position">{outcome.acquiredPlayer.position}</span><div><small>{acquiredProfile ? `${acquiredProfile.height} · ${acquiredProfile.college} · Age ${ageOnDate(acquiredProfile.birthDate, campaign.turns[state.turnIndex].date)}` : "Joins the depth chart"}</small>{acquiredProfile ? <a className="player-reveal-link" href={acquiredProfile.href} target="_blank" rel="noreferrer" aria-label={`View ${outcome.acquiredPlayer.name} on Basketball Reference`}>{outcome.acquiredPlayer.name}</a> : <strong>{outcome.acquiredPlayer.name}</strong>}<p>{outcome.acquiredPlayer.blurb}</p></div></div></div> : null}
    <div className="fallout-broadcast"><p><Radio size={14} /> Timeline update</p><span>{outcome.stamp}</span><h1>{outcome.headline}</h1><p>{outcome.detail}</p></div>
    <button className="button button-primary fallout-advance-mobile" type="button" onClick={onContinue}>{advanceLabel}<ArrowRight size={17} /></button>
    <div className="fallout-lower">
      <div>
        <p className="campaign-label">Immediate movement</p>
        <ChangeList changes={outcome.changes} />
        <div className="fallout-pulse" aria-label="Objective progress after this decision">
          <p className="campaign-label"><Target size={14} /> Campaign pulse</p>
          {progress.map((item) => {
            const condition = campaign.objectives.find((objective) => objective.id === item.id)?.condition;
            const delta = condition ? changedKeys.get(`${condition.scope}:${condition.key}`) : undefined;
            return <div className={item.met ? "met" : ""} key={item.id}><span>{item.met ? <Check size={13} /> : <Activity size={13} />}</span><strong>{item.label}</strong>{item.current !== null && item.target !== null ? <em>{item.current} / {item.target}</em> : <em>{item.met ? "Secured" : "Not yet"}</em>}{delta ? <b className={delta > 0 ? "up" : "down"}>{delta > 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}{delta > 0 ? `+${delta}` : delta}</b> : null}</div>;
          })}
        </div>
      </div>
      <div className="decision-receipt"><span>Decision {state.turnIndex + 1} resolved</span><strong>{state.decisions[state.decisions.length - 1]?.strategyTitle}</strong><small>Forecast {state.decisions[state.decisions.length - 1]?.chance}% · Resolution {state.decisions[state.decisions.length - 1]?.roll}</small><button className="button button-primary" type="button" onClick={onContinue}>{advanceLabel}<ArrowRight size={17} /></button></div>
    </div>
  </section>;
}

function DecisionReview({ campaign, state, decisionIndex }: { campaign: CampaignDefinition; state: CampaignState; decisionIndex: number }) {
  const turn = campaign.turns[decisionIndex];
  const turnCopy = getCampaignTurnCopy(state, turn);
  const decision = state.decisions.find((item) => item.turnId === turn.id);
  if (!decision) return null;
  return <section id="campaign-active-desk" className="decision-review" aria-labelledby="decision-review-title">
    <header><p className="campaign-label">Decision {decisionIndex + 1} recap · {turn.date}</p><span className={decision.success ? "success" : "setback"}>{decision.success ? "Call landed" : "Setback"}</span><h1 id="decision-review-title">{decision.headline}</h1><p>{turnCopy.headline}</p></header>
    <div className="decision-review-grid"><div><span>Your call</span><strong>{decision.strategyTitle}</strong><small>Forecast {decision.chance}% · Resolution {decision.roll}</small></div><div><span>Immediate movement</span><ChangeList changes={decision.changes} /></div></div>
  </section>;
}

function NegotiationOverlay({ campaign, state, strategy, onResponse }: { campaign: CampaignDefinition; state: CampaignState; strategy: CampaignStrategy; onResponse: (value: "accept" | "decline") => void }) {
  const offer = strategy.counteroffer!;
  const advisor = campaign.relationships.find((item) => item.key === offer.advisorId);
  return <div className="negotiation-overlay" role="dialog" aria-modal="true" aria-labelledby="counteroffer-title"><div className="negotiation-room"><div className="negotiation-visual"><Image src="/campaign/contract-table.png" alt="" fill sizes="45vw" /><div /><span>Private negotiation channel</span></div><article><p className="campaign-label">Counteroffer received</p><div className="negotiation-person"><span>{initials(advisor?.name ?? "Advisor")}</span><div><strong>{advisor?.name}</strong><small>{advisor?.role}</small></div></div><h1 id="counteroffer-title">{offer.title}</h1><p>{offer.detail}</p><div className="negotiation-state"><span>Current leverage</span><strong>{state.pendingResolution?.chance}%</strong><small>The first move landed. This term decides what the agreement costs.</small></div><div className="negotiation-actions"><button className="button button-primary" type="button" onClick={() => onResponse("accept")}><Check size={17} /> {offer.acceptLabel}</button><button className="button button-quiet" type="button" onClick={() => onResponse("decline")}><ShieldAlert size={17} /> {offer.declineLabel}</button></div></article></div></div>;
}

function ObjectiveBoard({ campaign, state }: { campaign: CampaignDefinition; state: CampaignState }) {
  return <section className="ops-panel"><div className="campaign-panel-heading"><span><Target size={15} /> Objectives</span></div><div className="campaign-objectives">{campaign.objectives.map((item) => { const complete = objectiveComplete(state, item.condition); return <div className={complete ? "complete" : ""} key={item.id}><span>{complete ? <Check size={14} /> : <Activity size={14} />}</span><div><strong>{item.label}{item.primary ? <b>Primary</b> : null}</strong><small>{item.description}</small></div></div>; })}</div></section>;
}

type DecisionIdentity = "bold" | "collaborative" | "patient" | "adaptive" | "disciplined";

function decisionIdentity(approach: string): DecisionIdentity {
  const value = approach.toLowerCase();
  if (/shared|player|trust|loyal|transparent|continuity/.test(value)) return "collaborative";
  if (/patient|future|controlled|balanced|low risk|financial|depth|system/.test(value)) return "patient";
  if (/spacing|modern|structural|matchup|film|offense|your timeline/.test(value)) return "adaptive";
  if (/discipline|right way|defen|rim protection|anchor/.test(value)) return "disciplined";
  return "bold";
}

function alternateHistoryParagraphs(campaign: CampaignDefinition, state: CampaignState, endingSummary: string) {
  const choices = state.decisions.flatMap((decision) => {
    const turn = campaign.turns.find((item) => item.id === decision.turnId);
    const strategy = turn?.strategies.find((item) => item.id === decision.strategyId);
    return strategy ? [{ decision, strategy }] : [];
  });
  if (!choices.length) return [endingSummary];

  const identityCounts = choices.reduce<Record<DecisionIdentity, number>>((counts, choice) => {
    const identity = decisionIdentity(choice.strategy.approach);
    counts[identity] += 1;
    return counts;
  }, { bold: 0, collaborative: 0, patient: 0, adaptive: 0, disciplined: 0 });
  const identity = (Object.entries(identityCounts) as [DecisionIdentity, number][]).sort((a, b) => b[1] - a[1])[0][0];
  const failed = state.decisions.filter((decision) => !decision.success);
  const bannerCount = state.banners.length;
  const relationshipValues = campaign.relationships.map((item) => state.relationships[item.key] ?? item.initialValue);
  const averageTrust = relationshipValues.reduce((total, value) => total + value, 0) / Math.max(relationshipValues.length, 1);
  const cohesion = state.resources["team-cohesion"] ?? 50;
  const competitivePower = state.resources["competitive-power"] ?? 50;
  const capFlexibility = state.resources["cap-flexibility"] ?? 50;
  const aligned = averageTrust >= 62 && cohesion >= 62;
  const powerfulButFractured = competitivePower >= 78 && averageTrust < 52;
  const flexible = capFlexibility >= 32;

  const voices: Record<string, Record<DecisionIdentity, string>> = {
    "pistons-war-room": {
      bold: "You ran Detroit's front office like an assembly line with the safety guards removed: if a move added horsepower, you pulled the lever.",
      collaborative: "You built Detroit the way its best teams defend—five people moving like one machine, with no passenger bigger than the rotation.",
      patient: "You kept the Motor City engine below the redline, saving enough fuel for May while everyone else begged you to floor it in February.",
      adaptive: "You treated every series like Woodward Avenue under construction: reroute early, ignore the horns, and make sure your lane is open in June.",
      disciplined: "This was Detroit basketball with every bolt tightened: protect the paint, trust the work, and let prettier teams explain the loss afterward.",
    },
    "rose-war-room": {
      bold: "You managed Chicago with lake-wind nerve—cold in the face, loud around the edges, and never interested in waiting for calmer weather.",
      collaborative: "You gave Chicago's stars a shared steering wheel and discovered that the city of broad shoulders looks better when nobody carries it alone.",
      patient: "You refused to let Chicago turn another superstar into a ghost story, protecting tomorrow even while the United Center demanded tonight.",
      adaptive: "You rebuilt the Bulls like an L map: every route looked strange until the connections started delivering people exactly where they needed to be.",
      disciplined: "You ran the Bulls on Chicago winter rules—layer up, guard every inch, and never confuse discomfort with an emergency.",
    },
    "kd-war-room": {
      bold: "You tried to outrun the storm on open prairie, betting that enough speed and nerve could make Oklahoma City feel like the center of the league.",
      collaborative: "In a town where every whisper crosses Bricktown by lunch, you made shared trust the Thunder's most important small-market advantage.",
      patient: "You treated Oklahoma City's window like water on the plains: precious, finite, and too important to spill for one loud night.",
      adaptive: "You kept moving the Thunder's pressure system until opponents stopped knowing where the next strike—or the next lineup—would come from.",
      disciplined: "You put hard borders around a team built on emotion, proving that thunder is louder when somebody knows exactly when to call the storm.",
    },
  };
  const neutralVoice: Record<DecisionIdentity, string> = {
    bold: "You chose momentum over escape routes and made every decision with the window already moving.",
    collaborative: "You treated shared trust as seriously as talent and cap space.",
    patient: "You protected the long view when the room wanted an immediate answer.",
    adaptive: "You kept changing the plan until the roster finally fit the moment.",
    disciplined: "You built clear rules and trusted them when the pressure arrived.",
  };
  const identitySentence = (voices[campaign.id] ?? neutralVoice)[identity];

  let resultSentence: string;
  if (campaign.id === "pistons-war-room") {
    resultSentence = bannerCount >= 2 ? `${bannerCount} banners rolled off the line—enough chrome to turn an experiment into a Detroit model.` : bannerCount === 1 ? `One banner made it out of the factory${failed.length ? ", dents and all" : " without a recall"}.` : "The factory kept humming, but no banner came off the line.";
  } else if (campaign.id === "rose-war-room") {
    resultSentence = bannerCount >= 2 ? `${bannerCount} banners climbed into the United Center rafters, and Chicago finally got a dynasty without first writing an elegy.` : bannerCount === 1 ? `One banner reached the United Center rafters${failed.length ? ", carrying every bruise from the road up" : " before doubt could catch the parade"}.` : "The United Center rafters stayed unchanged, but the Rose era no longer reads like an obituary.";
  } else if (campaign.id === "kd-war-room") {
    resultSentence = bannerCount >= 2 ? `${bannerCount} storms ended in confetti, and the prairie stopped being treated like a temporary address for superstars.` : bannerCount === 1 ? `One storm ended in confetti${failed.length ? ", after the forecast missed more than once" : " and before the coast could call anyone away"}.` : "The storm never ended in confetti, but Oklahoma City kept control of its own forecast.";
  } else {
    resultSentence = bannerCount >= 2 ? `${bannerCount} championships turned the branch into an era.` : bannerCount === 1 ? "One championship made the alternate timeline real." : "No championship closed the argument.";
  }

  let costSentence: string;
  if (campaign.id === "pistons-war-room") {
    costSentence = aligned ? "Better yet, the locker room finished tuned to the same frequency." : powerfulButFractured ? "The engine was fast; the bolts holding the room together were another story." : flexible ? "You even left the next mechanic a stocked toolbox." : "The horsepower was real, and so was the bill under the hood.";
  } else if (campaign.id === "rose-war-room") {
    costSentence = aligned ? "For once, Chicago's basketball argument ended with everyone pulling in the same direction." : powerfulButFractured ? "The contender survived; another Chicago feud moved into the building with it." : flexible ? "You left the next move loaded on the card instead of charging it to the future." : "Chicago got the run, then found the receipt tucked beneath the confetti.";
  } else if (campaign.id === "kd-war-room") {
    costSentence = aligned ? "Durant, Westbrook, and the room still shared the same sky when it was over." : powerfulButFractured ? "The Thunder stayed dangerous even after the room stopped agreeing on where the lightning belonged." : flexible ? "The smallest market in the fight still had one more move in its pocket." : "The window stayed open, but the prairie wind carried away trust, money, or both.";
  } else {
    costSentence = aligned ? "The organization still believed in the method." : powerfulButFractured ? "Winning power grew faster than shared belief." : flexible ? "Another move remained available." : "The final ledger carried a real cost.";
  }

  return [`${identitySentence} ${resultSentence} ${costSentence}`];
}

function CampaignEndingView({ campaign, state, onRestart }: { campaign: CampaignDefinition; state: CampaignState; onRestart: () => void }) {
  const ending = getCampaignEnding(state, campaign);
  const alternateHistory = alternateHistoryParagraphs(campaign, state, ending.summary);
  const score = getCampaignScore(state, campaign);
  const completed = campaign.objectives.filter((item) => objectiveComplete(state, item.condition));
  const [copyingPng, setCopyingPng] = useState(false);
  const [pngCopied, setPngCopied] = useState(false);
  const [pngCopyFailed, setPngCopyFailed] = useState(false);
  async function copyPng() {
    setCopyingPng(true);
    setPngCopied(false);
    setPngCopyFailed(false);
    try {
      const blob = await buildCampaignResultPng(campaign, state);
      if (!blob) return;
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      setPngCopied(true);
      window.setTimeout(() => setPngCopied(false), 2500);
    } catch { setPngCopyFailed(true); } finally { setCopyingPng(false); }
  }
  return <main id="main-content" className="campaign-ending"><section className="ending-image"><Image src="/campaign/war-room.png" alt="An empty basketball operations room overlooking the arena" fill priority sizes="100vw" /><div /><article><p>{ending.eyebrow}</p><h1>{ending.title}</h1>{state.banners.length ? <div className="ending-banners">{state.banners.map((banner) => <span key={banner.id}><Trophy size={15} /> {banner.label}</span>)}</div> : <div className="ending-banners ending-banners-empty"><span>No banner raised in this timeline</span></div>}<span>{completed.length} of {campaign.objectives.length} objectives secured</span></article></section><section className="ending-report"><div className="ending-summary"><div className="ending-alternate-history"><p className="campaign-label">Your alternate history</p><div className="ending-alternate-copy">{alternateHistory.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div></div><div className="legacy-score" aria-label={`Legacy score ${score.total}, grade ${score.grade}`}><div className="legacy-score-head"><div><p className="campaign-label">Legacy score</p><strong>{score.total.toLocaleString()}</strong></div><span className={`legacy-grade legacy-grade-${score.grade[0].toLowerCase()}`}>{score.grade}</span></div><p className="legacy-grade-scale">{CAMPAIGN_GRADE_BANDS.map((band) => `${band.grade} ${band.minimum}+`).join(" · ")}</p><ul>{score.lines.map((line) => <li key={line.label}><span><strong>{line.label}</strong><small>{line.detail}</small></span><b>{line.points > 0 ? `+${line.points.toLocaleString()}` : "0"}</b></li>)}</ul></div><div className="ending-decisions">{state.decisions.map((decision, index) => <div key={decision.turnId}><span>{index + 1}</span><div><small>{decision.year}</small><strong>{decision.strategyTitle}</strong><p>{decision.headline}</p></div></div>)}</div><button className="button result-copy-png ending-copy-action" type="button" disabled={copyingPng} onClick={copyPng}><Copy size={17} /> {copyingPng ? "Copying PNG…" : pngCopied ? "PNG copied" : pngCopyFailed ? "Copy unavailable" : "Copy result as PNG"}</button></div><aside><div className="history-comparison"><p className="campaign-label">The history you replaced</p><h2>Our universe</h2><p>{campaign.realHistory}</p></div><ObjectiveBoard campaign={campaign} state={state} /><button className="button button-quiet" type="button" onClick={onRestart}><RotateCcw size={17} /> Run the room again</button></aside></section></main>;
}

const POSTER_INK = "#0d0d0c";
const POSTER_PANEL = "#131613";
const POSTER_PAPER_100 = "#f2ecdf";
const POSTER_PAPER_200 = "#ded5c5";
const POSTER_PAPER_400 = "#afa493";
const POSTER_ORANGE = "#de661f";
const POSTER_RULE = "rgba(242,236,223,0.18)";
const POSTER_RULE_STRONG = "rgba(242,236,223,0.34)";
const POSTER_FONT = 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
const POSTER_GRADE_STYLES: Record<string, { color: string; background: string; ring: string }> = {
  S: { color: "#e9c05f", background: "rgba(216,173,72,0.16)", ring: "rgba(216,173,72,0.55)" },
  A: { color: "#6fc2ba", background: "rgba(66,143,136,0.16)", ring: "rgba(66,143,136,0.5)" },
  B: { color: "#f1823e", background: "rgba(241,130,62,0.14)", ring: "rgba(241,130,62,0.45)" },
  C: { color: "#c9cec9", background: "rgba(255,255,255,0.08)", ring: "rgba(255,255,255,0.22)" },
  D: { color: "#d98b84", background: "rgba(189,62,53,0.14)", ring: "rgba(189,62,53,0.45)" },
};

async function buildCampaignResultPng(campaign: CampaignDefinition, state: CampaignState) {
  await document.fonts.ready;
  const canvas = document.createElement("canvas");
  const width = 1600;
  const margin = 110;
  canvas.width = width;
  const context = canvas.getContext("2d");
  if (!context) return;
  const ending = getCampaignEnding(state, campaign);
  const score = getCampaignScore(state, campaign);

  const setFont = (weight: number, size: number, tracking = "0px") => {
    context.font = `${weight} ${size}px ${POSTER_FONT}`;
    context.letterSpacing = tracking;
  };

  // Measure pass: wrapping determines the poster height before anything is drawn.
  setFont(900, 94, "-3px");
  const titleLines = wrapCanvasLines(context, ending.title.toUpperCase(), 930, 3);
  setFont(400, 29);
  const summaryLines = wrapCanvasLines(context, ending.summary, 900, 4);

  const headerBottom = 216;
  const eyebrowBase = headerBottom + 88;
  const titleBase = eyebrowBase + 110;
  const summaryBase = titleBase + (titleLines.length - 1) * 98 + 74;
  const summaryEnd = summaryBase + (summaryLines.length - 1) * 46;
  const cardTop = 282;
  const bannerTop = Math.max(summaryEnd + 24, cardTop + 304) + 64;
  const sectionKickerBase = bannerTop + 156;
  const sectionHeadBase = sectionKickerBase + 54;
  const rowsTop = sectionHeadBase + 40;
  const rowHeight = 172;
  const rowsEnd = rowsTop + state.decisions.length * rowHeight;
  const footerRuleY = rowsEnd + 52;
  const footerBase = footerRuleY + 54;
  canvas.height = footerBase + 58;

  context.fillStyle = POSTER_INK;
  context.fillRect(0, 0, width, canvas.height);
  context.fillStyle = POSTER_ORANGE;
  context.fillRect(0, 0, width, 12);

  context.beginPath();
  context.arc(margin + 38, 124, 38, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = POSTER_INK;
  setFont(900, 46);
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText("R", margin + 38, 128);
  context.textAlign = "left";
  context.textBaseline = "alphabetic";
  context.fillStyle = POSTER_PAPER_100;
  setFont(900, 56, "-2px");
  context.fillText("RIPPLE", margin + 100, 122);
  context.fillStyle = POSTER_PAPER_400;
  setFont(700, 17, "5px");
  context.fillText("ALTERNATE HISTORY, UNDER PRESSURE", margin + 102, 160);
  context.textAlign = "right";
  context.fillStyle = POSTER_PAPER_200;
  setFont(800, 21, "2px");
  context.fillText(campaign.organization.toUpperCase(), width - margin, 112);
  context.fillStyle = POSTER_ORANGE;
  setFont(700, 16, "5px");
  context.fillText("CAMPAIGN RESULT", width - margin, 150);
  context.textAlign = "left";
  context.strokeStyle = POSTER_RULE;
  context.lineWidth = 1.5;
  context.beginPath();
  context.moveTo(margin, headerBottom);
  context.lineTo(width - margin, headerBottom);
  context.stroke();

  context.fillStyle = POSTER_ORANGE;
  setFont(700, 22, "6px");
  context.fillText(ending.eyebrow.toUpperCase(), margin, eyebrowBase);
  context.fillStyle = POSTER_PAPER_100;
  setFont(900, 94, "-3px");
  titleLines.forEach((line, index) => context.fillText(line, margin, titleBase + index * 98));
  context.fillStyle = POSTER_PAPER_200;
  setFont(400, 29);
  summaryLines.forEach((line, index) => context.fillText(line, margin, summaryBase + index * 46));

  const cardX = 1080;
  const cardW = width - margin - cardX;
  context.beginPath();
  context.roundRect(cardX, cardTop, cardW, 300, 26);
  context.fillStyle = POSTER_PANEL;
  context.fill();
  context.strokeStyle = "rgba(255,255,255,0.10)";
  context.lineWidth = 2;
  context.stroke();
  context.fillStyle = POSTER_ORANGE;
  setFont(700, 17, "4px");
  context.fillText("LEGACY SCORE", cardX + 44, cardTop + 70);
  context.fillStyle = POSTER_PAPER_100;
  setFont(900, 72, "-2px");
  context.fillText(score.total.toLocaleString("en-US"), cardX + 44, cardTop + 162);
  const gradeStyle = POSTER_GRADE_STYLES[score.grade[0]] ?? POSTER_GRADE_STYLES.C;
  const badgeX = cardX + cardW - 144;
  context.beginPath();
  context.roundRect(badgeX, cardTop + 62, 100, 100, 30);
  context.fillStyle = gradeStyle.background;
  context.fill();
  context.strokeStyle = gradeStyle.ring;
  context.lineWidth = 2;
  context.stroke();
  context.fillStyle = gradeStyle.color;
  setFont(850, 44);
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(score.grade, badgeX + 50, cardTop + 116);
  context.textAlign = "left";
  context.textBaseline = "alphabetic";
  context.strokeStyle = "rgba(255,255,255,0.09)";
  context.lineWidth = 1.5;
  context.beginPath();
  context.moveTo(cardX + 44, cardTop + 202);
  context.lineTo(cardX + cardW - 44, cardTop + 202);
  context.stroke();
  context.fillStyle = "#8d938e";
  setFont(650, 15, "0.5px");
  const scaleLines: string[] = [];
  for (const band of CAMPAIGN_GRADE_BANDS.filter((item) => item.grade.length === 1)) {
    const segment = `${band.grade} ${band.minimum}+`;
    const joined = scaleLines.length ? `${scaleLines[scaleLines.length - 1]} · ${segment}` : segment;
    if (scaleLines.length && context.measureText(joined).width <= cardW - 88) scaleLines[scaleLines.length - 1] = joined;
    else scaleLines.push(segment);
  }
  scaleLines.slice(0, 2).forEach((line, index) => context.fillText(line, cardX + 44, cardTop + 242 + index * 26));

  const bannerLabels = state.banners.length ? state.banners.map((banner) => banner.label) : ["No banner raised in this timeline"];
  let pillX = margin;
  for (const label of bannerLabels) {
    setFont(750, 23, "1px");
    const pillW = context.measureText(label).width + 64;
    context.beginPath();
    context.roundRect(pillX, bannerTop, pillW, 60, 30);
    context.fillStyle = state.banners.length ? "rgba(216,173,72,0.12)" : "rgba(255,255,255,0.05)";
    context.fill();
    context.strokeStyle = state.banners.length ? "rgba(216,173,72,0.5)" : "rgba(255,255,255,0.14)";
    context.lineWidth = 2;
    context.stroke();
    context.fillStyle = state.banners.length ? "#e9c05f" : "#9ba19c";
    context.fillText(label, pillX + 32, bannerTop + 39);
    pillX += pillW + 20;
  }

  const landed = state.decisions.filter((decision) => decision.success).length;
  const setbacks = state.decisions.length - landed;
  context.fillStyle = POSTER_ORANGE;
  setFont(700, 19, "5px");
  context.fillText("DECISION LOG", margin, sectionKickerBase);
  context.fillStyle = POSTER_PAPER_100;
  setFont(900, 42, "-1px");
  context.fillText("THE CALLS THAT BUILT THIS TIMELINE", margin, sectionHeadBase);
  context.textAlign = "right";
  context.fillStyle = POSTER_PAPER_400;
  setFont(700, 18, "3px");
  context.fillText(`${landed} LANDED · ${setbacks} ${setbacks === 1 ? "SETBACK" : "SETBACKS"}`, width - margin, sectionHeadBase);
  context.textAlign = "left";
  context.strokeStyle = POSTER_RULE_STRONG;
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(margin, rowsTop);
  context.lineTo(width - margin, rowsTop);
  context.stroke();

  state.decisions.forEach((decision, index) => {
    const rowTop = rowsTop + index * rowHeight;
    context.strokeStyle = POSTER_ORANGE;
    context.lineWidth = 2;
    context.strokeRect(margin + 1, rowTop + 54, 58, 58);
    context.fillStyle = POSTER_ORANGE;
    setFont(800, 25);
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(String(index + 1), margin + 30, rowTop + 85);
    context.textAlign = "left";
    context.textBaseline = "alphabetic";

    const textX = margin + 104;
    context.fillStyle = POSTER_PAPER_400;
    setFont(700, 17, "3px");
    context.fillText(String(decision.year), textX, rowTop + 62);
    const yearWidth = context.measureText(String(decision.year)).width;
    const chipLabel = decision.success ? "CALL LANDED" : "SETBACK";
    setFont(700, 15, "2px");
    const chipX = textX + yearWidth + 26;
    context.beginPath();
    context.roundRect(chipX, rowTop + 40, context.measureText(chipLabel).width + 32, 32, 4);
    context.fillStyle = decision.success ? "rgba(72,143,136,0.14)" : "rgba(189,62,53,0.16)";
    context.fill();
    context.fillStyle = decision.success ? "#78c4bd" : "#d98b84";
    context.fillText(chipLabel, chipX + 16, rowTop + 62);

    context.fillStyle = POSTER_PAPER_100;
    setFont(900, 34, "-0.5px");
    context.fillText(ellipsizeCanvasText(context, decision.strategyTitle.toUpperCase(), width - margin - textX), textX, rowTop + 112);
    context.fillStyle = POSTER_PAPER_400;
    setFont(400, 24);
    context.fillText(ellipsizeCanvasText(context, decision.headline, width - margin - textX), textX, rowTop + 150);

    context.strokeStyle = POSTER_RULE;
    context.lineWidth = 1.5;
    context.beginPath();
    context.moveTo(margin, rowTop + rowHeight);
    context.lineTo(width - margin, rowTop + rowHeight);
    context.stroke();
  });

  context.strokeStyle = POSTER_ORANGE;
  context.lineWidth = 3;
  context.beginPath();
  context.moveTo(margin, footerRuleY);
  context.lineTo(width - margin, footerRuleY);
  context.stroke();
  context.fillStyle = POSTER_PAPER_400;
  setFont(700, 17, "3px");
  context.fillText(`${campaign.title.toUpperCase()} · ONE DECISION CHANGES EVERYTHING AFTER IT`, margin, footerBase);
  context.textAlign = "right";
  context.fillText("RIPPLE / EST. 2026", width - margin, footerBase);
  context.textAlign = "left";

  return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
}

function wrapCanvasLines(context: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines: number) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (context.measureText(candidate).width <= maxWidth || !line) line = candidate;
    else { lines.push(line); line = word; }
  }
  if (line) lines.push(line);
  const visible = lines.slice(0, maxLines);
  if (lines.length > maxLines) visible[maxLines - 1] = `${visible[maxLines - 1].replace(/[.,;:!?]?$/, "")}…`;
  return visible;
}

function ellipsizeCanvasText(context: CanvasRenderingContext2D, text: string, maxWidth: number) {
  if (context.measureText(text).width <= maxWidth) return text;
  let cut = text;
  while (cut.length > 1 && context.measureText(`${cut}…`).width > maxWidth) cut = cut.slice(0, -1).trimEnd();
  return `${cut}…`;
}

function ChangeList({ changes }: { changes: CampaignChange[] }) { const visible = changes.filter((change) => change.scope !== "banner"); return <div className="campaign-change-list">{visible.length ? visible.map((change, index) => { const numeric = typeof change.before === "number" && typeof change.after === "number" ? change.after - change.before : null; return <div key={`${change.scope}-${change.key}-${index}`}><span>{numeric !== null && numeric < 0 ? <TrendingDown size={16} /> : <TrendingUp size={16} />}{change.label}</span><strong className={numeric !== null && numeric < 0 ? "negative" : "positive"}>{numeric === null ? `${formatValue(change.before)} → ${formatValue(change.after)}` : `${numeric > 0 ? "+" : ""}${numeric}`}</strong></div>; }) : <p>The agreement changes leverage without moving a public metric.</p>}</div>; }
function formatValue(value: string | number | boolean) { return typeof value === "boolean" ? (value ? "Yes" : "No") : String(value); }
function initials(value: string) { return value.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase(); }
function resourceLabel(campaign: CampaignDefinition, key: string) { return campaign.resources.find((item) => item.key === key)?.shortLabel.toLowerCase() ?? key.replaceAll("-", " "); }
