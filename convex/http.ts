import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

// GET /api/documents — full index of all documents with body content
http.route({
  path: "/api/documents",
  method: "GET",
  handler: httpAction(async (ctx, req) => {
    const url = new URL(req.url);
    const status = url.searchParams.get("status");

    const docs = status
      ? await ctx.runQuery(api.documents.listByStatus, {
          status: status as "draft" | "review" | "approved" | "scheduled" | "posted" | "archived",
        })
      : await ctx.runQuery(api.documents.listByStatus, {});

    return new Response(JSON.stringify(docs, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }),
});

// GET /api/documents/markdown — all docs as a single markdown context dump
// This is the "give my agent the full view" endpoint
http.route({
  path: "/api/documents/markdown",
  method: "GET",
  handler: httpAction(async (ctx) => {
    const docs = await ctx.runQuery(api.documents.listByStatus, {});

    const markdown = docs
      .map(
        (d) =>
          `## ${d.title}\n` +
          `**Status:** ${d.status} | **Platform:** ${d.platform ?? "none"} | **Author:** ${d.author}\n` +
          (d.tags?.length ? `**Tags:** ${d.tags.join(", ")}\n` : "") +
          `\n${d.body ?? "(no content)"}\n`
      )
      .join("\n---\n\n");

    const header = `# Conspire Documents\n_${docs.length} documents total_\n\n---\n\n`;

    return new Response(header + markdown, {
      status: 200,
      headers: {
        "Content-Type": "text/markdown",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }),
});

// POST /api/documents — create a new document
http.route({
  path: "/api/documents",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const body = await req.json();

    const docId = await ctx.runMutation(api.documents.create, {
      title: body.title ?? "Untitled",
      doc_type: body.doc_type ?? "social_post",
      platform: body.platform,
      author: body.author ?? "Agent",
      body: body.body,
      source: body.source,
      tags: body.tags,
    });

    return new Response(JSON.stringify({ id: docId }), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }),
});

// PATCH /api/documents — update a document (pass id in body)
http.route({
  path: "/api/documents/update",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const body = await req.json();

    if (!body.id) {
      return new Response(JSON.stringify({ error: "id required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    await ctx.runMutation(api.documents.update, {
      id: body.id,
      title: body.title,
      body: body.body,
      platform: body.platform,
      scheduled_date: body.scheduled_date,
      tags: body.tags,
      proof_slug: body.proof_slug,
      proof_token: body.proof_token,
      source: body.source,
      thumbnail_url: body.thumbnail_url,
      meta_description: body.meta_description,
      external_url: body.external_url,
      actor: body.actor ?? "Agent",
    });

    if (body.status) {
      await ctx.runMutation(api.documents.updateStatus, {
        id: body.id,
        status: body.status,
        actor: body.actor ?? "Agent",
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }),
});

// CORS preflight
http.route({
  path: "/api/documents",
  method: "OPTIONS",
  handler: httpAction(async () => {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }),
});

http.route({
  path: "/api/documents/update",
  method: "OPTIONS",
  handler: httpAction(async () => {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }),
});

http.route({
  path: "/api/documents/markdown",
  method: "OPTIONS",
  handler: httpAction(async () => {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }),
});

export default http;
