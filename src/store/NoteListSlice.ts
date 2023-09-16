import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./app";
import { FileVisitor, Folder, Note, RootFolder } from "../Entity/Note";
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
  selectedNode: Note | null;
  root: Note[];
}

// Root는 트리를 만드는데 사용되지 않는다.
const initialState: NoteListState = {
  selectedNode: null,
  root: [],
};

function createNewFolder(title: string): Folder {
  return {
    id: _.random(1000, 100000),
    title: `${title}`,
    childs: [],
  };
}

function createNewFolder2(state: NoteListState) {
  // if (state.selectedNode == null) {
  //   state.root.childs.push(createNewFolder("/"));
  // } else {
  state.root.push(createNewFolder("Untitled"));
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

    selectNode: (state, action: PayloadAction<Note>) => {
      log(action.payload, "note selected");
      state.selectedNode = action.payload;
    },
  },
});

export const { addNewFolder, addNewNote, incrementByAmount, selectNode } =
  noteListSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state.noteList.root;

// const noteListReducer = noteListSlice.reducer;
export const noteListReducer = noteListSlice.reducer;
