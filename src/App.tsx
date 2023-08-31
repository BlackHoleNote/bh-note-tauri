import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import { hide } from "@tauri-apps/api/app";
import SplitPane, { Pane } from 'react-split-pane';

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke("greet", { name }));
    await hide();
    console.log("hi");

    
  }

  return (
    <div className="container">
      <h1>Welcome to Tauri!</h1>

      {/* <SplitPane split="vertical">
        <Pane initialSize="200px">You can use a Pane component</Pane>
        <div>or you can use a plain old div</div>
        <Pane initialSize="25%" minSize="10%" maxSize="500px">
          Using a Pane allows you to specify any constraints directly
        </Pane>
      </SplitPane>; */}

      <div className="row">
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo vite" alt="Vite logo" />
          <img src="/vite.svg" className="logo vite" alt="Vite logo" />
          <img src="/vite.svg" className="logo vite" alt="Vite logo" />
          <img src="/vite.svg" className="logo vite" alt="Vite logo" />
        </a>
        <a href="https://tauri.app" target="_blank">
          <img src="/tauri.svg" className="logo tauri" alt="Tauri logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <p>Click on the Tauri, Vite, and React logos to learn more.</p>

      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          greet();
          // await hide();
        }}
      >
        <input
          id="greet-input"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <button type="submit">Greet</button>
      </form>

      <p>{greetMsg}</p>
    </div>
  );
}

export default App;
