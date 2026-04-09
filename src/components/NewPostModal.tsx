import { useState } from "react";

type DocType = "social_post" | "short_form_video" | "blog_draft" | "podcast" | "newsletter" | "note";
type Platform = "x" | "linkedin" | "instagram" | "facebook" | "tiktok" | "substack" | "webflow" | "beehiiv" | "youtube";

interface Props {
  onClose: () => void;
  onCreate: (data: {
    title: string;
    doc_type: DocType;
    platform?: Platform;
    body?: string;
  }) => void;
}

const CONTENT_TYPES: { value: DocType; label: string; icon: string; description: string }[] = [
  { value: "social_post", label: "Social Post", icon: "💬", description: "LinkedIn, X, Facebook" },
  { value: "short_form_video", label: "Short-Form Video", icon: "🎬", description: "Reels, TikTok, Shorts" },
  { value: "podcast", label: "Podcast / YouTube", icon: "🎙", description: "Episode + blog + clips" },
  { value: "blog_draft", label: "Blog / SEO", icon: "📝", description: "Webflow, Substack" },
  { value: "newsletter", label: "Newsletter", icon: "📧", description: "Beehiiv, Substack" },
  { value: "note", label: "Note", icon: "📌", description: "Internal" },
];

const PLATFORMS_FOR_TYPE: Record<DocType, { value: Platform; label: string; color: string }[]> = {
  social_post: [
    { value: "linkedin", label: "LinkedIn", color: "#0A66C2" },
    { value: "x", label: "X", color: "#1E1E1E" },
    { value: "facebook", label: "Facebook", color: "#1877F2" },
  ],
  short_form_video: [
    { value: "instagram", label: "Instagram", color: "#E1306C" },
    { value: "tiktok", label: "TikTok", color: "#010101" },
    { value: "youtube", label: "YouTube Shorts", color: "#FF0000" },
  ],
  podcast: [
    { value: "youtube", label: "YouTube", color: "#FF0000" },
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
  const [docType, setDocType] = useState<DocType>("social_post");
  const [platform, setPlatform] = useState<Platform>("linkedin");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalTitle = title.trim() || (body.trim() ? body.trim().slice(0, 60).replace(/\n/g, " ") + (body.trim().length > 60 ? "..." : "") : "Untitled");
    const platforms = PLATFORMS_FOR_TYPE[docType];
    onCreate({
      title: finalTitle,
      doc_type: docType,
      platform: platforms.length > 0 ? platform : undefined,
      body: body.trim() || undefined,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  };

  const activePlatforms = PLATFORMS_FOR_TYPE[docType];

  return (
    <div className="modal-overlay" onClick={onClose} onKeyDown={handleKeyDown}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>New Content</h2>
          <button className="btn-ghost" onClick={onClose}>
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label>Content Type</label>
            <div className="content-type-grid">
              {CONTENT_TYPES.map((ct) => (
                <button
                  key={ct.value}
                  type="button"
                  className={`content-type-option ${docType === ct.value ? "selected" : ""}`}
                  onClick={() => {
                    setDocType(ct.value);
                    const first = PLATFORMS_FOR_TYPE[ct.value][0];
                    if (first) setPlatform(first.value);
                  }}
                >
                  <span className="ct-icon">{ct.icon}</span>
                  <span className="ct-label">{ct.label}</span>
                  <span className="ct-desc">{ct.description}</span>
                </button>
              ))}
            </div>
          </div>

          {activePlatforms.length > 0 && (
            <div className="form-field">
              <label>Platform</label>
              <div className="platform-selector">
                {activePlatforms.map((p) => (
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
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={docType === "social_post" ? "Optional — auto-generates from body" : "Title"}
              autoFocus
            />
          </div>

          <div className="form-field">
            <label htmlFor="body">{docType === "social_post" ? "Post" : "Draft (optional)"}</label>
            <textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Start writing..."
              rows={docType === "social_post" ? 6 : 3}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={!title.trim() && !body.trim()}>
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
