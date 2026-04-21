import { useEffect, useMemo, useRef, useState } from "react";
import { courseMindMastery, type CourseChapter, type CourseModule } from "../data/course-mind-mastery";

const WATCHED_KEY = "course_watched_mind-mastery";

function loadWatched(): Set<string> {
  try {
    const raw = window.localStorage.getItem(WATCHED_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw));
  } catch {
    return new Set();
  }
}

function saveWatched(set: Set<string>) {
  window.localStorage.setItem(WATCHED_KEY, JSON.stringify(Array.from(set)));
}

function fmt(sec: number) {
  return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;
}

export function CourseView() {
  const course = courseMindMastery;
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

  const [watched, setWatched] = useState<Set<string>>(() => loadWatched());
  const [activeIndex, setActiveIndex] = useState<number>(() => {
    const params = new URLSearchParams(window.location.search);
    const m = params.get("module");
    if (m) {
      const idx = flat.findIndex((r) => r.module.file === m);
      if (idx >= 0) return idx;
    }
    return 0;
  });

  const active = flat[activeIndex];
  const embedSrc = active?.module.descript_url?.replace("/view/", "/embed/") ?? null;

  const sidebarRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sidebarRef.current?.querySelector<HTMLElement>(`[data-file="${active?.module.file}"]`);
    if (el) el.scrollIntoView({ block: "nearest", behavior: "smooth" });
    const url = new URL(window.location.href);
    url.searchParams.set("module", active?.module.file ?? "");
    window.history.replaceState({}, "", url.toString());
  }, [activeIndex, active?.module.file]);

  const toggleWatched = (file: string) => {
    const next = new Set(watched);
    if (next.has(file)) next.delete(file);
    else next.add(file);
    setWatched(next);
    saveWatched(next);
  };

  const prev = () => setActiveIndex((i) => Math.max(0, i - 1));
  const next = () => setActiveIndex((i) => Math.min(flat.length - 1, i + 1));

  const totalWatched = flat.filter((r) => watched.has(r.module.file)).length;

  return (
    <div className="course-view">
      <div className="course-sidebar" ref={sidebarRef}>
        <div className="course-sidebar-header">
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
