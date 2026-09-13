import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ScoutApp } from "@/components/scout-app";
import "./app.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ScoutApp />
  </StrictMode>,
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    void navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`);
  });
}
