export const BASKETBALL_DOMAIN = {
  leagues: [
    { id: "nba", name: "National Basketball Association", sport: "basketball" },
  ],
  teams: [
    { id: "oklahoma-city-thunder", name: "Oklahoma City Thunder", abbreviation: "OKC", leagueId: "nba" },
    { id: "golden-state-warriors", name: "Golden State Warriors", abbreviation: "GSW", leagueId: "nba" },
    { id: "cleveland-cavaliers", name: "Cleveland Cavaliers", abbreviation: "CLE", leagueId: "nba" },
    { id: "los-angeles-lakers", name: "Los Angeles Lakers", abbreviation: "LAL", leagueId: "nba" },
    { id: "boston-celtics", name: "Boston Celtics", abbreviation: "BOS", leagueId: "nba" },
    { id: "portland-trail-blazers", name: "Portland Trail Blazers", abbreviation: "POR", leagueId: "nba" },
    { id: "milwaukee-bucks", name: "Milwaukee Bucks", abbreviation: "MIL", leagueId: "nba" },
    { id: "minnesota-timberwolves", name: "Minnesota Timberwolves", abbreviation: "MIN", leagueId: "nba" },
  ],
  actors: [
    { id: "kevin-durant", name: "Kevin Durant", role: "Forward", teamId: "oklahoma-city-thunder" },
    { id: "russell-westbrook", name: "Russell Westbrook", role: "Guard", teamId: "oklahoma-city-thunder" },
    { id: "stephen-curry", name: "Stephen Curry", role: "Guard", teamId: "golden-state-warriors" },
    { id: "lebron-james", name: "LeBron James", role: "Forward", teamId: "cleveland-cavaliers" },
    { id: "michael-jordan", name: "Michael Jordan", role: "Guard", teamId: "portland-trail-blazers" },
    { id: "giannis-antetokounmpo", name: "Giannis Antetokounmpo", role: "Forward", teamId: "cleveland-cavaliers" },
    { id: "kevin-garnett", name: "Kevin Garnett", role: "Forward", teamId: "minnesota-timberwolves" },
  ],
} as const;
