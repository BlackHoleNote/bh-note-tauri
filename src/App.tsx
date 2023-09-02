import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import { hide } from "@tauri-apps/api/app";
import Split from "react-split";


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
    // <div className="container">
    //   <h1>Welcome to Tauri!</h1>

    //   {/* <SplitPane split="vertical">
    //     <Pane initialSize="200px">You can use a Pane component</Pane>
    //     <div>or you can use a plain old div</div>
    //     <Pane initialSize="25%" minSize="10%" maxSize="500px">
    //       Using a Pane allows you to specify any constraints directly
    //     </Pane>
    //   </SplitPane>; */}
    //   <Split
    //       sizes={[25, 75]}
    //       minSize={100}
    //       expandToMin={false}
    //       gutterSize={10}
    //       gutterAlign="center"
    //       snapOffset={30}
    //       dragInterval={1}
    //       direction="vertical"
    //       cursor="col-resize"
    //   >
    //       <img src="/vite.svg" className="logo vite" alt="Vite logo" />
    //       <a href="https://tauri.app" target="_blank">
    //         <img src="/tauri.svg" className="logo tauri" alt="Tauri logo" />
    //       </a>
    //       <img src={reactLogo} className="logo react" alt="React logo" />
    //   </Split>

    //   <p>Click on the Tauri, Vite, and React logos to learn more.</p>

    //   <form
    //     className="row"
    //     onSubmit={(e) => {
    //       e.preventDefault();
    //       greet();
    //       // await hide();
    //     }}
    //   >
    //     <input
    //       id="greet-input"
    //       onChange={(e) => setName(e.currentTarget.value)}
    //       placeholder="Enter a name..."
    //     />
    //     <button type="submit">Greet</button>
    //   </form>

    //   <p>{greetMsg}</p>
    // </div>
    <div className="main">
      <div className="split-view hbox">
        <div className="splitContainer container1 w-40 bg(#fff8d3)">
            <p className="w-40">준</p>
            <p>비</p>
            <p>중</p>
            <h1 className="text-3xl font-bold underline">
              Hello word!
            </h1>
        </div>
        <div className="divider"></div>
        <div className="splitContainer container2 bg(#ffffec)">
            <p>준</p>
            <p>비</p>
            <p>중</p>
            {/* <NoteList noteListPresentationService={container.resolve(NoteListPresentationService)}/> */}
        </div>
        <div className="divider 2"></div>
        <div className="splitContainer container3 bg(#f3f3f3) flex-grow(1)">
            {/* <NoteEditorView noteService={container.resolve(NoteService)}/> */}
        </div>
      </div>
    </div>
  );
}

export default App;
