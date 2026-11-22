import { describe, expect, it } from "vitest";
import { describeNoteEditor } from "../index";
import { MAX_NOTE_LENGTH } from "~/lib/notes";

const saved = {
  body: "Closures capture variables",
  updatedAt: "2026-11-01T10:00:00Z",
};
const idle = { saving: false, error: undefined };

describe("describeNoteEditor", () => {
  it("invites a first note when nothing is written or stored", () => {
    expect(describeNoteEditor({ draft: "", saved: null, ...idle })).toEqual({
      status: { kind: "empty" },
      canSave: false,
      length: 0,
      max: MAX_NOTE_LENGTH,
    });
  });

  it("shows when the stored note was saved, and keeps Save off", () => {
    const state = describeNoteEditor({ draft: saved.body, saved, ...idle });
    expect(state.status).toEqual({ kind: "saved", updatedAt: saved.updatedAt });
    expect(state.canSave).toBe(false);
  });

  it("ignores surrounding whitespace, because the server trims it", () => {
    const state = describeNoteEditor({
      draft: `  ${saved.body}\n`,
      saved,
      ...idle,
    });
    expect(state.status.kind).toBe("saved");
    expect(state.canSave).toBe(false);
    expect(state.length).toBe(saved.body.length);
  });

  it("flags an edited draft as unsaved and turns Save on", () => {
    const state = describeNoteEditor({ draft: "New thought", saved, ...idle });
    expect(state.status).toEqual({ kind: "unsaved" });
    expect(state.canSave).toBe(true);
  });

  it("lets a first note be saved", () => {
    const state = describeNoteEditor({ draft: "x", saved: null, ...idle });
    expect(state.status).toEqual({ kind: "unsaved" });
    expect(state.canSave).toBe(true);
  });

  it("does not treat a whitespace-only draft as something to save", () => {
    const state = describeNoteEditor({ draft: "   ", saved: null, ...idle });
    expect(state.status).toEqual({ kind: "empty" });
    expect(state.canSave).toBe(false);
  });

  it("keeps Save off when an existing note is cleared, since the server refuses an empty note", () => {
    const state = describeNoteEditor({ draft: "", saved, ...idle });
    expect(state.status).toEqual({ kind: "saved", updatedAt: saved.updatedAt });
    expect(state.canSave).toBe(false);
  });

  it("reports saving and blocks a second submit", () => {
    const state = describeNoteEditor({
      draft: "New",
      saved,
      saving: true,
      error: undefined,
    });
    expect(state.status).toEqual({ kind: "saving" });
    expect(state.canSave).toBe(false);
  });

  it("allows exactly the maximum length", () => {
    const state = describeNoteEditor({
      draft: "a".repeat(MAX_NOTE_LENGTH),
      saved: null,
      ...idle,
    });
    expect(state.status.kind).toBe("unsaved");
    expect(state.canSave).toBe(true);
  });

  it("says how far over the limit a draft is, and blocks Save", () => {
    const state = describeNoteEditor({
      draft: "a".repeat(MAX_NOTE_LENGTH + 3),
      saved: null,
      ...idle,
    });
    expect(state.status).toEqual({ kind: "too-long", over: 3 });
    expect(state.canSave).toBe(false);
    expect(state.length).toBe(MAX_NOTE_LENGTH + 3);
  });

  it("shows the server's error over the unsaved hint", () => {
    const state = describeNoteEditor({
      draft: "New",
      saved,
      saving: false,
      error: "Nope",
    });
    expect(state.status).toEqual({ kind: "error", message: "Nope" });
    expect(state.canSave).toBe(true);
  });
});
