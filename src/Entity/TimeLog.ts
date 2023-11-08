import { log } from "../log";
import { Note } from "./Note";
import { Todo } from "./Todo";

enum TimeLogType {
  Text,
  Temp,
}

interface TimeLogs {
  id: number;
  previousVersion: number;
  version: number;
  title: string;
  lastUpdatedTime: Date;
  contents: TimeLog[];
}

export class TimeLog {
  constructor(
    public id: number,
    public text: string,
    public startDate: Date,
    public endDate?: Date | null,
    public topic?: string | null
  ) {}

  public toText(): string {
    return this.text;
  }
}

export class TimeLogsService {
  timeLogs: Array<TimeLog>;

  constructor(private todoMaker: () => Todo[]) {
    this.timeLogs = [
      new TimeLog(0, `===\n${new Date().toLocaleString("kr")}\n`, new Date()),
    ];
  }
  public state(): string {
    return this.timeLogs
      .map((timeLog: TimeLog) => {
        return timeLog.toText();
      })
      .join("\n");
  }

  public timeNoteWillChange(note: Note) {
    log({
      object: note,
      customMessage: `timeNoteWillChange ${note.contents === ""}`,
    });
    if (note.contents === "") {
      this.timeLogs = [
        new TimeLog(0, `===\n${new Date().toLocaleString("kr")}\n`, new Date()),
      ];
    } else {
      this.timeLogs[0].text = note.contents;
    }
  }

  public timeLogDidChanges(changes: TimeLogChanges) {
    let { fromA, toA, fromB, toB, isLineBreak, value, lineBeforeB } = changes;
    let mutable = value.slice(0);
    const isLineBreakInserted = fromA == toA && fromB < toB && isLineBreak;
    if (isLineBreakInserted) {
      const target = value.slice(fromB - 3, fromB);
      // console.log(
      //   `${target} befroe line ${lineBeforeB} ${target === lineBeforeB}`
      // )sssssssssss
      const command = lineBeforeB.trim();
      log({ object: target, customMessage: "refresh" });
      if (command === "===") {
        mutable =
          mutable.slice(0, fromB + 1) +
          `${new Date().toLocaleString("kr")}\n` +
          mutable.slice(fromB + 1);
        mutable = this.addEndDate(mutable, fromB);
      } else if (command === "/end" || command === "/e") {
        mutable = mutable.slice(0, fromB - lineBeforeB.length);
        mutable = this.addEndDate(mutable, fromB);
      } else if (command === "/s" || command === "/start") {
        mutable =
          mutable.slice(0, fromB - lineBeforeB.length) +
          "===\n" +
          `${new Date().toLocaleString("kr")}\n` +
          mutable.slice(fromB + 1);
      } else if (command === "/t" || command === "/todo") {
        mutable =
          mutable.slice(0, fromB - lineBeforeB.length) +
          this.todoMaker()
            .map((todo) => {
              "- " + todo.title;
            })
            .join("\n") +
          mutable.slice(fromB + 1);
      }
    }
    this.timeLogs[0].text = mutable;
  }

  addEndDate(text: string, from: number): string {
    const target = text.slice(0, from - 2);

    const lastIndex = target.lastIndexOf("===\n");
    const nextLineBreak = target.indexOf("\n", lastIndex + 4);
    console.log(from, nextLineBreak);
    return (
      text.slice(0, nextLineBreak) +
      " ~ " +
      new Date().toLocaleString("kr") +
      text.slice(nextLineBreak)
    );
  }
}

export interface TimeLogChanges {
  fromA: number;
  toA: number;
  fromB: number;
  toB: number;
  isLineBreak: boolean;
  value: string;
  lineBeforeB: string;
}
