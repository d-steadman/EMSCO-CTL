"use strict";

import {
  addDays,
  subDays,
  addWeeks,
  format,
  parseISO,
  startOfDay,
} from "date-fns";
import React, { forwardRef, useEffect, useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-charts-enterprise";
//import "ag-grid-community/styles/ag-grid.css";
//import "ag-grid-community/styles/ag-theme-quartz.css";

import "./ag-grid-theme-custom.css";
import "./output.css"; // Tailwind output

function CTL({ gridRef }) {
  const [rowData, setRowData] = useState();
  const [colDefs, setColDefs] = useState([
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
      width: 125,
      filter: "agSetColumnFilter",
      sortIndex: 2,
      sort: "asc",
    },
    {
      field: "partDescription",
      headerName: "Part Desc.",
      width: 535,
      filter: "agSetColumnFilter",
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
      headerName: "Effective Date",
      width: 90,
      valueGetter: (row) => {
        let date = parseISO(row.data.dueDate);

        if (typeof row.data.weeks_left === "number") {
          date = addWeeks(new Date(), row.data.weeks_left);
        }

        date = startOfDay(date);

        switch (row.data.priority) {
          case 30:
            return subDays(date, 2);

          case 50:
            return addDays(date, 10);

          default:
            return date;
        }
      },
      valueFormatter: (row) => {
        return format(row.value, "MM-dd-yy");
      },
      sortIndex: 0,
      sort: "asc",
    },
    {
      field: "weeks_left",
      headerName: "Weeks",
      width: 90,
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
      width: 150,
      filter: "agTextColumnFilter",
    },
    {
      field: "miscDescription",
      headerName: "Misc. Desc.",
      width: 75,
      filter: "agSetColumnFilter",
    },
    {
      headerName: "Est. Hrs.",
      width: 65,
      valueGetter: (row) => {
        return (
          row.data.totalEstimatedHours *
          (row.data.quantity /
            (row.data.quantityOrdered + row.data.quantityToStock))
        ).toFixed(1);
      },
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
  ]);

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
    fetch("/api/ctl")
      .then((res) => res.json())
      .then((json) => {
        setRowData(json);
      });
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
      sideBar={sideBar}
      rowGroupPanelShow={"never"}
      pivotPanelShow={"never"}
      onGridReady={onGridReady}
    />
  );
}

export default CTL;
