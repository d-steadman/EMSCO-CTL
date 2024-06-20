"use strict";

import React, { useEffect, useMemo, useState, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-charts-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

const GridExample = () => {
  const [rowData, setRowData] = useState();
  const [colDefs, setColDefs] = useState([
    { field: "orderNumber" },
    { field: "jobNumber" },
    { field: "partNumber" },
    { field: "partDescription" },
    { field: "quantity" },
    { field: "dueDate" },
    { field: "comments" },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      enableValue: true,
    };
  }, []);
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
        setRowData(json.table);
      });
  }, []);

  return (
    <div className={"ag-theme-quartz-dark"}>
      <AgGridReact
        rowData={rowData}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
        sideBar={sideBar}
        rowGroupPanelShow={"never"}
        pivotPanelShow={"never"}
        onGridReady={onGridReady}
      />
    </div>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(<GridExample />);
window.tearDownExample = () => root.unmount();
