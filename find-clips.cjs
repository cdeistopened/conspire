const { ConvexHttpClient } = require('convex/browser');
const c = new ConvexHttpClient('https://usable-pheasant-901.convex.cloud');

const wanted = [
  "Inner Dialogue",
  "Anxiety Solution",
  "Mood Control",
  "How to let go of the past",
  "Difference between fear and anxiety",
];

(async () => {
  const docs = await c.query('documents:listByStatus', { workspace: 'rlm' });
  console.log(`Total RLM docs: ${docs.length}`);
  for (const w of wanted) {
    const lc = w.toLowerCase();
    const matches = docs.filter(d => (d.title || '').toLowerCase().includes(lc));
    console.log(`\n[${w}] -> ${matches.length} match(es)`);
    for (const m of matches.slice(0, 6)) {
      console.log(`  id=${m._id}  status=${m.status}  title=${JSON.stringify(m.title)}  descript=${(m.descript_url || '').slice(0, 60)}  duration=${m.duration || '?'}`);
    }
  }
})().catch(e => { console.error(e); process.exit(1); });
