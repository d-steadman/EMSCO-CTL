"use strict";

import { useRef } from "react";
import { createRoot } from "react-dom/client";
//import "ag-grid-community/styles/ag-grid.css";
//import "ag-grid-community/styles/ag-theme-quartz.css";

import "./ag-grid-theme-custom.css";
import Header from "./header";
import CTL from "./CTL";
import Footer from "./footer";
import "./output.css"; // Tailwind output

export default function App() {
  const gridRef = useRef();

  return (
    <div className="h-screen flex flex-col justify-between">
      <Header />

      <div className="ag-theme-custom h-full">
        <CTL gridRef={gridRef} />
      </div>

      <Footer gridRef={gridRef} />
    </div>
  );
}

const root = createRoot(document.getElementById("root"));
root.render(<App />);
window.tearDownExample = () => root.unmount();
