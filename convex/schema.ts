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
    body: v.optional(v.string()),
    scheduled_date: v.optional(v.number()),
    published_date: v.optional(v.number()),
    publish_date: v.optional(v.number()),
    campaign: v.optional(v.id("campaigns")),
    source: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    thumbnail_url: v.optional(v.string()),
    meta_description: v.optional(v.string()),
    parent_id: v.optional(v.id("documents")),
    external_id: v.optional(v.string()),
    external_url: v.optional(v.string()),
    media: v.optional(v.array(v.id("_storage"))),

    // Podcast/YouTube specific
    title_variants: v.optional(v.array(v.string())),       // up to 3 A/B titles
    thumbnail_urls: v.optional(v.array(v.string())),        // up to 3 A/B thumbnails
    transcript: v.optional(v.string()),                      // full transcript text
    descript_url: v.optional(v.string()),                    // share.descript.com link

    performance: v.optional(
      v.object({
        likes: v.optional(v.number()),
        comments: v.optional(v.number()),
        impressions: v.optional(v.number()),
        clicks: v.optional(v.number()),
      })
    ),
  })
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
});
