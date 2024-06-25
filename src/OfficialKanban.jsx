import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
{
  /*import "ag-grid-charts-enterprise";*/
}

import "./ag-grid-theme-custom.css";
import "./theme-modifications.css";
import "./output.css"; // Tailwind output

function Header() {
  return (
    <div className="py-4 flex justify-between items-center">
      <div className="flex-1 ml-4 justify-self-start self-center">
        <Link to="/" className="btn bg-black text-xl text-white">
          &lsaquo; Cycle Time List
        </Link>
      </div>

      <div className="shrink-0 justify-self-center text-center text-4xl font-black">
        <h1>Official Kanban List</h1>
      </div>

      {/* Keeps title centered */}
      <div className="flex-1"></div>
    </div>
  );
}

// Create new GridExample component
export default function OfficialKanban() {
  /* Kanban grid doesn't need filter/sort capability,
     therefore it doesn't need it's own file. */

  const [rowData, setRowData] = useState();

  const [colDefs, setColDefs] = useState([
    { field: "partNumber", headerName: "Part #" },
    {
      headerName: "Stock",
      children: [
        { field: "kanban_stock", headerName: "Kanban / EMSCO Stock" },
        { field: "user_Number2", headerName: "Customer Stock" },
      ],
    },

    { field: "user_Number1", headerName: "Monthly Usage" },

    {
      headerName: "On Order",
      children: [
        { field: "order_qty", headerName: "Qty On Order" },
        {
          field: "weeks_left",
          headerName: "Weeks",
          valueFormatter: (row) => {
            // Don't attempt to round string values
            if (typeof row.value === "number") {
              return row.value.toFixed(1);
            }

            return row.value;
          },
        },
      ],
    },
    {
      headerName: "Weeks till Leadtime",
      valueGetter: (row) => {
        if (typeof row.data.weeks_left === "string") {
          return "N/A";
        }

        let weeks = row.data.weeks_left - 5;

        return weeks <= 0 ? "Leadtime Now" : weeks;
      },
      valueFormatter: (row) => {
        if (typeof row.value === "string") {
          return row.value;
        }

        return row.value.toFixed(1);
      },
      cellClassRules: {
        "bg-leadtime": (row) => {
          return typeof row.value === "string" || row.value < 3;
        },
      },
    },
  ]);

  const onGridReady = useEffect(() => {
    fetch("/api/official-kanban")
      .then((res) => res.json())
      .then((json) => {
        setRowData(json);
      });
  }, []);

  // Container: Defines the grid's theme & dimensions.
  return (
    <div className="h-screen flex flex-col">
      <Header />

      <div className={"official-kanban ag-theme-custom h-full"}>
        <AgGridReact
          rowData={rowData}
          rowHeight={40}
          columnDefs={colDefs}
          defaultColDef={{ flex: 1 }}
          onGridReady={onGridReady}
        />
      </div>
    </div>
  );
}
