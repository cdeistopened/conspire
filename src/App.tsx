import { useState, useEffect, useRef } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { KanbanBoard } from "./components/KanbanBoard";
import { NewPostModal } from "./components/NewPostModal";
import { DocumentPanel } from "./components/DocumentPanel";
import { ReviewView } from "./components/ReviewView";
import type { Doc, Id } from "../convex/_generated/dataModel";
import { WORKSPACE } from "./workspace";

// Read view mode from URL: ?view=review activates the vertical review board
function readViewMode(): "kanban" | "review" {
  if (typeof window === "undefined") return "kanban";
  const params = new URLSearchParams(window.location.search);
  return params.get("view") === "review" ? "review" : "kanban";
}

type ViewFilter = "all" | "social" | "video" | "podcast" | "blog" | "newsletter";

// View filters are static across workspaces; each workspace just surfaces
// the subset it cares about via WORKSPACE.docTypes below.
const ALL_VIEW_FILTERS: { key: ViewFilter; label: string; docTypes: string[] }[] = [
  { key: "all", label: "All Content", docTypes: [] },
  { key: "social", label: "Social Posts", docTypes: ["social_post"] },
  { key: "video", label: "Short-Form Video", docTypes: ["short_form_video"] },
  { key: "podcast", label: "Podcast / YouTube", docTypes: ["podcast"] },
  { key: "blog", label: "Blog / SEO", docTypes: ["blog_draft"] },
  { key: "newsletter", label: "Newsletter", docTypes: ["newsletter"] },
];

// Only show view filters for doc types this workspace actually uses, in the
// workspace's own priority order. "all" always comes first.
const VIEW_FILTERS = [
  ALL_VIEW_FILTERS[0],
  ...WORKSPACE.docTypes
    .map((dt) => ALL_VIEW_FILTERS.find((f) => f.docTypes[0] === dt))
    .filter((f): f is (typeof ALL_VIEW_FILTERS)[number] => f !== undefined),
];

export function App() {
  const [showNewPost, setShowNewPost] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Doc<"documents"> | null>(null);
  const [showNav, setShowNav] = useState(false);
  const [activeView, setActiveView] = useState<ViewFilter>("all");
  const [pendingOpenId, setPendingOpenId] = useState<Id<"documents"> | null>(null);
  const [viewMode, setViewMode] = useState<"kanban" | "review">(readViewMode());
  const documents = useQuery(api.documents.listByStatus, { workspace: WORKSPACE.name });
  const createDocument = useMutation(api.documents.create);

  // Auto-open newly created doc once Convex delivers it
  useEffect(() => {
    if (pendingOpenId && documents) {
      const found = documents.find((d) => d._id === pendingOpenId);
      if (found) {
        setSelectedDoc(found);
        setPendingOpenId(null);
      }
    }
  }, [pendingOpenId, documents]);

  const filteredDocuments = documents?.filter((d) => {
    if (activeView === "all") return true;
    const filter = VIEW_FILTERS.find((f) => f.key === activeView);
    return filter ? filter.docTypes.includes(d.doc_type) : true;
  }) ?? [];

  const handleCreate = async (data: {
    title: string;
    doc_type: string;
    body?: string;
  }) => {
    const docId = await createDocument({
      title: data.title,
      doc_type: data.doc_type as any,
      author: WORKSPACE.defaultAuthor,
      body: data.body,
      workspace: WORKSPACE.name,
    });
    setShowNewPost(false);
    setPendingOpenId(docId);
  };

  const handleCardClick = (doc: Doc<"documents">) => {
    setSelectedDoc(doc);
  };

  // Keep selected doc fresh as Convex updates
  const freshSelectedDoc = selectedDoc
    ? documents?.find((d) => d._id === selectedDoc._id) ?? selectedDoc
    : null;

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <button className="header-nav-hint" aria-label="Navigation" onClick={() => setShowNav((n) => !n)}>
            <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M3 5h12M3 9h12M3 13h12" />
            </svg>
          </button>
          <div className="header-brand">
            <h1 className="logo">{WORKSPACE.displayName}</h1>
            <span className="tagline">
              {activeView === "all" ? WORKSPACE.tagline : VIEW_FILTERS.find(f => f.key === activeView)?.label}
            </span>
          </div>
        </div>
        <div className="header-actions">
          <button
            className="btn-ghost"
            onClick={() => {
              const next = viewMode === "review" ? "kanban" : "review";
              setViewMode(next);
              const url = new URL(window.location.href);
              if (next === "review") url.searchParams.set("view", "review");
              else url.searchParams.delete("view");
              window.history.replaceState({}, "", url.toString());
            }}
            title="Toggle review mode"
          >
            {viewMode === "review" ? "Kanban" : "Review"}
          </button>
          <button className="btn-primary" onClick={() => setShowNewPost(true)}>
            + New
          </button>
        </div>
      </header>

      {showNav && (
        <nav className="nav-sidebar" onClick={() => setShowNav(false)}>
          <div className="nav-panel" onClick={(e) => e.stopPropagation()}>
            <div className="nav-section-label">Views</div>
            {VIEW_FILTERS.map((f) => (
              <button
                key={f.key}
                className={`nav-item ${activeView === f.key && viewMode === "kanban" ? "active" : ""}`}
                onClick={() => {
                  setActiveView(f.key);
                  if (viewMode === "review") {
                    setViewMode("kanban");
                    const url = new URL(window.location.href);
                    url.searchParams.delete("view");
                    window.history.replaceState({}, "", url.toString());
                  }
                  setShowNav(false);
                }}
              >
                {f.label}
                <span className="nav-count">
                  {f.key === "all"
                    ? documents?.length ?? 0
                    : documents?.filter((d) => f.docTypes.includes(d.doc_type)).length ?? 0}
                </span>
              </button>
            ))}
            <div className="nav-section-label nav-section-label-spacer">Modes</div>
            <button
              className={`nav-item ${viewMode === "kanban" ? "active" : ""}`}
              onClick={() => {
                setViewMode("kanban");
                const url = new URL(window.location.href);
                url.searchParams.delete("view");
                window.history.replaceState({}, "", url.toString());
                setShowNav(false);
              }}
            >
              Kanban
            </button>
            <button
              className={`nav-item ${viewMode === "review" ? "active" : ""}`}
              onClick={() => {
                setViewMode("review");
                const url = new URL(window.location.href);
                url.searchParams.set("view", "review");
                window.history.replaceState({}, "", url.toString());
                setShowNav(false);
              }}
            >
              Review board
              <span className="nav-count">
                {documents?.filter((d) => d.doc_type === "short_form_video").length ?? 0}
              </span>
            </button>
          </div>
        </nav>
      )}

      <main className="main">
        {viewMode === "review" ? (
          <ReviewView
            onExit={() => {
              setViewMode("kanban");
              const url = new URL(window.location.href);
              url.searchParams.delete("view");
              window.history.replaceState({}, "", url.toString());
            }}
          />
        ) : (
          <KanbanBoard
            documents={filteredDocuments}
            onCardClick={handleCardClick}
          />
        )}
      </main>

      {showNewPost && (
        <NewPostModal
          onClose={() => setShowNewPost(false)}
          onCreate={handleCreate}
        />
      )}

      {freshSelectedDoc && (
        <DocumentPanel
          document={freshSelectedDoc}
          onClose={() => setSelectedDoc(null)}
        />
      )}
    </div>
  );
}
