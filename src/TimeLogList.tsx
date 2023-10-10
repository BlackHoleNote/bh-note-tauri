import { useDispatch } from "react-redux";
import { Reason, logout } from "./store/AuthSlice";

export default function TimeLogList() {
  let dispatch = useDispatch();
  return (
    <div>
      <h1>TimeLogList</h1>
      <button
        onClick={() => {
          dispatch(logout(Reason.User));
        }}
      >
        logout
      </button>
    </div>
  );
}
