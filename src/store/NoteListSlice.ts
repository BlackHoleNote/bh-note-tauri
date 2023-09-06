import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./app";
import { RootFolder } from "../Entity/Note";
import { log } from "../log";

// Define a type for the slice state
interface noteListState {
  value: number;
}

// Define the initial state using that type
const initialState: noteListState = {
  value: 0,
};

export const noteListSlice = createSlice({
  name: "noteList",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState: [new RootFolder()],
  reducers: {
    addNewFolder: (state) => {
      // log(state);
      console.log(state);
    },
    addNewNote: (state) => {
      // state.addNewNote();
      return;
    },
    // Use the PayloadAction type to declare the contents of `action.payload`
    incrementByAmount: (state, action: PayloadAction<number>) => {
      //   state.value += action.payload;
    },
  },
});

export const { addNewFolder, addNewNote, incrementByAmount } =
  noteListSlice.actions;

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.noteList.value;

// const noteListReducer = noteListSlice.reducer;
export const noteListReducer = noteListSlice.reducer;
