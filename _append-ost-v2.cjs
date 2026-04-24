/**
 * Append OST v2 variants to the notes field of matching Conspire docs.
 * Does NOT replace existing notes — appends a dated v2 block.
 * Matches by descript_url (if present) or normalized title.
 */
const { ConvexHttpClient } = require('convex/browser');
const fs = require('fs');

const c = new ConvexHttpClient('https://usable-pheasant-901.convex.cloud');
const INPUT = '/tmp/rlm-ost-v2.json';

function normTitle(s) {
  return (s || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '');
}

(async () => {
  const data = JSON.parse(fs.readFileSync(INPUT, 'utf8'));
  console.log(`OST v2 has ${data.entries.length} clip entries.`);

  const existing = await c.query('documents:listByStatus', { workspace: 'rlm' });
  console.log(`Loaded ${existing.length} rlm docs.`);

  const byTitle = new Map();
  const bySlug = new Map();
  const byIgSlug = new Map();
  for (const d of existing) {
    if (d.title) byTitle.set(normTitle(d.title), d);
    if (d.descript_url) {
      const m = d.descript_url.match(/\/view\/([^/?]+)/);
      if (m) bySlug.set(m[1], d);
    }
    // ig_slug might be in tags as ig:<slug>
    for (const t of (d.tags || [])) {
      if (t.startsWith('ig:')) byIgSlug.set(t.slice(3), d);
    }
  }

  const summary = { updated: 0, skipped_no_match: 0, already_has_v2: 0 };

  for (const e of data.entries) {
    const titleKey = normTitle(e.title);
    const match = byIgSlug.get(e.ig_slug) || byTitle.get(titleKey);
    if (!match) {
      console.log(`  NO MATCH: ${e.file} (ig:${e.ig_slug}, title:"${e.title}")`);
      summary.skipped_no_match++;
      continue;
    }
    const existingNotes = match.notes || '';
    if (existingNotes.includes('## OST v2')) {
      console.log(`  SKIP (v2 already present): ${match.title}`);
      summary.already_has_v2++;
      continue;
    }
    let block = `\n\n## OST v2 — ${data.runDate} (Hacker/Power-Move/Identify/Paradox/Shift patterns, sentence case)\n`;
    for (const v of e.variants) {
      const marker = v.star ? '★ ' : '  ';
      block += `${marker}"${v.text}" — ${v.pattern}\n`;
    }
    const newNotes = existingNotes + block;
    await c.mutation('documents:update', { id: match._id, notes: newNotes });
    console.log(`  APPENDED v2 to: ${match.title}`);
    summary.updated++;
  }

  console.log('\nSummary:', summary);
})();
