import React from "react";
import { Spinner } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import * as utils from "../Util/utils";
export default function WeeklyScreenTimeGraph(props) {
  if (props.times == null) {
    return <Spinner animation="border" role="status"></Spinner>;
  }

  //{0: {facebook.com: 32.4, instagram.com: 11}, 1: {}, ..., 6: {}} --> {facebook.com: {0: 32.4}, instagram.com: {0: 11}...},
  const times = props.times;
  const timesBySite = {};
  for (const day in times) {
    for (const site in times[day]) {
      if (timesBySite[site] == null) {
        timesBySite[site] = {};
      }
      timesBySite[site][day] = times[day][site];
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
      //borderColor: "rgba(255,99,132,1)",
      borderWidth: 1,
      hoverBackgroundColor: randomColor,
      //hoverBorderColor: "rgba(255,99,132,1)",
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
          label += utils.formatMinutes(Number(tooltipItem.yLabel));
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
            // Include a dollar sign in the ticks
            callback: utils.formatMinutes,
          },
        },
      ],
    },
  };
  return <Bar data={data} options={options}/>;
}
