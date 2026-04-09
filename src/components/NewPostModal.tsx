import { useState } from "react";

type Platform = "x" | "linkedin" | "instagram" | "facebook" | "tiktok" | "substack" | "webflow" | "beehiiv";
type DocType = "social_post" | "blog_draft" | "newsletter" | "note";

interface Props {
  onClose: () => void;
  onCreate: (data: {
    title: string;
    platform: Platform;
    doc_type: DocType;
    body?: string;
  }) => void;
}

const DOC_TYPES = [
  { value: "social_post" as const, label: "Social Post" },
  { value: "blog_draft" as const, label: "Blog / SEO" },
  { value: "newsletter" as const, label: "Newsletter" },
  { value: "note" as const, label: "Note" },
];

const PLATFORMS: Record<DocType, { value: Platform; label: string; color: string }[]> = {
  social_post: [
    { value: "x", label: "X", color: "#1E1E1E" },
    { value: "linkedin", label: "LinkedIn", color: "#0A66C2" },
    { value: "instagram", label: "Instagram", color: "#E1306C" },
    { value: "facebook", label: "Facebook", color: "#1877F2" },
    { value: "tiktok", label: "TikTok", color: "#010101" },
  ],
  blog_draft: [
    { value: "webflow", label: "Webflow", color: "#4353FF" },
    { value: "substack", label: "Substack", color: "#FF6719" },
  ],
  newsletter: [
    { value: "beehiiv", label: "Beehiiv", color: "#D4A200" },
    { value: "substack", label: "Substack", color: "#FF6719" },
  ],
  note: [],
};

export function NewPostModal({ onClose, onCreate }: Props) {
  const [title, setTitle] = useState("");
  const [docType, setDocType] = useState<DocType>("social_post");
  const [platform, setPlatform] = useState<Platform>("x");
  const [body, setBody] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalTitle = title.trim() || (body.trim() ? body.trim().slice(0, 60).replace(/\n/g, " ") + (body.trim().length > 60 ? "..." : "") : "Untitled post");
    const activePlatforms = PLATFORMS[docType];
    const finalPlatform = activePlatforms.length > 0 ? platform : "webflow";
    onCreate({ title: finalTitle, platform: finalPlatform, doc_type: docType, body: body.trim() || undefined });
  };

  // Close on Escape
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose} onKeyDown={handleKeyDown}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>New Post</h2>
          <button className="btn-ghost" onClick={onClose}>
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label>Type</label>
            <div className="platform-selector">
              {DOC_TYPES.map((dt) => (
                <button
                  key={dt.value}
                  type="button"
                  className={`platform-option ${docType === dt.value ? "selected" : ""}`}
                  onClick={() => {
                    setDocType(dt.value);
                    const first = PLATFORMS[dt.value][0];
                    if (first) setPlatform(first.value);
                  }}
                >
                  {dt.label}
                </button>
              ))}
            </div>
          </div>
          <div className="form-field">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title (optional — auto-generates from body)"
              autoFocus
            />
          </div>
          {PLATFORMS[docType].length > 0 && (
            <div className="form-field">
              <label>Platform</label>
              <div className="platform-selector">
                {PLATFORMS[docType].map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    className={`platform-option ${platform === p.value ? "selected" : ""}`}
                    onClick={() => setPlatform(p.value)}
                  >
                    <span className="platform-dot" style={{ backgroundColor: p.color }} />
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="form-field">
            <label htmlFor="body">Draft (optional)</label>
            <textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Start writing or leave blank to draft in the editor..."
              rows={4}
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={!title.trim() && !body.trim()}>
              Create Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
