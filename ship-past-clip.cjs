#!/usr/bin/env node
// Ship "How to let go of the past" via Zernio/Getlate.
// Per-platform captions with STUCK CTA + Stuck on Repeat guide link.

const { ConvexHttpClient } = require('convex/browser');
const c = new ConvexHttpClient('https://usable-pheasant-901.convex.cloud');

const GETLATE_API_KEY = 'sk_3fc06cf8db2cb1b0e497d6c80724163258e9ec6be5d233c528234302baef6856';
const GETLATE_URL = 'https://getlate.dev/api/v1';
const ACCOUNTS = {
  instagram: '69e149577dea335c2bff987b',
  tiktok:    '69e1496f7dea335c2bff99b0',
  youtube:   '69e14a3f7dea335c2bff9d43',
  facebook:  '69e149d07dea335c2bff9b91',
};
const CLIP_ID = 'j977thz82m166vntrygybbq1nd84wmsh';
const DESCRIPT_SHARE = 'https://share.descript.com/view/nLqdnMWAmjq';

const baseline = `The past walks into your head when you are not looking for it. 3am. Driving home. Mid-conversation.

Comment STUCK and I'll send you my free Stuck on Repeat guide. 5 traps, 5 ways out.`;

const captions = {
  instagram: `The past walks into your head when you are not looking for it. Three in the morning. Driving home. Mid-conversation.

When it shows up, most people try to rewrite it. It does not work. You cannot remake the past.

You can review the past. You can learn from it. That is useful. Living there is not.

Here is what I do, and what I teach every patient. The moment the past intrudes, I count. One. Two. Three. Four. I take control of the screen of my mind. I do not fight the thought. I replace it.

Practice 60 seconds, five times a day. A week in, the past still shows up. It just does not get to stay.

💬 Comment STUCK and I'll send you my free Stuck on Repeat guide. 5 traps, 5 ways out, 30 seconds each.

#mindmastery #lettinggo #overthinking #mentalhealth #presentmoment #anxietyrelief #drrichardmiller #psychology`,

  tiktok: `The past walks into your head at 3am.

In traffic. Mid-conversation. Ten years ago, fifteen, thirty.

Most people try to rewrite it. It does not work. You cannot remake the past.

Here is what I do. When the past intrudes, I count. One. Two. Three. Four.

Take control of the screen of your mind. Do not fight the thought. Replace it.

Practice 60 seconds, five times a day.

A week in, the past still shows up. It just does not get to stay.

Free guide in bio: 5 traps, 5 ways out.`,

  youtube: `65 years as a clinical psychologist. When the past walks into the present at 3am, in traffic, mid-conversation, you cannot rewrite it. But you can evict it.

Count one, two, three, four. Replace the thought. Practice 60 seconds, five times a day. A week in, the past still shows up. It just does not get to stay.

Free guide: https://drrichardlouismiller.com/get/stuck

#lettinggo #overthinking #mentalhealth #psychology #shorts`,

  facebook: `The past walks into your head when you are not looking for it. Three in the morning. Driving home. In the middle of a conversation you are trying to have in the present.

When it shows up, most people try to rewrite it. They relitigate the argument, rehearse the thing they should have said, conduct the conversation they never had. And then they do it again the next night. It does not work. You cannot remake the past. In decades of practice, I have never seen anyone do it.

You can review the past. You can learn from what happened and carry that forward. That is useful. Living there is not.

Here is what I do, and what I teach every patient. The moment the past intrudes, I count. One. Two. Three. Four. I take control of what is on the screen of my mind. I do not fight the thought, which only makes it louder. I replace it.

Practice 60 seconds, five times a day. A week in, you will notice something different. The past still shows up. It just does not get to stay.

Essential for happiness. Not optional.

Get the free 5-trap escape plan: https://drrichardlouismiller.com/get/stuck`,
};

const YT_TITLE = 'How to stop reliving the past (a 4-count from a clinical psychologist)';

async function getFreshMp4Url() {
  const { execSync } = require('child_process');
  const html = execSync(
    `curl -sL -A 'Mozilla/5.0' '${DESCRIPT_SHARE}'`,
    { maxBuffer: 20 * 1024 * 1024 },
  ).toString();
  const m = html.match(/https:\/\/production-273614-media-export[^"]*\.mp4[^"]*/);
  if (!m) throw new Error('Could not extract mp4 URL from Descript share page');
  return m[0].replace(/&amp;/g, '&');
}

async function getlate(path, init = {}) {
  const res = await fetch(`${GETLATE_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${GETLATE_API_KEY}`,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });
  const text = await res.text();
  let body;
  try { body = JSON.parse(text); } catch { body = text; }
  if (!res.ok) throw new Error(`Getlate ${init.method || 'GET'} ${path} -> ${res.status}: ${JSON.stringify(body).slice(0, 600)}`);
  return body;
}

(async () => {
  console.log('Fetching fresh Descript mp4 URL...');
  const mp4 = await getFreshMp4Url();
  console.log('  ok (length ' + mp4.length + ')');

  const payload = {
    content: baseline,
    mediaItems: [{ type: 'video', url: mp4 }],
    platforms: [
      {
        platform: 'instagram',
        accountId: ACCOUNTS.instagram,
        customContent: captions.instagram,
        platformSpecificData: { placement: 'reels' },
      },
      {
        platform: 'tiktok',
        accountId: ACCOUNTS.tiktok,
        customContent: captions.tiktok,
      },
      {
        platform: 'youtube',
        accountId: ACCOUNTS.youtube,
        customContent: captions.youtube,
        platformSpecificData: {
          title: YT_TITLE,
          privacy: 'public',
          type: 'short',
        },
      },
      {
        platform: 'facebook',
        accountId: ACCOUNTS.facebook,
        customContent: captions.facebook,
      },
    ],
    publishNow: true,
  };

  console.log('\nCreating post on all 4 platforms...');
  const result = await getlate('/posts', { method: 'POST', body: JSON.stringify(payload) });
  const post = result.post;
  console.log('  ✓ Getlate post created: ' + post._id);
  console.log('  Status: ' + post.status);
  for (const p of post.platforms) {
    console.log(`    ${p.platform}: ${p.status}${p.platformPostUrl ? ' -> ' + p.platformPostUrl : ''}`);
  }

  console.log('\nUpdating Conspire doc: status=scheduled, zernio_post_id=' + post._id);
  await c.mutation('documents:update', {
    id: CLIP_ID,
    zernio_post_id: post._id,
    zernio_scheduled_at: Date.now(),
  });
  await c.mutation('documents:updateStatus', {
    id: CLIP_ID,
    status: 'scheduled',
    actor: 'Charlie',
  });

  console.log('\nDONE. Check Getlate dashboard at https://getlate.dev/dashboard');
  console.log('Conspire clip now in Scheduled column.');
})().catch((e) => {
  console.error('\nFAILED:', e.message);
  process.exit(1);
});
