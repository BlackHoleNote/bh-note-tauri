import { emit } from "@tauri-apps/api/event";

export function log(
  object: any,
  customMessage: string = "",
  caller: String = ""
) {
  let string = JSON.stringify(object);
  console.log(`${customMessage}!!! ` + string);
  emit("console_log", {
    title: customMessage === "" ? null : `${customMessage}!!!`,
    string: string ?? "",
  });
}
