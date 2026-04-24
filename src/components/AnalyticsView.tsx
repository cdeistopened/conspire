import { useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Doc } from "../../convex/_generated/dataModel";
import { WORKSPACE } from "../workspace";

type CommandRow = {
  rollup: Doc<"assetRollups">;
  document: Doc<"documents"> | null;
  surface: Doc<"externalSurfaces"> | null;
};

const BUCKET_LABELS: Record<string, string> = {
  falling_after_change: "Falling after change",
  rising_after_change: "Rising after change",
  published_unmeasured: "Published, unmeasured",
  changed_recently: "Changed recently",
  missing_metadata: "Missing metadata",
  unmatched_surface: "Unmatched surface",
  stable: "Stable",
};

const BUCKET_TONE: Record<string, string> = {
  falling_after_change: "danger",
  rising_after_change: "good",
  published_unmeasured: "warn",
  changed_recently: "note",
  missing_metadata: "warn",
  unmatched_surface: "muted",
  stable: "stable",
};

const fmt = (n: unknown) =>
  typeof n === "number" && Number.isFinite(n)
    ? n.toLocaleString("en-US")
    : "0";

const pct = (n: unknown) =>
  typeof n === "number" && Number.isFinite(n)
    ? `${n > 0 ? "+" : ""}${Math.round(n)}%`
    : "0%";

function metricValue(metrics: any) {
  return (
    metrics?.views ??
    metrics?.clicks ??
    metrics?.pageviews ??
    metrics?.sessions ??
    metrics?.impressions ??
    0
  );
}

function metricLabel(source?: string) {
  if (source === "gsc") return "clicks";
  if (source === "ga4") return "pageviews";
  if (source === "getlate") return "views";
  return "signals";
}

function cleanDate(ts?: number) {
  if (!ts) return "No change pin";
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function RowDetail({
  row,
  onClose,
}: {
  row: CommandRow;
  onClose: () => void;
}) {
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<
    "seo" | "content" | "publishing" | "technical" | "distribution" | "manual"
  >("manual");
  const createEvent = useMutation(api.analytics.createContentEvent);
  const events = useQuery(
    api.analytics.listEventsForDocument,
    row.document ? { documentId: row.document._id } : "skip"
  );

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = description.trim();
    if (!text) return;
    await createEvent({
      workspace: WORKSPACE.name,
      documentId: row.document?._id,
      actor: "Charlie",
      category,
      source: "manual",
      description: text,
    });
    setDescription("");
  };

  return (
    <aside className="analytics-detail">
      <div className="analytics-detail-header">
        <div>
          <div className="analytics-eyebrow">Asset detail</div>
          <h2>{row.rollup.assetTitle}</h2>
        </div>
        <button className="btn-ghost" onClick={onClose}>
          Close
        </button>
      </div>

      <div className="analytics-detail-grid">
        <div>
          <span>Source</span>
          <strong>{row.rollup.topSource ?? row.surface?.source ?? "none"}</strong>
        </div>
        <div>
          <span>7 day</span>
          <strong>{fmt(metricValue(row.rollup.metrics7))}</strong>
        </div>
        <div>
          <span>28 day</span>
          <strong>{fmt(metricValue(row.rollup.metrics28))}</strong>
        </div>
      </div>

      <div className="analytics-section">
        <div className="analytics-eyebrow">Recommendation</div>
        <p>{row.rollup.recommendation}</p>
      </div>

      {row.surface && (
        <div className="analytics-section">
          <div className="analytics-eyebrow">External surface</div>
          <p>
            {row.surface.platform ?? row.surface.source}
            {row.surface.url ? " · " : ""}
            {row.surface.url && (
              <a href={row.surface.url} target="_blank" rel="noreferrer">
                {row.surface.url}
              </a>
            )}
          </p>
        </div>
      )}

      <form className="analytics-log-form" onSubmit={submit}>
        <div className="analytics-eyebrow">Log change pin</div>
        <div className="analytics-log-row">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as any)}
          >
            <option value="manual">Manual</option>
            <option value="seo">SEO</option>
            <option value="content">Content</option>
            <option value="publishing">Publishing</option>
            <option value="technical">Technical</option>
            <option value="distribution">Distribution</option>
          </select>
          <button className="btn-primary" type="submit" disabled={!description.trim()}>
            Log
          </button>
        </div>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What changed?"
          rows={3}
        />
      </form>

      <div className="analytics-section">
        <div className="analytics-eyebrow">Timeline</div>
        {events?.length ? (
          <div className="analytics-timeline">
            {events.map((event) => (
              <div className="analytics-event" key={event._id}>
                <span>{cleanDate(event.timestamp)}</span>
                <strong>{event.description}</strong>
                <em>{event.actor} · {event.category}</em>
              </div>
            ))}
          </div>
        ) : (
          <p>No logged changes yet.</p>
        )}
      </div>
    </aside>
  );
}

export function AnalyticsView() {
  const data = useQuery(api.analytics.listCommandCenter, {
    workspace: WORKSPACE.name,
    limit: 80,
  });
  const [selected, setSelected] = useState<CommandRow | null>(null);

  const buckets = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const row of data?.rows ?? []) {
      counts[row.rollup.priorityBucket] =
        (counts[row.rollup.priorityBucket] ?? 0) + 1;
    }
    return counts;
  }, [data]);

  if (!data) {
    return (
      <div className="analytics-shell">
        <div className="analytics-loading">Loading analytics workspace...</div>
      </div>
    );
  }

  return (
    <div className="analytics-shell">
      <section className="analytics-hero">
        <div>
          <div className="analytics-eyebrow">OpenEd workspace intelligence</div>
          <h1>Operator Command Center</h1>
          <p>
            Assets ranked by what needs attention next. Data comes from Convex
            snapshots written by the local analytics sync.
          </p>
        </div>
        <div className="analytics-sync-card">
          <span>Last sync</span>
          <strong>
            {data.syncRuns[0]?.completedAt
              ? new Date(data.syncRuns[0].completedAt).toLocaleString()
              : "No sync yet"}
          </strong>
          <em>{data.syncRuns[0]?.status ?? "waiting"}</em>
        </div>
      </section>

      <section className="analytics-metrics">
        <div>
          <span>Total assets</span>
          <strong>{fmt(data.summary.totalAssets)}</strong>
        </div>
        <div>
          <span>Need attention</span>
          <strong>{fmt(data.summary.attentionCount)}</strong>
        </div>
        <div>
          <span>Unmatched surfaces</span>
          <strong>{fmt(data.summary.unmatchedCount)}</strong>
        </div>
        <div>
          <span>Falling</span>
          <strong>{fmt(buckets.falling_after_change)}</strong>
        </div>
      </section>

      <section className="analytics-board">
        <div className="analytics-board-header">
          <div>
            <div className="analytics-eyebrow">Priority queue</div>
            <h2>Next actions</h2>
          </div>
          <span>{data.rows.length} rows</span>
        </div>

        {data.rows.length === 0 ? (
          <div className="analytics-empty">
            Run the local sync script to populate asset rollups.
          </div>
        ) : (
          <div className="analytics-table">
            {data.rows.map((row: CommandRow) => {
              const bucket = row.rollup.priorityBucket;
              const tone = BUCKET_TONE[bucket] ?? "stable";
              const label = metricLabel(row.rollup.topSource);
              return (
                <button
                  key={row.rollup._id}
                  className="analytics-row"
                  onClick={() => setSelected(row)}
                >
                  <span className={`analytics-pill ${tone}`}>
                    {BUCKET_LABELS[bucket] ?? bucket}
                  </span>
                  <span className="analytics-title">
                    <strong>{row.rollup.assetTitle}</strong>
                    <em>
                      {row.document?.doc_type ?? row.rollup.assetType}
                      {row.rollup.status ? ` · ${row.rollup.status}` : ""}
                    </em>
                  </span>
                  <span className="analytics-stat">
                    <strong>{fmt(metricValue(row.rollup.metrics7))}</strong>
                    <em>7d {label}</em>
                  </span>
                  <span className="analytics-stat">
                    <strong>{pct((row.rollup.metrics7 as any)?.deltaPct)}</strong>
                    <em>vs prior</em>
                  </span>
                  <span className="analytics-latest">
                    <strong>{cleanDate(row.rollup.latestEventAt)}</strong>
                    <em>{row.rollup.latestEventDescription ?? row.rollup.recommendation}</em>
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {selected && (
        <RowDetail row={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
