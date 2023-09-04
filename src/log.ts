import { emit } from "@tauri-apps/api/event";

export async function log(object: any) {
  let string = JSON.stringify(object);
  console.log(string);
  emit("console_log", { string });
}
