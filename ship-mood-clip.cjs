#!/usr/bin/env node
// Ship "Mood Control" via Zernio/Getlate.
// Per-platform captions with MOOD CTA + Golden Light guide link.

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
const CLIP_ID = 'j97enb9xm3a2de2vwwapf39zb184x1m8';
const DESCRIPT_SHARE = 'https://share.descript.com/view/yAvPZqxyApu';

const baseline = `Who is in control of your mood? There is only one person. You.

Comment MOOD and I'll send you my free short guide and workbook.`;

const captions = {
  instagram: `Who is in control of your mood? There is only one person. You.

If you do not like the mood you are in, change it. Yes, you can. Mood is yours to change.

I made a short guide and workbook detailing the exact practice. Comment MOOD and I'll send it to you.

— Richard

#moodcontrol #mindmastery #emotionalregulation #mentalhealth #dailypractice #happiness #drrichardmiller #psychology`,

  tiktok: `Who is in control of your mood?

Only one person. You.

If you do not like the mood you are in, change it. Yes, you can.

Sit down. Close your eyes. Think of the mood you want. Conjure it. Feel it in your chest. Enjoy it.

Four or five times a day. Check in. Run it again.

People ask how I stay in good spirits at 87. This is part of it.

Your mood is yours.

Free guide and workbook in bio.`,

  youtube: `Who is in control of your mood? Only one person. You.

I have done this daily practice for decades. Sit. Close your eyes. Conjure the mood you want. Feel it in your body. Enjoy it. Run it four or five times a day. Your mood is yours.

For the full practice, grab my free short guide and workbook: https://drrichardlouismiller.com/get/mood

#moodcontrol #mindmastery #psychology #shorts`,

  facebook: `Who is in control of your moods? There is only one person. You are in control of yours. I am in control of mine. The same is true of your attitude.

If you do not like the mood you are in, change it. Yes, you can change it. Your mood is yours to change.

Here is the practice, and it is a practice. Sit down somewhere quiet. Close your eyes. Think of the mood you want to be in. Now conjure it inside yourself. Feel it in your chest. Feel it in your shoulders and your jaw and your face. When the mood is actually there, do not rush past it. Enjoy it. Let it be.

Do this four or five times a day. Check in on your mood throughout the day the way you might check the time. When you notice it is anything other than the mood you want, go back to the practice. Close your eyes, conjure the mood you want, feel it, enjoy it.

People ask how I stay in good spirits at 87. This is part of it. Not all of it, but more of it than most people expect. I have been doing this practice for decades, and the more you do it, the faster you can get back to the mood you want.

Your mood is yours. For the rest of your life.

Grab my free short guide and workbook: https://drrichardlouismiller.com/get/mood`,
};

const YT_TITLE = 'Who is in control of your mood';

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

  console.log('\nUpdating Conspire doc: zernio_post_id=' + post._id + ' status=posted');
  await c.mutation('documents:update', {
    id: CLIP_ID,
    zernio_post_id: post._id,
    zernio_scheduled_at: Date.now(),
  });
  await c.mutation('documents:updateStatus', {
    id: CLIP_ID,
    status: 'posted',
    actor: 'Charlie',
  });

  console.log('\nDONE. Check Getlate dashboard at https://getlate.dev/dashboard');
})().catch((e) => {
  console.error('\nFAILED:', e.message);
  process.exit(1);
});
