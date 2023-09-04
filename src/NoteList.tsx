import React from "react";
import { DiCss3, DiJavascript, DiNpm } from "react-icons/di";
import { FaList, FaRegFolder, FaRegFolderOpen } from "react-icons/fa";
import TreeView, { flattenTree } from "react-accessible-treeview";
import "./NoteList.css";
import { log } from "./log";
import {
  IFlatMetadata,
  ITreeNode,
} from "react-accessible-treeview/dist/TreeView/utils";
import { useRecoilState } from "recoil";
import { noteListState } from "./noteListState";
import { getTimeLogs } from "./repository/APIClient";

class Note {
  id: number;
  title: string;
  content: string;
  constructor(id: number, title: string, content: string) {
    this.id = id;
    this.title = title;
    this.content = content;
  }

  // [x: string]: string | number | null | undefined;
}

interface NoteItemViewModel extends IFlatMetadata {
  id: number;
}

const folder: ITreeNode<NoteItemViewModel> = {
  name: "",
  metadata: { id: 0 },
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

const data = flattenTree(folder);
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
  let note = new Note(1, "title", "content");
  // note[extension] = filename;
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
  const [count, setCount] = useRecoilState(noteListState);

  return (
    <div className="note-list">
      <h1>{count}</h1>
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
