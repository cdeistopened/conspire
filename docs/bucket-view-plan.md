# Bucket View + Playlist Composer — Plan

**Date:** 2026-04-15
**Author:** Planning session with Charlie
**Status:** Draft — open questions at bottom, resolve before implementation

---

## Goal

Conspire has three view modes today: Kanban (status columns), Review (vertical variant triage). It's missing the view where a creator actually **works with their content library** — clustering by topic, filtering down to an evergreen subset, and assembling reusable sequences.

The Bucket view is that layer. The Playlist composer is what turns buckets into downstream artifacts (X threads, course modules, email drips, Instagram carousels).

**Concrete use case we're unblocking:** Charlie has 524 RLM clips in Conspire tagged with `pillar:<name>`. Today he can see them all in the Kanban but can't group them by pillar, filter to evergreen Richard-only, or assemble the top 10 mind-mastery clips into a thread. Bucket view + playlists close that gap.

---

## Current state (2026-04-15)

**Works:**
- Kanban view with 5 status columns, drag-to-move-status, cards showing platform/parent/tags
- Review view for short-form videos (vertical feed with embed + variants + star picker)
- `documents` table has `tags: string[]`, indexed filters in query, `doc_type` enum
- 524 RLM docs imported, all tagged with `pillar:<primary>`, `sub:<secondary>`, `flag:age-mention`, `flag:promo`, `flag:not-richard`, `source:<origin>`, `series:<project-slug>`

**Doesn't work / doesn't exist:**
- No way to group docs by anything except `status` (Kanban) or `doc_type` (nav filter)
- No pillar-aware filters
- No duration field in the Convex schema (duration lives in the source markdown but wasn't imported)
- No doc_type for playlists, no way to order a sequence of clips as a reusable artifact
- No multi-select on cards
- No bulk actions

---

## The taxonomy Bucket view depends on

Every RLM clip is tagged like this:

```
tags: [
  "pillar:mind-mastery",       // primary (one per doc)
  "sub:presence-letting-go",   // secondary (0-3)
  "sub:emotion-regulation",
  "flag:age-mention",           // 0+
  "source:instagram-clips",     // one
  "series:all"                  // one
]
```

The 11 pillars (distribution from the 524 imported RLM clips):
- mind-mastery (90), emotion-regulation (76), body (58), presence-letting-go (55), relationships (38), aging-with-purpose (36), purpose-meaning (36), habits (15), psychedelics-healing (14), crisis-response (11), therapy-process (4)

Bucket view needs to read `pillar:*` out of the tags array (client-side string parsing), and optionally support the same pattern for OpenEd once that workspace gets its own pillar taxonomy.

---

## Phases

### Phase 1 — Bucket view MVP (read-only grouping, no writes)

**Scope:** New third view mode alongside Kanban and Review. Grid of cards grouped by primary pillar. Click a card to open the existing DocumentPanel. No drag, no re-tagging, no multi-select. Ship it, learn from use.

**New files:**
- `src/components/BucketView.tsx` — the main component
- `src/components/BucketCard.tsx` — per-clip card (compact version of KanbanCard)

**Changes to existing files:**
- `src/App.tsx` — add `"bucket"` to `viewMode` union, add toggle button in header, add nav entry in hamburger Modes section, sync with `?view=bucket` URL param
- Reuse `useQuery(api.documents.listByStatus)` — no new backend query needed for MVP

**Component sketch:**

```tsx
function BucketView({ documents, onCardClick, workspaceName }) {
  // Parse pillar from tags — "pillar:mind-mastery" → "mind-mastery"
  const buckets = useMemo(() => {
    const groups = new Map<string, Doc[]>();
    for (const doc of documents) {
      const pillarTag = doc.tags?.find(t => t.startsWith("pillar:"));
      const pillar = pillarTag ? pillarTag.slice(7) : "unclassified";
      if (!groups.has(pillar)) groups.set(pillar, []);
      groups.get(pillar)!.push(doc);
    }
    return [...groups.entries()].sort((a, b) => b[1].length - a[1].length);
  }, [documents]);

  return (
    <div className="bucket-view">
      <BucketFilterBar filters={filters} setFilters={setFilters} />
      <div className="bucket-grid">
        {buckets.map(([pillar, docs]) => (
          <BucketColumn key={pillar} pillar={pillar} docs={applyFilters(docs, filters)} onCardClick={onCardClick} />
        ))}
      </div>
    </div>
  );
}
```

**Card shape (BucketCard):**
- Title (truncated to 2 lines)
- Summary (truncated to 2 lines, pulled from `body` or a future `summary` field)
- Duration badge (if available — see duration question below)
- Secondary pillar chips (1-3)
- Flag icons: ⚠️ age-mention, 🏷️ promo, 👥 not-richard
- Platform icon (if set)

**Filter bar (Phase 1 minimum):**
- Text search (title + body substring match)
- Pillar dropdown (filter to one specific pillar, or "all")
- Status dropdown (review / draft / approved / all — default "review" for the useful subset)
- Age-mention toggle (☐ Hide age-mentioned clips) — default checked
- Not-Richard toggle (☐ Hide guest clips) — default checked

Filters live in React state. Persist to localStorage so next visit remembers.

**Estimated work:** 3-4 hours for the MVP. Single feature branch. No backend changes.

---

### Phase 2 — Duration data + richer filters

**Problem:** Duration isn't in the Convex schema. The import script didn't send it. For reel sweet-spot filtering (31-90 seconds is the magic range), we need it.

**Two options:**

**Option A:** Add `duration` as an optional field on `documents` schema.
- Pro: Proper typed field, indexable, queryable
- Con: Schema migration, re-import the 524 clips to populate it

**Option B:** Encode duration as a tag: `duration-bucket:sweet-spot` (31-60s), `duration-bucket:long-reel` (61-90s), `duration-bucket:punch` (0-30s), etc.
- Pro: No schema change, one-line addition to import script
- Con: Discrete buckets only, no per-second filtering, tag noise

**Recommendation: Option B for v2.** Pre-bucket on import, iterate later if we need finer resolution.

**New filters unlocked:**
- ☐ Reel sweet spot (31-90s)
- ☐ Long-form only (>90s)
- ☐ Punch / short (0-30s)

Re-run the RLM import with the new duration-bucket tags. ~10 minutes.

---

### Phase 3 — Multi-select + bulk actions

**Scope:** Add checkbox state to BucketCard, render a floating action bar when anything is selected, support bulk operations.

**Operations:**
- "Add to playlist" (opens Phase 4 modal)
- "Move to draft / review / approved / archived" (bulk status update)
- "Add tag" (for ad-hoc tagging — e.g. mark 10 clips `flag:curated` for a specific sprint)
- "Remove tag"

**New mutation:** `documents:bulkUpdateTags` in `convex/documents.ts`
```ts
args: {
  ids: v.array(v.id("documents")),
  addTags: v.optional(v.array(v.string())),
  removeTags: v.optional(v.array(v.string())),
  status: v.optional(STATUS_VALIDATOR),
}
```

Keep it simple — one mutation does all three.

---

### Phase 4 — Playlist composer

**Schema addition:**

Add to `documents` table:
```ts
clip_ids: v.optional(v.array(v.id("documents"))),
playlist_purpose: v.optional(
  v.union(
    v.literal("course_module"),
    v.literal("x_thread"),
    v.literal("instagram_carousel"),
    v.literal("email_drip"),
    v.literal("youtube_compilation"),
    v.literal("note")   // generic ordered sequence with no export target
  )
),
```

Add `"playlist"` to the `doc_type` enum.

**Why store clip_ids on the document itself and not a separate join table:**
- Denormalized, but playlists are small (typically 5-15 clips, max ~50)
- Preserves order natively (array index = sequence)
- One read to fetch the playlist + its clips
- Easy to reorder (just update the array)
- A clip can belong to multiple playlists (each playlist just references it)

**New mutations:**
- `documents:createPlaylist` — takes title, purpose, initial clip_ids
- `documents:updatePlaylistClips` — replace the clip_ids array (used for add/remove/reorder)

**New UI:**
- New view mode `"playlists"` OR a side panel inside BucketView
  - **Recommendation:** side panel in BucketView. Keeps the context — you're looking at your library on the left, assembling a playlist on the right. A separate view mode means constant back-and-forth.
- Left side: Bucket grid (existing)
- Right side panel (collapsible): currently-editing playlist
  - Title + purpose dropdown at top
  - Ordered list of clip rows (drag handle, clip title, remove button)
  - "Drop clips here" zone
  - Save / Export buttons
- Header has a playlist picker dropdown: "Select playlist to edit... | + New playlist"

**Playlists in Kanban?** Playlists have a status like any doc — they flow through draft → review → approved → scheduled → posted. They show up in Kanban like any card but have a distinct card style (list icon, count of clips). Click a playlist card in Kanban and it opens the composer panel.

---

### Phase 5 — Exports

Each playlist purpose gets an export action. These are **copy-to-clipboard or download** outputs, not auto-publishers (FeedHive does the publishing, which is a separate brief).

**`x_thread`** → Markdown block:
```
1/ <first clip summary>
   <descript share URL>

2/ <second clip summary>
   <descript share URL>

...
```
Copy to clipboard, Charlie pastes into X's composer.

**`instagram_carousel`** → JSON payload for FeedHive carousel post (handoff to FeedHive once that integration is live). Slides: each clip's thumbnail + summary + hook.

**`course_module`** → Markdown outline:
```
# Module: <playlist title>

## Lesson 1: <clip 1 title>
<clip summary>
Video: <descript URL>

...
```
Download as `.md` or copy to clipboard.

**`email_drip`** → One email per clip, sequenced for Beehiiv drip import. Format TBD (depends on Beehiiv's import schema).

**`youtube_compilation`** → Script outline for stitching clips together manually in Descript or another editor. Lists clip IDs, titles, durations, cut points. Not a rendered video — just the assembly plan.

---

### Phase 6 — Drag-to-retag in Bucket view (optional, after playlists work)

**The move:** drag a card from one pillar column to another, and the drop automatically updates its `pillar:<new>` tag.

**Complexity:**
- Need a mutation that removes the old `pillar:*` tag and adds the new one atomically
- Need optimistic UI update so the card visually jumps immediately
- Risk: accidental drags destroying classifier work. Require a confirmation? Use a "re-tag mode" toggle?

**My vote: skip for v1.** Re-tagging is a rare operation — happens when the classifier was wrong. A right-click context menu with "Change pillar..." is safer than drag. Build that instead of drag-to-retag.

---

## Schema changes required (all of them in one place)

```ts
// convex/schema.ts
documents: defineTable({
  // ...existing fields...

  // NEW — for playlist doc_type
  clip_ids: v.optional(v.array(v.id("documents"))),
  playlist_purpose: v.optional(
    v.union(
      v.literal("course_module"),
      v.literal("x_thread"),
      v.literal("instagram_carousel"),
      v.literal("email_drip"),
      v.literal("youtube_compilation"),
      v.literal("note")
    )
  ),
})

// Also add "playlist" to doc_type enum
doc_type: v.union(
  v.literal("social_post"),
  v.literal("short_form_video"),
  v.literal("blog_draft"),
  v.literal("podcast"),
  v.literal("newsletter"),
  v.literal("note"),
  v.literal("playlist"),   // NEW
),
```

No new tables. No index changes (existing indexes still work for playlist docs). No breaking changes to existing mutations — new fields are optional.

---

## Implementation order (recommended)

1. **Phase 1 — Bucket view MVP** (3-4 hours). Single feature branch, no backend. Ship, use it for a few days on the RLM library.
2. **Phase 2 — Duration bucket tags** (30 min). Update import script, re-run on the 524 clips. Adds the reel-sweet-spot filter.
3. **Phase 3 — Multi-select + bulk tag mutation** (2 hours). Prerequisite for playlist composer.
4. **Phase 4 — Playlist schema + composer panel** (4-5 hours). Schema migration, new mutations, composer UI.
5. **Phase 5 — Exports** (incremental, one purpose at a time). Start with `x_thread` (simplest) and `course_module` (most valuable for RLM).
6. **Phase 6 — Right-click retag** (1 hour, only if re-classification turns out to be a frequent need).

**Total estimate:** ~12 hours spread across 3-4 focused sessions. Phase 1 is usable on its own — you can stop after it and still get 70% of the value.

---

## Open questions (resolve these before implementation)

1. **Bucket-by-pillar: show all pillars always, or let user pick one "focus" pillar?**
   - Option A: Always show all 11 columns side-by-side (wide screen required, horizontal scroll on narrow)
   - Option B: Dropdown at top picks the current pillar, show clips for just that pillar + sub-pillar rollups
   - My vote: Option A with horizontal scroll, because the whole point is surveying the library

2. **Where does the playlist composer UI live?**
   - Option A: New `"playlists"` view mode (separate screen)
   - Option B: Side panel inside Bucket view (contextual)
   - Option C: Modal triggered from Bucket view multi-select "Add to playlist"
   - My vote: Option B for the editor experience, Option C for the quick-add flow. Both.

3. **Playlist doc_type: do playlists flow through the same Kanban statuses as other docs?**
   - Yes (draft → review → approved → scheduled → posted) — lets you schedule a whole thread for later
   - Or no — playlists are forever-draft / always-active, and only their constituent clips have status
   - My vote: yes, same flow. A playlist represents a deliverable (a thread you'll post, a course module you'll ship), so it makes sense that it has a lifecycle.

4. **Cross-workspace playlists? Can a playlist mix RLM and OpenEd clips?**
   - Technically yes — `workspace` field on the playlist itself controls where it shows up
   - Practically no — the voices are too different to mix
   - My vote: enforce same-workspace via mutation validation. Cleanest.

5. **Filter state persistence: URL params, localStorage, or neither?**
   - URL params — shareable ("send me this filter view"), but bloat the URL
   - localStorage — sticky across visits, but invisible and hard to share
   - Both — URL params override localStorage on load
   - My vote: both. Same pattern as `?workspace=` + localStorage stickiness.

6. **Duration encoding: schema field (option A) or tag (option B)?**
   - See Phase 2. My vote: tag for speed, upgrade to field if we need per-second filtering.

---

## What this plan does NOT cover

- **Bucket view for non-pillar-tagged docs** (OpenEd workspace has no pillar taxonomy yet). For OpenEd, BucketView should gracefully degrade to "group by tag" or "group by doc_type" until someone defines pillars for that workspace.
- **Real-time collaboration on playlists** (multiple people editing the same playlist at once). Playlists are small enough that last-write-wins is fine for v1.
- **Playlist history / versioning** (undo, see who edited when). Uses the existing `activity` table for an audit trail but no UI for it.
- **Playlist templates** ("every Tuesday I post a 5-clip mind-mastery thread, pre-fill me a template"). Nice-to-have, not MVP.
- **Smart playlists** (auto-populated by query: "all mind-mastery clips added this week"). Different feature, different session.

---

## Relationship to other planned work

- **FeedHive integration** (separate brief at `clients/rlm/rlm-conspire-feedhive-brief-20260414.md`) — consumes playlists for scheduled carousel / thread posting. Bucket view doesn't depend on FeedHive; FeedHive's carousel mode does depend on playlists.
- **Conspire workspace factory** (long-term direction in `project_conspire_factory_architecture.md`) — doesn't affect Bucket view. Bucket view is workspace-aware from day one via the existing `WORKSPACE.name` convention.
- **Age-mention universal cold-open** (Richard production move) — Bucket view should make these clips easy to find via the `flag:age-mention` filter. Once Charlie re-edits them with a cold open, he'll remove the `flag:age-mention` tag (bulk remove via Phase 3 action).

---

## Decision log (resolve these in chat, then update this doc)

- [ ] Decision 1: All pillars visible at once, or focus one?
- [ ] Decision 2: Composer as view mode, side panel, or modal?
- [ ] Decision 3: Playlist status lifecycle — yes or no?
- [ ] Decision 4: Cross-workspace playlists — allowed or blocked?
- [ ] Decision 5: Filter state persistence strategy?
- [ ] Decision 6: Duration as schema field or tag?

Once these are resolved, Phase 1 can start without further planning.
