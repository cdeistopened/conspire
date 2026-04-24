#!/usr/bin/env node
/**
 * Publish a Conspire podcast doc to YouTube via Zernio/Getlate.
 *
 * The Descript share page exposes a 12-hour signed GCS MP4 URL for any
 * published project (same trick we use for clips in ship-past-clip.cjs).
 * We scrape that URL from the share page HTML, then POST it as a long-form
 * video to Zernio via /api/v1/posts with platform=youtube.
 *
 * Usage:
 *   GETLATE_API_KEY=... YOUTUBE_ACCOUNT_ID=... \
 *     node publish-to-youtube.cjs <conspire-doc-id> \
 *       [--title-index=0|1]     # which A/B title variant to use
 *       [--privacy=public|unlisted|private]     # default: public
 *       [--publish]             # fire now instead of scheduled_for publish_date
 *       [--dry-run]             # print payload but don't POST
 *
 * Defaults:
 *   YOUTUBE_ACCOUNT_ID = 6961354d4207e06f4ca849a4   (OpenEdHQ)
 */

const { execSync } = require('child_process');
const { ConvexHttpClient } = require('convex/browser');

const CONVEX_URL = 'https://usable-pheasant-901.convex.cloud';
const GETLATE_URL = process.env.GETLATE_API_URL || 'https://getlate.dev/api/v1';
const DEFAULT_YT = '6961354d4207e06f4ca849a4';

function arg(name) {
  const found = process.argv.find(a => a.startsWith(`--${name}=`));
  return found ? found.split('=').slice(1).join('=') : null;
}

function scrapeDescriptMp4(shareUrl) {
  const html = execSync(
    `curl -sL -A 'Mozilla/5.0' ${JSON.stringify(shareUrl)}`,
    { maxBuffer: 20 * 1024 * 1024 },
  ).toString();
  const m = html.match(/https:\/\/production-273614-media-export[^"]*\.mp4[^"]*/);
  if (!m) throw new Error('Could not extract mp4 URL from Descript share page');
  return m[0].replace(/&amp;/g, '&');
}

async function getlate(path, init = {}) {
  const key = process.env.GETLATE_API_KEY;
  if (!key) throw new Error('GETLATE_API_KEY required');
  const res = await fetch(`${GETLATE_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });
  const text = await res.text();
  let body; try { body = JSON.parse(text); } catch { body = text; }
  if (!res.ok) throw new Error(`Getlate ${init.method || 'GET'} ${path} -> ${res.status}: ${JSON.stringify(body).slice(0, 600)}`);
  return body;
}

async function main() {
  const docId = process.argv[2];
  if (!docId) {
    console.error('usage: node publish-to-youtube.cjs <doc-id> [--title-index=0|1] [--privacy=public] [--publish] [--dry-run]');
    process.exit(1);
  }
  const titleIdx = parseInt(arg('title-index') || '0', 10);
  const privacy = arg('privacy') || 'public';
  const publishNow = process.argv.includes('--publish');
  const dryRun = process.argv.includes('--dry-run');
  const accountId = process.env.YOUTUBE_ACCOUNT_ID || DEFAULT_YT;

  const convex = new ConvexHttpClient(CONVEX_URL);
  const doc = await convex.query('documents:get', { id: docId });
  if (!doc) throw new Error(`Doc ${docId} not found`);
  if (doc.doc_type !== 'podcast') throw new Error(`Doc is ${doc.doc_type}, not podcast`);
  if (!doc.descript_url) throw new Error('No descript_url on the doc');
  if (!doc.title_variants || !doc.title_variants[titleIdx]) {
    throw new Error(`No title at title_variants[${titleIdx}]`);
  }

  const title = doc.title_variants[titleIdx].trim();
  if (title.length > 100) throw new Error(`Title is ${title.length} chars (YouTube max 100)`);

  const description = (doc.youtube_show_notes || '').slice(0, 4900);
  const scheduledFor = (!publishNow && doc.publish_date)
    ? new Date(doc.publish_date).toISOString()
    : null;

  console.log(`Scraping MP4 URL from ${doc.descript_url} ...`);
  const mp4 = scrapeDescriptMp4(doc.descript_url);
  console.log(`  ok (${mp4.length} chars)`);

  const payload = {
    content: description,
    mediaItems: [{ type: 'video', url: mp4 }],
    platforms: [{
      platform: 'youtube',
      accountId,
      customContent: description,
      platformSpecificData: {
        title,
        privacy,
        madeForKids: false,
      },
    }],
  };
  if (publishNow) payload.publishNow = true;
  else if (scheduledFor) payload.scheduledFor = scheduledFor;

  console.log(`Title: ${title}`);
  console.log(`Privacy: ${privacy}`);
  console.log(`Account: ${accountId}`);
  console.log(`Description: ${description.length} chars`);
  console.log(publishNow ? 'Publishing NOW' : (scheduledFor ? `Scheduled for ${scheduledFor}` : 'Draft (no schedule)'));
  console.log('---');

  if (dryRun) {
    console.log('DRY RUN — not posting. Payload:');
    console.log(JSON.stringify({ ...payload, mediaItems: [{ type: 'video', url: mp4.slice(0, 120) + '...' }] }, null, 2));
    return;
  }

  const result = await getlate('/posts', { method: 'POST', body: JSON.stringify(payload) });
  const post = result.post || result;
  console.log(`Getlate post: ${post._id}  (status ${post.status})`);
  for (const p of post.platforms || []) {
    console.log(`  ${p.platform}: ${p.status}${p.platformPostUrl ? ' → ' + p.platformPostUrl : ''}`);
  }

  console.log('\nUpdating Conspire doc: zernio_post_id + status=scheduled');
  await convex.mutation('documents:update', {
    id: docId,
    zernio_post_id: post._id,
    zernio_scheduled_at: Date.now(),
  });
  if (!publishNow) {
    await convex.mutation('documents:updateStatus', {
      id: docId,
      status: 'scheduled',
      actor: 'Charlie',
    });
  }
}

main().catch(e => { console.error('\nFAILED:', e.message); process.exit(1); });
