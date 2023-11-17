import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { store, type RootState } from "./app";
import { TimeLogChanges, TimeLogsService } from "../Entity/TimeLog";
import { Note } from "../Entity/Note";
import { LogoutReason, logout } from "./AuthSlice";
import { timeNoteDidChanged } from "./NoteListSlice";

// Define a type for the slice state
export interface TimeNotesState {
  value: string;
}

// Define the initial state using that type
const initialState: TimeNotesState = {
  value: "===\n\n",
};

// with the range in the original document (fromA-toA) and the range that replaces it in the new document (fromB-toB).

// (fromA, toA, fromB, toB, inserted)

export const timeNotesSlice = createSlice(
  (() => {
    let service = new TimeLogsService(() => {
      // TODO: - 순환참조 제거
      // return store.getState().todo.todos;
      return [];
    });
    return {
      name: "timeNotesSlice",
      initialState: { value: "" },
      reducers: {
        timeNoteWillStart: (state, action: PayloadAction<Note>) => {
          service.timeNoteWillChange(action.payload);
          (state as TimeNotesState).value = service.state();
        },
        onTimeNoteChange: (state, action: PayloadAction<TimeLogChanges>) => {
          service.timeLogDidChanges(action.payload);
          (state as TimeNotesState).value = service.state();
        },
      },
      extraReducers: (builder) => {
        builder.addCase(
          timeNoteDidChanged,
          (state, action: PayloadAction<Note>) => {
            service.timeNoteWillChange(action.payload);
            (state as TimeNotesState).value = service.state();
          }
        );
      },
    };
  })()
);

export const { onTimeNoteChange, timeNoteWillStart } = timeNotesSlice.actions;

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.timeNotes.value;

// const counterReducer = counterSlice.reducer;
export const timeNotesReducer = timeNotesSlice.reducer;
