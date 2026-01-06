const dateNormaliser = (d) => {
  const date = new Date(d);
  // Get day, month, and year components
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = date.getFullYear();
  // Format as dd/mm/yyyy
  const formattedDate = `${day}/${month}/${year}`;
  return d ? formattedDate : "";
};

const priceNormaliser = (p) => (p && p !== 0 ? "$" + noNormaliser(p) : "");

const allCapital = (p) => (p && typeof p == "string" ? p.toUpperCase() : "");

const noNormaliser = (p) =>
  typeof p === "number" && p < 1
    ? p.toPrecision(6)
    : p > 1 && p < 1000
    ? p.toFixed(2)
    : p >= 1000000000
    ? `${(parseFloat(p) / 1e9).toFixed(2) + " B"}`
    : p >= 1000000
    ? `${(parseFloat(p) / 1e6).toFixed(2) + " M"}`
    : p >= 1000
    ? p.toLocaleString()
    : p;

// const emptyDataStructure = {
//   "id": "",
//   "symbol": "",
//   "name": "",
//   "image": "",
//   "current_price": "",
//   "market_cap": "",
//   "market_cap_rank": "",
//   "fully_diluted_valuation": "",
//   "total_volume": "",
//   "high_24h": "",
//   "low_24h": "",
//   "price_change_24h": "",
//   "price_change_percentage_24h": "",
//   "market_cap_change_24h": "",
//   "market_cap_change_percentage_24h": "",
//   "circulating_supply": "",
//   "total_supply": "",
//   "max_supply": "",
//   "ath": "",
//   "ath_change_percentage": "",
//   "ath_date": "",
//   "atl": "",
//   "atl_change_percentage": "",
//   "atl_date": "",
//   "roi": "",
//   "last_updated": ""
// }

const headerLabels = [
  {
    label: "Minutes played",
    name: "minutes",
  },
  {
    label: "Goals scored",
    name: "goals_scored",
  },
  {
    label: "Assists",
    name: "assists",
  },
  {
    label: "Clean sheets",
    name: "clean_sheets",
  },
  {
    label: "Goals conceded",
    name: "goals_conceded",
  },
  {
    label: "Own goals",
    name: "own_goals",
  },
  {
    label: "Penalties saved",
    name: "penalties_saved",
  },
  {
    label: "Penalties missed",
    name: "penalties_missed",
  },
  {
    label: "Yellow cards",
    name: "yellow_cards",
  },
  {
    label: "Red cards",
    name: "red_cards",
  },
  {
    label: "Saves",
    name: "saves",
  },
  {
    label: "Bonus",
    name: "bonus",
  },
  {
    label: "Bonus Points System",
    name: "bps",
  },
  {
    label: "Influence",
    name: "influence",
  },
  {
    label: "Creativity",
    name: "creativity",
  },
  {
    label: "Threat",
    name: "threat",
  },
  {
    label: "ICT Index",
    name: "ict_index",
  },
  {
    label: "Clearances, blocks and interceptions",
    name: "clearances_blocks_interceptions",
  },
  {
    label: "Recoveries",
    name: "recoveries",
  },
  {
    label: "Tackles",
    name: "tackles",
  },
  {
    label: "Defensive Contribution",
    name: "defensive_contribution",
  },
  {
    label: "Game(s) Started",
    name: "starts",
  },
  {
    label: "Expected Goals",
    name: "expected_goals",
  },
  {
    label: "Expected Assists",
    name: "expected_assists",
  },
  {
    label: "Expected Goal Involvements",
    name: "expected_goal_involvements",
  },
  {
    label: "Expected Goals Conceded",
    name: "expected_goals_conceded",
  },
];

const gameWeeksHeaders = {
  web_name: "Player Name",
  now_cost: "Cost",
  total_points: "Total Points",
  pts_average: "Points Per Match",
  minutes: "Total Mins",
  goals_scored: "Goals",
  expected_goals: "XG",
  assists: "Assists",
  expected_assists: "XA",
  expected_goal_involvements: "Expected Goal Involvements",
  defensive_contribution: "Defensive Contribution",
  clean_sheets: "Clean Sheet",
  own_goals: "Own Goal",
  // penalties_saved: "Penalties Saved",
  penalties_missed: "Penalties Missed",
  yellow_cards: "Yellow Cards",
  red_cards: "Red Cards",
  bonus: "Bonus Points",
  bps: "BPS",
  starts: "Starts",
  influence: "Influence",
  creativity: "Creativity",
  threat: "Threat",
  ict_index: "ICT",
  clearances_blocks_interceptions: "CBI",
  recoveries: "Recoveries",
  tackles: "Tackles",
  saves: "Saves",
  goals_conceded: "Goals Conceded",
  expected_goals_conceded: "XGC",
  // fixtures: "Fixtures",
  Performance: "Performance",
};

const overallTableHeaders = {
  // element_type : "Role" ,
  web_name: "Player Name",
  now_cost: "Cost",
  // now_cost_rank: "Cost Rank",
  form: "Form",
  // form_rank: "Form Rank",
  selected_by_percent: "Selected By",
  // selected_rank: "Selected Rank",
  total_points: "Total Points",
  points_per_game: "Points P90",
  event_points: "GW Point",
  // points_per_game_rank: "Points P90 Rank",
  goals_scored: "Goals scored",
  assists: "Assists",
  expected_goal_involvements: "Expected Goal Involvements",
  expected_goal_involvements_per_90: "XGI P90",
  expected_goals: "Expected Goals",
  expected_goals_per_90: "XG P90",
  expected_assists: "Expected Assists",
  expected_assists_per_90: "XA P90",
  bonus: "Bonus",
  bps: "Bonus Points System",
  ep_next: "Estimated Points",
  ep_this: "Estimated Points This Week",
  direct_freekicks_order: "Direct Freekicks",
  corners_and_indirect_freekicks_order: "Corners and Indirect FK",
  penalties_order: "Penalties Taken",
  penalties_missed: "Penalties missed",
  penalties_saved: "Penalties saved",
  influence: "Influence",
  // influence_rank: "Influence Rank",
  creativity: "Creativity",
  // creativity_rank: "Creativity Rank",
  threat: "Threat",
  // threat_rank: "Threat Rank",
  ict_index: "ICT Index",
  // ict_index_rank: "ICT Rank",
  clean_sheets: "Clean sheets",
  clean_sheets_per_90: "CS Per 90",
  clearances_blocks_interceptions: "Clearances, blocks and interceptions",
  defensive_contribution: "Defensive Contribution",
  defensive_contribution_per_90: "Deffensive Contribution Per 90",
  tackles: "Tackles",
  recoveries: "Recoveries",
  expected_goals_conceded: "Expected Goals Conceded",
  expected_goals_conceded_per_90: "XGC P90",
  own_goals: "Own goals",
  goals_conceded: "Goals conceded",
  goals_conceded_per_90: "Goals Conceded P90",
  saves: "Saves",
  saves_per_90: "Saves P90",
  yellow_cards: "Yellow cards",
  red_cards: "Red cards",
  starts: "Game(s) Started",
  minutes: "Minutes played",
  team: "Team",
  team_join_date: "Team Join Date",
  birth_date: "Age",
  chance_of_playing_next_round: "Playing Next Round",
  transfers_in: "Transfers Balance",
  transfers_in_event: "Transfers Balance GW",
  fixtures: "Fixtures",
  // transfers_out: "Trasnfers Out",
  // transfers_out_event: "Transfers Out GW",
  // threat_rank_type : "" ,
  // starts_per_90 : "Starts P90" ,
  // selected_rank_type : "" ,
  // has_temporary_code : "" ,
  // ict_index_rank_type : "" ,
  // form_rank_type : "" ,
  // id : "" ,
  // in_dreamteam : "" ,
  // points_per_game_rank_type : "" ,
  // code : "" ,
  // chance_of_playing_this_round : "Playing This Round",
  // cost_change_event : "" ,
  // cost_change_event_fall : "" ,
  // cost_change_start : "" ,
  // cost_change_start_fall : "" ,
  // creativity_rank_type : "" ,
  // direct_freekicks_text : "" ,
  // corners_and_indirect_freekicks_text : "" ,
  // dreamteam_count : "" ,
  // penalties_text : "" ,
  // influence_rank_type : "" ,
  // now_cost_rank_type : "" ,
  // opta_code : "" ,
  // news : "" ,
  // news_added : "" ,
  // photo : "" ,
  // region : "" ,
  // removed : "" ,
  // second_name : "" ,
  // special : "" ,
  // squad_number : "" ,
  // status : "" ,
  // team_code : "Team Code" ,
  // value_form : "" ,
  // value_season : "" ,
  // first_name : "Player Name" ,
};

export {
  dateNormaliser,
  priceNormaliser,
  noNormaliser,
  allCapital,
  overallTableHeaders,
  headerLabels,
  gameWeeksHeaders,
};
