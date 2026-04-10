import { createRoot } from "react-dom/client";
import { Capacitor } from "@capacitor/core";
import { defineCustomElements as jeepSqlite } from "jeep-sqlite/loader";
import App from "./app/App.tsx";
import "./styles/index.css";

// Web platform SQLite polyfill
if (Capacitor.getPlatform() === 'web') {
  jeepSqlite(window);
  const jeepEl = document.createElement("jeep-sqlite");
  document.body.appendChild(jeepEl);
  
  customElements.whenDefined('jeep-sqlite').then(() => {
    createRoot(document.getElementById("root")!).render(<App />);
  });
} else {
  // If native Android/iOS, just render the app normally
  createRoot(document.getElementById("root")!).render(<App />);
}