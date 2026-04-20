import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Doc } from "../../convex/_generated/dataModel";
import { WORKSPACE } from "../workspace";

const PROOF_BASE = import.meta.env.VITE_PROOF_URL || "https://www.proofeditor.ai";

interface Props {
  onExit: () => void;
}

// Vertical scrollable review board for short_form_video docs in the current
// workspace. Each row: descript embed left, content right (title, 5 inline-
// editable variant inputs with star-to-pick, expandable transcript). Used to
// triage on-screen text variants and mark the chosen one per clip.
export function ReviewView({ onExit }: Props) {
  const allDocs = useQuery(api.documents.listByStatus, { workspace: WORKSPACE.name });
  const updateDoc = useMutation(api.documents.update);

  const clips = (allDocs ?? []).filter((d) => d.doc_type === "short_form_video");

  return (
    <div className="review-view">
      <div className="review-header">
        <h2 className="review-title">Review · short-form clips ({clips.length})</h2>
        <button className="review-exit" onClick={onExit}>← Back to kanban</button>
      </div>
      {clips.length === 0 && (
        <div className="review-empty">
          No short-form video clips in this workspace yet.
        </div>
      )}
      {clips.map((clip) => (
        <ReviewRow key={clip._id} clip={clip} updateDoc={updateDoc} />
      ))}
    </div>
  );
}

function ReviewRow({
  clip,
  updateDoc,
}: {
  clip: Doc<"documents">;
  updateDoc: ReturnType<typeof useMutation<typeof api.documents.update>>;
}) {
  const [transcriptOpen, setTranscriptOpen] = useState(false);

  const embedSrc = clip.descript_url
    ? clip.descript_url.replace("/view/", "/embed/")
    : null;

  return (
    <div className="review-row">
      <div className="review-embed-col">
        {embedSrc ? (
          <iframe
            src={embedSrc}
            title={clip.title}
            className="review-embed-iframe"
            allow="autoplay; fullscreen"
          />
        ) : (
          <div className="review-embed-placeholder">No Descript URL</div>
        )}
        {clip.descript_url && (
          <a
            href={clip.descript_url}
            target="_blank"
            rel="noopener noreferrer"
            className="review-embed-link"
          >
            Open in Descript ↗
          </a>
        )}
        {clip.proof_slug && (
          <a
            href={`${PROOF_BASE}/d/${clip.proof_slug}?token=${clip.proof_token}&theme=writer`}
            target="_blank"
            rel="noopener noreferrer"
            className="review-embed-link"
          >
            Open in Proof ↗
          </a>
        )}
      </div>
      <div className="review-content-col">
        <h3 className="review-clip-title">{clip.title}</h3>
        <div className="review-ost">
          <div className="review-ost-label">On-screen text (prefix your pick with ★)</div>
          <textarea
            className="review-ost-textarea"
            rows={12}
            placeholder="★ your picked hook&#10;&#10;GOLDMAN-STYLE&#10;1. ..."
            defaultValue={clip.notes ?? ""}
            onBlur={async (e) => {
              const val = e.target.value;
              if (val !== (clip.notes ?? "")) {
                await updateDoc({ id: clip._id, notes: val || undefined });
              }
            }}
          />
        </div>
        <button
          className="review-transcript-toggle"
          onClick={() => setTranscriptOpen((v) => !v)}
        >
          {transcriptOpen ? "▼" : "▶"} Transcript
        </button>
        {transcriptOpen && clip.transcript && (
          <div className="review-transcript">{clip.transcript}</div>
        )}
      </div>
    </div>
  );
}
