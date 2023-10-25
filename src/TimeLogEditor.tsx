import { useCallback, useEffect, useMemo, useRef } from "react";
import { useAppSelector } from "./store/hooks";
import ReactCodeMirror, {
  Extension,
  useCodeMirror,
} from "@uiw/react-codemirror";
import { CodeMirror, Vim, vim } from "@replit/codemirror-vim";
import { log } from "./log";
import { useDispatch } from "react-redux";
import { onTimeNoteChange, timeNoteWillStart } from "./store/TimeNotesSlice";
import { TimeLogChanges } from "./Entity/TimeLog";
import {
  timeLogApi,
  useCreateNotesMutation,
  useGetAllNotesQuery,
  useSaveNotesMutation,
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

  const selectedNoteRef = useRef(selectedNode);
  selectedNoteRef.current = selectedNode;
  const [createNote, {}] = useCreateNotesMutation();
  const [saveNoteApi, { status }] = useSaveNotesMutation({
    fixedCacheKey: "server.state",
  });

  // useEffect(() => {
  //   useCodeMirror({});
  //   CodeMirror.vimKey(e);
  //   CodeMirror.on(editor, "vim-keypress", function (key) {
  //     keys = keys + key;
  //     commandDisplay.innerHTML = keys;
  //   });
  //   CodeMirror.on(editor, "vim-command-done", function (e) {
  //     keys = "";
  //     commandDisplay.innerHTML = keys;
  //   });
  // }, []);

  const callback = useMemo(() => {
    log({ object: "call!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!" });
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
            let data = await createNote(note).unwrap();
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
        // log({object: status});
        try {
          let data = await saveNoteApi(note);
          log({ object: data, customMessage: "timeLog save success!!!" });
        } catch {
          isTempCreate = true;
        }
      }, 1000);
    }
  }, [selectedNode?.id]);
  if (ref.current !== timeNotes) {
    ref.current = timeNotes;
    callback();
  }
  useEffect(() => {
    if (selectedNode != null) {
      dispatch(timeNoteWillStart(selectedNode));
    }
  }, [selectedNode]);

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
            const lineAt = (pos: number) => {
              console.log(
                `doc: ${pos} ${viewUpdate.state.doc.lineAt(pos).number}`
              );
              return viewUpdate.state.doc.lineAt(pos).text;
            };
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
                    lineBeforeB: lineAt(fromB - 1),
                  })
                );
              }
            );
          }}
          onStatistics={(value) => {
            // console.log("onStatistics:", value);
          }}
        />
      )}
    </div>
  );
}
