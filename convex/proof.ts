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
    // 1. Create Proof document via hosted API
    const markdown = args.body || `# ${args.title}\n\n`;
    const proofRes = await fetch(`${PROOF_BASE}/share/markdown`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markdown }),
    });

    if (!proofRes.ok) {
      throw new Error(`Proof API error: ${proofRes.status} ${await proofRes.text()}`);
    }

    const proofData: { slug: string; accessToken: string } = await proofRes.json();
    const proof_slug = proofData.slug;
    const proof_token = proofData.accessToken;

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

// Link an existing Convex document to a new Proof doc
export const linkExisting = action({
  args: {
    documentId: v.id("documents"),
    body: v.optional(v.string()),
    title: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const markdown = args.body || `# ${args.title ?? "Untitled"}\n\n`;
    const proofRes = await fetch(`${PROOF_BASE}/share/markdown`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markdown }),
    });

    if (!proofRes.ok) {
      throw new Error(`Proof API error: ${proofRes.status}`);
    }

    const proofData: { slug: string; accessToken: string } =
      await proofRes.json();

    await ctx.runMutation(internal.proof.patchProofLink, {
      documentId: args.documentId,
      proof_slug: proofData.slug,
      proof_token: proofData.accessToken,
    });

    return {
      proof_slug: proofData.slug,
      proof_url: `${PROOF_BASE}/d/${proofData.slug}?token=${proofData.accessToken}`,
    };
  },
});

// Internal: patch proof link onto existing document
export const patchProofLink = internalMutation({
  args: {
    documentId: v.id("documents"),
    proof_slug: v.string(),
    proof_token: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.documentId, {
      proof_slug: args.proof_slug,
      proof_token: args.proof_token,
    });
  },
});

// Internal mutation (called by createWithProof)
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
