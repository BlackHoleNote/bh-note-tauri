import { useCallback, useEffect, useMemo, useRef } from "react";
import { useAppSelector } from "./store/hooks";
import ReactCodeMirror from "@uiw/react-codemirror";
import { vim } from "@replit/codemirror-vim";
import { log } from "./log";
import { useDispatch } from "react-redux";
import { onTimeNoteChange, timeNoteWillStart } from "./store/TimeNotesSlice";
import { TimeLogChanges } from "./Entity/TimeLog";
import {
  createTimeLogsAPI,
  saveTimeLogsAPI,
  timeLogApi,
  useGetAllNotesQuery,
} from "./repository/APIClient";
import { debounce } from "lodash";
import { Note } from "./Entity/Note";
import { type } from "@tauri-apps/api/os";
import { selectedTimeNoteDidCreate } from "./store/NoteListSlice";

export default function TimeLogEditor() {
  let selectedNode = useAppSelector((state) => state.noteList.selectedNode);
  let dispatch = useDispatch();
  const previous = useRef(selectedNode);
  let timeNotes = useAppSelector((state) => state.timeNotes.value);
  const ref = useRef(timeNotes);
  ref.current = timeNotes;
  const selectedNoteRef = useRef(selectedNode);
  selectedNoteRef.current = selectedNode;

  const callback = useMemo(() => {
    if (selectedNode === null) {
      return () => {};
    }
    let isTempCreate = true;
    const isTempType = typeof selectedNode.id === "string";
    if (isTempType) {
      return debounce(async () => {
        if (selectedNoteRef.current == null) {
          return;
        }
        let note: Note = {
          id: selectedNoteRef.current.id,
          title: selectedNoteRef.current.title,
          contents: ref.current,
        };
        if ((note.id ?? 0) === 0 && note.title === "") {
          // TODO: note.title === "" will be deleted
          return;
        }
        if (isTempType && isTempCreate) {
          log({
            object: note,
            customMessage: "debounce timeLogApi.endpoints API will call",
          });
          try {
            isTempCreate = false;
            let data = await createTimeLogsAPI(note);
            dispatch(selectedTimeNoteDidCreate(data));
            log({ object: data, customMessage: "timeLog create success!!!" });
          } catch {
            isTempCreate = true;
          }
        }
      }, 100);
    } else {
      return debounce(async () => {
        if (selectedNoteRef.current == null) {
          return;
        }
        let note: Note = {
          id: selectedNoteRef.current.id,
          title: selectedNoteRef.current.title,
          contents: ref.current,
        };
        if ((note.id ?? 0) === 0 && note.title === "") {
          // TODO: note.title === "" will be deleted
          return;
        }
        log({ object: note, customMessage: "timeLogAPIwillChange" });
        try {
          let data = await saveTimeLogsAPI(note);
          log({ object: data, customMessage: "timeLog save success!!!" });
        } catch {
          isTempCreate = true;
        }
      }, 500);
    }
  }, [selectedNode?.id]);
  callback();
  useEffect(() => {
    if (selectedNode != null) {
      dispatch(timeNoteWillStart(selectedNode));
    }
  }, [selectedNode]);

  // useRef(() => {});
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
                dispatch(
                  onTimeNoteChange({
                    fromA,
                    toA,
                    fromB,
                    toB,
                    isLineBreak: isLineBreaked,
                    value,
                  })
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
