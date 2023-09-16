import { useCallback } from "react";
import { useAppSelector } from "./store/hooks";
import ReactCodeMirror from "@uiw/react-codemirror";
import { vim } from "@replit/codemirror-vim";
import { log } from "./log";

export default function TimeLogEditor() {
  let selectedNode = useAppSelector((state) => state.noteList.selectedNode);
  const onChange = useCallback((value, viewUpdate) => {
    console.log("value:", value);
  }, []);
  return (
    <div>
      {selectedNode == null ? (
        <div>선택된 노드가 없습니다.</div>
      ) : (
        <ReactCodeMirror
          value="console.log('hello world!');"
          height="100vh"
          extensions={[vim()]}
          onChange={(value, viewUpdate) => {
            // log(viewUpdate.changes.iterChangedRanges);
            // console.log(viewUpdate.changes.apply(Text("hello world!"))))))));
            // viewUpdate.c
            viewUpdate.changes.iterChanges(
              (fromA, toA, fromB, toB, inserted) => {
                const isLineBreak = inserted.iter(-1).next().lineBreak;
                const isInserted = fromA == toA && fromB < toB && isLineBreak;
                if (isInserted) {
                  const target = value.slice(fromB - 3, fromB);
                  if (target === "===") {
                    console.log("new timeLog!");
                  }
                }
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
