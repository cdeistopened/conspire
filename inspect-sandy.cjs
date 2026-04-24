const { ConvexHttpClient } = require('convex/browser');
const c = new ConvexHttpClient('https://usable-pheasant-901.convex.cloud');

const IDS = [
  'j971rwkqy89ampq9wnmyrpvy4984zaha',
  'j974jt8e9c9htwh7p8xf6fwyv984ztdt',
];

(async () => {
  for (const id of IDS) {
    const doc = await c.query('documents:get', { id });
    console.log('\n=====', doc.title, '=====');
    console.log('id:', doc._id);
    console.log('status:', doc.status);
    console.log('doc_type:', doc.doc_type);
    console.log('author:', doc.author);
    console.log('descript_url:', doc.descript_url);
    console.log('external_url:', doc.external_url);
    console.log('tags:', doc.tags);
    console.log('source:', doc.source);
    console.log('platform:', doc.platform);
    console.log('transcript length:', (doc.transcript || '').length);
    console.log('transcript preview:', (doc.transcript || '').slice(0, 300));
    console.log('body length:', (doc.body || '').length);
    console.log('body preview:', (doc.body || '').slice(0, 300));
    console.log('title_variants:', doc.title_variants);
    console.log('thumbnail_urls:', doc.thumbnail_urls);
    console.log('polished_transcript length:', (doc.polished_transcript || '').length);
    console.log('youtube_show_notes length:', (doc.youtube_show_notes || '').length);
    console.log('notes:', doc.notes);
  }
})().catch(e => { console.error(e); process.exit(1); });
