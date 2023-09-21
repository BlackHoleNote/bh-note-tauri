import { Root } from "react-dom/client";

export interface FileVisitor<T> {
  visitFolder(folder: Folder): T;
  visitNote(note: Note): T;
}

export interface File {
  id: number | undefined;
  title: string;
  // accept(visitor: FileVisitor<any>): void;
}

export interface Folder extends File {
  // constructor(public id: number, public title: string, public childs: File[]) {}
  id: number | undefined;
  title: string;
  childs: File[];

  // accept(visitor: FileVisitor<any>): void
  // {
  //   visitor.visitFolder(this);
  // }
}

export interface SaveNoteDTO {
  id: number;
  tempId?: string;
}

export interface Note {
  // constructor(public id: number, public title: string) {}
  id: number | string;
  title: string;
  contents: string;
  // accept(visitor: FileVisitor<any>): void {
  //   visitor.visitNote(this);
  // }
}

export interface RootFolder extends Folder {
  // constructor() {
  //   super(0, "", []);
  // }
  //   this.childs.push(new Folder(1, `${Math.random()}`, []));
  //   return this;
  // }
  // addNewNote(): RootFolder {
  //   this.childs.push(new Note(0, `${Math.random()}`));
  //   return this;
  // }
}
