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

export const coursePurposeMeaning: Course = {
  "pillar": "purpose-meaning",
  "title": "Purpose & Meaning",
  "tagline": "Meaning is made, not found. Make yours in service.",
  "instructor": "Dr. Richard Louis Miller",
  "total_modules": 16,
  "total_sec": 2617,
  "total_formatted": "43:37",
  "chapters": [
    {
      "slug": "01-modules",
      "title": "Modules",
      "blurb": "",
      "module_count": 8,
      "total_sec": 1473,
      "modules": [
        {
          "order": 1,
          "file": "purpose.md",
          "title": "Nothing has intrinsic meaning. You create it through action and attention.",
          "summary": "There is no inherent meaning in anything. Meaning is what we put in. Winston Churchill built a rock wall in his backyard. Making the bed, helping a stranger, reading a book, all can carry meaning.",
          "duration": 71,
          "duration_formatted": "1:11",
          "descript_url": "https://share.descript.com/view/uj1peUKXOS7",
          "word_count": 163
        },
        {
          "order": 2,
          "file": "unite-america-march-5.md",
          "title": "Contributing to others lifts your own resilience and purpose.",
          "summary": "find meaning through purpose and service",
          "duration": 160,
          "duration_formatted": "2:40",
          "descript_url": "https://share.descript.com/view/sXmxBfYWwjf",
          "word_count": 306
        },
        {
          "order": 3,
          "file": "exercise-and-depression-monologue-show.md",
          "title": "Even in severe limitation, you can still contribute. Meaning survives loss.",
          "summary": "Richard's own story: motorcycle hit by Winnebago, legs crushed, near-death vision of himself in a wheelchair still doing his work, with the voice saying 'Richard, even without legs you can still make a contribution.'",
          "duration": 71,
          "duration_formatted": "1:11",
          "descript_url": "https://share.descript.com/view/vG0lvB9IXa2",
          "word_count": 211
        },
        {
          "order": 4,
          "file": "strength-workout.md",
          "title": "Work is subsistence; health and vitality are the true foundation.",
          "summary": "work is subsistence; health is true wealth",
          "duration": 146,
          "duration_formatted": "2:26",
          "descript_url": "https://share.descript.com/view/5QKjxngN4Sr",
          "word_count": 385
        },
        {
          "order": 5,
          "file": "failing-is-part-of-succeeding.md",
          "title": "Failing is not the opposite of succeeding; it is part of it.",
          "summary": "The patient who failed the bar exam nine times and passed on the tenth. They call him 'lawyer.' Failing is not the opposite of succeeding, it is part of it. Do not let it stop you.",
          "duration": 63,
          "duration_formatted": "1:03",
          "descript_url": "https://share.descript.com/view/z4PJiQPqOdr",
          "word_count": 166
        },
        {
          "order": 6,
          "file": "learning-optimism.md",
          "title": "Optimism is learned through stories and daily practice, not innate.",
          "summary": "optimism is learned through stories and persistence.",
          "duration": 117,
          "duration_formatted": "1:57",
          "descript_url": "https://share.descript.com/view/bh0o00vQD5S",
          "word_count": 322
        },
        {
          "order": 7,
          "file": "rm-solo-episode.md",
          "title": "Political leadership and community awareness are moral imperatives.",
          "summary": "political engagement matters; leadership needed",
          "duration": 579,
          "duration_formatted": "9:39",
          "descript_url": "https://share.descript.com/view/dJZrAUWydnh",
          "word_count": 1351
        },
        {
          "order": 8,
          "file": "chance-by-dr-richard-millerr.md",
          "title": "Chance and deterministic order both shape life. Both real. You work within.",
          "summary": "chance and order shape life encounters",
          "duration": 266,
          "duration_formatted": "4:26",
          "descript_url": "https://share.descript.com/view/NO741paZuzZ",
          "word_count": 603
        }
      ]
    },
    {
      "slug": "02-orphan-singleton",
      "title": "Orphan Singleton",
      "blurb": "",
      "module_count": 8,
      "total_sec": 1144,
      "modules": [
        {
          "order": 1,
          "file": "presidency-2.md",
          "title": "president must treat all citizens with dignity.",
          "summary": "president must treat all citizens with dignity.",
          "duration": 88,
          "duration_formatted": "1:28",
          "descript_url": "https://share.descript.com/view/h53HOT32x1a",
          "word_count": 181
        },
        {
          "order": 2,
          "file": "riverside-recording-youytybe.md",
          "title": "work is subsistence; health is true wealth",
          "summary": "work is subsistence; health is true wealth",
          "duration": 79,
          "duration_formatted": "1:19",
          "descript_url": "https://share.descript.com/view/lwMH4uZZvG7",
          "word_count": 207
        },
        {
          "order": 3,
          "file": "clips-from-tools-for-a-healthy-life-long-form.md",
          "title": "Find meaning in daily tasks, no matter how small they are",
          "summary": "Find meaning in daily tasks, no matter how small they are",
          "duration": 30,
          "duration_formatted": "0:30",
          "descript_url": "https://share.descript.com/view/zlGXKGya8jh",
          "word_count": 104
        },
        {
          "order": 4,
          "file": "how-do-you-balance-work-and-personal-time-and-do-you-regret-working-too-much.md",
          "title": "Meaning anchors resilience; purpose sustains through crisis",
          "summary": "Meaning anchors resilience; purpose sustains through crisis",
          "duration": 119,
          "duration_formatted": "1:59",
          "descript_url": "https://share.descript.com/view/EDVYaMQYtAc",
          "word_count": 313
        },
        {
          "order": 5,
          "file": "core-values.md",
          "title": "purpose drives fulfillment",
          "summary": "purpose drives fulfillment",
          "duration": 66,
          "duration_formatted": "1:06",
          "descript_url": "https://share.descript.com/view/azV056pa7O2",
          "word_count": 201
        },
        {
          "order": 6,
          "file": "questions.md",
          "title": "speaker: i'm an 86-year-old clinical psychologist, i'm doing a series of questio",
          "summary": "speaker: i'm an 86-year-old clinical psychologist, i'm doing a series of questions",
          "duration": 77,
          "duration_formatted": "1:17",
          "descript_url": "https://share.descript.com/view/3QxFVlpPhJR",
          "word_count": 199
        },
        {
          "order": 7,
          "file": "light-edit.md",
          "title": "dr. richard: when did this happen? all over america, small rural towns",
          "summary": "dr. richard: when did this happen? all over america, small rural towns",
          "duration": 627,
          "duration_formatted": "10:27",
          "descript_url": "https://share.descript.com/view/XLKuBAigfLo",
          "word_count": 1451
        },
        {
          "order": 8,
          "file": "optimism.md",
          "title": "Optimism is learned and worth learning daily",
          "summary": "Optimism is learned and worth learning daily",
          "duration": 58,
          "duration_formatted": "0:58",
          "descript_url": "https://share.descript.com/view/gaqhZMIrtkb",
          "word_count": 169
        }
      ]
    }
  ]
};
