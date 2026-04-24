#!/usr/bin/env node
/**
 * Publish a Conspire podcast doc to the OpenEd Webflow Posts collection as a
 * draft. The Webflow body is composed of two pieces:
 *
 *   1. A collapsible "View Transcript" embed — the full polished_transcript
 *      rendered client-side by marked.js inside a Webflow rich-text embed
 *      block. Template lives at scripts/transcript-embed-template.html with
 *      a {{TRANSCRIPT}} placeholder.
 *
 *   2. The blog post body itself — pulled from the Proof doc associated with
 *      the Conspire record (proof_slug + proof_token). The Proof doc's title
 *      becomes the Webflow post title. Its markdown body is converted to the
 *      same simple HTML (<h3>, <p>, <ul>, <strong>, etc.) Webflow's rich text
 *      accepts cleanly.
 *
 * Thumbnail: the watercolor (slot 3) is converted to .webp locally via cwebp
 * and uploaded to Webflow's asset store before referencing on the item.
 *
 * Usage:
 *   WEBFLOW_API_KEY=... node publish-to-webflow.cjs <conspire-doc-id> \
 *     [--slug=...] [--publish] [--overwrite=<webflow-item-id>]
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');
const { ConvexHttpClient } = require('convex/browser');

const CONVEX_URL = 'https://usable-pheasant-901.convex.cloud';
const WEBFLOW_BASE = 'https://api.webflow.com/v2';
const WEBFLOW_SITE_ID = '67c7406fc9e6913d1b92e341';
const POSTS_COLLECTION_ID = '6805bf729a7b33423cc8a08c';
const PODCAST_TYPE_ID = '6805d42ba524fabb70579f4e';
const PROOF_BASE = 'https://proof-editor-production.up.railway.app';
const DEFAULT_AUTHOR_ID = '687a70eecef12fb34cead69a'; // Ela Bass

function arg(name) {
  const found = process.argv.find(a => a.startsWith(`--${name}=`));
  return found ? found.split('=').slice(1).join('=') : null;
}

function slugify(s) {
  return s.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function renderInline(s) {
  // &#x20; artifacts from Proof → plain space
  let out = s.replace(/&#x20;/g, ' ');
  out = escapeHtml(out);
  // Links: [text](url)
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, text, url) =>
    `<a href="${url.replace(/"/g, '&quot;')}">${text}</a>`);
  // Auto-link bare <https://...>
  out = out.replace(/&lt;(https?:\/\/[^&]+)&gt;/g, '<a href="$1">$1</a>');
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/(^|[\s(])\*([^*\n]+)\*(?=[\s).,;:!?]|$)/g, '$1<em>$2</em>');
  return out;
}

/**
 * Minimal markdown → HTML for Proof blog bodies.
 * Supports headings, paragraphs with soft-wrap folding, bulleted and
 * numbered lists, horizontal rules, and inline bold/italic/link formatting.
 */
function mdToHtml(md, { demoteHeadings = false } = {}) {
  // Normalize: a blog post written with trailing "\" soft-wraps should still
  // break paragraphs on blank lines, not on line breaks.
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  const blocks = [];
  let buf = [];
  const flushPara = () => {
    if (!buf.length) return;
    // Strip trailing '\' soft-wrap markers and join
    const text = buf.map(l => l.replace(/\\$/, '')).join(' ').trim();
    if (text) blocks.push(`<p>${renderInline(text)}</p>`);
    buf = [];
  };

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const trim = line.trim();

    if (!trim) { flushPara(); i++; continue; }

    if (/^\*\*\*$/.test(trim) || /^---$/.test(trim)) {
      flushPara();
      // Webflow rich text accepts <hr>
      blocks.push('<hr>');
      i++;
      continue;
    }

    const h = trim.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      flushPara();
      let lv = h[1].length;
      if (demoteHeadings && lv === 1) lv = 2;
      lv = Math.min(Math.max(lv, 2), 4);
      blocks.push(`<h${lv}>${renderInline(h[2].trim())}</h${lv}>`);
      i++;
      continue;
    }

    if (/^[-*]\s+/.test(trim)) {
      flushPara();
      const items = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*]\s+/, ''));
        i++;
      }
      blocks.push('<ul>' + items.map(it => `<li>${renderInline(it)}</li>`).join('') + '</ul>');
      continue;
    }

    if (/^\d+\.\s+/.test(trim)) {
      flushPara();
      const items = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s+/, ''));
        i++;
      }
      blocks.push('<ol>' + items.map(it => `<li>${renderInline(it)}</li>`).join('') + '</ol>');
      continue;
    }

    if (/^\[EDIT:[^\]]+\]$/.test(trim)) {
      flushPara();
      blocks.push(`<p><em>${escapeHtml(trim)}</em></p>`);
      i++;
      continue;
    }

    buf.push(trim);
    i++;
  }
  flushPara();
  return blocks.join('');
}

function buildTranscriptEmbed(transcriptMarkdown) {
  // Pre-render the transcript markdown to HTML at build time instead of
  // relying on marked.js in the browser. The original template loads marked
  // via CDN and runs a DOMContentLoaded listener — both flaky inside a
  // Webflow rich-text embed (Designer's preview truncates, and the listener
  // may fire before the embed is hydrated). Pre-rendering makes the widget
  // self-contained: no external scripts, no runtime JS beyond the toggle.
  const rendered = mdToHtml(transcriptMarkdown, { demoteHeadings: false });
  return `<div data-rt-embed-type='true'><style>
.transcript-container { margin: 2rem 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
.transcript-toggle { display: flex; align-items: center; gap: 0.75rem; padding: 0.875rem 1.25rem; background: #FAFAF8; border: 1px solid #E8E8E6; border-radius: 12px; cursor: pointer; font-size: 0.9375rem; font-weight: 500; color: #1A1A1A; width: 100%; text-align: left; transition: all 0.2s ease; }
.transcript-toggle:hover { border-color: #FF5733; box-shadow: 0 2px 8px rgba(255, 87, 51, 0.15); }
.transcript-toggle .toggle-arrow { margin-left: auto; transition: transform 0.3s ease; color: #999; }
.transcript-toggle.active .toggle-arrow { transform: rotate(90deg); color: #FF5733; }
.transcript-content { max-height: 0; overflow: hidden; transition: max-height 0.3s ease-out, opacity 0.3s ease-out; opacity: 0; }
.transcript-content.show { max-height: none; opacity: 1; transition: opacity 0.3s ease-in; }
.transcript-text { padding: 1.75rem; background: #FAFAF8; border-radius: 12px; margin-top: 1rem; border: 1px solid #E8E8E6; color: #1A1A1A; line-height: 1.7; font-size: 0.9375rem; }
.transcript-text p { margin-bottom: 1.25rem; }
.transcript-text p:last-child { margin-bottom: 0; }
.transcript-text h2, .transcript-text h3, .transcript-text h4 { color: #1A1A1A; margin-top: 1.5rem; margin-bottom: 0.75rem; font-weight: 600; }
.transcript-text h2 { font-size: 1.25rem; }
.transcript-text h3 { font-size: 1.1rem; }
.transcript-text strong { font-weight: 600; color: #1A1A1A; }
.transcript-text em { font-style: italic; }
.transcript-text ul, .transcript-text ol { margin-bottom: 1.25rem; padding-left: 1.5rem; }
.transcript-text li { margin-bottom: 0.5rem; }
</style>
<div class="transcript-container">
<button class="transcript-toggle" onclick="var b=this,c=this.nextElementSibling,t=b.querySelector('.toggle-text');b.classList.toggle('active');c.classList.toggle('show');t.textContent=c.classList.contains('show')?'Hide Transcript':'View Transcript';">
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
<span class="toggle-text">View Transcript</span>
<svg class="toggle-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
</button>
<div class="transcript-content"><div class="transcript-text">${rendered}</div></div>
</div></div>`;
}

async function fetchProofDoc(slug, token) {
  const res = await fetch(`${PROOF_BASE}/api/agent/${slug}/state?token=${token}`);
  const text = await res.text();
  if (!res.ok) throw new Error(`Proof ${res.status}: ${text}`);
  const data = JSON.parse(text);
  if (!data.success) throw new Error(`Proof error: ${JSON.stringify(data)}`);
  return { title: data.title || '', markdown: data.content || '' };
}

async function uploadThumbnailAsWebp({ wfKey, sourceUrl }) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'wfthumb-'));
  const srcPath = path.join(tmpDir, 'src.bin');
  const webpPath = path.join(tmpDir, 'thumbnail.webp');
  // Download
  const res = await fetch(sourceUrl);
  if (!res.ok) throw new Error(`thumbnail download ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(srcPath, buf);
  // Convert to webp
  execSync(`cwebp -q 88 ${JSON.stringify(srcPath)} -o ${JSON.stringify(webpPath)}`,
    { stdio: ['ignore', 'ignore', 'inherit'] });
  const webpBuf = fs.readFileSync(webpPath);

  // Webflow asset upload is a two-step: request signed upload URL, then POST
  // the file to S3, then the asset is registered on our side.
  const meta = await fetch(`${WEBFLOW_BASE}/sites/${WEBFLOW_SITE_ID}/assets`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${wfKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fileName: 'thumbnail.webp',
      fileHash: require('crypto').createHash('md5').update(webpBuf).digest('hex'),
    }),
  });
  const metaText = await meta.text();
  if (!meta.ok) throw new Error(`webflow asset init ${meta.status}: ${metaText}`);
  const metaData = JSON.parse(metaText);

  const form = new FormData();
  const fields = metaData.uploadDetails || {};
  // S3 requires all policy/signature fields BEFORE the file field.
  for (const [k, v] of Object.entries(fields)) form.append(k, v);
  form.append('file', new Blob([webpBuf], { type: 'image/webp' }), 'thumbnail.webp');
  const up = await fetch(metaData.uploadUrl, { method: 'POST', body: form });
  if (!up.ok) throw new Error(`s3 upload ${up.status}: ${await up.text()}`);

  // Poll the asset until size > 0 (Webflow processes S3 upload async-ish)
  for (let i = 0; i < 10; i++) {
    const check = await fetch(`${WEBFLOW_BASE}/assets/${metaData.id}`, {
      headers: { Authorization: `Bearer ${wfKey}` },
    });
    const checkData = await check.json();
    if (checkData.size > 0 && checkData.hostedUrl) {
      return { id: metaData.id, url: checkData.hostedUrl };
    }
    await new Promise(r => setTimeout(r, 500));
  }
  return { id: metaData.id, url: metaData.hostedUrl };
}

async function main() {
  const docId = process.argv[2];
  if (!docId) {
    console.error('usage: node publish-to-webflow.cjs <doc-id> [--slug=...] [--publish] [--overwrite=<webflow-item-id>]');
    process.exit(1);
  }
  const slugOverride = arg('slug');
  const overwriteId = arg('overwrite');
  const doPublish = process.argv.includes('--publish');

  const WF_KEY = process.env.WEBFLOW_API_KEY;
  if (!WF_KEY) { console.error('WEBFLOW_API_KEY required'); process.exit(1); }

  const convex = new ConvexHttpClient(CONVEX_URL);
  const doc = await convex.query('documents:get', { id: docId });
  if (!doc) throw new Error(`Doc ${docId} not found`);
  if (doc.doc_type !== 'podcast') throw new Error(`Doc is ${doc.doc_type}, not podcast`);

  if (!doc.proof_slug || !doc.proof_token) {
    throw new Error('Podcast doc has no proof_slug/proof_token — blog body lives in the Proof doc');
  }
  const proof = await fetchProofDoc(doc.proof_slug, doc.proof_token);
  if (!proof.title) throw new Error('Proof doc has no title');
  if (!proof.markdown.trim()) throw new Error('Proof doc has no content');

  // Strip the Proof-title heading off the body if present — Webflow post name
  // already shows it.
  const mdBody = proof.markdown.replace(/^#\s+[^\n]+\n+/, '');

  const title = proof.title.trim();
  const slug = slugOverride || slugify(title);
  const metaDesc = (doc.meta_description || '').trim();
  if (!metaDesc) {
    console.warn('WARN: meta_description is empty on the Conspire doc — set it before publishing for SEO.');
  }

  // Transcript embed + blog body
  const transcriptEmbed = doc.polished_transcript
    ? buildTranscriptEmbed(doc.polished_transcript)
    : '';
  const bodyHtml = mdToHtml(mdBody, { demoteHeadings: true });

  // Subscribe links → then transcript embed → then blog body
  const subscribeLinks = [
    '<p><a href="https://open.spotify.com/show/6Kf7SZ8XASA6tSqMEuHmVC">Subscribe on Spotify</a></p>',
    '<p><a href="https://podcasts.apple.com/us/podcast/the-opened-podcast/id1760216903">Subscribe on Apple Podcasts</a></p>',
    '<p><a href="https://www.youtube.com/@OpenEdHQ">Watch &amp; subscribe on YouTube</a></p>',
  ].join('');
  const content = subscribeLinks + transcriptEmbed + bodyHtml;

  // Leave podcast-embed / video-embed blank for now. YouTube iframe goes in
  // later once the upload is live — populated by a separate PATCH after
  // publish-to-youtube.cjs returns a platformPostUrl.
  const podcastEmbed = '';

  let thumbnailAsset = null;
  const watercolorUrl = doc.thumbnail_urls?.[3];
  if (watercolorUrl) {
    console.log('Converting watercolor → .webp and uploading to Webflow assets...');
    try {
      thumbnailAsset = await uploadThumbnailAsWebp({ wfKey: WF_KEY, sourceUrl: watercolorUrl });
      console.log(`  asset id: ${thumbnailAsset.id}`);
      console.log(`  hosted: ${thumbnailAsset.url}`);
    } catch (e) {
      console.warn(`WARN: webp upload failed, falling back to raw URL reference — ${e.message}`);
    }
  }

  const fieldData = {
    name: title,
    slug,
    'post-type': [PODCAST_TYPE_ID],
    author: DEFAULT_AUTHOR_ID,
    summary: metaDesc,
    content,
    'podcast-embed': podcastEmbed,
    'published-date': doc.publish_date
      ? new Date(doc.publish_date).toISOString()
      : new Date().toISOString(),
  };
  if (thumbnailAsset) {
    fieldData.thumbnail = { fileId: thumbnailAsset.id, url: thumbnailAsset.url };
  } else if (watercolorUrl) {
    fieldData.thumbnail = { url: watercolorUrl };
  }

  console.log(`Title (Proof): ${title}`);
  console.log(`Slug: ${slug}`);
  console.log(`Meta description (${metaDesc.length} chars): ${metaDesc.slice(0, 120)}${metaDesc.length > 120 ? '...' : ''}`);
  console.log(`Transcript embed: ${transcriptEmbed ? transcriptEmbed.length + ' chars' : 'none'}`);
  console.log(`Blog body: ${bodyHtml.length} chars`);
  console.log(`Podcast embed (Descript): ${podcastEmbed ? 'yes' : 'no'}`);
  console.log(`Watercolor thumb: ${thumbnailAsset ? '.webp uploaded' : (watercolorUrl ? 'raw URL fallback' : 'none')}`);
  console.log('---');

  let url, method;
  if (overwriteId) {
    url = `${WEBFLOW_BASE}/collections/${POSTS_COLLECTION_ID}/items/${overwriteId}`;
    method = 'PATCH';
  } else {
    url = `${WEBFLOW_BASE}/collections/${POSTS_COLLECTION_ID}/items`;
    method = 'POST';
  }
  const res = await fetch(url, {
    method,
    headers: { Authorization: `Bearer ${WF_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      isArchived: false,
      isDraft: !doPublish,
      fieldData,
    }),
  });
  const text = await res.text();
  if (!res.ok) { console.error(`Webflow ${res.status}: ${text}`); process.exit(1); }
  const item = JSON.parse(text);
  console.log(`Webflow item: ${item.id} (${overwriteId ? 'updated' : 'created'})`);
  console.log(doPublish ? 'Live on site.' : 'Saved as DRAFT — review in Webflow before publishing.');
}

main().catch(err => { console.error(err.message || err); process.exit(1); });
