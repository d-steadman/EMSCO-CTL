import { format } from "date-fns";
import { useCallback, useRef, useState } from "react";

import "./ag-grid-theme-custom.css";
import CTL from "./CTL";
import Header from "./Header";
import Footer from "./Footer";
import "./output.css"; // Tailwind output

export const SELECTED_STYLES = {
  "Kanban Complete": "btn bg-green-600 border-2 border-green-600 text-white",
  ALL: "btn bg-red-600 border-2 border-red-600 text-white",
  Harness: "btn bg-amber-300 border-2 border-amber-300 text-white",
  "PCB & Box": "btn bg-lime-600 border-2 border-lime-600 text-white",
  "Weatherproof 1": "btn bg-sky-700 border-2 border-sky-700 text-white",
  "Weatherproof 2": "btn bg-sky-700 border-2 border-sky-700 text-white",
  "Weatherproof 3": "btn bg-sky-700 border-2 border-sky-700 text-white",
  Power: "btn bg-amber-500 border-2 border-amber-500 text-white",
  "Ongoing 1": "btn bg-amber-700 border-2 border-amber-700 text-white",
  Engineering: "btn bg-violet-700 border-2 border-violet-700 text-white",
};

export const NOT_SELECTED_STYLES = {
  "Kanban Complete": "btn bg-white border-2 border-green-600 text-green-600",
  ALL: "btn bg-white border-2 border-red-600 text-red-600",
  Harness: "btn bg-white border-2 border-amber-300 text-amber-300",
  "PCB & Box": "btn bg-white border-2 border-lime-600 text-lime-600",
  "Weatherproof 1": "btn bg-white border-2 border-sky-700 text-sky-700",
  "Weatherproof 2": "btn bg-white border-2 border-sky-700 text-sky-700",
  "Weatherproof 3": "btn bg-white border-2 border-sky-700 text-sky-700",
  Power: "btn bg-white border-2 border-amber-500 text-amber-500",
  "Ongoing 1": "btn bg-white border-2 border-amber-700 text-amber-700",
  Engineering: "btn bg-white border-2 border-violet-700 text-violet-700",
};

export default function LandingPage() {
  const [page, setPage] = useState("ALL");
  const [rowData, setRowData] = useState();
  const [loggedIn, setLoggedIn] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("");
  const gridRef = useRef();

  const fetchData = async () => {
    fetch("/api/ctl")
      .then((res) => res.json())
      .then((json) => {
        setRowData(json);
      });

    // Change lastUpdated time
    setLastUpdated(format(new Date(), "M/d h:mm a")); // 1:59 PM
  };

  return (
    <div className="h-screen flex flex-col justify-between">
      <Header
        page={page}
        loggedIn={loggedIn}
        setLoggedIn={setLoggedIn}
        lastUpdated={lastUpdated}
        gridRef={gridRef}
        fetchData={fetchData}
      />

      <div className="ag-theme-custom tracking-tighter h-full">
        <CTL
          gridRef={gridRef}
          rowData={rowData}
          loggedIn={loggedIn}
          fetchData={fetchData}
        />
      </div>

      <Footer page={page} setPage={setPage} gridRef={gridRef} />
    </div>
  );
}
