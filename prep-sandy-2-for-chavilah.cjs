// Preps clip 2 for Chavilah:
//  - deletes stale Getlate draft, recreates clean (no scheduledFor, no publishNow)
//  - refreshes Descript signed media URL
//  - prepends a short SOP to `notes` so Chavilah can self-serve from Conspire
//  - stores new post id in zernio_post_id; resets status back to "approved"
//    (meaning: copy is final, card is ready to schedule)

const fs = require('fs');
const { ConvexHttpClient } = require('convex/browser');
const convex = new ConvexHttpClient('https://usable-pheasant-901.convex.cloud');
const key = fs.readFileSync('/Users/charliedeist/Root/OpenEd Vault/.env', 'utf8')
  .split('\n').find(l => l.startsWith('GETLATE_API_KEY=')).split('=')[1].trim();
const API = 'https://getlate.dev/api/v1';

const CLIP_ID = 'j974jt8e9c9htwh7p8xf6fwyv984ztdt';
const ACCOUNTS = {
  instagram: '6961355a4207e06f4ca849a5',
  tiktok:    '696135344207e06f4ca849a3',
  youtube:   '6961354d4207e06f4ca849a4',
};

function parseCaptions(notes) {
  const sections = {};
  const chunks = notes.split(/^##\s+/m).slice(1);
  for (const chunk of chunks) {
    const [hdr, ...rest] = chunk.split('\n');
    const name = hdr.trim().toLowerCase();
    const joined = rest.join('\n');
    const titleMatch = joined.match(/\*\*Title:\*\*\s*([^\n]+)/);
    if (titleMatch) sections[name + '__title'] = titleMatch[1].trim();
    const body = joined
      .replace(/^>\s+Tag.*$/gm, '')
      .replace(/^---\s*$/gm, '')
      .replace(/\*\*Title:\*\*\s*[^\n]+/, '')
      .trim();
    sections[name] = body;
  }
  return sections;
}

async function getlate(path, method = 'GET', body) {
  const res = await fetch(API + path, {
    method,
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${path} ${res.status}: ${text.slice(0, 600)}`);
  return text ? JSON.parse(text) : null;
}

const SOP = `## 👋 Chavilah — how to schedule this

1. Click the **Getlate draft** link below. Captions are pre-loaded for IG / TikTok / YouTube.
2. Pick a send time (or drop into a queue slot). Hit **Schedule**.
3. For **Facebook**, copy the FB block below and publish manually from Meta Business Suite so you can tag \`@TheBrainyMoms\` page.
4. When done, drag this card to the **Posted** column in Conspire and paste the published URLs into this Notes block.

**Media:** the Descript signed URL expires 12h after this card was prepped. If Getlate errors on publish, ping Charlie or re-run \`prep-sandy-2-for-chavilah.cjs\` — it refreshes the URL.

---

`;

(async () => {
  const doc = await convex.query('documents:get', { id: CLIP_ID });
  const cap = parseCaptions(doc.notes);
  const mediaUrl = fs.readFileSync('/tmp/sandy-clips/clip2.url', 'utf8').trim();

  if (doc.zernio_post_id) {
    console.log(`Deleting stale Getlate draft ${doc.zernio_post_id}...`);
    try { await getlate('/posts/' + doc.zernio_post_id, 'DELETE'); }
    catch (e) { console.log('  (old draft already gone or delete failed — continuing)'); }
  }

  const payload = {
    content: cap['instagram'],
    platforms: [
      { platform: 'instagram', accountId: ACCOUNTS.instagram, customContent: cap['instagram'] },
      { platform: 'tiktok',    accountId: ACCOUNTS.tiktok,    customContent: cap['tiktok'] },
      {
        platform: 'youtube',
        accountId: ACCOUNTS.youtube,
        customContent: cap['youtube shorts'],
        platformSpecificData: {
          title: cap['youtube shorts__title'] || doc.title,
          privacyStatus: 'public',
        },
      },
    ],
    mediaItems: [{ type: 'video', url: mediaUrl }],
  };

  console.log('POST /posts → fresh draft...');
  const res = await getlate('/posts', 'POST', payload);
  const post = res.post || res;
  const newId = post._id;
  console.log('  new draft id:', newId);
  console.log('  status:', post.status);

  const getlateUrl = `https://getlate.dev/posts/${newId}`;
  const notesWithSop = SOP
    + `**Getlate draft:** ${getlateUrl}\n\n`
    + (doc.notes.startsWith('## 👋 Chavilah')
      ? doc.notes.replace(/^## 👋 Chavilah[\s\S]*?\n---\n\n/, '').replace(/^\*\*Getlate draft:\*\*.*\n\n/m, '')
      : doc.notes);

  await convex.mutation('documents:update', {
    id: CLIP_ID,
    zernio_post_id: newId,
    notes: notesWithSop,
  });
  await convex.mutation('documents:updateStatus', {
    id: CLIP_ID,
    status: 'approved',
    actor: 'Charlie',
  });

  console.log('\nConspire card:');
  console.log('  status → approved (copy locked, ready to schedule)');
  console.log('  notes: SOP prepended, Getlate link front-and-center');
  console.log('  zernio_post_id →', newId);
  console.log('\nChavilah opens:');
  console.log('  https://conspire-production.up.railway.app/?workspace=opened');
  console.log('  → filter status:approved → Sandy Zamalis Clip 2 → Getlate link in notes');
})().catch(e => { console.error('FAIL:', e.message); process.exit(1); });
