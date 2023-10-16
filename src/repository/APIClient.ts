import axios from "axios";
import { Note, SaveNoteDTO } from "../Entity/Note";
import { BaseQueryFn, FetchArgs, FetchBaseQueryError, createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store/app";
import { LogoutReason, Token, login, logout } from "../store/AuthSlice";

let APIClient = axios.create({
  // headers: { "User-Agent":
  //     "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36",
  // },
});

export default APIClient;

// APIClient.get("https://www.google.com").then((res) => {});

// export const host = "http://34.105.33.139:8080";
export const host = "http://localhost:8080";

// export async function getTimeLogs(): Promise<TimeLog[]> {
//   let res = await APIClient.get<TimeLog[]>(`${host}/notes`);
//   return res.data;
// }

export async function createTimeLogsAPI(note: Note): Promise<SaveNoteDTO> {
  let { data, status } = await APIClient.post<SaveNoteDTO>(
    `${host}/v2/note/create`,
    note
  );
  if (status === 200) {
    return data;
  }
  throw new Error("failed to create note");
}

export async function saveTimeLogsAPI(note: Note): Promise<SaveNoteDTO> {
  let { data, status } = await APIClient.post<SaveNoteDTO>(
    `${host}/v2/note/save`,
    note
  );
  if (status === 200) {
    return data;
  }
  throw new Error("failed to create note");
}

// Define a service using a base URL and expected endpoints



const baseQuery = fetchBaseQuery({ baseUrl: `${host}/`, prepareHeaders: (headers, api) => {
  headers.set("authorization", "Bearer " + (api.getState() as RootState).auth.auth?.token.token ?? "")
  headers.set("content-type", "application/json")
  return headers;
}})
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)
  if (result.error && result.error.status === 401) {
    // try to get a new token
    try {
      const refreshResult = await baseQuery('api/admin/refreshToken', api, extraOptions)
      if (refreshResult.data as Token) {
        // store the new token
        api.dispatch(login(refreshResult.data as Token));
        // retry the initial query
        result = await baseQuery(args, api, extraOptions);
        return result;
      }
    } finally {
      api.dispatch(logout(LogoutReason.TokenExpired));
    }
  }
  return result
}
export const timeLogApi = createApi({
  reducerPath: "timeLogApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${host}/` }),
  endpoints: (builder) => ({
    getAllNotes: builder.query<Note[], void>({
      query: () => `v2/notes`,
    }),
    createNotes: builder.mutation<SaveNoteDTO, Note>({
      query: (arg) => ({ url: `v2/note/create`, method: "POST", body: arg }),
    }),
    saveNotes: builder.mutation<SaveNoteDTO, Note>({
      query: (arg) => ({ url: `v2/note/save`, method: "POST", body: arg }),
    }),
    adminToken: builder.query<Token, void>({
      query: () => `api/admin/token`,
    }) 
  }),
});

export const { useGetAllNotesQuery, useCreateNotesMutation, useSaveNotesMutation, useAdminTokenQuery } = timeLogApi;
