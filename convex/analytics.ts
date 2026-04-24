import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const SOURCE = v.union(
  v.literal("getlate"),
  v.literal("gsc"),
  v.literal("ga4"),
  v.literal("webflow"),
  v.literal("manual")
);

const SYNC_SOURCE = v.union(
  v.literal("getlate"),
  v.literal("gsc"),
  v.literal("ga4"),
  v.literal("all")
);

const SURFACE_TYPE = v.union(
  v.literal("social_post"),
  v.literal("page"),
  v.literal("post"),
  v.literal("video"),
  v.literal("newsletter"),
  v.literal("unknown")
);

const EVENT_CATEGORY = v.union(
  v.literal("seo"),
  v.literal("content"),
  v.literal("publishing"),
  v.literal("technical"),
  v.literal("distribution"),
  v.literal("analytics"),
  v.literal("manual")
);

const EVENT_SOURCE = v.union(
  v.literal("conspire"),
  v.literal("webflow"),
  v.literal("getlate"),
  v.literal("sync"),
  v.literal("manual")
);

const PRIORITY_BUCKET = v.union(
  v.literal("falling_after_change"),
  v.literal("rising_after_change"),
  v.literal("published_unmeasured"),
  v.literal("changed_recently"),
  v.literal("missing_metadata"),
  v.literal("unmatched_surface"),
  v.literal("stable")
);

const METRICS = v.object({
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
});

export const listCommandCenter = query({
  args: { workspace: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 80;
    const [rollups, syncRuns] = await Promise.all([
      ctx.db
        .query("assetRollups")
        .withIndex("by_workspace", (q) => q.eq("workspace", args.workspace))
        .collect(),
      ctx.db
        .query("syncRuns")
        .withIndex("by_workspace_started", (q) => q.eq("workspace", args.workspace))
        .order("desc")
        .take(5),
    ]);

    const priority: Record<string, number> = {
      falling_after_change: 0,
      rising_after_change: 1,
      published_unmeasured: 2,
      changed_recently: 3,
      missing_metadata: 4,
      unmatched_surface: 5,
      stable: 6,
    };

    const rows = await Promise.all(
      rollups
        .sort((a, b) => {
          const bucket = priority[a.priorityBucket] - priority[b.priorityBucket];
          if (bucket !== 0) return bucket;
          return b.updatedAt - a.updatedAt;
        })
        .slice(0, limit)
        .map(async (rollup) => {
          const document = rollup.documentId
            ? await ctx.db.get(rollup.documentId)
            : null;
          const surface = rollup.surfaceId ? await ctx.db.get(rollup.surfaceId) : null;
          return { rollup, document, surface };
        })
    );

    const unmatchedCount = rollups.filter(
      (r) => r.priorityBucket === "unmatched_surface"
    ).length;
    const attentionCount = rollups.filter(
      (r) => r.priorityBucket !== "stable"
    ).length;

    return {
      rows,
      syncRuns,
      summary: {
        totalAssets: rollups.length,
        attentionCount,
        unmatchedCount,
      },
    };
  },
});

export const listEventsForDocument = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("contentEvents")
      .withIndex("by_document_timestamp", (q) =>
        q.eq("documentId", args.documentId)
      )
      .order("desc")
      .take(50);
  },
});

export const createContentEvent = mutation({
  args: {
    workspace: v.string(),
    documentId: v.optional(v.id("documents")),
    timestamp: v.optional(v.number()),
    actor: v.string(),
    category: EVENT_CATEGORY,
    source: EVENT_SOURCE,
    description: v.string(),
    before: v.optional(v.any()),
    after: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("contentEvents", {
      workspace: args.workspace,
      documentId: args.documentId,
      timestamp: args.timestamp ?? Date.now(),
      actor: args.actor,
      category: args.category,
      source: args.source,
      description: args.description,
      before: args.before,
      after: args.after,
    });
  },
});

export const startSyncRun = mutation({
  args: { workspace: v.string(), source: SYNC_SOURCE },
  handler: async (ctx, args) => {
    return await ctx.db.insert("syncRuns", {
      workspace: args.workspace,
      source: args.source,
      status: "running",
      startedAt: Date.now(),
    });
  },
});

export const finishSyncRun = mutation({
  args: {
    id: v.id("syncRuns"),
    status: v.union(v.literal("success"), v.literal("error")),
    surfaces: v.optional(v.number()),
    snapshots: v.optional(v.number()),
    rollups: v.optional(v.number()),
    errors: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { id, ...patch } = args;
    await ctx.db.patch(id, { ...patch, completedAt: Date.now() });
  },
});

export const syncBatch = mutation({
  args: {
    workspace: v.string(),
    surfaces: v.array(
      v.object({
        documentId: v.optional(v.id("documents")),
        source: SOURCE,
        surfaceType: SURFACE_TYPE,
        externalId: v.optional(v.string()),
        url: v.optional(v.string()),
        platform: v.optional(v.string()),
        title: v.optional(v.string()),
        slug: v.optional(v.string()),
        firstSeen: v.optional(v.number()),
        lastSeen: v.optional(v.number()),
        metadata: v.optional(v.any()),
      })
    ),
    snapshots: v.array(
      v.object({
        source: SOURCE,
        date: v.string(),
        documentId: v.optional(v.id("documents")),
        surfaceId: v.optional(v.id("externalSurfaces")),
        surfaceExternalId: v.optional(v.string()),
        surfaceUrl: v.optional(v.string()),
        metrics: METRICS,
      })
    ),
    rollups: v.array(
      v.object({
        documentId: v.optional(v.id("documents")),
        surfaceId: v.optional(v.id("externalSurfaces")),
        assetTitle: v.string(),
        assetType: v.string(),
        status: v.optional(v.string()),
        priorityBucket: PRIORITY_BUCKET,
        recommendation: v.string(),
        topSource: v.optional(v.string()),
        latestEventAt: v.optional(v.number()),
        latestEventDescription: v.optional(v.string()),
        metrics7: v.any(),
        metrics28: v.any(),
        periodEnd: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const surfaceIdByKey: Record<string, string> = {};

    for (const surface of args.surfaces) {
      let existing = null;
      if (surface.externalId) {
        existing = await ctx.db
          .query("externalSurfaces")
          .withIndex("by_workspace_source_external", (q) =>
            q
              .eq("workspace", args.workspace)
              .eq("source", surface.source)
              .eq("externalId", surface.externalId)
          )
          .first();
      }
      if (!existing && surface.url) {
        existing = await ctx.db
          .query("externalSurfaces")
          .withIndex("by_workspace_url", (q) =>
            q.eq("workspace", args.workspace).eq("url", surface.url)
          )
          .first();
      }

      const payload = {
        workspace: args.workspace,
        documentId: surface.documentId,
        source: surface.source,
        surfaceType: surface.surfaceType,
        externalId: surface.externalId,
        url: surface.url,
        platform: surface.platform,
        title: surface.title,
        slug: surface.slug,
        firstSeen: surface.firstSeen ?? existing?.firstSeen ?? now,
        lastSeen: surface.lastSeen ?? now,
        metadata: surface.metadata,
      };

      const id = existing
        ? (await ctx.db.patch(existing._id, payload), existing._id)
        : await ctx.db.insert("externalSurfaces", payload);

      if (surface.externalId) {
        surfaceIdByKey[`${surface.source}:id:${surface.externalId}`] = id;
      }
      if (surface.url) {
        surfaceIdByKey[`${surface.source}:url:${surface.url}`] = id;
      }
    }

    for (const snapshot of args.snapshots) {
      let existing = null;
      const resolvedSurfaceId =
        snapshot.surfaceId ??
        (snapshot.surfaceExternalId
          ? surfaceIdByKey[`${snapshot.source}:id:${snapshot.surfaceExternalId}`]
          : undefined) ??
        (snapshot.surfaceUrl
          ? surfaceIdByKey[`${snapshot.source}:url:${snapshot.surfaceUrl}`]
          : undefined);

      if (resolvedSurfaceId) {
        const rows = await ctx.db
          .query("metricSnapshots")
          .withIndex("by_surface_date", (q) =>
            q.eq("surfaceId", resolvedSurfaceId as any).eq("date", snapshot.date)
          )
          .collect();
        existing = rows.find((r) => r.source === snapshot.source) ?? null;
      } else if (snapshot.documentId) {
        const rows = await ctx.db
          .query("metricSnapshots")
          .withIndex("by_document_date", (q) =>
            q.eq("documentId", snapshot.documentId).eq("date", snapshot.date)
          )
          .collect();
        existing = rows.find((r) => r.source === snapshot.source) ?? null;
      }

      const payload = {
        workspace: args.workspace,
        source: snapshot.source,
        date: snapshot.date,
        documentId: snapshot.documentId,
        surfaceId: resolvedSurfaceId as any,
        metrics: snapshot.metrics,
        lastSynced: now,
      };

      if (existing) await ctx.db.patch(existing._id, payload);
      else await ctx.db.insert("metricSnapshots", payload);
    }

    for (const rollup of args.rollups) {
      let existing = null;
      if (rollup.documentId) {
        const rows = await ctx.db
          .query("assetRollups")
          .withIndex("by_document", (q) => q.eq("documentId", rollup.documentId))
          .collect();
        existing = rows.find((r) => r.periodEnd === rollup.periodEnd) ?? null;
      } else if (rollup.surfaceId) {
        const rows = await ctx.db
          .query("assetRollups")
          .withIndex("by_surface", (q) => q.eq("surfaceId", rollup.surfaceId))
          .collect();
        existing = rows.find((r) => r.periodEnd === rollup.periodEnd) ?? null;
      }

      const payload = {
        workspace: args.workspace,
        documentId: rollup.documentId,
        surfaceId: rollup.surfaceId,
        assetTitle: rollup.assetTitle,
        assetType: rollup.assetType,
        status: rollup.status,
        priorityBucket: rollup.priorityBucket,
        recommendation: rollup.recommendation,
        topSource: rollup.topSource,
        latestEventAt: rollup.latestEventAt,
        latestEventDescription: rollup.latestEventDescription,
        metrics7: rollup.metrics7,
        metrics28: rollup.metrics28,
        periodEnd: rollup.periodEnd,
        updatedAt: now,
      };

      if (existing) await ctx.db.patch(existing._id, payload);
      else await ctx.db.insert("assetRollups", payload);
    }

    return {
      surfaces: args.surfaces.length,
      snapshots: args.snapshots.length,
      rollups: args.rollups.length,
      surfaceIds: Object.entries(surfaceIdByKey).map(([key, id]) => ({
        key,
        id,
      })),
    };
  },
});
