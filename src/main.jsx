"use strict";

import { createRoot } from "react-dom/client";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

import Header from "./header";
import CTL from "./CTL";
import Footer from "./footer";
import "./output.css"; // Tailwind output

export default function App() {
  return (
    <div className="h-screen flex flex-col justify-between">
      <Header />

      <div className="ag-theme-quartz h-full">
        <CTL />
      </div>

      <Footer />
    </div>
  );
}

const root = createRoot(document.getElementById("root"));
root.render(<App />);
window.tearDownExample = () => root.unmount();
