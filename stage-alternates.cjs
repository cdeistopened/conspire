const { ConvexHttpClient } = require('convex/browser');
const c = new ConvexHttpClient('https://usable-pheasant-901.convex.cloud');

// 5 alternates, each with 3 on-screen-text variants (Goldman method).
// Tagged with slot:alternate-YYYY so they're easy to filter in Conspire.
const STAMP = '2026-04-16';

const picks = [
  {
    id: 'j97bwk8rbrhwe5atz432dsy33n84wh62',
    title: 'Inner Dialogue',
    variants: [
      'your mind records every word you say to yourself',
      'the thing causing your anxiety is inside your head',
      '65 years of practice and this is the #1 thing i tell patients',
    ],
    recommended: 0,
    why: 'Top-performer lineage. 127K-view category is self-talk/inner-dialogue. Pattern C insider-truth hook.',
  },
  {
    id: 'j9783mr96pvwrmwmn17h0fvh2584wgp1',
    title: 'Anxiety Solution',
    variants: [
      "you're paying for anxiety you could fix in 30 seconds",
      'therapy is the slowest way to beat anxiety',
      'stop treating anxiety. start breathing.',
    ],
    recommended: 0,
    why: 'Punchy :33 clip. Stakes + contrarian therapy claim opens curiosity loop.',
  },
  {
    id: 'j97enb9xm3a2de2vwwapf39zb184x1m8',
    title: 'Mood Control',
    variants: [
      'you chose this mood',
      'if your mood rules your day, you never learned this',
      "most people don't know they can change their mood on command",
    ],
    recommended: 0,
    why: '4-word accusation forces the viewer to stay. Actionable payoff (conjure the mood).',
  },
  {
    id: 'j977thz82m166vntrygybbq1nd84wmsh',
    title: 'How to let go of the past',
    variants: [
      'stop replaying it',
      'you cannot remake the past',
      'when the past comes back, count to four',
    ],
    recommended: 0,
    why: '3-word punch universally recognized. Concrete tool (count to four) is inside the clip.',
  },
  {
    id: 'j9702cr05vqkg4qt6epy8e3nw584ws8q',
    title: 'Difference between fear and anxiety.',
    variants: [
      "you're not afraid. you're anxious. there's a difference.",
      'a bear in the woods is fear. your to-do list is anxiety.',
      'anxiety is a bear you made up',
    ],
    recommended: 0,
    why: 'Definitional aha. Bear metaphor is shareable + educational.',
  },
];

(async () => {
  for (const p of picks) {
    // Fetch existing doc to preserve tags
    const docs = await c.query('documents:listByStatus', { workspace: 'rlm' });
    const doc = docs.find(d => d._id === p.id);
    if (!doc) {
      console.log(`SKIP ${p.title} (not found)`);
      continue;
    }
    const tags = Array.from(new Set([...(doc.tags || []), `slot:alternate-${STAMP}`]));
    const notes = `[${STAMP} OST staged] ${p.why}`;

    await c.mutation('documents:update', {
      id: p.id,
      title_variants: p.variants,
      chosen_variant_index: p.recommended,
      tags,
      notes,
    });
    await c.mutation('documents:updateStatus', {
      id: p.id,
      status: 'approved',
      actor: 'Charlie',
    });
    console.log(`STAGED ${p.title} -> approved, ${p.variants.length} variants`);
  }
  console.log('\nAll 5 alternates staged in RLM "approved" column.');
  console.log(`Filter in Conspire: tag contains "slot:alternate-${STAMP}"`);
})().catch(e => { console.error(e); process.exit(1); });
