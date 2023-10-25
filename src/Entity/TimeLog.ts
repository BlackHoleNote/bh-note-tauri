// interface TimeLog {
//   update(text: string): TimeLog;
//   // {
//   //   return new TimeLog(
//   //     TimeLogType.Text,
//   //     this.id,
//   //     new Date(),
//   //     text,
//   //     this.endDate
//   //   );
//   // }

import { map } from "lodash";
import { log } from "../log";
import { Note } from "./Note";

//   logged(): TimeLog;
//   // {
//   //   return new TimeLog(
//   //     TimeLogType.Text,
//   //     this.id,
//   //     this.startDate,
//   //     this.text,
//   //     new Date()
//   //   );
//   // }

//   get endDateString(): string;
//   // {
//   //   if (this.endDate) {
//   //     return this.endDate.toISOString();
//   //   } else {
//   //     return "";
//   //   }
//   // }

//   // static temp(id: number = 0): TimeLog
//   // {
//   //   return new TimeLog(TimeLogType.Temp, id, new Date(), "", null);
//   // }

//   // static equals(lhs: TimeLog, rhs: TimeLog): boolean
//   // {
//   //   return lhs.id === rhs.id;
//   // }
// }

enum TimeLogType {
  Text,
  Temp,
}

interface TimeLogs {
  // constructor(
  id: number;
  previousVersion: number;
  version: number;
  title: string;
  lastUpdatedTime: Date;
  contents: TimeLog[];
  // ) {}

  // static temp(id: number = 0): TimeLogs {
  //   // ForDebugging 주석 부분은 TypeScript에서는 제거하거나 수정해야 할 수 있습니다.
  //   const tempTimeLogs = [TimeLog.temp(0)]; // TimeLog.temp 메서드 호출 방식은 TimeLog 클래스에 따라 수정해야 할 수 있습니다.
  //   return new TimeLogs(id, 0, 0, "", new Date(), tempTimeLogs);
  // }

  // 나머지 메서드와 프로퍼티를 TypeScript에 맞게 변환해야 합니다.
  // Codable 및 Equatable 프로토콜을 준수하는 방법도 고려해야 합니다.
}

export class TimeLog {
  // type: TimeLogType;
  // id: number;
  // topic: string;
  // text: string;
  // startDate: Date;
  // endDate?: Date | null;
  constructor(
    public id: number,
    public text: string,
    public startDate: Date,
    public endDate?: Date | null,
    public topic?: string | null
  ) {}

  /**
   * name
   */

  public toText(): string {
    return this.text;
    // let toEndDate: string = "";
    // if (this.endDate != null) {
    //   toEndDate = " ~ " + this.endDate.toLocaleString("kr");
    // }
    // return `===\n${this.startDate.toLocaleString("kr")}${toEndDate}\n${
    //   this.text
    // }`;
  }
}

export class TimeLogsService {
  timeLogs: Array<TimeLog>;
  constructor() {
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
      // );
      const command = lineBeforeB.trim();
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
      }
    }
    // mutable.text += console.log("newenwenwenw value", value);
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
  // constructor(
  //   public fromA: number,
  //   public toA: number,
  //   public fromB: number,
  //   public toB: number,
  //   public isLineBreak: boolean,
  //   public value: string
  // ) {}
}
