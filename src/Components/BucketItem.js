import React from "react";
import Site from "./Site"
import { Button } from "react-bootstrap";

export default function BucketItem(props) {
  const site = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "20px",
    height: "25px"
  };

  return (
    <div className="my-2" style={site}>
      <Site site={props.site}/>
      <Button variant="link" style={{ margin: 0, padding: 0, height: "100%" }}>
        {props.showRemove && <img
          src={require("../Resources/remove.png")}
          alt=""
          draggable="false"
          style={{ height: "100%" }}
          onClick={() => props.handleRemoval(props.site)}
        />}
      </Button>
    </div>
  );
}
