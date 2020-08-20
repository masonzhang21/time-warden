import React, { Component } from "react";
import * as storage from "../Utils/storage";
import * as functions from "../Utils/functions";
import { ToggleButtonGroup, ToggleButton, Spinner } from "react-bootstrap";
import WeeklyTimeChart from "../Components/WeeklyTimeChart";
import DailyTimeList from "../Components/DailyTimeList";
import GradientLabel from "../Components/GradientLabel";
import * as constants from "../Utils/constants";

/**
 * Screen Time tab
 */
export class ScreenTime extends Component {
  constructor(props) {
    super();
    this.state = {
      graph: "thisWeek",
      times: undefined,
    };
    storage.getTimes().then((times) => this.setState({ times: times }));
  }

  /**
   * Changes the weekly time chart's data (either this week or last week).
   * @param {String} newGraph Either 'thisWeek' or 'lastWeek'
   */
  changeGraph = (newGraph) => {
    this.setState({ graph: newGraph });
  };

  /**
   * Finds the average time spent on all sites over a seven-day period
   * @param {*} times The stored times object
   */
  calculateSevenDayAverage = (times) => {
    //[{facebook.com: 30, ...}, ...]
    const dailyTimes = Object.values(times[this.state.graph]);
    const total = dailyTimes.reduce((total, day) => {
      const dailyTotal = Object.values(day).reduce(
        (dailyTotal, time) => (dailyTotal += time),
        0
      );
      return (total += dailyTotal);
    }, 0);
    return total / 7;
  };

  /**
   * Sums the time spent on The stored times object
   */
  calculateDailyTotal = (times) => {
    const todaysTimes = Object.values(times["thisWeek"][new Date().getDay()]);
    return todaysTimes.reduce((total, time) => (total += time), 0);
  };

  render() {
    const page = {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
    };
    const header = {
      margin: 0,
      width: "100%",
      textAlign: "left",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    };

    const lightGrayContainer = {
      padding: "20px",
      width: "100%",
      borderRadius: "5px",
      backgroundColor: constants.lightGray,
    };

    const isReady = this.state.times != null;
    const screenTimeToday = isReady
      ? this.state.times["thisWeek"][new Date().getDay()]
      : undefined;
    return (
      <div className="px-3 my-3" style={page}>
        <div className="mb-1" style={header}>
          <h1 style={{ fontFamily: "Rowdies, cursive" }}>Weekly</h1>
          <GradientLabel
            label={"7-Day Average"}
            value={
              isReady &&
              functions.formatMinutes(
                this.calculateSevenDayAverage(this.state.times)
              )
            }
          />
        </div>
        <div style={lightGrayContainer}>
          <div style={{ width: "100%", backgroundColor: constants.lightGray }}>
            {isReady ? (
              <WeeklyTimeChart times={this.state.times[this.state.graph]} />
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
            <ToggleButton type="radio" value={"thisWeek"} variant="info">
              This Week
            </ToggleButton>
            <ToggleButton type="radio" value={"lastWeek"} variant="info">
              Last Week
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
        <hr
          style={{ border: `1px solid ${constants.darkBlue}`, width: "95%" }}
        ></hr>
        <div className="mt-1 mb-3" style={header}>
          <h1 style={{ fontFamily: "Rowdies, cursive" }}>Today</h1>
          <GradientLabel
            label={"Daily Total"}
            value={
              isReady &&
              functions.formatMinutes(
                this.calculateDailyTotal(this.state.times)
              )
            }
          />
        </div>
        <div style={lightGrayContainer}>
          {screenTimeToday && <DailyTimeList screenTime={screenTimeToday} />}
        </div>
      </div>
    );
  }
}

export default ScreenTime;
