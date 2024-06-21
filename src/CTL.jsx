"use strict";

import { format } from "date-fns";
import React, { useEffect, useMemo, useState, StrictMode } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-charts-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

import "./output.css"; // Tailwind output

export default function CTL() {
  const [rowData, setRowData] = useState();
  const [colDefs, setColDefs] = useState([
    { field: "jobNumber", headerName: "Job #", width: 110 },
    { field: "orderNumber", headerName: "Order #", hide: true },
    { field: "partNumber", headerName: "Part #", hide: true },
    { field: "partDescription", headerName: "Part Desc." },
    { field: "quantity", headerName: "Qty" },
    {
      field: "dueDate",
      headerName: "Due Date",
      valueGetter: (row) => format(row.data.dueDate, "MM/dd/yyyy"),
    },
    { field: "comments", headerName: "Comments" },
    { field: "customerCode", headerName: "Cust. Code" },
    {
      field: "productCode",
      headerName: "Prod. Code",
      filter: "agSetColumnFilter",
    },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      enableValue: true,
    };
  }, []);

  const rowClassRules = {
    "bg-hot": (params) => {
      return params.data.priority == 10;
    },
    "bg-next": (params) => {
      return params.data.priority == 20;
    },
    "bg-firm": (params) => {
      return params.data.priority == 30;
    },
    "bg-standard": (params) => {
      return params.data.priority == 40;
    },
    "bg-on-hold": (params) => params.data.jobOnHold,
  };

  const sideBar = useMemo(() => {
    return {
      toolPanels: [
        {
          id: "columns",
          labelDefault: "Columns",
          labelKey: "columns",
          iconKey: "columns",
          toolPanel: "agColumnsToolPanel",
          toolPanelParams: {
            suppressRowGroups: true,
            suppressValues: true,
            suppressPivots: true,
            suppressPivotMode: true,
            contractColumnSelection: true,
          },
        },
      ],
    };
  }, []);
  const onGridReady = useEffect(() => {
    fetch("/api/table")
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        setRowData(json);
      });
  }, []);

  return (
    <AgGridReact
      rowData={rowData}
      rowClassRules={rowClassRules}
      rowHeight={30}
      columnDefs={colDefs}
      defaultColDef={defaultColDef}
      sideBar={sideBar}
      rowGroupPanelShow={"never"}
      pivotPanelShow={"never"}
      onGridReady={onGridReady}
    />
  );
}
