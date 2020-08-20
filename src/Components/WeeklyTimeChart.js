import React from "react";
import { Bar } from "react-chartjs-2";
import * as functions from "../Utils/functions";

/**
 * Component displaying a bar graph charting the amount of time spent on different sites during the past week
 * @param {*} props 
 */
export default function WeeklyScreenTimeGraph(props) {
  //{0: {facebook.com: 32.4, instagram.com: 11}, 1: {}, ..., 6: {}} --> {facebook.com: {0: 32.4}, instagram.com: {0: 11}...},
  const timesBySite = {};
  for (const day in props.times) {
    for (const site in props.times[day]) {
      if (timesBySite[site] == null) {
        timesBySite[site] = {};
      }
      timesBySite[site][day] = props.times[day][site];
    }
  }
  //{facebook.com: {0: 32.4}, instagram.com: {0: 11}...} --> {facebook.com: [32.4, 0, 0, 0, 0, 0, 0], ...}
  for (const site in timesBySite) {
    const times = new Array(7).fill(0);
    for (const day in timesBySite[site]) {
      times[day] = Math.round(timesBySite[site][day] * 100) / 100;
    }
    timesBySite[site] = times;
  }
  for (const site in timesBySite) {
    const o = Math.round,
      r = Math.random,
      s = 255;
    const randomColor =
      "rgb(" + o(r() * s) + "," + o(r() * s) + "," + o(r() * s) + ")";
    const formattedGraphSite = {
      label: site,
      backgroundColor: randomColor,
      borderWidth: 1,
      hoverBackgroundColor: randomColor,
      data: timesBySite[site],
    };
    timesBySite[site] = formattedGraphSite;
  }

  const data = {
    labels: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    datasets: Object.values(timesBySite),
  };

  const options = {
    maintainAspectRatio: true,
    tooltips: {
      callbacks: {
        label: function (tooltipItem, data) {
          let label = data.datasets[tooltipItem.datasetIndex].label || "";
          if (label) {
            label += ": ";
          }
          label += functions.formatMinutes(Number(tooltipItem.yLabel));
          return label;
        },
      },
    },
    scales: {
      xAxes: [
        {
          stacked: true,
        },
      ],
      yAxes: [
        {
          stacked: true,
          display: true,
          title: "LOL",
          ticks: {
            callback: functions.formatMinutes,
          },
        },
      ],
    },
  };
  return <Bar data={data} options={options}/>;
}
