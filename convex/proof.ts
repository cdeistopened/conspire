import { v } from "convex/values";
import { action, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";

const PROOF_BASE = "https://www.proofeditor.ai";

// Create a Proof doc and a Convex document record in one action
export const createWithProof = action({
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
    // 1. Create Proof document
    const markdown = args.body || `# ${args.title}\n\n`;
    const proofRes = await fetch(`${PROOF_BASE}/documents`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markdown, title: args.title }),
    });

    if (!proofRes.ok) {
      throw new Error(`Proof API error: ${proofRes.status} ${await proofRes.text()}`);
    }

    const proofData = await proofRes.json();
    const proof_slug = proofData.slug;
    const proof_token = proofData.token;

    // 2. Create Convex record linked to Proof doc
    const docId: Id<"documents"> = await ctx.runMutation(internal.proof.insertDocument, {
      title: args.title,
      doc_type: args.doc_type,
      platform: args.platform,
      author: args.author,
      body: args.body,
      source: args.source,
      tags: args.tags,
      proof_slug,
      proof_token,
    });

    return {
      docId,
      proof_slug,
      proof_token,
      proof_url: `${PROOF_BASE}/d/${proof_slug}?token=${proof_token}`,
    };
  },
});

// Internal mutation (called by the action above)
export const insertDocument = internalMutation({
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
    proof_slug: v.string(),
    proof_token: v.string(),
  },
  handler: async (ctx, args) => {
    const docId = await ctx.db.insert("documents", {
      title: args.title,
      doc_type: args.doc_type,
      platform: args.platform,
      author: args.author,
      body: args.body,
      source: args.source,
      tags: args.tags,
      proof_slug: args.proof_slug,
      proof_token: args.proof_token,
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
