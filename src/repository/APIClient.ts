import axios from "axios";

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
