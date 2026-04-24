const { ConvexHttpClient } = require('convex/browser');
const c = new ConvexHttpClient('https://usable-pheasant-901.convex.cloud');

(async () => {
  const docs = await c.query('documents:listByStatus', { workspace: 'rlm' });
  const r = docs.filter(d => d.status === 'review');
  console.log(`Total rlm docs: ${docs.length}`);
  console.log(`In status=review: ${r.length}`);
  const tiers = { top10: 0, top25: 0, top50: 0, none: 0 };
  let withV1 = 0, withV2 = 0, withIg = 0;
  for (const d of r) {
    const tags = d.tags || [];
    if (tags.some(t => t === 'tier:top10')) tiers.top10++;
    else if (tags.some(t => t === 'tier:top25')) tiers.top25++;
    else if (tags.some(t => t === 'tier:top50')) tiers.top50++;
    else tiers.none++;
    if (tags.some(t => t.startsWith('ig:'))) withIg++;
    const notes = d.notes || '';
    if (notes.includes('OST v2')) withV2++;
    if (notes.includes('OST v1') || notes.includes('Goldman') || notes.match(/^\d+\./m)) withV1++;
  }
  console.log(`Tier breakdown in review:`, tiers);
  console.log(`With IG metadata tag: ${withIg}`);
  console.log(`With OST v2 notes: ${withV2}`);
  console.log(`With any OST notes: ${withV1}`);

  // Show top10 by ig_views for context
  console.log(`\nTop-10 clips in review (by tier:top10 tag):`);
  const top10s = r.filter(d => (d.tags || []).includes('tier:top10'));
  top10s.sort((a,b) => (b.ig_views || 0) - (a.ig_views || 0));
  for (const d of top10s.slice(0, 22)) {
    const igV = d.ig_views || 'n/a';
    const hasNotes = (d.notes || '').includes('OST v2') ? '★ OST v2' : '';
    console.log(`  ${(d.title || '').slice(0,55).padEnd(55)}  ${hasNotes}`);
  }
})();
