import { MAX_NOTE_LENGTH } from "~/lib/notes";

export type SavedNote = { body: string; updatedAt: string };

export type NoteEditorInput = {
  draft: string;
  saved: SavedNote | null;
  saving: boolean;
  error: string | undefined;
};

export type NoteEditorStatus =
  | { kind: "error"; message: string }
  | { kind: "saving" }
  | { kind: "too-long"; over: number }
  | { kind: "cleared" }
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
  const changed = trimmed !== (saved?.body ?? "");
  // The server refuses an empty note, so clearing one is a change Save cannot send.
  const cleared = changed && length === 0;
  const overBy = length - MAX_NOTE_LENGTH;

  return {
    status: statusOf({ saved, saving, error, changed, cleared, overBy }),
    canSave: !saving && overBy <= 0 && changed && !cleared,
    length,
    max: MAX_NOTE_LENGTH,
  };
}

function statusOf({
  saved,
  saving,
  error,
  changed,
  cleared,
  overBy,
}: Pick<NoteEditorInput, "saved" | "saving" | "error"> & {
  changed: boolean;
  cleared: boolean;
  overBy: number;
}): NoteEditorStatus {
  if (saving) return { kind: "saving" };
  if (overBy > 0) return { kind: "too-long", over: overBy };
  if (error) return { kind: "error", message: error };
  if (cleared) return { kind: "cleared" };
  if (changed) return { kind: "unsaved" };
  if (saved) return { kind: "saved", updatedAt: saved.updatedAt };
  return { kind: "empty" };
}
