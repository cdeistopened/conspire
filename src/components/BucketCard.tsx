import { useEffect, useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Doc } from "../../convex/_generated/dataModel";

interface Props {
  document: Doc<"documents">;
  onClick: () => void;
}

function parseFlags(tags: string[] | undefined) {
  const t = tags ?? [];
  return {
    ageMention: t.includes("flag:age-mention"),
    promo: t.includes("flag:promo"),
    notRichard: t.includes("flag:not-richard"),
  };
}

function parseSecondaryPillars(tags: string[] | undefined): string[] {
  return (tags ?? [])
    .filter((t) => t.startsWith("sub:"))
    .map((t) => t.slice(4));
}

export function BucketCard({ document, onClick }: Props) {
  const update = useMutation(api.documents.update);
  const [notes, setNotes] = useState(document.notes ?? "");
  const [notesExpanded, setNotesExpanded] = useState(false);
  const [saving, setSaving] = useState(false);
  const debounceRef = useRef<number | null>(null);

  // Keep local state in sync if the doc's notes change from another source
  useEffect(() => {
    setNotes(document.notes ?? "");
  }, [document.notes]);

  const flags = parseFlags(document.tags);
  const secondaries = parseSecondaryPillars(document.tags);

  const summary = document.body && document.body.length > 140
    ? document.body.slice(0, 140) + "…"
    : document.body ?? "";

  const saveNotes = async (next: string) => {
    if (next === (document.notes ?? "")) return;
    setSaving(true);
    try {
      await update({ id: document._id, notes: next });
    } finally {
      setSaving(false);
    }
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const next = e.target.value;
    setNotes(next);
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      saveNotes(next);
    }, 800);
  };

  const handleNotesBlur = () => {
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    saveNotes(notes);
  };

  // Don't propagate clicks from inside the notes box to the parent card handler
  const stopClick = (e: React.MouseEvent) => e.stopPropagation();

  const hasNotes = (notes ?? "").trim().length > 0;

  return (
    <div className="bucket-card" onClick={onClick}>
      <div className="bucket-card-header">
        <span className="bucket-card-title">{document.title || "(untitled)"}</span>
        <div className="bucket-card-flags">
          {flags.ageMention && (
            <span className="bucket-flag" title="Richard mentions his age">⚠</span>
          )}
          {flags.promo && (
            <span className="bucket-flag" title="Promotional">🏷</span>
          )}
          {flags.notRichard && (
            <span className="bucket-flag" title="Guest speaker">👥</span>
          )}
        </div>
      </div>
      {summary && <p className="bucket-card-summary">{summary}</p>}
      {secondaries.length > 0 && (
        <div className="bucket-card-chips">
          {secondaries.slice(0, 3).map((s) => (
            <span key={s} className="bucket-chip">
              {s}
            </span>
          ))}
        </div>
      )}
      <div className="bucket-card-footer">
        <span className={`bucket-card-status status-${document.status}`}>
          {document.status}
        </span>
        <button
          className={`bucket-notes-toggle ${hasNotes ? "has-notes" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            setNotesExpanded((v) => !v);
          }}
          title={hasNotes ? "Has notes — click to view/edit" : "Add notes"}
        >
          {hasNotes ? "📝" : "＋ notes"}
        </button>
      </div>
      {notesExpanded && (
        <div className="bucket-notes-area" onClick={stopClick}>
          <textarea
            value={notes}
            onChange={handleNotesChange}
            onBlur={handleNotesBlur}
            placeholder="Observations, reminders, tags-I-haven't-invented-yet…"
            rows={3}
          />
          <div className="bucket-notes-footer">
            <span className="bucket-notes-status">
              {saving ? "saving…" : hasNotes ? "saved" : ""}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
