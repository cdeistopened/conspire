import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Doc } from "../../convex/_generated/dataModel";

const PLATFORM_CONFIG: Record<string, { icon: string; color: string; label: string }> = {
  x: { icon: "𝕏", color: "#1E1E1E", label: "X" },
  linkedin: { icon: "in", color: "#0A66C2", label: "LinkedIn" },
  instagram: { icon: "IG", color: "#E1306C", label: "Instagram" },
  facebook: { icon: "f", color: "#1877F2", label: "Facebook" },
  tiktok: { icon: "TT", color: "#010101", label: "TikTok" },
  substack: { icon: "S", color: "#FF6719", label: "Substack" },
  webflow: { icon: "W", color: "#4353FF", label: "Webflow" },
  beehiiv: { icon: "B", color: "#D4A200", label: "Beehiiv" },
};

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

interface Props {
  document: Doc<"documents">;
  onClick: () => void;
}

export function KanbanCard({ document, onClick }: Props) {
  const children = useQuery(api.documents.listByParent, { parent_id: document._id });
  const childCount = children?.length ?? 0;

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("text/plain", document._id);
    e.dataTransfer.effectAllowed = "move";
    (e.target as HTMLElement).classList.add("card-dragging");
  };

  const handleDragEnd = (e: React.DragEvent) => {
    (e.target as HTMLElement).classList.remove("card-dragging");
  };

  const platform = document.platform ? PLATFORM_CONFIG[document.platform] : null;

  const preview =
    document.body && document.body.length > 100
      ? document.body.slice(0, 100) + "..."
      : document.body;

  const accentColor = platform?.color ?? "#D4CEC4";

  return (
    <div
      className="kanban-card"
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={onClick}
      style={{ "--card-accent": accentColor } as React.CSSProperties}
    >
      <div className="card-top">
        {platform && (
          <span
            className="card-platform-badge"
            style={{ backgroundColor: platform.color }}
            title={platform.label}
          >
            {platform.icon}
          </span>
        )}
        <span className="card-title">{document.title}</span>
      </div>
      {document.thumbnail_url && (
        <div className="card-thumbnail">
          <img src={document.thumbnail_url} alt="" />
        </div>
      )}
      {preview && <p className="card-preview">{preview}</p>}
      <div className="card-meta">
        {childCount > 0 && (
          <span className="card-children-badge" title={`${childCount} linked item${childCount > 1 ? "s" : ""}`}>
            {childCount} spoke{childCount > 1 ? "s" : ""}
          </span>
        )}
        {document.parent_id && (
          <span className="card-child-indicator" title="Linked to parent">↩</span>
        )}
        <span className="card-author">{document.author}</span>
        <span className="card-time">{timeAgo(document._creationTime)}</span>
        {document.scheduled_date && (
          <span className="card-date">
            {new Date(document.scheduled_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
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
