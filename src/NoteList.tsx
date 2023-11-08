import React, { useEffect, useState } from "react";
import { DiCss3, DiJavascript, DiNpm } from "react-icons/di";
import { FaList, FaRegFolder, FaRegFolderOpen } from "react-icons/fa";
import { GoFile, GoFileDirectory } from "react-icons/go";
import "./NoteList.css";
import { log } from "./log";
import { useGetAllNotesQuery } from "./repository/APIClient";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { addNewNotes, loadNotes, selectNode } from "./store/NoteListSlice";
import { IconButton } from "@material-tailwind/react";

export default function NoteList() {
  const count = useAppSelector((state) => state.counter.value);
  const rootNote = useAppSelector((state) => state.noteList.root);
  const selectedNode = useAppSelector((state) => state.noteList.selectedNode);
  const { data } = useGetAllNotesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    log({ object: data, customMessage: "data will changed: " });
    if ((data ?? []).length > 0) {
      dispatch(loadNotes(data!));
    }
  }, [data]);

  const dispatch = useAppDispatch();
  return (
    <div className="note-list">
      <div className="flex justify-between">
        <p className="self-center">목록</p>
        <IconButton
          color="amber"
          className=""
          onClick={() => dispatch(addNewNotes())}
        >
          <GoFile clasName="icon" />
        </IconButton>
      </div>

      <ul className="w-48 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
        {(rootNote ?? []).map((element) => {
          return (
            <button
              type="button"
              onClick={(target) => {
                target.currentTarget.focus();
                dispatch(selectNode(element));
              }}
              className={
                (selectedNode?.id == element?.id ? "bg-cyan-400 " : "") +
                "w-full shadow-none font-medium text-left border-gray-200 cursor-pointer hover:bg-gray-100 hover:text-blue-700 focus:ring-2 focus:outline-none dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white "
              }
            >
              {element.title}
            </button>
          );
        })}
      </ul>
    </div>
  );
}
