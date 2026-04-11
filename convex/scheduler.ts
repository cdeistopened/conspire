import { v } from "convex/values";
import { action, internalMutation, internalQuery } from "./_generated/server";
import { internal } from "./_generated/api";

// Convex V8 runtime exposes process.env.X but TypeScript doesn't know about
// it by default. Local declaration is all we need — no @types/node import.
declare const process: { env: Record<string, string | undefined> };

// Convex platform key → Zernio platform name.
// Only the ones Zernio supports. Substack / Webflow / Beehiiv are newsletter
// publishers, not social networks, so they don't go through Zernio.
const ZERNIO_PLATFORM_MAP: Record<string, string> = {
  x: "twitter",
  linkedin: "linkedin",
  instagram: "instagram",
  facebook: "facebook",
  tiktok: "tiktok",
  youtube: "youtube",
};

const ZERNIO_BASE = "https://zernio.com/api/v1";

export const publishToZernio = action({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args): Promise<{ zernioPostId: string }> => {
    const apiKey = process.env.ZERNIO_API_KEY;
    if (!apiKey) {
      throw new Error(
        "ZERNIO_API_KEY not set. Configure it on the Railway service for this workspace."
      );
    }

    const doc = await ctx.runQuery(internal.scheduler.getDocForPublish, {
      documentId: args.documentId,
    });
    if (!doc) throw new Error("Document not found");
    if (!doc.body || !doc.body.trim()) {
      throw new Error("Document has no body/caption to publish");
    }
    if (!doc.publish_date) {
      throw new Error("Document has no scheduled publish time");
    }

    // Pull platforms from tags (platform:x, platform:instagram, ...) and the
    // legacy single-platform field. Map to Zernio names, drop any platform
    // Zernio can't reach (substack/beehiiv/webflow etc.).
    const tagPlatforms = (doc.tags ?? [])
      .filter((t: string) => t.startsWith("platform:"))
      .map((t: string) => t.slice("platform:".length));
    const allPlatformKeys = Array.from(
      new Set([...tagPlatforms, ...(doc.platform ? [doc.platform] : [])])
    );
    const zernioPlatforms = allPlatformKeys
      .map((k) => ZERNIO_PLATFORM_MAP[k])
      .filter(Boolean);
    if (zernioPlatforms.length === 0) {
      throw new Error(
        "No Zernio-supported platforms selected. Check the Platforms section on this doc."
      );
    }

    // Media URL: thumbnail_url is a Convex storage URL (publicly readable).
    // For podcast-type docs we could also grab thumbnail_urls[0] as a fallback.
    const mediaUrl = doc.thumbnail_url ?? doc.thumbnail_urls?.[0];
    const mediaUrls = mediaUrl ? [mediaUrl] : [];

    const payload = {
      text: doc.body,
      platforms: zernioPlatforms,
      mediaUrls,
      scheduledFor: new Date(doc.publish_date).toISOString(),
    };

    const response = await fetch(`${ZERNIO_BASE}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      const msg = `Zernio ${response.status}: ${errorText || response.statusText}`;
      await ctx.runMutation(internal.scheduler.markPublishFailure, {
        documentId: args.documentId,
        error: msg,
      });
      throw new Error(msg);
    }

    const data = (await response.json()) as { id?: string; postId?: string };
    const zernioPostId = data.id ?? data.postId ?? "";
    if (!zernioPostId) {
      throw new Error(
        "Zernio responded without a post id. Check the doc in Zernio's dashboard."
      );
    }

    await ctx.runMutation(internal.scheduler.markPublishSuccess, {
      documentId: args.documentId,
      zernioPostId,
    });

    return { zernioPostId };
  },
});

export const getDocForPublish = internalQuery({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.documentId);
  },
});

export const markPublishSuccess = internalMutation({
  args: {
    documentId: v.id("documents"),
    zernioPostId: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.documentId, {
      zernio_post_id: args.zernioPostId,
      zernio_scheduled_at: Date.now(),
      zernio_error: undefined,
      status: "scheduled",
    });
    await ctx.db.insert("activity", {
      document: args.documentId,
      actor: "zernio",
      action: "published",
      details: `Scheduled via Zernio (id ${args.zernioPostId})`,
      timestamp: Date.now(),
    });
  },
});

export const markPublishFailure = internalMutation({
  args: {
    documentId: v.id("documents"),
    error: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.documentId, { zernio_error: args.error });
  },
});
