import React from "react";
import Site from "./Site";
import { XCircleFill } from "react-bootstrap-icons";
/**
 * Component displaying a bucket's site and a way to delete it in edit mode
 * @param {*} props
 */
export default function BucketItem(props) {
  const site = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "20px",
    height: "25px",
  };
  const invisibleButtonWrapper = {
    border: 0,
    margin: 0,
    padding: 0,
    backgroundColor: "transparent",
  };

  return (
    <div className="my-2" style={site}>
      <Site site={props.site} />
      <button style={invisibleButtonWrapper}>
        {props.showRemove && (
          <XCircleFill
            alt="remove"
            draggable="false"
            style={{ height: "100%" }}
            onClick={() => props.handleRemoval(props.site)}
          />
        )}
      </button>
    </div>
  );
}
