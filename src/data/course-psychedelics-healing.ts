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

export const coursePsychedelicsHealing: Course = {
  "pillar": "psychedelics-healing",
  "title": "Psychedelics & Healing",
  "tagline": "Set and setting determine outcome. Integration is the work.",
  "instructor": "Dr. Richard Louis Miller",
  "total_modules": 11,
  "total_sec": 1057,
  "total_formatted": "17:37",
  "chapters": [
    {
      "slug": "01-4. Integration",
      "title": "4. Integration",
      "blurb": "",
      "module_count": 1,
      "total_sec": 81,
      "modules": [
        {
          "order": 1,
          "file": "booboo-priests.md",
          "title": "Healing happens after the experience. Integration is the practice that locks in neuroplasticity and lasting change.",
          "summary": "integration is the real work",
          "duration": 81,
          "duration_formatted": "1:21",
          "descript_url": "https://share.descript.com/view/MPwcKq4i4xt",
          "word_count": 225
        }
      ]
    },
    {
      "slug": "02-3. Therapeutic applications",
      "title": "3. Therapeutic Applications",
      "blurb": "",
      "module_count": 4,
      "total_sec": 412,
      "modules": [
        {
          "order": 1,
          "file": "michael-mithoefer-and-richard-louis-miller.md",
          "title": "MDMA-assisted therapy shows 88% benefit rate and 68% remission of PTSD diagnosis. Integration and therapist boundaries are critical; over-medicalizing risks losing the therapeutic relationship.",
          "summary": "Richard interviews Michael Mithoefer on MAPS Phase 3 MDMA-assisted therapy for PTSD: 88 percent benefit, 68 percent lost their diagnosis. Covers integration, therapist boundaries, cardiovascular screening, and the risk of over-medicalizing the model.",
          "duration": 154,
          "duration_formatted": "2:34",
          "descript_url": "https://share.descript.com/view/7VyuNaizBh3",
          "word_count": 6210
        },
        {
          "order": 2,
          "file": "psychedelic-science.md",
          "title": "Psychedelic medicine alone differs from psychedelic medicine with therapy. The therapeutic relationship amplifies healing.",
          "summary": "psychedelic medicine plus therapy differs from medicine alone.",
          "duration": 125,
          "duration_formatted": "2:05",
          "descript_url": "https://share.descript.com/view/f2KYb4zfjtQ",
          "word_count": 303
        },
        {
          "order": 3,
          "file": "img-1646.md",
          "title": "Microdosing is studied; integration process shapes long-term benefit. Consistency in practice determines outcomes.",
          "summary": "Microdosing studied; integration process shapes long-term benefit",
          "duration": 79,
          "duration_formatted": "1:19",
          "descript_url": "https://share.descript.com/view/Fm9yto345kO",
          "word_count": 209
        },
        {
          "order": 4,
          "file": "whats-missing-in-psychedelic-therapy-research.md",
          "title": "Research gaps in psychedelic therapy exist; questions about mechanisms, long-term outcomes, and real-world application need answering.",
          "summary": "yeah, um, so, you know, i think it, i think the hypothesis",
          "duration": 54,
          "duration_formatted": "0:54",
          "descript_url": "https://share.descript.com/view/sVzk2gwbdul",
          "word_count": 4940
        }
      ]
    },
    {
      "slug": "03-1. What psychedelics do",
      "title": "1. What Psychedelics Do",
      "blurb": "",
      "module_count": 5,
      "total_sec": 476,
      "modules": [
        {
          "order": 1,
          "file": "jahan-khamsehzadeh.md",
          "title": "Psychedelics create neuroplasticity but carry real risks. Adverse effects (ayahuasca, ketamine destabilization) are possible; transparency about harms strengthens the renaissance.",
          "summary": "psychedelics reshape brain but carry real risks",
          "duration": 170,
          "duration_formatted": "2:50",
          "descript_url": "https://share.descript.com/view/RJ9UXXM3NKN",
          "word_count": 6254
        },
        {
          "order": 2,
          "file": "abe-lincoln.md",
          "title": "Federal legalization and decriminalization are advancing. Movement infighting is rare; policy reform is accelerating.",
          "summary": "Ethan Nadelmann and Richard on the state of drug policy reform: federal-level legalization, psychedelic decriminalization initiatives, and why movement infighting stays rare in their corner.",
          "duration": 81,
          "duration_formatted": "1:21",
          "descript_url": "https://share.descript.com/view/1Yphq4wZ7WV",
          "word_count": 5454
        },
        {
          "order": 3,
          "file": "benefits-of-psychedelis-in-my-life.md",
          "title": "Psychedelics reveal that the mind is a tool, not the boss. This reframe unlocks self-mastery and presence.",
          "summary": "mind is a tool, not the boss",
          "duration": 104,
          "duration_formatted": "1:44",
          "descript_url": "https://share.descript.com/view/rVyj04k4aOr",
          "word_count": 273
        },
        {
          "order": 4,
          "file": "exploring-the-use-of-ketamine-vs-psilocybin.md",
          "title": "Ketamine and psilocybin reshape consciousness legally in different ways. Comparative pharmacology and application.",
          "summary": "ketamine and psilocybin reshape consciousness legally",
          "duration": 77,
          "duration_formatted": "1:17",
          "descript_url": "https://share.descript.com/view/aAN6rQmm6QD",
          "word_count": 5120
        },
        {
          "order": 5,
          "file": "intro.md",
          "title": "Light-sound-vibration devices can produce ketamine-like healing states without substances. Non-drug alternatives for neuroplasticity.",
          "summary": "Richard interviews Andres Gomez Emilsson of QRI about DMT mapping, jhana meditation, and a light-sound-vibration device that produces ketamine-like healing states without substances. Discusses anti-tolerance drug research.",
          "duration": 44,
          "duration_formatted": "0:44",
          "descript_url": "https://share.descript.com/view/XRVR921pAfz",
          "word_count": 4449
        }
      ]
    },
    {
      "slug": "04-2. Set & setting",
      "title": "2. Set & Setting",
      "blurb": "",
      "module_count": 1,
      "total_sec": 88,
      "modules": [
        {
          "order": 1,
          "file": "clips-from-psychedelics.md",
          "title": "Preparation, mindset, and environment shape the psychedelic experience and outcome. Diaphragmatic breathing is a key preparation practice.",
          "summary": "prepare with diaphragmatic breathing for psychedelic experience",
          "duration": 88,
          "duration_formatted": "1:28",
          "descript_url": "https://share.descript.com/view/YjwjlT0943f",
          "word_count": 226
        }
      ]
    }
  ]
};
