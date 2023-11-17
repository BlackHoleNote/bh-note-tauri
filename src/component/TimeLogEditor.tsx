import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAppSelector } from "../store/hooks";
import ReactCodeMirror, {
  EditorView,
  Extension,
  useCodeMirror,
} from "@uiw/react-codemirror";
import { CodeMirror, Vim, getCM, vim } from "@replit/codemirror-vim";
import { log } from "../utils/log";
import { useDispatch } from "react-redux";
import {
  TimeNotesState,
  onTimeNoteChange,
  timeNoteWillStart,
} from "../store/TimeNotesSlice";
import { TimeLogChanges } from "../Entity/TimeLog";
import {
  timeLogApi,
  useCreateNotesMutation,
  useGetAllNotesQuery,
  useGetNoteQuery,
  useSaveNotesMutation,
} from "../repository/APIClient";
import { debounce } from "lodash";
import { Note } from "../Entity/Note";
import { type } from "@tauri-apps/api/os";
import {
  selectedTimeNoteDidCreate,
  timeNoteDidChanged,
  updateNoteVersion,
} from "../store/NoteListSlice";
import { time, timeLog } from "console";

export default function TimeLogEditor() {
  let selectedNode = useAppSelector((state) => state.noteList.selectedNode);
  let dispatch = useDispatch();
  const previous = useRef(selectedNode);
  let timeNotes = useAppSelector(
    (state) => (state.timeNotes as TimeNotesState).value
  );
  const ref = useRef(timeNotes);

  const selectedNoteRef = useRef(selectedNode);
  selectedNoteRef.current = selectedNode;
  const [createNote, {}] = useCreateNotesMutation();
  const [trigger, { data }, _] = timeLogApi.useLazyGetNoteQuery();

  useEffect(() => {
    log({ object: data, customMessage: "Custom Hook Note Will Change!!!!!" });
    if (data !== undefined) {
      dispatch(timeNoteDidChanged(data));
    }
  }, [data?.version, data?.id]);

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
            log({ object: data, customMessage: "timeLog create success!!!" });
            dispatch(selectedTimeNoteDidCreate(data));
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
          version: selectedNoteRef.current.version,
          contents: ref.current,
        };
        if ((note.id ?? 0) === 0 && note.title === "") {
          // TODO: note.title === "" will be deleted
          return;
        }
        log({ object: note, customMessage: "timeLogAPIwillChange" });
        // log({object: status});
        try {
          let data = await saveNoteApi(note).unwrap();
          dispatch(updateNoteVersion(data));
          log({ object: data, customMessage: "timeLog save success!!!" });
        } catch (e) {
          // setResync(true);
          log({ object: e, customMessage: "저장실패!!!" });
        }
      }, 1000);
    }
  }, [selectedNode?.id]);

  if (ref.current !== timeNotes) {
    ref.current = timeNotes;
    callback();
  }

  useEffect(() => {
    if (selectedNode !== null) {
      dispatch(timeNoteWillStart(selectedNode));
    }

    let id = selectedNode?.id;
    if (id === undefined) {
      return;
    }
    if (typeof id === "string") {
      return;
    }
    trigger(id);
  }, [selectedNode?.id]);

  return (
    <div>
      {selectedNode == null ? (
        <div>선택된 노드가 없습니다.</div>
      ) : (
        <ReactCodeMirror
          value={timeNotes}
          autoFocus={true}
          height="100vh"
          extensions={[
            EditorView.lineWrapping,
            vim({ status: true }),
            EditorView.inputHandler.of((view, from, to, text) => {
              console.log(getCM(view), from, to, text, "command");

              return false;
            }),
          ]}
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
