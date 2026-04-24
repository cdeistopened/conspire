const { ConvexHttpClient } = require('convex/browser');
const c = new ConvexHttpClient('https://usable-pheasant-901.convex.cloud');
(async () => {
  const docs = await c.query('documents:listByStatus', { workspace: 'rlm' });
  const approved = docs.filter(d => d.status === 'approved' && d.doc_type === 'short_form_video');
  console.log(`approved short-form videos: ${approved.length}`);
  const match = approved.filter(d => /let go.*past|past.*let go/i.test(d.title));
  console.log('matches:');
  match.forEach(d => console.log(`  - "${d.title}" id=${d._id} descript=${d.descript_url || 'none'}`));
})();
