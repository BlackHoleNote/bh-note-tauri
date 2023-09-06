import { Root } from "react-dom/client";

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

  addNewFolder(): RootFolder {
    this.childs.push(new Folder(1, `${Math.random()}`, []));
    return this;
  }

  addNewNote(): RootFolder {
    this.childs.push(new Note(0, `${Math.random()}`));
    return this;
  }
}
