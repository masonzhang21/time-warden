import React from "react";
import Site from "./Site";
import * as constants from "../Util/constants"
export default function SiteStats(props) {
  const container = {
    width: "70%",
    backgroundImage: `linear-gradient(to right, ${constants.red} ${
      props.percent
    }%, #ffffff ${1 - props.percent}%)`,
    height: "40px",
    fontSize: "18px",
    padding: "1%",
    border: "1px solid black",
    borderBottom: props.last ? "1px solid black" : "0px solid black",
    borderTop: props.first ? "1px solid black" : "0px solid black"

  };
  if (props.first) {
    container.borderRadius = "5px 5px 0 0";
  } else if (props.last) {
    container.borderRadius = "0 0 5px 5px";
  }

  return (
    <div style={{ display: "flex", width: "100%" }}>
      <div style={container}>
          <Site className="ml-2" site={props.site} />
      </div>
      <p
        className="ml-1"
        style={{ fontSize: "16px", margin: 0, whiteSpace: "nowrap", width: "30%", display: "flex", alignItems: "center" }}
      >
        {props.time}
      </p>
    </div>
  );
}
