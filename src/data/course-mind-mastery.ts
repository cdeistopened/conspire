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
  "total_modules": 38,
  "total_sec": 3010,
  "total_formatted": "50:10",
  "chapters": [
    {
      "slug": "01-self-talk-foundations",
      "title": "Self Talk Foundations",
      "blurb": "",
      "module_count": 6,
      "total_sec": 431,
      "modules": [
        {
          "order": 1,
          "file": "be-careful-with-words-2.md",
          "title": "mind-listens-to-self-talk",
          "summary": "the mind records everything you say",
          "duration": 108,
          "duration_formatted": "1:48",
          "descript_url": "https://share.descript.com/view/x2deeXgqWzZ",
          "word_count": 285
        },
        {
          "order": 2,
          "file": "boss-of-your-mind.md",
          "title": "you-are-boss-of-your-mind",
          "summary": "you are the boss of your mind",
          "duration": 64,
          "duration_formatted": "1:04",
          "descript_url": "https://share.descript.com/view/2XgzdtOX4t3",
          "word_count": 195
        },
        {
          "order": 3,
          "file": "clips-from-mind-as-a-tool.md",
          "title": "mind-is-a-tool-you-control",
          "summary": "you are the boss of your mind, not the mind's servant",
          "duration": 83,
          "duration_formatted": "1:23",
          "descript_url": "https://share.descript.com/view/aiG730wLS0m",
          "word_count": 258
        },
        {
          "order": 4,
          "file": "positive-self-talk.md",
          "title": "positive-self-talk-compounds",
          "summary": "Daily positive self-talk compounds. Four to six kind sentences a day, repeated for years, retrains the mind. 'A little over time is a lot.'",
          "duration": 40,
          "duration_formatted": "0:40",
          "descript_url": "https://share.descript.com/view/Cp2wzCYdDlF",
          "word_count": 115
        },
        {
          "order": 5,
          "file": "impact-of-negative-thoughts-raw-2.md",
          "title": "control-negative-thought-impact",
          "summary": "One negative thought a day is 365 per year, all recorded in the mind. The fix: 15-30 second breaks to notice the criticism, then say something nice to yourself two or three times a day. A deposit in the self-esteem bank.",
          "duration": 56,
          "duration_formatted": "0:56",
          "descript_url": "https://share.descript.com/view/h0WYBKZXaIq",
          "word_count": 165
        },
        {
          "order": 6,
          "file": "perception.md",
          "title": "perception-recording-all-you-absorb",
          "summary": "five daily affirmations compound into resilience.",
          "duration": 80,
          "duration_formatted": "1:20",
          "descript_url": "https://share.descript.com/view/vcmw1aWTXQX",
          "word_count": 189
        }
      ]
    },
    {
      "slug": "02-mental-discipline-tools",
      "title": "Mental Discipline Tools",
      "blurb": "",
      "module_count": 11,
      "total_sec": 906,
      "modules": [
        {
          "order": 1,
          "file": "reaction-and-response.md",
          "title": "pause-between-impulse-and-response",
          "summary": "Reaction is robotic and automatic, no choosing, no options. Response means taking it in, considering, selecting. You do not choose your reactions but you do choose your responses. Practice the pause.",
          "duration": 71,
          "duration_formatted": "1:11",
          "descript_url": "https://share.descript.com/view/Tpqr2UZBDn8",
          "word_count": 159
        },
        {
          "order": 2,
          "file": "self-criticism-march-25.md",
          "title": "self-criticism-harms-mind-body",
          "summary": "self-criticism harms mind and body; cultivate compassion",
          "duration": 112,
          "duration_formatted": "1:52",
          "descript_url": "https://share.descript.com/view/uXCAh0kapOh",
          "word_count": 271
        },
        {
          "order": 3,
          "file": "choosing-our-mood-and-attitude.md",
          "title": "choose-your-attitude-reset-throughout-day",
          "summary": "Mood and attitude are chosen, not received. It takes work: sit down, decide what mood you want, bring it out. Reset five or ten times a day as needed.",
          "duration": 81,
          "duration_formatted": "1:21",
          "descript_url": "https://share.descript.com/view/A7U70IQOUgA",
          "word_count": 244
        },
        {
          "order": 4,
          "file": "mind-control-part-2.md",
          "title": "mind-control-practice-30-90-seconds-daily",
          "summary": "Nobody taught Richard in 11 years of college how to control his mind. The practice: sit quietly three or four times a day for 30 to 90 seconds and tell your mind what to do. Eventually it listens.",
          "duration": 111,
          "duration_formatted": "1:51",
          "descript_url": "https://share.descript.com/view/zp0EnYM0YOG",
          "word_count": 121
        },
        {
          "order": 5,
          "file": "trial-reel-3.md",
          "title": "overthinking-intrusive-thoughts-train-mind-via-counting",
          "summary": "Overthinking is when the mind sends intrusive thoughts. The mind is a tool, not us. Richard counts 1, 2, 3, 4, 5 to train it that he is the boss. Use any scene you want, but practice five to ten times a day.",
          "duration": 117,
          "duration_formatted": "1:57",
          "descript_url": "https://share.descript.com/view/n8bDD6DVYfp",
          "word_count": 238
        },
        {
          "order": 6,
          "file": "taking-a-break.md",
          "title": "take-breaks-to-reset-mind",
          "summary": "take breaks throughout day to reset mind",
          "duration": 66,
          "duration_formatted": "1:06",
          "descript_url": "https://share.descript.com/view/8NmXPEQNDHw",
          "word_count": 174
        },
        {
          "order": 7,
          "file": "comparison.md",
          "title": "avoid-comparison-focus-on-your-unique-path",
          "summary": "Avoid comparison game, focus on what you uniquely do",
          "duration": 31,
          "duration_formatted": "0:31",
          "descript_url": "https://share.descript.com/view/v6OGUJ6Pc0k",
          "word_count": 84
        },
        {
          "order": 8,
          "file": "why-questions.md",
          "title": "curiosity-not-self-blame-when-things-go-wrong",
          "summary": "why questions are attacks; use different framing",
          "duration": 97,
          "duration_formatted": "1:37",
          "descript_url": "https://share.descript.com/view/8GeLjm8d61b",
          "word_count": 262
        },
        {
          "order": 9,
          "file": "impact-of-stress.md",
          "title": "gratitude-lowers-cortisol-raises-immunity",
          "summary": "Gratitude lowers cortisol and raises immune function. The counter-practice to negative self-talk that compounds stress physiologically.",
          "duration": 38,
          "duration_formatted": "0:38",
          "descript_url": "https://share.descript.com/view/4wkzZpGB59e",
          "word_count": 77
        },
        {
          "order": 10,
          "file": "visualization.md",
          "title": "visualization-creates-your-reality",
          "summary": "Visualization creates pictures in your mind. A warm beach, sun on your body, waves in the distance. Keep several calming scenes on ready disposal. The scene you create becomes your reality.",
          "duration": 75,
          "duration_formatted": "1:15",
          "descript_url": "https://share.descript.com/view/ZX34niRcV0X",
          "word_count": 186
        },
        {
          "order": 11,
          "file": "clips-from-mind-control-tactics.md",
          "title": "practice-controlling-mind-via-habit-and-scheduling",
          "summary": "practice controlling thoughts to regulate emotions and mood",
          "duration": 107,
          "duration_formatted": "1:47",
          "descript_url": "https://share.descript.com/view/YkvNvOYDRuE",
          "word_count": 306
        }
      ]
    },
    {
      "slug": "03-rumination-awareness",
      "title": "Rumination Awareness",
      "blurb": "",
      "module_count": 2,
      "total_sec": 189,
      "modules": [
        {
          "order": 1,
          "file": "clips-from-optimistic.md",
          "title": "stay-present-avoid-past-focused-thinking",
          "summary": "stay present to avoid past-focused thinking that traps you",
          "duration": 66,
          "duration_formatted": "1:06",
          "descript_url": "https://share.descript.com/view/kdSgfwFbMdo",
          "word_count": 174
        },
        {
          "order": 2,
          "file": "monday-1.md",
          "title": "curate-inputs-limit-negative-news",
          "summary": "Bad news floods in; good news doesn't. Keep saying negative things to yourself and you get depressed; say positive things and you feel better. Take news breaks or curate positive inputs. Choose your atmosphere.",
          "duration": 123,
          "duration_formatted": "2:03",
          "descript_url": "https://share.descript.com/view/EqPzhXApBCX",
          "word_count": 328
        }
      ]
    },
    {
      "slug": "04-crisis-response",
      "title": "Crisis Response",
      "blurb": "",
      "module_count": 1,
      "total_sec": 88,
      "modules": [
        {
          "order": 1,
          "file": "using-mind-control-against-pain.md",
          "title": "mind-control-through-directing-pain-or-boxing-it",
          "summary": "Richard's techniques for physical pain: go into the pain with eyes closed and make sounds (paradoxically reduces it), or compartmentalize by boxing it away. Daily practice, no numbing medication.",
          "duration": 88,
          "duration_formatted": "1:28",
          "descript_url": "https://share.descript.com/view/ZGboBwPSwiE",
          "word_count": 273
        }
      ]
    },
    {
      "slug": "05-applications-edge-cases",
      "title": "Applications Edge Cases",
      "blurb": "",
      "module_count": 4,
      "total_sec": 352,
      "modules": [
        {
          "order": 1,
          "file": "persistence-ed-2.md",
          "title": "persistence-overcomes-fear-and-builds-mastery",
          "summary": "Albert Ellis was terrified to ask women out, so he went to Central Park and asked 100 strangers. All rejections. He came back saying he would never fear asking again. Success through persistence.",
          "duration": 84,
          "duration_formatted": "1:24",
          "descript_url": "https://share.descript.com/view/Xao29LsN2G5",
          "word_count": 220
        },
        {
          "order": 2,
          "file": "yes-and-nos.md",
          "title": "say-yes-to-life-reduce-no-frequency",
          "summary": "Notice how often you say no. Many of those no's could be yes. No's push away people, experience, yourself. Pause four or five times a day for thirty seconds and check whether you are saying yes to life.",
          "duration": 73,
          "duration_formatted": "1:13",
          "descript_url": "https://share.descript.com/view/izzFxD3piaI",
          "word_count": 191
        },
        {
          "order": 3,
          "file": "worry-is-a-total-waste-of-time.md",
          "title": "worry-solves-nothing-action-does",
          "summary": "worry creates nothing; action solves problems",
          "duration": 27,
          "duration_formatted": "0:27",
          "descript_url": "https://share.descript.com/view/GtBX9QcvJtB",
          "word_count": 89
        },
        {
          "order": 4,
          "file": "the-importance-of-taking-it-slow.md",
          "title": "slow-pace-builds-health-resist-modern-speed",
          "summary": "slow pace builds health; resist modern speed",
          "duration": 168,
          "duration_formatted": "2:48",
          "descript_url": "https://share.descript.com/view/F65gIwjvbrM",
          "word_count": 395
        }
      ]
    },
    {
      "slug": "06-relational-foundations",
      "title": "Relational Foundations",
      "blurb": "",
      "module_count": 2,
      "total_sec": 232,
      "modules": [
        {
          "order": 1,
          "file": "psychotherapy.md",
          "title": "therapeutic-relationship-and-alliance-matter-most",
          "summary": "The most important factor in psychotherapy is the alliance, how you and the therapist resonate. If the fit feels off, leave and find someone else. Psychedelics are a separate category, a paradigm changer.",
          "duration": 124,
          "duration_formatted": "2:04",
          "descript_url": "https://share.descript.com/view/iwvyEJkjSaG",
          "word_count": 327
        },
        {
          "order": 2,
          "file": "deep-listening.md",
          "title": "deep-listening-heals-isolation",
          "summary": "deep listening heals isolation",
          "duration": 108,
          "duration_formatted": "1:48",
          "descript_url": "https://share.descript.com/view/hGDa6YZvMWk",
          "word_count": 199
        }
      ]
    },
    {
      "slug": "07-modules",
      "title": "Modules",
      "blurb": "",
      "module_count": 1,
      "total_sec": 62,
      "modules": [
        {
          "order": 1,
          "file": "promo-to-post.md",
          "title": "promos-and-meta",
          "summary": "Course promo establishing the thesis: you are the boss of your mind, not its passenger. Introduces the coming toolkit.",
          "duration": 62,
          "duration_formatted": "1:02",
          "descript_url": "https://share.descript.com/view/cMfywFxzPUz",
          "word_count": 164
        }
      ]
    },
    {
      "slug": "08-orphan-singleton",
      "title": "Orphan Singleton",
      "blurb": "",
      "module_count": 11,
      "total_sec": 750,
      "modules": [
        {
          "order": 1,
          "file": "no-one-is-going-to-save-you.md",
          "title": "Nobody is coming to take care of your physical and mental health. No phone call,",
          "summary": "Nobody is coming to take care of your physical and mental health. No phone call, no text. You must build the plan yourself, and the most important piece is taking control of your mind.",
          "duration": 77,
          "duration_formatted": "1:17",
          "descript_url": "https://share.descript.com/view/Y6rOvsN1Svp",
          "word_count": 230
        },
        {
          "order": 2,
          "file": "mind-control.md",
          "title": "mind control. you are the boss. the computer inside here wants to",
          "summary": "mind control. you are the boss. the computer inside here wants to",
          "duration": 34,
          "duration_formatted": "0:34",
          "descript_url": "https://share.descript.com/view/Yd2zIjg0t3t",
          "word_count": 84
        },
        {
          "order": 3,
          "file": "mind-control-78s.md",
          "title": "your mind is a tool; you control your thoughts.",
          "summary": "your mind is a tool; you control your thoughts.",
          "duration": 78,
          "duration_formatted": "1:18",
          "descript_url": "https://share.descript.com/view/KkVoqaFY92F",
          "word_count": 226
        },
        {
          "order": 4,
          "file": "60-second-mind-switch.md",
          "title": "you control your thoughts; the mind records everything you let in",
          "summary": "you control your thoughts; the mind records everything you let in",
          "duration": 52,
          "duration_formatted": "0:52",
          "descript_url": "https://share.descript.com/view/k7JCe5Z8LH0",
          "word_count": 152
        },
        {
          "order": 5,
          "file": "clips-from-benefits-of-psychedelis-in-my-life.md",
          "title": "mind is a tool you control through psychedelic insight",
          "summary": "mind is a tool you control through psychedelic insight",
          "duration": 55,
          "duration_formatted": "0:55",
          "descript_url": "https://share.descript.com/view/wLhrh508b1M",
          "word_count": 145
        },
        {
          "order": 6,
          "file": "no-one-is-going-to-save-you-77s.md",
          "title": "Nobody is coming to take care of your physical and mental health. No phone call,",
          "summary": "Nobody is coming to take care of your physical and mental health. No phone call, no text. You must build the plan yourself, and the most important piece is taking control of your mind.",
          "duration": 77,
          "duration_formatted": "1:17",
          "descript_url": "https://share.descript.com/view/Y6rOvsN1Svp",
          "word_count": 230
        },
        {
          "order": 7,
          "file": "11111.md",
          "title": "self-esteem as a bank account that grows with positive self-talk",
          "summary": "self-esteem as a bank account that grows with positive self-talk",
          "duration": 82,
          "duration_formatted": "1:22",
          "descript_url": "https://share.descript.com/view/Ue3CWx3PFRH",
          "word_count": 217
        },
        {
          "order": 8,
          "file": "going-to-college-ed-2.md",
          "title": "Rumination feeds emotions; awareness breaks the cycle",
          "summary": "Rumination feeds emotions; awareness breaks the cycle",
          "duration": 98,
          "duration_formatted": "1:38",
          "descript_url": "https://share.descript.com/view/7fqqgQKAD7p",
          "word_count": 258
        },
        {
          "order": 9,
          "file": "guilt-2.md",
          "title": "Rumination feeds emotions; awareness breaks the cycle",
          "summary": "Rumination feeds emotions; awareness breaks the cycle",
          "duration": 61,
          "duration_formatted": "1:01",
          "descript_url": "https://share.descript.com/view/jBH85rxr8MA",
          "word_count": 161
        },
        {
          "order": 10,
          "file": "new1.md",
          "title": "Overcome self-criticism and negative self-talk patterns",
          "summary": "Overcome self-criticism and negative self-talk patterns",
          "duration": 89,
          "duration_formatted": "1:29",
          "descript_url": "https://share.descript.com/view/wV1jp3h1fwF",
          "word_count": 233
        },
        {
          "order": 11,
          "file": "self-talk.md",
          "title": "daily positive self-talk accumulates over decades",
          "summary": "daily positive self-talk accumulates over decades",
          "duration": 47,
          "duration_formatted": "0:47",
          "descript_url": "https://share.descript.com/view/gKSGbnXQhlS",
          "word_count": 114
        }
      ]
    }
  ]
};
