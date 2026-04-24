#!/usr/bin/env node
// Sprint script: post Anxiety Solution across IG, TikTok, YT Shorts, Facebook
// via the new RLM Getlate/Zernio profile. Per-platform captions with BREATHE CTA.

const { ConvexHttpClient } = require('convex/browser');
const c = new ConvexHttpClient('https://usable-pheasant-901.convex.cloud');

const GETLATE_API_KEY = 'sk_3fc06cf8db2cb1b0e497d6c80724163258e9ec6be5d233c528234302baef6856';
const GETLATE_URL = 'https://getlate.dev/api/v1';
const PROFILE_ID = '69e14945869d7735c049b415';
const ACCOUNTS = {
  instagram: '69e149577dea335c2bff987b',
  tiktok:    '69e1496f7dea335c2bff99b0',
  youtube:   '69e14a3f7dea335c2bff9d43',
  facebook:  '69e149d07dea335c2bff9b91',
};
const CLIP_ID = 'j9783mr96pvwrmwmn17h0fvh2584wgp1';
const DESCRIPT_SHARE = 'https://share.descript.com/view/4WVeSrY6Qnw';

// Baseline content (shown if no customContent for a platform)
const baseline = 'After 65 years of practice, this is still the simplest anxiety tool I know: breathing.\n\nComment BREATHE and I will send you my 2-minute breathing guide.';

const captions = {
  instagram: `Anxiety lives in your chest. Breathing reaches it faster than anything else I have tried in 65 years of practice.

Comment BREATHE and I will send you my 2-minute breathing guide.

Save this for the next time your chest feels tight.

#anxiety #anxietyrelief #breathwork #nervoussystem #mentalhealth #meditation #somatic #therapy #psychology #selfregulation`,

  tiktok: `Anxiety? Breathing. That is it. 65 years of practice and I have never met anxiety that breathing could not touch.

Comment BREATHE for the 2-minute guide.

#anxiety #breathwork #mentalhealth #therapist #psychology`,

  youtube: `How to stop anxiety in 30 seconds using abdominal breathing. Dr. Richard Miller, clinical psychologist (65 years of practice), explains the simplest anxiety tool.

Comment BREATHE for my free 2-minute breathing guide.

#anxiety #anxietyrelief #breathwork #howtobeatanxiety #shorts`,

  facebook: `After 65 years of practice, this is still the simplest anxiety tool I know: breathing. Your body can solve what therapy tries to process.

Comment BREATHE and I will send you my 2-minute breathing guide.

#anxiety #breathwork #mentalhealth`,
};

async function getFreshMp4Url() {
  // Descript share URLs expire every 12 hours — re-fetch each time via curl
  // (avoids node fetch TLS/UA quirks with GCS-fronted pages)
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
  if (!res.ok) throw new Error(`Getlate ${init.method || 'GET'} ${path} -> ${res.status}: ${JSON.stringify(body).slice(0, 500)}`);
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
          title: 'How To Stop Anxiety In 30 Seconds',
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
    const acc = typeof p.accountId === 'object' ? p.accountId.displayName || p.accountId.username : p.accountId;
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
