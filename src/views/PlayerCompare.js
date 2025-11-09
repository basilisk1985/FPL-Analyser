import "./PlayerCompare.css";
import { Component } from "react";
// import axios from "axios";
import Grid from "@mui/material/Grid2";
// import { Autocomplete } from '@mui/material';
// import AutoComplete from './modules/AutoCompleteField1';
import AutoComplete from "./modules/PrimeAutoCompleteFullObject";
import { headerLabels, headers } from "./modules/constants";
import { data } from "./data";

class HomePage extends Component {
  state = {
    ids: [null, null, null, null, null],
    inProgress: false,
    radioButtonValue: "Option 1",
  };

  componentDidMount() {
    this.fetchPlayersList();
  }

  addPlayer = () => {
    const inputField = this.state.inputField || "";
    if (inputField && inputField.item) {
      const playerObjectList = this.state.playerObjectList || [];
      playerObjectList.push(inputField);
      return this.setState({
        playerObjectList: playerObjectList,
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
  //   const playersList = data.elements;
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
  //                   ") ",
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
                    ") ",
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

  comparePlayers = () => {
    const { playersList, playerObjectList } = this.state;
    console.log("%%%", playerObjectList);
    const filteredData = [];

    if (
      playersList &&
      playersList.length &&
      playerObjectList &&
      playerObjectList.length
    ) {
      playerObjectList.map((selectedPlayer) => {
        playersList.find((p) => {
          if (p.web_name === selectedPlayer.item) filteredData.push(p);
        });
      });
    }
    this.setState({ filteredData: filteredData });
  };

  addRank = (val, rank) => (val ? `${val} ( ${rank}th )` : "");

  tableDataCreator = (playersDetails) => {
    const result = [];
    const titles = Object.keys(headers);
    titles.forEach((h) => {
      const header = headers[h];
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

  /*

  transfers_in: "Transfers In",
  transfers_in_event: "Transfers In GW",
  transfers_out: "Trasnfers Out",
  transfers_out_event: "Transfers Out GW",

  */

  inputFieldChangeHandler = (value) => {
    return this.setState({ inputField: value });
  };

  tableCreator = (data) => {
    const playerRole = ["", "GK", "Defender", "Midfielder", "Forward"];

    const normalisers = {
      [headers.element_type]: (p) => playerRole[p],
      [headers.birth_date]: (p) => {
        if (p) {
          const birthDate = new Date(p);
          const today = new Date();
          return today.getFullYear() - birthDate.getFullYear();
        }
        return "";
      },
      [headers.team]: this.findTeamFullName,
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

  findDataByField = (data, fieldName) => {
    const dataArray = data || {};
    return dataArray[fieldName] || "";
  };

  render = () => {
    const filteredData = this.state.filteredData || [{}];
    const playerObjectList = this.state.playerObjectList || [{}];

    const table = (
      <div style={{ marginTop: "2vh", minWidth: "60vw" }}>
        <Grid container justifyContent={"center"}>
          <Grid item>
            {filteredData &&
              filteredData.length &&
              this.tableCreator(this.tableDataCreator(filteredData))}
          </Grid>
        </Grid>
      </div>
    );

    const { playersList, playerNamesList } = this.state;

    console.log("State", this.state);

    const textareaValue = playerObjectList
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
                      onClick={() => this.setState({ playerObjectList: [] })}
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
