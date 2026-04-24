#!/usr/bin/env node
/**
 * OpenEd analytics sync for Conspire.
 *
 * Pulls local-secret sources (Getlate, GSC, GA4) and writes normalized
 * workspace intelligence snapshots into Convex. Browser/Railway code reads
 * Convex only and never receives external API keys.
 *
 * Usage:
 *   node scripts/sync-opened-analytics.mjs --dry-run
 *   node scripts/sync-opened-analytics.mjs
 *   node scripts/sync-opened-analytics.mjs --self-test
 */

import { createSign } from "node:crypto";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = "/Users/charliedeist/Root";
const VAULT = path.join(ROOT, "OpenEd Vault");
const PROJECT = path.resolve(__dirname, "..");
const WORKSPACE = "opened";
const DEFAULT_DAYS = 35;

const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run");
const selfTest = args.has("--self-test");
const daysArg = process.argv.find((arg) => arg.startsWith("--days="));
const days = daysArg ? Number(daysArg.split("=")[1]) : DEFAULT_DAYS;

function parseEnv(content) {
  const env = {};
  for (const raw of content.split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#") || !line.includes("=")) continue;
    const idx = line.indexOf("=");
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

async function loadEnvFile(file) {
  try {
    return parseEnv(await readFile(file, "utf8"));
  } catch {
    return {};
  }
}

async function loadConfig() {
  const [vaultEnv, localEnv, workspaceRaw] = await Promise.all([
    loadEnvFile(path.join(VAULT, ".env")),
    loadEnvFile(path.join(PROJECT, ".env.local")),
    readFile(path.join(PROJECT, "workspaces", "opened.json"), "utf8"),
  ]);
  return {
    env: { ...vaultEnv, ...localEnv, ...process.env },
    workspace: JSON.parse(workspaceRaw),
  };
}

function resolveVaultPath(value, fallback) {
  if (!value) return fallback;
  return path.isAbsolute(value) ? value : path.join(VAULT, value);
}

async function firstExistingPath(paths) {
  for (const candidate of paths.filter(Boolean)) {
    try {
      await access(candidate);
      return candidate;
    } catch {
      // Try the next known location.
    }
  }
  return paths.filter(Boolean)[0];
}

function dateString(date) {
  return date.toISOString().slice(0, 10);
}

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

function normalizeUrl(value) {
  if (!value) return "";
  try {
    const url = new URL(value, "https://opened.co");
    url.hash = "";
    url.search = "";
    return url.toString().replace(/\/$/, "").toLowerCase();
  } catch {
    return String(value).replace(/\/$/, "").toLowerCase();
  }
}

function pathFromUrl(value) {
  if (!value) return "";
  try {
    return new URL(value, "https://opened.co").pathname.replace(/\/$/, "");
  } catch {
    return "";
  }
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function metricNumber(...values) {
  for (const value of values) {
    const n = Number(value);
    if (Number.isFinite(n)) return n;
  }
  return undefined;
}

function addMetrics(a, b) {
  const out = { ...a };
  for (const [key, value] of Object.entries(b || {})) {
    if (typeof value === "number" && Number.isFinite(value)) {
      out[key] = (out[key] || 0) + value;
    }
  }
  return out;
}

function primaryValue(metrics) {
  return (
    metrics.views ??
    metrics.clicks ??
    metrics.pageviews ??
    metrics.sessions ??
    metrics.impressions ??
    0
  );
}

function buildMatcher(documents) {
  const byGetlate = new Map();
  const byUrl = new Map();
  const byPath = new Map();
  const titleSlugs = [];

  for (const doc of documents) {
    if (doc.zernio_post_id) byGetlate.set(doc.zernio_post_id, doc);
    if (doc.external_url) {
      byUrl.set(normalizeUrl(doc.external_url), doc);
      byPath.set(pathFromUrl(doc.external_url), doc);
    }
    titleSlugs.push([slugify(doc.title), doc]);
  }

  function findByUrl(value) {
    const normalized = normalizeUrl(value);
    const pathname = pathFromUrl(value);
    if (byUrl.has(normalized)) return byUrl.get(normalized);
    if (byPath.has(pathname)) return byPath.get(pathname);
    for (const [slug, doc] of titleSlugs) {
      if (slug && normalized.includes(slug)) return doc;
    }
    return null;
  }

  return {
    findGetlate(post) {
      return byGetlate.get(post._id) || findByUrl(post.platformPostUrl);
    },
    findUrl: findByUrl,
  };
}

async function getGoogleToken(credentialsPath) {
  const creds = JSON.parse(await readFile(credentialsPath, "utf8"));
  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT" })).toString("base64url");
  const payload = Buffer.from(JSON.stringify({
    iss: creds.client_email,
    scope: "https://www.googleapis.com/auth/analytics.readonly https://www.googleapis.com/auth/webmasters.readonly",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  })).toString("base64url");
  const input = `${header}.${payload}`;
  const sign = createSign("RSA-SHA256");
  sign.update(input);
  const jwt = `${input}.${sign.sign(creds.private_key, "base64url")}`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });
  const data = await res.json();
  if (!data.access_token) throw new Error(`Google auth failed: ${JSON.stringify(data)}`);
  return data.access_token;
}

async function getlate(pathname, apiKey) {
  const res = await fetch(`https://getlate.dev/api/v1${pathname}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Getlate ${pathname} failed: ${JSON.stringify(data)}`);
  return data;
}

async function fetchGetlate(profileId, apiKey) {
  const posts = [];
  for (let page = 1; page <= 10; page++) {
    const data = await getlate(`/analytics?profileId=${encodeURIComponent(profileId)}&page=${page}`, apiKey);
    const batch = data.posts || [];
    posts.push(...batch);
    if (batch.length < 50) break;
  }
  return posts;
}

async function fetchGsc(env, token) {
  const site = env.GSC_SITE_URL || "https://opened.co/";
  const end = dateString(daysAgo(3));
  const start = dateString(daysAgo(days + 3));
  const res = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(site)}/searchAnalytics/query`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        startDate: start,
        endDate: end,
        dimensions: ["date", "page"],
        rowLimit: 25000,
        type: "web",
        dimensionFilterGroups: [{
          filters: [{ dimension: "page", operator: "includingRegex", expression: "(/blog/|/tools/)" }],
        }],
      }),
    }
  );
  const data = await res.json();
  if (!res.ok) throw new Error(`GSC query failed: ${JSON.stringify(data)}`);
  return data.rows || [];
}

async function fetchGa4(env, token) {
  const propertyId = env.GA4_PROPERTY_ID || "451203520";
  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        dateRanges: [{ startDate: `${days}daysAgo`, endDate: "today" }],
        dimensions: [{ name: "date" }, { name: "pagePath" }, { name: "pageTitle" }],
        metrics: [
          { name: "screenPageViews" },
          { name: "sessions" },
          { name: "totalUsers" },
          { name: "engagementRate" },
        ],
        dimensionFilter: {
          filter: {
            fieldName: "pagePath",
            stringFilter: { matchType: "PARTIAL_REGEXP", value: "(/blog/|/tools/)" },
          },
        },
        limit: 25000,
      }),
    }
  );
  const data = await res.json();
  if (!res.ok) throw new Error(`GA4 query failed: ${JSON.stringify(data)}`);
  return data.rows || [];
}

function normalizeGetlate(posts, matcher) {
  const surfaces = [];
  const snapshots = [];
  for (const post of posts) {
    const doc = matcher.findGetlate(post);
    const engagement = post.engagement || post.analytics || {};
    const platform = post.platform || post.platforms?.[0]?.platform;
    const url = post.platformPostUrl || post.platforms?.find((p) => p.platformPostUrl)?.platformPostUrl;
    const date = (post.publishedAt || post.createdAt || new Date().toISOString()).slice(0, 10);
    surfaces.push({
      documentId: doc?._id,
      source: "getlate",
      surfaceType: "social_post",
      externalId: post._id,
      url,
      platform,
      title: (post.content || post.text || "Getlate post").slice(0, 90),
      firstSeen: Date.parse(post.createdAt || post.publishedAt || new Date()),
      metadata: { status: post.status },
    });
    snapshots.push({
      source: "getlate",
      date,
      documentId: doc?._id,
      surfaceExternalId: post._id,
      metrics: {
        views: metricNumber(engagement.views, engagement.plays, post.views),
        impressions: metricNumber(engagement.impressions, post.impressions),
        reach: metricNumber(engagement.reach, post.reach),
        likes: metricNumber(engagement.likes, post.likes),
        comments: metricNumber(engagement.comments, post.comments),
        shares: metricNumber(engagement.shares, post.shares),
        saves: metricNumber(engagement.saves, post.saves),
        engagementRate: metricNumber(engagement.engagementRate, post.engagementRate),
      },
    });
  }
  return { surfaces, snapshots };
}

function normalizeGsc(rows, matcher) {
  const surfaces = [];
  const snapshots = [];
  const seen = new Set();
  for (const row of rows) {
    const [date, page] = row.keys;
    const doc = matcher.findUrl(page);
    const key = normalizeUrl(page);
    if (!seen.has(key)) {
      seen.add(key);
      surfaces.push({
        documentId: doc?._id,
        source: "gsc",
        surfaceType: "page",
        url: page,
        platform: "web",
        title: doc?.title || page,
        slug: pathFromUrl(page),
      });
    }
    snapshots.push({
      source: "gsc",
      date,
      documentId: doc?._id,
      surfaceUrl: page,
      metrics: {
        clicks: metricNumber(row.clicks),
        impressions: metricNumber(row.impressions),
        position: metricNumber(row.position),
      },
    });
  }
  return { surfaces, snapshots };
}

function normalizeGa4(rows, matcher) {
  const surfaces = [];
  const snapshots = [];
  const seen = new Set();
  for (const row of rows) {
    const dateRaw = row.dimensionValues[0].value;
    const pagePath = row.dimensionValues[1].value;
    const title = row.dimensionValues[2].value;
    const url = `https://opened.co${pagePath}`;
    const doc = matcher.findUrl(url);
    const key = normalizeUrl(url);
    if (!seen.has(key)) {
      seen.add(key);
      surfaces.push({
        documentId: doc?._id,
        source: "ga4",
        surfaceType: "page",
        url,
        platform: "web",
        title: doc?.title || title || pagePath,
        slug: pagePath,
      });
    }
    snapshots.push({
      source: "ga4",
      date: `${dateRaw.slice(0, 4)}-${dateRaw.slice(4, 6)}-${dateRaw.slice(6, 8)}`,
      documentId: doc?._id,
      surfaceUrl: url,
      metrics: {
        pageviews: metricNumber(row.metricValues[0].value),
        sessions: metricNumber(row.metricValues[1].value),
        users: metricNumber(row.metricValues[2].value),
        engagementRate: metricNumber(row.metricValues[3].value),
      },
    });
  }
  return { surfaces, snapshots };
}

function makeRollups({ surfaces, snapshots, documents, surfaceIdByKey = {} }) {
  const docs = new Map(documents.map((doc) => [doc._id, doc]));
  const surfaceByKey = new Map();
  for (const surface of surfaces) {
    const key = surface.externalId
      ? `${surface.source}:id:${surface.externalId}`
      : `${surface.source}:url:${surface.url}`;
    surfaceByKey.set(key, surface);
  }

  const now = new Date();
  const current7Start = daysAgo(7);
  const prior7Start = daysAgo(14);
  const current28Start = daysAgo(28);
  const groups = new Map();

  for (const snapshot of snapshots) {
    const surfaceKey = snapshot.surfaceExternalId
      ? `${snapshot.source}:id:${snapshot.surfaceExternalId}`
      : `${snapshot.source}:url:${snapshot.surfaceUrl}`;
    const key = snapshot.documentId ? `doc:${snapshot.documentId}` : `surface:${surfaceKey}`;
    if (!groups.has(key)) {
      groups.set(key, {
        documentId: snapshot.documentId,
        surfaceKey,
        current7: {},
        prior7: {},
        current28: {},
        sources: {},
      });
    }
    const group = groups.get(key);
    const d = new Date(`${snapshot.date}T00:00:00`);
    if (d >= current28Start && d <= now) group.current28 = addMetrics(group.current28, snapshot.metrics);
    if (d >= current7Start && d <= now) group.current7 = addMetrics(group.current7, snapshot.metrics);
    if (d >= prior7Start && d < current7Start) group.prior7 = addMetrics(group.prior7, snapshot.metrics);
    group.sources[snapshot.source] = (group.sources[snapshot.source] || 0) + primaryValue(snapshot.metrics);
  }

  const rollups = [...groups.values()].map((group) => {
    const doc = group.documentId ? docs.get(group.documentId) : null;
    const surface = surfaceByKey.get(group.surfaceKey);
    const topSource = Object.entries(group.sources).sort((a, b) => b[1] - a[1])[0]?.[0];
    const current = primaryValue(group.current7);
    const prior = primaryValue(group.prior7);
    const deltaPct = prior ? ((current - prior) / prior) * 100 : current ? 100 : 0;
    const metrics7 = { ...group.current7, previous: prior, deltaPct };
    const metrics28 = group.current28;

    let priorityBucket = "stable";
    let recommendation = "Monitor this asset.";
    if (!doc) {
      priorityBucket = "unmatched_surface";
      recommendation = "Attach this analytics surface to a Conspire asset.";
    } else if (!doc.external_url && doc.doc_type === "blog_draft") {
      priorityBucket = "missing_metadata";
      recommendation = "Add the published URL so GSC and GA4 can attach cleanly.";
    } else if (["posted", "scheduled"].includes(doc.status) && primaryValue(metrics28) === 0) {
      priorityBucket = "published_unmeasured";
      recommendation = "Confirm the published URL or platform post ID is attached.";
    } else if (deltaPct <= -20) {
      priorityBucket = "falling_after_change";
      recommendation = "Review the latest change pin and consider a refresh or rollback.";
    } else if (deltaPct >= 20) {
      priorityBucket = "rising_after_change";
      recommendation = "Promote or repurpose this while the signal is rising.";
    }

    return {
      documentId: doc?._id,
      surfaceId: !doc ? surfaceIdByKey[group.surfaceKey] : undefined,
      assetTitle: doc?.title || surface?.title || surface?.url || "Unmatched surface",
      assetType: doc?.doc_type || surface?.surfaceType || "unknown",
      status: doc?.status,
      priorityBucket,
      recommendation,
      topSource,
      latestEventDescription: topSource ? `Synced ${topSource.toUpperCase()} signal` : undefined,
      metrics7,
      metrics28,
      periodEnd: dateString(new Date()),
    };
  });

  const coveredDocs = new Set(
    rollups.filter((rollup) => rollup.documentId).map((rollup) => rollup.documentId)
  );
  for (const doc of documents) {
    if (coveredDocs.has(doc._id) || doc.status === "archived") continue;
    let priorityBucket = "stable";
    let recommendation = "No analytics signal yet. Monitor after the next sync.";
    if (doc.doc_type === "blog_draft" && !doc.external_url) {
      priorityBucket = "missing_metadata";
      recommendation = "Add the published Webflow URL so GSC and GA4 can attach.";
    } else if (["posted", "scheduled"].includes(doc.status)) {
      priorityBucket = "published_unmeasured";
      recommendation = "Attach the platform post URL or Getlate ID so performance can be measured.";
    }
    rollups.push({
      documentId: doc._id,
      assetTitle: doc.title,
      assetType: doc.doc_type,
      status: doc.status,
      priorityBucket,
      recommendation,
      latestEventDescription: "No analytics surface attached",
      metrics7: { deltaPct: 0 },
      metrics28: {},
      periodEnd: dateString(new Date()),
    });
  }

  return rollups;
}

function chunk(items, size) {
  const chunks = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

function attachSurfaceIds(snapshots, surfaceIdByKey) {
  return snapshots.map((snapshot) => {
    const key = snapshot.surfaceExternalId
      ? `${snapshot.source}:id:${snapshot.surfaceExternalId}`
      : `${snapshot.source}:url:${snapshot.surfaceUrl}`;
    const surfaceId = surfaceIdByKey[key];
    return surfaceId ? { ...snapshot, surfaceId } : snapshot;
  });
}

function surfaceMapFromResult(result) {
  return Object.fromEntries((result.surfaceIds || []).map((row) => [row.key, row.id]));
}

async function collectLiveData(client, env, workspace) {
  const docs = await client.query(api.documents.listByStatus, { workspace: WORKSPACE });
  const matcher = buildMatcher(docs);
  const fallbackCreds = path.join(VAULT, ".credentials", "ga4-credentials.json");
  const credentialsPath = await firstExistingPath([
    resolveVaultPath(env.GOOGLE_SERVICE_ACCOUNT_PATH, fallbackCreds),
    resolveVaultPath(env.GSC_CREDENTIALS_PATH, fallbackCreds),
    resolveVaultPath(env.GA4_CREDENTIALS_PATH, fallbackCreds),
    fallbackCreds,
  ]);
  const googleToken = await getGoogleToken(credentialsPath);
  const [getlatePosts, gscRows, ga4Rows] = await Promise.all([
    fetchGetlate(workspace.getlateProfileId, env.GETLATE_API_KEY),
    fetchGsc(env, googleToken),
    fetchGa4(env, googleToken),
  ]);

  const normalized = [
    normalizeGetlate(getlatePosts, matcher),
    normalizeGsc(gscRows, matcher),
    normalizeGa4(ga4Rows, matcher),
  ];

  return {
    documents: docs,
    surfaces: normalized.flatMap((n) => n.surfaces),
    snapshots: normalized.flatMap((n) => n.snapshots),
  };
}

function runSelfTest() {
  const docs = [{
    _id: "doc1",
    title: "Test Page",
    doc_type: "blog_draft",
    status: "posted",
    external_url: "https://opened.co/blog/test-page",
    zernio_post_id: "post1",
  }];
  const matcher = buildMatcher(docs);
  const getlate = normalizeGetlate([{ _id: "post1", content: "Clip", views: 100, publishedAt: "2026-04-20" }], matcher);
  const gsc = normalizeGsc([{ keys: ["2026-04-20", "https://opened.co/blog/test-page"], clicks: 9, impressions: 90, position: 4 }], matcher);
  const ga4 = normalizeGa4([{ dimensionValues: [{ value: "20260420" }, { value: "/blog/test-page" }, { value: "Test Page" }], metricValues: [{ value: "50" }, { value: "25" }, { value: "20" }, { value: "0.7" }] }], matcher);
  const unmatched = normalizeGsc([{ keys: ["2026-04-20", "https://opened.co/blog/unmatched"], clicks: 3, impressions: 30, position: 12 }], matcher);
  if (getlate.surfaces[0].documentId !== "doc1") throw new Error("Getlate ID did not match document");
  if (gsc.surfaces[0].documentId !== "doc1") throw new Error("GSC URL did not match document");
  if (ga4.surfaces[0].documentId !== "doc1") throw new Error("GA4 path did not match document");
  if (unmatched.surfaces[0].documentId) throw new Error("Unmatched URL was incorrectly attached");
  const rollups = makeRollups({
    documents: docs,
    surfaces: [...getlate.surfaces, ...gsc.surfaces, ...ga4.surfaces, ...unmatched.surfaces],
    snapshots: [...getlate.snapshots, ...gsc.snapshots, ...ga4.snapshots, ...unmatched.snapshots],
    surfaceIdByKey: { "gsc:url:https://opened.co/blog/unmatched": "surface1" },
  });
  if (!rollups.find((r) => r.priorityBucket === "unmatched_surface")) {
    throw new Error("Unmatched rollup was not created");
  }
  console.log("Self-test passed: Getlate, GSC, GA4, and unmatched URL matching work.");
}

async function main() {
  if (selfTest) {
    runSelfTest();
    return;
  }

  const { env, workspace } = await loadConfig();
  if (!workspace.getlateProfileId) throw new Error("opened workspace missing getlateProfileId");
  if (!env.GETLATE_API_KEY) throw new Error("GETLATE_API_KEY missing from OpenEd env");
  if (!env.VITE_CONVEX_URL) throw new Error("VITE_CONVEX_URL missing from .env.local");

  const client = new ConvexHttpClient(env.VITE_CONVEX_URL);
  const runId = dryRun
    ? null
    : await client.mutation(api.analytics.startSyncRun, { workspace: WORKSPACE, source: "all" });

  try {
    const collected = await collectLiveData(client, env, workspace);
    console.log(`Collected ${collected.surfaces.length} surfaces and ${collected.snapshots.length} snapshots.`);

    if (dryRun) {
      const rollups = makeRollups({ ...collected });
      console.log(JSON.stringify({
        dryRun: true,
        surfaces: collected.surfaces.length,
        snapshots: collected.snapshots.length,
        rollups: rollups.length,
        sampleRollup: rollups[0],
      }, null, 2));
      return;
    }

    const first = await client.mutation(api.analytics.syncBatch, {
      workspace: WORKSPACE,
      surfaces: collected.surfaces,
      snapshots: [],
      rollups: [],
    });
    const surfaceIdByKey = surfaceMapFromResult(first);
    const snapshots = attachSurfaceIds(collected.snapshots, surfaceIdByKey);
    for (const batch of chunk(snapshots, 3000)) {
      await client.mutation(api.analytics.syncBatch, {
        workspace: WORKSPACE,
        surfaces: [],
        snapshots: batch,
        rollups: [],
      });
    }
    const rollups = makeRollups({
      ...collected,
      surfaceIdByKey,
    });
    for (const batch of chunk(rollups, 1000)) {
      await client.mutation(api.analytics.syncBatch, {
        workspace: WORKSPACE,
        surfaces: [],
        snapshots: [],
        rollups: batch,
      });
    }
    await client.mutation(api.analytics.finishSyncRun, {
      id: runId,
      status: "success",
      surfaces: collected.surfaces.length,
      snapshots: collected.snapshots.length,
      rollups: rollups.length,
    });
    console.log(`Synced ${collected.surfaces.length} surfaces, ${collected.snapshots.length} snapshots, ${rollups.length} rollups.`);
  } catch (error) {
    if (runId) {
      await client.mutation(api.analytics.finishSyncRun, {
        id: runId,
        status: "error",
        errors: [error instanceof Error ? error.message : String(error)],
      });
    }
    throw error;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
