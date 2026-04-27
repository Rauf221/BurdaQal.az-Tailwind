"use client";

import type { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";

/** justhome `EarningsChart1.js` — View Statistics area chart */
export default function EarningsChart1() {
  const options: ApexOptions = {
    chart: {
      height: 500,
      type: "area",
      zoom: { enabled: false },
      toolbar: { show: false },
    },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 2 },
    colors: ["#EB664E"],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.3,
        opacityTo: 0.9,
        stops: [0, 90, 100],
      },
    },
    xaxis: {
      labels: {
        style: { colors: "#1A1A1A" },
      },
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
  };

  const series = [
    {
      name: "View",
      data: [45, 52, 38, 45, 49, 43, 40, 45, 52, 38, 45, 19],
    },
  ];

  return <Chart options={options} series={series} type="area" height={500} />;
}
