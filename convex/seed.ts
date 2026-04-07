import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const populate = mutation({
  args: { force: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    // Check if already seeded (skip check if force=true)
    if (!args.force) {
      const count = await ctx.db.query("documents").take(8);
      if (count.length >= 5) return "Already seeded";
    }

    const posts = [
      {
        title: "Context engineering is the new prompt engineering",
        body: "The shift from prompt engineering to context engineering isn't just semantic. When you engineer context, you're curating the entire information environment your agent operates in — not just crafting a single instruction.",
        platform: "x" as const,
        status: "draft" as const,
        author: "Charlie",
        tags: ["context-engineering", "thesis"],
      },
      {
        title: "WHO Economy thread — trust the curator",
        body: "The future of AI isn't about WHAT model you use. It's about WHO curated the knowledge it draws from. A Naval wiki curated by someone who's read every podcast is worth more than GPT-4 trained on the internet.",
        platform: "x" as const,
        status: "draft" as const,
        author: "Charlie",
        tags: ["who-economy"],
      },
      {
        title: "Skills over scripts — why capability packages win",
        body: "A Python script does one thing rigidly. A skill gives the agent intent and context. The agent figures out execution. It reads the error and adapts.",
        platform: "linkedin" as const,
        status: "review" as const,
        author: "Kovid",
        tags: ["skills", "conspire"],
      },
      {
        title: "3 things I learned building 12 wiki knowledge bases",
        body: "1. Source selection IS the product. 2. Compilation beats collection. 3. Health checks prevent wiki rot.",
        platform: "x" as const,
        status: "review" as const,
        author: "Charlie",
        tags: ["wikis", "lessons"],
      },
      {
        title: "OpenEd curriculum quiz funnel results",
        body: "Week 1 results from the Curriculove quiz funnel: 847 completions, 23% email capture rate, top segment is elementary math.",
        platform: "linkedin" as const,
        status: "approved" as const,
        author: "Charlie",
        tags: ["opened", "curriculove"],
      },
      {
        title: "The missing layer between your terminal and your team",
        body: "Every agent tool today forces a choice: powerful terminal (invisible to teammates) or pretty app (agents are afterthoughts). What if you didn't have to choose?",
        platform: "x" as const,
        status: "scheduled" as const,
        author: "Charlie",
        scheduled_date: Date.now() + 86400000,
        tags: ["conspire", "launch"],
      },
      {
        title: "Karpathy was right about personal knowledge bases",
        body: "Karpathy's vision: collect raw sources → LLM compile into markdown wiki → CLI operations → browse in Obsidian → health checks. We've been building exactly this for creators.",
        platform: "x" as const,
        status: "posted" as const,
        author: "Charlie",
        tags: ["karpathy", "kb"],
      },
    ];

    for (const post of posts) {
      const { tags, scheduled_date, ...rest } = post;
      await ctx.db.insert("documents", {
        ...rest,
        doc_type: "social_post",
        tags,
        scheduled_date,
      });
    }

    return `Seeded ${posts.length} posts`;
  },
});
