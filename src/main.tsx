import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./styles/animations.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      const registration = await navigator.serviceWorker.register(
        "/mj-heartsu/sw.js",
        { scope: "/mj-heartsu/" }
      );
      console.log("SW registered: ", registration);
    } catch (registrationError) {
      console.log("SW registration failed: ", registrationError);
    }
  });
}
