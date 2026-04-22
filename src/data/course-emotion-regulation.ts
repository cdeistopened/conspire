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

export const courseEmotionRegulation: Course = {
  "pillar": "emotion-regulation",
  "title": "Emotion Regulation",
  "tagline": "Feel the feeling. Then choose the response.",
  "instructor": "Dr. Richard Louis Miller",
  "total_modules": 48,
  "total_sec": 5631,
  "total_formatted": "93:51",
  "chapters": [
    {
      "slug": "01-Foundation: You control your mood",
      "title": "Foundation: You Control Your Mood",
      "blurb": "",
      "module_count": 1,
      "total_sec": 74,
      "modules": [
        {
          "order": 1,
          "file": "how-to-control-your-mood.md",
          "title": "mood-is-chosen-not-circumstantial",
          "summary": "you control mood more than circumstances control it",
          "duration": 74,
          "duration_formatted": "1:14",
          "descript_url": "https://share.descript.com/view/Kv0QwvELwAT",
          "word_count": 235
        }
      ]
    },
    {
      "slug": "02-Foundation: Mood maintenance practice",
      "title": "Foundation: Mood Maintenance Practice",
      "blurb": "",
      "module_count": 1,
      "total_sec": 90,
      "modules": [
        {
          "order": 1,
          "file": "mood-control-pt-4.md",
          "title": "mood-needs-reset-and-maintenance",
          "summary": "Once you set a mood in the morning it drifts. Rebooting is the answer: sit down, close your eyes, let the chosen mood pervade every cell, then open your eyes and manifest it again.",
          "duration": 90,
          "duration_formatted": "1:30",
          "descript_url": "https://share.descript.com/view/AVeSZzMxpsO",
          "word_count": 238
        }
      ]
    },
    {
      "slug": "03-Foundation: The morning mood set",
      "title": "Foundation: The Morning Mood Set",
      "blurb": "",
      "module_count": 1,
      "total_sec": 57,
      "modules": [
        {
          "order": 1,
          "file": "optimism-57s.md",
          "title": "optimize-mood-via-conscious-morning-selection",
          "summary": "Your mood does not bubble up from within or fall from the sky. You select it. Set it in the morning, check in during the day, make adjustments. A wonderful gift to give yourself.",
          "duration": 57,
          "duration_formatted": "0:57",
          "descript_url": "https://share.descript.com/view/77lOE53lpfo",
          "word_count": 205
        }
      ]
    },
    {
      "slug": "04-Tools: Breathing as primary tool",
      "title": "Tools: Breathing As Primary Tool",
      "blurb": "",
      "module_count": 1,
      "total_sec": 82,
      "modules": [
        {
          "order": 1,
          "file": "the-power-of-abdominal-breathing.md",
          "title": "breathing-is-fastest-emotion-fix",
          "summary": "Abdominal (diaphragmatic) breathing is one of the most effective anxiety cures we have. Belly in and out, thirty seconds, four or five times a day. Sounds simple, takes months to master.",
          "duration": 82,
          "duration_formatted": "1:22",
          "descript_url": "https://share.descript.com/view/V50YdGW1NRn",
          "word_count": 233
        }
      ]
    },
    {
      "slug": "05-Tools: Two-part anxiety solution",
      "title": "Tools: Two Part Anxiety Solution",
      "blurb": "",
      "module_count": 1,
      "total_sec": 52,
      "modules": [
        {
          "order": 1,
          "file": "anxietytwo-part-anxiety-cure.md",
          "title": "anxiety-two-track-cure-breathing-plus-exercise",
          "summary": "conscious breathing and aerobic exercise burn off anxiety",
          "duration": 52,
          "duration_formatted": "0:52",
          "descript_url": "https://share.descript.com/view/oNLsgt5o9U8",
          "word_count": 123
        }
      ]
    },
    {
      "slug": "06-Tools: Fear education",
      "title": "Tools: Fear Education",
      "blurb": "",
      "module_count": 1,
      "total_sec": 180,
      "modules": [
        {
          "order": 1,
          "file": "clips-from-how-do-i-overcome-the-fear-of-doing-something-new.md",
          "title": "anxiety-identification-and-acceptance-before-action",
          "summary": "identify what you fear before overcoming new situation fear",
          "duration": 180,
          "duration_formatted": "3:00",
          "descript_url": "https://share.descript.com/view/VQE3xSOly8J",
          "word_count": 475
        }
      ]
    },
    {
      "slug": "07-Tools: Emotional differentiation",
      "title": "Tools: Emotional Differentiation",
      "blurb": "",
      "module_count": 1,
      "total_sec": 71,
      "modules": [
        {
          "order": 1,
          "file": "difference-between-fear-and-anxiety.md",
          "title": "fear-versus-anxiety-distinction",
          "summary": "Fear is present danger, anxiety is catastrophizing future",
          "duration": 71,
          "duration_formatted": "1:11",
          "descript_url": "https://share.descript.com/view/NJ1K3s2YPve",
          "word_count": 174
        }
      ]
    },
    {
      "slug": "08-Tools: Non-attachment",
      "title": "Tools: Non Attachment",
      "blurb": "",
      "module_count": 1,
      "total_sec": 58,
      "modules": [
        {
          "order": 1,
          "file": "how-do-i-stop-negative-emotional-habits-as-soon-as-possible.md",
          "title": "emotions-pass-when-not-ruminated",
          "summary": "Emotions pass naturally when not fed by rumination",
          "duration": 58,
          "duration_formatted": "0:58",
          "descript_url": "https://share.descript.com/view/EXfVNBmFpM5",
          "word_count": 160
        }
      ]
    },
    {
      "slug": "09-Tools: Advanced anxiety",
      "title": "Tools: Advanced Anxiety",
      "blurb": "",
      "module_count": 1,
      "total_sec": 624,
      "modules": [
        {
          "order": 1,
          "file": "anxiety-long-form.md",
          "title": "anxiety-long-form-tactics-and-thought-management",
          "summary": "practical tactics for dealing with anxiety and thought intrusions",
          "duration": 624,
          "duration_formatted": "10:24",
          "descript_url": "https://share.descript.com/view/YpLE3S3Xfo2",
          "word_count": 1654
        }
      ]
    },
    {
      "slug": "10-Tools: Anger release",
      "title": "Tools: Anger Release",
      "blurb": "",
      "module_count": 1,
      "total_sec": 98,
      "modules": [
        {
          "order": 1,
          "file": "relationships-1.md",
          "title": "anger-stems-from-inner-pain-discharge-via-screaming",
          "summary": "Most anger comes from inner pain. While you do the inner work, take three to five minutes a day and scream into a pillow. Get some of that pressure out so it stops spilling onto your kids or other drivers.",
          "duration": 98,
          "duration_formatted": "1:38",
          "descript_url": "https://share.descript.com/view/c0TGW5tYt9I",
          "word_count": 179
        }
      ]
    },
    {
      "slug": "11-Emotions: Grief",
      "title": "Emotions: Grief",
      "blurb": "",
      "module_count": 1,
      "total_sec": 87,
      "modules": [
        {
          "order": 1,
          "file": "grieving.md",
          "title": "grief-has-no-formula-allow-time-and-space",
          "summary": "grief has no formula; allow time and space for healing",
          "duration": 87,
          "duration_formatted": "1:27",
          "descript_url": "https://share.descript.com/view/M5RfDEDckEK",
          "word_count": 234
        }
      ]
    },
    {
      "slug": "12-Tools: Laughter and humor",
      "title": "Tools: Laughter And Humor",
      "blurb": "",
      "module_count": 1,
      "total_sec": 89,
      "modules": [
        {
          "order": 1,
          "file": "power-of-laughter.md",
          "title": "laughter-as-healing-and-daily-practice",
          "summary": "laughter heals; daily humor aids recovery.",
          "duration": 89,
          "duration_formatted": "1:29",
          "descript_url": "https://share.descript.com/view/SNjwzEhv4XI",
          "word_count": 244
        }
      ]
    },
    {
      "slug": "13-Tools: Movement as medicine",
      "title": "Tools: Movement As Medicine",
      "blurb": "",
      "module_count": 1,
      "total_sec": 681,
      "modules": [
        {
          "order": 1,
          "file": "exercise-and-depression-monologue-show-2.md",
          "title": "exercise-cures-depression-faster-than-medication",
          "summary": "Exercise cures depression faster than medication alone",
          "duration": 681,
          "duration_formatted": "11:21",
          "descript_url": "https://share.descript.com/view/xE4ZLvKFXSx",
          "word_count": 1733
        }
      ]
    },
    {
      "slug": "14-Foundation: Self-talk power",
      "title": "Foundation: Self Talk Power",
      "blurb": "",
      "module_count": 1,
      "total_sec": 93,
      "modules": [
        {
          "order": 1,
          "file": "mind-control-tactics.md",
          "title": "self-talk-controls-emotional-response",
          "summary": "when we criticize ourselves or think negative thoughts, we start to go",
          "duration": 93,
          "duration_formatted": "1:33",
          "descript_url": "https://share.descript.com/view/peteuW4kwYW",
          "word_count": 244
        }
      ]
    },
    {
      "slug": "15-Tools: Breathing for anxiety",
      "title": "Tools: Breathing For Anxiety",
      "blurb": "",
      "module_count": 1,
      "total_sec": 79,
      "modules": [
        {
          "order": 1,
          "file": "insomnia.md",
          "title": "anxiety-managed-via-conscious-breathing-and-practice",
          "summary": "anxiety managed through breathing and conscious practice",
          "duration": 79,
          "duration_formatted": "1:19",
          "descript_url": "https://share.descript.com/view/pquadCKJx0i",
          "word_count": 195
        }
      ]
    },
    {
      "slug": "16-Tools: Integrated breathing-based mastery",
      "title": "Tools: Integrated Breathing Based Mastery",
      "blurb": "",
      "module_count": 1,
      "total_sec": 87,
      "modules": [
        {
          "order": 1,
          "file": "emotional-mastery.md",
          "title": "emotional-mastery-via-breath-and-practice",
          "summary": "breathing is faster than medication",
          "duration": 87,
          "duration_formatted": "1:27",
          "descript_url": "https://share.descript.com/view/hayZMDuxk47",
          "word_count": 207
        }
      ]
    },
    {
      "slug": "17-Emotions: Inner peace and boundaries",
      "title": "Emotions: Inner Peace And Boundaries",
      "blurb": "",
      "module_count": 1,
      "total_sec": 72,
      "modules": [
        {
          "order": 1,
          "file": "copy-of-clips-from-finding-inner-peace.md",
          "title": "protect-inner-peace-from-external-negativity",
          "summary": "Protect inner peace from external negativity and news",
          "duration": 72,
          "duration_formatted": "1:12",
          "descript_url": "https://share.descript.com/view/kmQKsGaGwON",
          "word_count": 194
        }
      ]
    },
    {
      "slug": "18-Emotions: Depression and support",
      "title": "Emotions: Depression And Support",
      "blurb": "",
      "module_count": 1,
      "total_sec": 119,
      "modules": [
        {
          "order": 1,
          "file": "clips-from-past-and-mindfulness.md",
          "title": "depression-exhaustion-requires-support",
          "summary": "depression's exhaustion makes recovery harder without support",
          "duration": 119,
          "duration_formatted": "1:59",
          "descript_url": "https://share.descript.com/view/1b46i0T4EJP",
          "word_count": 297
        }
      ]
    },
    {
      "slug": "19-Emotions: Laziness and compassion",
      "title": "Emotions: Laziness And Compassion",
      "blurb": "",
      "module_count": 1,
      "total_sec": 98,
      "modules": [
        {
          "order": 1,
          "file": "laziness-98s.md",
          "title": "inactivity-signals-body-needs-recovery-show-kindness",
          "summary": "inactivity signals the body needs recovery; be kind",
          "duration": 98,
          "duration_formatted": "1:38",
          "descript_url": "https://share.descript.com/view/bI2i67DmrMq",
          "word_count": 245
        }
      ]
    },
    {
      "slug": "20-Emotions: Addiction and vigilance",
      "title": "Emotions: Addiction And Vigilance",
      "blurb": "",
      "module_count": 1,
      "total_sec": 100,
      "modules": [
        {
          "order": 1,
          "file": "the-creep.md",
          "title": "addiction-creeps-awareness-and-intervention-help",
          "summary": "addiction creeps; awareness and intervention help",
          "duration": 100,
          "duration_formatted": "1:40",
          "descript_url": "https://share.descript.com/view/r8arhJ0Hpgn",
          "word_count": 262
        }
      ]
    },
    {
      "slug": "21-Emotions: Resilience and attitude",
      "title": "Emotions: Resilience And Attitude",
      "blurb": "",
      "module_count": 1,
      "total_sec": 87,
      "modules": [
        {
          "order": 1,
          "file": "mental-health-2.md",
          "title": "attitude-controls-recovery-from-physical-trauma",
          "summary": "attitude controls recovery from physical trauma.",
          "duration": 87,
          "duration_formatted": "1:27",
          "descript_url": "https://share.descript.com/view/B5hjIZLhvaj",
          "word_count": 265
        }
      ]
    },
    {
      "slug": "22-Crisis response: Trauma",
      "title": "Crisis Response: Trauma",
      "blurb": "",
      "module_count": 1,
      "total_sec": 59,
      "modules": [
        {
          "order": 1,
          "file": "dealing-with-trauma.md",
          "title": "trauma-processing-via-breathing-and-presence",
          "summary": "Process trauma through breathing and present-moment anchoring",
          "duration": 59,
          "duration_formatted": "0:59",
          "descript_url": "https://share.descript.com/view/w3SwxAOJXDJ",
          "word_count": 156
        }
      ]
    },
    {
      "slug": "23-Crisis response: Mortality and acceptance",
      "title": "Crisis Response: Mortality And Acceptance",
      "blurb": "",
      "module_count": 1,
      "total_sec": 122,
      "modules": [
        {
          "order": 1,
          "file": "terminal-diagnosis-february-14.md",
          "title": "terminal-diagnosis-attitude-enables-fullness-of-life",
          "summary": "live fully despite terminal diagnosis; attitude matters",
          "duration": 122,
          "duration_formatted": "2:02",
          "descript_url": "https://share.descript.com/view/RyJ5U3OkDpF",
          "word_count": 357
        }
      ]
    },
    {
      "slug": "24-Crisis response: Partner health",
      "title": "Crisis Response: Partner Health",
      "blurb": "",
      "module_count": 1,
      "total_sec": 84,
      "modules": [
        {
          "order": 1,
          "file": "copy-of-embracing-positivity.md",
          "title": "maintain-positive-attitude-through-spouse-health-crisis",
          "summary": "Maintain positive attitude through wife's cancer lumpectomy",
          "duration": 84,
          "duration_formatted": "1:24",
          "descript_url": "https://share.descript.com/view/jmEbV0VIPFY",
          "word_count": 218
        }
      ]
    },
    {
      "slug": "25-Crisis response: Political and external disruption",
      "title": "Crisis Response: Political And External Disruption",
      "blurb": "",
      "module_count": 1,
      "total_sec": 75,
      "modules": [
        {
          "order": 1,
          "file": "navigating-turbulent-times-a-guide-to-staying-centered.md",
          "title": "navigating-worldly-turbulence-through-centeredness",
          "summary": "richard: what to do when the world seems like it's falling apart",
          "duration": 75,
          "duration_formatted": "1:15",
          "descript_url": "https://share.descript.com/view/MM1Mh9JYG0f",
          "word_count": 182
        }
      ]
    },
    {
      "slug": "26-Crisis response: Collective trauma",
      "title": "Crisis Response: Collective Trauma",
      "blurb": "",
      "module_count": 1,
      "total_sec": 89,
      "modules": [
        {
          "order": 1,
          "file": "ukraine-video.md",
          "title": "therapy-in-crisis-ukraine-ptsd-soldiers",
          "summary": "Report from Ukraine where Richard taught therapy for soldiers with PTSD. Cemetery with photos on each grave, prosthetic limbs ward, emergency evacuations from bombing. He returns grateful for our democracy.",
          "duration": 89,
          "duration_formatted": "1:29",
          "descript_url": "https://share.descript.com/view/8hKdVRkR2H2",
          "word_count": 219
        }
      ]
    },
    {
      "slug": "27-Tools: Anxiety root cause",
      "title": "Tools: Anxiety Root Cause",
      "blurb": "",
      "module_count": 1,
      "total_sec": 118,
      "modules": [
        {
          "order": 1,
          "file": "anxiety-video.md",
          "title": "anxiety-internally-generated-not-external-cause",
          "summary": "anxiety is internally generated; breathing and exercise are treatments",
          "duration": 118,
          "duration_formatted": "1:58",
          "descript_url": "https://share.descript.com/view/jlJ2Nb1HnMd",
          "word_count": 211
        }
      ]
    },
    {
      "slug": "28-Foundation: Emotional ownership",
      "title": "Foundation: Emotional Ownership",
      "blurb": "",
      "module_count": 1,
      "total_sec": 113,
      "modules": [
        {
          "order": 1,
          "file": "controlling-feelings-march-25.md",
          "title": "you-create-emotions-not-external-events",
          "summary": "You create your own emotions, not external events",
          "duration": 113,
          "duration_formatted": "1:53",
          "descript_url": "https://share.descript.com/view/tnin3OHXmJZ",
          "word_count": 276
        }
      ]
    },
    {
      "slug": "29-Emotions: Apathy and trauma",
      "title": "Emotions: Apathy And Trauma",
      "blurb": "",
      "module_count": 1,
      "total_sec": 64,
      "modules": [
        {
          "order": 1,
          "file": "clips-from-how-do-i-deal-with-regret-anxiety-apathy-and-feeling-emotionally-numb.md",
          "title": "apathy-stems-from-emotional-hurt-investigate-origins",
          "summary": "apathy stems from emotional hurt; investigate trauma origins",
          "duration": 64,
          "duration_formatted": "1:04",
          "descript_url": "https://share.descript.com/view/flECjFRjPOr",
          "word_count": 168
        }
      ]
    },
    {
      "slug": "30-Tools: Sleep and preventive breathing",
      "title": "Tools: Sleep And Preventive Breathing",
      "blurb": "",
      "module_count": 1,
      "total_sec": 51,
      "modules": [
        {
          "order": 1,
          "file": "how-to-deal-with-morning-anxiety.md",
          "title": "morning-anxiety-pre-empted-via-breathing",
          "summary": "Breathe before bed; pre-empt morning anxiety physically",
          "duration": 51,
          "duration_formatted": "0:51",
          "descript_url": "https://share.descript.com/view/9sLvTyYrYPh",
          "word_count": 166
        }
      ]
    },
    {
      "slug": "31-Crisis response: Psychedelic readiness",
      "title": "Crisis Response: Psychedelic Readiness",
      "blurb": "",
      "module_count": 1,
      "total_sec": 188,
      "modules": [
        {
          "order": 1,
          "file": "psychedelic-preparation.md",
          "title": "psychedelic-preparation-managing-anxiety-and-depression",
          "summary": "Tools to manage anxiety and depression with practice",
          "duration": 188,
          "duration_formatted": "3:08",
          "descript_url": "https://share.descript.com/view/tJxQEjn02Ez",
          "word_count": 494
        }
      ]
    },
    {
      "slug": "32-orphan-singleton",
      "title": "Orphan Singleton",
      "blurb": "",
      "module_count": 17,
      "total_sec": 1690,
      "modules": [
        {
          "order": 1,
          "file": "how-to-change-mood.md",
          "title": "your mood is changeable; apply these proven tools",
          "summary": "your mood is changeable; apply these proven tools",
          "duration": 86,
          "duration_formatted": "1:26",
          "descript_url": "https://share.descript.com/view/Nb9w6Uppoxg",
          "word_count": 257
        },
        {
          "order": 2,
          "file": "taking-responsibility-of-emotions.md",
          "title": "emotions are part of life; feel them fully",
          "summary": "emotions are part of life; feel them fully",
          "duration": 85,
          "duration_formatted": "1:25",
          "descript_url": "https://share.descript.com/view/607x8bVyAAB",
          "word_count": 223
        },
        {
          "order": 3,
          "file": "saying-no.md",
          "title": "people ask me about getting into the habit of saying yes and",
          "summary": "people ask me about getting into the habit of saying yes and",
          "duration": 92,
          "duration_formatted": "1:32",
          "descript_url": "https://share.descript.com/view/eWbxT3FX9MV",
          "word_count": 198
        },
        {
          "order": 4,
          "file": "death-2.md",
          "title": "Free yourself from fear of death to live comfortably",
          "summary": "Free yourself from fear of death to live comfortably",
          "duration": 304,
          "duration_formatted": "5:04",
          "descript_url": "https://share.descript.com/view/n5WAgyCwkHp",
          "word_count": 823
        },
        {
          "order": 5,
          "file": "moods-and-attitude.md",
          "title": "i am dr. richard louis miller. i'm an 86-year-old clinical psychologist. mood",
          "summary": "i am dr. richard louis miller. i'm an 86-year-old clinical psychologist. mood",
          "duration": 39,
          "duration_formatted": "0:39",
          "descript_url": "https://share.descript.com/view/A69tBkqyUGq",
          "word_count": 121
        },
        {
          "order": 6,
          "file": "the-truth-about-moods-and-attitude.md",
          "title": "mood and attitude are yours to determine",
          "summary": "mood and attitude are yours to determine",
          "duration": 44,
          "duration_formatted": "0:44",
          "descript_url": "https://share.descript.com/view/voq0HwWxDRm",
          "word_count": 123
        },
        {
          "order": 7,
          "file": "doctor-patient-communication.md",
          "title": "breathing is faster than medication",
          "summary": "breathing is faster than medication",
          "duration": 70,
          "duration_formatted": "1:10",
          "descript_url": "https://share.descript.com/view/c1v7oGA3n2Q",
          "word_count": 200
        },
        {
          "order": 8,
          "file": "sharing-my-why.md",
          "title": "i want to be an influencer",
          "summary": "i want to be an influencer",
          "duration": 82,
          "duration_formatted": "1:22",
          "descript_url": "https://share.descript.com/view/I15BlyxZ6KE",
          "word_count": 216
        },
        {
          "order": 9,
          "file": "why-youll-never-see-kale-on-tv-ads.md",
          "title": "ebru: after i start to meditate, my physiology changed immediately",
          "summary": "ebru: after i start to meditate, my physiology changed immediately",
          "duration": 84,
          "duration_formatted": "1:24",
          "descript_url": "https://share.descript.com/view/vDZ3ZMfJ3Yg",
          "word_count": 9074
        },
        {
          "order": 10,
          "file": "understanding-bad-psychedelic-trips-with-julesthephilosopher.md",
          "title": "jules: people just reporting feeling more anxious for days, weeks, months, or",
          "summary": "jules: people just reporting feeling more anxious for days, weeks, months, or",
          "duration": 59,
          "duration_formatted": "0:59",
          "descript_url": "https://share.descript.com/view/GR7eiVAepQw",
          "word_count": 4377
        },
        {
          "order": 11,
          "file": "motivation-second-edit.md",
          "title": "don't hang around with people who tell you don't do that. you're",
          "summary": "don't hang around with people who tell you don't do that. you're",
          "duration": 42,
          "duration_formatted": "0:42",
          "descript_url": "https://share.descript.com/view/7pZPpMURWj3",
          "word_count": 141
        },
        {
          "order": 12,
          "file": "self-image.md",
          "title": "your self image is deeply rooted in your mind and your nervous",
          "summary": "your self image is deeply rooted in your mind and your nervous",
          "duration": 87,
          "duration_formatted": "1:27",
          "descript_url": "https://share.descript.com/view/pbjzfAtobRd",
          "word_count": 218
        },
        {
          "order": 13,
          "file": "mood-control.md",
          "title": "you control your mood through conscious choice.",
          "summary": "you control your mood through conscious choice.",
          "duration": 74,
          "duration_formatted": "1:14",
          "descript_url": "https://share.descript.com/view/yAvPZqxyApu",
          "word_count": 203
        },
        {
          "order": 14,
          "file": "obesity-discussion.md",
          "title": "Normalizing obesity trends and personal health responsibility",
          "summary": "Normalizing obesity trends and personal health responsibility",
          "duration": 97,
          "duration_formatted": "1:37",
          "descript_url": "https://share.descript.com/view/vvj2Zf9aflQ",
          "word_count": 254
        },
        {
          "order": 15,
          "file": "r-strayhan.md",
          "title": "robert: anxiety and fear are the first two things to look at,",
          "summary": "robert: anxiety and fear are the first two things to look at,",
          "duration": 159,
          "duration_formatted": "2:39",
          "descript_url": "https://share.descript.com/view/Zp9SlB9JTBb",
          "word_count": 6426
        },
        {
          "order": 16,
          "file": "clip-1-paul-austing.md",
          "title": "breathing is faster than medication",
          "summary": "breathing is faster than medication",
          "duration": 105,
          "duration_formatted": "1:45",
          "descript_url": "https://share.descript.com/view/hEPQ5fPVBYF",
          "word_count": 3521
        },
        {
          "order": 17,
          "file": "richard-miller-on-depression-and-anxiety.md",
          "title": "Normalizing obesity trends and personal health responsibility",
          "summary": "Normalizing obesity trends and personal health responsibility",
          "duration": 181,
          "duration_formatted": "3:01",
          "descript_url": "https://share.descript.com/view/mqkJCw7GFvl",
          "word_count": 485
        }
      ]
    }
  ]
};
