import { useCallback, useRef } from "react";
import { Link } from "react-router-dom";

import "./ag-grid-theme-custom.css";
import CTL from "./CTL";
import "./output.css"; // Tailwind output

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
  const gridRef = useRef();

  return (
    <div className="h-screen flex flex-col justify-between">
      <Header />

      <div className="ag-theme-custom tracking-tighter h-full">
        <CTL gridRef={gridRef} />
      </div>

      <Footer gridRef={gridRef} />
    </div>
  );
}

function Header() {
  return (
    <div className="py-4 text-center text-4xl font-black">
      <h1>Cycle Time List</h1>
    </div>
  );
}

function Footer({ gridRef }) {
  // Filtering states for "page" buttons
  const onKanbanComplete = useCallback(() => {
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
    gridRef.current.api.setFilterModel(null); // Clear all filters
  }, []);

  const onHarness = useCallback(() => {
    gridRef.current.api.setFilterModel(
      notCompleted(["PROD-HNS-STD", "PROD-HNS-TNY", "PROD-MULTI"]),
    );
  }, []);

  const onPCBBOX = useCallback(() => {
    gridRef.current.api.setFilterModel(notCompleted(["PROD-PCB", "PROD-BOX"]));
  }, []);

  const onWeatherproof1 = useCallback(() => {
    gridRef.current.api.setFilterModel(notCompleted(["PROD-HNS-W1"]));
  }, []);

  const onWeatherproof2 = useCallback(() => {
    gridRef.current.api.setFilterModel(notCompleted(["PROD-HNS-W2"]));
  }, []);

  const onWeatherproof3 = useCallback(() => {
    gridRef.current.api.setFilterModel(notCompleted(["PROD-HNS-W3"]));
  }, []);

  const onPower = useCallback(() => {
    gridRef.current.api.setFilterModel(notCompleted(["PROD-POWER"]));
  }, []);

  const onOngoing1 = useCallback(() => {
    gridRef.current.api.setFilterModel(notCompleted(["PROD-ONG-1"]));
  }, []);

  const onEngineering = useCallback(() => {
    gridRef.current.api.setFilterModel(notCompleted(["SERVICE"]));
  }, []);

  return (
    <div className="flex flex-row py-2 space-x-2.5">
      <Link to="/official-kanban" className="ml-4 btn bg-black text-white">
        Official Kanban
      </Link>
      <button
        onClick={onKanbanComplete}
        className="btn bg-green-600 text-white"
      >
        Kanban Complete
      </button>
      <button onClick={onALL} className="btn bg-red-600 text-white">
        All
      </button>
      <button onClick={onHarness} className="btn bg-amber-400 text-white">
        Harness
      </button>
      <button onClick={onPCBBOX} className="btn bg-lime-600 text-white">
        PCB & Box
      </button>
      <button onClick={onWeatherproof1} className="btn bg-sky-700 text-white">
        Weatherproof 1
      </button>
      <button onClick={onWeatherproof2} className="btn bg-sky-700 text-white">
        Weatherproof 2
      </button>
      <button onClick={onWeatherproof3} className="btn bg-sky-700 text-white">
        Weatherproof 3
      </button>
      <button onClick={onPower} className="btn bg-amber-400 text-white">
        Power
      </button>
      <button onClick={onOngoing1} className="btn bg-amber-400 text-white">
        Ongoing 1
      </button>
      <button onClick={onEngineering} className="btn bg-violet-700 text-white">
        Engineering
      </button>
    </div>
  );
}
