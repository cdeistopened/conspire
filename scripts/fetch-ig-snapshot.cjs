#!/usr/bin/env node
/**
 * Fetches an Instagram snapshot for the RLM workspace via Apify and appends
 * it to public/data/ig-snapshots.json. The AudienceView component reads
 * that file at runtime.
 *
 * Run: APIFY_TOKEN=... node scripts/fetch-ig-snapshot.cjs
 *      or: node scripts/fetch-ig-snapshot.cjs (if APIFY_TOKEN exported)
 *
 * Cron-friendly: idempotent, exit-coded, writes nothing if Apify call fails.
 */
const fs = require("fs");
const path = require("path");

const TOKEN = process.env.APIFY_TOKEN;
const USERNAME = process.env.IG_USERNAME || "drrichardlouismiller";
const OUT_PATH = path.join(__dirname, "..", "public", "data", "ig-snapshots.json");

if (!TOKEN) {
  console.error("APIFY_TOKEN missing");
  process.exit(1);
}

async function fetchProfile(username) {
  const url = `https://api.apify.com/v2/acts/apify~instagram-profile-scraper/run-sync-get-dataset-items?token=${TOKEN}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usernames: [username] }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`apify HTTP ${res.status}: ${body.slice(0, 300)}`);
  }
  const data = await res.json();
  const item = Array.isArray(data) ? data[0] : data;
  if (!item || !item.username) {
    throw new Error("apify returned no profile data");
  }
  return item;
}

function trimPost(p) {
  return {
    id: p.id,
    shortCode: p.shortCode,
    type: p.type,
    url: p.url,
    timestamp: p.timestamp,
    caption: (p.caption || "").slice(0, 240),
    likes: p.likesCount ?? null,
    comments: p.commentsCount ?? null,
    views: p.videoViewCount ?? null,
    isVideo: !!p.videoUrl,
    displayUrl: p.displayUrl,
  };
}

(async () => {
  const profile = await fetchProfile(USERNAME);
  const snapshot = {
    capturedAt: new Date().toISOString(),
    username: profile.username,
    fullName: profile.fullName,
    biography: profile.biography,
    profilePicUrl: profile.profilePicUrl,
    followers: profile.followersCount,
    following: profile.followsCount,
    postsTotal: profile.postsCount,
    posts: (profile.latestPosts || []).map(trimPost),
  };

  // Read existing snapshots, append, write
  let existing = [];
  try {
    if (fs.existsSync(OUT_PATH)) {
      existing = JSON.parse(fs.readFileSync(OUT_PATH, "utf8")) || [];
      if (!Array.isArray(existing)) existing = [];
    }
  } catch (_) {
    existing = [];
  }
  existing.push(snapshot);

  // Keep last 365 snapshots (year of daily) — generous bound
  if (existing.length > 365) existing = existing.slice(-365);

  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(existing, null, 2));

  console.log(`✓ snapshot saved (${existing.length} total) — ${snapshot.followers.toLocaleString()} followers, ${snapshot.posts.length} recent posts`);
})().catch((err) => {
  console.error("✗", err.message);
  process.exit(2);
});
