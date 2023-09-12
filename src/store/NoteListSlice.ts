import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./app";
import { FileVisitor, Folder, RootFolder } from "../Entity/Note";
import { log } from "../log";
import { combineReducers } from "redux";
import { counterReducer } from "./CounterSlice";
import _, { random } from "lodash";
import { INode } from "react-accessible-treeview";
import { IFlatMetadata } from "react-accessible-treeview/dist/TreeView/utils";

export class FileViewModel implements IFlatMetadata {
  constructor(public id: number, public title: string) {}

  [x: string]: string | number | null | undefined;
}

// Define a type for the slice state
interface NoteListState {
  selectedNode: INode<FileViewModel> | null;
  root: RootFolder;
}

// Root는 트리를 만드는데 사용되지 않는다.
const initialState: NoteListState = {
  selectedNode: null,
  root: {
    id: 10002,
    title: "/",
    childs: [
      {
        id: 1000,
        title: "testfile",
      },
    ],
  },
};

function createNewFolder(title: string): Folder {
  return {
    id: _.random(1000, 100000),
    title: `${title}새 폴더/`,
    childs: [],
  };
}

function createNewFolder2(state: NoteListState) {
  // if (state.selectedNode == null) {
  //   state.root.childs.push(createNewFolder("/"));
  // } else {
  let title = state.selectedNode?.metadata?.title ?? "/";
  traverse(title, state.root);
  // }
}

function traverse(title: string, node: Folder): boolean {
  log(`${title}, ${JSON.stringify(node)}`, "traverseV2");
  if (node.title == title) {
    node.childs.push(createNewFolder(title));
    log(node.childs, "traverseV2 found");
    return true;
  } else {
    for (let child of node.childs ?? []) {
      let folder = child as Folder;
      if (traverse(title, folder)) {
        return false;
      }
    }
  }
  return false;
}

export const noteListSlice = createSlice({
  name: "noteList",
  initialState: initialState,
  reducers: {
    addNewFolder: (state) => {
      createNewFolder2(state);
      log(state, "👿 before rendering");
    },

    addNewNote: (state) => {},
    // Use the PayloadAction type to declare the contents of `action.payload`
    incrementByAmount: (state, action: PayloadAction<number>) => {
      //   state.value += action.payload;
    },

    selectNode: (state, action: PayloadAction<INode<FileViewModel>>) => {
      log(action.payload, "ssssssssss");
    },
  },
});

export const { addNewFolder, addNewNote, incrementByAmount, selectNode } =
  noteListSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state.noteList.root;

// const noteListReducer = noteListSlice.reducer;
export const noteListReducer = noteListSlice.reducer;
