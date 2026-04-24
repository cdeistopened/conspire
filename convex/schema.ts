import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  documents: defineTable({
    title: v.string(),
    proof_slug: v.optional(v.string()),
    proof_token: v.optional(v.string()),
    doc_type: v.union(
      v.literal("social_post"),
      v.literal("short_form_video"),
      v.literal("blog_draft"),
      v.literal("podcast"),
      v.literal("newsletter"),
      v.literal("note")
    ),
    status: v.union(
      v.literal("draft"),
      v.literal("review"),
      v.literal("staging"),
      v.literal("approved"),
      v.literal("scheduled"),
      v.literal("posted"),
      v.literal("archived")
    ),
    platform: v.optional(
      v.union(
        v.literal("x"),
        v.literal("linkedin"),
        v.literal("instagram"),
        v.literal("facebook"),
        v.literal("tiktok"),
        v.literal("substack"),
        v.literal("webflow"),
        v.literal("beehiiv"),
        v.literal("youtube")
      )
    ),
    author: v.string(),
    // Workspace tag for multi-tenant filtering. Absent = legacy OpenEd doc
    // (backfill treats undefined as "opened"). New docs always set this from
    // the frontend's WORKSPACE.name, which in turn comes from VITE_WORKSPACE.
    workspace: v.optional(v.string()),
    body: v.optional(v.string()),
    scheduled_date: v.optional(v.number()),
    published_date: v.optional(v.number()),
    publish_date: v.optional(v.number()),
    campaign: v.optional(v.id("campaigns")),
    source: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    thumbnail_url: v.optional(v.string()),
    thumbnail_type: v.optional(v.string()),   // "image" | "video"
    meta_description: v.optional(v.string()),
    parent_id: v.optional(v.id("documents")),
    external_id: v.optional(v.string()),
    external_url: v.optional(v.string()),
    media: v.optional(v.array(v.id("_storage"))),

    // Podcast/YouTube specific
    title_variants: v.optional(v.array(v.string())),       // 2 A/B titles
    thumbnail_urls: v.optional(v.array(v.string())),        // 4 slots: 3 A/B + 1 watercolor
    transcript: v.optional(v.string()),                      // raw transcript (from Descript)
    polished_transcript: v.optional(v.string()),             // polished transcript for Webflow blog HTML box
    youtube_show_notes: v.optional(v.string()),              // YouTube description / show notes
    descript_url: v.optional(v.string()),                    // share.descript.com link

    // Newsletter specific
    newsletter_subject: v.optional(v.string()),              // distinct from title
    newsletter_preview: v.optional(v.string()),              // preview text under subject

    // Zernio scheduling (RLM workspace, other workspaces can opt in)
    zernio_post_id: v.optional(v.string()),                  // returned by POST /api/v1/posts
    zernio_scheduled_at: v.optional(v.number()),             // when we handed it to Zernio
    zernio_error: v.optional(v.string()),                    // last failure message, if any

    // Review view: index of the user-picked variant from title_variants
    chosen_variant_index: v.optional(v.number()),

    // Bucket view: free-form notes the user types while browsing the library.
    // Orthogonal to tags/pillars — used for observations like "use in anxiety
    // thread" or "needs cold-open re-cut". Searchable in the Bucket filter bar.
    notes: v.optional(v.string()),

    // Per-platform captions (generated in staging-queue pipeline, editable in panel)
    caption_instagram: v.optional(v.string()),
    caption_tiktok: v.optional(v.string()),
    caption_youtube_title: v.optional(v.string()),
    caption_youtube_description: v.optional(v.string()),
    caption_facebook: v.optional(v.string()),

    performance: v.optional(
      v.object({
        likes: v.optional(v.number()),
        comments: v.optional(v.number()),
        impressions: v.optional(v.number()),
        clicks: v.optional(v.number()),
      })
    ),
  })
    .index("by_workspace", ["workspace"])
    .index("by_status", ["status"])
    .index("by_type", ["doc_type"])
    .index("by_platform", ["platform"])
    .index("by_author", ["author"])
    .index("by_campaign", ["campaign"])
    .index("by_scheduled", ["scheduled_date"])
    .index("by_parent", ["parent_id"]),

  campaigns: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    start_date: v.optional(v.number()),
    end_date: v.optional(v.number()),
  }),

  team: defineTable({
    name: v.string(),
    email: v.optional(v.string()),
    role: v.union(
      v.literal("admin"),
      v.literal("editor"),
      v.literal("viewer")
    ),
    avatar_url: v.optional(v.string()),
  }),

  activity: defineTable({
    document: v.id("documents"),
    actor: v.string(),
    action: v.string(),
    details: v.optional(v.string()),
    timestamp: v.number(),
  })
    .index("by_document", ["document"])
    .index("by_timestamp", ["timestamp"]),

  externalSurfaces: defineTable({
    workspace: v.string(),
    documentId: v.optional(v.id("documents")),
    source: v.union(
      v.literal("getlate"),
      v.literal("gsc"),
      v.literal("ga4"),
      v.literal("webflow"),
      v.literal("manual")
    ),
    surfaceType: v.union(
      v.literal("social_post"),
      v.literal("page"),
      v.literal("post"),
      v.literal("video"),
      v.literal("newsletter"),
      v.literal("unknown")
    ),
    externalId: v.optional(v.string()),
    url: v.optional(v.string()),
    platform: v.optional(v.string()),
    title: v.optional(v.string()),
    slug: v.optional(v.string()),
    firstSeen: v.number(),
    lastSeen: v.number(),
    metadata: v.optional(v.any()),
  })
    .index("by_workspace", ["workspace"])
    .index("by_document", ["documentId"])
    .index("by_workspace_source", ["workspace", "source"])
    .index("by_workspace_source_external", ["workspace", "source", "externalId"])
    .index("by_workspace_url", ["workspace", "url"]),

  metricSnapshots: defineTable({
    workspace: v.string(),
    source: v.union(
      v.literal("getlate"),
      v.literal("gsc"),
      v.literal("ga4"),
      v.literal("webflow"),
      v.literal("manual")
    ),
    date: v.string(),
    documentId: v.optional(v.id("documents")),
    surfaceId: v.optional(v.id("externalSurfaces")),
    metrics: v.object({
      views: v.optional(v.number()),
      impressions: v.optional(v.number()),
      reach: v.optional(v.number()),
      clicks: v.optional(v.number()),
      pageviews: v.optional(v.number()),
      sessions: v.optional(v.number()),
      users: v.optional(v.number()),
      likes: v.optional(v.number()),
      comments: v.optional(v.number()),
      shares: v.optional(v.number()),
      saves: v.optional(v.number()),
      engagementRate: v.optional(v.number()),
      position: v.optional(v.number()),
    }),
    lastSynced: v.number(),
  })
    .index("by_workspace_date", ["workspace", "date"])
    .index("by_document_date", ["documentId", "date"])
    .index("by_surface_date", ["surfaceId", "date"])
    .index("by_source_date", ["source", "date"]),

  contentEvents: defineTable({
    workspace: v.string(),
    documentId: v.optional(v.id("documents")),
    timestamp: v.number(),
    actor: v.string(),
    category: v.union(
      v.literal("seo"),
      v.literal("content"),
      v.literal("publishing"),
      v.literal("technical"),
      v.literal("distribution"),
      v.literal("analytics"),
      v.literal("manual")
    ),
    source: v.union(
      v.literal("conspire"),
      v.literal("webflow"),
      v.literal("getlate"),
      v.literal("sync"),
      v.literal("manual")
    ),
    description: v.string(),
    before: v.optional(v.any()),
    after: v.optional(v.any()),
  })
    .index("by_workspace_timestamp", ["workspace", "timestamp"])
    .index("by_document_timestamp", ["documentId", "timestamp"])
    .index("by_workspace_category", ["workspace", "category"]),

  assetRollups: defineTable({
    workspace: v.string(),
    documentId: v.optional(v.id("documents")),
    surfaceId: v.optional(v.id("externalSurfaces")),
    assetTitle: v.string(),
    assetType: v.string(),
    status: v.optional(v.string()),
    priorityBucket: v.union(
      v.literal("falling_after_change"),
      v.literal("rising_after_change"),
      v.literal("published_unmeasured"),
      v.literal("changed_recently"),
      v.literal("missing_metadata"),
      v.literal("unmatched_surface"),
      v.literal("stable")
    ),
    recommendation: v.string(),
    topSource: v.optional(v.string()),
    latestEventAt: v.optional(v.number()),
    latestEventDescription: v.optional(v.string()),
    metrics7: v.any(),
    metrics28: v.any(),
    periodEnd: v.string(),
    updatedAt: v.number(),
  })
    .index("by_workspace", ["workspace"])
    .index("by_workspace_bucket", ["workspace", "priorityBucket"])
    .index("by_document", ["documentId"])
    .index("by_surface", ["surfaceId"]),

  syncRuns: defineTable({
    workspace: v.string(),
    source: v.union(
      v.literal("getlate"),
      v.literal("gsc"),
      v.literal("ga4"),
      v.literal("all")
    ),
    status: v.union(
      v.literal("running"),
      v.literal("success"),
      v.literal("error")
    ),
    startedAt: v.number(),
    completedAt: v.optional(v.number()),
    surfaces: v.optional(v.number()),
    snapshots: v.optional(v.number()),
    rollups: v.optional(v.number()),
    errors: v.optional(v.array(v.string())),
  })
    .index("by_workspace_started", ["workspace", "startedAt"])
    .index("by_workspace_source", ["workspace", "source"]),
});
