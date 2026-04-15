import { useMutation } from "convex/react";
import { Virtuoso } from "react-virtuoso";
import { api } from "../../convex/_generated/api";
import { KanbanCard } from "./KanbanCard";
import type { Doc } from "../../convex/_generated/dataModel";

const COLUMNS = [
  { status: "draft" as const, label: "Draft", color: "#C8943E", emptyMsg: "No drafts yet — create one above" },
  { status: "review" as const, label: "Review", color: "#7B8794", emptyMsg: "Drag posts here for review" },
  { status: "approved" as const, label: "Approved", color: "#4A9B6E", emptyMsg: "Approved posts appear here" },
  { status: "scheduled" as const, label: "Scheduled", color: "#5B7FD4", emptyMsg: "Schedule approved posts" },
  { status: "posted" as const, label: "Posted", color: "#1E1E1E", emptyMsg: "Published posts land here" },
];

interface Props {
  documents: Doc<"documents">[];
  onCardClick: (doc: Doc<"documents">) => void;
  childCounts?: Record<string, number>;
}

export function KanbanBoard({ documents, onCardClick, childCounts = {} }: Props) {
  const updateStatus = useMutation(api.documents.updateStatus);

  const handleDrop = async (
    docId: Doc<"documents">["_id"],
    newStatus: Doc<"documents">["status"]
  ) => {
    await updateStatus({ id: docId, status: newStatus, actor: "Charlie" });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add("column-drag-over");
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("column-drag-over");
  };

  const handleColumnDrop = (
    e: React.DragEvent,
    status: Doc<"documents">["status"]
  ) => {
    e.preventDefault();
    e.currentTarget.classList.remove("column-drag-over");
    const docId = e.dataTransfer.getData("text/plain");
    if (docId) {
      handleDrop(docId as Doc<"documents">["_id"], status);
    }
  };

  return (
    <div className="kanban-board">
      {COLUMNS.map((col) => {
        const columnDocs = documents.filter((d) => d.status === col.status);
        return (
          <div
            key={col.status}
            className="kanban-column"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleColumnDrop(e, col.status)}
          >
            <div className="column-header">
              <span
                className="column-dot"
                style={{ backgroundColor: col.color }}
              />
              <h2 className="column-title">{col.label}</h2>
              <span className="column-count">{columnDocs.length}</span>
            </div>
            <div className="column-body">
              {columnDocs.length === 0 ? (
                <div className="column-empty">{col.emptyMsg}</div>
              ) : (
                <Virtuoso
                  style={{ height: "100%" }}
                  data={columnDocs}
                  itemContent={(_index, doc) => (
                    <KanbanCard
                      document={doc}
                      onClick={() => onCardClick(doc)}
                      childCount={childCounts[doc._id] ?? 0}
                    />
                  )}
                  computeItemKey={(_index, doc) => doc._id}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
