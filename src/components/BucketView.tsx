import { useEffect, useMemo, useState } from "react";
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

const PILLAR_DESCRIPTIONS: Record<string, string> = {
  "mind-mastery": "Self-talk, thought control, rumination, reframing",
  "emotion-regulation": "Anxiety, anger, fear, grief, sadness, shame",
  "presence-letting-go": "Being in the now, meditation, acceptance, conscious breathing",
  "body": "Nutrition, sleep, exercise, physical health",
  "relationships": "Isolation, marriage, communication, forgiveness, trust",
  "aging-with-purpose": "Longevity, wisdom of years, intentional age as authority",
  "purpose-meaning": "Calling, values, service, contribution",
  "habits": "Morning routines, journaling, daily practices, screens",
  "psychedelics-healing": "Medicine journeys, psychedelic therapy, integration",
  "crisis-response": "Illness, loss, trauma, adversity, resilience",
  "therapy-process": "Psychotherapy as practice, therapist-patient dynamics",
  "unclassified": "Clips without a primary pillar yet",
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
  status: string;
  hideAgeMention: boolean;
  hideNotRichard: boolean;
  hidePromo: boolean;
  search: string;
  tagFilter: string;
}

const DEFAULT_FILTERS: Filters = {
  status: "all",
  hideAgeMention: false,
  hideNotRichard: true,
  hidePromo: true,
  search: "",
  tagFilter: "",
};

const FILTERS_KEY = "conspire_bucket_filters";
const PAGE_SIZE = 10;

function loadFilters(): Filters {
  if (typeof window === "undefined") return DEFAULT_FILTERS;
  try {
    const saved = localStorage.getItem(FILTERS_KEY);
    if (saved) return { ...DEFAULT_FILTERS, ...JSON.parse(saved) };
  } catch {}
  return DEFAULT_FILTERS;
}

function readPillarFromUrl(): string | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  return params.get("pillar");
}

function setPillarInUrl(pillar: string | null) {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  if (pillar) url.searchParams.set("pillar", pillar);
  else url.searchParams.delete("pillar");
  window.history.replaceState({}, "", url.toString());
}

interface Props {
  documents: Doc<"documents">[];
  onCardClick: (doc: Doc<"documents">) => void;
}

export function BucketView({ documents, onCardClick }: Props) {
  const [filters, setFilters] = useState<Filters>(() => loadFilters());
  const [selectedPillar, setSelectedPillar] = useState<string | null>(() =>
    readPillarFromUrl()
  );
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Persist filters
  useEffect(() => {
    try {
      localStorage.setItem(FILTERS_KEY, JSON.stringify(filters));
    } catch {}
  }, [filters]);

  // Sync pillar selection to URL
  useEffect(() => {
    setPillarInUrl(selectedPillar);
    setVisibleCount(PAGE_SIZE); // reset pagination when switching pillars
  }, [selectedPillar]);

  // Filters applied to the full document set
  const filteredDocs = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    const tagQ = filters.tagFilter.trim().toLowerCase();
    return documents.filter((d) => {
      if (filters.status !== "all" && d.status !== filters.status) return false;
      const tags = d.tags ?? [];
      if (filters.hideAgeMention && tags.includes("flag:age-mention")) return false;
      if (filters.hideNotRichard && tags.includes("flag:not-richard")) return false;
      if (filters.hidePromo && tags.includes("flag:promo")) return false;
      if (tagQ) {
        const hasMatch = tags.some((t) => t.toLowerCase().includes(tagQ));
        if (!hasMatch) return false;
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

  // Pillar counts (post-filter)
  const pillarCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const doc of filteredDocs) {
      const p = extractPillar(doc);
      counts[p] = (counts[p] ?? 0) + 1;
    }
    return counts;
  }, [filteredDocs]);

  // In detail mode, list the docs for the selected pillar
  const pillarDocs = useMemo(() => {
    if (!selectedPillar) return [];
    return filteredDocs
      .filter((d) => extractPillar(d) === selectedPillar)
      .sort((a, b) => b._creationTime - a._creationTime);
  }, [filteredDocs, selectedPillar]);

  const totalShown = filteredDocs.length;
  const totalAll = documents.length;

  return (
    <div className="bucket-view">
      <BucketFilterBar
        filters={filters}
        setFilters={setFilters}
        totalShown={totalShown}
        totalAll={totalAll}
        selectedPillar={selectedPillar}
        onBack={() => setSelectedPillar(null)}
      />
      {selectedPillar ? (
        <BucketDetail
          pillar={selectedPillar}
          docs={pillarDocs}
          visibleCount={visibleCount}
          onLoadMore={() => setVisibleCount((v) => v + PAGE_SIZE)}
          onCardClick={onCardClick}
        />
      ) : (
        <BucketIndex
          pillarCounts={pillarCounts}
          onSelect={setSelectedPillar}
        />
      )}
    </div>
  );
}

// ── Index view: 11 pillar tiles ─────────────────────────────────────

interface IndexProps {
  pillarCounts: Record<string, number>;
  onSelect: (pillar: string) => void;
}

function BucketIndex({ pillarCounts, onSelect }: IndexProps) {
  // Include all canonical pillars (even if empty) + unclassified if any
  const tiles = [
    ...PILLAR_ORDER.map((p) => ({ pillar: p, count: pillarCounts[p] ?? 0 })),
    ...(pillarCounts["unclassified"]
      ? [{ pillar: "unclassified", count: pillarCounts["unclassified"] }]
      : []),
  ];

  return (
    <div className="bucket-index">
      {tiles.map(({ pillar, count }) => (
        <button
          key={pillar}
          className="bucket-tile"
          onClick={() => onSelect(pillar)}
          disabled={count === 0}
          style={{ "--tile-accent": PILLAR_COLORS[pillar] ?? "#888" } as React.CSSProperties}
        >
          <div className="bucket-tile-header">
            <span className="bucket-tile-dot" />
            <h2 className="bucket-tile-title">{PILLAR_LABELS[pillar] ?? pillar}</h2>
            <span className="bucket-tile-count">{count}</span>
          </div>
          <p className="bucket-tile-description">
            {PILLAR_DESCRIPTIONS[pillar] ?? ""}
          </p>
          <div className="bucket-tile-cta">
            {count === 0 ? "(empty)" : `Browse ${count} clip${count === 1 ? "" : "s"} →`}
          </div>
        </button>
      ))}
    </div>
  );
}

// ── Detail view: paginated list for one pillar ──────────────────────

interface DetailProps {
  pillar: string;
  docs: Doc<"documents">[];
  visibleCount: number;
  onLoadMore: () => void;
  onCardClick: (doc: Doc<"documents">) => void;
}

function BucketDetail({ pillar, docs, visibleCount, onLoadMore, onCardClick }: DetailProps) {
  const visible = docs.slice(0, visibleCount);
  const hasMore = visibleCount < docs.length;

  return (
    <div className="bucket-detail">
      <div className="bucket-detail-header">
        <span
          className="bucket-detail-dot"
          style={{ backgroundColor: PILLAR_COLORS[pillar] ?? "#888" }}
        />
        <h2 className="bucket-detail-title">{PILLAR_LABELS[pillar] ?? pillar}</h2>
        <span className="bucket-detail-count">
          {visible.length} of {docs.length}
        </span>
      </div>
      {docs.length === 0 ? (
        <div className="bucket-detail-empty">
          No clips in this pillar match the current filters.
        </div>
      ) : (
        <div className="bucket-detail-list">
          {visible.map((doc) => (
            <BucketCard
              key={doc._id}
              document={doc}
              onClick={() => onCardClick(doc)}
            />
          ))}
          {hasMore && (
            <button className="bucket-load-more" onClick={onLoadMore}>
              Show {Math.min(PAGE_SIZE, docs.length - visibleCount)} more ({docs.length - visibleCount} remaining)
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ── Filter bar ──────────────────────────────────────────────────────

interface FilterBarProps {
  filters: Filters;
  setFilters: (f: Filters) => void;
  totalShown: number;
  totalAll: number;
  selectedPillar: string | null;
  onBack: () => void;
}

function BucketFilterBar({
  filters,
  setFilters,
  totalShown,
  totalAll,
  selectedPillar,
  onBack,
}: FilterBarProps) {
  return (
    <div className="bucket-filter-bar">
      {selectedPillar && (
        <button className="bucket-back-btn" onClick={onBack} title="Back to all pillars">
          ← All pillars
        </button>
      )}
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
        <input
          type="text"
          placeholder="Tag filter (e.g. tier:top10)"
          value={filters.tagFilter}
          onChange={(e) => setFilters({ ...filters, tagFilter: e.target.value })}
          className="bucket-filter-search"
          title="Matches any tag substring. Try: tier:top10, pillar:mind-mastery, cluster:mm-001"
        />
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
