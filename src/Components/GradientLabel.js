import React from "react";

/**
 * Displays a property and its value with a gradient background
 * @param {*} props 
 */
export default function GradientLabel(props) {
  const container = {
    display: "flex",
    alignItems: "center",
    backgroundImage: "linear-gradient(to right, #f6ae2d, #f26419)",
    borderRadius: "5px",
    padding: "5px",
    whiteSpace: "nowrap",
    width: props.width
  };
  const label = {
    margin: 0,
    fontSize: "16px",
  };
  const value = {
    border:  0,
    margin: 0,
    fontSize: "20px",
    background: "transparent",
  };

  return (
    <div style={container}>
      <p className="px-1" style={label}>
        {props.label}
      </p>
      <p className="px-1" style={value}>{props.value}</p>
    </div>
  );
}
