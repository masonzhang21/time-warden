import React from "react";
import Site from "./Site";
export default function SiteStats(props) {
  const container = {
    width: "100%",
    backgroundImage: `linear-gradient(to right, #4f5d75 ${
      props.percent
    }%, #ef8354 ${1 - props.percent}%)`,
    height: "40px",
    fontSize: "18px",
    padding: "1%",
  };
  if (props.first) { container.borderRadius = "5px 5px 0 0"}
  else if (props.last) {container.borderRadius = "0 0 5px 5px"}

  return (
    <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
      <div style={container}>
        <Site className="ml-2" site={props.site} />
      </div>
      <p
        className="ml-2"
        style={{ fontSize: "20px", margin: 0, whiteSpace: "nowrap" }}
      >
        2 h 36 min
      </p>
    </div>
  );
}
