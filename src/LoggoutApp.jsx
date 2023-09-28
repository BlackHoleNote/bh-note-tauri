// const { useDispatch } = require("react-redux");
// const { LoginSocialGithub } = require("reactjs-social-login");
// import { listen } from "@tauri-apps/api/event";
// import { useEffect } from "react";
// import {
//   FacebookLoginButton,
//   GoogleLoginButton,
//   GithubLoginButton,
//   AmazonLoginButton,
//   InstagramLoginButton,
//   LinkedInLoginButton,
//   MicrosoftLoginButton,
//   TwitterLoginButton,
//   AppleLoginButton,
// } from "react-social-login-buttons";

// export default function LogoutApp() {
//   const dispatch = useDispatch();
//   useEffect(async () => {
//     const unlisten = await listen("error", (event: stri) => {
//       console.log(
//         `Got error in window ${event.windowLabel}, payload: ${event.payload}`
//       );
//     });

//     // you need to call unlisten if your handler goes out of scope e.g. the component is unmounted
//     unlisten();
//   }, []);
//   return (
//     <>
//       <button
//         onClick={(e) => {
//           e.preventDefault();
//           dispatch(login());
//         }}
//       >
//         로그인 해주세요
//       </button>
//       <LoginSocialGithub
//         isOnlyGetToken
//         client_id={process.env.REACT_APP_GITHUB_APP_ID || ""}
//         client_secret={process.env.REACT_APP_GITHUB_APP_SECRET || ""}
//         redirect_uri={REDIRECT_URI}
//         onLoginStart={onLoginStart}
//         onResolve={({ provider, data }) => {
//           setProvider(provider);
//           setProfile(data);
//         }}
//         onReject={(err) => {
//           console.log(err);
//         }}
//       >
//         <GithubLoginButton />
//       </LoginSocialGithub>
//     </>
//   );
// }
