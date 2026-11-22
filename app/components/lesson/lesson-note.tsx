import { useState } from "react";
import { Link, useFetcher } from "react-router";
import { Check, Lock, NotebookPen } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Textarea } from "~/components/ui/textarea";
import { cn, formatRelativeTime } from "~/lib/utils";
import {
  describeNoteEditor,
  type NoteEditorStatus,
  type SavedNote,
} from "~/modules/lesson-notes";

export function LessonNote({ note }: { note: SavedNote }) {
  const fetcher = useFetcher<{ ok: boolean; error?: string }>();
  const [draft, setDraft] = useState(note?.body ?? "");
  const { status, canSave, length, max } = describeNoteEditor({
    draft,
    saved: note,
    saving: fetcher.state !== "idle",
    error: fetcher.data?.error,
  });

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <NoteHeader />

        <fetcher.Form method="post" className="space-y-3">
          <input type="hidden" name="intent" value="save-note" />
          <Textarea
            name="body"
            rows={5}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="What clicked? What do you want to come back to?"
            aria-label="Your notes"
            aria-invalid={status.kind === "too-long" || undefined}
            className="min-h-32 resize-y"
          />
          <div className="flex items-center gap-3">
            <Button type="submit" size="sm" disabled={!canSave}>
              {status.kind === "saving" ? "Saving..." : "Save note"}
            </Button>
            <NoteStatus status={status} />
            <span
              className={cn(
                "ml-auto text-xs tabular-nums",
                length > max ? "text-destructive" : "text-muted-foreground"
              )}
            >
              {length} / {max}
            </span>
          </div>
        </fetcher.Form>
      </CardContent>
    </Card>
  );
}

function NoteHeader() {
  return (
    <>
      <div className="mb-1 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <NotebookPen className="size-5 text-primary" />
          <h2 className="text-xl font-semibold">Your notes</h2>
        </div>
        <span className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
          <Lock className="size-3" />
          Private
        </span>
      </div>
      <p className="mb-4 text-sm text-muted-foreground">
        Only you can see these. Every note you write is collected on your{" "}
        <Link to="/saved" className="underline hover:text-foreground">
          Saved
        </Link>{" "}
        page.
      </p>
    </>
  );
}

function NoteStatus({ status }: { status: NoteEditorStatus }) {
  switch (status.kind) {
    case "error":
      return (
        <span role="alert" className="text-sm text-destructive">
          {status.message}
        </span>
      );
    case "too-long":
      return (
        <span role="alert" className="text-sm text-destructive">
          {status.over} {status.over === 1 ? "character" : "characters"} over
          the limit
        </span>
      );
    case "unsaved":
      return (
        <span className="text-xs text-muted-foreground">Unsaved changes</span>
      );
    case "saved":
      return (
        <span
          suppressHydrationWarning
          className="flex items-center gap-1 text-xs text-muted-foreground"
        >
          <Check className="size-3.5 text-green-600" />
          Saved {formatRelativeTime(status.updatedAt)}
        </span>
      );
    case "saving":
    case "empty":
      return null;
  }
}
