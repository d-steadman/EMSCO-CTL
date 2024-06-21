"use strict";

import { createRoot } from "react-dom/client";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

import CTL from "./CTL";
import "./output.css"; // Tailwind output

export default function App() {
  return (
    <div className="h-screen flex flex-col justify-between">
      <div className="py-6 text-center text-6xl font-black">
        <h1>Cycle Time List</h1>
      </div>

      <div className="ag-theme-quartz flex-grow overflow-hidden">
        <CTL />
      </div>

      <div class="flex flex-row py-2 ">
        <button>Testing</button>
        <button>Hello</button>
        <button>World</button>
      </div>
    </div>
  );
}

const root = createRoot(document.getElementById("root"));
root.render(<App />);
window.tearDownExample = () => root.unmount();
