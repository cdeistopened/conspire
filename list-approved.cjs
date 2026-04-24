const { ConvexHttpClient } = require('convex/browser');
const c = new ConvexHttpClient('https://usable-pheasant-901.convex.cloud');
(async () => {
  const docs = await c.query('documents:listByStatus', { workspace: 'rlm' });
  const approved = docs.filter(d => d.status === 'approved' && d.doc_type === 'short_form_video');
  approved.forEach(d => {
    console.log('---');
    console.log('title:', d.title);
    console.log('_id:', d._id);
    console.log('descript:', d.descript_url);
    console.log('tags:', (d.tags || []).filter(t => t.startsWith('pillar:') || t.startsWith('sub:')).join(', '));
    console.log('transcript:', (d.transcript || d.body || '').slice(0, 400));
  });
})();
