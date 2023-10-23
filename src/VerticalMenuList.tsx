import { useDispatch } from "react-redux";
import { LogoutReason, logout } from "./store/AuthSlice";
import { useSaveNotesMutation } from "./repository/APIClient";
import { log } from "./log";

export default function VerticalMenuList() {
  let dispatch = useDispatch();
  let [_, { isError, isLoading, isSuccess }] = useSaveNotesMutation({
    fixedCacheKey: "server.state",
  });
  log({ object: isError, customMessage: "서버 상태" });
  return (
    <div>
      <h1>TimeLogList</h1>
      <button
        onClick={() => {
          dispatch(logout(LogoutReason.User));
        }}
      >
        logout
      </button>
      {isLoading ? (
        <p>임시저장 진행중</p>
      ) : isError && !isSuccess ? (
        <p color="red">서버 상태 불안정</p>
      ) : (
        <p>서버 상태 좋음</p>
      )}
    </div>
  );
}
