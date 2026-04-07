import { useState } from "react";

interface Props {
  onClose: () => void;
  onCreate: (data: {
    title: string;
    platform: "x" | "linkedin" | "instagram" | "facebook" | "tiktok";
    body?: string;
  }) => void;
}

const PLATFORMS = [
  { value: "x" as const, label: "X", color: "#1E1E1E" },
  { value: "linkedin" as const, label: "LinkedIn", color: "#0A66C2" },
  { value: "instagram" as const, label: "Instagram", color: "#E1306C" },
  { value: "facebook" as const, label: "Facebook", color: "#1877F2" },
  { value: "tiktok" as const, label: "TikTok", color: "#010101" },
];

export function NewPostModal({ onClose, onCreate }: Props) {
  const [title, setTitle] = useState("");
  const [platform, setPlatform] = useState<
    "x" | "linkedin" | "instagram" | "facebook" | "tiktok"
  >("x");
  const [body, setBody] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onCreate({ title: title.trim(), platform, body: body.trim() || undefined });
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
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's this post about?"
              autoFocus
            />
          </div>
          <div className="form-field">
            <label>Platform</label>
            <div className="platform-selector">
              {PLATFORMS.map((p) => (
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
            <button type="submit" className="btn-primary" disabled={!title.trim()}>
              Create Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
