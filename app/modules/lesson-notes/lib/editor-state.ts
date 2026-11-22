import { MAX_NOTE_LENGTH } from "~/lib/notes";

export type SavedNote = { body: string; updatedAt: string } | null;

export type NoteEditorInput = {
  draft: string;
  saved: SavedNote;
  saving: boolean;
  error: string | undefined;
};

export type NoteEditorStatus =
  | { kind: "error"; message: string }
  | { kind: "saving" }
  | { kind: "too-long"; over: number }
  | { kind: "unsaved" }
  | { kind: "saved"; updatedAt: string }
  | { kind: "empty" };

export type NoteEditorState = {
  status: NoteEditorStatus;
  canSave: boolean;
  length: number;
  max: number;
};

export function noteEditorState({
  draft,
  saved,
  saving,
  error,
}: NoteEditorInput): NoteEditorState {
  // The server trims before it stores, so trailing whitespace is not a change.
  const trimmed = draft.trim();
  const length = trimmed.length;
  const tooLong = length > MAX_NOTE_LENGTH;
  const changed = trimmed !== (saved?.body ?? "");
  const canSave = !saving && !tooLong && length > 0 && changed;

  return {
    status: statusOf({ saved, saving, error, tooLong, changed, length }),
    canSave,
    length,
    max: MAX_NOTE_LENGTH,
  };
}

function statusOf({
  saved,
  saving,
  error,
  tooLong,
  changed,
  length,
}: {
  saved: SavedNote;
  saving: boolean;
  error: string | undefined;
  tooLong: boolean;
  changed: boolean;
  length: number;
}): NoteEditorStatus {
  if (saving) return { kind: "saving" };
  if (tooLong) return { kind: "too-long", over: length - MAX_NOTE_LENGTH };
  if (error) return { kind: "error", message: error };
  if (changed && length > 0) return { kind: "unsaved" };
  if (saved) return { kind: "saved", updatedAt: saved.updatedAt };
  return { kind: "empty" };
}
