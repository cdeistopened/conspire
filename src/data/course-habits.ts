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

export const courseHabits: Course = {
  "pillar": "habits",
  "title": "Habits",
  "tagline": "Small daily actions compound into a life.",
  "instructor": "Dr. Richard Louis Miller",
  "total_modules": 6,
  "total_sec": 870,
  "total_formatted": "14:30",
  "chapters": [
    {
      "slug": "01-modules",
      "title": "Modules",
      "blurb": "",
      "module_count": 6,
      "total_sec": 870,
      "modules": [
        {
          "order": 1,
          "file": "a-little-over-time-is-a-lot.md",
          "title": "Small daily habits compound into transformative results over decades. 1 soda a day = 45 pounds in 3 years. Walk 5 mins daily, add 1 min weekly = major fitness in a year.",
          "summary": "small daily habits compound into major health outcomes over decades",
          "duration": 57,
          "duration_formatted": "0:57",
          "descript_url": "https://share.descript.com/view/MAo0f3tMoOf",
          "word_count": 150
        },
        {
          "order": 2,
          "file": "persistence.md",
          "title": "Persistence requires repeated attempts. Success is not instantaneous; you must try again and again. The creep effect works for both good and bad habits.",
          "summary": "persistence; success requires repeated attempts.",
          "duration": 83,
          "duration_formatted": "1:23",
          "descript_url": "https://share.descript.com/view/GxUyS12TAqa",
          "word_count": 239
        },
        {
          "order": 3,
          "file": "journaling.md",
          "title": "Your mind listens to everything you say. Positive self-talk, gratitude, and mind training are foundational habits that reshape neurology.",
          "summary": "daily journaling clarifies thoughts and emotional patterns",
          "duration": 145,
          "duration_formatted": "2:25",
          "descript_url": "https://share.descript.com/view/73tbu0vLd64",
          "word_count": 366
        },
        {
          "order": 4,
          "file": "eliptical-machine.md",
          "title": "Everyone gets off the plan. The habit is not staying perfect—it's returning to discipline when you slip.",
          "summary": "We all get off the plan, important to return to discipline",
          "duration": 59,
          "duration_formatted": "0:59",
          "descript_url": "https://share.descript.com/view/nW5jmbbW75s",
          "word_count": 154
        },
        {
          "order": 5,
          "file": "clips-from-new-year.md",
          "title": "Start now, not on New Year. Resolutions are stalling techniques. Delay is the real enemy.",
          "summary": "start now, not on new year; resolutions are stalling techniques",
          "duration": 70,
          "duration_formatted": "1:10",
          "descript_url": "https://share.descript.com/view/WbR0PysVflA",
          "word_count": 179
        },
        {
          "order": 6,
          "file": "tools-for-a-healthy-life-long-form.md",
          "title": "Use specific tools and practices (vacation, exercise, internet discipline, assessment) as habit infrastructure.",
          "summary": "Richard's thirteen tools for graceful living: abdominal breathing, mind control, body awareness, positive self-talk, exercise, nutrition, sleep, social connection, purpose, laughter, persistence, working smarter, and vacation.",
          "duration": 456,
          "duration_formatted": "7:36",
          "descript_url": "https://share.descript.com/view/7T3oVMozQ5h",
          "word_count": 1072
        }
      ]
    }
  ]
};
