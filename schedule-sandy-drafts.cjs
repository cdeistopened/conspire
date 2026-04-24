// Creates Getlate DRAFT posts for Sandy Zamalis clips — IG, TT, YT only.
// Facebook is intentionally skipped so Charlie can manually publish + tag @TheBrainyMoms page.
// Drafts are NOT scheduled or published — user picks the time from the Getlate UI.
// The Descript signed URL is valid for 12h; schedule/publish within that window or re-run.

const fs = require('fs');
const { ConvexHttpClient } = require('convex/browser');
const convex = new ConvexHttpClient('https://usable-pheasant-901.convex.cloud');

const envFile = fs.readFileSync('/Users/charliedeist/Root/OpenEd Vault/.env', 'utf8');
const GETLATE_API_KEY = envFile.split('\n').find(l => l.startsWith('GETLATE_API_KEY=')).split('=')[1].trim();
const API = 'https://getlate.dev/api/v1';

// OpenEd account IDs (verified 2026-04-17)
const ACCOUNTS = {
  instagram: '6961355a4207e06f4ca849a5',
  tiktok:    '696135344207e06f4ca849a3',
  youtube:   '6961354d4207e06f4ca849a4',
};

// Extracted from Conspire `notes` field (markdown dividers)
function parseCaptions(notes) {
  const sections = {};
  const chunks = notes.split(/^##\s+/m).slice(1);
  for (const chunk of chunks) {
    const [hdr, ...rest] = chunk.split('\n');
    const name = hdr.trim().toLowerCase();
    const body = rest.join('\n')
      .replace(/^>\s+Tag.*$/gm, '')     // strip FB reviewer notes
      .replace(/^---\s*$/gm, '')
      .replace(/\*\*Title:\*\*\s*([^\n]+)/, '') // pull YT title separately below
      .trim();
    sections[name] = body;
    const titleMatch = rest.join('\n').match(/\*\*Title:\*\*\s*([^\n]+)/);
    if (titleMatch) sections[name + '__title'] = titleMatch[1].trim();
  }
  return sections;
}

async function getlate(path, method = 'GET', body) {
  const res = await fetch(API + path, {
    method,
    headers: {
      Authorization: `Bearer ${GETLATE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${path} ${res.status}: ${text.slice(0, 400)}`);
  return text ? JSON.parse(text) : null;
}

const CLIPS = [
  { id: 'j971rwkqy89ampq9wnmyrpvy4984zaha', urlFile: '/tmp/sandy-clips/clip1.url', label: 'Sandy Zamalis Clip 1' },
  { id: 'j974jt8e9c9htwh7p8xf6fwyv984ztdt', urlFile: '/tmp/sandy-clips/clip2.url', label: 'Sandy Zamalis Clip 2' },
];

(async () => {
  const created = [];
  for (const clip of CLIPS) {
    const doc = await convex.query('documents:get', { id: clip.id });
    if (doc.zernio_post_id) {
      console.log(`[${clip.label}] skip — already has zernio_post_id=${doc.zernio_post_id}`);
      created.push({ label: clip.label, postId: doc.zernio_post_id, postUrl: `https://getlate.dev/posts/${doc.zernio_post_id}` });
      continue;
    }
    const captions = parseCaptions(doc.notes);
    const mediaUrl = fs.readFileSync(clip.urlFile, 'utf8').trim();
    const media = [{ type: 'video', url: mediaUrl }];

    const platforms = [
      { platform: 'instagram', accountId: ACCOUNTS.instagram, customContent: captions['instagram'] },
      { platform: 'tiktok',    accountId: ACCOUNTS.tiktok,    customContent: captions['tiktok'] },
      {
        platform: 'youtube',
        accountId: ACCOUNTS.youtube,
        customContent: captions['youtube shorts'],
        platformSpecificData: {
          title: captions['youtube shorts__title'] || doc.title,
          privacyStatus: 'public',
        },
      },
    ];

    const payload = {
      content: captions['instagram'] || doc.body || doc.title,
      platforms,
      mediaItems: media,
      // No publishNow, no scheduledFor → draft
    };

    console.log(`\n[${clip.label}] creating Getlate draft...`);
    const post = await getlate('/posts', 'POST', payload);
    const postId = post?._id || post?.post?._id;
    console.log(`  → Getlate post id: ${postId}`);
    const postUrl = `https://getlate.dev/posts/${postId}`;

    // Write the Getlate link back to Conspire for a one-click jump
    await convex.mutation('documents:update', {
      id: clip.id,
      zernio_post_id: postId,
    });
    console.log(`  → zernio_post_id saved (status unchanged — still in review)`);
    created.push({ label: clip.label, postId, postUrl });
  }

  console.log('\nDone:');
  for (const c of created) console.log(`  ${c.label}: ${c.postUrl}`);
})().catch(e => { console.error('FAIL:', e.message); process.exit(1); });
