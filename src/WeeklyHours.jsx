import React, { useEffect, useState } from "react";
import { AgCharts } from "ag-charts-react";

export default function WeeklyHours() {
  const [options, setOptions] = useState({});

  // Fetch data from endpoint
  useEffect(() => {
    fetch("/api/weekly-hours")
      .then((res) => res.json())
      .then((json) => {
        // Create the series from available product codes
        let productCodes = new Set();
        for (let key of Object.keys(json[0])) {
          key != "effective_week" && productCodes.add(key);
        }

        let series = [];
        for (let productCode of productCodes) {
          series.push({
            type: "bar",
            xKey: "effective_week",
            yKey: productCode,
            yName: productCode,
            stacked: true,
          });
        }

        setOptions({
          height: 700,
          title: {
            text: "Weekly Hours Breakdown by Product Code",
            fontSize: 48,
            fontWeight: 900,
          },
          data: json,
          series: series,
          axes: [
            {
              type: "time",
              position: "bottom",
              label: {
                format: "%B %e",
              },
            },
            {
              type: "number",
              position: "left",
              label: {},
            },
          ],
        });
      });
  }, []);

  return <AgCharts options={options} />;
}
