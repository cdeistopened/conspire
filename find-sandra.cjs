const { ConvexHttpClient } = require('convex/browser');
const c = new ConvexHttpClient('https://usable-pheasant-901.convex.cloud');

(async () => {
  const docs = await c.query('documents:listByStatus', { workspace: 'opened' });
  console.log(`Total opened docs: ${docs.length}`);
  const sandra = docs.filter(d => {
    const hay = [d.title, d.author, d.body, d.source, (d.tags || []).join(' ')]
      .filter(Boolean).join(' ').toLowerCase();
    return hay.includes('sandra') || hay.includes('zamalas') || hay.includes('zamala');
  });
  console.log(`\nSandra matches: ${sandra.length}`);
  for (const m of sandra) {
    console.log(JSON.stringify({
      _id: m._id,
      title: m.title,
      doc_type: m.doc_type,
      status: m.status,
      author: m.author,
      descript_url: m.descript_url,
      external_url: m.external_url,
      has_transcript: !!(m.transcript && m.transcript.length > 0),
      transcript_chars: (m.transcript || '').length,
      title_variants: (m.title_variants || []).length,
      thumbnail_urls: (m.thumbnail_urls || []).length,
      tags: m.tags,
      source: m.source,
    }, null, 2));
  }

  const reviewDocs = docs.filter(d => d.status === 'review');
  console.log(`\n\nAll 'review' status docs in opened: ${reviewDocs.length}`);
  for (const m of reviewDocs) {
    console.log(`  id=${m._id} title=${JSON.stringify(m.title)} author=${m.author} descript=${(m.descript_url || '').slice(0, 70)}`);
  }
})().catch(e => { console.error(e); process.exit(1); });
