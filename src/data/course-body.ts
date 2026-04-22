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

export const courseBody: Course = {
  "pillar": "body",
  "title": "Body",
  "tagline": "Walk every day. Eat real food. Sleep well. Breathe.",
  "instructor": "Dr. Richard Louis Miller",
  "total_modules": 25,
  "total_sec": 2803,
  "total_formatted": "46:43",
  "chapters": [
    {
      "slug": "01-Movement & Fitness",
      "title": "Movement & Fitness",
      "blurb": "",
      "module_count": 1,
      "total_sec": 101,
      "modules": [
        {
          "order": 1,
          "file": "exercise-program.md",
          "title": "Exercise is foundational; build it into daily life via small, consistent action",
          "summary": "Build fitness into daily life; small consistent action",
          "duration": 101,
          "duration_formatted": "1:41",
          "descript_url": "https://share.descript.com/view/PGDud7yJQpf",
          "word_count": 265
        }
      ]
    },
    {
      "slug": "02-Nutrition & Weight Management",
      "title": "Nutrition & Weight Management",
      "blurb": "",
      "module_count": 1,
      "total_sec": 89,
      "modules": [
        {
          "order": 1,
          "file": "weight-control-3.md",
          "title": "Weight control: calorie balance is simple math; food awareness beats diets",
          "summary": "Your body is like a car. Average person needs about 2,000 calories to maintain weight. More than that accumulates; less drops fat. That is the whole story. The diet industry sells BS around this simple math.",
          "duration": 89,
          "duration_formatted": "1:29",
          "descript_url": "https://share.descript.com/view/tgYjBjAcKBk",
          "word_count": 272
        }
      ]
    },
    {
      "slug": "03-Food Quality & Nutrition",
      "title": "Food Quality & Nutrition",
      "blurb": "",
      "module_count": 1,
      "total_sec": 79,
      "modules": [
        {
          "order": 1,
          "file": "essence-of-sleep.md",
          "title": "Whole, fresh food beats packaged; avoid processed products",
          "summary": "whole foods beat packaged products",
          "duration": 79,
          "duration_formatted": "1:19",
          "descript_url": "https://share.descript.com/view/onObaqUO56f",
          "word_count": 195
        }
      ]
    },
    {
      "slug": "04-Hydration & Daily Habits",
      "title": "Hydration & Daily Habits",
      "blurb": "",
      "module_count": 1,
      "total_sec": 84,
      "modules": [
        {
          "order": 1,
          "file": "water.md",
          "title": "Hydration: schedule water intake (half body weight in ounces daily)",
          "summary": "Hydration matters, but carrying a bottle is not enough. Richard drinks half his body weight in ounces of water daily, 32 ounces at breakfast, lunch, and dinner. Put it on a schedule.",
          "duration": 84,
          "duration_formatted": "1:24",
          "descript_url": "https://share.descript.com/view/pqR8BVqTm2b",
          "word_count": 252
        }
      ]
    },
    {
      "slug": "05-Breath & Nervous System",
      "title": "Breath & Nervous System",
      "blurb": "",
      "module_count": 1,
      "total_sec": 100,
      "modules": [
        {
          "order": 1,
          "file": "life-tips.md",
          "title": "Breathing mastery (diaphragmatic) regulates nervous system faster than sedatives",
          "summary": "Diaphragmatic breathing regulates the system faster than a speeding Valium. Richard saved his own life breathing this way after a Winnebago crushed his legs. Practice anywhere, any time, until it's automatic.",
          "duration": 100,
          "duration_formatted": "1:40",
          "descript_url": "https://share.descript.com/view/O16wg19jLo8",
          "word_count": 264
        }
      ]
    },
    {
      "slug": "06-Strength & Flexibility",
      "title": "Strength & Flexibility",
      "blurb": "",
      "module_count": 1,
      "total_sec": 124,
      "modules": [
        {
          "order": 1,
          "file": "muscle-stretching.md",
          "title": "Strength training & muscle care; stretch like dogs (daily, informal)",
          "summary": "muscle strength and stretching prevent aging decline.",
          "duration": 124,
          "duration_formatted": "2:04",
          "descript_url": "https://share.descript.com/view/6TV2FaraWv0",
          "word_count": 332
        }
      ]
    },
    {
      "slug": "07-Sleep & Rest",
      "title": "Sleep & Rest",
      "blurb": "",
      "module_count": 1,
      "total_sec": 75,
      "modules": [
        {
          "order": 1,
          "file": "sleep.md",
          "title": "Sleep is foundational; intentional rest is part of health",
          "summary": "one of the topics that people ask me about frequently is sleep",
          "duration": 75,
          "duration_formatted": "1:15",
          "descript_url": "https://share.descript.com/view/SQt8RZZEtbJ",
          "word_count": 198
        }
      ]
    },
    {
      "slug": "08-Exercise & Mental Health",
      "title": "Exercise & Mental Health",
      "blurb": "",
      "module_count": 1,
      "total_sec": 75,
      "modules": [
        {
          "order": 1,
          "file": "negativity.md",
          "title": "Movement as antidote to depression; start small, persist",
          "summary": "Movement is the antidote to depression. Start with a hundred yards, then 110, then 120. Walking, jogging, bicycling, anything counts. Get that down, folks.",
          "duration": 75,
          "duration_formatted": "1:15",
          "descript_url": "https://share.descript.com/view/1nQf75jdukH",
          "word_count": 76
        }
      ]
    },
    {
      "slug": "09-Embodiment & Awareness",
      "title": "Embodiment & Awareness",
      "blurb": "",
      "module_count": 1,
      "total_sec": 82,
      "modules": [
        {
          "order": 1,
          "file": "body-awareness.md",
          "title": "Body awareness (interoception): scan body parts, 'go out of your mind and come to your senses'",
          "summary": "We live in our heads and lose touch with our bodies. Close your eyes and scan: feet, legs, back, arms, neck, head. A few minutes a couple of times a day. 'Go out of your mind and come to your senses.'",
          "duration": 82,
          "duration_formatted": "1:22",
          "descript_url": "https://share.descript.com/view/2pvVSDcnhYO",
          "word_count": 235
        }
      ]
    },
    {
      "slug": "10-Eating Awareness & Habits",
      "title": "Eating Awareness & Habits",
      "blurb": "",
      "module_count": 1,
      "total_sec": 78,
      "modules": [
        {
          "order": 1,
          "file": "health-and-diet.md",
          "title": "Intentional nutrition prevents habit-based overeating",
          "summary": "intentional nutrition prevents habit-based overeating",
          "duration": 78,
          "duration_formatted": "1:18",
          "descript_url": "https://share.descript.com/view/0rEUkrardMQ",
          "word_count": 192
        }
      ]
    },
    {
      "slug": "11-Posture & Alignment",
      "title": "Posture & Alignment",
      "blurb": "",
      "module_count": 1,
      "total_sec": 86,
      "modules": [
        {
          "order": 1,
          "file": "workout.md",
          "title": "Posture alignment activates mind-body system (recovers from pandemic slouch)",
          "summary": "During the pandemic gym closures Richard lost muscle, used a cane, hunched over. He got out by weightlifting plus practicing awareness of slouch vs upright. Posture aligns the whole mind-body system.",
          "duration": 86,
          "duration_formatted": "1:26",
          "descript_url": "https://share.descript.com/view/seNxQ0bzhOk",
          "word_count": 229
        }
      ]
    },
    {
      "slug": "12-Nature & Healing",
      "title": "Nature & Healing",
      "blurb": "",
      "module_count": 1,
      "total_sec": 70,
      "modules": [
        {
          "order": 1,
          "file": "nature-as-medicine.md",
          "title": "Nature heals; prescription-grade time outside required",
          "summary": "nature heals; prescription-grade time outside.",
          "duration": 70,
          "duration_formatted": "1:10",
          "descript_url": "https://share.descript.com/view/qrPMgYYF9Za",
          "word_count": 171
        }
      ]
    },
    {
      "slug": "13-Weight & Immune Health",
      "title": "Weight & Immune Health",
      "blurb": "",
      "module_count": 1,
      "total_sec": 90,
      "modules": [
        {
          "order": 1,
          "file": "immune-systems.md",
          "title": "Weight control as immune system protection (extra weight drains immune cells)",
          "summary": "Weight control is immune-system protection. Extra weight drains energy from the immune cells because the body has to oxygenate and pump blood to tissue that gives nothing back.",
          "duration": 90,
          "duration_formatted": "1:30",
          "descript_url": "https://share.descript.com/view/WTBzaVaHYvA",
          "word_count": 237
        }
      ]
    },
    {
      "slug": "14-Lifestyle vs. Medication",
      "title": "Lifestyle Vs. Medication",
      "blurb": "",
      "module_count": 1,
      "total_sec": 73,
      "modules": [
        {
          "order": 1,
          "file": "side-effects.md",
          "title": "Exercise & medication: fitness + nutrition often outperform prescriptions",
          "summary": "Antidepressant 'side effects' happen to the whole body, not a side. Exercise and nutrition often outperform the prescription. Take any medication mindfully, not reflexively.",
          "duration": 73,
          "duration_formatted": "1:13",
          "descript_url": "https://share.descript.com/view/kVOAIqmLF7l",
          "word_count": 189
        }
      ]
    },
    {
      "slug": "15-Health Screening & Advocacy",
      "title": "Health Screening & Advocacy",
      "blurb": "",
      "module_count": 1,
      "total_sec": 65,
      "modules": [
        {
          "order": 1,
          "file": "early-detection-in-breast-cancer.md",
          "title": "Cancer detection: multi-modality testing (mammogram + ultrasound); ask for more",
          "summary": "Richard's wife had clear mammograms yearly, then an ultrasound caught breast cancer. The lesson: mammogram alone is not enough. Ask your practitioner what else you can do.",
          "duration": 65,
          "duration_formatted": "1:05",
          "descript_url": "https://share.descript.com/view/V8xM4Cvx806",
          "word_count": 204
        }
      ]
    },
    {
      "slug": "16-Medical Autonomy",
      "title": "Medical Autonomy",
      "blurb": "",
      "module_count": 1,
      "total_sec": 89,
      "modules": [
        {
          "order": 1,
          "file": "importance-of-second-opinion.md",
          "title": "Medical decisions: get second opinions; trust yourself over specialist pressure",
          "summary": "A personal ER story about swollen epiglottis. A specialist urged a four-hour drive to San Francisco. Instead, he stayed near the local ER and recovered. Listen to yourself, get second opinions when stakes are high.",
          "duration": 89,
          "duration_formatted": "1:29",
          "descript_url": "https://share.descript.com/view/kiBCngolkoN",
          "word_count": 279
        }
      ]
    },
    {
      "slug": "17-Health as Priority",
      "title": "Health As Priority",
      "blurb": "",
      "module_count": 1,
      "total_sec": 80,
      "modules": [
        {
          "order": 1,
          "file": "importance-of-good-health.md",
          "title": "Priority health: 'good health is worth fighting for; prioritize it'",
          "summary": "good health is worth fighting for; prioritize it",
          "duration": 80,
          "duration_formatted": "1:20",
          "descript_url": "https://share.descript.com/view/y3QUPW9ja9U",
          "word_count": 219
        }
      ]
    },
    {
      "slug": "18-Integrated Health Routine",
      "title": "Integrated Health Routine",
      "blurb": "",
      "module_count": 1,
      "total_sec": 78,
      "modules": [
        {
          "order": 1,
          "file": "mind-over-matter-control-thought-intrusions.md",
          "title": "Richard's daily routine at 86: weights + aerobics + sleep + clean eating + relationships",
          "summary": "Richard's daily routine at 86: four days of weights, five to six days of aerobics (elliptical, trike, swim), eight to nine hours of sleep, clean eating (egg whites, spinach, salads, herring, chicken, bison), and engaged relationships.",
          "duration": 78,
          "duration_formatted": "1:18",
          "descript_url": "https://share.descript.com/view/FDQyNyZBQ4K",
          "word_count": 256
        }
      ]
    },
    {
      "slug": "19-Body Maintenance",
      "title": "Body Maintenance",
      "blurb": "",
      "module_count": 1,
      "total_sec": 60,
      "modules": [
        {
          "order": 1,
          "file": "impact-of-living-together.md",
          "title": "Body care is maintenance: oil, feed, rest, massage like any valued mechanism",
          "summary": "Be good to your body. Treat it like any mechanism you've used for a long time, oil it, feed it, rest it, massage it with your hands. It carries you around; figure out ways to take care of it.",
          "duration": 60,
          "duration_formatted": "1:00",
          "descript_url": "https://share.descript.com/view/0kj2XkmWEPB",
          "word_count": 137
        }
      ]
    },
    {
      "slug": "20-Substance Avoidance",
      "title": "Substance Avoidance",
      "blurb": "",
      "module_count": 1,
      "total_sec": 101,
      "modules": [
        {
          "order": 1,
          "file": "soft-drinks.md",
          "title": "Soft drinks are nutritional waste; avoid",
          "summary": "soft drinks are a waste of time",
          "duration": 101,
          "duration_formatted": "1:41",
          "descript_url": "https://share.descript.com/view/VmXzIaGG2Bb",
          "word_count": 223
        }
      ]
    },
    {
      "slug": "21-Caregiver Health",
      "title": "Caregiver Health",
      "blurb": "",
      "module_count": 1,
      "total_sec": 300,
      "modules": [
        {
          "order": 1,
          "file": "burnout-long-form.md",
          "title": "Caregiver burnout: self-care first (exercise when fatigued, say no, reach out)",
          "summary": "Caretakers need to care for themselves first. Exercise when fatigued (energy begets energy), reach out when isolating, and say no to prevent burnout. Five-minute teaching for helping professionals.",
          "duration": 300,
          "duration_formatted": "5:00",
          "descript_url": "https://share.descript.com/view/wTLYZrBHO1Y",
          "word_count": 731
        }
      ]
    },
    {
      "slug": "22-Sexual Health & Relationships",
      "title": "Sexual Health & Relationships",
      "blurb": "",
      "module_count": 1,
      "total_sec": 589,
      "modules": [
        {
          "order": 1,
          "file": "ed-1.md",
          "title": "Erectile dysfunction: multitasking organ challenge; requires cardiovascular + mental health",
          "summary": "Understanding erectile dysfunction as multitasking organ challenge",
          "duration": 589,
          "duration_formatted": "9:49",
          "descript_url": "https://share.descript.com/view/9JRPClv7GRW",
          "word_count": 1451
        }
      ]
    },
    {
      "slug": "23-Embodied Sexuality",
      "title": "Embodied Sexuality",
      "blurb": "",
      "module_count": 1,
      "total_sec": 74,
      "modules": [
        {
          "order": 1,
          "file": "phone.md",
          "title": "Sensual awareness extends beyond genitals; integrated body presence",
          "summary": "sensual awareness extends beyond genitals.",
          "duration": 74,
          "duration_formatted": "1:14",
          "descript_url": "https://share.descript.com/view/ZToCPvsLeo3",
          "word_count": 208
        }
      ]
    },
    {
      "slug": "24-Digital Wellness",
      "title": "Digital Wellness",
      "blurb": "",
      "module_count": 1,
      "total_sec": 84,
      "modules": [
        {
          "order": 1,
          "file": "5-ways-screens-mimic-a-vegas-casino.md",
          "title": "Screen culture disembodies; real learning requires full-stack care (nervous system, body, spirit)",
          "summary": "Anjan Katta on how screen culture fetishizes the mind and disembodies us. Real learning requires caring for the full stack: nervous system, body, and spirit, not just information intake.",
          "duration": 84,
          "duration_formatted": "1:24",
          "descript_url": "https://share.descript.com/view/UJwFMzFL5RE",
          "word_count": 908
        }
      ]
    },
    {
      "slug": "25-Resilience & Partnership",
      "title": "Resilience & Partnership",
      "blurb": "",
      "module_count": 1,
      "total_sec": 77,
      "modules": [
        {
          "order": 1,
          "file": "letting-go-of-negative-expectations.md",
          "title": "Personal emergency anecdote: wife's cancer diagnosis response",
          "summary": "some of you may already know that my wife was recently diagnosed",
          "duration": 77,
          "duration_formatted": "1:17",
          "descript_url": "https://share.descript.com/view/IbBaLSQTKqa",
          "word_count": 212
        }
      ]
    }
  ]
};
