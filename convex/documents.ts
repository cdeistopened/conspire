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
  v.literal("approved"),
  v.literal("scheduled"),
  v.literal("posted"),
  v.literal("archived")
);

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
    await ctx.db.patch(args.id, { status: args.status });
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
    zernio_post_id: v.optional(v.string()),
    zernio_scheduled_at: v.optional(v.number()),
    zernio_error: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    const updates: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(fields)) {
      if (value !== undefined) {
        updates[key] = value;
      }
    }
    if (Object.keys(updates).length > 0) {
      await ctx.db.patch(id, updates);
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
