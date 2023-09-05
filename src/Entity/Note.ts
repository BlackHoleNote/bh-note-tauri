export interface FileVisitor<T> {
  visitFolder(folder: Folder): T;
  visitNote(note: Note): T;
}

export interface File {
  id: number;
  title: string;

  accept(visitor: FileVisitor<any>): void;
}

export class Folder implements File {
  constructor(public id: number, public title: string, public childs: File[]) {}

  accept(visitor: FileVisitor<any>): void {
    visitor.visitFolder(this);
  }
}

export class Note implements File {
  constructor(public id: number, public title: string) {}

  accept(visitor: FileVisitor<any>): void {
    visitor.visitNote(this);
  }
}

export class RootFolder extends Folder {
  constructor() {
    super(0, "", []);
  }
}
