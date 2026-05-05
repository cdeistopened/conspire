#!/usr/bin/env node
/**
 * Fetches an Instagram snapshot for the RLM workspace via Apify and appends
 * it to public/data/ig-snapshots.json. The AudienceView component reads
 * that file at runtime and computes 7d/30d/90d/1yr window aggregates.
 *
 * Two Apify calls per run:
 *   1. instagram-profile-scraper (cheap)  -> follower count, bio, profile pic
 *   2. instagram-scraper (resultsLimit=100) -> the last ~100 posts with view counts
 *
 * Run: APIFY_TOKEN=... node scripts/fetch-ig-snapshot.cjs
 *      or: node scripts/fetch-ig-snapshot.cjs (if APIFY_TOKEN exported)
 *
 * Cron-friendly: idempotent, exit-coded, writes nothing if either call fails.
 */
const fs = require("fs");
const path = require("path");

const TOKEN = process.env.APIFY_TOKEN;
const USERNAME = process.env.IG_USERNAME || "drrichardlouismiller";
const POST_LIMIT = parseInt(process.env.IG_POST_LIMIT || "100", 10);
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
    throw new Error(`profile-scraper HTTP ${res.status}`);
  }
  const data = await res.json();
  const item = Array.isArray(data) ? data[0] : data;
  if (!item || !item.username) throw new Error("profile-scraper: no profile data");
  return item;
}

async function fetchPosts(username, limit) {
  const url = `https://api.apify.com/v2/acts/apify~instagram-scraper/run-sync-get-dataset-items?token=${TOKEN}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      directUrls: [`https://www.instagram.com/${username}/`],
      resultsType: "posts",
      resultsLimit: limit,
    }),
  });
  if (!res.ok) {
    throw new Error(`instagram-scraper HTTP ${res.status}`);
  }
  return res.json();
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
  const [profile, postsRaw] = await Promise.all([
    fetchProfile(USERNAME),
    fetchPosts(USERNAME, POST_LIMIT),
  ]);

  const posts = (Array.isArray(postsRaw) ? postsRaw : []).map(trimPost);

  const snapshot = {
    capturedAt: new Date().toISOString(),
    username: profile.username,
    fullName: profile.fullName,
    biography: profile.biography,
    profilePicUrl: profile.profilePicUrl,
    followers: profile.followersCount,
    following: profile.followsCount,
    postsTotal: profile.postsCount,
    posts,
  };

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
  if (existing.length > 365) existing = existing.slice(-365);

  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(existing, null, 2));

  console.log(
    `✓ snapshot saved (${existing.length} total) — ${snapshot.followers.toLocaleString()} followers, ${posts.length} posts`
  );
})().catch((err) => {
  console.error("✗", err.message);
  process.exit(2);
});
