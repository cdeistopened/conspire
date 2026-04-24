const { ConvexHttpClient } = require('convex/browser');
const c = new ConvexHttpClient('https://usable-pheasant-901.convex.cloud');

(async () => {
  const doc = await c.query('documents:get', {
    id: 'j977thz82m166vntrygybbq1nd84wmsh'
  });
  console.log('=== FULL DOC ===\n');
  console.log('Title:', doc.title);
  console.log('Status:', doc.status);
  console.log('Descript URL:', doc.descript_url);
  console.log('Tags:', doc.tags);
  console.log('Zernio post id:', doc.zernio_post_id || '(not scheduled yet)');
  console.log('Chosen variant index:', doc.chosen_variant_index);
  console.log();
  console.log('--- BODY ---');
  console.log(doc.body);
  console.log();
  console.log('--- NOTES (full) ---');
  console.log(doc.notes);
  console.log();
  console.log('--- TITLE VARIANTS ---');
  (doc.title_variants || []).forEach((v, i) => console.log(`  ${i}: ${v}`));
  console.log();
  console.log('--- TRANSCRIPT (if separate) ---');
  console.log(doc.transcript?.slice(0, 1000) || '(same as body)');
})();
