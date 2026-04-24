const { ConvexHttpClient } = require('convex/browser');
const c = new ConvexHttpClient('https://usable-pheasant-901.convex.cloud');
(async () => {
  const docs = await c.query('documents:listByStatus', { workspace: 'rlm' });
  const d = docs.find(x => x._id === 'j97enb9xm3a2de2vwwapf39zb184x1m8');
  if (!d) { console.log('NOT FOUND'); return; }
  console.log('Title:', d.title);
  console.log('Status:', d.status);
  console.log('Descript URL:', d.descript_url);
  console.log('Tags:', (d.tags || []).join(', '));
  console.log('Zernio post id:', d.zernio_post_id || '(none)');
  console.log('Chosen variant index:', d.chosen_variant_index);
  console.log('\n--- TITLE_VARIANTS ---');
  (d.title_variants || []).forEach((v, i) => console.log(`  ${i}: ${v}`));
  console.log('\n--- BODY ---');
  console.log(d.body || '(empty)');
  console.log('\n--- NOTES ---');
  console.log(d.notes || '(empty)');
  console.log('\n--- TRANSCRIPT ---');
  console.log(d.transcript || '(empty)');
})();
