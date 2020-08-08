import React, { Component } from "react";
import * as storage from "../Util/storage";
import * as utils from "../Util/utils";

import { Spinner } from "react-bootstrap";
import { ToggleButtonGroup, ToggleButton } from "react-bootstrap";
import WeeklyScreenTimeGraph from "../Components/WeeklyScreenTimeGraph";
import DailyScreenTimeList from "../Components/DailyScreenTimeList";
export class ScreenTime extends Component {
  constructor(props) {
    super();
    this.state = {
      graph: "thisWeek",
      times: undefined,
    };
    this.getTimesData();
  }

  getTimesData = () => {
    storage.getTimes().then((times) => this.setState({ times: times }));
  };
  changeGraph = (val) => {
    this.setState({ graph: val });
  };
  calculateSevenDayAverage = (times) => {
    //[{facebook.com: 30, ...}, ...]
    const dailyTimes = Object.values(times.thisWeek);
    const total = dailyTimes.reduce((total, day) => {
      const dailyTotal = Object.values(day).reduce(
        (dailyTotal, time) => (dailyTotal += time),
        0
      );
      return (total += dailyTotal);
    }, 0);
    return total / 7;
  };
  calculateDailyTotal = (times) => {
    const todaysTimes = Object.values(times["thisWeek"][new Date().getDay()]);
    return todaysTimes.reduce((total, time) => (total += time), 0);
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
    const isReady = this.state.times != null;

    const screenTimeToday = isReady
      ? this.state.times["thisWeek"][new Date().getDay()]
      : undefined;

    return (
      <div className="wh100 px-3 mt-3" style={home}>
        <h1 className="mb-1" style={header}>
          Weekly
        </h1>
        <div>
          7-day average:
          {isReady ? (
            utils.formatMinutes(this.calculateSevenDayAverage(this.state.times))
          ) : (
            <Spinner animation="border" role="status" size="sm" />
          )}
        </div>
        <div style={{ width: "100%" }}>
          {isReady ? (
            <WeeklyScreenTimeGraph times={this.state.times[this.state.graph]} />
          ) : (
            <Spinner animation="border" role="status" />
          )}
        </div>

        <ToggleButtonGroup
          className="mt-3"
          style={{ width: "fit-content" }}
          name="options"
          value={this.state.graph}
          onChange={this.changeGraph}
        >
          <ToggleButton type="radio" value={"thisWeek"} variant="primary">
            This Week
          </ToggleButton>
          <ToggleButton type="radio" value={"lastWeek"} variant="primary">
            Last Week
          </ToggleButton>
        </ToggleButtonGroup>

        <h1 className="mt-3" style={header}>
          Today
        </h1>
        <div>
          Daily Total (make me into Decay gradient thing):
          {isReady ? (
            utils.formatMinutes(this.calculateDailyTotal(this.state.times))
          ) : (
            <Spinner animation="border" role="status" size="sm" />
          )}
        </div>
        {screenTimeToday ? (
          <DailyScreenTimeList screenTime={screenTimeToday} />
        ) : (
          <Spinner animation="border" role="status" />
        )}
      </div>
    );
  }
}

export default ScreenTime;
