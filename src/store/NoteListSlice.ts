import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { store, type RootState } from "./app";
import { Note, SaveNoteDTO } from "../Entity/Note";
import _, { uniqueId } from "lodash";
import { LogoutReason, logout } from "./AuthSlice";
import { log } from "../utils/log";
import { timeLogApi } from "../repository/APIClient";

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

function createNewNote(title: string): Note {
  let id = uniqueId("TEMP_");
  return {
    id: id,
    title: `${new Date().toLocaleDateString()}`,
    contents: "",
  };
}

function createNewFolder2(state: NoteListState) {
  state.root = [createNewNote("Untitled")].concat(state.root);
}

function timeLogDidChanged(state: NoteListState, note: Note) {
  let index = state.root.findIndex((_note) => _note.id === note.id);
  if (index !== -1) {
    state.root[index] = note;
  }
}

export const noteListSlice = createSlice({
  name: "noteList",
  initialState: initialState,
  reducers: {
    addNewNotes: (state) => {
      createNewFolder2(state);
    },

    addNewNote: (state) => {},

    loadNotes: (state, action: PayloadAction<Note[]>) => {
      const notes = action.payload;
      state.root = notes;
    },
    // Use the PayloadAction type to declare the contents of `action.payload`
    incrementByAmount: (state, action: PayloadAction<number>) => {
      //   state.value += action.payload;
    },

    selectNode: (state, action: PayloadAction<Note>) => {
      let index = state.root.findIndex((note) => note.id === action.payload.id);
      if (index !== -1) {
        console.log(selectNode);
        state.selectedNode = state.root[index];
      }
    },

    timeNoteDidChanged: (state, action: PayloadAction<Note>) => {
      timeLogDidChanged(state, action.payload);
    },

    selectedTimeNoteDidCreate: (state, action: PayloadAction<SaveNoteDTO>) => {
      let index = state.root.findIndex(
        (note) => note.id === action.payload.tempId
      );
      if (index !== -1) {
        state.root[index].id = action.payload.id;
      }
      if (state.selectedNode !== null) {
        if (state.selectedNode.id === action.payload.tempId) {
          state.selectedNode.id = action.payload.id;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logout, (state, action: PayloadAction<LogoutReason>) => {
      state.root = [];
      log({ object: state.root, customMessage: "root 제거 완료" });
      console.log("root 제거");
      state.selectedNode = null;
    });
    builder.addMatcher(
      timeLogApi.endpoints.saveNotes.matchPending,
      (state, action) => {
        timeLogDidChanged(state, action.meta.arg.originalArgs);
      }
    );
  },
});

export const {
  addNewNotes,
  addNewNote,
  incrementByAmount,
  selectNode,
  loadNotes,
  selectedTimeNoteDidCreate,
  timeNoteDidChanged,
} = noteListSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state.noteList.root;

// const noteListReducer = noteListSlice.reducer;
export const noteListReducer = noteListSlice.reducer;
