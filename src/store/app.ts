import { AnyAction, Middleware, configureStore } from "@reduxjs/toolkit";
import { counterReducer } from "./SliceExample";
import { noteListReducer } from "./NoteListSlice";
import { timeNotesReducer } from "./TimeNotesSlice";
import { timeLogApi } from "../repository/APIClient";
import { authReducer } from "./AuthSlice";
import { logger } from "redux-logger";
import { log } from "../log";
import { todoReducer } from "./TodoSlice";
// ...

const customLogger: Middleware = (store) => (next) => (action) => {
  log({
    object: action.type,
    customMessage: "next action type",
    consoleLog: false,
  });
  next(action);
};

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    noteList: noteListReducer,
    timeNotes: timeNotesReducer,
    timeLogApi: timeLogApi.reducer,
    todo: todoReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(timeLogApi.middleware)
      .concat(logger)
      .concat(customLogger),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
