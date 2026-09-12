import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ScoutApp } from "@/components/scout-app";
import "./app.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ScoutApp />
  </StrictMode>,
);
