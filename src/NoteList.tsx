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
import { addNewFolder, addNewNote } from "./store/NoteListSlice";
import { increment } from "./store/CounterSlice";

class FileViewModel implements IFlatMetadata {
  constructor(public id: number, public title: string) {}

  [x: string]: string | number | null | undefined;
}

const folderExample: ITreeNode<IFlatMetadata> = {
  name: "",
  metadata: { id: 0, title: "" },
  children: [
    {
      name: "src",
      children: [
        { name: "index.js" },
        { name: "styles.css" },
        { name: "2022-03-20", metadata: { id: 1 } },
      ],
    },
    {
      name: "node_modules",
      children: [
        {
          name: "react-accessible-treeview",
          children: [{ name: "index.js" }],
        },
        { name: "react", children: [{ name: "index.js" }] },
      ],
    },
    {
      name: ".npmignore",
    },
    {
      name: "package.json",
    },
    {
      name: "webpack.config.js",
    },
  ],
};

const data = flattenTree(folderExample);

class FileVisitorImpl implements FileVisitor<ITreeNode<FileViewModel>> {
  node: ITreeNode<FileViewModel> = { name: "" };

  visitFolder(folder: Folder): ITreeNode<FileViewModel> {
    const children = folder.childs.map((note) => {
      return this.visitFile(note);
    });

    return this.visitFile(folder, children);
  }

  visitNote(note: Note): ITreeNode<FileViewModel> {
    return this.visitFile(note);
  }

  visitFile(
    file: File,
    children: ITreeNode<FileViewModel>[] = []
  ): ITreeNode<FileViewModel> {
    return {
      id: file.id,
      name: file.title,
      metadata: new FileViewModel(file.id, file.title),
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
  const rootNote = useAppSelector((state) => state.noteList);
  const dispatch = useAppDispatch();

  const data = makeData(rootNote[0]);

  return (
    <div className="note-list">
      <h1>{count}</h1>
      <div className="flex justify-end">
        <button onClick={() => dispatch(increment())}>
          <GoFileDirectory clasName="icon" />
        </button>
        <button onClick={() => dispatch(addNewNote())}>
          <GoFile className="icon" />
        </button>
      </div>

      <div className="directory">
        <TreeView
          data={data}
          aria-label="directory tree"
          onSelect={async (node) => {
            if (node.isSelected) {
              if (node.element.metadata?.id == 1) {
                log(JSON.stringify(await getTimeLogs()));
              } else {
                log(node.element.metadata?.id?.toString() ?? "no metadata");
              }
            } else {
              // MARK: - deselect도 같이 출력됨
            }
          }}
          nodeRenderer={({
            element,
            isBranch,
            isExpanded,
            getNodeProps,
            level,
          }) => (
            <div {...getNodeProps()} style={{ paddingLeft: 20 * (level - 1) }}>
              {isBranch ? (
                <FolderIcon isOpen={isExpanded} />
              ) : (
                <FileIcon filename={element.name} />
              )}
              {element.name}
            </div>
          )}
        />
      </div>
    </div>
  );
}
