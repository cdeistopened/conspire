const { ConvexHttpClient } = require('convex/browser');
const c = new ConvexHttpClient('https://usable-pheasant-901.convex.cloud');

const body = `You cannot remake the past. No matter what we do, it is not ours to rewrite.

But the past walks into your head anyway. Late at night. In traffic. In the middle of a conversation. That old memory shows up and wants your attention.

Here is what I do, and what I teach every patient. The moment the past intrudes, I count. One, two, three, four. I take control of the screen of my mind. I do not fight the thought, I replace it.

You can review the past. You can learn from it. But you cannot live there, and you cannot fix what is already done.

Practice 60 seconds, five times a day. Your mind will start to listen.

— Richard

--- Instagram ---
Same as master. Add: #mindmastery #lettinggo #mentalhealth #overthinking #presentmoment #drrichardmiller

--- TikTok ---
You cannot remake the past. So stop trying.

The past walks into your head at 3am. In traffic. Mid-conversation. Here's what I do.

Count. One. Two. Three. Four.

Take control of the screen of your mind. Do not fight the thought. Replace it.

Review the past if you must. You cannot live there.

60 seconds. Five times a day. Your mind will start to listen.

--- YouTube Short ---
Title: The 4-count that stops a looping memory
Description: 65 years as a clinical psychologist. One tool I teach every patient for when the past walks into the present. Count one, two, three, four. Replace the thought. Practice 60 seconds, five times a day.

--- Facebook ---
You cannot remake the past. I have spent 65 years telling patients this, and it still surprises them every time.

But the past walks into your head anyway. Late at night, in traffic, in the middle of a conversation you are trying to have in the present. That old memory shows up and wants your attention.

Here is what I do. The moment the past intrudes, I count. One. Two. Three. Four. I take control of what is on the screen of my mind. I do not fight the thought, I replace it.

You can review the past. You can learn from it. But you cannot live there, and you cannot fix what is already done.

Practice for 60 seconds, five times a day. Your mind will start to listen.

Essential for happiness, not optional.`;

const notes = `GOLDMAN-STYLE (prioritize these)

1. you cannot rewrite your past
2. reviewing the past is fine. rewriting it is poison.
3. if the past keeps breaking in at 3am
4. after 65 years of practice, here's what nobody tells you about regret
5. if you keep replaying the same conversation in your head
6. the past is not yours to fix
7. at 87, i still use this trick when the past shows up
8. what i tell every patient about the past
9. your mind will replay it forever if you let it
10. a patient told me she had been replaying it for 40 years
11. if you are still rehearsing what you should have said
12. one, two, three, four. that is the whole tool.

OTHER STYLES

13. [polarizing]        the past was never the problem. replaying it was.
14. [direct challenge]  stop rehearsing the same memory
15. [data punch]        65 years as a psychologist, this is the one tool i use every day
16. [identity]          if you are someone who replays conversations
17. [story starter]     the past walked into my head at 2am. i counted to four.
18. [curiosity gap]     why the same memory keeps coming back
19. [counter-intuitive] the memory is not stuck. you are holding it.`;

(async () => {
  await c.mutation('documents:update', {
    id: 'j977thz82m166vntrygybbq1nd84wmsh',
    body,
    notes,
  });
  console.log('wrote body + notes to let-go-of-past doc');
})();
