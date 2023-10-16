import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import "./index.css";
import { hide } from "@tauri-apps/api/app";
import Split from "react-split";
import { emit, listen } from "@tauri-apps/api/event";
import NoteList from "./NoteList";
import VerticalMenuList from "./VerticalMenuList";
import TimeLogEditor from "./TimeLogEditor";
import { log } from "./log";
import { login, myAuth } from "./store/AuthSlice";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { LogoutApp } from "./LogoutApp";
// import { LogoutApp } from "/src/LogoutApp.jsx";

function initResizer() {
  // const rightSide = resizer!.
  log({ object: "resizer init" });
  const mouseDownHandler = (target: HTMLElement) => (e: MouseEvent) => {
    let initialX = e.clientX;
    let initialY = e.clientY;
    let leftSide: HTMLElement =
      target.previousElementSibling as unknown as HTMLElement;
    let rightSide: HTMLElement =
      target.nextElementSibling as unknown as HTMLElement;
    let leftWidth = leftSide.getBoundingClientRect().width;
    let rightWidth = rightSide.getBoundingClientRect().width;

    const mouseMoveHandler = (e: MouseEvent) => {
      const dx = e.clientX - initialX;
      const dy = e.clientY - initialY;
      document.body.style.cursor = "col-resize";

      leftSide.style.userSelect = "none";
      leftSide.style.pointerEvents = "none";

      rightSide.style.userSelect = "none";
      rightSide.style.pointerEvents = "none";

      leftSide.style.width = `${dx + leftWidth}px`;
      rightSide.style.width = `${rightWidth - dx}px`;
    };

    const mouseUpHandler = (e: MouseEvent) => {
      // 모든 커서 관련 사항은 마우스 이동이 끝나면 제거됨
      target.style.removeProperty("cursor");
      document.body.style.removeProperty("cursor");

      leftSide.style.removeProperty("user-select");
      leftSide.style.removeProperty("pointer-events");

      rightSide.style.removeProperty("user-select");
      rightSide.style.removeProperty("pointer-events");

      // 등록한 마우스 이벤트를 제거
      document.removeEventListener("mousemove", mouseMoveHandler);
      document.removeEventListener("mouseup", mouseUpHandler);
    };
    document.addEventListener("mousemove", mouseMoveHandler);
    document.addEventListener("mouseup", mouseUpHandler);
  };

  let resizers = document.getElementsByClassName("divider");
  [...resizers].map((resizer) => {
    let divider = resizer as unknown as HTMLElement;
    divider.addEventListener(
      "mousedown",
      mouseDownHandler(resizer as HTMLElement)
    );
  });
}

function LoginApp() {
  return (
    <div className="main">
      <div className="split-view hbox">
        <div className="splitContainer container1 w-[40] bg-[#eeeeee]"></div>
        <VerticalMenuList />
        <div className="divider w-[3px]"></div>
        <div className="splitContainer container2 bg-[#eeeeee]">
          <NoteList />
          {/* <p>준</p>
        <p>비</p>
        <p>중</p> */}
          {/* <NoteList noteListPresentationService={container.resolve(NoteListPresentationService)}/> */}
        </div>
        <div className="divider w-[3px]"></div>
        <div className="splitContainer container3 bg-[#dcd2d2] grow">
          <TimeLogEditor />
          {/* <NoteEditorView noteService={container.resolve(NoteService)}/> */}
        </div>
      </div>
    </div>
  );
}
function App() {
  const [name, setName] = useState("");
  const [user, setUser] = useState(null);

  const auth = useSelector(myAuth);

  useEffect(() => {
    return () => {};
  }, []);

  return (
    <>
      {auth ? <LoginApp /> : <LogoutApp />}
      <div>log</div>
    </>
  );
}

export default App;
