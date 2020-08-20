import React from "react";
import Site from "./Site";
import * as constants from "../Utils/constants";

/**
 * Component displaying a site and the time spent on it, with a bar filled to a percentage
 * proportional to the site with the most time spent
 * @param {*} props
 */
export default function SiteTime(props) {
  const bar = {
    width: "100%",
    backgroundImage: `linear-gradient(to right, ${constants.gold} ${
      props.percent
    }%, white ${1 - props.percent}%)`,
    height: "36px",
    fontSize: "18px",
    padding: "3px",
    border: "1px solid black",
    borderBottom: props.last ? "1px solid black" : "0px solid black",
    borderTop: props.first ? "1px solid blackf" : "0px solid black",
    display: "flex",
    justifyContent: "space-between",
  };
  if (props.first) {
    bar.borderTopLeftRadius = "5px"
    bar.borderTopRightRadius = "5px"
  }
  if (props.last) {
    bar.borderBottomLeftRadius = "5px";
    bar.borderBottomRightRadius = "5px";
  }

  return (
    <div style={{ display: "flex", width: "100%" }}>
      <div style={bar}>
        <Site className="ml-2" site={props.site} />
        <p
          className="mx-2"
          style={{
            fontSize: "16px",
            margin: 0,
            whiteSpace: "nowrap",
            display: "flex",
            alignItems: "center",
          }}
        >
          {props.time}
        </p>
      </div>
    </div>
  );
}
