import { configureStore } from "@reduxjs/toolkit";
import { counterReducer } from "./CounterSlice";
import { noteListReducer } from "./NoteListSlice";
import { timeNotesReducer } from "./TimeNotesSlice";
import { timeLogApi } from "../repository/APIClient";
// ...

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    noteList: noteListReducer,
    timeNotes: timeNotesReducer,
    timeLogApi: timeLogApi.reducer,
    // posts: postsReducer,
    // comments: commentsReducer,
    // users: usersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(timeLogApi.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
