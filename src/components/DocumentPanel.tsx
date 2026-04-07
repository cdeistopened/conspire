import { useState, useRef, useEffect, useCallback } from "react";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Doc } from "../../convex/_generated/dataModel";

const PROOF_BASE = "https://www.proofeditor.ai";

const STATUS_OPTIONS = [
  { value: "draft" as const, label: "Draft" },
  { value: "review" as const, label: "Review" },
  { value: "approved" as const, label: "Approved" },
  { value: "scheduled" as const, label: "Scheduled" },
  { value: "posted" as const, label: "Posted" },
  { value: "archived" as const, label: "Archived" },
];

const PLATFORM_LABELS: Record<string, string> = {
  x: "𝕏 Twitter",
  linkedin: "LinkedIn",
  instagram: "Instagram",
  facebook: "Facebook",
  tiktok: "TikTok",
  substack: "Substack",
  webflow: "Webflow",
  beehiiv: "Beehiiv",
};

interface Props {
  document: Doc<"documents">;
  onClose: () => void;
}

export function DocumentPanel({ document, onClose }: Props) {
  const updateStatus = useMutation(api.documents.updateStatus);
  const updateDoc = useMutation(api.documents.update);
  const linkToProof = useAction(api.proof.linkExisting);
  const activity = useQuery(api.activity.listByDocument, {
    document: document._id,
  });

  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(document.title);
  const [bodyDraft, setBodyDraft] = useState(document.body ?? "");
  const [linking, setLinking] = useState(false);
  const [tab, setTab] = useState<"edit" | "proof">(
    document.proof_slug ? "proof" : "edit"
  );
  const saveTimer = useRef<ReturnType<typeof setTimeout>>();
  const titleInput = useRef<HTMLInputElement>(null);

  // Sync body draft when document changes from Convex
  useEffect(() => {
    setBodyDraft(document.body ?? "");
  }, [document.body]);

  useEffect(() => {
    setTitleDraft(document.title);
  }, [document.title]);

  const proofUrl = document.proof_slug
    ? document.proof_token
      ? `${PROOF_BASE}/d/${document.proof_slug}?token=${document.proof_token}`
      : `${PROOF_BASE}/d/${document.proof_slug}`
    : null;

  // Autosave body with debounce
  const saveBody = useCallback(
    (text: string) => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        updateDoc({ id: document._id, body: text });
      }, 600);
    },
    [document._id, updateDoc]
  );

  const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setBodyDraft(val);
    saveBody(val);
  };

  const handleTitleSave = async () => {
    if (titleDraft.trim() && titleDraft !== document.title) {
      await updateDoc({ id: document._id, title: titleDraft.trim() });
    }
    setEditingTitle(false);
  };

  const handleStatusChange = async (status: Doc<"documents">["status"]) => {
    await updateStatus({ id: document._id, status, actor: "Charlie" });
  };

  const handlePlatformChange = async (
    platform: Doc<"documents">["platform"]
  ) => {
    if (platform) {
      await updateDoc({ id: document._id, platform });
    }
  };

  const handleLinkToProof = async () => {
    setLinking(true);
    try {
      await linkToProof({
        documentId: document._id,
        body: bodyDraft || undefined,
        title: document.title,
      });
      setTab("proof");
    } finally {
      setLinking(false);
    }
  };

  const timeAgo = (ts: number) => {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const charCount = bodyDraft.length;

  return (
    <div className="panel-overlay" onClick={onClose}>
      <div className="panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="panel-header">
          <div className="panel-header-left">
            {editingTitle ? (
              <input
                ref={titleInput}
                className="panel-title-input"
                value={titleDraft}
                onChange={(e) => setTitleDraft(e.target.value)}
                onBlur={handleTitleSave}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleTitleSave();
                  if (e.key === "Escape") {
                    setTitleDraft(document.title);
                    setEditingTitle(false);
                  }
                }}
                autoFocus
              />
            ) : (
              <h2
                className="panel-title panel-title-editable"
                onClick={() => {
                  setEditingTitle(true);
                  setTimeout(() => titleInput.current?.focus(), 0);
                }}
              >
                {document.title}
              </h2>
            )}
            <span className="panel-meta">
              {document.platform && PLATFORM_LABELS[document.platform]}
              {" · "}
              {document.author}
              {" · "}
              {charCount} chars
            </span>
          </div>
          <div className="panel-header-right">
            {proofUrl && (
              <a
                href={proofUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
              >
                Open in Proof ↗
              </a>
            )}
            <button className="btn-ghost panel-close" onClick={onClose}>
              &times;
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="panel-controls">
          <div className="control-group">
            <label>Status</label>
            <div className="status-pills">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s.value}
                  className={`status-pill ${document.status === s.value ? "active" : ""}`}
                  onClick={() => handleStatusChange(s.value)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
          <div className="control-group">
            <label>Platform</label>
            <select
              value={document.platform ?? ""}
              onChange={(e) =>
                handlePlatformChange(
                  e.target.value as Doc<"documents">["platform"]
                )
              }
            >
              {Object.entries(PLATFORM_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tab bar (only show if Proof is linked) */}
        {proofUrl && (
          <div className="panel-tabs">
            <button
              className={`panel-tab ${tab === "edit" ? "active" : ""}`}
              onClick={() => setTab("edit")}
            >
              Quick Edit
            </button>
            <button
              className={`panel-tab ${tab === "proof" ? "active" : ""}`}
              onClick={() => setTab("proof")}
            >
              Proof Editor
            </button>
          </div>
        )}

        {/* Editor area */}
        <div className="panel-editor">
          {tab === "proof" && proofUrl ? (
            <iframe
              src={proofUrl}
              title="Proof Editor"
              className="proof-iframe"
            />
          ) : (
            <div className="panel-edit-area">
              <textarea
                className="panel-textarea"
                value={bodyDraft}
                onChange={handleBodyChange}
                placeholder="Start writing..."
              />
              {!proofUrl && (
                <div className="panel-link-proof">
                  <button
                    className="btn-primary"
                    onClick={handleLinkToProof}
                    disabled={linking}
                  >
                    {linking
                      ? "Creating Proof doc..."
                      : "Open in Proof (collab editor)"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Activity */}
        {activity && activity.length > 0 && (
          <div className="panel-activity">
            <h3>Activity</h3>
            <ul className="activity-list">
              {[...activity].reverse().map((a) => (
                <li key={a._id} className="activity-item">
                  <span className="activity-actor">{a.actor}</span>
                  <span className="activity-action">
                    {a.details ?? a.action}
                  </span>
                  <span className="activity-time">
                    {timeAgo(a.timestamp)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
