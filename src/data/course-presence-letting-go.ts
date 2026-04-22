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

export const coursePresenceLettingGo: Course = {
  "pillar": "presence-letting-go",
  "title": "Presence & Letting Go",
  "tagline": "The present moment is all there is. Let the rest go.",
  "instructor": "Dr. Richard Louis Miller",
  "total_modules": 14,
  "total_sec": 1492,
  "total_formatted": "24:52",
  "chapters": [
    {
      "slug": "01-modules",
      "title": "Modules",
      "blurb": "",
      "module_count": 14,
      "total_sec": 1492,
      "modules": [
        {
          "order": 1,
          "file": "1-mindfulness.md",
          "title": "acceptance-and-witnessing",
          "summary": "mindfulness as witnessing your own thoughts without judgment",
          "duration": 118,
          "duration_formatted": "1:58",
          "descript_url": "https://share.descript.com/view/LiXAHBaJDkF",
          "word_count": 311
        },
        {
          "order": 2,
          "file": "riverside-dr-richard-louis-m-studio-0648.md",
          "title": "application-real-life",
          "summary": "speaker 2: what's the best way to calm my mind when i",
          "duration": 76,
          "duration_formatted": "1:16",
          "descript_url": "https://share.descript.com/view/OKJeFAHmOXu",
          "word_count": 152
        },
        {
          "order": 3,
          "file": "check-in-ourselves-2.md",
          "title": "body-awareness",
          "summary": "check in with yourself to set attitude",
          "duration": 80,
          "duration_formatted": "1:20",
          "descript_url": "https://share.descript.com/view/imRzSgU28Lm",
          "word_count": 222
        },
        {
          "order": 4,
          "file": "power-of-abdominal-breathing-89s.md",
          "title": "breathing-tool",
          "summary": "abdominal breathing is antidote to anxiety.",
          "duration": 89,
          "duration_formatted": "1:29",
          "descript_url": "https://share.descript.com/view/m2N8WKjMrG8",
          "word_count": 218
        },
        {
          "order": 5,
          "file": "finding-inner-peace.md",
          "title": "gratitude-nature",
          "summary": "shield your inner peace from external negativity",
          "duration": 72,
          "duration_formatted": "1:12",
          "descript_url": "https://share.descript.com/view/kNH983HgZwd",
          "word_count": 201
        },
        {
          "order": 6,
          "file": "copy-of-healing-golden-light-meditation.md",
          "title": "healing-meditation",
          "summary": "Guided golden-light meditation. Fill your head, then arms, chest, stomach, legs with golden light. Close your eyes and feel every part of you as beautiful golden light.",
          "duration": 354,
          "duration_formatted": "5:54",
          "descript_url": "https://share.descript.com/view/jOJFEI6iJXG",
          "word_count": 332
        },
        {
          "order": 7,
          "file": "life-isnt-personal.md",
          "title": "impermanence",
          "summary": "life happens; don't take it personally.",
          "duration": 79,
          "duration_formatted": "1:19",
          "descript_url": "https://share.descript.com/view/drrku3xnQHo",
          "word_count": 207
        },
        {
          "order": 8,
          "file": "the-past-2.md",
          "title": "let-go-past",
          "summary": "there is only now; live in the present",
          "duration": 88,
          "duration_formatted": "1:28",
          "descript_url": "https://share.descript.com/view/8QkxzULrn30",
          "word_count": 232
        },
        {
          "order": 9,
          "file": "final-clip-2.md",
          "title": "meditation-practice",
          "summary": "Richard Dixey on his three-minutes-a-day meditation protocol: start with a real candle (moving flame), then a fading bell, then breath. Experience precedes words, and most religion goes haywire trying to replace it with language.",
          "duration": 45,
          "duration_formatted": "0:45",
          "descript_url": "https://share.descript.com/view/JpuBC5E8a9J",
          "word_count": 4470
        },
        {
          "order": 10,
          "file": "optimism-2.md",
          "title": "optimism-learned",
          "summary": "Optimism is learned and worth learning daily",
          "duration": 132,
          "duration_formatted": "2:12",
          "descript_url": "https://share.descript.com/view/d0giz4TpOMv",
          "word_count": 390
        },
        {
          "order": 11,
          "file": "past-and-mindfulness.md",
          "title": "past-and-mindfulness",
          "summary": "dwelling on past causes most suffering.",
          "duration": 118,
          "duration_formatted": "1:58",
          "descript_url": "https://share.descript.com/view/twCadZSOOhy",
          "word_count": 247
        },
        {
          "order": 12,
          "file": "the-past-part-4.md",
          "title": "present-moment-is-all",
          "summary": "How Richard and his wife are handling her breast cancer diagnosis: living in the present, not in the cesspool of past what-ifs or the future's worst-cases. Expressing gratitude day by day.",
          "duration": 88,
          "duration_formatted": "1:28",
          "descript_url": "https://share.descript.com/view/g8dNteZsoak",
          "word_count": 271
        },
        {
          "order": 13,
          "file": "tragedy-winnebago.md",
          "title": "tragedy-story",
          "summary": "master breathing as essential life skill",
          "duration": 64,
          "duration_formatted": "1:04",
          "descript_url": "https://share.descript.com/view/Vewv2QjRCKc",
          "word_count": 169
        },
        {
          "order": 14,
          "file": "navigating-worries-and-embracing-the-present.md",
          "title": "worry-vs-planning",
          "summary": "worry pulls you from present moment.",
          "duration": 89,
          "duration_formatted": "1:29",
          "descript_url": "https://share.descript.com/view/64hjSYqxVnL",
          "word_count": 261
        }
      ]
    }
  ]
};
