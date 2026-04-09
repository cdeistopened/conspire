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

const PLATFORM_CONFIG: Record<string, { label: string; charLimit: number; postUrl?: string }> = {
  x: { label: "𝕏 Twitter", charLimit: 280, postUrl: "https://twitter.com/intent/tweet?text=" },
  linkedin: { label: "LinkedIn", charLimit: 3000, postUrl: "https://www.linkedin.com/feed/?shareActive=true" },
  instagram: { label: "Instagram", charLimit: 2200 },
  facebook: { label: "Facebook", charLimit: 63206, postUrl: "https://www.facebook.com/" },
  tiktok: { label: "TikTok", charLimit: 2200 },
  substack: { label: "Substack", charLimit: 0 },
  webflow: { label: "Webflow", charLimit: 0 },
  beehiiv: { label: "Beehiiv", charLimit: 0 },
  youtube: { label: "YouTube", charLimit: 5000, postUrl: "https://studio.youtube.com" },
};

const PLATFORM_LABELS: Record<string, string> = Object.fromEntries(
  Object.entries(PLATFORM_CONFIG).map(([k, v]) => [k, v.label])
);

interface Props {
  document: Doc<"documents">;
  onClose: () => void;
}

export function DocumentPanel({ document, onClose }: Props) {
  const updateStatus = useMutation(api.documents.updateStatus);
  const updateDoc = useMutation(api.documents.update);
  const linkToProof = useAction(api.proof.linkExisting);
  const generateUploadUrl = useMutation(api.documents.generateUploadUrl);
  const saveThumbnail = useMutation(api.documents.saveThumbnail);
  const activity = useQuery(api.activity.listByDocument, {
    document: document._id,
  });
  const children = useQuery(api.documents.listByParent, {
    parent_id: document._id,
  });
  const allDocs = useQuery(api.documents.listByStatus, {});
  const parentDoc = document.parent_id
    ? allDocs?.find((d) => d._id === document.parent_id)
    : null;

  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(document.title);
  const [bodyDraft, setBodyDraft] = useState(document.body ?? "");
  const [linking, setLinking] = useState(false);
  const [tab, setTab] = useState<"quick" | "proof">(document.proof_slug ? "proof" : "quick");
  const [saved, setSaved] = useState(true);
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
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
    <div className={`panel-overlay ${expanded ? "panel-expanded" : ""}`} onClick={onClose}>
      <div className={`panel ${expanded ? "panel-full" : ""}`} onClick={(e) => e.stopPropagation()}>
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
            <button
              className="btn-ghost panel-expand"
              onClick={() => setExpanded((e) => !e)}
              title={expanded ? "Minimize" : "Expand"}
            >
              {expanded ? (
                <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M10 2h4v4M6 14H2v-4M14 2L9.5 6.5M2 14l4.5-4.5" />
                </svg>
              ) : (
                <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M2 6V2h4M14 10v4h-4M2 2l4.5 4.5M14 14L9.5 9.5" />
                </svg>
              )}
            </button>
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
          <div className="control-group">
            <label>Publish</label>
            <input
              type="date"
              className="date-input"
              defaultValue={document.publish_date ? new Date(document.publish_date).toISOString().split("T")[0] : ""}
              onChange={async (e) => {
                const val = e.target.value;
                if (val) {
                  await updateDoc({ id: document._id, publish_date: new Date(val).getTime() } as any);
                }
              }}
            />
          </div>
        </div>

        {/* Properties */}
        <div className="panel-properties">
          <div
            className={`prop-dropzone ${document.thumbnail_url ? "has-image" : ""}`}
            onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add("drag-over"); }}
            onDragLeave={(e) => { e.currentTarget.classList.remove("drag-over"); }}
            onDrop={async (e) => {
              e.preventDefault();
              e.currentTarget.classList.remove("drag-over");
              const file = e.dataTransfer.files[0];
              if (!file || !file.type.startsWith("image/") && !file.type.startsWith("video/")) return;
              const uploadUrl = await generateUploadUrl();
              const res = await fetch(uploadUrl, { method: "POST", headers: { "Content-Type": file.type }, body: file });
              const { storageId } = await res.json();
              await saveThumbnail({ id: document._id, storageId });
            }}
          >
            {document.thumbnail_url ? (
              <img src={document.thumbnail_url} alt="" />
            ) : (
              <div className="dropzone-placeholder">
                {document.platform === "instagram" || document.platform === "tiktok"
                  ? "Drop image or video"
                  : "Drop thumbnail image"}
              </div>
            )}
          </div>
          <div className="prop-field">
            <label>Description</label>
            <textarea
              className="prop-textarea"
              placeholder={document.platform === "webflow" ? "Meta description for SEO (aim for 155 chars)..." : "Post description..."}
              defaultValue={document.meta_description ?? ""}
              rows={2}
              onBlur={async (e) => {
                const val = e.target.value.trim();
                if (val !== (document.meta_description ?? "")) {
                  await updateDoc({ id: document._id, meta_description: val || undefined } as any);
                }
              }}
            />
            {document.meta_description && document.platform === "webflow" && (
              <span className={`prop-char-count ${document.meta_description.length > 155 ? "over" : ""}`}>
                {document.meta_description.length}/155
              </span>
            )}
          </div>
        </div>

        {/* Action bar */}
        <div className="panel-actions">
          <button
            className="btn-action"
            onClick={async () => {
              await navigator.clipboard.writeText(bodyDraft);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            title="Copy post text to clipboard"
          >
            {copied ? "Copied!" : "Copy text"}
          </button>
          {document.platform && PLATFORM_CONFIG[document.platform]?.postUrl && (
            <a
              className="btn-action"
              href={
                document.platform === "x"
                  ? `${PLATFORM_CONFIG[document.platform].postUrl}${encodeURIComponent(bodyDraft)}`
                  : PLATFORM_CONFIG[document.platform].postUrl
              }
              target="_blank"
              rel="noopener noreferrer"
              title={`Open in ${PLATFORM_CONFIG[document.platform]?.label} to post manually`}
            >
              Post in {PLATFORM_CONFIG[document.platform]?.label} ↗
            </a>
          )}
          {document.platform && PLATFORM_CONFIG[document.platform]?.charLimit > 0 && (
            <span
              className={`char-counter ${
                bodyDraft.length > PLATFORM_CONFIG[document.platform].charLimit
                  ? "over"
                  : bodyDraft.length > PLATFORM_CONFIG[document.platform].charLimit * 0.9
                    ? "warn"
                    : ""
              }`}
            >
              {bodyDraft.length} / {PLATFORM_CONFIG[document.platform].charLimit}
            </span>
          )}
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

        {/* Mention/tag notes */}
        {document.doc_type === "social_post" && (
          <div className="panel-mentions">
            <label>Tag / Mention Notes</label>
            <input
              type="text"
              className="mentions-input"
              placeholder="@handles to tag when posting manually..."
              defaultValue={document.tags?.filter(t => t.startsWith("@")).join(", ") ?? ""}
              onBlur={async (e) => {
                const mentions = e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean);
                const existingTags = (document.tags ?? []).filter(t => !t.startsWith("@"));
                await updateDoc({ id: document._id, tags: [...existingTags, ...mentions] });
              }}
            />
          </div>
        )}

        {/* Parent / Children links */}
        <div className="panel-links">
          <div className="links-row">
            <label>Parent</label>
            {parentDoc ? (
              <span className="link-chip" onClick={() => onClose()}>
                {parentDoc.title}
              </span>
            ) : (
              <select
                className="link-select"
                value=""
                onChange={async (e) => {
                  if (e.target.value) {
                    await updateDoc({ id: document._id, parent_id: e.target.value as any });
                  }
                }}
              >
                <option value="">Link to parent...</option>
                {allDocs
                  ?.filter((d) => d._id !== document._id && !d.parent_id)
                  .map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.title}
                    </option>
                  ))}
              </select>
            )}
          </div>
          {children && children.length > 0 && (
            <div className="links-children">
              <label>Spokes ({children.length})</label>
              <div className="children-list">
                {children.map((c) => (
                  <span key={c._id} className="link-chip child-chip">
                    {c.platform && <span className="chip-dot" style={{ background: `var(--platform-${c.platform})` }} />}
                    {c.title}
                  </span>
                ))}
              </div>
            </div>
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
