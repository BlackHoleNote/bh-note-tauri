import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./app";

// Define a type for the slice state
interface TimeNotesState {
  value: string;
}

// Define the initial state using that type
const initialState: TimeNotesState = {
  value: "===\ntest\n",
};

export class TimeLogChanges {
  constructor(
    public fromA: number,
    public toA: number,
    public fromB: number,
    public toB: number,
    public isLineBreak: boolean,
    public value: string
  ) {}
}
// (fromA, toA, fromB, toB, inserted)

export const timeNotesSlice = createSlice({
  name: "timeNotesSlice",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    onTimeNoteChange: (state, action: PayloadAction<TimeLogChanges>) => {
      let { fromA, toA, fromB, toB, isLineBreak, value } = action.payload;
      const isInserted = fromA == toA && fromB < toB && isLineBreak;
      if (isInserted) {
        const target = value.slice(fromB - 3, fromB);
        if (target === "===") {
          value += "test\n";
        }
      }
      console.log("value changed", value);
      state.value = value;
    },
    // increment: (state) => {
    //   state.value += 1;
    // },
    // decrement: (state) => {
    //   state.value -= 1;
    // },
    // // Use the PayloadAction type to declare the contents of `action.payload`
    // incrementByAmount: (state, action: PayloadAction<number>) => {
    //   state.value += action.payload;
    // },
  },
});

export const { onTimeNoteChange } = timeNotesSlice.actions;

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.timeNotes.value;

// const counterReducer = counterSlice.reducer;
export const timeNotesReducer = timeNotesSlice.reducer;
