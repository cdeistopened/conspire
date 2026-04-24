const { ConvexHttpClient } = require('convex/browser');
const c = new ConvexHttpClient('https://usable-pheasant-901.convex.cloud');

const clips = [
  {
    id: 'j971rwkqy89ampq9wnmyrpvy4984zaha',
    transcript:
      "a content gap is that's a skill I just haven't taught you yet. right? if a child can't do a math problem it may be that I haven't taught them a piece of that problem-solving solution yet. a child who hasn't learned their multiplication facts we don't expect them to know them without explicitly teaching. a skill gap we define as being an issue in how the brain is processing that information. for example a skill gap might be it's just taking too long for that information to work through the brain, so like a processing speed issue. we hit some cognitive overload and then we're not able to access our higher-level thinking skills. so that would be a skill gap.",
    title_variants: [
      "your kid isn't lazy.",
      "before you blame your teaching, read this",
      "two reasons your kid can't do the math problem",
      "the difference between a content gap and a skill gap",
      "if you can't tell these two apart, you'll blame the wrong thing",
    ],
  },
  {
    id: 'j974jt8e9c9htwh7p8xf6fwyv984ztdt',
    transcript:
      "I just had a mom in my center the other day. I had asked what caused a meltdown at home and she said usually it's when I say something to the effect of, 'don't you know? we covered this already.' and that statement, while it may be encouraging from a parent as to 'hey we did that to kind of help you recall,' could also hit their heart because they actually don't remember. as a parent, when you know my child has a working memory and long-term memory weakness, they probably don't remember. it changes your framework as a parent. those kinds of little shifts can really impact your homeschool day when you can see it from that skill-building perspective.",
    title_variants: [
      "your kid actually doesn't remember.",
      "stop saying 'don't you know this already'",
      "the sentence that caused a homeschool meltdown",
      "if you've ever said 'we covered this yesterday'",
      "a mom told me her son melted down over one question",
    ],
  },
];

(async () => {
  for (const clip of clips) {
    console.log(`\nUpdating ${clip.id}...`);
    const res = await c.mutation('documents:update', {
      id: clip.id,
      transcript: clip.transcript,
      title_variants: clip.title_variants,
    });
    console.log('  ok');
    // read back
    const doc = await c.query('documents:get', { id: clip.id });
    console.log('  title:', doc.title);
    console.log('  transcript chars:', (doc.transcript || '').length);
    console.log('  title_variants:', doc.title_variants);
  }
})().catch(e => { console.error(e); process.exit(1); });
