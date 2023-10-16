import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Token, login } from "./store/AuthSlice";
import { emit, listen } from "@tauri-apps/api/event";
import { log } from "./log";
import { Button, Textarea } from "@material-tailwind/react";
import { useAdminTokenQuery } from "./repository/APIClient";

export function LogoutApp() {
  // let params = {
  //   client_id: "2118f23d195c18bff64c",
  //   scope: "user",
  // };
  // const queryString = new URLSearchParams(params).toString();
  let authUrl = `http://localhost:8080/oauth2/authorization/google`;
  let dispatch = useDispatch();
  let [string, setString] = useState("");
  const [mockToken, setMockToken] = useState("");
  const { data: token } = useAdminTokenQuery();
  const tokenMock = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let unlisten = () => {};
    async function viewDidLoad() {
      unlisten = await listen<Token>("login/jwt", (event) => {
        log({
          object: event.payload,
          customMessage: "jwt 그로그인2",
          logLevel: "debug",
        });
        dispatch(login(event.payload));
      });
    }
    viewDidLoad();
    return unlisten();
  }, []);

  useEffect(() => {
    if (token !== undefined) {
      setMockToken(JSON.stringify(token));
    }
  }, [token])

  const handleTextareaSubmit = (event: React.FormEvent<HTMLInputElement>) => {
    event.preventDefault();
    console.log('Textarea value:'); // Handle the textarea value
  };

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
          dispatch(login({ token: "", refreshToken: "" }));
        }}
      >
        슈퍼로그인
      </button>
      <Textarea label="JSONDeeplinkJSON" form="123" value={mockToken} onChange={(e) => { e.preventDefault(); setMockToken(e.target.value); }}/>
      <Button type="submit" size="sm" color="red" variant="text" className="rounded-md" onClick={(e) => {
        e.preventDefault();
        let token = JSON.parse(mockToken);
        log({ object: token });
        dispatch(login(token));
      }}>목 딥링크 </Button>
      <Button type="submit" size="sm" color="red" variant="text" className="rounded-md" onClick={(e) => {
        e.preventDefault();
      }}> 토큰 생성 </Button>
    </>
  );
}
