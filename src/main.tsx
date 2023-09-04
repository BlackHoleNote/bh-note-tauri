import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";
import { emit } from "@tauri-apps/api/event";
import { RecoilRoot } from "recoil";

document.addEventListener("keydown", (e: KeyboardEvent) => {
  console.dir(`metaKey:${e.metaKey} key:${e.key}`);
  emit("keydown", { key: e.key });
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RecoilRoot>
      <App />
    </RecoilRoot>
  </React.StrictMode>
);
