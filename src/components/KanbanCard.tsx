import type { Doc } from "../../convex/_generated/dataModel";

const PLATFORM_ICONS: Record<string, string> = {
  x: "𝕏",
  linkedin: "in",
  instagram: "📷",
  facebook: "f",
  tiktok: "♪",
  substack: "✉",
  webflow: "◆",
  beehiiv: "🐝",
};

interface Props {
  document: Doc<"documents">;
  onClick: () => void;
}

export function KanbanCard({ document, onClick }: Props) {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("text/plain", document._id);
    e.dataTransfer.effectAllowed = "move";
    (e.target as HTMLElement).classList.add("card-dragging");
  };

  const handleDragEnd = (e: React.DragEvent) => {
    (e.target as HTMLElement).classList.remove("card-dragging");
  };

  const platformIcon = document.platform
    ? PLATFORM_ICONS[document.platform] ?? ""
    : "";

  const preview =
    document.body && document.body.length > 120
      ? document.body.slice(0, 120) + "..."
      : document.body;

  return (
    <div
      className="kanban-card"
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={onClick}
    >
      <div className="card-top">
        {platformIcon && <span className="card-platform">{platformIcon}</span>}
        <span className="card-title">{document.title}</span>
      </div>
      {preview && <p className="card-preview">{preview}</p>}
      <div className="card-meta">
        <span className="card-author">{document.author}</span>
        {document.scheduled_date && (
          <span className="card-date">
            {new Date(document.scheduled_date).toLocaleDateString()}
          </span>
        )}
        {document.tags && document.tags.length > 0 && (
          <div className="card-tags">
            {document.tags.map((tag) => (
              <span key={tag} className="card-tag">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
