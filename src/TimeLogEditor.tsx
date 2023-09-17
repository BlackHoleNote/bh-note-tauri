import { useCallback } from "react";
import { useAppSelector } from "./store/hooks";
import ReactCodeMirror from "@uiw/react-codemirror";
import { vim } from "@replit/codemirror-vim";
import { log } from "./log";
import { useDispatch } from "react-redux";
import { TimeLogChanges, onTimeNoteChange } from "./store/TimeNotesSlice";

export default function TimeLogEditor() {
  let selectedNode = useAppSelector((state) => state.noteList.selectedNode);
  let timeNotes = useAppSelector((state) => state.timeNotes.value);
  const onChange = useCallback((value, viewUpdate) => {
    console.log("value:", value);
  }, []);
  return (
    <div>
      {selectedNode == null ? (
        <div>선택된 노드가 없습니다.</div>
      ) : (
        <ReactCodeMirror
          value={timeNotes}
          autoFocus={true}
          height="100vh"
          extensions={[vim()]}
          onChange={(value, viewUpdate) => {
            // log(viewUpdate.changes.iterChangedRanges);
            // console.log(viewUpdate.changes.apply(Text("hello world!"))))))));
            // viewUpdate.c
            viewUpdate.changes.iterChanges(
              (fromA, toA, fromB, toB, inserted) => {
                const isLineBreaked = inserted.iter(-1).next().lineBreak;
                useDispatch(
                  onTimeNoteChange(
                    new TimeLogChanges(
                      fromA,
                      toA,
                      fromB,
                      toB,
                      isLineBreaked,
                      value
                    )
                  )
                );
              }
            );
            // console.log(viewUpdate.changes.desc.newLength);
            // console.log(viewUpdate.transactions);
            // console.log("viewUpdate:", viewUpdate.changes);
          }}
          onStatistics={(value) => {
            // console.log("onStatistics:", value);
          }}
        />
      )}
    </div>
  );
}
