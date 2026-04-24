const { ConvexHttpClient } = require('convex/browser');
const c = new ConvexHttpClient('https://usable-pheasant-901.convex.cloud');

(async () => {
  const docs = await c.query('documents:listByStatus', { workspace: 'rlm' });
  console.log(`Total rlm docs: ${docs.length}`);
  const byStatus = {};
  const byType = {};
  const urls = new Set();
  const titles = new Set();
  for (const d of docs) {
    byStatus[d.status] = (byStatus[d.status] || 0) + 1;
    byType[d.doc_type] = (byType[d.doc_type] || 0) + 1;
    if (d.descript_url) urls.add(d.descript_url);
    if (d.title) titles.add(d.title.toLowerCase().trim());
  }
  console.log('By status:', byStatus);
  console.log('By type:', byType);
  console.log('Unique descript_urls:', urls.size);
  console.log('Unique titles (lowercased):', titles.size);
  // Sample 5 short-form video titles in review status
  console.log('\nSample docs in status=review:');
  docs.filter(d => d.status === 'review').slice(0, 5).forEach(d => {
    console.log(`  "${d.title}" — ${d.doc_type} — ${d.descript_url || ''}`);
  });
})();
