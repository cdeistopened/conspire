import { useState, useRef, useEffect, useCallback } from "react";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Doc } from "../../convex/_generated/dataModel";
import { WORKSPACE } from "../workspace";

const DOC_TYPE_LABELS: Record<string, string> = {
  social_post: "Social Post",
  short_form_video: "Short-Form Video",
  blog_draft: "Blog / SEO",
  podcast: "Podcast / YouTube",
  newsletter: "Newsletter",
  note: "Note",
};

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
  const createDoc = useMutation(api.documents.create);
  const linkToProof = useAction(api.proof.linkExisting);
  const publishToZernio = useAction(api.scheduler.publishToZernio);
  const generateUploadUrl = useMutation(api.documents.generateUploadUrl);
  const saveThumbnail = useMutation(api.documents.saveThumbnail);
  const setThumbnailSlot = useMutation(api.documents.setThumbnailSlot);
  const clearThumbnailSlot = useMutation(api.documents.clearThumbnailSlot);
  const removeDoc = useMutation(api.documents.remove);
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
  const [childPickerOpen, setChildPickerOpen] = useState(false);
  const [childSearch, setChildSearch] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [deleteArmed, setDeleteArmed] = useState(false);
  const deleteTimer = useRef<ReturnType<typeof setTimeout>>();
  // Upload progress: null idle, {target,percent} while uploading. Target is
  // "main" for the generic dropzone or "slot-N" for podcast thumbnail slots.
  const [uploadState, setUploadState] = useState<{ target: string; percent: number } | null>(null);
  const mainFileInput = useRef<HTMLInputElement>(null);
  const slotFileInputs = useRef<Array<HTMLInputElement | null>>([null, null, null, null]);

  // Upload a file via XHR so we get upload.onprogress events (fetch doesn't
  // expose progress). After the PUT completes, hand the storageId to the
  // right Convex mutation based on target.
  const uploadFile = useCallback(async (file: File, target: "main" | `slot-${number}`) => {
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) return;
    setUploadState({ target, percent: 0 });
    try {
      const uploadUrl = await generateUploadUrl();
      const storageId = await new Promise<string>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", uploadUrl);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            setUploadState({ target, percent: Math.round((e.loaded / e.total) * 100) });
          }
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const { storageId } = JSON.parse(xhr.responseText);
              resolve(storageId);
            } catch (err) {
              reject(err);
            }
          } else {
            reject(new Error(`Upload failed: ${xhr.status}`));
          }
        };
        xhr.onerror = () => reject(new Error("Upload network error"));
        xhr.send(file);
      });
      if (target === "main") {
        await saveThumbnail({ id: document._id, storageId: storageId as any, contentType: file.type });
      } else {
        const slot = parseInt(target.slice(5), 10);
        await setThumbnailSlot({ id: document._id, storageId: storageId as any, slot });
      }
    } catch (err) {
      console.error("Upload failed:", err);
      alert(`Upload failed: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setUploadState(null);
    }
  }, [document._id, generateUploadUrl, saveThumbnail, setThumbnailSlot]);
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
            <button
              className={`btn-ghost panel-delete ${deleteArmed ? "armed" : ""}`}
              onClick={async () => {
                if (!deleteArmed) {
                  setDeleteArmed(true);
                  if (deleteTimer.current) clearTimeout(deleteTimer.current);
                  deleteTimer.current = setTimeout(() => setDeleteArmed(false), 3000);
                  return;
                }
                if (deleteTimer.current) clearTimeout(deleteTimer.current);
                try {
                  await removeDoc({ id: document._id });
                  onClose();
                } catch (err) {
                  setDeleteArmed(false);
                  alert(`Delete failed: ${err instanceof Error ? err.message : String(err)}`);
                }
              }}
              title={deleteArmed ? "Click again to delete" : "Delete"}
            >
              {deleteArmed ? (
                <span className="panel-delete-confirm">Confirm?</span>
              ) : (
                <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M2 4h12M5.33 4V2.67a1.33 1.33 0 011.34-1.34h2.66a1.33 1.33 0 011.34 1.34V4M12.67 4v9.33a1.33 1.33 0 01-1.34 1.34H4.67a1.33 1.33 0 01-1.34-1.34V4" />
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
            <label>Type</label>
            <select
              value={document.doc_type}
              onChange={async (e) => {
                await updateDoc({ id: document._id, doc_type: e.target.value } as any);
              }}
            >
              {WORKSPACE.docTypes.map((dt) => (
                <option key={dt} value={dt}>
                  {DOC_TYPE_LABELS[dt] ?? dt}
                </option>
              ))}
            </select>
          </div>
          <div className="control-group control-group-col">
            <label>Platforms</label>
            <div className="platform-checkboxes">
              {WORKSPACE.platforms.map((key) => {
                const cfg = PLATFORM_CONFIG[key];
                if (!cfg) return null;
                const isActive = document.tags?.includes(`platform:${key}`) || document.platform === key;
                const postUrl = cfg.postUrl;
                return (
                  <div key={key} className={`platform-check ${isActive ? "checked" : ""}`}>
                    <button
                      className="platform-check-btn"
                      onClick={async () => {
                        const currentTags = document.tags ?? [];
                        const tag = `platform:${key}`;
                        if (isActive) {
                          await updateDoc({
                            id: document._id,
                            tags: currentTags.filter((t) => t !== tag),
                            ...(document.platform === key ? { platform: undefined } : {}),
                          } as any);
                        } else {
                          await updateDoc({
                            id: document._id,
                            tags: [...currentTags.filter((t) => !t.startsWith("platform:") || currentTags.includes(t)), tag],
                            platform: document.platform || key,
                          } as any);
                        }
                      }}
                    >
                      <span className="check-dot" style={isActive ? { backgroundColor: cfg.postUrl ? "#4A9B6E" : "#C8943E" } : undefined} />
                      <span className="check-label">{cfg.label}</span>
                    </button>
                    {isActive && postUrl && (
                      <a
                        className="platform-post-btn"
                        href={
                          key === "x"
                            ? `${postUrl}${encodeURIComponent(bodyDraft)}`
                            : postUrl
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        title={`Open ${cfg.label}`}
                      >
                        ↗
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="control-group">
            <label>Publish</label>
            <input
              type="datetime-local"
              className="date-input"
              defaultValue={(() => {
                if (!document.publish_date) return "";
                const d = new Date(document.publish_date);
                const pad = (n: number) => String(n).padStart(2, "0");
                return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
              })()}
              onChange={async (e) => {
                const val = e.target.value;
                if (val) {
                  await updateDoc({ id: document._id, publish_date: new Date(val).getTime() } as any);
                }
              }}
            />
          </div>
        </div>

        {/* Properties (generic) — podcast + short_form_video hide the whole
            thumbnail zone (video clips use the Descript embed below instead
            of a still cover image); newsletter hides the description only. */}
        {document.doc_type !== "podcast" && (
          <div className="panel-properties">
            {document.doc_type !== "short_form_video" && (
            <div
              className={`prop-dropzone ${document.thumbnail_url ? "has-image" : ""} ${uploadState?.target === "main" ? "uploading" : ""}`}
              onClick={() => {
                if (uploadState) return;
                mainFileInput.current?.click();
              }}
              onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add("drag-over"); }}
              onDragLeave={(e) => { e.currentTarget.classList.remove("drag-over"); }}
              onDrop={async (e) => {
                e.preventDefault();
                e.currentTarget.classList.remove("drag-over");
                const file = e.dataTransfer.files[0];
                if (file) await uploadFile(file, "main");
              }}
            >
              <input
                ref={mainFileInput}
                type="file"
                accept="image/*,video/*"
                style={{ display: "none" }}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) await uploadFile(file, "main");
                  e.target.value = "";
                }}
              />
              {document.thumbnail_url ? (
                document.thumbnail_type === "video" ? (
                  <video src={document.thumbnail_url} controls className="prop-dropzone-video" />
                ) : (
                  <img src={document.thumbnail_url} alt="" />
                )
              ) : (
                <div className="dropzone-placeholder">
                  {uploadState?.target === "main" ? "Uploading..." : "Drop or click to add image / video"}
                </div>
              )}
              {uploadState?.target === "main" && (
                <div className="dropzone-progress">
                  <div className="dropzone-progress-bar" style={{ width: `${uploadState.percent}%` }} />
                  <div className="dropzone-progress-label">{uploadState.percent}%</div>
                </div>
              )}
            </div>
            )}
            {document.doc_type !== "newsletter" && document.doc_type !== "short_form_video" && (
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
            )}
            {(document.doc_type === "social_post" || document.doc_type === "short_form_video") && (
              <div className="prop-field">
                <label>Descript share URL</label>
                <input
                  className="prop-input"
                  type="url"
                  placeholder="https://share.descript.com/..."
                  defaultValue={document.descript_url ?? ""}
                  onBlur={async (e) => {
                    const val = e.target.value.trim();
                    if (val !== (document.descript_url ?? "")) {
                      await updateDoc({ id: document._id, descript_url: val || undefined });
                    }
                  }}
                />
                {document.descript_url && (
                  <div className="descript-embed">
                    <iframe
                      src={document.descript_url.replace("/view/", "/embed/")}
                      title="Descript embed"
                      className="descript-iframe"
                      allow="autoplay; fullscreen"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Type-specific fields */}
        {document.doc_type === "podcast" && (
          <div className="panel-type-fields">
            <div className="type-fields-header">Podcast / YouTube</div>

            <div className="prop-field">
              <label>Title variants (A/B)</label>
              <input
                className="prop-input"
                type="text"
                placeholder="Title A..."
                defaultValue={document.title_variants?.[0] ?? ""}
                onBlur={async (e) => {
                  const val = e.target.value.trim();
                  const next = [...(document.title_variants ?? [])];
                  while (next.length < 2) next.push("");
                  next[0] = val;
                  await updateDoc({ id: document._id, title_variants: next });
                }}
              />
              <input
                className="prop-input"
                type="text"
                placeholder="Title B..."
                defaultValue={document.title_variants?.[1] ?? ""}
                onBlur={async (e) => {
                  const val = e.target.value.trim();
                  const next = [...(document.title_variants ?? [])];
                  while (next.length < 2) next.push("");
                  next[1] = val;
                  await updateDoc({ id: document._id, title_variants: next });
                }}
              />
            </div>

            <div className="prop-field">
              <label>YouTube thumbnails (A/B)</label>
              <div className="thumbnail-grid thumbnail-grid-ab">
                {[0, 1, 2].map((slot) => {
                  const url = document.thumbnail_urls?.[slot] || "";
                  const label = `A/B ${slot + 1}`;
                  const slotTarget = `slot-${slot}` as const;
                  const isUploading = uploadState?.target === slotTarget;
                  return (
                    <div
                      key={slot}
                      className={`thumbnail-slot ${url ? "has-image" : ""} ${isUploading ? "uploading" : ""}`}
                      onClick={(e) => {
                        if (uploadState) return;
                        // Ignore clicks on the clear button
                        if ((e.target as HTMLElement).closest(".thumbnail-slot-clear")) return;
                        slotFileInputs.current[slot]?.click();
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.add("drag-over");
                      }}
                      onDragLeave={(e) => {
                        e.currentTarget.classList.remove("drag-over");
                      }}
                      onDrop={async (e) => {
                        e.preventDefault();
                        e.currentTarget.classList.remove("drag-over");
                        const file = e.dataTransfer.files[0];
                        if (file) await uploadFile(file, slotTarget);
                      }}
                    >
                      <input
                        ref={(el) => {
                          slotFileInputs.current[slot] = el;
                        }}
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) await uploadFile(file, slotTarget);
                          e.target.value = "";
                        }}
                      />
                      {url ? (
                        <>
                          <img src={url} alt={label} />
                          <button
                            className="thumbnail-slot-clear"
                            onClick={(e) => {
                              e.stopPropagation();
                              clearThumbnailSlot({ id: document._id, slot });
                            }}
                            title="Remove"
                          >
                            ×
                          </button>
                        </>
                      ) : (
                        <div className="thumbnail-slot-placeholder">
                          <div className="thumbnail-slot-label">{label}</div>
                          <div className="thumbnail-slot-hint">
                            {isUploading ? `${uploadState?.percent ?? 0}%` : "Click or drop"}
                          </div>
                        </div>
                      )}
                      {isUploading && (
                        <div className="dropzone-progress">
                          <div className="dropzone-progress-bar" style={{ width: `${uploadState?.percent ?? 0}%` }} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="prop-field">
              <label>Blog post thumbnail (watercolor)</label>
              <div className="thumbnail-grid thumbnail-grid-watercolor">
                {(() => {
                  const slot = 3;
                  const url = document.thumbnail_urls?.[slot] || "";
                  const label = "Watercolor";
                  const slotTarget = `slot-${slot}` as const;
                  const isUploading = uploadState?.target === slotTarget;
                  return (
                    <div
                      className={`thumbnail-slot ${url ? "has-image" : ""} ${isUploading ? "uploading" : ""}`}
                      onClick={(e) => {
                        if (uploadState) return;
                        if ((e.target as HTMLElement).closest(".thumbnail-slot-clear")) return;
                        slotFileInputs.current[slot]?.click();
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.add("drag-over");
                      }}
                      onDragLeave={(e) => {
                        e.currentTarget.classList.remove("drag-over");
                      }}
                      onDrop={async (e) => {
                        e.preventDefault();
                        e.currentTarget.classList.remove("drag-over");
                        const file = e.dataTransfer.files[0];
                        if (file) await uploadFile(file, slotTarget);
                      }}
                    >
                      <input
                        ref={(el) => {
                          slotFileInputs.current[slot] = el;
                        }}
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) await uploadFile(file, slotTarget);
                          e.target.value = "";
                        }}
                      />
                      {url ? (
                        <>
                          <img src={url} alt={label} />
                          <button
                            className="thumbnail-slot-clear"
                            onClick={(e) => {
                              e.stopPropagation();
                              clearThumbnailSlot({ id: document._id, slot });
                            }}
                            title="Remove"
                          >
                            ×
                          </button>
                        </>
                      ) : (
                        <div className="thumbnail-slot-placeholder">
                          <div className="thumbnail-slot-label">{label}</div>
                          <div className="thumbnail-slot-hint">
                            {isUploading ? `${uploadState?.percent ?? 0}%` : "Click or drop"}
                          </div>
                        </div>
                      )}
                      {isUploading && (
                        <div className="dropzone-progress">
                          <div className="dropzone-progress-bar" style={{ width: `${uploadState?.percent ?? 0}%` }} />
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>

            <div className="prop-field">
              <label>Descript share URL</label>
              <input
                className="prop-input"
                type="url"
                placeholder="https://share.descript.com/..."
                defaultValue={document.descript_url ?? ""}
                onBlur={async (e) => {
                  const val = e.target.value.trim();
                  if (val !== (document.descript_url ?? "")) {
                    await updateDoc({
                      id: document._id,
                      descript_url: val || undefined,
                    });
                  }
                }}
              />
              {document.descript_url && (
                <div className="descript-embed">
                  <iframe
                    src={document.descript_url.replace("/view/", "/embed/")}
                    title="Descript embed"
                    className="descript-iframe"
                    allow="autoplay; fullscreen"
                  />
                </div>
              )}
            </div>

            <div className="prop-field">
              <label>Polished transcript (Webflow blog HTML box)</label>
              <textarea
                className="prop-textarea"
                placeholder="Polished transcript that gets ported to the Webflow blog..."
                defaultValue={document.polished_transcript ?? ""}
                rows={6}
                onBlur={async (e) => {
                  const val = e.target.value;
                  if (val !== (document.polished_transcript ?? "")) {
                    await updateDoc({
                      id: document._id,
                      polished_transcript: val || undefined,
                    });
                  }
                }}
              />
            </div>

            <div className="prop-field">
              <label>YouTube show notes</label>
              <textarea
                className="prop-textarea"
                placeholder="Show notes for YouTube description..."
                defaultValue={document.youtube_show_notes ?? ""}
                rows={4}
                onBlur={async (e) => {
                  const val = e.target.value;
                  if (val !== (document.youtube_show_notes ?? "")) {
                    await updateDoc({
                      id: document._id,
                      youtube_show_notes: val || undefined,
                    });
                  }
                }}
              />
            </div>

            <div className="prop-field">
              <label>Blog meta description (Webflow SEO, 155 char target)</label>
              <textarea
                className="prop-textarea"
                placeholder="Meta description for the Webflow blog post..."
                defaultValue={document.meta_description ?? ""}
                rows={2}
                onBlur={async (e) => {
                  const val = e.target.value.trim();
                  if (val !== (document.meta_description ?? "")) {
                    await updateDoc({ id: document._id, meta_description: val || undefined } as any);
                  }
                }}
              />
              {document.meta_description && (
                <span className={`prop-char-count ${document.meta_description.length > 155 ? "over" : ""}`}>
                  {document.meta_description.length}/155
                </span>
              )}
            </div>
          </div>
        )}

        {document.doc_type === "newsletter" && (
          <div className="panel-type-fields">
            <div className="type-fields-header">Newsletter</div>
            <div className="prop-field">
              <label>Subject line</label>
              <input
                className="prop-input"
                type="text"
                placeholder="Subject line (distinct from title)..."
                defaultValue={document.newsletter_subject ?? ""}
                onBlur={async (e) => {
                  const val = e.target.value.trim();
                  if (val !== (document.newsletter_subject ?? "")) {
                    await updateDoc({
                      id: document._id,
                      newsletter_subject: val || undefined,
                    });
                  }
                }}
              />
            </div>
            <div className="prop-field">
              <label>Preview text</label>
              <input
                className="prop-input"
                type="text"
                placeholder="Preview text shown under subject in inbox..."
                defaultValue={document.newsletter_preview ?? ""}
                onBlur={async (e) => {
                  const val = e.target.value.trim();
                  if (val !== (document.newsletter_preview ?? "")) {
                    await updateDoc({
                      id: document._id,
                      newsletter_preview: val || undefined,
                    });
                  }
                }}
              />
            </div>
          </div>
        )}

        {document.doc_type === "short_form_video" && (
          <div className="panel-type-fields">
            <div className="type-fields-header">Short-Form Video</div>

            <div className="prop-field">
              <label>On-screen text (Goldman-first, prefix your pick with ★)</label>
              <textarea
                className="prop-input"
                rows={14}
                placeholder={`★ your picked hook\n\nGOLDMAN-STYLE (prioritize these)\n1. ...\n2. ...\n\nOTHER STYLES\n13. [polarizing] ...\n14. [story starter] ...`}
                defaultValue={document.notes ?? ""}
                onBlur={async (e) => {
                  const val = e.target.value;
                  if (val !== (document.notes ?? "")) {
                    await updateDoc({ id: document._id, notes: val || undefined });
                  }
                }}
              />
            </div>

            {document.transcript && (
              <div className="prop-field">
                <label>Transcript (read-only)</label>
                <div className="short-form-transcript">{document.transcript}</div>
              </div>
            )}
          </div>
        )}

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
          {WORKSPACE.scheduler === "zernio" && (
            document.zernio_post_id ? (
              <span className="btn-action btn-action-scheduled" title={`Zernio post ${document.zernio_post_id}`}>
                ✓ Scheduled in Zernio
              </span>
            ) : (
              <button
                className="btn-action btn-action-primary"
                disabled={publishing || !bodyDraft.trim() || !document.publish_date}
                title={
                  !bodyDraft.trim()
                    ? "Add a caption first"
                    : !document.publish_date
                      ? "Set a publish date/time first"
                      : "Send this post to Zernio for scheduling"
                }
                onClick={async () => {
                  setPublishing(true);
                  try {
                    await publishToZernio({ documentId: document._id });
                  } catch (err) {
                    alert(`Publish failed: ${err instanceof Error ? err.message : String(err)}`);
                  } finally {
                    setPublishing(false);
                  }
                }}
              >
                {publishing ? "Publishing..." : "Publish to Feed"}
              </button>
            )
          )}
          {document.zernio_error && !document.zernio_post_id && (
            <span className="char-counter over" title={document.zernio_error}>
              Last error: {document.zernio_error.slice(0, 60)}
            </span>
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
              href={`${PROOF_BASE}/d/${document.proof_slug}?token=${document.proof_token}&theme=writer`}
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
              src={`${PROOF_BASE}/d/${document.proof_slug}?token=${document.proof_token}&theme=writer`}
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
          {parentDoc && (
            <div className="links-row">
              <label>Part of</label>
              <span className="link-chip parent-chip" onClick={() => onClose()}>
                ↑ {parentDoc.title}
              </span>
              <button
                className="link-unlink"
                title="Unlink from parent"
                onClick={async () => {
                  await updateDoc({ id: document._id, parent_id: undefined as any });
                }}
              >
                ×
              </button>
            </div>
          )}
          <div className="links-children">
            <label>Linked ({children?.length ?? 0})</label>
            <div className="children-list">
              {children?.map((c) => (
                <span key={c._id} className="link-chip child-chip">
                  {c.platform && <span className="chip-dot" style={{ background: `var(--platform-${c.platform})` }} />}
                  {c.title}
                </span>
              ))}
              <button
                className="link-add-btn"
                onClick={() => {
                  setChildPickerOpen((v) => !v);
                  setChildSearch("");
                }}
              >
                {childPickerOpen ? "× Cancel" : "+ Add linked child"}
              </button>
            </div>
          </div>
          {childPickerOpen && (
            <div className="child-picker">
              <div className="child-picker-section">
                <div className="child-picker-header">Create new</div>
                <div className="child-picker-buttons">
                  {[
                    { type: "social_post", label: "Social Post" },
                    { type: "short_form_video", label: "Short-Form Video" },
                    { type: "blog_draft", label: "Blog" },
                    { type: "newsletter", label: "Newsletter" },
                    { type: "note", label: "Note" },
                  ].map((opt) => (
                    <button
                      key={opt.type}
                      className="child-picker-create-btn"
                      onClick={async () => {
                        await createDoc({
                          title: `New ${opt.label}`,
                          doc_type: opt.type as any,
                          author: "Charlie",
                          parent_id: document._id,
                        });
                        setChildPickerOpen(false);
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="child-picker-section">
                <div className="child-picker-header">Or link existing</div>
                <input
                  type="text"
                  className="child-picker-search"
                  placeholder="Search docs..."
                  value={childSearch}
                  onChange={(e) => setChildSearch(e.target.value)}
                  autoFocus
                />
                <div className="child-picker-list">
                  {allDocs
                    ?.filter((d) => {
                      if (d._id === document._id) return false;
                      if (d.parent_id) return false;
                      if (!childSearch) return true;
                      return d.title.toLowerCase().includes(childSearch.toLowerCase());
                    })
                    .slice(0, 10)
                    .map((d) => (
                      <button
                        key={d._id}
                        className="child-picker-result"
                        onClick={async () => {
                          await updateDoc({ id: d._id, parent_id: document._id });
                          setChildPickerOpen(false);
                        }}
                      >
                        {d.platform && (
                          <span
                            className="chip-dot"
                            style={{ background: `var(--platform-${d.platform})` }}
                          />
                        )}
                        <span className="child-picker-result-title">{d.title}</span>
                        <span className="child-picker-result-type">{d.doc_type}</span>
                      </button>
                    ))}
                  {allDocs && allDocs.filter((d) => d._id !== document._id && !d.parent_id && (!childSearch || d.title.toLowerCase().includes(childSearch.toLowerCase()))).length === 0 && (
                    <div className="child-picker-empty">No unlinked docs match.</div>
                  )}
                </div>
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
