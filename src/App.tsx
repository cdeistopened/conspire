import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { KanbanBoard } from "./components/KanbanBoard";
import { NewPostModal } from "./components/NewPostModal";
import { DocumentPanel } from "./components/DocumentPanel";
import type { Doc } from "../convex/_generated/dataModel";

export function App() {
  const [showNewPost, setShowNewPost] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Doc<"documents"> | null>(null);
  const documents = useQuery(api.documents.listByStatus, {});
  const createDocument = useMutation(api.documents.create);

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
          <button className="header-nav-hint" aria-label="Navigation">
            <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M3 5h12M3 9h12M3 13h12" />
            </svg>
          </button>
          <div className="header-brand">
            <h1 className="logo">conspire</h1>
            <span className="tagline">breathe together</span>
          </div>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={() => setShowNewPost(true)}>
            + New Post
          </button>
        </div>
      </header>

      <main className="main">
        <KanbanBoard
          documents={documents ?? []}
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
