import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Doc } from "../../convex/_generated/dataModel";

const PROOF_BASE = "https://www.proofeditor.ai";

const STATUS_OPTIONS = [
  { value: "draft" as const, label: "Draft" },
  { value: "review" as const, label: "Review" },
  { value: "approved" as const, label: "Approved" },
  { value: "scheduled" as const, label: "Scheduled" },
  { value: "posted" as const, label: "Posted" },
  { value: "archived" as const, label: "Archived" },
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
  const activity = useQuery(api.activity.listByDocument, {
    document: document._id,
  });

  const proofUrl = document.proof_slug
    ? document.proof_token
      ? `${PROOF_BASE}/d/${document.proof_slug}?token=${document.proof_token}`
      : `${PROOF_BASE}/d/${document.proof_slug}`
    : null;

  const handleStatusChange = async (
    status: Doc<"documents">["status"]
  ) => {
    await updateStatus({ id: document._id, status, actor: "Charlie" });
  };

  const handlePlatformChange = async (
    platform: Doc<"documents">["platform"]
  ) => {
    if (platform) {
      await updateDoc({ id: document._id, platform });
    }
  };

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
        <div className="panel-header">
          <div className="panel-header-left">
            <h2 className="panel-title">{document.title}</h2>
            <span className="panel-meta">
              {document.platform && PLATFORM_LABELS[document.platform]}
              {" · "}
              {document.author}
            </span>
          </div>
          <div className="panel-header-right">
            {proofUrl && (
              <a
                href={proofUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
              >
                Open in Proof ↗
              </a>
            )}
            <button className="btn-ghost panel-close" onClick={onClose}>
              &times;
            </button>
          </div>
        </div>

        <div className="panel-controls">
          <div className="control-group">
            <label>Status</label>
            <div className="status-pills">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s.value}
                  className={`status-pill ${document.status === s.value ? "active" : ""}`}
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

        <div className="panel-editor">
          {proofUrl ? (
            <iframe
              src={proofUrl}
              title="Proof Editor"
              className="proof-iframe"
            />
          ) : (
            <div className="panel-no-editor">
              <p>No Proof document linked.</p>
              {document.body && (
                <div className="panel-body-preview">{document.body}</div>
              )}
            </div>
          )}
        </div>

        {activity && activity.length > 0 && (
          <div className="panel-activity">
            <h3>Activity</h3>
            <ul className="activity-list">
              {[...activity].reverse().map((a) => (
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
