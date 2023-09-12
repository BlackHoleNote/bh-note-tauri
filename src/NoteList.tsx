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
  const dispatch = useAppDispatch();
  const data = makeData(rootNote);
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

      <div className="directory">
        <TreeView
          data={data}
          aria-label="directory tree"
          onSelect={async (node) => {
            let fileViewModel = node.element.metadata as FileViewModel;
            if (fileViewModel != undefined) {
              // fileViewModel.id;
              if (node.isSelected) {
                dispatch(selectNode(node.element as INode<FileViewModel>));
              }

              log(fileViewModel, "😄 Selected");
            } else {
              log(node, "🙀 Selected target undefined");
            }
            // if (node.isSelected) {
            //   log(node, "🙀 isSelected");
            //   // if (node.element.metadata?.id == 1) {
            //   //   log(JSON.stringify(await getTimeLogs()));
            //   // } else {
            //   //   log(node.element.metadata?.id?.toString() ?? "no metadata");
            //   // }
            // } else {
            //   // MARK: - deselect도 같이 출력됨
            // }
          }}
          nodeRenderer={({
            element,
            isBranch,
            isExpanded,
            getNodeProps,
            level,
          }) => (
            // style={{ paddingLeft: 20 * (level - 1) }}
            <div {...getNodeProps()} style={{ paddingLeft: 12 * (level - 1) }}>
              {isBranch ? (
                <FolderIcon isOpen={isExpanded} />
              ) : (
                <FileIcon filename={element.name} />
              )}
              <p>{element.name}</p>
            </div>
          )}
        />
      </div>
    </div>
  );
}
