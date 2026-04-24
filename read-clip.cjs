const { ConvexHttpClient } = require('convex/browser');
const c = new ConvexHttpClient('https://usable-pheasant-901.convex.cloud');
(async () => {
  const docs = await c.query('documents:listByStatus', { workspace: 'rlm' });
  const doc = docs.find(d => d._id === 'j977thz82m166vntrygybbq1nd84wmsh');
  console.log(JSON.stringify(doc, null, 2));
})();
