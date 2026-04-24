const { ConvexHttpClient } = require('convex/browser');
const fs = require('fs');
const c = new ConvexHttpClient('https://usable-pheasant-901.convex.cloud');

(async () => {
  const body = fs.readFileSync('/tmp/conspire-body.md', 'utf8');
  const docId = await c.mutation('documents:create', {
    title: 'OpenEd Weekly Review — 2026-04-20',
    doc_type: 'note',
    workspace: 'opened',
    author: 'Charlie',
    body,
    tags: ['weekly-review', 'analytics', 'audience-scorecard', 'market-kpis', 'newsletter-reset'],
    source: 'analytics-dashboard-snapshot',
  });
  console.log('Created doc:', docId);
  console.log('View at: https://conspire-production.up.railway.app/?workspace=opened');
})();
