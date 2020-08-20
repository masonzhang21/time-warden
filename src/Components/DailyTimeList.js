import React from "react";
import SiteTime from "./SiteTime";
import * as functions from "../Utils/functions";

/**
 * Displays the sites visited today and the time spent on them in bar form
 * @param {*} props 
 */
export default function DailyScreenTimeList(props) {
  const container = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
  };
  //[[facebook.com, 12.2232], [instagram.com, 1.4434]]
  const siteTimes = Object.entries(props.screenTime);
  siteTimes.sort((a, b) => b[1] - a[1]);
  for (let i = 0; i < siteTimes.length; i++) {
    const siteTime = siteTimes[i];
    //rounds total minutes spent on site to two decimals
    siteTime[1] = Math.round(siteTime[1] * 100) / 100;
    //(time spent on site) / (time spent on the site with the max time spent)
    const percentMax = Math.round((siteTimes[i][1] / siteTimes[0][1]) * 100);
    siteTime.push(percentMax);
    siteTimes[i] = siteTime;
  }
  //siteTimes is now [[facebook.com, 12.22, 100], [instagram.com, 1.44, 13]]
  return (
    <div className="my-3" style={container}>
      {siteTimes.map((screenTime) => (
        <SiteTime
          key={screenTime[0]}
          site={screenTime[0]}
          time={functions.formatMinutes(screenTime[1])}
          percent={screenTime[2]}
          first={screenTime === siteTimes[0]}
          last={screenTime === siteTimes[siteTimes.length - 1]}
        />
      ))}
    </div>
  );
}
