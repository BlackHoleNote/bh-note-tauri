import React from "react";
import { DiCss3, DiJavascript, DiNpm } from "react-icons/di";
import { FaList, FaRegFolder, FaRegFolderOpen } from "react-icons/fa";
import { GoFile, GoFileDirectory } from "react-icons/go";
import TreeView, { INode, flattenTree } from "react-accessible-treeview";
import "./NoteList.css";
import { log } from "./log";
import {
  IFlatMetadata,
  ITreeNode,
} from "react-accessible-treeview/dist/TreeView/utils";
import { getTimeLogs } from "./repository/APIClient";
import { File, FileVisitor, Folder, Note, RootFolder } from "./Entity/Note";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import {
  FileViewModel,
  addNewFolder,
  addNewNote,
  selectNode,
} from "./store/NoteListSlice";
import { increment } from "./store/CounterSlice";
import { event } from "@tauri-apps/api";

class FileVisitorImpl implements FileVisitor<ITreeNode<FileViewModel>> {
  node: ITreeNode<FileViewModel> = { name: "" };

  visitFolder(folder: Folder): ITreeNode<FileViewModel> {
    const children = folder.childs.map((note) => {
      return this.visitFile(note);
    });

    return this.makeFile(folder, children);
  }

  visitNote(note: Note): ITreeNode<FileViewModel> {
    return this.makeFile(note);
  }

  visitFile(file: File): ITreeNode<FileViewModel> {
    if ((file as Folder).childs != undefined)
      return this.visitFolder(file as Folder);
    return this.makeFile(file);
  }

  makeFile(
    file: File,
    children: ITreeNode<FileViewModel>[] = []
  ): ITreeNode<FileViewModel> {
    return {
      id: file.id,
      name: file.title,
      metadata: new FileViewModel(file?.id ?? 0, file.title),
      children: children,
    };
  }
}

function makeData(viewModel: Folder): INode<FileViewModel>[] {
  const visitor = new FileVisitorImpl();

  return flattenTree(visitor.visitFolder(viewModel));
}
interface FolderIconProps {
  isOpen: boolean;
}

const FolderIcon: React.FC<FolderIconProps> = ({ isOpen }) =>
  isOpen ? (
    <FaRegFolderOpen color="e8a87c" className="icon" />
  ) : (
    <FaRegFolder color="e8a87c" className="icon" />
  );

interface FileIconProps {
  filename: string;
}

const FileIcon: React.FC<FileIconProps> = ({ filename }) => {
  const extension = filename.slice(filename.lastIndexOf(".") + 1);
  switch (extension) {
    case "js":
      return <DiJavascript color="yellow" className="icon" />;
    case "css":
      return <DiCss3 color="turquoise" className="icon" />;
    case "json":
      return <FaList color="yellow" className="icon" />;
    case "npmignore":
      return <DiNpm color="red" className="icon" />;
    default:
      return null;
  }
};

export default function NoteList() {
  const count = useAppSelector((state) => state.counter.value);
  const rootNote = useAppSelector((state) => state.noteList.root);
  const selectedNode = useAppSelector((state) => state.noteList.selectedNode);
  const dispatch = useAppDispatch();
  return (
    <div className="note-list">
      <h1>{count}</h1>
      <div className="flex justify-end">
        <button onClick={() => dispatch(addNewFolder())}>
          <GoFileDirectory clasName="icon" />
        </button>
        <button onClick={() => dispatch(increment())}>
          <GoFile className="icon" />
        </button>
      </div>

      <ul className="w-48 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
        {rootNote.map((element) => {
          return (
            <button
              type="button"
              onClick={(target) => {
                target.currentTarget.focus();
                dispatch(selectNode(element));
              }}
              className={
                selectedNode?.id == element?.id
                  ? "bg-cyan-400"
                  : "" +
                    "w-full px-4 py-2 font-medium text-left border-b border-gray-200 cursor-pointer hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white"
              }
            >
              {element.title}
            </button>
          );
        })}
        {/* <li className="w-full px-4 py-2 border-b border-gray-200 rounded-t-lg dark:border-gray-600">
          Profile
        </li>
        <li className="w-full px-4 py-2 border-b border-gray-200 dark:border-gray-600">
          Settings
        </li>
        <li className="w-full px-4 py-2 border-b border-gray-200 dark:border-gray-600">
          Messages
        </li>
        <li className="w-full px-4 py-2 rounded-b-lg">Download</li> */}
      </ul>
    </div>
  );
}
