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

export const courseRelationships: Course = {
  "pillar": "relationships",
  "title": "Relationships",
  "tagline": "Listen first. Love is presence.",
  "instructor": "Dr. Richard Louis Miller",
  "total_modules": 17,
  "total_sec": 1333,
  "total_formatted": "22:13",
  "chapters": [
    {
      "slug": "01-Listen & Accept",
      "title": "Listen & Accept",
      "blurb": "",
      "module_count": 1,
      "total_sec": 61,
      "modules": [
        {
          "order": 1,
          "file": "relationships.md",
          "title": "Accept people as they are; your job is you, not to change them",
          "summary": "What comes at you in a relationship is the other person expressing themselves. Accept them as they are, or you are not in the relationship. They will not change because you want them to.",
          "duration": 61,
          "duration_formatted": "1:01",
          "descript_url": "https://share.descript.com/view/Hx90U1pDVL7",
          "word_count": 168
        }
      ]
    },
    {
      "slug": "02-Trust & Integrity",
      "title": "Trust & Integrity",
      "blurb": "",
      "module_count": 1,
      "total_sec": 78,
      "modules": [
        {
          "order": 1,
          "file": "building-trust.md",
          "title": "Trust is your responsibility after betrayal; keep your own standards",
          "summary": "Trust is not yours to rebuild after someone betrays you, that's their work. Your job is to trust yourself and keep your own standards. Most people are not betrayers.",
          "duration": 78,
          "duration_formatted": "1:18",
          "descript_url": "https://share.descript.com/view/ew4h5Zagds1",
          "word_count": 179
        }
      ]
    },
    {
      "slug": "03-Intimacy & Presence",
      "title": "Intimacy & Presence",
      "blurb": "",
      "module_count": 1,
      "total_sec": 82,
      "modules": [
        {
          "order": 1,
          "file": "intrusions.md",
          "title": "Conscious intimacy deepens healing and connection",
          "summary": "conscious intimacy deepens connection and healing",
          "duration": 82,
          "duration_formatted": "1:22",
          "descript_url": "https://share.descript.com/view/aJWrnkhzVJr",
          "word_count": 233
        }
      ]
    },
    {
      "slug": "04-Consent & Sexuality",
      "title": "Consent & Sexuality",
      "blurb": "",
      "module_count": 1,
      "total_sec": 133,
      "modules": [
        {
          "order": 1,
          "file": "sexual-behavior.md",
          "title": "Sexual intimacy requires explicit permission and communication",
          "summary": "ask permission; communication builds intimacy",
          "duration": 133,
          "duration_formatted": "2:13",
          "descript_url": "https://share.descript.com/view/jJYXREEl7lz",
          "word_count": 351
        }
      ]
    },
    {
      "slug": "05-Greeting & Respect",
      "title": "Greeting & Respect",
      "blurb": "",
      "module_count": 1,
      "total_sec": 74,
      "modules": [
        {
          "order": 1,
          "file": "respect.md",
          "title": "Greet others with dignity, respect, kindness, and love",
          "summary": "In the 5th century BC handshakes showed you had no sword. Richard proposes a new greeting: 'Hi, my name is Richard, and I will treat you with dignity, respect, kindness, and love.' Try it for three months.",
          "duration": 74,
          "duration_formatted": "1:14",
          "descript_url": "https://share.descript.com/view/6DVHNompCdG",
          "word_count": 195
        }
      ]
    },
    {
      "slug": "06-Conflict & Repair",
      "title": "Conflict & Repair",
      "blurb": "",
      "module_count": 1,
      "total_sec": 41,
      "modules": [
        {
          "order": 1,
          "file": "repairing-relationships.md",
          "title": "Apology and forgiveness within seconds: 'I'm sorry. I forgive you. Move on.'",
          "summary": "The key to harmonious living is apology and forgiveness. 'I'm sorry I hurt your feelings.' The other person says 'I forgive you, thank you for apologizing.' Shake hands, hug, move on. That is repair.",
          "duration": 41,
          "duration_formatted": "0:41",
          "descript_url": "https://share.descript.com/view/exsNg8ToMCG",
          "word_count": 109
        }
      ]
    },
    {
      "slug": "07-Tribal Connection",
      "title": "Tribal Connection",
      "blurb": "",
      "module_count": 1,
      "total_sec": 55,
      "modules": [
        {
          "order": 1,
          "file": "john-mcdougall.md",
          "title": "Humans are tribal; small groups are essential for survival",
          "summary": "humans are tribal animals; small groups are essential",
          "duration": 55,
          "duration_formatted": "0:55",
          "descript_url": "https://share.descript.com/view/zA6pWsJI6DM",
          "word_count": 5799
        }
      ]
    },
    {
      "slug": "08-Connection & Isolation",
      "title": "Connection & Isolation",
      "blurb": "",
      "module_count": 1,
      "total_sec": 255,
      "modules": [
        {
          "order": 1,
          "file": "antidote-to-isolation-and-alienation-february-22.md",
          "title": "Isolation is the modern epidemic; antidote is one small weekly call",
          "summary": "phone call revolution as antidote to isolation and alienation epidemic",
          "duration": 255,
          "duration_formatted": "4:15",
          "descript_url": "https://share.descript.com/view/i2QZK2opbDM",
          "word_count": 543
        }
      ]
    },
    {
      "slug": "09-Self-Friendship",
      "title": "Self Friendship",
      "blurb": "",
      "module_count": 1,
      "total_sec": 39,
      "modules": [
        {
          "order": 1,
          "file": "how-to-manage-loneliness.md",
          "title": "Loneliness starts with not being your own friend; befriend yourself first",
          "summary": "Loneliness starts with not being your own friend. Learn to find yourself interesting, hold a fun conversation with yourself, make yourself laugh. These are prerequisites for a good life.",
          "duration": 39,
          "duration_formatted": "0:39",
          "descript_url": "https://share.descript.com/view/jc2dxg8epkA",
          "word_count": 124
        }
      ]
    },
    {
      "slug": "10-Social Confidence",
      "title": "Social Confidence",
      "blurb": "",
      "module_count": 1,
      "total_sec": 103,
      "modules": [
        {
          "order": 1,
          "file": "shyness.md",
          "title": "Overcome shyness through assignment: approach someone, practice greeting",
          "summary": "overcome shyness by engaging and greeting others",
          "duration": 103,
          "duration_formatted": "1:43",
          "descript_url": "https://share.descript.com/view/rux8xFrc3wy",
          "word_count": 271
        }
      ]
    },
    {
      "slug": "11-Presence & Attention",
      "title": "Presence & Attention",
      "blurb": "",
      "module_count": 1,
      "total_sec": 40,
      "modules": [
        {
          "order": 1,
          "file": "importance-of-slowing-down.md",
          "title": "Put phone to sleep; connect directly and fully present",
          "summary": "When you are with other people, put the phone to sleep. Connect directly. Take a regular day off the phone to see the world as it is instead of through the screen.",
          "duration": 40,
          "duration_formatted": "0:40",
          "descript_url": "https://share.descript.com/view/Cw1BywYoAQl",
          "word_count": 113
        }
      ]
    },
    {
      "slug": "12-Family & Mentorship",
      "title": "Family & Mentorship",
      "blurb": "",
      "module_count": 1,
      "total_sec": 77,
      "modules": [
        {
          "order": 1,
          "file": "the-miller-family-a-closer-look.md",
          "title": "Family stories and continuity matter; mentors guide through decisions",
          "summary": "family stories and connections matter",
          "duration": 77,
          "duration_formatted": "1:17",
          "descript_url": "https://share.descript.com/view/F0KDpCznR3h",
          "word_count": 185
        }
      ]
    },
    {
      "slug": "13-Self-Awareness",
      "title": "Self Awareness",
      "blurb": "",
      "module_count": 1,
      "total_sec": 81,
      "modules": [
        {
          "order": 1,
          "file": "witnessing.md",
          "title": "Witness yourself in action; practice self-awareness of your patterns",
          "summary": "witness yourself in action; practice self-awareness",
          "duration": 81,
          "duration_formatted": "1:21",
          "descript_url": "https://share.descript.com/view/5Hx8HBktMEX",
          "word_count": 213
        }
      ]
    },
    {
      "slug": "14-Environment & Support",
      "title": "Environment & Support",
      "blurb": "",
      "module_count": 1,
      "total_sec": 42,
      "modules": [
        {
          "order": 1,
          "file": "clips-from-motivation.md",
          "title": "Surround yourself with encouraging people; avoid emotional downers",
          "summary": "surround yourself with encouraging upbeat people, avoid downers",
          "duration": 42,
          "duration_formatted": "0:42",
          "descript_url": "https://share.descript.com/view/W9F5p5Jv6JQ",
          "word_count": 141
        }
      ]
    },
    {
      "slug": "15-Alternative Relationship Models",
      "title": "Alternative Relationship Models",
      "blurb": "",
      "module_count": 1,
      "total_sec": 20,
      "modules": [
        {
          "order": 1,
          "file": "valerie-white-episode.md",
          "title": "Polyamorous family logistics: shared expenses, role clarity, individual identity",
          "summary": "Valerie White on the logistics of polyamorous family life: shared sheet for household expenses averaged across three partners, separate agreement for child-related costs. Plus the rule that Susie can never be Valerie.",
          "duration": 20,
          "duration_formatted": "0:20",
          "descript_url": "https://share.descript.com/view/gWz7xS3qd9o",
          "word_count": 4187
        }
      ]
    },
    {
      "slug": "16-Community & Culture",
      "title": "Community & Culture",
      "blurb": "",
      "module_count": 1,
      "total_sec": 100,
      "modules": [
        {
          "order": 1,
          "file": "marian-goodell-interview.md",
          "title": "Burning Man principles as relationship/community model: radical self-expression, participation, leave no trace",
          "summary": "Richard interviews Marian Goodell on the 10 Burning Man principles: radical self-expression, communal effort, civic responsibility, participation, immediacy, leave no trace. How the culture avoids politicization while modeling human connection.",
          "duration": 100,
          "duration_formatted": "1:40",
          "descript_url": "https://share.descript.com/view/L67NrZQnMF2",
          "word_count": 5676
        }
      ]
    },
    {
      "slug": "17-Mutual Respect",
      "title": "Mutual Respect",
      "blurb": "",
      "module_count": 1,
      "total_sec": 52,
      "modules": [
        {
          "order": 1,
          "file": "driving-tips.md",
          "title": "Negotiate shared comfort; less comfortable person sets pace (e.g., driving speed)",
          "summary": "Negotiate driving speed, less comfortable person sets pace",
          "duration": 52,
          "duration_formatted": "0:52",
          "descript_url": "https://share.descript.com/view/VbBxgMhaHjN",
          "word_count": 149
        }
      ]
    }
  ]
};
