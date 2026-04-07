import { v } from "convex/values";
import { query } from "./_generated/server";

export const listByDocument = query({
  args: { document: v.id("documents") },
  handler: async (ctx, args) => {
    return ctx.db
      .query("activity")
      .withIndex("by_document", (q) => q.eq("document", args.document))
      .collect();
  },
});

export const recent = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;
    return ctx.db
      .query("activity")
      .withIndex("by_timestamp")
      .order("desc")
      .take(limit);
  },
});
