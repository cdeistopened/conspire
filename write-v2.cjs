const { ConvexHttpClient } = require('convex/browser');
const c = new ConvexHttpClient('https://usable-pheasant-901.convex.cloud');

const PLATFORM_TAGS = ['platform:instagram', 'platform:tiktok', 'platform:facebook', 'platform:youtube'];

function ensurePlatforms(existingTags) {
  const tags = existingTags ?? [];
  const nonPlatform = tags.filter(t => !t.startsWith('platform:'));
  return [...nonPlatform, ...PLATFORM_TAGS];
}

function starPick(notes, pickedLineNumber) {
  return notes.replace(
    new RegExp(`^${pickedLineNumber}\\. `, 'm'),
    `★ ${pickedLineNumber}. `
  );
}

const clips = [
  {
    id: 'j977thz82m166vntrygybbq1nd84wmsh',
    title: 'How to let go of the past',
    pickLine: 2,
    existingTags: [
      'pillar:presence-letting-go','sub:aging-with-purpose','sub:mind-mastery',
      'source:instagram-clips','series:november-videos','slot:alternate-2026-04-16',
    ],
    body: `The past walks into your head when you are not looking for it. Three in the morning. Driving home. In the middle of a conversation.

When it shows up, most people try to rewrite it. Relitigate it. Fix the conversation they should have had ten years ago. It does not work. You cannot remake the past.

You can review the past. You can learn from what happened. That is useful. Living there is not.

Here is what I do, and what I teach every patient. The moment the past intrudes, I count. One. Two. Three. Four. I take control of what is on the screen of my mind. I do not fight the thought. I replace it.

Practice 60 seconds, five times a day. A week in, you will notice something. The past still shows up. It just does not get to stay.

Essential for happiness. Not optional.

— Richard

--- Instagram ---
Same as master.

Hashtags: #mindmastery #lettinggo #overthinking #mentalhealth #presentmoment #anxietyrelief #drrichardmiller #psychology

--- TikTok ---
The past walks into your head at 3am.

In traffic. Mid-conversation. Ten years ago, fifteen, thirty.

Most people try to rewrite it. It does not work. You cannot remake the past.

Here is what I do. When the past intrudes, I count. One. Two. Three. Four.

Take control of the screen of your mind. Do not fight the thought. Replace it.

Practice 60 seconds, five times a day.

A week in, the past still shows up. It just does not get to stay.

--- YouTube Short ---
Title: The 4-count that evicts a looping memory
Description: 65 years as a clinical psychologist. When the past walks into the present at 3am, in traffic, in the middle of a conversation, you cannot rewrite it. But you can evict it. Count one, two, three, four. Replace the thought. Practice 60 seconds, five times a day. A week in, the past still shows up, it just does not get to stay.

--- Facebook ---
The past walks into your head when you are not looking for it. Three in the morning. Driving home. In the middle of a conversation you are trying to have in the present.

When it shows up, most people try to rewrite it. They relitigate the argument, rehearse the thing they should have said, conduct the conversation they never had. And then they do it again the next night. It does not work. You cannot remake the past. In decades of practice, I have never seen anyone do it.

You can review the past. You can learn from what happened and carry that forward. That is useful. Living there is not.

Here is what I do, and what I teach every patient. The moment the past intrudes, I count. One. Two. Three. Four. I take control of what is on the screen of my mind. I do not fight the thought, which only makes it louder. I replace it.

Practice 60 seconds, five times a day. A week in, you will notice something different. The past still shows up. It just does not get to stay.

Essential for happiness. Not optional.`,
    notes: `★ 2. reviewing the past is fine. rewriting it is poison.

GOLDMAN-STYLE (prioritize these)

1. you cannot rewrite your past
★ 2. reviewing the past is fine. rewriting it is poison.
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
19. [counter-intuitive] the memory is not stuck. you are holding it.`,
  },
  {
    id: 'j9702cr05vqkg4qt6epy8e3nw584ws8q',
    title: 'Difference between fear and anxiety',
    pickLine: 5,
    existingTags: ['pillar:emotion-regulation','sub:mind-mastery'],
    body: `Fear and anxiety feel identical in the body. The pounding chest, the tight throat, the mind racing for an exit. They are not the same thing.

Fear is a bear on the trail. A gun to your face. A car crossing the center line. Something is happening right now, and your body is doing its job.

Anxiety is a story. The exam you have not taken. The spouse who has not left. The diagnosis you have not received. Your body fires on a future that may never come. It also fires on a past that is already done. Nothing is happening in the room. Only in your head.

Fear is brought on by the world. Anxiety is brought on by us.

This matters because the tools are different. Fear, you meet head on. You breathe, you act, you move through it. Anxiety, you interrupt before it builds. Count numbers. Name five things you can see in the room. Take control of the screen of your mind.

First, tell them apart. Then reach for the right tool.

— Richard

--- Instagram ---
Same as master.

Hashtags: #anxiety #fear #mindmastery #mentalhealth #overthinking #anxietyrelief #drrichardmiller #psychology

--- TikTok ---
Fear and anxiety feel the same in the body.

They are not the same thing.

Fear is a bear on the trail. A gun to your face. Something is happening right now. Your body is doing its job.

Anxiety is a story. The exam you have not taken. The spouse who has not left. Nothing is happening in the room. Only in your head.

Fear is the world. Anxiety is you.

Different problems. Different tools. Learn to tell them apart.

--- YouTube Short ---
Title: Your "anxiety" may not be anxiety. How to tell.
Description: A clinical psychologist on the single most useful distinction in managing your own mind. Fear is a present threat. Anxiety is a story you are telling. Your body cannot tell them apart, but you have to. The tools are different.

--- Facebook ---
Fear and anxiety feel identical in the body. The pounding chest, the tight throat, the mind racing for an exit. Most of the people who walk into my office cannot tell them apart. They are not the same thing.

Fear is a bear on the trail. A gun to your face. A car crossing the center line. Something is actually happening right now, and your body is doing its job. Fear keeps you alive.

Anxiety is a story. The exam you have not taken. The spouse who has not left. The diagnosis you have not received. Your body fires on a future that may never come. It also fires on a past that is already over. Nothing is happening in the room. Only in your head.

Fear is brought on by the world. Anxiety is brought on by us.

This matters because the tools are different. Fear, you meet head on. You breathe, you act, you move through it. Anxiety, you interrupt before it runs away with you. Count numbers, one through four. Name five things you can see in the room. Take control of what is on the screen of your mind.

First, tell them apart. Then reach for the right tool.`,
    notes: `★ 5. fear keeps you alive. anxiety keeps you stuck.

GOLDMAN-STYLE (prioritize these)

1. anxiety is not fear
2. your anxiety is not real danger
3. after 65 years treating anxiety, here is what patients miss
4. if you wake up anxious at 3am
★ 5. fear keeps you alive. anxiety keeps you stuck.
6. at 87 i still get anxious. i know what to do with it.
7. if you cannot tell fear from anxiety
8. anxiety is a story you are telling yourself
9. if you call yourself an anxious person
10. the test every patient fails on day one
11. your body does not know the difference. you have to.
12. one shows up. the other you invite.

OTHER STYLES

13. [polarizing]        anxiety is not a chemical imbalance
14. [counter-intuitive] fear is doing its job. anxiety is doing yours.
15. [direct challenge]  stop confusing fear and anxiety
16. [curiosity gap]     the one question that sorts fear from anxiety
17. [story starter]     walking in the woods. then the bear.
18. [data punch]        one is the world acting on you. one is you acting on yourself.`,
  },
  {
    id: 'j97bwk8rbrhwe5atz432dsy33n84wh62',
    title: 'Inner Dialogue',
    pickLine: 1,
    existingTags: ['pillar:mind-mastery'],
    body: `Your mind is listening to everything you say. Out loud. In your head. It does not matter which. There is no wall between them.

I advocate talking to yourself out loud. Some find that strange. I find it essential, because you get to hear your own tone. You get to hear how you are actually speaking to yourself, and most people discover they are crueler to themselves than they would ever be to a stranger.

Your inner dialogue shapes your psychological state. Your psychological state shapes your body. We are not a mind floating above flesh. We are one whole person.

Repeat cruel things about yourself long enough and you begin to believe them. They accumulate in the nervous system. They show up as anxiety, as depression, as the quiet thing you cannot quite name at the end of a long week.

Repeat honest, encouraging things about yourself long enough and the opposite happens. You believe those too.

This is not conceit. It is not big-headed. It is the daily work of building a person worth living inside of.

— Richard

--- Instagram ---
Same as master.

Hashtags: #selftalk #innerdialogue #mindmastery #affirmations #mentalhealth #anxietyrelief #depression #drrichardmiller

--- TikTok ---
Your mind is listening to everything you say.

Out loud. In your head. There is no wall between them.

Talk to yourself out loud. You get to hear your own tone. Most people discover they are crueler to themselves than they would ever be to a stranger.

Say cruel things long enough, you believe them. They show up as anxiety. As depression.

Say honest, encouraging things long enough, you believe those too.

Not conceit. Daily work.

--- YouTube Short ---
Title: Your mind is listening. Your body is keeping score.
Description: A clinical psychologist on why inner dialogue is not a self-help trick, it is the whole thing. Talk to yourself out loud so you can hear your own tone. Repeat the honest, encouraging sentences. Your mind will start to believe you, the same way it already believes the cruel ones.

--- Facebook ---
Your mind is listening to everything you say. Out loud and in your head. It does not matter which, because there is no wall between them.

I advocate talking to yourself out loud. Some people find that strange. I find it essential. When you say it out loud, you get to hear your own tone of voice. You get to hear how you are speaking to yourself, and most people discover, to their shock, that they are crueler to themselves than they would ever be to a stranger in line at the pharmacy.

Your inner dialogue shapes your psychological state. Your psychological state shapes your body. We are not a mind floating above flesh. We are one whole person, and what happens in the mind shows up in the chest, in the gut, in the shoulders, in the sleep.

Repeat cruel things about yourself long enough and you begin to believe them. They accumulate in the nervous system. They show up as anxiety, as depression, as the quiet weight you cannot quite name at the end of a long week.

Repeat honest, encouraging, accurate things about yourself long enough and the opposite happens. You begin to believe those, too. The nervous system does not discriminate. It takes in what you feed it.

This is not conceit. It is not big-headed. It is the daily work of building a person worth living inside of, and it is not optional.`,
    notes: `★ 1. your mind is listening to everything you say

GOLDMAN-STYLE (prioritize these)

★ 1. your mind is listening to everything you say
2. if you call yourself lazy ten times a day
3. what i learned about self-talk in 65 years
4. talk to yourself out loud
5. your inner dialogue is writing your life
6. if you beat yourself up in your head
7. at 87 i still talk to myself out loud. on purpose.
8. if you repeat the same cruel sentence about yourself
9. you criticize yourself more than anyone ever will
10. your mind believes you after enough repetitions
11. if you are still rerunning what you should have said
12. the voice in your head is not the truth. it is a habit.

OTHER STYLES

13. [polarizing]        affirmations are not a self-help trick
14. [counter-intuitive] say it out loud. you need to hear your own tone.
15. [direct challenge]  stop narrating your own flaws
16. [identity]          if you are someone who talks down to yourself
17. [curiosity gap]     the one voice you cannot tune out
18. [data punch]        you say tens of thousands of things to yourself a day`,
  },
  {
    id: 'j97enb9xm3a2de2vwwapf39zb184x1m8',
    title: 'Mood Control',
    pickLine: 9,
    existingTags: ['pillar:emotion-regulation','sub:mind-mastery','sub:habits'],
    body: `Who is in control of your mood? There is only one person. You.

If you do not like the mood you are in, change it. Yes, you can. Mood is yours to change.

Here is the practice. Sit down. Close your eyes. Think of the mood you want to be in. Now conjure it inside yourself. Feel it in your chest, your shoulders, your face. When it is there, enjoy it.

Do this four or five times a day. Check in on your mood. When it is anything other than what you want, run the practice again. Conjure the mood you want. Feel it. Enjoy it.

People ask how I stay in good spirits at 87. This is part of it. Not all of it. But more of it than anyone expects.

Your mood is yours. For the rest of your life.

— Richard

--- Instagram ---
Same as master.

Hashtags: #moodcontrol #mindmastery #emotionalregulation #mentalhealth #dailypractice #happiness #drrichardmiller #psychology

--- TikTok ---
Who is in control of your mood?

Only one person. You.

If you do not like the mood you are in, change it. Yes, you can.

Sit down. Close your eyes. Think of the mood you want. Conjure it. Feel it in your chest. Enjoy it.

Four or five times a day. Check in. Run it again.

People ask how I stay in good spirits at 87. This is part of it.

Your mood is yours.

--- YouTube Short ---
Title: The 60-second mood practice I have done for decades
Description: A clinical psychologist on the daily practice behind staying in good spirits at 87. Sit. Close your eyes. Conjure the mood you want. Feel it in your body. Enjoy it. Run the practice four or five times a day. Your mood is yours.

--- Facebook ---
Who is in control of your moods? There is only one person. You are in control of yours. I am in control of mine. The same is true of your attitude.

If you do not like the mood you are in, change it. Yes, you can change it. Your mood is yours to change.

Here is the practice, and it is a practice. Sit down somewhere quiet. Close your eyes. Think of the mood you want to be in. Now conjure it inside yourself. Feel it in your chest. Feel it in your shoulders and your jaw and your face. When the mood is actually there, do not rush past it. Enjoy it. Let it be.

Do this four or five times a day. Check in on your mood throughout the day the way you might check the time. When you notice it is anything other than the mood you want, go back to the practice. Close your eyes, conjure the mood you want, feel it, enjoy it.

People ask how I stay in good spirits at 87. This is part of it. Not all of it, but more of it than most people expect. I have been doing this practice for decades, and the more you do it, the faster you can get back to the mood you want.

Your mood is yours. For the rest of your life.`,
    notes: `★ 9. you do not have moods. you make them.

GOLDMAN-STYLE (prioritize these)

1. your mood is not happening to you
2. if you think your mood chooses itself
3. the practice i have done four times a day for decades
4. you choose your mood
5. a patient asked me how i stay cheerful at 87
6. if you let your mood run your day
7. at 87 i still check in on my mood four times a day
8. moods are weather only if you let them be
★ 9. you do not have moods. you make them.
10. if you cannot change the mood you woke up in
11. nobody puts you in a bad mood but you
12. your mood is yours. for the rest of your life.

OTHER STYLES

13. [polarizing]        your mood is not a chemical accident
14. [counter-intuitive] sit down. close your eyes. conjure the mood.
15. [direct challenge]  stop letting your mood run your day
16. [identity]          if you call yourself a moody person
17. [curiosity gap]     the 60 second practice i use four times a day
18. [data punch]        four check-ins a day. that is the whole practice.`,
  },
];

(async () => {
  for (const clip of clips) {
    await c.mutation('documents:update', {
      id: clip.id,
      body: clip.body,
      notes: clip.notes,
      tags: ensurePlatforms(clip.existingTags),
    });
    console.log('wrote v2:', clip.title, '★ line', clip.pickLine);
  }
})();
