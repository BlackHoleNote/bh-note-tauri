import axios from "axios";
import { Note, SaveNoteDTO } from "../Entity/Note";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

let APIClient = axios.create({
  // headers: { "User-Agent":
  //     "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36",
  // },
});

export default APIClient;

// APIClient.get("https://www.google.com").then((res) => {});

export async function getTimeLogs(): Promise<TimeLog[]> {
  let res = await APIClient.get<TimeLog[]>("http://localhost:8080/notes");
  return res.data;
}

export async function createTimeLogsAPI(note: Note): Promise<Note> {
  let { data, status } = await APIClient.post<Note>(
    "http://localhost:8080/v2/note/create",
    note
  );
  if (status === 200) {
    return data;
  }
  throw new Error("failed to create note");
}

export async function saveTimeLogsAPI(note: Note): Promise<Note> {
  let { data, status } = await APIClient.post<Note>(
    "http://localhost:8080/v2/note/save",
    note
  );
  if (status === 200) {
    return data;
  }
  throw new Error("failed to create note");
}

// Define a service using a base URL and expected endpoints
export const timeLogApi = createApi({
  reducerPath: "timeLogApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8080/v2/" }),
  endpoints: (builder) => ({
    getAllNotes: builder.query<Note[], string>({
      query: () => `notes`,
    }),
    saveNotes: builder.mutation<SaveNoteDTO, Note>({
      query: (arg) => ({ url: `note/save`, method: "POST", body: arg }),
    }),
  }),
});
export const { useGetAllNotesQuery, useSaveNotesMutation } = timeLogApi;
