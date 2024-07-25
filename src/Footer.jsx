import { useCallback } from "react";
import { Link } from "react-router-dom";
import { NOT_SELECTED_STYLES, SELECTED_STYLES } from "./LandingPage";

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

export default function Footer({ page, setPage, gridRef }) {
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
    <div className="flex flex-row px-4 py-2 space-x-2.5 items-center">
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

      <button className="btn bg-black text-white border-2 border-black">
        FAQ
      </button>

      <Link
        to="/official-kanban"
        className="btn bg-black text-white border-2 border-black"
      >
        Official Kanban
      </Link>
    </div>
  );
}
