import { JSXElementConstructor, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Token, login } from "./store/AuthSlice";
import { emit, listen } from "@tauri-apps/api/event";
import { log } from "./log";
import { Button, Textarea } from "@material-tailwind/react";
import { host, useAdminTokenQuery } from "./repository/APIClient";

export function LogoutApp() {
  let dispatch = useDispatch();

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

  return (
    <div className="h-screen w-screen flex justify-center">
      {/* <div className=""> */}
      <LogoutButton className="flex items-center" />
      <DebugTool className="" />
      {/* </div> */}
    </div>
  );
}

function DebugTool(props: { className: string }) {
  const [mockToken, setMockToken] = useState("");
  const tokenMock = useRef<HTMLInputElement>(null);
  let dispatch = useDispatch();

  const { data: token } = useAdminTokenQuery();

  useEffect(() => {
    if (token !== undefined) {
      setMockToken(JSON.stringify(token));
    }
  }, [token]);

  return (
    <div className={props.className}>
      <Textarea
        label="JSONDeeplinkJSON"
        form="123"
        value={mockToken}
        onChange={(e) => {
          e.preventDefault();
          setMockToken(e.target.value);
        }}
      />
      <Button
        type="submit"
        size="sm"
        color="red"
        variant="text"
        className="rounded-md"
        onClick={(e) => {
          e.preventDefault();
          let token = JSON.parse(mockToken);
          log({ object: token });
          dispatch(login(token));
        }}
      >
        모킹 로그인
      </Button>
      <button
        onClick={() => {
          dispatch(login({ token: "", refreshToken: "" }));
        }}
      >
        슈퍼로그인
      </button>
      <Button
        type="submit"
        size="sm"
        color="red"
        variant="text"
        className="rounded-md"
        onClick={(e) => {
          e.preventDefault();
        }}
      >
        {" "}
        토큰 생성{" "}
      </Button>
    </div>
  );
}

function LogoutButton(props: { className: string }) {
  log({ object: host + `${import.meta.env}`, customMessage: "hostname" });
  console.log(import.meta);
  useEffect(() => {
    console.log("logoutButton good");
    // console.log(import.meta.env);
  });
  let authUrl = `${host}/oauth2/authorization/google`;
  return (
    <div className={props.className}>
      <a href={authUrl} target="_blank" rel="noopener noreferrer">
        <div className="flex items-center justify-center">
          <Button
            size="lg"
            variant="outlined"
            color="blue-gray"
            className="flex items-center gap-3 px-16"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="shrink-0"
            >
              <g clip-path="url(#clip0_9_516)">
                <path
                  d="M19.8052 10.2304C19.8052 9.55059 19.7501 8.86714 19.6325 8.19839H10.2002V12.0492H15.6016C15.3775 13.2912 14.6573 14.3898 13.6027 15.088V17.5866H16.8252C18.7176 15.8449 19.8052 13.2728 19.8052 10.2304Z"
                  fill="#4285F4"
                ></path>
                <path
                  d="M10.1999 20.0007C12.897 20.0007 15.1714 19.1151 16.8286 17.5866L13.6061 15.0879C12.7096 15.6979 11.5521 16.0433 10.2036 16.0433C7.59474 16.0433 5.38272 14.2832 4.58904 11.9169H1.26367V14.4927C2.96127 17.8695 6.41892 20.0007 10.1999 20.0007V20.0007Z"
                  fill="#34A853"
                ></path>
                <path
                  d="M4.58565 11.9169C4.16676 10.675 4.16676 9.33011 4.58565 8.08814V5.51236H1.26395C-0.154389 8.33801 -0.154389 11.6671 1.26395 14.4927L4.58565 11.9169V11.9169Z"
                  fill="#FBBC04"
                ></path>
                <path
                  d="M10.1999 3.95805C11.6256 3.936 13.0035 4.47247 14.036 5.45722L16.8911 2.60218C15.0833 0.904587 12.6838 -0.0287217 10.1999 0.000673888C6.41892 0.000673888 2.96127 2.13185 1.26367 5.51234L4.58537 8.08813C5.37538 5.71811 7.59107 3.95805 10.1999 3.95805V3.95805Z"
                  fill="#EA4335"
                ></path>
              </g>
              <defs>
                <clipPath id="clip0_9_516">
                  <rect width="20" height="20" fill="white"></rect>
                </clipPath>
              </defs>
            </svg>
            Continue with Google
          </Button>
        </div>
      </a>
    </div>
  );
}
