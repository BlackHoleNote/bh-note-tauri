import axios from "axios";
import { Note, SaveNoteDTO } from "../Entity/Note";
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { RootState } from "../store/app";
import { LogoutReason, Token, login, logout } from "../store/AuthSlice";
import { log } from "../log";

let APIClient = axios.create({
  // headers: { "User-Agent":
  //     "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36",
  // },
});

export default APIClient;

// APIClient.get("https://www.google.com").then((res) => {});
export const PRODUCTION = import.meta.env.PROD;
// export const host = ;
// export const host = ;
export const host = PRODUCTION
  ? "https://blackholenote.shop"
  : "http://localhost:8080";

const baseQuery = fetchBaseQuery({
  baseUrl: `${host}/`,
  prepareHeaders: (headers, api) => {
    headers.set(
      "Authorization",
      "Bearer " + (api.getState() as RootState).auth.auth?.token.token ?? ""
    );
    headers.set("content-type", "application/json");
    log({ object: headers, customMessage: "header 준비" });
    return headers;
  },
});
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    // try to get a new token
    try {
      const refreshResult = await baseQuery(
        {
          url: "api/admin/token/refresh",
          params: {
            refreshToken:
              (api.getState() as RootState).auth.auth?.token.refreshToken ?? "",
          },
        },
        api,
        extraOptions
      );
      if (refreshResult.data as Token) {
        api.dispatch(login(refreshResult.data as Token));
        result = await baseQuery(args, api, extraOptions);
        return result;
      }
    } catch (e) {
      log({ object: e, customMessage: "401 이외의 에러 발생" });
    }

    api.dispatch(logout(LogoutReason.TokenExpired));
  }
  return result;
};
export const timeLogApi = createApi({
  reducerPath: "timeLogApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["getAll"],
  endpoints: (builder) => ({
    getAllNotes: builder.query<Note[], void>({
      query: () => `v2/notes`,
      providesTags: ["getAll"],
    }),
    createNotes: builder.mutation<SaveNoteDTO, Note>({
      query: (arg) => ({ url: `v2/note/create`, method: "POST", body: arg }),
    }),
    saveNotes: builder.mutation<SaveNoteDTO, Note>({
      query: (arg) => ({ url: `v2/note/save`, method: "POST", body: arg }),
    }),
    adminToken: builder.query<Token, void>({
      query: () => `api/admin/token`,
    }),
  }),
});

export const {
  useGetAllNotesQuery,
  useCreateNotesMutation,
  useSaveNotesMutation,
  useAdminTokenQuery,
} = timeLogApi;
