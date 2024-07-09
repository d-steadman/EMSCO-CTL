import { useCallback, useRef, useState } from "react";
import { Link } from "react-router-dom";

import "./ag-grid-theme-custom.css";
import CTL from "./CTL";
import "./output.css"; // Tailwind output

const SELECTED_STYLES = {
  "Kanban Complete": "btn bg-green-600 border-2 border-green-600 text-white",
  ALL: "btn bg-red-600 border-2 border-red-600 text-white",
  Harness: "btn bg-amber-400 border-2 border-amber-400 text-white",
  "PCB & Box": "btn bg-lime-600 border-2 border-lime-600 text-white",
  "Weatherproof 1": "btn bg-sky-700 border-2 border-sky-700 text-white",
  "Weatherproof 2": "btn bg-sky-700 border-2 border-sky-700 text-white",
  "Weatherproof 3": "btn bg-sky-700 border-2 border-sky-700 text-white",
  Power: "btn bg-amber-400 border-2 border-amber-400 text-white",
  "Ongoing 1": "btn bg-amber-400 border-2 border-amber-400 text-white",
  Engineering: "btn bg-violet-700 border-2 border-violet-700 text-white",
};

const NOT_SELECTED_STYLES = {
  "Kanban Complete": "btn bg-white border-2 border-green-600 text-green-600",
  ALL: "btn bg-white border-2 border-red-600 text-red-600",
  Harness: "btn bg-white border-2 border-amber-400 text-amber-400",
  "PCB & Box": "btn bg-white border-2 border-lime-600 text-lime-600",
  "Weatherproof 1": "btn bg-white border-2 border-sky-700 text-sky-700",
  "Weatherproof 2": "btn bg-white border-2 border-sky-700 text-sky-700",
  "Weatherproof 3": "btn bg-white border-2 border-sky-700 text-sky-700",
  Power: "btn bg-white border-2 border-amber-400 text-amber-400",
  "Ongoing 1": "btn bg-white border-2 border-amber-400 text-amber-400",
  Engineering: "btn bg-white border-2 border-violet-700 text-violet-700",
};

function notCompleted(prodCodes) {
  /* Used to filter completed Kanban items out of CTL pages */

  return {
    comments: {
      filterType: "text",
      operator: "OR",
      conditions: [
        {
          filterType: "text",
          type: "notContains",
          filter: "KANBAN",
        },
        {
          filterType: "text",
          type: "contains",
          filter: "LPRD",
        },
      ],
    },

    productCode: {
      filterType: "set",
      values: prodCodes,
    },
  };
}

export default function LandingPage() {
  const [page, setPage] = useState("ALL");
  const gridRef = useRef();

  return (
    <div className="h-screen flex flex-col justify-between">
      <Header page={page} />

      <div className="ag-theme-custom tracking-tighter h-full">
        <CTL gridRef={gridRef} />
      </div>

      <Footer page={page} setPage={setPage} gridRef={gridRef} />
    </div>
  );
}

function Header({ page }) {
  let pageElement;
  switch (page) {
    case "Kanban Complete":
      pageElement = (
        <h2 className={SELECTED_STYLES["Kanban Complete"]}>Kanban Complete</h2>
      );
      break;

    case "ALL":
      pageElement = <h2 className={SELECTED_STYLES["ALL"]}>All</h2>;
      break;

    case "Harness":
      pageElement = <h2 className={SELECTED_STYLES["Harness"]}>Harness</h2>;
      break;

    case "PCB & Box":
      pageElement = <h2 className={SELECTED_STYLES["PCB & Box"]}>PCB & Box</h2>;
      break;

    case "Weatherproof 1":
      pageElement = (
        <h2 className={SELECTED_STYLES["Weatherproof 1"]}>Weatherproof 1</h2>
      );
      break;

    case "Weatherproof 2":
      pageElement = (
        <h2 className={SELECTED_STYLES["Weatherproof 2"]}>Weatherproof 2</h2>
      );
      break;

    case "Weatherproof 3":
      pageElement = (
        <h2 className={SELECTED_STYLES["Weatherproof 3"]}>Weatherproof 3</h2>
      );
      break;

    case "Power":
      pageElement = <h2 className={SELECTED_STYLES["Power"]}>Power</h2>;
      break;

    case "Ongoing 1":
      pageElement = <h2 className={SELECTED_STYLES["Ongoing 1"]}>Ongoing 1</h2>;
      break;

    case "Engineering":
      pageElement = (
        <h2 className={SELECTED_STYLES["Engineering"]}>Engineering</h2>
      );
      break;
  }

  return (
    <div className="py-4 flex justify-between items-center">
      <div className="flex justify-end flex-1 mr-4 self-center">
        {pageElement}
      </div>

      <div className="shrink-0 justify-self-center text-center text-4xl font-black">
        <h1>Cycle Time List</h1>
      </div>

      {/* Keeps title centered */}
      <div className="flex justify-end flex-1 mr-4 self-center">
        <Link to="/official-kanban" className="btn bg-black text-xl text-white">
          Official Kanban &rsaquo;
        </Link>
      </div>
    </div>
  );
}

function Footer({ page, setPage, gridRef }) {
  // Filtering states for "page" buttons
  const onKanbanComplete = useCallback(() => {
    setPage("Kanban Complete");

    gridRef.current.api.resetColumnState();
    gridRef.current.api.setFilterModel({
      comments: {
        filterType: "text",
        operator: "AND",
        conditions: [
          {
            filterType: "text",
            type: "contains",
            filter: "KANBAN",
          },
          {
            filterType: "text",
            type: "notContains",
            filter: "LPRD",
          },
        ],
      },
    });
  }, []);

  const onALL = useCallback(() => {
    setPage("ALL");

    gridRef.current.api.resetColumnState();
    gridRef.current.api.setFilterModel(null); // Clear all filters
  }, []);

  const onHarness = useCallback(() => {
    setPage("Harness");

    gridRef.current.api.resetColumnState();
    gridRef.current.api.setFilterModel(
      notCompleted(["PROD-HNS-STD", "PROD-HNS-TNY", "PROD-MULTI"]),
    );
  }, []);

  const onPCBBOX = useCallback(() => {
    setPage("PCB & Box");

    gridRef.current.api.resetColumnState();
    gridRef.current.api.setFilterModel(notCompleted(["PROD-PCB", "PROD-BOX"]));
  }, []);

  const onWeatherproof1 = useCallback(() => {
    setPage("Weatherproof 1");

    gridRef.current.api.resetColumnState();
    gridRef.current.api.setFilterModel(notCompleted(["PROD-HNS-W1"]));
  }, []);

  const onWeatherproof2 = useCallback(() => {
    setPage("Weatherproof 2");

    gridRef.current.api.resetColumnState();
    gridRef.current.api.setFilterModel(notCompleted(["PROD-HNS-W2"]));
  }, []);

  const onWeatherproof3 = useCallback(() => {
    setPage("Weatherproof 3");

    gridRef.current.api.resetColumnState();
    gridRef.current.api.setFilterModel(notCompleted(["PROD-HNS-W3"]));
  }, []);

  const onPower = useCallback(() => {
    setPage("Power");

    gridRef.current.api.resetColumnState();
    gridRef.current.api.setFilterModel(notCompleted(["PROD-POWER"]));
  }, []);

  const onOngoing1 = useCallback(() => {
    setPage("Ongoing 1");

    gridRef.current.api.resetColumnState();
    gridRef.current.api.setFilterModel(notCompleted(["PROD-ONG-1"]));
  }, []);

  const onEngineering = useCallback(() => {
    setPage("Engineering");

    gridRef.current.api.resetColumnState();
    gridRef.current.api.setFilterModel(notCompleted(["SERVICE"]));
  }, []);

  return (
    <div className="flex flex-row px-4 py-2 space-x-2.5">
      <button
        onClick={onKanbanComplete}
        className={
          page == "Kanban Complete"
            ? SELECTED_STYLES["Kanban Complete"]
            : NOT_SELECTED_STYLES["Kanban Complete"]
        }
      >
        Kanban Complete
      </button>
      <button
        onClick={onALL}
        className={
          page == "ALL" ? SELECTED_STYLES["ALL"] : NOT_SELECTED_STYLES["ALL"]
        }
      >
        All
      </button>
      <button
        onClick={onHarness}
        className={
          page == "Harness"
            ? SELECTED_STYLES["Harness"]
            : NOT_SELECTED_STYLES["Harness"]
        }
      >
        Harness
      </button>
      <button
        onClick={onPCBBOX}
        className={
          page == "PCB & Box"
            ? SELECTED_STYLES["PCB & Box"]
            : NOT_SELECTED_STYLES["PCB & Box"]
        }
      >
        PCB & Box
      </button>
      <button
        onClick={onWeatherproof1}
        className={
          page == "Weatherproof 1"
            ? SELECTED_STYLES["Weatherproof 1"]
            : NOT_SELECTED_STYLES["Weatherproof 1"]
        }
      >
        Weatherproof 1
      </button>
      <button
        onClick={onWeatherproof2}
        className={
          page == "Weatherproof 2"
            ? SELECTED_STYLES["Weatherproof 2"]
            : NOT_SELECTED_STYLES["Weatherproof 2"]
        }
      >
        Weatherproof 2
      </button>
      <button
        onClick={onWeatherproof3}
        className={
          page == "Weatherproof 3"
            ? SELECTED_STYLES["Weatherproof 3"]
            : NOT_SELECTED_STYLES["Weatherproof 3"]
        }
      >
        Weatherproof 3
      </button>
      <button
        onClick={onPower}
        className={
          page == "Power"
            ? SELECTED_STYLES["Power"]
            : NOT_SELECTED_STYLES["Power"]
        }
      >
        Power
      </button>
      <button
        onClick={onOngoing1}
        className={
          page == "Ongoing 1"
            ? SELECTED_STYLES["Ongoing 1"]
            : NOT_SELECTED_STYLES["Ongoing 1"]
        }
      >
        Ongoing 1
      </button>
      <button
        onClick={onEngineering}
        className={
          page == "Engineering"
            ? SELECTED_STYLES["Engineering"]
            : NOT_SELECTED_STYLES["Engineering"]
        }
      >
        Engineering
      </button>
    </div>
  );
}
