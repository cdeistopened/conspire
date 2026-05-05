import { useEffect, useState, useMemo } from "react";

type Post = {
  id: string;
  shortCode: string;
  type: string;
  url: string;
  timestamp: string;
  caption: string;
  likes: number | null;
  comments: number | null;
  views: number | null;
  isVideo: boolean;
  displayUrl: string;
};

type Snapshot = {
  capturedAt: string;
  username: string;
  fullName: string;
  biography: string;
  profilePicUrl: string;
  followers: number;
  following: number;
  postsTotal: number;
  posts: Post[];
};

type WindowKey = 7 | 30 | 90 | 365;
const WINDOW_LABELS: Record<WindowKey, string> = {
  7: "7 days",
  30: "30 days",
  90: "90 days",
  365: "1 year",
};

const fmt = (n: number | null | undefined) =>
  typeof n === "number" && Number.isFinite(n) ? n.toLocaleString("en-US") : "—";

const fmtCompact = (n: number | null | undefined) => {
  if (typeof n !== "number" || !Number.isFinite(n)) return "—";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString("en-US");
};

const fmtDelta = (n: number) => {
  if (n === 0) return "no change";
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toLocaleString("en-US")}`;
};

function daysSince(isoTs: string): number {
  return Math.floor((Date.now() - new Date(isoTs).getTime()) / (1000 * 60 * 60 * 24));
}

function formatTs(isoTs: string): string {
  const d = new Date(isoTs);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function aggregateWindow(posts: Post[], days: number) {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  const inWindow = posts.filter((p) => new Date(p.timestamp).getTime() >= cutoff);
  const views = inWindow.reduce((s, p) => s + (p.views ?? 0), 0);
  const likes = inWindow.reduce((s, p) => s + (p.likes ?? 0), 0);
  const comments = inWindow.reduce((s, p) => s + (p.comments ?? 0), 0);
  return {
    posts: inWindow.length,
    views,
    likes,
    comments,
    avgViews: inWindow.length ? Math.round(views / inWindow.length) : 0,
    avgLikes: inWindow.length ? Math.round(likes / inWindow.length) : 0,
  };
}

function followerDeltaForWindow(snapshots: Snapshot[], days: number): number | null {
  if (snapshots.length < 2) return null;
  const latest = snapshots[snapshots.length - 1];
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  // Find the snapshot closest to (but not after) the cutoff
  const eligible = snapshots
    .slice(0, -1)
    .filter((s) => new Date(s.capturedAt).getTime() <= Date.now())
    .reverse();
  const baseline = eligible.find((s) => new Date(s.capturedAt).getTime() <= cutoff);
  if (!baseline) return null;
  return latest.followers - baseline.followers;
}

export function AudienceView() {
  const [snapshots, setSnapshots] = useState<Snapshot[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/data/ig-snapshots.json")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data: Snapshot[]) => setSnapshots(data))
      .catch((e) => setError(e.message));
  }, []);

  const latest = useMemo(() => snapshots?.[snapshots.length - 1] ?? null, [snapshots]);
  const previous = useMemo(
    () => (snapshots && snapshots.length > 1 ? snapshots[snapshots.length - 2] : null),
    [snapshots]
  );

  const windows = useMemo(() => {
    if (!latest) return null;
    return {
      7: aggregateWindow(latest.posts, 7),
      30: aggregateWindow(latest.posts, 30),
      90: aggregateWindow(latest.posts, 90),
      365: aggregateWindow(latest.posts, 365),
    } as Record<WindowKey, ReturnType<typeof aggregateWindow>>;
  }, [latest]);

  const topPosts = useMemo(() => {
    if (!latest) return [];
    return [...latest.posts]
      .map((p) => ({ ...p, score: p.views ?? p.likes ?? 0 }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 12);
  }, [latest]);

  if (error) {
    return (
      <div style={{ padding: 32, color: "#a00" }}>
        Failed to load IG snapshot: {error}
        <p style={{ marginTop: 12, fontSize: 13, color: "#666" }}>
          Run <code>node scripts/fetch-ig-snapshot.cjs</code> to seed{" "}
          <code>public/data/ig-snapshots.json</code>.
        </p>
      </div>
    );
  }

  if (!snapshots || !latest || !windows) {
    return <div style={{ padding: 32, color: "#666" }}>Loading audience snapshot…</div>;
  }

  const followerDelta = previous ? latest.followers - previous.followers : 0;

  return (
    <div style={{ padding: "24px 32px", maxWidth: 1200, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 32 }}>
        {latest.profilePicUrl && (
          <img
            src={latest.profilePicUrl}
            alt={latest.username}
            style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover" }}
          />
        )}
        <div style={{ flex: 1 }}>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>
            @{latest.username}
          </h1>
          <p style={{ margin: "4px 0 0", color: "#666", fontSize: 14 }}>
            Snapshot {formatTs(latest.capturedAt)} ·{" "}
            {previous
              ? `${daysSince(previous.capturedAt)}d since previous`
              : "first snapshot — run daily for follower trends"}{" "}
            · {latest.posts.length} posts captured
          </p>
        </div>
      </div>

      {/* Headline metrics */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
          marginBottom: 32,
        }}
      >
        <MetricCard
          label="Followers"
          value={fmt(latest.followers)}
          sublabel={
            previous
              ? `${fmtDelta(followerDelta)} since ${formatTs(previous.capturedAt)}`
              : "Baseline snapshot"
          }
          tone={followerDelta > 0 ? "good" : followerDelta < 0 ? "danger" : "muted"}
        />
        <MetricCard label="Following" value={fmt(latest.following)} sublabel="Accounts followed" />
        <MetricCard label="Total posts" value={fmt(latest.postsTotal)} sublabel="Lifetime" />
        <MetricCard
          label="Total views captured"
          value={fmtCompact(
            latest.posts.reduce((s, p) => s + (p.views ?? 0), 0)
          )}
          sublabel={`Across ${latest.posts.length} captured posts`}
        />
      </div>

      {/* Time-window breakdown */}
      <h2 style={{ fontSize: 18, fontWeight: 600, margin: "0 0 16px" }}>
        Engagement by window
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
          marginBottom: 32,
        }}
      >
        {([7, 30, 90, 365] as WindowKey[]).map((w) => {
          const agg = windows[w];
          const followerDeltaW = followerDeltaForWindow(snapshots, w);
          return (
            <div
              key={w}
              style={{
                background: "#fff",
                border: "1px solid #e5e5e5",
                borderRadius: 8,
                padding: "16px 20px",
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  color: "#666",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  marginBottom: 10,
                }}
              >
                Last {WINDOW_LABELS[w]}
              </div>
              <Row label="Posts" value={fmt(agg.posts)} />
              <Row label="Views" value={fmtCompact(agg.views)} />
              <Row label="Likes" value={fmtCompact(agg.likes)} />
              <Row label="Comments" value={fmtCompact(agg.comments)} />
              <Row
                label="Avg views/post"
                value={fmtCompact(agg.avgViews)}
                muted
              />
              <Row
                label="Followers Δ"
                value={
                  followerDeltaW === null
                    ? "snapshot needed"
                    : fmtDelta(followerDeltaW)
                }
                muted={followerDeltaW === null}
                tone={
                  followerDeltaW === null
                    ? undefined
                    : followerDeltaW > 0
                      ? "good"
                      : followerDeltaW < 0
                        ? "danger"
                        : undefined
                }
              />
            </div>
          );
        })}
      </div>

      {/* Top posts */}
      <h2 style={{ fontSize: 18, fontWeight: 600, margin: "32px 0 16px" }}>
        Top posts (by views, or likes if not video)
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 16,
        }}
      >
        {topPosts.map((p) => (
          <a
            key={p.id}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "block",
              background: "#fff",
              border: "1px solid #e5e5e5",
              borderRadius: 8,
              overflow: "hidden",
              textDecoration: "none",
              color: "inherit",
              transition: "transform 150ms",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
          >
            <div
              style={{
                width: "100%",
                aspectRatio: "1 / 1",
                background: "#f5f5f5",
                backgroundImage: p.displayUrl ? `url(${p.displayUrl})` : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
                position: "relative",
              }}
            >
              {p.isVideo && (
                <span
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    background: "rgba(0,0,0,0.65)",
                    color: "white",
                    padding: "2px 8px",
                    borderRadius: 4,
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                >
                  REEL
                </span>
              )}
            </div>
            <div style={{ padding: 12 }}>
              <div style={{ display: "flex", gap: 12, fontSize: 13, marginBottom: 6 }}>
                {p.views !== null && (
                  <span style={{ color: "#000", fontWeight: 600 }}>
                    👁 {fmtCompact(p.views)}
                  </span>
                )}
                {p.likes !== null && (
                  <span style={{ color: "#666" }}>♥ {fmtCompact(p.likes)}</span>
                )}
                {p.comments !== null && (
                  <span style={{ color: "#666" }}>💬 {fmtCompact(p.comments)}</span>
                )}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "#444",
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {p.caption}
              </div>
              <div style={{ fontSize: 11, color: "#999", marginTop: 8 }}>
                {formatTs(p.timestamp)}
              </div>
            </div>
          </a>
        ))}
      </div>

      <p style={{ marginTop: 32, fontSize: 12, color: "#999" }}>
        {snapshots.length} snapshot{snapshots.length === 1 ? "" : "s"} stored. Window
        aggregates compute from the {latest.posts.length} most recent posts in each
        snapshot. Run <code>node scripts/fetch-ig-snapshot.cjs</code> daily for follower-Δ trend lines.
      </p>
    </div>
  );
}

function MetricCard({
  label,
  value,
  sublabel,
  tone,
}: {
  label: string;
  value: string;
  sublabel?: string;
  tone?: "good" | "danger" | "muted";
}) {
  const subColor = tone === "good" ? "#0a7d32" : tone === "danger" ? "#a01a1a" : "#666";
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e5e5e5",
        borderRadius: 8,
        padding: "16px 20px",
      }}
    >
      <div style={{ fontSize: 12, color: "#666", textTransform: "uppercase", letterSpacing: 0.5 }}>
        {label}
      </div>
      <div style={{ fontSize: 28, fontWeight: 600, marginTop: 4 }}>{value}</div>
      {sublabel && (
        <div style={{ fontSize: 12, color: subColor, marginTop: 4 }}>{sublabel}</div>
      )}
    </div>
  );
}

function Row({
  label,
  value,
  muted,
  tone,
}: {
  label: string;
  value: string;
  muted?: boolean;
  tone?: "good" | "danger";
}) {
  const color =
    tone === "good"
      ? "#0a7d32"
      : tone === "danger"
        ? "#a01a1a"
        : muted
          ? "#999"
          : "#000";
  return (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "4px 0" }}>
      <span style={{ color: "#666" }}>{label}</span>
      <span style={{ color, fontWeight: muted ? 400 : 600 }}>{value}</span>
    </div>
  );
}
