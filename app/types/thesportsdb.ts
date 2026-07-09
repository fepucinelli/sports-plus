export interface League {
  idLeague: string
  strLeague: string
  strSport: string
  strCountry?: string
  strLeagueAlternate?: string | null
}

export interface AllLeaguesResponse {
  leagues: League[]
}

export interface SeasonBadge {
  strSeason: string
  strBadge: string | null
}

export interface SearchAllSeasonsResponse {
  seasons: SeasonBadge[] | null
}
