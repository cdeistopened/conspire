/**
 * Getlate (Zernio) API client — used by the RLM scheduling orchestrator.
 *
 * Env:
 *   GETLATE_API_KEY  — required. Format: sk_<64 hex>.
 *   GETLATE_API_URL  — optional. Default: https://getlate.dev/api/v1.
 *
 * The marketing brand is "Zernio" but the live API host is getlate.dev.
 * Docs: https://docs.zernio.com | https://docs.zernio.com/llms-full.txt
 *
 * Do NOT import this from browser code — the API key must stay server-side.
 * Import from Convex actions or Node scripts only.
 */

export type Platform =
  | "facebook"
  | "instagram"
  | "tiktok"
  | "youtube"
  | "linkedin"
  | "twitter"
  | "threads"
  | "pinterest"
  | "reddit"
  | "bluesky";

export type PostStatus = "draft" | "scheduled" | "published" | "failed";

export type Profile = {
  _id: string;
  name: string;
  userId: string;
  accountUsernames: string[];
};

export type Account = {
  _id: string;
  platform: Platform;
  profileId: { _id: string; name: string } | string;
  displayName: string;
  username: string;
  isActive: boolean;
  followersCount?: number;
  externalPostCount?: number;
  profileUrl?: string;
};

export type MediaItem =
  | { type: "image" | "video"; url: string }
  | { mediaId: string };

export type PlatformEntry = {
  platform: Platform;
  accountId: string;
  customContent?: string;
  platformSpecificData?: Record<string, unknown>;
  customMedia?: MediaItem[];
};

export type CreatePostInput = {
  content: string;
  platforms: PlatformEntry[];
  mediaItems?: MediaItem[];
  publishNow?: boolean;
  scheduledFor?: string; // ISO 8601
  timezone?: string;
};

export type PublishedPlatformResult = {
  platform: Platform;
  accountId: unknown;
  status: PostStatus;
  platformPostId?: string;
  platformPostUrl?: string;
  publishedAt?: string;
  scheduledFor?: string;
};

export type Post = {
  _id: string;
  content: string;
  status: PostStatus;
  platforms: PublishedPlatformResult[];
  scheduledFor?: string;
  createdAt: string;
  updatedAt: string;
};

export class GetlateError extends Error {
  status: number;
  body: unknown;
  constructor(status: number, body: unknown, message: string) {
    super(message);
    this.name = "GetlateError";
    this.status = status;
    this.body = body;
  }
}

export type GetlateConfig = {
  apiKey: string;
  apiUrl?: string;
};

export function createGetlateClient(config?: GetlateConfig) {
  const apiKey = config?.apiKey ?? process.env.GETLATE_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GETLATE_API_KEY is required (pass config.apiKey or set env var)",
    );
  }
  const apiUrl = (
    config?.apiUrl ?? process.env.GETLATE_API_URL ?? "https://getlate.dev/api/v1"
  ).replace(/\/$/, "");

  async function request<T>(
    method: string,
    path: string,
    body?: unknown,
  ): Promise<T> {
    const res = await fetch(`${apiUrl}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const text = await res.text();
    let parsed: unknown = null;
    try {
      parsed = text ? JSON.parse(text) : null;
    } catch {
      parsed = text;
    }
    if (!res.ok) {
      throw new GetlateError(
        res.status,
        parsed,
        `Getlate ${method} ${path} failed: ${res.status}`,
      );
    }
    return parsed as T;
  }

  return {
    // Profiles + accounts
    async listProfiles(): Promise<Profile[]> {
      const data = await request<{ profiles: Profile[] }>("GET", "/profiles");
      return data.profiles;
    },
    async listAccounts(profileId?: string): Promise<Account[]> {
      const qs = profileId
        ? `?profileId=${encodeURIComponent(profileId)}`
        : "";
      const data = await request<{ accounts: Account[] }>(
        "GET",
        `/accounts${qs}`,
      );
      return data.accounts;
    },

    // Posts
    async listPosts(filters?: {
      status?: PostStatus;
      profileId?: string;
    }): Promise<Post[]> {
      const params = new URLSearchParams();
      if (filters?.status) params.set("status", filters.status);
      if (filters?.profileId) params.set("profileId", filters.profileId);
      const qs = params.toString() ? `?${params}` : "";
      const data = await request<{ posts: Post[] }>("GET", `/posts${qs}`);
      return data.posts;
    },
    async getPost(id: string): Promise<Post> {
      const data = await request<{ post: Post }>("GET", `/posts/${id}`);
      return data.post;
    },
    async createPost(input: CreatePostInput): Promise<Post> {
      const data = await request<{ post: Post }>("POST", "/posts", input);
      return data.post;
    },
    async updatePost(
      id: string,
      input: Partial<CreatePostInput>,
    ): Promise<Post> {
      const data = await request<{ post: Post }>("PATCH", `/posts/${id}`, input);
      return data.post;
    },
    async deletePost(id: string): Promise<void> {
      await request("DELETE", `/posts/${id}`);
    },

    // Queue slots (per-profile recurring schedule)
    async getQueueSlots(profileId: string): Promise<{
      exists: boolean;
      schedule: unknown;
      nextSlots: unknown[];
    }> {
      return request("GET", `/queue/slots?profileId=${encodeURIComponent(profileId)}`);
    },

    // Escape hatch for endpoints we haven't typed yet
    raw: request,
  };
}

export type GetlateClient = ReturnType<typeof createGetlateClient>;
