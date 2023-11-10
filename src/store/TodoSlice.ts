import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./app";
import { Note, SaveNoteDTO } from "../Entity/Note";
import { LogoutReason, logout } from "./AuthSlice";
import { log } from "../utils/log";
import { timeLogApi } from "../repository/APIClient";
import { Todo } from "../Entity/Todo";

// Define a type for the slice state
interface TodoState {
  todos: Todo[];
}

const initialState: TodoState = {
  todos: [],
};

export const todoSlice = createSlice({
  name: "todo",
  initialState: initialState,
  reducers: {
    loadTodos: (state, action: PayloadAction<Todo[]>) => {
      state.todos = action.payload;
    },
  },
});

export const { loadTodos } = todoSlice.actions;

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.noteList.root;

// const noteListReducer = noteListSlice.reducer;
export const todoReducer = todoSlice.reducer;
