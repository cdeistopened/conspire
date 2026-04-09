import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { KanbanBoard } from "./components/KanbanBoard";
import { NewPostModal } from "./components/NewPostModal";
import { DocumentPanel } from "./components/DocumentPanel";
import type { Doc } from "../convex/_generated/dataModel";

type ViewFilter = "all" | "social" | "blog" | "newsletter";

const VIEW_FILTERS: { key: ViewFilter; label: string; docTypes: string[] }[] = [
  { key: "all", label: "All Posts", docTypes: [] },
  { key: "social", label: "Social Media", docTypes: ["social_post"] },
  { key: "blog", label: "Blog / SEO", docTypes: ["blog_draft"] },
  { key: "newsletter", label: "Newsletter", docTypes: ["newsletter"] },
];

export function App() {
  const [showNewPost, setShowNewPost] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Doc<"documents"> | null>(null);
  const [showNav, setShowNav] = useState(false);
  const [activeView, setActiveView] = useState<ViewFilter>("all");
  const documents = useQuery(api.documents.listByStatus, {});
  const createDocument = useMutation(api.documents.create);

  const filteredDocuments = documents?.filter((d) => {
    if (activeView === "all") return true;
    const filter = VIEW_FILTERS.find((f) => f.key === activeView);
    return filter ? filter.docTypes.includes(d.doc_type) : true;
  }) ?? [];

  const handleCreate = async (data: {
    title: string;
    platform: "x" | "linkedin" | "instagram" | "facebook" | "tiktok";
    body?: string;
  }) => {
    await createDocument({
      title: data.title,
      doc_type: "social_post",
      platform: data.platform,
      author: "Charlie",
      body: data.body,
    });
    setShowNewPost(false);
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
            <h1 className="logo">conspire</h1>
            <span className="tagline">
              {activeView === "all" ? "breathe together" : VIEW_FILTERS.find(f => f.key === activeView)?.label}
            </span>
          </div>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={() => setShowNewPost(true)}>
            + New Post
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
                className={`nav-item ${activeView === f.key ? "active" : ""}`}
                onClick={() => {
                  setActiveView(f.key);
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
          </div>
        </nav>
      )}

      <main className="main">
        <KanbanBoard
          documents={filteredDocuments}
          onCardClick={handleCardClick}
        />
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
