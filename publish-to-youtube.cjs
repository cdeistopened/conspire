#!/usr/bin/env node
/**
 * Publish a Conspire podcast doc to YouTube via the Zernio (Getlate) API.
 *
 * Zernio needs a publicly accessible MP4 URL. Descript share pages do NOT
 * expose a direct download link — you must export from Descript → upload the
 * MP4 to a public bucket (Convex storage, S3, R2), then pass that URL in.
 *
 * Usage:
 *   GETLATE_API_KEY=sk_... node publish-to-youtube.cjs <conspire-doc-id> \
 *     --video-url=https://.../episode.mp4 \
 *     [--title-index=0|1] \
 *     [--thumb-index=0|1|2] \
 *     [--visibility=public|unlisted|private] \
 *     [--publish]          # omit for scheduledFor=publish_date, include to fire now
 *
 * Env:
 *   GETLATE_API_KEY  sk_...  (required)
 *   GETLATE_API_URL  default https://getlate.dev/api/v1
 *   YOUTUBE_ACCOUNT_ID  pre-cached Getlate account._id for the YouTube channel.
 *                      If unset, the script lists accounts and prompts you to
 *                      set it, then exits.
 */

const { ConvexHttpClient } = require('convex/browser');

const CONVEX_URL = 'https://usable-pheasant-901.convex.cloud';
const API_BASE = process.env.GETLATE_API_URL || 'https://getlate.dev/api/v1';

function arg(name) {
  const found = process.argv.find(a => a.startsWith(`--${name}=`));
  return found ? found.split('=').slice(1).join('=') : null;
}

async function gl(method, path, body) {
  const key = process.env.GETLATE_API_KEY;
  if (!key) throw new Error('GETLATE_API_KEY required');
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Getlate ${method} ${path}: ${res.status} ${text}`);
  return text ? JSON.parse(text) : null;
}

async function main() {
  const docId = process.argv[2];
  if (!docId) {
    console.error('usage: node publish-to-youtube.cjs <conspire-doc-id> --video-url=...');
    process.exit(1);
  }

  const videoUrl = arg('video-url');
  if (!videoUrl) {
    console.error('--video-url=https://.../episode.mp4 is required.');
    console.error('Descript does not expose a direct download URL — export from the');
    console.error('Descript editor and host the MP4 somewhere public first.');
    process.exit(1);
  }

  const titleIdx = parseInt(arg('title-index') || '0', 10);
  const thumbIdx = parseInt(arg('thumb-index') || '0', 10);
  const visibility = arg('visibility') || 'public';
  const publishNow = process.argv.includes('--publish');

  // Find YouTube account id
  let accountId = process.env.YOUTUBE_ACCOUNT_ID;
  if (!accountId) {
    const { accounts } = await gl('GET', '/accounts');
    const yts = accounts.filter(a => a.platform === 'youtube');
    if (!yts.length) {
      console.error('No YouTube accounts on this Getlate key.');
      process.exit(1);
    }
    console.error('YouTube accounts found:');
    for (const a of yts) {
      console.error(`  ${a._id}  ${a.displayName || a.username}`);
    }
    console.error('Re-run with YOUTUBE_ACCOUNT_ID=<id>');
    process.exit(1);
  }

  const convex = new ConvexHttpClient(CONVEX_URL);
  const doc = await convex.query('documents:get', { id: docId });
  if (!doc) throw new Error(`Doc ${docId} not found`);

  const title = (doc.title_variants?.[titleIdx] || doc.title_variants?.[0] || doc.title).trim();
  const description = (doc.youtube_show_notes || '').slice(0, 4900);
  const thumbnail = doc.thumbnail_urls?.[thumbIdx];
  const scheduledFor = (!publishNow && doc.publish_date)
    ? new Date(doc.publish_date).toISOString()
    : undefined;

  if (title.length > 100) {
    console.error(`Title is ${title.length} chars — YouTube max is 100. Trim title_variants[${titleIdx}].`);
    process.exit(1);
  }

  const mediaItems = [
    thumbnail
      ? { type: 'video', url: videoUrl, thumbnail }
      : { type: 'video', url: videoUrl },
  ];

  const payload = {
    content: description,
    mediaItems,
    platforms: [
      {
        platform: 'youtube',
        accountId,
        platformSpecificData: {
          title,
          visibility,
          madeForKids: false,
        },
      },
    ],
  };
  if (publishNow) payload.publishNow = true;
  else if (scheduledFor) payload.scheduledFor = scheduledFor;

  console.log(`Title: ${title}`);
  console.log(`Visibility: ${visibility}`);
  console.log(`Thumbnail: ${thumbnail ? 'yes' : 'no'}`);
  console.log(`Video URL: ${videoUrl}`);
  console.log(`${publishNow ? 'Publishing now' : (scheduledFor ? `Scheduled for ${scheduledFor}` : 'Draft')}`);
  console.log('---');

  const result = await gl('POST', '/posts', payload);
  const post = result.post || result;
  console.log(`Getlate post: ${post._id}`);
  if (post.platforms) {
    for (const p of post.platforms) {
      console.log(`  ${p.platform}: ${p.status}${p.platformPostUrl ? ' ' + p.platformPostUrl : ''}`);
    }
  }
}

main().catch(err => {
  console.error(err.message || err);
  process.exit(1);
});
