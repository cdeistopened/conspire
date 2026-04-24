const { ConvexHttpClient } = require('convex/browser');
const fs = require('fs');
const c = new ConvexHttpClient('https://usable-pheasant-901.convex.cloud');

(async () => {
  const body = fs.readFileSync('/tmp/conspire-body.md', 'utf8');
  const docId = await c.mutation('documents:create', {
    title: 'Re-engagement sequence — April 2026 (3 emails)',
    doc_type: 'newsletter',
    workspace: 'opened',
    author: 'Charlie',
    body,
    tags: ['re-engagement', 'graymail-cleanup', 'apr-2026', 'ready-for-george'],
  });
  console.log('Created doc:', docId);
  console.log('View at: https://conspire-production.up.railway.app/?workspace=opened');
})();
