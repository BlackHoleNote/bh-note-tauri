import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./app";

// Define a type for the slice state
interface AuthState {
  auth?: User;
}

interface User {
  name: string;
}

// Define the initial state using that type
const initialState: AuthState = {};

export const authSlice = createSlice({
  name: "counter",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    login: (state) => {
      state.auth = { name: "test" };
    },
  },
});

export const { login } = authSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const myAuth = (state: RootState) => state.auth.auth;

// const counterReducer = counterSlice.reducer;
export const authReducer = authSlice.reducer;
