import React from "react";
import SiteScreenTime from "./SiteScreenTime";
import * as utils from "../Util/utils"
export default function DailyScreenTimeList(props) {
  const container = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
  };
  const screenTimes = Object.entries(props.screenTime);
  screenTimes.sort((a, b) => b[1] - a[1]);
  if (screenTimes[0]) {
    for (let i = 0; i < screenTimes.length; i++) {
      const screenTime = screenTimes[i];
      screenTime[1] = Math.round(screenTime[1] * 100) / 100
      const percentMax = Math.round(screenTimes[i][1] / screenTimes[0][1] * 100) 
      screenTime.push(percentMax);
      screenTimes[i] = screenTime;
    }
  }
  console.log(screenTimes)
  return (
    <div className="my-3" style={container}>
      {screenTimes.map((screenTime) => (
        <SiteScreenTime
        key={screenTime[0]}
          site={screenTime[0]}
          time={utils.formatMinutes(screenTime[1])}
          percent={screenTime[2]}
          first={screenTime === screenTimes[0]}
          last={screenTime === screenTimes[screenTimes.length - 1]}
        />
      ))}
    </div>
  );
}
