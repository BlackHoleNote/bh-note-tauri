import { configureStore } from "@reduxjs/toolkit";
import { counterReducer } from "./CounterSlice";
import { noteListReducer } from "./NoteListSlice";
// ...

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    noteList: noteListReducer,
    // posts: postsReducer,
    // comments: commentsReducer,
    // users: usersReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
