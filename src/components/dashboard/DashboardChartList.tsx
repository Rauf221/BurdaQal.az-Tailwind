"use client";

import dynamic from "next/dynamic";

const EarningsChart1 = dynamic(() => import("./EarningsChart1"), { ssr: false });

/** justhome `ChartList.js` */
export default function DashboardChartList({ style }: { style: number }) {
  if (style === 1) return <EarningsChart1 />;
  return null;
}
