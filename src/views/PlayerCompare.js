import "./PlayerCompare.css";
import { Component } from "react";
// import axios from "axios";
import Grid from "@mui/material/Grid2";
import AutoComplete from "./modules/PrimeAutoCompleteFullObject";
import {
  gameWeeksHeaders,
  overallTableHeaders,
} from "./modules/constants";
import { data } from "./data";
import { GAME_WEEK_Data } from "./GWData";
import Box from "@mui/material/Box";
import { Slider, InputLabel, Button } from "@mui/material";

class HomePage extends Component {
  state = {
    inProgress: false,
    selectedGameWeek: [9, 10],
    compareMode: "OVERALL",
    // compareMode: "GAME_WEEKS",
    gameWeekData: GAME_WEEK_Data,
    gameWeeksAveragePlayersData: [{}],
  };

  componentDidMount() {
    this.fetchPlayersList();
  }

  comparePlayers = () => {
    const { playersList, selectedPlayersObjectList } = this.state;
    console.log("%%%", selectedPlayersObjectList);
    const filteredData = [];

    if (
      playersList &&
      playersList.length &&
      selectedPlayersObjectList &&
      selectedPlayersObjectList.length
    ) {
      selectedPlayersObjectList.map((selectedPlayer) => {
        playersList.find((p) => {
          if (p.web_name === selectedPlayer.item) filteredData.push(p);
        });
      });
    }
    this.setState({
      filteredData: filteredData,
      selectedGameWeek: [0, 0],
      compareMode: "OVERALL",
    });
  };

  gameWeekComparison = () => {
    const { selectedGameWeek } = this.state;
    if (selectedGameWeek[0] === 0 && selectedGameWeek[1] === 0) {
      this.setState({ compareMode: "OVERALL" });
    } else {
      this.setState({ compareMode: "GAME_WEEKS" });
      console.log("Other Mode");
      this.fetchGameWeekData(selectedGameWeek[0], selectedGameWeek[1]);
    }
  };

  fetchGameWeekData = (startWeek, endWeek) => {
    const { gameWeekData, selectedPlayersObjectList } = this.state;
    const gwNumbers = [startWeek];
    const selectedPlayersIdList = selectedPlayersObjectList.map((i) => i.id);
    const numberOfWeeks = endWeek - startWeek + 1;
    const availableGameWeeks = Object.keys(gameWeekData);
    console.log("%%%%", startWeek, endWeek, numberOfWeeks);
    if (numberOfWeeks === 1) {
      console.log("^*&^", "Single GW", numberOfWeeks);
    } else {
      console.log("^*&^", "Multi GW", availableGameWeeks);
      for (let i = startWeek+1; i <= endWeek; i++) {
        gwNumbers.push(i);
        if (availableGameWeeks.includes(i.toString()))
          console.log("Data exist ", i);
        else console.log("no data for  : ", i);
      }
    }
    const res = this.getDynamicAverages(
      gameWeekData,
      selectedPlayersIdList,
      gwNumbers
    );
    this.setState({ gameWeeksAveragePlayersData: res });
    console.log("*&(*&*((&*&(*(*(**", res);
  };

  getDynamicAverages = (data, ids, gws) => {
    const rounding = (num) => Math.round(num * 100) / 100;
    console.log("***************", data, ids, gws);
    const results = {};
    ids.forEach((id) => {
      let totals = {};
      let counts = 0;

      gws.forEach((gw) => {
        const gwData = data[gw.toString()];
        const gwPlayersData = gwData.elements;
        // if (!gwData) return;

        console.log("*gwData*", gwPlayersData, gw);
        const player = gwPlayersData.find((p) => p.id === id);
        if (player && player.stats) {
          // Loop over all keys in the stats object dynamically
          Object.entries(player.stats).forEach(([key, value]) => {
            totals[key] = rounding(
              (totals[key] || 0) +
                (typeof value === "string" ? Number(value) : value)
            );
          });
          counts++;
        }
      });
      results[id] = totals;
      const pts_per_match = results[id].total_points / gws.length;
      results[id] = { ...results[id], pts_average: pts_per_match };
    });

    const flattenedResults = ids.map((id) => ({ ...results[id], id: id }));

    return flattenedResults;
  };

  addPlayer = () => {
    const inputField = this.state.inputField || "";
    if (inputField && inputField.item) {
      const selectedPlayersObjectList =
        this.state.selectedPlayersObjectList || [];
      selectedPlayersObjectList.push(inputField);
      return this.setState({
        selectedPlayersObjectList: selectedPlayersObjectList,
        inputFieldValue: null,
      });
    }
  };

  getLabel = (array = [{}], field, value, key) => {
    const selectedObject = array.find((i) => i[field] === value) || {};
    return selectedObject[key];
  };

  findTeamFullName = (teamId) =>
    this.getLabel(this.state.teams, "id", teamId, "name");

  // fetchPlayersList = () => {
  //   this.setState({ inProgress: true });
  //   const playersList = data.elements; //Players
  //   const teamsList = data.teams;
  //   const playerNamesList =
  //     playersList && playersList.length > 0
  //       ? // playersList.map(p=> ({item:p.web_name,description: p.first_name+' '+p.second_name})): [{}]
  //         playersList.map((p) => ({
  //           item: p.web_name,
  //           description:
  //             p.first_name +
  //             " " +
  //             p.second_name +
  //             " (" +
  //             this.getLabel(teamsList, "id", p.team, "short_name") +
  //             ") ",
  //           id: p.id,
  //           meta: {
  //             team: teamsList.find((i) => i["id"] === p.team) || {},
  //             player: p,
  //           },
  //         }))
  //       : [{}];
  //   this.setState({
  //     inProgress: false,
  //     playersList: playersList,
  //     playerNamesList: playerNamesList,
  //     teamsList: teamsList,
  //   });
  // };

  //   // axios
  //   // .get("https://api.allorigins.win/raw?url=https://fantasy.premierleague.com/api/bootstrap-static")
  //   // .then((response) => {
  //   //   const res = response.data ||[]
  //   //   const playersList  = res.elements
  //   //   const playerNamesList = playersList && playersList.length>0 ?
  //   //   // playersList.map(p=> ({item:p.web_name,description: p.first_name+' '+p.second_name})): [{}]
  //   //   playersList.map(p=> ({item:p.web_name,description: p.first_name+' '+p.second_name})): [{}]
  //   //   this.setState({inProgress:false})
  //   //   this.setState({playersList:playersList,playerNamesList:playerNamesList})
  //   // })
  //   // .catch((err) => {
  //   //   this.setState({inProgress:false})
  //   //   console.log(err)});
  // };

  // fetchPlayersList = () => {
  //   const { inProgress, playersList } = this.state;
  //   if (!inProgress && !(playersList && playersList.length > 1)) {
  //     this.setState({ inProgress: true });
  //     axios
  //       .get(
  //         // "https://api.allorigins.win/raw?url=https://fantasy.premierleague.com/api/bootstrap-static"
  //         "https://fantasy.premierleague.com/api/bootstrap-static"
  //       )
  //       .then((response) => {
  //         const res = response.data || [];
  //         const playersList = data.elements;
  //         const teamsList = data.teams;
  //         const playerNamesList =
  //           playersList && playersList.length > 0
  //             ? // playersList.map(p=> ({item:p.web_name,description: p.first_name+' '+p.second_name})): [{}]
  //               playersList.map((p) => ({
  //                 item: p.web_name,
  //                 description:
  //                   p.first_name +
  //                   " " +
  //                   p.second_name +
  //                   " (" +
  //                   this.getLabel(teamsList, "id", p.team, "short_name") +
  //                   ") ",id:p.id,
  //                 meta: {
  //                   team: teamsList.find((i) => i["id"] === p.team) || {},
  //                   player: p,
  //                 },
  //               }))
  //             : [{}];
  //         this.setState({
  //           inProgress: false,
  //           playersList: playersList,
  //           playerNamesList: playerNamesList,
  //           teamsList: teamsList,
  //         });
  //       })
  //       .catch((err) => {
  //         this.setState({ inProgress: false });
  //         console.log(err);
  //       });
  //   }
  // };

  fetchPlayersList = () => {
    const { inProgress, playersList } = this.state;
    if (!inProgress && !(playersList && playersList.length > 1)) {
      this.setState({ inProgress: true });
      fetch("/api/fpl")
        .then((res) => res.json())
        .then((response) => {
          console.log("START : ", response);
          const playersList = response.elements;
          const teamsList = response.teams;
          const playerNamesList =
            playersList && playersList.length > 0
              ? playersList.map((p) => ({
                  item: p.web_name,
                  description:
                    p.first_name +
                    " " +
                    p.second_name +
                    " (" +
                    this.getLabel(teamsList, "id", p.team, "short_name") +
                    ") ",id:p.id,
                  meta: {
                    team: teamsList.find((i) => i["id"] === p.team) || {},
                    player: p,
                  },
                }))
              : [{}];
          this.setState({
            inProgress: false,
            playersList: playersList,
            playerNamesList: playerNamesList,
            ...response,
          });
        })
        .catch((err) => console.error(err));
    }
  };

  addRank = (val, rank) => (val ? `${val} ( ${rank}th )` : "");


  inputFieldChangeHandler = (value) => {
    return this.setState({ inputField: value });
  };

  tableCreator = (data) => {
    const playerRole = ["", "GK", "Defender", "Midfielder", "Forward"];

    const normalisers = {
      [overallTableHeaders.element_type]: (p) => playerRole[p],
      [overallTableHeaders.birth_date]: (p) => {
        if (p) {
          const birthDate = new Date(p);
          const today = new Date();
          return today.getFullYear() - birthDate.getFullYear();
        }
        return "";
      },
      [overallTableHeaders.team]: this.findTeamFullName,
    };

    const rowHeaderStyle = {
      border: "1px solid #ddd",
      padding: "10px",
      textAlign: "center",
      fontSize: "18px",
      fontWeighth: "800 !important",
      minWidth: "5vw",
    };
    const cellStyle = {
      border: "1px solid #ddd",
      padding: "10px",
      textAlign: "center",
      fontSize: "14px",
      width: "12vw",
    };

    return (
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <tbody>
          {data.map((row, index) => (
            <tr key={`row-${index}`}>
              {row.map((i, ind) => (
                <td
                  key={`${i}-${ind}`}
                  style={ind === 0 || index === 0 ? rowHeaderStyle : cellStyle}
                >
                  {Object.keys(normalisers).includes(row[0]) && ind !== 0
                    ? normalisers[row[0]](i)
                    : i}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  overallTableDataCreator = (playersDetails) => {
    const result = [];
    const titles = Object.keys(overallTableHeaders);
    titles.forEach((h) => {
      const header = overallTableHeaders[h];
      const rowData = playersDetails.map((c) => {
        return h === "now_cost"
          ? this.addRank(
              c["now_cost"] ? c["now_cost"] / 10 : "",
              c["now_cost_rank"]
            )
          : h === "rank"
          ? this.addRank(c["rank"], c["rank_rank"])
          : h === "selected_by_percent"
          ? this.addRank(c["selected_by_percent"], c["selected_rank"])
          : h === "points_per_game"
          ? this.addRank(c["points_per_game"], c["points_per_game_rank"])
          : h === "creativity"
          ? this.addRank(c["creativity"], c["creativity_rank"])
          : h === "threat"
          ? this.addRank(c["threat"], c["threat_rank"])
          : h === "influence"
          ? this.addRank(c["influence"], c["influence_rank"])
          : h === "ict_index"
          ? this.addRank(c["ict_index"], c["ict_index_rank"])
          : h === "transfers_in"
          ? c["transfers_in"] - c["transfers_out"]
          : h === "transfers_in_event"
          ? c["transfers_in_event"] - c["transfers_out_event"]
          : c[h];
      });
      const row = [header, ...rowData];
      return result.push(row);
    });
    return result;
  };

  gameWeeksTableDataCreator = (playersDetails, playersList) => {
    console.log("++++++++++", playersDetails);
    const result = [];
    const titles = Object.keys(gameWeeksHeaders);
    titles.forEach((h) => {
      const header = gameWeeksHeaders[h];
      const rowData = playersDetails.map((c) => {
        return h === "web_name"
          ? this.getLabel(playersList, "id", c["id"], "item")
          : c[h];
      });
      const row = [header, ...rowData];
      return result.push(row);
    });
    return result;
  };

  findDataByField = (data, fieldName) => {
    const dataArray = data || {};
    return dataArray[fieldName] || "";
  };

  render = () => {
    const {
      playersList,
      playerNamesList,
      selectedGameWeek,
      compareMode,
      gameWeeksAveragePlayersData,
    } = this.state;
    const filteredData = this.state.filteredData || [{}];
    const selectedPlayersObjectList = this.state.selectedPlayersObjectList || [
      {},
    ];
    // console.log("State", this.state);

    const table = (
      <div style={{ marginTop: "2vh", minWidth: "60vw" }}>
        <Grid container justifyContent={"center"}>
          <Grid item>
            {/* {filteredData &&
              filteredData.length && */}
            {this.tableCreator(
              compareMode === "OVERALL"
                ? this.overallTableDataCreator(filteredData)
                : this.gameWeeksTableDataCreator(
                    gameWeeksAveragePlayersData,
                    selectedPlayersObjectList
                  )
            )}
          </Grid>
        </Grid>
      </div>
    );

    const textareaValue = selectedPlayersObjectList
      .map((c) => (c.item ? `${c.item.toUpperCase()}\n` : ""))
      .join("");

    return (
      <div className="App">
        {playersList && playersList.length ? (
          <div>
            <Grid container spacing={5}>
              <Grid item size={{ xs: 12, lg: 3 }}>
                <Grid
                  container
                  direction="column"
                  justifyContent={"center"}
                  spacing={5}
                  style={{ marginBottom: "3vh" }}
                >
                  <Grid item justifyContent={"center"}>
                    <div
                      style={{
                        display: "flex",
                        marginTop: "2vh",
                        marginBottom: "2vh",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <AutoComplete
                        id="inputPlayer"
                        placeholder="Add Players"
                        value={this.state.inputFieldValue}
                        setValue={(val) =>
                          this.setState({ inputFieldValue: val })
                        }
                        callback={this.inputFieldChangeHandler}
                        items={playerNamesList}
                      />
                      <button
                        style={{ marginLeft: "1vw" }}
                        disabled={this.state.inProgress}
                        onClick={this.addPlayer}
                      >
                        Add
                      </button>
                    </div>
                  </Grid>
                  <Grid item justifyContent={"center"}>
                    <textarea
                      value={textareaValue}
                      readOnly
                      rows="6"
                      // cols="8"
                      style={{ width: "80%", padding: "10px" }}
                    />
                  </Grid>
                  <Grid
                    item
                    justifyContent={"center"}
                    style={{
                      display: "flex",
                      alignItems: "",
                      marginBottom: "4vh",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <button
                      disabled={this.state.inProgress}
                      onClick={() =>
                        this.setState({ selectedPlayersObjectList: [] })
                      }
                    >
                      Reset
                    </button>
                    <button
                      disabled={this.state.inProgress}
                      style={{ marginLeft: "2vw" }}
                      onClick={this.comparePlayers}
                    >
                      Compare
                    </button>
                  </Grid>
                </Grid>
              </Grid>

              <Grid size={{ xs: 12, lg: 9 }}>
                <Grid container justifyContent={"center"}>
                  <Grid
                    item
                    size={{ xs: 12, lg: 9 }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Grid container justifyContent={"center"}>
                      <Grid item>
                        <InputLabel style={{ color: "white" }} shrink>
                          Select Game Week
                        </InputLabel>
                      </Grid>
                      <Grid item size={{ xs: 12 }} />
                      <Grid item>
                        <Box
                          style={{ justifyContent: "center" }}
                          sx={{ width: 300 }}
                        >
                          <Slider
                            valueLabelDisplay="on"
                            value={selectedGameWeek}
                            aria-label="Default"
                            // valueLabelDisplay="auto"
                            max={38}
                            name={"gameWeekSlider"}
                            onChange={(e) =>
                              this.setState({
                                selectedGameWeek: e.target.value,
                              })
                            }
                          />
                        </Box>
                      </Grid>
                      <Grid item size={{ xs: 1 }} />
                      <Grid item>
                        <Button
                          style={{ fontSize: "10px" }}
                          variant="contained"
                          onClick={this.gameWeekComparison}
                          disabled={
                            !(
                              selectedPlayersObjectList &&
                              selectedPlayersObjectList.length > 0 &&
                              selectedPlayersObjectList[0] &&
                              selectedPlayersObjectList[0].item > ""
                            )
                          }
                        >
                          Get Data
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid
                    item
                    size={{ xs: 12, lg: 9 }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {table}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </div>
        ) : (
          <div>Loading</div>
        )}
      </div>
    );
  };
}

export default HomePage;
