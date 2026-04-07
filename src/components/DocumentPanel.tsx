import { useState, useRef, useEffect, useCallback } from "react";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Doc } from "../../convex/_generated/dataModel";

const PROOF_BASE = import.meta.env.VITE_PROOF_URL || "https://www.proofeditor.ai";

const STATUS_OPTIONS = [
  { value: "draft" as const, label: "Draft", color: "#C8943E" },
  { value: "review" as const, label: "Review", color: "#7B8794" },
  { value: "approved" as const, label: "Approved", color: "#4A9B6E" },
  { value: "scheduled" as const, label: "Scheduled", color: "#5B7FD4" },
  { value: "posted" as const, label: "Posted", color: "#1E1E1E" },
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
  const [tab, setTab] = useState<"quick" | "proof">(document.proof_slug ? "proof" : "quick");
  const [saved, setSaved] = useState(true);
  const saveTimer = useRef<ReturnType<typeof setTimeout>>();
  const titleInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setBodyDraft(document.body ?? "");
    setSaved(true);
  }, [document.body]);

  useEffect(() => {
    setTitleDraft(document.title);
  }, [document.title]);

  // Autosave with debounce
  const saveBody = useCallback(
    (text: string) => {
      setSaved(false);
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(async () => {
        await updateDoc({ id: document._id, body: text });
        setSaved(true);
      }, 500);
    },
    [document._id, updateDoc]
  );

  const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setBodyDraft(val);
    saveBody(val);
  };

  // Auto-resize textarea
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = Math.max(300, ta.scrollHeight) + "px";
    }
  }, [bodyDraft]);

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

  // Keyboard shortcut: Escape to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !editingTitle) onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, editingTitle]);

  const timeAgo = (ts: number) => {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

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
            <div className="panel-meta-row">
              <span className="panel-meta">
                {document.platform && PLATFORM_LABELS[document.platform]}
                {" · "}
                {document.author}
                {" · "}
                {bodyDraft.length} chars
              </span>
              <span className={`save-indicator ${saved ? "saved" : "saving"}`}>
                {saved ? "Saved" : "Saving..."}
              </span>
            </div>
          </div>
          <div className="panel-header-right">
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
                  style={
                    document.status === s.value
                      ? { background: s.color, borderColor: s.color }
                      : undefined
                  }
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

        {/* Editor tabs */}
        <div className="panel-tabs">
          <button
            className={`panel-tab ${tab === "quick" ? "active" : ""}`}
            onClick={() => setTab("quick")}
          >
            Quick Edit
          </button>
          <button
            className={`panel-tab ${tab === "proof" ? "active" : ""}`}
            onClick={async () => {
              if (!document.proof_slug) {
                setLinking(true);
                try {
                  await linkToProof({
                    documentId: document._id,
                    body: bodyDraft || undefined,
                    title: document.title,
                  });
                } finally {
                  setLinking(false);
                }
              }
              setTab("proof");
            }}
          >
            {linking ? "Creating..." : "Rich Editor"}
          </button>
          {document.proof_slug && (
            <a
              href={`${PROOF_BASE}/d/${document.proof_slug}?token=${document.proof_token}`}
              target="_blank"
              rel="noopener noreferrer"
              className="panel-tab panel-tab-link"
            >
              Open in tab ↗
            </a>
          )}
        </div>

        {/* Editor */}
        <div className="panel-editor">
          {tab === "proof" && document.proof_slug ? (
            <iframe
              src={`${PROOF_BASE}/d/${document.proof_slug}?token=${document.proof_token}`}
              title="Proof Editor"
              className="proof-iframe"
            />
          ) : tab === "proof" && linking ? (
            <div className="panel-loading">Setting up editor...</div>
          ) : (
            <textarea
              ref={textareaRef}
              className="panel-textarea"
              value={bodyDraft}
              onChange={handleBodyChange}
              placeholder="Start writing..."
              spellCheck
            />
          )}
        </div>

        {/* Activity (only show meaningful events) */}
        {activity && activity.length > 0 && (
          <div className="panel-activity">
            <h3>Activity</h3>
            <ul className="activity-list">
              {[...activity]
                .filter((a) => a.action === "created" || a.action === "published" || a.action === "agent_edited")
                .reverse()
                .map((a) => (
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
