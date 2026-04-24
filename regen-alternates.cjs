const { ConvexHttpClient } = require('convex/browser');
const c = new ConvexHttpClient('https://usable-pheasant-901.convex.cloud');
const STAMP = '2026-04-16';

// 7 archetype-tagged OST options per clip. Archetypes span ≥5 of:
// contrarian | imperative | specificity | story | paradox | you-diagnosis |
// authority | question | conditional | absolute | punch
const picks = [
  {
    id: 'j97bwk8rbrhwe5atz432dsy33n84wh62',
    title: 'Inner Dialogue',
    variants: [
      '[contrarian] your mind records every word you say to yourself',
      '[imperative] stop talking to yourself like that',
      '[specificity] 1,800 insults a year. all from you.',
      '[story] a patient told me she had been lying to her mind for 40 years',
      '[paradox] the meanest person you know lives in your head',
      '[you-diagnosis] you have been programming your own anxiety',
      '[authority] 65 years of practice and this is the #1 thing i tell patients',
    ],
    recommended: 2,
    why: 'Top-performer lineage (127K-view self-talk category). 7 archetypes, specificity bomb recommended because the 1,800/year math is from Richard himself.',
  },
  {
    id: 'j9783mr96pvwrmwmn17h0fvh2584wgp1',
    title: 'Anxiety Solution',
    variants: [
      '[contrarian] therapy is the slowest way to beat anxiety',
      '[specificity] the cure for anxiety is 30 seconds long',
      '[imperative] stop treating anxiety. start breathing.',
      '[you-diagnosis] you are paying for a problem your body can fix for free',
      '[paradox] the cure for anxiety is free',
      '[authority] 65 years and i have never met an anxiety breathing could not touch',
      '[question] what if anxiety was the simplest problem you have?',
    ],
    recommended: 1,
    why: 'Punchy :33 clip. "30 seconds long" pairs tightly with the BREATHE CTA end-card.',
    endcard_ost: [
      'comment BREATHE for the guide',
      'comment BREATHE for my 2-minute fix',
      'type BREATHE — I will DM the guide',
    ],
    captions: {
      instagram: 'Anxiety lives in your chest. Breathing reaches it faster than anything else I have tried in 65 years of practice.\n\nComment BREATHE and I will send you my 2-minute breathing guide.\n\nSave this for the next time your chest feels tight.\n\n#anxiety #anxietyrelief #breathwork #nervoussystem #mentalhealth #meditation #somatic #therapy #psychology #selfregulation',
      tiktok: 'Anxiety? Breathing. That is it. 65 years of practice and I have never met anxiety that breathing could not touch.\n\nComment BREATHE for the 2-minute guide.\n\n#anxiety #breathwork #mentalhealth #therapist #psychology',
      youtube_shorts: 'How to stop anxiety in 30 seconds using abdominal breathing. Dr. Richard Miller, clinical psychologist (65 years of practice), explains the simplest anxiety tool.\n\nComment BREATHE for my free 2-minute breathing guide.\n\n#anxiety #anxietyrelief #breathwork #howtobeatanxiety #shorts',
    },
  },
  {
    id: 'j97enb9xm3a2de2vwwapf39zb184x1m8',
    title: 'Mood Control',
    variants: [
      '[punch] you chose this mood',
      '[conditional] if your mood rules your day, you never learned this',
      '[imperative] stop waiting for your mood to change',
      '[you-diagnosis] your mood is not happening to you',
      '[specificity] five times a day, reset your mood',
      '[question] what mood do you want right now?',
      '[paradox] you own your mood. you just keep renting it out.',
    ],
    recommended: 0,
    why: '4-word punch forces the viewer to defend themselves. Actionable payoff (conjure the mood).',
  },
  {
    id: 'j977thz82m166vntrygybbq1nd84wmsh',
    title: 'How to let go of the past',
    variants: [
      '[punch] stop replaying it',
      '[contrarian] you cannot remake the past',
      '[specificity] when the past comes back, count to four',
      '[you-diagnosis] your past is renting space in your head',
      '[paradox] reviewing the past is fine. rewriting it is poison.',
      '[conditional] if you are replaying the same memory tonight, you never learned this',
      '[authority] in 65 years i have never seen the past get smaller on its own',
    ],
    recommended: 0,
    why: '3-word imperative punch universally recognized. Concrete tool (count to four) is inside the clip.',
  },
  {
    id: 'j9702cr05vqkg4qt6epy8e3nw584ws8q',
    title: 'Difference between fear and anxiety.',
    variants: [
      '[contrarian-definitional] you are not afraid. you are anxious. there is a difference.',
      '[story] a bear in the woods is fear. your to-do list is anxiety.',
      '[punch] anxiety is a bear you made up',
      '[you-diagnosis] you are not afraid of anything real',
      '[imperative] name it. fear or anxiety. then treat it.',
      '[paradox] the thing scaring you is not in the room',
      '[question] is there a real threat, or are you making one up?',
    ],
    recommended: 1,
    why: 'Bear metaphor is shareable + educational. Definitional aha opens the loop.',
  },
];

(async () => {
  for (const p of picks) {
    const docs = await c.query('documents:listByStatus', { workspace: 'rlm' });
    const doc = docs.find(d => d._id === p.id);
    if (!doc) { console.log(`SKIP ${p.title} (not found)`); continue; }

    const tags = Array.from(new Set([...(doc.tags || []), `slot:alternate-${STAMP}`]));

    // Build notes body — reasoning + CTA block (Anxiety Solution only)
    let notes = `[${STAMP} OST v2 (7 variants)] ${p.why}`;
    if (p.endcard_ost) {
      notes += `\n\nEND-CARD OST (last 3s):\n` + p.endcard_ost.map((v, i) => `  ${i + 1}. ${v}`).join('\n');
    }
    if (p.captions) {
      notes += `\n\nPER-PLATFORM CAPTIONS (tasteful BREATHE CTA):\n\n`;
      notes += `── INSTAGRAM ──\n${p.captions.instagram}\n\n`;
      notes += `── TIKTOK ──\n${p.captions.tiktok}\n\n`;
      notes += `── YOUTUBE SHORTS ──\n${p.captions.youtube_shorts}`;
    }

    await c.mutation('documents:update', {
      id: p.id,
      title_variants: p.variants,
      chosen_variant_index: undefined,  // clear previous pick so Charlie re-stars
      tags,
      notes,
    });
    console.log(`REGEN ${p.title} -> ${p.variants.length} variants, recommended=${p.recommended}${p.captions ? ' +captions +endcard' : ''}`);
  }
  console.log(`\nAll 5 clips regenerated with 7 variants each. Anxiety Solution also has end-card OST + 3-platform captions in its notes field.`);
})().catch(e => { console.error(e); process.exit(1); });
