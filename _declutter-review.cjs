/**
 * Move untagged docs in review status back to draft so the review column
 * becomes a curated queue, not a dumping ground.
 *
 * Preserves: any doc with a tier: tag, any doc that has been manually marked
 * by having OST notes, any doc already approved/scheduled/posted.
 */
const { ConvexHttpClient } = require('convex/browser');
const c = new ConvexHttpClient('https://usable-pheasant-901.convex.cloud');

(async () => {
  const all = await c.query('documents:listByStatus', { workspace: 'rlm' });
  const review = all.filter(d => d.status === 'review');
  console.log(`Review docs: ${review.length}`);

  let moved = 0, keptTier = 0, keptNotes = 0;
  for (const d of review) {
    const tags = d.tags || [];
    const hasTier = tags.some(t => t.startsWith('tier:'));
    const hasOstNotes = (d.notes || '').includes('OST v2') || (d.notes || '').includes('title_variants');
    if (hasTier) { keptTier++; continue; }
    if (hasOstNotes) { keptNotes++; continue; }
    await c.mutation('documents:updateStatus', { id: d._id, status: 'draft', actor: 'Charlie' });
    moved++;
  }
  console.log(`Moved to draft: ${moved}`);
  console.log(`Kept in review (has tier tag): ${keptTier}`);
  console.log(`Kept in review (has OST notes): ${keptNotes}`);
})();
