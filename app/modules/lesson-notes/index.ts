import { noteEditorState, type NoteEditorInput } from "./lib/editor-state";

export type {
  NoteEditorInput,
  NoteEditorState,
  NoteEditorStatus,
  SavedNote,
} from "./lib/editor-state";

/**
 * What the Lesson page's Note editor shows for the Student's draft: one
 * status line, the character count, and whether Save is enabled. Save is
 * off while the draft matches what is stored, so the button means "you have
 * changes".
 */
export function describeNoteEditor(input: NoteEditorInput) {
  return noteEditorState(input);
}
