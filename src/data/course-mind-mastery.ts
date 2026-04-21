export interface CourseModule {
  order: number;
  file: string;
  title: string;
  summary: string;
  duration: number;
  duration_formatted: string;
  descript_url: string;
  word_count: number;
}

export interface CourseChapter {
  slug: string;
  title: string;
  blurb: string;
  module_count: number;
  total_sec: number;
  modules: CourseModule[];
}

export interface Course {
  pillar: string;
  title: string;
  tagline: string;
  instructor: string;
  total_modules: number;
  total_sec: number;
  total_formatted: string;
  chapters: CourseChapter[];
}

export const courseMindMastery: Course = {
  "pillar": "mind-mastery",
  "title": "Mind Mastery",
  "tagline": "You are the boss of your mind. A course on how to take the wheel.",
  "instructor": "Dr. Richard Louis Miller",
  "chapters": [
    {
      "slug": "01-boss",
      "title": "You Are the Boss",
      "blurb": "The thesis. The mind is a tool, not the boss. Every other chapter rests on this.",
      "module_count": 7,
      "total_sec": 484,
      "modules": [
        {
          "order": 1,
          "file": "boss-of-your-mind.md",
          "title": "Boss of your Mind",
          "summary": "you are the boss of your mind",
          "duration": 64,
          "duration_formatted": "1:04",
          "descript_url": "https://share.descript.com/view/2XgzdtOX4t3",
          "word_count": 195
        },
        {
          "order": 2,
          "file": "we-control-our-mind.md",
          "title": "We control our mind",
          "summary": "become boss of your mind; manage intrusive thoughts",
          "duration": 54,
          "duration_formatted": "0:54",
          "descript_url": "https://share.descript.com/view/UB8CvaApR5p",
          "word_count": 161
        },
        {
          "order": 3,
          "file": "boss-of-your-mind-second.md",
          "title": "Boss of your mind second",
          "summary": "you control your mind, not vice versa",
          "duration": 67,
          "duration_formatted": "1:07",
          "descript_url": "https://share.descript.com/view/bqOMhMcbtJ1",
          "word_count": 177
        },
        {
          "order": 4,
          "file": "clips-from-being-the-boss.md",
          "title": "Clips from Being the BOSS",
          "summary": "you are boss of thoughts, feelings, visions",
          "duration": 79,
          "duration_formatted": "1:19",
          "descript_url": "https://share.descript.com/view/pA2YMXDWsrF",
          "word_count": 191
        },
        {
          "order": 5,
          "file": "mind-not-the-boss-ed-2.md",
          "title": "mind not the boss ed 2",
          "summary": "the mind wants to be the boss. it wants to tell us",
          "duration": 60,
          "duration_formatted": "1:00",
          "descript_url": "https://share.descript.com/view/05Ub3FYAoRK",
          "word_count": 201
        },
        {
          "order": 6,
          "file": "clips-from-mind-as-a-tool.md",
          "title": "Clips from Mind as a tool",
          "summary": "you are the boss of your mind, not the mind's servant",
          "duration": 83,
          "duration_formatted": "1:23",
          "descript_url": "https://share.descript.com/view/aiG730wLS0m",
          "word_count": 258
        },
        {
          "order": 7,
          "file": "no-one-is-going-to-save-you.md",
          "title": "No one is going to save you",
          "summary": "Nobody is coming to take care of your physical and mental health. No phone call, no text. You must build the plan yourself, and the most important piece is taking control of your mind.",
          "duration": 77,
          "duration_formatted": "1:17",
          "descript_url": "https://share.descript.com/view/Y6rOvsN1Svp",
          "word_count": 230
        }
      ]
    },
    {
      "slug": "02-tools",
      "title": "The Tools (Count, Pause, Picture)",
      "blurb": "The concrete techniques. Count to four. Visualize a warm beach. Practice 30-90 seconds, three times a day.",
      "module_count": 12,
      "total_sec": 1349,
      "modules": [
        {
          "order": 1,
          "file": "60-second-mind-switch-2.md",
          "title": "60 second mind switch",
          "summary": "you control your thoughts; the mind records everything you let in",
          "duration": 52,
          "duration_formatted": "0:52",
          "descript_url": "https://share.descript.com/view/k7JCe5Z8LH0",
          "word_count": 152
        },
        {
          "order": 2,
          "file": "repitition.md",
          "title": "Repitition",
          "summary": "Mind control is built through short, daily practice. Two or three minutes, three times a day, telling your mind what to picture and what to think.",
          "duration": 61,
          "duration_formatted": "1:01",
          "descript_url": "https://share.descript.com/view/kXaMcoY8fAK",
          "word_count": 160
        },
        {
          "order": 3,
          "file": "taking-charge-of-your-thoughts-understanding-mental-intrusions.md",
          "title": "Taking Charge of Your Thoughts: Understanding Mental Intrusions",
          "summary": "become boss of your mind; manage intrusive thoughts",
          "duration": 74,
          "duration_formatted": "1:14",
          "descript_url": "https://share.descript.com/view/msrqe4r2rNN",
          "word_count": 198
        },
        {
          "order": 4,
          "file": "visualization.md",
          "title": "Visualization",
          "summary": "Visualization creates pictures in your mind. A warm beach, sun on your body, waves in the distance. Keep several calming scenes on ready disposal. The scene you create becomes your reality.",
          "duration": 75,
          "duration_formatted": "1:15",
          "descript_url": "https://share.descript.com/view/ZX34niRcV0X",
          "word_count": 186
        },
        {
          "order": 5,
          "file": "mind-control-for-anxiety.md",
          "title": "Mind Control for Anxiety",
          "summary": "your mind is a tool; you control your thoughts.",
          "duration": 78,
          "duration_formatted": "1:18",
          "descript_url": "https://share.descript.com/view/x22sMjp57zp",
          "word_count": 169
        },
        {
          "order": 6,
          "file": "the-importance-of-mind-control.md",
          "title": "The importance of mind control",
          "summary": "mind control and breathing are essential skills",
          "duration": 85,
          "duration_formatted": "1:25",
          "descript_url": "https://share.descript.com/view/LyyZYWpAcme",
          "word_count": 249
        },
        {
          "order": 7,
          "file": "using-mind-control-against-pain.md",
          "title": "Using Mind Control Against Pain",
          "summary": "Richard's techniques for physical pain: go into the pain with eyes closed and make sounds (paradoxically reduces it), or compartmentalize by boxing it away. Daily practice, no numbing medication.",
          "duration": 88,
          "duration_formatted": "1:28",
          "descript_url": "https://share.descript.com/view/ZGboBwPSwiE",
          "word_count": 273
        },
        {
          "order": 8,
          "file": "riverside-dr-richard-louis-mille-may-9-2024-001-mbhp-studio.md",
          "title": "riverside_dr_richard louis mille... _ may 9, 2024 001_mbhp_studio",
          "summary": "Thinking unchecked is a problem. Schedule your thinking like an appointment. The mind is a computer, a tool, not the boss. Practice telling it what pictures to make.",
          "duration": 85,
          "duration_formatted": "1:25",
          "descript_url": "https://share.descript.com/view/x3zGfvzB8ue",
          "word_count": 223
        },
        {
          "order": 9,
          "file": "clips-from-mind-control-tactics.md",
          "title": "Clips from Mind Control Tactics",
          "summary": "practice controlling thoughts to regulate emotions and mood",
          "duration": 107,
          "duration_formatted": "1:47",
          "descript_url": "https://share.descript.com/view/YkvNvOYDRuE",
          "word_count": 306
        },
        {
          "order": 10,
          "file": "trial-reel-3.md",
          "title": "Trial Reel 3",
          "summary": "Overthinking is when the mind sends intrusive thoughts. The mind is a tool, not us. Richard counts 1, 2, 3, 4, 5 to train it that he is the boss. Use any scene you want, but practice five to ten times a day.",
          "duration": 117,
          "duration_formatted": "1:57",
          "descript_url": "https://share.descript.com/view/n8bDD6DVYfp",
          "word_count": 238
        },
        {
          "order": 11,
          "file": "mind-control-part-2.md",
          "title": "Clips from Mind Control part 2",
          "summary": "Nobody taught Richard in 11 years of college how to control his mind. The practice: sit quietly three or four times a day for 30 to 90 seconds and tell your mind what to do. Eventually it listens.",
          "duration": 111,
          "duration_formatted": "1:51",
          "descript_url": "https://share.descript.com/view/zp0EnYM0YOG",
          "word_count": 121
        },
        {
          "order": 12,
          "file": "mind-control-a-powerful-alternative-to-meditation.md",
          "title": "Mind Control: A Powerful Alternative to \\\"Meditation\\\"",
          "summary": "your mind is a tool; you control your thoughts.",
          "duration": 416,
          "duration_formatted": "6:56",
          "descript_url": "https://share.descript.com/view/JQrp6nNlMHZ",
          "word_count": 243
        }
      ]
    },
    {
      "slug": "03-voice",
      "title": "The Voice in Your Head",
      "blurb": "Your mind is listening to everything you say. Out loud or silent. What you repeat becomes what you believe.",
      "module_count": 13,
      "total_sec": 1031,
      "modules": [
        {
          "order": 1,
          "file": "positive-self-talk.md",
          "title": "Positive Self-Talk",
          "summary": "Daily positive self-talk compounds. Four to six kind sentences a day, repeated for years, retrains the mind. 'A little over time is a lot.'",
          "duration": 40,
          "duration_formatted": "0:40",
          "descript_url": "https://share.descript.com/view/Cp2wzCYdDlF",
          "word_count": 115
        },
        {
          "order": 2,
          "file": "self-talk.md",
          "title": "Self-Talk",
          "summary": "daily positive self-talk accumulates over decades",
          "duration": 47,
          "duration_formatted": "0:47",
          "descript_url": "https://share.descript.com/view/gKSGbnXQhlS",
          "word_count": 114
        },
        {
          "order": 3,
          "file": "anxiety-2-2.md",
          "title": "Anxiety 2",
          "summary": "the mind is a tool we control; we direct our thoughts not vice versa",
          "duration": 71,
          "duration_formatted": "1:11",
          "descript_url": "https://share.descript.com/view/4WiJK2JhbSo",
          "word_count": 180
        },
        {
          "order": 4,
          "file": "be-careful-with-words-draft.md",
          "title": "Be careful with words draft",
          "summary": "positive self-talk shapes how mind records",
          "duration": 67,
          "duration_formatted": "1:07",
          "descript_url": "https://share.descript.com/view/652gSZbXN0B",
          "word_count": 202
        },
        {
          "order": 5,
          "file": "be-careful-with-words-2.md",
          "title": "Be careful with words",
          "summary": "the mind records everything you say",
          "duration": 108,
          "duration_formatted": "1:48",
          "descript_url": "https://share.descript.com/view/x2deeXgqWzZ",
          "word_count": 285
        },
        {
          "order": 6,
          "file": "inner-dialogue.md",
          "title": "Inner Dialogue",
          "summary": "the mind records everything you say to yourself",
          "duration": 87,
          "duration_formatted": "1:27",
          "descript_url": "https://share.descript.com/view/ZZ6bRpOWt5D",
          "word_count": 217
        },
        {
          "order": 7,
          "file": "the-impact-of-internal-dialogue-on-mental-health.md",
          "title": "The Impact of Internal Dialogue on Mental Health",
          "summary": "the mind listens to everything that goes on around it",
          "duration": 68,
          "duration_formatted": "1:08",
          "descript_url": "https://share.descript.com/view/4reTLlaqWAb",
          "word_count": 207
        },
        {
          "order": 8,
          "file": "power-of-positive-affirmation.md",
          "title": "Power of positive affirmation",
          "summary": "positive self-talk builds resilience daily.",
          "duration": 89,
          "duration_formatted": "1:29",
          "descript_url": "https://share.descript.com/view/jlABl2EOFOk",
          "word_count": 235
        },
        {
          "order": 9,
          "file": "positive-affirmations.md",
          "title": "Clips from Vid 1",
          "summary": "positive self-talk builds resilience daily.",
          "duration": 99,
          "duration_formatted": "1:39",
          "descript_url": "https://share.descript.com/view/Pyp9jT1o3PQ",
          "word_count": 236
        },
        {
          "order": 10,
          "file": "perception.md",
          "title": "Perception",
          "summary": "five daily affirmations compound into resilience.",
          "duration": 80,
          "duration_formatted": "1:20",
          "descript_url": "https://share.descript.com/view/vcmw1aWTXQX",
          "word_count": 189
        },
        {
          "order": 11,
          "file": "negative-self-talk.md",
          "title": "Negative Self-Talk",
          "summary": "positive self-talk builds resilience daily.",
          "duration": 89,
          "duration_formatted": "1:29",
          "descript_url": "https://share.descript.com/view/2WLSpSLjB7K",
          "word_count": 222
        },
        {
          "order": 12,
          "file": "why-questions.md",
          "title": "WHY QUESTIONS",
          "summary": "why questions are attacks; use different framing",
          "duration": 97,
          "duration_formatted": "1:37",
          "descript_url": "https://share.descript.com/view/8GeLjm8d61b",
          "word_count": 262
        },
        {
          "order": 13,
          "file": "puzzles.md",
          "title": "Puzzles",
          "summary": "Victim language ('why does this always happen to me') is a habit of speech. Witness your self-talk to catch and replace the pattern.",
          "duration": 89,
          "duration_formatted": "1:29",
          "descript_url": "https://share.descript.com/view/UEAMMF9gVHN",
          "word_count": 248
        }
      ]
    },
    {
      "slug": "04-ledger",
      "title": "The Compounding Ledger",
      "blurb": "Five criticisms a day is 1,800 a year. Same math in reverse for the positives. \"A little over time is a lot.\"",
      "module_count": 7,
      "total_sec": 527,
      "modules": [
        {
          "order": 1,
          "file": "thinking-negatively-2.md",
          "title": "Thinking negatively 2",
          "summary": "self-criticism harms mind and body; cultivate compassion",
          "duration": 34,
          "duration_formatted": "0:34",
          "descript_url": "https://share.descript.com/view/fG7AduMyJ6M",
          "word_count": 90
        },
        {
          "order": 2,
          "file": "impact-of-stress.md",
          "title": "Impact of Stress",
          "summary": "Gratitude lowers cortisol and raises immune function. The counter-practice to negative self-talk that compounds stress physiologically.",
          "duration": 38,
          "duration_formatted": "0:38",
          "descript_url": "https://share.descript.com/view/4wkzZpGB59e",
          "word_count": 77
        },
        {
          "order": 3,
          "file": "impact-of-negative-thoughts-raw-2.md",
          "title": "Impact of Negative Thoughts raw 2",
          "summary": "One negative thought a day is 365 per year, all recorded in the mind. The fix: 15-30 second breaks to notice the criticism, then say something nice to yourself two or three times a day. A deposit in the self-esteem bank.",
          "duration": 56,
          "duration_formatted": "0:56",
          "descript_url": "https://share.descript.com/view/h0WYBKZXaIq",
          "word_count": 165
        },
        {
          "order": 4,
          "file": "self-criticism.md",
          "title": "Self Criticism",
          "summary": "Five small self-criticisms a day compound to 1,800 a year. The mind records all of it. Replace them with kind comments so the mind absorbs those instead.",
          "duration": 67,
          "duration_formatted": "1:07",
          "descript_url": "https://share.descript.com/view/pzZgpEJbQTM",
          "word_count": 176
        },
        {
          "order": 5,
          "file": "self-criticism-march-25.md",
          "title": "Self Criticism March 25",
          "summary": "self-criticism harms mind and body; cultivate compassion",
          "duration": 112,
          "duration_formatted": "1:52",
          "descript_url": "https://share.descript.com/view/uXCAh0kapOh",
          "word_count": 271
        },
        {
          "order": 6,
          "file": "clips-from-new1.md",
          "title": "Clips from new1",
          "summary": "self-criticism tools help with anxiety depression worthlessness",
          "duration": 115,
          "duration_formatted": "1:55",
          "descript_url": "https://share.descript.com/view/XfAKGGJ1nK8",
          "word_count": 287
        },
        {
          "order": 7,
          "file": "clips-from-11111.md",
          "title": "Clips from 11111",
          "summary": "self-esteem rises with positive self-input",
          "duration": 105,
          "duration_formatted": "1:45",
          "descript_url": "https://share.descript.com/view/epyzjyElmGQ",
          "word_count": 240
        }
      ]
    },
    {
      "slug": "05-respond",
      "title": "Respond, Don't React",
      "blurb": "Reaction is reflex. Response is pause plus thought. You cannot choose your reactions, but you can choose your responses.",
      "module_count": 4,
      "total_sec": 327,
      "modules": [
        {
          "order": 1,
          "file": "react-and-respond.md",
          "title": "React and Respond",
          "summary": "Reacting is reflex; responding is pause plus thought. Conversation is a childhood habit that can be retrained by inserting a beat before speaking.",
          "duration": 57,
          "duration_formatted": "0:57",
          "descript_url": "https://share.descript.com/view/Gz8BDyywRbC",
          "word_count": 176
        },
        {
          "order": 2,
          "file": "reacting-and-responding.md",
          "title": "Reacting and Responding",
          "summary": "Reacting is reflex; responding is pause plus thought. Duplicate of react-and-respond; near-identical teaching on inserting a beat before speaking.",
          "duration": 61,
          "duration_formatted": "1:01",
          "descript_url": "https://share.descript.com/view/AkDbE3DHK4b",
          "word_count": 178
        },
        {
          "order": 3,
          "file": "reaction-and-response.md",
          "title": "Reaction and Response",
          "summary": "Reaction is robotic and automatic, no choosing, no options. Response means taking it in, considering, selecting. You do not choose your reactions but you do choose your responses. Practice the pause.",
          "duration": 71,
          "duration_formatted": "1:11",
          "descript_url": "https://share.descript.com/view/Tpqr2UZBDn8",
          "word_count": 159
        },
        {
          "order": 4,
          "file": "two-aspects-of-communication.md",
          "title": "two aspects of communication",
          "summary": "today i want to talk about communications",
          "duration": 138,
          "duration_formatted": "2:18",
          "descript_url": "https://share.descript.com/view/tK5Fwfy7UAS",
          "word_count": 369
        }
      ]
    },
    {
      "slug": "06-attitude",
      "title": "Your Attitude, Your Mood",
      "blurb": "Attitude is not circumstance. Set it before you get out of bed. Reset as many times a day as you need.",
      "module_count": 9,
      "total_sec": 632,
      "modules": [
        {
          "order": 1,
          "file": "setting-and-resetting-your-attitude.md",
          "title": "Setting and Resetting your Attitude",
          "summary": "take breaks throughout day to reset mind",
          "duration": 40,
          "duration_formatted": "0:40",
          "descript_url": "https://share.descript.com/view/RcoGMCD0Pee",
          "word_count": 114
        },
        {
          "order": 2,
          "file": "attitude-control.md",
          "title": "Attitude control",
          "summary": "you create your own mood through self-talk",
          "duration": 60,
          "duration_formatted": "1:00",
          "descript_url": "https://share.descript.com/view/bpBXiAAFZVr",
          "word_count": 181
        },
        {
          "order": 3,
          "file": "taking-a-break.md",
          "title": "Taking a break",
          "summary": "take breaks throughout day to reset mind",
          "duration": 66,
          "duration_formatted": "1:06",
          "descript_url": "https://share.descript.com/view/8NmXPEQNDHw",
          "word_count": 174
        },
        {
          "order": 4,
          "file": "attitude-3.md",
          "title": "Attitude 3",
          "summary": "Attitude is yours to choose, first thing each morning and as many times a day as you need to reset. It does not come from outer space. You decide and you embrace it.",
          "duration": 69,
          "duration_formatted": "1:09",
          "descript_url": "https://share.descript.com/view/65M36FMgPVr",
          "word_count": 225
        },
        {
          "order": 5,
          "file": "choosing-our-attitude.md",
          "title": "Choosing our attitude",
          "summary": "attitude is developed, not innate or imposed",
          "duration": 78,
          "duration_formatted": "1:18",
          "descript_url": "https://share.descript.com/view/ZIziOKDvrDi",
          "word_count": 204
        },
        {
          "order": 6,
          "file": "attitude-feelings-and-thoughts.md",
          "title": "Attitude feelings and thoughts",
          "summary": "you choose your attitude, thoughts, and emotions",
          "duration": 78,
          "duration_formatted": "1:18",
          "descript_url": "https://share.descript.com/view/bvsBYpL51oy",
          "word_count": 204
        },
        {
          "order": 7,
          "file": "setting-your-attitude.md",
          "title": "Setting your attitude",
          "summary": "Your attitude is yours to take. Set it before you get out of bed, check in every few hours, reset as needed. Practice and persistence, not circumstance, determine what you emanate.",
          "duration": 78,
          "duration_formatted": "1:18",
          "descript_url": "https://share.descript.com/view/SYmP5Y55R74",
          "word_count": 211
        },
        {
          "order": 8,
          "file": "choosing-our-mood-and-attitude.md",
          "title": "Choosing our Mood and Attitude",
          "summary": "Mood and attitude are chosen, not received. It takes work: sit down, decide what mood you want, bring it out. Reset five or ten times a day as needed.",
          "duration": 81,
          "duration_formatted": "1:21",
          "descript_url": "https://share.descript.com/view/A7U70IQOUgA",
          "word_count": 244
        },
        {
          "order": 9,
          "file": "attitudes-2.md",
          "title": "Attitudes",
          "summary": "intentionally choose your attitude each morning",
          "duration": 82,
          "duration_formatted": "1:22",
          "descript_url": "https://share.descript.com/view/TowEOWu7k8b",
          "word_count": 217
        }
      ]
    },
    {
      "slug": "07-past",
      "title": "Release the Past, Release Worry",
      "blurb": "Worry creates nothing. The past is not yours to fix. Stay present. This is the mind-mastery entry point to presence.",
      "module_count": 6,
      "total_sec": 317,
      "modules": [
        {
          "order": 1,
          "file": "worry-is-a-total-waste-of-time.md",
          "title": "Worry is a total waste of time",
          "summary": "worry creates nothing; action solves problems",
          "duration": 27,
          "duration_formatted": "0:27",
          "descript_url": "https://share.descript.com/view/GtBX9QcvJtB",
          "word_count": 89
        },
        {
          "order": 2,
          "file": "comparison.md",
          "title": "Comparison!",
          "summary": "Avoid comparison game, focus on what you uniquely do",
          "duration": 31,
          "duration_formatted": "0:31",
          "descript_url": "https://share.descript.com/view/v6OGUJ6Pc0k",
          "word_count": 84
        },
        {
          "order": 3,
          "file": "fear-of-the-future.md",
          "title": "Fear of the future",
          "summary": "Rumination feeds emotions; awareness breaks the cycle",
          "duration": 37,
          "duration_formatted": "0:37",
          "descript_url": "https://share.descript.com/view/SjhXj12dk9K",
          "word_count": 132
        },
        {
          "order": 4,
          "file": "clips-from-optimistic.md",
          "title": "Clips from Optimistic",
          "summary": "stay present to avoid past-focused thinking that traps you",
          "duration": 66,
          "duration_formatted": "1:06",
          "descript_url": "https://share.descript.com/view/kdSgfwFbMdo",
          "word_count": 174
        },
        {
          "order": 5,
          "file": "facing-fear-tips-for-emotional-resilience.md",
          "title": "Facing Fear: Tips for Emotional Resilience",
          "summary": "Rumination feeds emotions; awareness breaks the cycle",
          "duration": 75,
          "duration_formatted": "1:15",
          "descript_url": "https://share.descript.com/view/WmWEQQfbixI",
          "word_count": 194
        },
        {
          "order": 6,
          "file": "guilt-1.md",
          "title": "Guilt-1",
          "summary": "Rumination feeds emotions; awareness breaks the cycle",
          "duration": 81,
          "duration_formatted": "1:21",
          "descript_url": "https://share.descript.com/view/bNMQkqtYrf7",
          "word_count": 213
        }
      ]
    },
    {
      "slug": "08-input",
      "title": "Your Input Diet",
      "blurb": "Bad news floods in. Good news does not. Curate your inputs. Say yes to life.",
      "module_count": 4,
      "total_sec": 419,
      "modules": [
        {
          "order": 1,
          "file": "yes-and-nos.md",
          "title": "Yes and No's!",
          "summary": "Notice how often you say no. Many of those no's could be yes. No's push away people, experience, yourself. Pause four or five times a day for thirty seconds and check whether you are saying yes to life.",
          "duration": 73,
          "duration_formatted": "1:13",
          "descript_url": "https://share.descript.com/view/izzFxD3piaI",
          "word_count": 191
        },
        {
          "order": 2,
          "file": "negativity-vs-positivity.md",
          "title": "Negativity vs Positivity",
          "summary": "i keep seeing negative everywhere. how do i do something about it?",
          "duration": 55,
          "duration_formatted": "0:55",
          "descript_url": "https://share.descript.com/view/PJphnxMzpZg",
          "word_count": 146
        },
        {
          "order": 3,
          "file": "monday-1.md",
          "title": "Monday 1",
          "summary": "Bad news floods in; good news doesn't. Keep saying negative things to yourself and you get depressed; say positive things and you feel better. Take news breaks or curate positive inputs. Choose your atmosphere.",
          "duration": 123,
          "duration_formatted": "2:03",
          "descript_url": "https://share.descript.com/view/EqPzhXApBCX",
          "word_count": 328
        },
        {
          "order": 4,
          "file": "the-importance-of-taking-it-slow.md",
          "title": "The importance of taking it slow",
          "summary": "slow pace builds health; resist modern speed",
          "duration": 168,
          "duration_formatted": "2:48",
          "descript_url": "https://share.descript.com/view/F65gIwjvbrM",
          "word_count": 395
        }
      ]
    },
    {
      "slug": "99-qa",
      "title": "Q&A Appendix",
      "blurb": "Long-form answers to audience questions. Go deeper on specific pains.",
      "module_count": 9,
      "total_sec": 2025,
      "modules": [
        {
          "order": 1,
          "file": "how-to-build-up-self-confidence.md",
          "title": "How to build up self confidence",
          "summary": "Rumination feeds emotions; awareness breaks the cycle",
          "duration": 59,
          "duration_formatted": "0:59",
          "descript_url": "https://share.descript.com/view/M0JN5yPXkAM",
          "word_count": 154
        },
        {
          "order": 2,
          "file": "how-do-i-overcome-anxiety-and-inferiority-about-aging.md",
          "title": "How do I overcome anxiety and inferiority about aging?",
          "summary": "Rumination feeds emotions; awareness breaks the cycle",
          "duration": 33,
          "duration_formatted": "0:33",
          "descript_url": "https://share.descript.com/view/9gQeuPwuAbh",
          "word_count": 104
        },
        {
          "order": 3,
          "file": "how-do-you-deal-with-overconfidence-to-begin-with.md",
          "title": "How do you deal with overconfidence to begin with?",
          "summary": "Rumination feeds emotions; awareness breaks the cycle",
          "duration": 52,
          "duration_formatted": "0:52",
          "descript_url": "https://share.descript.com/view/0ayaIzW5m5r",
          "word_count": 138
        },
        {
          "order": 4,
          "file": "how-do-i-deal-with-regret-anxiety-apathy-and-feeling-emotionally-numb.md",
          "title": "How do I deal with regret anxiety, apathy, and feeling emotionally numb?",
          "summary": "Rumination feeds emotions; awareness breaks the cycle",
          "duration": 55,
          "duration_formatted": "0:55",
          "descript_url": "https://share.descript.com/view/2YApkHyXM65",
          "word_count": 173
        },
        {
          "order": 5,
          "file": "how-to-master-your-thoughts-feelings-and-moods.md",
          "title": "How to Master Your Thoughts, Feelings, and Moods",
          "summary": "Rumination feeds emotions; awareness breaks the cycle",
          "duration": 79,
          "duration_formatted": "1:19",
          "descript_url": "https://share.descript.com/view/pg3ZqBL6GqH",
          "word_count": 191
        },
        {
          "order": 6,
          "file": "going-to-college.md",
          "title": "Going to college",
          "summary": "Rumination feeds emotions; awareness breaks the cycle",
          "duration": 122,
          "duration_formatted": "2:02",
          "descript_url": "https://share.descript.com/view/bzGu2n44R3A",
          "word_count": 258
        },
        {
          "order": 7,
          "file": "img-1600.md",
          "title": "IMG_1600",
          "summary": "Rumination feeds emotions; awareness breaks the cycle",
          "duration": 340,
          "duration_formatted": "5:40",
          "descript_url": "https://share.descript.com/view/DV9srBxV3jv",
          "word_count": 896
        },
        {
          "order": 8,
          "file": "emotions-april-6.md",
          "title": "Emotions April 6",
          "summary": "Rumination feeds emotions; awareness breaks the cycle",
          "duration": 506,
          "duration_formatted": "8:26",
          "descript_url": "https://share.descript.com/view/bBGgx2PBbeA",
          "word_count": 1000
        },
        {
          "order": 9,
          "file": "mind-as-a-thought-generator-april-6.md",
          "title": "Mind as a thought Generator April 6",
          "summary": "the mind is a thought generator. hi, i am dr. richard lewis",
          "duration": 779,
          "duration_formatted": "12:59",
          "descript_url": "https://share.descript.com/view/IWFkxQrZpPx",
          "word_count": 1420
        }
      ]
    }
  ],
  "total_modules": 71,
  "total_sec": 7111,
  "total_formatted": "118:31"
};
