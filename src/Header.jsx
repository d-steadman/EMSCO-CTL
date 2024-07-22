import { Link } from "react-router-dom";
import { SELECTED_STYLES } from "./LandingPage";
import Login from "./Login";

export default function Header({
  page,
  loggedIn,
  setLoggedIn,
  gridRef,
  lastUpdated,
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
    <div>
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
          <Link
            to="/official-kanban"
            className="btn bg-black text-xl text-white"
          >
            Official Kanban &rsaquo;
          </Link>
        </div>
      </div>
      <div>
        <h2 className="mt-2 mb-4 flex place-content-center">
          Last Updated: {lastUpdated}
        </h2>
      </div>
    </div>
  );
}
