import { SELECTED_STYLES } from "./LandingPage";
import Login from "./Login";

export default function Header({
  page,
  loggedIn,
  setLoggedIn,
  gridRef,
  lastUpdated,
  fetchData,
}) {
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
    <header>
      <div className="mx-4 mt-4 flex justify-between items-center">
        <Login
          loggedIn={loggedIn}
          setLoggedIn={setLoggedIn}
          gridRef={gridRef}
        />
        <div className="flex justify-end mr-4 self-center">{pageElement}</div>

        <div className="shrink-0 justify-self-center text-center text-4xl font-black">
          <h1>Cycle Time List</h1>
        </div>

        {/* Keeps title centered */}
        <div className="flex justify-end flex-1 self-center">
          <button
            className="btn bg-black text-xl text-white"
            onClick={() => {
              // Renders full grid so all of it can be printed
              gridRef.current.api.setGridOption("domLayout", "print");

              // Set width of flex columns so they fit in print area
              gridRef.current.api.applyColumnState({
                state: [
                  { colId: "partDescription", width: 550 },
                  { colId: "comments", width: 180 },
                ],
              });

              // Allow time for printing to process
              setTimeout(() => {
                print();

                // Remove set width and restore flex property
                gridRef.current.api.applyColumnState({
                  state: [
                    { colId: "partDescription", flex: 2, width: null },
                    { colId: "comments", flex: 1, width: null },
                  ],
                });

                gridRef.current.api.setGridOption("domLayout", undefined);
              }, 2000);
            }}
          >
            Print
          </button>
        </div>
      </div>
      <div className="mt-2 mb-4 flex flex-row justify-center items-center space-x-4">
        <h2 className="">Last Updated: {lastUpdated}</h2>
        <button className="btn bg-black text-white" onClick={fetchData}>
          Refresh Data
        </button>
      </div>
    </header>
  );
}
