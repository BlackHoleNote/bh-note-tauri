import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { login } from "./store/AuthSlice";
import { listen } from "@tauri-apps/api/event";
import { log } from "./log";

export function LogoutApp() {
  // let params = {
  //   client_id: "2118f23d195c18bff64c",
  //   scope: "user",
  // };
  // const queryString = new URLSearchParams(params).toString();
  let authUrl = `http://localhost:8080/oauth2/authorization/google`;
  let dispatch = useDispatch();

  useEffect(() => {
    let unlisten = () => {};
    async function viewDidLoad() {
      unlisten = await listen<string>("login/jwt", (event) => {
        log({
          object: event.payload,
          customMessage: "jwt 그로그인",
          logLevel: "debug",
        });
      });
    }
    viewDidLoad();
    return unlisten();
  }, []);

  return (
    <>
      <a
        className="w-40"
        href={authUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        <button onClick={() => {}}>구글 로그인</button>
      </a>
      <button
        onClick={() => {
          dispatch(login({ id: 0 }));
        }}
      >
        슈퍼로그인
      </button>
    </>
  );
}
