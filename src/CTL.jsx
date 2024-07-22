"use strict";

import { format, parseISO } from "date-fns";
import React, { useEffect, useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-charts-enterprise";

import "./ag-grid-theme-custom.css";
import "./output.css"; // Tailwind output

export function getColDefs(loggedIn) {
  return [
    {
      field: "priority",
      headerName: "Priority",
      hide: true,
      sortIndex: 1,
      sort: "asc",
    },
    { field: "PONumber", headerName: "PO #", hide: true, width: 100 },
    {
      field: "jobNumber",
      headerName: "Job #",
      width: 95,
      filter: "agSetColumnFilter",
    },
    {
      field: "orderNumber",
      headerName: "Order #",
      hide: true,
      filter: "agSetColumnFilter",
    },
    {
      field: "partNumber",
      headerName: "Part #",
      hide: true,
      filter: "agSetColumnFilter",
    },
    {
      field: "customerCode",
      headerName: "Cust. Code",
      width: 100,
      filter: "agSetColumnFilter",
      sortIndex: 2,
      sort: "asc",
    },
    {
      field: "partDescription",
      headerName: "Part Desc.",
      flex: 2,
      minWidth: 535,
      filter: "agSetColumnFilter",
    },
    {
      field: "notes",
      cellDataType: "text",
      headerName: "Notes",
      editable: loggedIn,
      cellClass: "text-red-600",
    },
    {
      field: "quantity",
      headerName: "Qty",
      cellClass: "text-right",
      width: 60,
    },
    {
      field: "dueDate",
      cellDataType: "date",
      headerName: "Due Date",
      hide: true,
      width: 105,
      valueGetter: (row) => parseISO(row.data.dueDate),
      valueFormatter: (row) => {
        return format(row.value, "MM-dd-yy");
      },
    },
    {
      cellDataType: "date",
      field: "effective_date",
      headerName: "Effective Date",
      width: 90,
      valueFormatter: (row) => {
        return format(row.value, "MM-dd-yy");
      },
      sortIndex: 0,
      sort: "asc",
    },
    {
      field: "weeks_left",
      headerName: "Weeks",
      width: 80,
      valueFormatter: (row) => {
        // Don't attempt to round string values
        if (typeof row.value === "number") {
          return row.value.toFixed(1);
        }

        return row.value;
      },
    },
    {
      field: "comments",
      headerName: "Comments",
      flex: 1,
      minWidth: 180,
      filter: "agTextColumnFilter",
    },
    {
      field: "miscDescription",
      headerName: "Misc. Desc.",
      width: 75,
      filter: "agSetColumnFilter",
    },
    {
      field: "estimated_hours",
      headerName: "Est. Hrs.",
      width: 65,
      valueFormatter: (row) => row.value.toFixed(1),
    },
    {
      field: "location",
      headerName: "Location",
      width: 115,
    },
    {
      field: "productCode",
      headerName: "Prod. Code",
      width: 135,
      filter: "agSetColumnFilter",
    },
  ];
}

function CTL({ gridRef, loggedIn, setLastUpdated }) {
  const [rowData, setRowData] = useState();
  const [colDefs, setColDefs] = useState(getColDefs());

  const defaultColDef = useMemo(() => {
    return {
      menuTabs: ["filterMenuTab"],
      enableValue: true,
    };
  }, []);

  const postSortRows = (params) => {
    let rowNodes = params.nodes;
    // Put 20 on top
    let nextInsertPos = 0;
    for (let i = 0; i < rowNodes.length; i++) {
      if (rowNodes[i].data.priority === 20) {
        rowNodes.splice(nextInsertPos, 0, rowNodes.splice(i, 1)[0]);
        nextInsertPos++;
      }
    }

    // Put 10 on top, so it's placed above 20
    nextInsertPos = 0;
    for (let i = 0; i < rowNodes.length; i++) {
      if (rowNodes[i].data.priority === 10) {
        rowNodes.splice(nextInsertPos, 0, rowNodes.splice(i, 1)[0]);
        nextInsertPos++;
      }
    }
  };

  const getRowClass = (params) => {
    if (params.data.jobOnHold) {
      return "bg-on-hold";
    }

    switch (params.data.priority) {
      case 10:
        return "bg-hot";
      case 20:
        return "bg-next";
      case 30:
        return "bg-firm";
      case 40:
        return "bg-standard";
      default:
        return "";
    }
  };

  const pushNote = async (row) => {
    const token = sessionStorage.getItem("jwt");

    await fetch("/api/note", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        uniqueID: row.data.uniqueID,
        value: row.newValue,
      }),
    });
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
    const fetchData = async () => {
      fetch("/api/ctl")
        .then((res) => res.json())
        .then((json) => {
          setRowData(json);
        });

      // Change lastUpdated time
      setLastUpdated(format(new Date(), "h:mm b"));
    };

    fetchData(); // Fetch initial data

    const intervalId = setInterval(() => {
      fetchData(); // Fetch data every 2 minutes
    }, 300000);

    return () => clearInterval(intervalId); // Clean-up interval on exit
  }, []);

  return (
    <AgGridReact
      ref={gridRef}
      rowData={rowData}
      postSortRows={postSortRows}
      getRowClass={getRowClass}
      rowHeight={30}
      columnDefs={colDefs}
      defaultColDef={defaultColDef}
      enableRangeSelection={true}
      onCellValueChanged={pushNote}
      sideBar={sideBar}
      rowGroupPanelShow={"never"}
      pivotPanelShow={"never"}
      onGridReady={onGridReady}
    />
  );
}

export default CTL;
