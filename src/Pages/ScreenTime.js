import React, { Component } from "react";
import Storage from "../Util/storage";
import SiteStats from "../Components/SiteStats";
import {ToggleButtonGroup, ToggleButton } from "react-bootstrap";
import WeeklyTimeGraph from "../Components/WeeklyTimeGraph";
export class ScreenTime extends Component {
  constructor(props) {
    super();
    this.state = {
      graph: 1,
    };
  }
  changeGraph = (val) => {
    this.setState({ graph: val });
  };
  render() {
    const home = {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    };
    const header = {
      fontSize: "40px",
      margin: 0,
      fontFamily: "Rowdies, cursive",
      width: "100%",
      textAlign: "left",
    };
    const container = {
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "center",
      width: "100%",
    };

    const mockData = {
      "facebook.com": {
        Saturday: 0,
      },
    };

    return (
      <div className="wh100 px-3 mt-3" style={home}>
        <h1 style={header}>Weekly</h1>

        <WeeklyTimeGraph />
        <ToggleButtonGroup
          style={{ width: "fit-content" }}
          name="options"
          value={this.state.graph}
          onChange={this.changeGraph}
        >
          <ToggleButton type="radio" value={1} variant="primary">
            This Week
          </ToggleButton>{" "}
          <ToggleButton type="radio" value={2} variant="primary">
            Last Week
          </ToggleButton>{" "}
        </ToggleButtonGroup>

        <h1 className="mt-3" style={header}>Today</h1>
        <div className="my-3" style={container}>
          <SiteStats site="facebook.com" percent={80} first/>
          <SiteStats site="instagram.com" percent={80} />
          <SiteStats site="aol.com" percent={80} last/>

        </div>
      </div>
    );
  }
}

export default ScreenTime;
