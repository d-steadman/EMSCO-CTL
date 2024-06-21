import { forwardRef, useCallback } from "react";

function Footer({ gridRef }) {
  // Sorting states for "page" buttons
  const onKanbanComplete = useCallback(() => {
    gridRef.current.api.applyColumnState({
      state: [],
    });
  }, []);

  return (
    <div class="flex flex-row py-2 space-x-2.5">
      <button className="ml-4 btn bg-black text-white">Offical Kanban</button>
      <button
        onClick={onKanbanComplete}
        className="btn bg-green-600 text-white"
      >
        Kanban Complete
      </button>
      <button className="btn bg-red-600 text-white">All</button>
      <button className="btn bg-amber-400 text-white">Harness</button>
      <button className="btn bg-lime-600 text-white">PCB & Box</button>
      <button className="btn bg-sky-700 text-white">Weatherproof 1</button>
      <button className="btn bg-sky-700 text-white">Weatherproof 2</button>
      <button className="btn bg-sky-700 text-white">Weatherproof 3</button>
      <button className="btn bg-amber-400 text-white">Power</button>
      <button className="btn bg-amber-400 text-white">Ongoing 1</button>
      <button className="btn bg-violet-700 text-white">Engineering</button>
    </div>
  );
}

export default Footer;
