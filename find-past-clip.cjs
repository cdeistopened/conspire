const { ConvexHttpClient } = require('convex/browser');
const c = new ConvexHttpClient('https://usable-pheasant-901.convex.cloud');

(async () => {
  const docs = await c.query('documents:listByStatus', { workspace: 'rlm' });
  console.log(`Total RLM docs: ${docs.length}`);
  const shortForm = docs.filter(d => d.doc_type === 'short_form_video');
  console.log(`Short-form videos: ${shortForm.length}`);
  console.log();

  // Look for past-themed clips in approved/review/scheduled
  const candidates = shortForm.filter(d => {
    const status = d.status;
    const title = (d.title || '').toLowerCase();
    const isOnDeck = ['approved', 'review', 'scheduled'].includes(status);
    const isPastThemed = /past|let go|stuck|rumination|replay|yesterday/i.test(title);
    return isOnDeck && isPastThemed;
  });

  console.log(`Past-themed on-deck: ${candidates.length}`);
  for (const d of candidates) {
    console.log(`\n[${d.status}] ${d.title}`);
    console.log(`  id: ${d._id}`);
    console.log(`  descript: ${d.descript_url || '-'}`);
    console.log(`  tags: ${(d.tags || []).slice(0, 8).join(', ')}`);
    console.log(`  zernio_post_id: ${d.zernio_post_id || '-'}`);
    console.log(`  body (first 300): ${(d.body || '').slice(0, 300)}`);
    console.log(`  notes (first 500): ${(d.notes || '').slice(0, 500)}`);
    console.log(`  title_variants: ${JSON.stringify(d.title_variants || [])}`);
    console.log(`  chosen_variant_index: ${d.chosen_variant_index}`);
  }
  console.log();
  console.log('=== All approved status (for context) ===');
  for (const d of shortForm.filter(d => d.status === 'approved')) {
    console.log(`  ${d._id}  "${d.title}"  zernio=${d.zernio_post_id || '-'}`);
  }
})();
