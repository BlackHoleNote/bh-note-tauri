import { useDispatch } from "react-redux";
import { LogoutReason, logout } from "../store/AuthSlice";
import { useSaveNotesMutation } from "../repository/APIClient";
import { log } from "../utils/log";
import { Button } from "@material-tailwind/react";
import { useAppSelector } from "../store/hooks";

export default function VerticalMenuList() {
  let dispatch = useDispatch();
  let [_, { isError, isLoading, isSuccess }] = useSaveNotesMutation({
    fixedCacheKey: "server.state",
  });
  return (
    <div className="wt=">
      <p>TimeLogList</p>
      <Button
        size="sm"
        onClick={() => {
          dispatch(logout(LogoutReason.User));
        }}
      >
        logout
      </Button>
      {isLoading ? (
        // <p>임시저장 진행중</p>
        <></>
      ) : isError && !isSuccess ? (
        <p color="red">서버 상태 불안정</p>
      ) : (
        // <p>서버 상태 좋음</p>
        <></>
      )}
    </div>
  );
}
