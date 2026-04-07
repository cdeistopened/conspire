import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const listByStatus = query({
  args: {
    status: v.optional(
      v.union(
        v.literal("draft"),
        v.literal("review"),
        v.literal("approved"),
        v.literal("scheduled"),
        v.literal("posted"),
        v.literal("archived")
      )
    ),
  },
  handler: async (ctx, args) => {
    if (args.status) {
      return ctx.db
        .query("documents")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .collect();
    }
    return ctx.db.query("documents").collect();
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
    doc_type: v.union(
      v.literal("social_post"),
      v.literal("blog_draft"),
      v.literal("newsletter"),
      v.literal("note")
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
        v.literal("beehiiv")
      )
    ),
    author: v.string(),
    body: v.optional(v.string()),
    source: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
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
    status: v.union(
      v.literal("draft"),
      v.literal("review"),
      v.literal("approved"),
      v.literal("scheduled"),
      v.literal("posted"),
      v.literal("archived")
    ),
    actor: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });

    await ctx.db.insert("activity", {
      document: args.id,
      actor: args.actor,
      action: "status_changed",
      details: `Status changed to ${args.status}`,
      timestamp: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("documents"),
    title: v.optional(v.string()),
    body: v.optional(v.string()),
    platform: v.optional(
      v.union(
        v.literal("x"),
        v.literal("linkedin"),
        v.literal("instagram"),
        v.literal("facebook"),
        v.literal("tiktok"),
        v.literal("substack"),
        v.literal("webflow"),
        v.literal("beehiiv")
      )
    ),
    scheduled_date: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
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

export const remove = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
