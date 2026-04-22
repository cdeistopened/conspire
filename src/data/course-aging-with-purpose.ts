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

export const courseAgingWithPurpose: Course = {
  "pillar": "aging-with-purpose",
  "title": "Aging with Purpose",
  "tagline": "Retirement is a trap. Keep engaged, keep alive.",
  "instructor": "Dr. Richard Louis Miller",
  "total_modules": 13,
  "total_sec": 1950,
  "total_formatted": "32:30",
  "chapters": [
    {
      "slug": "01-modules",
      "title": "Modules",
      "blurb": "",
      "module_count": 13,
      "total_sec": 1950,
      "modules": [
        {
          "order": 1,
          "file": "how-do-i-deal-with-post-menopause-emotional-flatness.md",
          "title": "hormonal-mood-stability-menopause",
          "summary": "age brings authority and wisdom if used intentionally",
          "duration": 120,
          "duration_formatted": "2:00",
          "descript_url": "https://share.descript.com/view/7mBALY45OxJ",
          "word_count": 330
        },
        {
          "order": 2,
          "file": "longevity.md",
          "title": "longevity-through-community-purpose",
          "summary": "longevity comes from communities with purpose.",
          "duration": 81,
          "duration_formatted": "1:21",
          "descript_url": "https://share.descript.com/view/d6zamQZpZAk",
          "word_count": 201
        },
        {
          "order": 3,
          "file": "copy-of-suffering-from-alcoholism.md",
          "title": "crisis-response-substance-abuse",
          "summary": "age brings authority and wisdom",
          "duration": 101,
          "duration_formatted": "1:41",
          "descript_url": "https://share.descript.com/view/y1IzJU16tMt",
          "word_count": 185
        },
        {
          "order": 4,
          "file": "clip-1-best-way-to-handle-jealousy-in-a-polyamorous-relationship.md",
          "title": "expert-wisdom-polyamory-relationships",
          "summary": "age brings authority and wisdom",
          "duration": 57,
          "duration_formatted": "0:57",
          "descript_url": "https://share.descript.com/view/3tddWJUES9W",
          "word_count": 5183
        },
        {
          "order": 5,
          "file": "ben-sessa.md",
          "title": "interview-ben-sessa",
          "summary": "age brings authority and wisdom",
          "duration": 73,
          "duration_formatted": "1:13",
          "descript_url": "https://share.descript.com/view/XS8qOZ2D62l",
          "word_count": 5098
        },
        {
          "order": 6,
          "file": "7.md",
          "title": "7th-clip-unlabeled",
          "summary": "age brings authority and wisdom",
          "duration": 244,
          "duration_formatted": "4:04",
          "descript_url": "https://share.descript.com/view/vQpVGPSD2Z7",
          "word_count": 155
        },
        {
          "order": 7,
          "file": "building-fitness-anywhere-and-everywhere.md",
          "title": "embrace-aging-as-continued-growth",
          "summary": "age brings authority and wisdom",
          "duration": 559,
          "duration_formatted": "9:19",
          "descript_url": "https://share.descript.com/view/NHaoMuASQfD",
          "word_count": 714
        },
        {
          "order": 8,
          "file": "life-and-death-feb-14.md",
          "title": "mind-shapes-physical-reality",
          "summary": "let's talk about life and death. hi, this is dr. richard lewis",
          "duration": 114,
          "duration_formatted": "1:54",
          "descript_url": "https://share.descript.com/view/eFmatEGyjQs",
          "word_count": 329
        },
        {
          "order": 9,
          "file": "breathing.md",
          "title": "emotional-regulation-through-discipline",
          "summary": "age brings authority and wisdom",
          "duration": 326,
          "duration_formatted": "5:26",
          "descript_url": "https://share.descript.com/view/xwZwkja3XSq",
          "word_count": 759
        },
        {
          "order": 10,
          "file": "regret.md",
          "title": "let-go-past-preserve-optimism",
          "summary": "Let go of the past to preserve optimism",
          "duration": 25,
          "duration_formatted": "0:25",
          "descript_url": "https://share.descript.com/view/rkqDVqja26y",
          "word_count": 92
        },
        {
          "order": 11,
          "file": "apathy.md",
          "title": "apathy-and-purposelessness-crisis",
          "summary": "age brings authority and wisdom",
          "duration": 86,
          "duration_formatted": "1:26",
          "descript_url": "https://share.descript.com/view/TKOJZPfZDGX",
          "word_count": 219
        },
        {
          "order": 12,
          "file": "aging-85s.md",
          "title": "keep-engaged-keep-working",
          "summary": "age brings authority and wisdom",
          "duration": 85,
          "duration_formatted": "1:25",
          "descript_url": "https://share.descript.com/view/2Bw3SRFatpG",
          "word_count": 261
        },
        {
          "order": 13,
          "file": "check-in-ourselves.md",
          "title": "self-care-check-in",
          "summary": "age brings authority and wisdom",
          "duration": 79,
          "duration_formatted": "1:19",
          "descript_url": "https://share.descript.com/view/zNJkB8Eg9Cp",
          "word_count": 125
        }
      ]
    }
  ]
};
