import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const DOC_TYPE_VALIDATOR = v.union(
  v.literal("social_post"),
  v.literal("short_form_video"),
  v.literal("blog_draft"),
  v.literal("podcast"),
  v.literal("newsletter"),
  v.literal("note")
);

const PLATFORM_VALIDATOR = v.union(
  v.literal("x"),
  v.literal("linkedin"),
  v.literal("instagram"),
  v.literal("facebook"),
  v.literal("tiktok"),
  v.literal("substack"),
  v.literal("webflow"),
  v.literal("beehiiv"),
  v.literal("youtube")
);

const STATUS_VALIDATOR = v.union(
  v.literal("draft"),
  v.literal("review"),
  v.literal("staging"),
  v.literal("approved"),
  v.literal("scheduled"),
  v.literal("posted"),
  v.literal("archived")
);

const EVENT_FIELDS: Record<string, "seo" | "content" | "publishing" | "technical"> = {
  title: "content",
  body: "content",
  meta_description: "seo",
  status: "publishing",
  publish_date: "publishing",
  published_date: "publishing",
  scheduled_date: "publishing",
  external_url: "publishing",
  zernio_post_id: "publishing",
  proof_slug: "technical",
  proof_token: "technical",
};

function hasMeaningfulChange(before: unknown, after: unknown) {
  return JSON.stringify(before ?? null) !== JSON.stringify(after ?? null);
}

function describeChange(key: string) {
  const labels: Record<string, string> = {
    title: "Title changed",
    body: "Body changed",
    meta_description: "Meta description changed",
    status: "Status changed",
    publish_date: "Publish date changed",
    published_date: "Published date changed",
    scheduled_date: "Scheduled date changed",
    external_url: "External URL changed",
    zernio_post_id: "Getlate post attached",
    proof_slug: "Proof document linked",
    proof_token: "Proof access token changed",
  };
  return labels[key] ?? `${key} changed`;
}

export const listByStatus = query({
  args: {
    status: v.optional(STATUS_VALIDATOR),
    workspace: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const base = args.status
      ? await ctx.db
          .query("documents")
          .withIndex("by_status", (q) => q.eq("status", args.status!))
          .collect()
      : await ctx.db.query("documents").collect();

    if (!args.workspace) return base;

    // Legacy docs (created before workspace tagging) implicitly belong to
    // the opened workspace — treat undefined as "opened" for back-compat.
    return base.filter((d) => {
      const w = d.workspace ?? "opened";
      return w === args.workspace;
    });
  },
});

export const listByParent = query({
  args: { parent_id: v.id("documents") },
  handler: async (ctx, args) => {
    return ctx.db
      .query("documents")
      .withIndex("by_parent", (q) => q.eq("parent_id", args.parent_id))
      .collect();
  },
});

// Batch child count lookup — replaces the per-card listByParent query.
// One round trip returns a { parentId → count } map for every doc in a
// workspace. Scales to thousands of docs because it's a single indexed scan.
export const childCountsByParent = query({
  args: { workspace: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const all = await ctx.db.query("documents").collect();
    const scoped = args.workspace
      ? all.filter((d) => (d.workspace ?? "opened") === args.workspace)
      : all;
    const counts: Record<string, number> = {};
    for (const d of scoped) {
      if (d.parent_id) {
        counts[d.parent_id] = (counts[d.parent_id] ?? 0) + 1;
      }
    }
    return counts;
  },
});

export const get = query({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    return ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    doc_type: DOC_TYPE_VALIDATOR,
    platform: v.optional(PLATFORM_VALIDATOR),
    author: v.string(),
    workspace: v.optional(v.string()),
    body: v.optional(v.string()),
    source: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    thumbnail_url: v.optional(v.string()),
    meta_description: v.optional(v.string()),
    parent_id: v.optional(v.id("documents")),
    publish_date: v.optional(v.number()),
    title_variants: v.optional(v.array(v.string())),
    thumbnail_urls: v.optional(v.array(v.string())),
    transcript: v.optional(v.string()),
    descript_url: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const docId = await ctx.db.insert("documents", {
      ...args,
      status: "draft",
    });

    await ctx.db.insert("activity", {
      document: docId,
      actor: args.author,
      action: "created",
      timestamp: Date.now(),
    });

    return docId;
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("documents"),
    status: STATUS_VALIDATOR,
    actor: v.string(),
  },
  handler: async (ctx, args) => {
    const doc = await ctx.db.get(args.id);
    await ctx.db.patch(args.id, { status: args.status });
    if (doc && doc.status !== args.status) {
      await ctx.db.insert("contentEvents", {
        workspace: doc.workspace ?? "opened",
        documentId: args.id,
        timestamp: Date.now(),
        actor: args.actor,
        category: "publishing",
        source: "conspire",
        description: `Status changed: ${doc.status} -> ${args.status}`,
        before: { status: doc.status },
        after: { status: args.status },
      });
    }
  },
});

export const update = mutation({
  args: {
    id: v.id("documents"),
    title: v.optional(v.string()),
    body: v.optional(v.string()),
    doc_type: v.optional(DOC_TYPE_VALIDATOR),
    platform: v.optional(PLATFORM_VALIDATOR),
    scheduled_date: v.optional(v.number()),
    publish_date: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    proof_slug: v.optional(v.string()),
    proof_token: v.optional(v.string()),
    source: v.optional(v.string()),
    thumbnail_url: v.optional(v.string()),
    thumbnail_type: v.optional(v.string()),
    meta_description: v.optional(v.string()),
    parent_id: v.optional(v.id("documents")),
    workspace: v.optional(v.string()),
    title_variants: v.optional(v.array(v.string())),
    thumbnail_urls: v.optional(v.array(v.string())),
    transcript: v.optional(v.string()),
    polished_transcript: v.optional(v.string()),
    youtube_show_notes: v.optional(v.string()),
    descript_url: v.optional(v.string()),
    newsletter_subject: v.optional(v.string()),
    newsletter_preview: v.optional(v.string()),
    external_url: v.optional(v.string()),
    zernio_post_id: v.optional(v.string()),
    zernio_scheduled_at: v.optional(v.number()),
    zernio_error: v.optional(v.string()),
    chosen_variant_index: v.optional(v.number()),
    notes: v.optional(v.string()),
    caption_instagram: v.optional(v.string()),
    caption_tiktok: v.optional(v.string()),
    caption_youtube_title: v.optional(v.string()),
    caption_youtube_description: v.optional(v.string()),
    caption_facebook: v.optional(v.string()),
    actor: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, actor, ...fields } = args;
    const beforeDoc = await ctx.db.get(id);
    const updates: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(fields)) {
      if (value !== undefined) {
        updates[key] = value;
      }
    }
    if (Object.keys(updates).length > 0) {
      await ctx.db.patch(id, updates);
    }
    if (beforeDoc && Object.keys(updates).length > 0) {
      for (const [key, value] of Object.entries(updates)) {
        if (!(key in EVENT_FIELDS)) continue;
        const beforeValue = (beforeDoc as any)[key];
        if (!hasMeaningfulChange(beforeValue, value)) continue;
        await ctx.db.insert("contentEvents", {
          workspace: (updates.workspace as string | undefined) ?? beforeDoc.workspace ?? "opened",
          documentId: id,
          timestamp: Date.now(),
          actor: actor ?? "Agent",
          category: EVENT_FIELDS[key],
          source: "conspire",
          description: describeChange(key),
          before: { [key]: beforeValue },
          after: { [key]: value },
        });
      }
    }
  },
});

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const saveThumbnail = mutation({
  args: {
    id: v.id("documents"),
    storageId: v.id("_storage"),
    contentType: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const url = await ctx.storage.getUrl(args.storageId);
    const kind = args.contentType?.startsWith("video/") ? "video" : "image";
    await ctx.db.patch(args.id, {
      thumbnail_url: url ?? undefined,
      thumbnail_type: kind,
    });
  },
});

export const setThumbnailSlot = mutation({
  args: {
    id: v.id("documents"),
    storageId: v.id("_storage"),
    slot: v.number(),
  },
  handler: async (ctx, args) => {
    const url = await ctx.storage.getUrl(args.storageId);
    if (!url) return;
    const doc = await ctx.db.get(args.id);
    if (!doc) return;
    const current = doc.thumbnail_urls ?? [];
    const next = [...current];
    while (next.length <= args.slot) next.push("");
    next[args.slot] = url;
    await ctx.db.patch(args.id, { thumbnail_urls: next });
  },
});

export const clearThumbnailSlot = mutation({
  args: {
    id: v.id("documents"),
    slot: v.number(),
  },
  handler: async (ctx, args) => {
    const doc = await ctx.db.get(args.id);
    if (!doc) return;
    const current = doc.thumbnail_urls ?? [];
    if (args.slot >= current.length) return;
    const next = [...current];
    next[args.slot] = "";
    await ctx.db.patch(args.id, { thumbnail_urls: next });
  },
});

export const remove = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
