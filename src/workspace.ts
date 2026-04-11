// Workspace config — picked at build time from VITE_WORKSPACE env var.
// Shared schema, shared mutations, shared Convex deployment (for now).
// Each Railway service sets VITE_WORKSPACE to "opened" | "rlm" | etc.
// When we add a new workspace, drop a JSON in workspaces/ and import it here.
import openedConfig from "../workspaces/opened.json";
import rlmConfig from "../workspaces/rlm.json";

export type DocType =
  | "social_post"
  | "short_form_video"
  | "blog_draft"
  | "podcast"
  | "newsletter"
  | "note";

export type PlatformKey =
  | "x"
  | "linkedin"
  | "instagram"
  | "facebook"
  | "tiktok"
  | "substack"
  | "webflow"
  | "beehiiv"
  | "youtube";

export interface WorkspaceConfig {
  name: string;
  displayName: string;
  tagline: string;
  defaultAuthor: string;
  docTypes: DocType[];
  platforms: PlatformKey[];
  scheduler: "manual" | "zernio";
}

const configs: Record<string, WorkspaceConfig> = {
  opened: openedConfig as WorkspaceConfig,
  rlm: rlmConfig as WorkspaceConfig,
};

// Workspace resolution:
//   1. URL query param `?workspace=rlm` wins (lets one Railway service view
//      multiple workspaces during factory setup, before each gets its own
//      service). Persisted to localStorage so a refresh keeps the same view.
//   2. Fall back to VITE_WORKSPACE build-time env var.
//   3. Default to "opened".
function resolveWorkspaceKey(): string {
  if (typeof window !== "undefined") {
    try {
      const params = new URLSearchParams(window.location.search);
      const fromUrl = params.get("workspace");
      if (fromUrl && configs[fromUrl]) {
        window.localStorage.setItem("conspire_workspace", fromUrl);
        return fromUrl;
      }
      const fromStorage = window.localStorage.getItem("conspire_workspace");
      if (fromStorage && configs[fromStorage]) return fromStorage;
    } catch {
      // ignore storage/URL access errors
    }
  }
  const envKey = (import.meta.env.VITE_WORKSPACE as string | undefined) || "opened";
  return configs[envKey] ? envKey : "opened";
}

export const WORKSPACE: WorkspaceConfig = configs[resolveWorkspaceKey()];
