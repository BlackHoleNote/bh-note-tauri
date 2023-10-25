import { emit } from "@tauri-apps/api/event";

const LOG_LEVEL = {
  trace: "trace",
  debug: "debug",
  error: "error",
} as const;
export type LogLevel = (typeof LOG_LEVEL)[keyof typeof LOG_LEVEL];

export function log(args: {
  object: any;
  customMessage?: String;
  caller?: String;
  logLevel?: LogLevel;
  consoleLog?: boolean;
}) {
  let { object, customMessage, caller, logLevel, consoleLog } = args;
  let string = JSON.stringify(object);
  if (consoleLog !== false) {
    console.log(`${customMessage ?? ""}!!! ` + string);
  }
  emit("console_log", {
    title: customMessage === "" ? null : `${customMessage}!!!`,
    string: string ?? "",
    logLevel: logLevel === undefined ? undefined : LOG_LEVEL[logLevel],
  });
}
