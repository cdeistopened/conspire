const { ConvexHttpClient } = require('convex/browser');
const c = new ConvexHttpClient('https://usable-pheasant-901.convex.cloud');

const clip1Notes = `## Instagram
A content gap means the skill just hasn't been taught yet.
A skill gap means the brain is struggling to process the information.

Sandy Zamalis (@thebrainymoms), cognitive specialist, on why every homeschool mom should know the difference.

#Homeschool #HomeschoolMom #LearningGaps #Parenting #HomeschoolLife #SpecialEducation #LearningDisabilities #BrainyMoms #OpenEd

---

## Facebook
A content gap means the skill just hasn't been taught yet. A skill gap means the brain is struggling to process the information.

Sandy Zamalis, cognitive specialist and co-host of The Brainy Moms Podcast, on why every homeschool mom should know the difference.

> Tag @TheBrainyMoms page on manual publish (Getlate can't tag FB pages in-caption).

---

## TikTok
content gap or skill gap? they look the same. they're not.

sandy zamalis @thebrainymoms on the difference.

#homeschool #homeschoolmom #learninggaps #brainymoms

---

## YouTube Shorts
**Title:** Content gap vs. skill gap — the one every homeschool mom should know
Content gap vs. skill gap. Sandy Zamalis of @thebrainymoms on the difference every homeschool mom should know.

#Shorts #Homeschool #LearningGaps #HomeschoolMom
`;

const clip2Notes = `## Instagram
A child with working memory weakness genuinely doesn't remember what you did yesterday.

Sandy Zamalis (@thebrainymoms) on the framework shift that changes your whole homeschool day.

#Homeschool #HomeschoolMom #WorkingMemory #LearningDifferences #Parenting #HomeschoolLife #BrainyMoms #OpenEd

---

## Facebook
A child with working memory weakness genuinely doesn't remember what you did yesterday.

Sandy Zamalis, cognitive specialist and co-host of The Brainy Moms Podcast, on the framework shift that changes your whole homeschool day.

> Tag @TheBrainyMoms page on manual publish (Getlate can't tag FB pages in-caption).

---

## TikTok
stop saying "don't you know this already."

sandy zamalis @thebrainymoms on the one shift that changes your homeschool day.

#homeschool #homeschoolmom #workingmemory #brainymoms

---

## YouTube Shorts
**Title:** The sentence that breaks your homeschool day
"Don't you know, we covered this already" — the one sentence that breaks your homeschool day. Sandy Zamalis of @thebrainymoms on the framework shift that changes everything.

#Shorts #Homeschool #WorkingMemory #HomeschoolMom
`;

(async () => {
  const updates = [
    { id: 'j971rwkqy89ampq9wnmyrpvy4984zaha', notes: clip1Notes },
    { id: 'j974jt8e9c9htwh7p8xf6fwyv984ztdt', notes: clip2Notes },
  ];
  for (const u of updates) {
    await c.mutation('documents:update', u);
    const doc = await c.query('documents:get', { id: u.id });
    console.log(`updated ${doc.title} — notes now ${doc.notes.length} chars`);
  }
})().catch(e => { console.error(e); process.exit(1); });
