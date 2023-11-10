import React from "react";
import ReactDOM from "react-dom/client";
import App from "./component/App";
import "./styles.css";
import { emit } from "@tauri-apps/api/event";
import { Provider } from "react-redux";
import { store } from "./store/app";
import { ThemeProvider } from "@material-tailwind/react";

document.addEventListener("keydown", (e: KeyboardEvent) => {
  console.dir(`metaKey:${e.metaKey} key:${e.key}`);
  emit("keydown", { key: e.key });
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Provider store={store}>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </Provider>
);
