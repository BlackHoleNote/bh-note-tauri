export interface Note {
  id: number | string;
  title: string;
  contents: string;
}

export interface SaveNoteDTO {
  id: number;
  tempId?: string;
}
