import { useState } from "react";

interface Props {
  onClose: () => void;
  onCreate: (data: {
    title: string;
    platform: "x" | "linkedin" | "instagram" | "facebook" | "tiktok";
    body?: string;
  }) => void;
  creating?: boolean;
}

const PLATFORMS = [
  { value: "x" as const, label: "𝕏 Twitter" },
  { value: "linkedin" as const, label: "LinkedIn" },
  { value: "instagram" as const, label: "Instagram" },
  { value: "facebook" as const, label: "Facebook" },
  { value: "tiktok" as const, label: "TikTok" },
];

export function NewPostModal({ onClose, onCreate, creating }: Props) {
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

  return (
    <div className="modal-overlay" onClick={onClose}>
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
            <label htmlFor="platform">Platform</label>
            <select
              id="platform"
              value={platform}
              onChange={(e) =>
                setPlatform(
                  e.target.value as
                    | "x"
                    | "linkedin"
                    | "instagram"
                    | "facebook"
                    | "tiktok"
                )
              }
            >
              {PLATFORMS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="body">Draft (optional)</label>
            <textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Start writing or leave blank to draft in Proof..."
              rows={4}
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={!title.trim() || creating}>
              {creating ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
