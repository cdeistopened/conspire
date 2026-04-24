/**
 * Stage top-percentile RLM clips for repurposing in Conspire.
 *
 * Input: /tmp/rlm-repurpose-tier.json (produced by export_repurpose_tier_for_conspire.py).
 * Behavior:
 *   - Match each entry to an existing Conspire doc by descript_url (preferred) or title.
 *   - Add tags: `tier:top10` / `tier:top25`, `source:instagram-clips`, `pillar:<primary_pillar>`.
 *   - If doc exists and status is draft/archived, move to review.
 *   - If no existing doc, create a new one in status=review with full transcript.
 */
const { ConvexHttpClient } = require('convex/browser');
const fs = require('fs');

const c = new ConvexHttpClient('https://usable-pheasant-901.convex.cloud');
const INPUT = '/tmp/rlm-repurpose-tier.json';
const ACTOR = 'Charlie';

function normTitle(s) {
  return (s || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '');
}

(async () => {
  const entries = JSON.parse(fs.readFileSync(INPUT, 'utf8'));
  console.log(`Loaded ${entries.length} entries to stage.`);

  console.log('Fetching existing rlm docs...');
  const existing = await c.query('documents:listByStatus', { workspace: 'rlm' });
  console.log(`  got ${existing.length} docs.`);

  const byUrl = new Map();
  const byTitle = new Map();
  for (const d of existing) {
    if (d.descript_url) byUrl.set(d.descript_url, d);
    if (d.title) byTitle.set(normTitle(d.title), d);
  }

  const summary = { matched: 0, created: 0, moved_to_review: 0, retagged: 0, skipped_posted: 0, errors: 0 };

  for (const e of entries) {
    try {
      const match = (e.descript_url && byUrl.get(e.descript_url))
                  || (e.title && byTitle.get(normTitle(e.title)));

      const baseTags = new Set();
      baseTags.add(`tier:${e.tier}`);
      baseTags.add('source:instagram-clips');
      if (e.primary_pillar) baseTags.add(`pillar:${e.primary_pillar}`);
      (e.secondary_pillars || []).forEach(p => baseTags.add(`sub:${p}`));
      if (e.cluster_id) baseTags.add(`cluster:${e.cluster_id}`);
      if (e.promo) baseTags.add('flag:promo');
      if (e.speaker_provenance && e.speaker_provenance !== 'rlm') baseTags.add('flag:not-richard');
      if (e.ig_slug) baseTags.add(`ig:${e.ig_slug}`);

      if (match) {
        summary.matched++;
        // Don't disturb already-posted/approved docs
        if (match.status === 'posted' || match.status === 'approved') {
          summary.skipped_posted++;
          // still retag
        }
        const mergedTags = Array.from(new Set([...(match.tags || []), ...baseTags]));
        const tagsChanged = JSON.stringify(mergedTags.sort()) !== JSON.stringify([...(match.tags || [])].sort());
        if (tagsChanged) {
          await c.mutation('documents:update', { id: match._id, tags: mergedTags });
          summary.retagged++;
        }
        if (match.status !== 'review' && match.status !== 'posted' && match.status !== 'approved') {
          await c.mutation('documents:updateStatus', { id: match._id, status: 'review', actor: ACTOR });
          summary.moved_to_review++;
        }
      } else {
        // Create fresh
        const createArgs = {
          title: e.title,
          doc_type: 'short_form_video',
          author: 'Richard',
          workspace: 'rlm',
          body: e.body || '',
          transcript: e.body || '',
          descript_url: e.descript_url || undefined,
          source: 'rlm-clip-library',
          tags: Array.from(baseTags),
        };
        const newId = await c.mutation('documents:create', createArgs);
        await c.mutation('documents:updateStatus', { id: newId, status: 'review', actor: ACTOR });
        summary.created++;
      }
    } catch (err) {
      console.error(`  error on "${e.title}": ${err.message}`);
      summary.errors++;
    }
  }

  console.log('\nSummary:', summary);
})();
