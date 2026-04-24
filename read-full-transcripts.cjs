const { ConvexHttpClient } = require('convex/browser');
const c = new ConvexHttpClient('https://usable-pheasant-901.convex.cloud');
(async () => {
  const ids = [
    'j9702cr05vqkg4qt6epy8e3nw584ws8q', // fear vs anxiety
    'j97bwk8rbrhwe5atz432dsy33n84wh62', // inner dialogue
    'j97enb9xm3a2de2vwwapf39zb184x1m8', // mood control
  ];
  const docs = await c.query('documents:listByStatus', { workspace: 'rlm' });
  ids.forEach(id => {
    const d = docs.find(x => x._id === id);
    console.log('=== ' + d.title + ' ===');
    console.log(d.transcript || d.body);
    console.log();
  });
})();
