import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./app";
import { log } from "../log";

// Define a type for the slice state
interface AuthState {
  auth?: Auth;
}

export interface Token {
  token: String;
  refreshToken: String;
}

interface Auth {
  id?: number;
  token: Token;
}

// Define the initial state using that type
const initialState: AuthState = {};

export const authSlice = createSlice({
  name: "counter",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    login: (state, action: PayloadAction<Token>) => {
      state.auth = { token: action.payload };
      log({ object: state.auth, customMessage: "로그인 완료" });
    },

    logout: (state, action: PayloadAction<LogoutReason>) => {
      log({ object: action.payload, logLevel: "debug" });
      state.auth = undefined;
    },
  },
});

export enum LogoutReason {
  User,
  Forced,
  TokenExpired,
}

export const { login, logout } = authSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const myAuth = (state: RootState) => state.auth.auth;

// const counterReducer = counterSlice.reducer;
export const authReducer = authSlice.reducer;
