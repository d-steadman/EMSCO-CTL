"use strict";

import { createRoot } from "react-dom/client";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage";
import OfficialKanban from "./OfficialKanban";
import WeeklyHours from "./WeeklyHours";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route exact path="/official-kanban" element={<OfficialKanban />} />
        <Route exact path="/weekly-hours" element={<WeeklyHours />} />
      </Routes>
    </BrowserRouter>
  );
}

const root = createRoot(document.getElementById("root"));
root.render(<App />);
window.tearDownExample = () => root.unmount();
