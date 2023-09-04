class TimeLog {
  constructor(
    public type: TimeLogType,
    public id: number,
    public startDate: Date,
    public text: string,
    public endDate?: Date | null
  ) {}

  update(text: string): TimeLog {
    return new TimeLog(
      TimeLogType.Text,
      this.id,
      new Date(),
      text,
      this.endDate
    );
  }

  logged(): TimeLog {
    return new TimeLog(
      TimeLogType.Text,
      this.id,
      this.startDate,
      this.text,
      new Date()
    );
  }

  get endDateString(): string {
    if (this.endDate) {
      return this.endDate.toISOString();
    } else {
      return "";
    }
  }

  static temp(id: number = 0): TimeLog {
    return new TimeLog(TimeLogType.Temp, id, new Date(), "", null);
  }

  static equals(lhs: TimeLog, rhs: TimeLog): boolean {
    return lhs.id === rhs.id;
  }
}

enum TimeLogType {
  Text,
  Temp,
}

class TimeLogs {
  id: number;
  previousVersion: number;
  version: number;
  title: string;
  lastUpdatedTime: Date;
  contents: { [key: string]: TimeLog };

  constructor(
    id: number,
    previousVersion: number,
    version: number,
    title: string,
    lastUpdatedTime: Date,
    contents: { [key: string]: TimeLog }
  ) {
    this.id = id;
    this.previousVersion = previousVersion;
    this.version = version;
    this.title = title;
    this.lastUpdatedTime = lastUpdatedTime;
    this.contents = contents;
  }

  static temp(id: number = 0): TimeLogs {
    // ForDebugging 주석 부분은 TypeScript에서는 제거하거나 수정해야 할 수 있습니다.
    const tempTimeLogs = [TimeLog.temp(0)]; // TimeLog.temp 메서드 호출 방식은 TimeLog 클래스에 따라 수정해야 할 수 있습니다.
    return new TimeLogs(id, 0, 0, "", new Date(), tempTimeLogs);
  }

  // 나머지 메서드와 프로퍼티를 TypeScript에 맞게 변환해야 합니다.
  // Codable 및 Equatable 프로토콜을 준수하는 방법도 고려해야 합니다.
}
