import { useEffect, useMemo, useRef, useState } from "react";
import { courseMindMastery, type CourseChapter, type CourseModule, type Course } from "../data/course-mind-mastery";
import { courseEmotionRegulation } from "../data/course-emotion-regulation";
import { courseBody } from "../data/course-body";
import { courseRelationships } from "../data/course-relationships";
import { coursePresenceLettingGo } from "../data/course-presence-letting-go";
import { coursePurposeMeaning } from "../data/course-purpose-meaning";
import { courseAgingWithPurpose } from "../data/course-aging-with-purpose";
import { courseHabits } from "../data/course-habits";
import { coursePsychedelicsHealing } from "../data/course-psychedelics-healing";

const COURSES: Record<string, Course> = {
  "mind-mastery": courseMindMastery,
  "emotion-regulation": courseEmotionRegulation,
  "body": courseBody,
  "relationships": courseRelationships,
  "presence-letting-go": coursePresenceLettingGo,
  "purpose-meaning": coursePurposeMeaning,
  "aging-with-purpose": courseAgingWithPurpose,
  "habits": courseHabits,
  "psychedelics-healing": coursePsychedelicsHealing,
};

const PILLAR_ORDER = [
  "mind-mastery",
  "emotion-regulation",
  "body",
  "relationships",
  "presence-letting-go",
  "purpose-meaning",
  "aging-with-purpose",
  "habits",
  "psychedelics-healing",
];

function loadWatched(pillar: string): Set<string> {
  try {
    const raw = window.localStorage.getItem(`course_watched_${pillar}`);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw));
  } catch {
    return new Set();
  }
}

function saveWatched(pillar: string, set: Set<string>) {
  window.localStorage.setItem(`course_watched_${pillar}`, JSON.stringify(Array.from(set)));
}

function fmt(sec: number) {
  return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;
}

function getInitialPillar(): string {
  const params = new URLSearchParams(window.location.search);
  const p = params.get("pillar");
  if (p && COURSES[p]) return p;
  return "mind-mastery";
}

export function CourseView() {
  const [pillar, setPillar] = useState<string>(() => getInitialPillar());
  const course = COURSES[pillar];

  const flat = useMemo<Array<{ chapter: CourseChapter; module: CourseModule; globalIndex: number }>>(() => {
    const rows: Array<{ chapter: CourseChapter; module: CourseModule; globalIndex: number }> = [];
    let i = 0;
    for (const ch of course.chapters) {
      for (const m of ch.modules) {
        rows.push({ chapter: ch, module: m, globalIndex: i });
        i += 1;
      }
    }
    return rows;
  }, [course]);

  const [watched, setWatched] = useState<Set<string>>(() => loadWatched(pillar));
  const [activeIndex, setActiveIndex] = useState<number>(() => {
    const params = new URLSearchParams(window.location.search);
    const m = params.get("module");
    if (m) {
      const idx = flat.findIndex((r) => r.module.file === m);
      if (idx >= 0) return idx;
    }
    return 0;
  });

  // Re-load watched + reset index when pillar changes
  useEffect(() => {
    setWatched(loadWatched(pillar));
    setActiveIndex(0);
    const url = new URL(window.location.href);
    url.searchParams.set("pillar", pillar);
    url.searchParams.delete("module");
    window.history.replaceState({}, "", url.toString());
  }, [pillar]);

  const active = flat[activeIndex];
  const embedSrc = active?.module.descript_url?.replace("/view/", "/embed/") ?? null;

  const sidebarRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sidebarRef.current?.querySelector<HTMLElement>(`[data-file="${active?.module.file}"]`);
    if (el) el.scrollIntoView({ block: "nearest", behavior: "smooth" });
    const url = new URL(window.location.href);
    url.searchParams.set("pillar", pillar);
    url.searchParams.set("module", active?.module.file ?? "");
    window.history.replaceState({}, "", url.toString());
  }, [activeIndex, active?.module.file, pillar]);

  const toggleWatched = (file: string) => {
    const next = new Set(watched);
    if (next.has(file)) next.delete(file);
    else next.add(file);
    setWatched(next);
    saveWatched(pillar, next);
  };

  const prev = () => setActiveIndex((i) => Math.max(0, i - 1));
  const next = () => setActiveIndex((i) => Math.min(flat.length - 1, i + 1));

  const totalWatched = flat.filter((r) => watched.has(r.module.file)).length;

  return (
    <div className="course-view">
      <div className="course-sidebar" ref={sidebarRef}>
        <div className="course-sidebar-header">
          <div className="course-pillar-picker">
            <label className="course-pillar-label">Pillar</label>
            <select
              className="course-pillar-select"
              value={pillar}
              onChange={(e) => setPillar(e.target.value)}
            >
              {PILLAR_ORDER.map((p) => (
                <option key={p} value={p}>
                  {COURSES[p].title} ({COURSES[p].total_modules})
                </option>
              ))}
            </select>
          </div>
          <h2 className="course-title">{course.title}</h2>
          <p className="course-tagline">{course.tagline}</p>
          <div className="course-progress">
            <div className="course-progress-bar">
              <div
                className="course-progress-fill"
                style={{ width: `${(totalWatched / flat.length) * 100}%` }}
              />
            </div>
            <span className="course-progress-label">
              {totalWatched} / {flat.length} watched · {course.total_formatted}
            </span>
          </div>
        </div>
        {course.chapters.map((ch) => {
          const chWatched = ch.modules.filter((m) => watched.has(m.file)).length;
          return (
            <section key={ch.slug} className="course-chapter">
              <header className="course-chapter-header">
                <span className="course-chapter-title">{ch.title}</span>
                <span className="course-chapter-meta">
                  {chWatched}/{ch.module_count} · {fmt(ch.total_sec)}
                </span>
              </header>
              <div className="course-module-list">
                {ch.modules.map((m) => {
                  const isActive = flat[activeIndex]?.module.file === m.file;
                  const isWatched = watched.has(m.file);
                  return (
                    <button
                      key={m.file}
                      data-file={m.file}
                      className={`course-module-item ${isActive ? "active" : ""} ${isWatched ? "watched" : ""}`}
                      onClick={() => {
                        const idx = flat.findIndex((r) => r.module.file === m.file);
                        if (idx >= 0) setActiveIndex(idx);
                      }}
                    >
                      <span className="course-module-check">{isWatched ? "✓" : "○"}</span>
                      <span className="course-module-label">
                        <span className="course-module-title">{m.title}</span>
                        <span className="course-module-dur">{m.duration_formatted || fmt(m.duration)}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      <div className="course-player">
        {active ? (
          <>
            <div className="course-player-meta">
              <div className="course-player-chapter">{active.chapter.title}</div>
              <h1 className="course-player-title">{active.module.title}</h1>
              <p className="course-player-summary">{active.module.summary}</p>
            </div>

            <div className="course-player-embed">
              {embedSrc ? (
                <iframe
                  src={embedSrc}
                  title={active.module.title}
                  className="course-player-iframe"
                  allow="autoplay; fullscreen"
                />
              ) : (
                <div className="course-player-placeholder">
                  No Descript URL for this module. Source file: {active.module.file}
                </div>
              )}
            </div>

            <div className="course-player-controls">
              <button
                className="btn-ghost"
                onClick={prev}
                disabled={activeIndex === 0}
              >
                ← Previous
              </button>
              <button
                className={`btn-action ${watched.has(active.module.file) ? "btn-action-scheduled" : ""}`}
                onClick={() => toggleWatched(active.module.file)}
              >
                {watched.has(active.module.file) ? "✓ Watched" : "Mark watched"}
              </button>
              <button
                className="btn-primary"
                onClick={next}
                disabled={activeIndex === flat.length - 1}
              >
                Next →
              </button>
            </div>
          </>
        ) : (
          <div className="course-player-placeholder">Pick a module from the sidebar.</div>
        )}
      </div>
    </div>
  );
}
