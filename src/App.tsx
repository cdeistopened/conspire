import { useState } from "react";
import { useAction, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { KanbanBoard } from "./components/KanbanBoard";
import { NewPostModal } from "./components/NewPostModal";
import { DocumentPanel } from "./components/DocumentPanel";
import type { Doc } from "../convex/_generated/dataModel";

export function App() {
  const [showNewPost, setShowNewPost] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Doc<"documents"> | null>(null);
  const [creating, setCreating] = useState(false);
  const documents = useQuery(api.documents.listByStatus, {});
  const createWithProof = useAction(api.proof.createWithProof);

  const handleCreate = async (data: {
    title: string;
    platform: "x" | "linkedin" | "instagram" | "facebook" | "tiktok";
    body?: string;
  }) => {
    setCreating(true);
    try {
      await createWithProof({
        title: data.title,
        doc_type: "social_post",
        platform: data.platform,
        author: "Charlie",
        body: data.body,
      });
      setShowNewPost(false);
    } finally {
      setCreating(false);
    }
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
          <h1 className="logo">conspire</h1>
          <span className="tagline">breathe together</span>
        </div>
        <button className="btn-primary" onClick={() => setShowNewPost(true)}>
          + New Post
        </button>
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
          creating={creating}
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
