type DocType = "social_post" | "short_form_video" | "blog_draft" | "podcast" | "newsletter" | "note";

interface Props {
  onClose: () => void;
  onCreate: (data: {
    title: string;
    doc_type: DocType;
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

export function NewPostModal({ onClose, onCreate }: Props) {
  const handlePick = (docType: DocType) => {
    const label = CONTENT_TYPES.find((ct) => ct.value === docType)?.label ?? "Untitled";
    onCreate({ title: label, doc_type: docType });
  };

  return (
    <div className="modal-overlay" onClick={onClose} onKeyDown={(e) => { if (e.key === "Escape") onClose(); }}>
      <div className="modal modal-compact" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>New Content</h2>
          <button className="btn-ghost" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="content-type-grid">
          {CONTENT_TYPES.map((ct) => (
            <button
              key={ct.value}
              className="content-type-option"
              onClick={() => handlePick(ct.value)}
            >
              <span className="ct-icon">{ct.icon}</span>
              <span className="ct-label">{ct.label}</span>
              <span className="ct-desc">{ct.description}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
