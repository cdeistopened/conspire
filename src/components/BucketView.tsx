import { useEffect, useMemo, useState } from "react";
import { Virtuoso } from "react-virtuoso";
import { BucketCard } from "./BucketCard";
import type { Doc } from "../../convex/_generated/dataModel";

// Canonical pillar order (most-populated first) + optional "unclassified"
// bucket at the end for docs with no pillar:* tag.
const PILLAR_ORDER = [
  "mind-mastery",
  "emotion-regulation",
  "presence-letting-go",
  "body",
  "relationships",
  "aging-with-purpose",
  "purpose-meaning",
  "habits",
  "psychedelics-healing",
  "crisis-response",
  "therapy-process",
];

const PILLAR_LABELS: Record<string, string> = {
  "mind-mastery": "Mind Mastery",
  "emotion-regulation": "Emotion Regulation",
  "presence-letting-go": "Presence & Letting Go",
  "body": "Body",
  "relationships": "Relationships",
  "aging-with-purpose": "Aging with Purpose",
  "purpose-meaning": "Purpose & Meaning",
  "habits": "Habits",
  "psychedelics-healing": "Psychedelics & Healing",
  "crisis-response": "Crisis Response",
  "therapy-process": "Therapy Process",
  "unclassified": "Unclassified",
};

const PILLAR_COLORS: Record<string, string> = {
  "mind-mastery": "#C8943E",
  "emotion-regulation": "#D65C5C",
  "presence-letting-go": "#6BA48A",
  "body": "#A87E56",
  "relationships": "#B87AAA",
  "aging-with-purpose": "#E8A838",
  "purpose-meaning": "#6A8FC4",
  "habits": "#7B8794",
  "psychedelics-healing": "#9966CC",
  "crisis-response": "#8B3A3A",
  "therapy-process": "#5A7F8B",
  "unclassified": "#A0998C",
};

function extractPillar(doc: Doc<"documents">): string {
  const tag = doc.tags?.find((t) => t.startsWith("pillar:"));
  return tag ? tag.slice(7) : "unclassified";
}

interface Filters {
  pillar: string; // "all" or specific pillar slug
  status: string; // "all" or specific status
  hideAgeMention: boolean;
  hideNotRichard: boolean;
  hidePromo: boolean;
  search: string;
}

const DEFAULT_FILTERS: Filters = {
  pillar: "all",
  status: "all",
  hideAgeMention: false,
  hideNotRichard: true,
  hidePromo: true,
  search: "",
};

const FILTERS_KEY = "conspire_bucket_filters";

function loadFilters(): Filters {
  if (typeof window === "undefined") return DEFAULT_FILTERS;
  // URL params override localStorage
  const params = new URLSearchParams(window.location.search);
  const fromUrl: Partial<Filters> = {};
  if (params.get("pillar")) fromUrl.pillar = params.get("pillar")!;
  if (params.get("status")) fromUrl.status = params.get("status")!;
  if (params.get("q")) fromUrl.search = params.get("q")!;
  try {
    const saved = localStorage.getItem(FILTERS_KEY);
    if (saved) return { ...DEFAULT_FILTERS, ...JSON.parse(saved), ...fromUrl };
  } catch {}
  return { ...DEFAULT_FILTERS, ...fromUrl };
}

interface Props {
  documents: Doc<"documents">[];
  onCardClick: (doc: Doc<"documents">) => void;
}

export function BucketView({ documents, onCardClick }: Props) {
  const [filters, setFilters] = useState<Filters>(() => loadFilters());

  // Persist filters to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(FILTERS_KEY, JSON.stringify(filters));
    } catch {}
  }, [filters]);

  // Apply filters to the full document set
  const filteredDocs = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    return documents.filter((d) => {
      if (filters.status !== "all" && d.status !== filters.status) return false;
      const tags = d.tags ?? [];
      if (filters.hideAgeMention && tags.includes("flag:age-mention")) return false;
      if (filters.hideNotRichard && tags.includes("flag:not-richard")) return false;
      if (filters.hidePromo && tags.includes("flag:promo")) return false;
      if (filters.pillar !== "all") {
        const pillar = extractPillar(d);
        if (pillar !== filters.pillar) return false;
      }
      if (q) {
        const hay = (
          (d.title ?? "") +
          " " +
          (d.body ?? "") +
          " " +
          (d.notes ?? "")
        ).toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [documents, filters]);

  // Group by pillar
  const buckets = useMemo(() => {
    const groups = new Map<string, Doc<"documents">[]>();
    for (const doc of filteredDocs) {
      const pillar = extractPillar(doc);
      if (!groups.has(pillar)) groups.set(pillar, []);
      groups.get(pillar)!.push(doc);
    }
    // Order: canonical pillar order, then unclassified, skipping empty buckets
    const ordered: Array<[string, Doc<"documents">[]]> = [];
    for (const p of PILLAR_ORDER) {
      if (groups.has(p)) ordered.push([p, groups.get(p)!]);
    }
    if (groups.has("unclassified")) {
      ordered.push(["unclassified", groups.get("unclassified")!]);
    }
    return ordered;
  }, [filteredDocs]);

  const totalShown = filteredDocs.length;
  const totalAll = documents.length;

  return (
    <div className="bucket-view">
      <BucketFilterBar
        filters={filters}
        setFilters={setFilters}
        totalShown={totalShown}
        totalAll={totalAll}
      />
      <div className="bucket-grid">
        {buckets.length === 0 ? (
          <div className="bucket-empty">
            No clips match the current filters. Try relaxing them.
          </div>
        ) : (
          buckets.map(([pillar, docs]) => (
            <div key={pillar} className="bucket-column">
              <div className="bucket-column-header">
                <span
                  className="bucket-column-dot"
                  style={{ backgroundColor: PILLAR_COLORS[pillar] ?? "#888" }}
                />
                <h2 className="bucket-column-title">
                  {PILLAR_LABELS[pillar] ?? pillar}
                </h2>
                <span className="bucket-column-count">{docs.length}</span>
              </div>
              <div className="bucket-column-body">
                <Virtuoso
                  style={{ height: "100%" }}
                  data={docs}
                  itemContent={(_index, doc) => (
                    <BucketCard document={doc} onClick={() => onCardClick(doc)} />
                  )}
                  computeItemKey={(_index, doc) => doc._id}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

interface FilterBarProps {
  filters: Filters;
  setFilters: (f: Filters) => void;
  totalShown: number;
  totalAll: number;
}

function BucketFilterBar({ filters, setFilters, totalShown, totalAll }: FilterBarProps) {
  return (
    <div className="bucket-filter-bar">
      <div className="bucket-filter-group">
        <input
          type="text"
          placeholder="Search title, body, notes…"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="bucket-filter-search"
        />
      </div>
      <div className="bucket-filter-group">
        <label>Pillar</label>
        <select
          value={filters.pillar}
          onChange={(e) => setFilters({ ...filters, pillar: e.target.value })}
        >
          <option value="all">All</option>
          {PILLAR_ORDER.map((p) => (
            <option key={p} value={p}>
              {PILLAR_LABELS[p]}
            </option>
          ))}
          <option value="unclassified">Unclassified</option>
        </select>
      </div>
      <div className="bucket-filter-group">
        <label>Status</label>
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="all">All</option>
          <option value="draft">Draft</option>
          <option value="review">Review</option>
          <option value="approved">Approved</option>
          <option value="scheduled">Scheduled</option>
          <option value="posted">Posted</option>
          <option value="archived">Archived</option>
        </select>
      </div>
      <div className="bucket-filter-group">
        <label className="bucket-filter-checkbox">
          <input
            type="checkbox"
            checked={filters.hideAgeMention}
            onChange={(e) =>
              setFilters({ ...filters, hideAgeMention: e.target.checked })
            }
          />
          Hide age-mention
        </label>
        <label className="bucket-filter-checkbox">
          <input
            type="checkbox"
            checked={filters.hideNotRichard}
            onChange={(e) =>
              setFilters({ ...filters, hideNotRichard: e.target.checked })
            }
          />
          Hide guest
        </label>
        <label className="bucket-filter-checkbox">
          <input
            type="checkbox"
            checked={filters.hidePromo}
            onChange={(e) =>
              setFilters({ ...filters, hidePromo: e.target.checked })
            }
          />
          Hide promo
        </label>
      </div>
      <div className="bucket-filter-count">
        {totalShown} / {totalAll}
      </div>
    </div>
  );
}
