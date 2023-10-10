import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./app";
import { log } from "../log";

// Define a type for the slice state
interface AuthState {
  auth?: Auth;
}

interface Auth {
  id: number;
}

// Define the initial state using that type
const initialState: AuthState = {};

export const authSlice = createSlice({
  name: "counter",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    login: (state, action: PayloadAction<Auth>) => {
      state.auth = action.payload;
    },

    logout: (state, action: PayloadAction<Reason>) => {
      log({ object: action.payload, logLevel: "debug" });
      state.auth = undefined;
    },
  },
});

export enum Reason {
  User,
  Forced,
  TokenExpired,
}

export const { login, logout } = authSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const myAuth = (state: RootState) => state.auth.auth;

// const counterReducer = counterSlice.reducer;
export const authReducer = authSlice.reducer;
