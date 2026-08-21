"use client";

import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export function RegistrationsChart({
  categories,
  data,
}: {
  categories: string[];
  data: number[];
}) {
  const options: ApexOptions = {
    chart: {
      fontFamily: "inherit",
      toolbar: { show: false },
      type: "area",
    },
    colors: ["#465fff"],
    stroke: { curve: "smooth", width: 2 },
    fill: {
      type: "gradient",
      gradient: { opacityFrom: 0.45, opacityTo: 0 },
    },
    dataLabels: { enabled: false },
    grid: {
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    xaxis: {
      categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: { style: { fontSize: "12px" } },
      min: 0,
      forceNiceScale: true,
    },
    tooltip: { y: { formatter: (val) => `${val} registrations` } },
  };

  return (
    <ReactApexChart
      options={options}
      series={[{ name: "Registrations", data }]}
      type="area"
      height={280}
    />
  );
}
