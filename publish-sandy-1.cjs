const fs = require('fs');
const { ConvexHttpClient } = require('convex/browser');
const convex = new ConvexHttpClient('https://usable-pheasant-901.convex.cloud');
const key = fs.readFileSync('/Users/charliedeist/Root/OpenEd Vault/.env','utf8').split('\n').find(l => l.startsWith('GETLATE_API_KEY=')).split('=')[1].trim();
const API = 'https://getlate.dev/api/v1';

const CLIP_ID = 'j971rwkqy89ampq9wnmyrpvy4984zaha';
const POST_ID = '69e27163b78cb3a954b02be6';
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

(async () => {
  const doc = await convex.query('documents:get', { id: CLIP_ID });
  const cap = parseCaptions(doc.notes);
  const mediaUrl = fs.readFileSync('/tmp/sandy-clips/clip1.url', 'utf8').trim();

  const patch = {
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
    publishNow: true,
  };

  console.log('DELETE /posts/' + POST_ID + ' then POST /posts with publishNow=true (safer than PUT/PATCH)...');
  await getlate('/posts/' + POST_ID, 'DELETE');
  const res = await getlate('/posts', 'POST', patch);
  const post = res.post || res;
  const newId = post._id;
  console.log('new post id:', newId);
  console.log('status:', post.status);
  for (const p of (post.platforms || [])) {
    console.log(`  ${p.platform}: ${p.status} ${p.platformPostUrl || ''} ${p.error || ''}`);
  }

  await convex.mutation('documents:update', {
    id: CLIP_ID,
    zernio_post_id: newId,
    zernio_scheduled_at: Date.now(),
  });
  console.log('\nConspire updated.');
})().catch(e => { console.error('FAIL:', e.message); process.exit(1); });
