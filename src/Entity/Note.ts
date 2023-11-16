export interface Note {
  id: number | string;
  title: string;
  contents: string;
  version?: number;
}

export interface SaveNoteDTO {
  id: number;
  tempId?: string;
  version?: number;
}
