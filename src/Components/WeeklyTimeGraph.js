import React from "react";
import { Spinner } from "react-bootstrap";
import Chart from "chart.js";
export default function WeeklyTimeGraph() {
  return (
    <div/*
      width={"100%"}
      height={"300px"}
      chartType="ColumnChart"
      loader={
        <div>
          <Spinner />

          <p>Loading Chart</p>
        </div>
      }
      data={[
        ["Day", "Hours"],
        ["Sun", 5],
        ["Mon", 3.4],
        ["Tues", 10.4],
        ["Wed", 1.1],
        ["Thurs", 2.2],
        ["Fri", 4.5],
        ["Sat", 2],
      ]}
      options={{
        title: "Week of Jun 24 - July 8",
        legend: { position: "none" },
        chartArea: {width: "90%"},
        hAxis: {
          minValue: 0,
        },
        vAxis: {
          format: "decimal",
          gridlines: {
            color: "light",
          },
          textPosition: "out",
        },
        titleTextStyle: {
          fontSize: 20,
          fontName: "Calibri",
          color: "black",
          bold: false
        },
      }}
      // For tests
      rootProps={{ "data-testid": "1" }}*/
    />
  );
}
